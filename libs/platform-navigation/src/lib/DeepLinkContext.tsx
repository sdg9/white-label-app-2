/**
 * DeepLinkContext - Deep Link Persistence Behind Authentication
 *
 * This context solves the problem of deep links arriving while the user is logged out.
 * Instead of losing the intended destination, URLs are stored and replayed after login.
 *
 * Note: React Navigation has UNSTABLE_routeNamesChangeBehavior: 'lastUnhandled' which
 * is supposed to handle this automatically, but it doesn't work with the static API
 * + groups pattern (createStaticNavigation with conditional `if:` groups).
 *
 * ## Problem
 * When a user clicks a deep link (e.g., from a push notification) while logged out:
 * 1. The app opens to the Login screen (correct behavior)
 * 2. React Navigation tries to navigate to the deep link target
 * 3. Navigation fails because authenticated screens don't exist yet
 * 4. User logs in but lands on the default screen, losing their intended destination
 *
 * ## Solution
 * This context intercepts deep links at the React Navigation linking config level:
 * 1. Custom `getInitialURL` - Intercepts cold-start deep links
 * 2. Custom `subscribe` - Intercepts runtime deep links
 * 3. When unauthenticated: stores the URL and returns null (prevents RN from handling)
 * 4. When authenticated: passes URLs through normally
 * 5. After login: the stored URL is replayed via manual navigation
 *
 * ## Usage
 * ```tsx
 * // In App.tsx
 * <DeepLinkProvider isAuthenticated={isAuthenticated} prefixes={['myapp://']}>
 *   <Navigation linking={useLinkingConfig()} />
 * </DeepLinkProvider>
 *
 * // Replay logic in a component that has access to navigation ref
 * useEffect(() => {
 *   if (justAuthenticated && pendingUrl) {
 *     const url = consumePendingUrl();
 *     navigationRef.current.navigate(parseUrl(url));
 *   }
 * }, [isAuthenticated]);
 * ```
 *
 * ## Exports
 * - `DeepLinkProvider` - Context provider, wraps app
 * - `useDeepLink` - Full context access
 * - `usePendingDeepLink` - Just the pending URL
 * - `useLinkingConfig` - Linking config for React Navigation
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { Linking } from 'react-native';

interface DeepLinkLinkingConfig {
  prefixes: string[];
  getInitialURL: () => Promise<string | null>;
  subscribe: (listener: (url: string) => void) => () => void;
}

interface DeepLinkContextValue {
  pendingUrl: string | null;
  setPendingUrl: (url: string | null) => void;
  consumePendingUrl: () => string | null;
  linkingConfig: DeepLinkLinkingConfig;
}

const DeepLinkContext = createContext<DeepLinkContextValue | null>(null);

export interface DeepLinkProviderProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  prefixes: string[];
}

export function DeepLinkProvider({
  children,
  isAuthenticated,
  prefixes,
}: DeepLinkProviderProps) {
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const isAuthenticatedRef = useRef(isAuthenticated);
  const pendingUrlRef = useRef<string | null>(null);
  // Track URLs that have been handled to prevent re-processing
  const handledUrlsRef = useRef<Set<string>>(new Set());

  // Keep refs in sync
  isAuthenticatedRef.current = isAuthenticated;
  pendingUrlRef.current = pendingUrl;

  // Consume and clear the pending URL - stable reference using ref
  // Also marks the URL as handled to prevent re-processing on subsequent logins
  const consumePendingUrl = useCallback(() => {
    const url = pendingUrlRef.current;
    if (url) {
      handledUrlsRef.current.add(url);
    }
    setPendingUrl(null);
    pendingUrlRef.current = null;
    return url;
  }, []);

  // Create linking config with custom URL handling
  const linkingConfig = useMemo(() => ({
    prefixes,

    // Custom getInitialURL - intercept when not authenticated
    async getInitialURL() {
      const url = await Linking.getInitialURL();

      if (url) {
        console.log('[DeepLink] Initial URL:', url);

        // Skip if already handled (prevents re-processing on subsequent logins)
        if (handledUrlsRef.current.has(url)) {
          console.log('[DeepLink] URL already handled, skipping');
          return null;
        }

        if (!isAuthenticatedRef.current) {
          console.log('[DeepLink] User not authenticated, storing URL for later');
          setPendingUrl(url);
          pendingUrlRef.current = url;
          // Return null to prevent React Navigation from handling it
          return null;
        }

        console.log('[DeepLink] User authenticated, allowing navigation');
      }

      return url;
    },

    // Custom subscribe - intercept URLs when not authenticated
    // Note: Unlike getInitialURL, we don't check handledUrlsRef here because
    // runtime deep links (from notifications, other apps) are always new intentional clicks
    subscribe(listener: (url: string) => void) {
      const subscription = Linking.addEventListener('url', ({ url }) => {
        console.log('[DeepLink] Received URL:', url);

        if (!isAuthenticatedRef.current) {
          console.log('[DeepLink] User not authenticated, storing URL for later');
          setPendingUrl(url);
          pendingUrlRef.current = url;
          // Don't call listener - prevent React Navigation from handling it
          return;
        }

        console.log('[DeepLink] User authenticated, allowing navigation');
        listener(url);
      });

      return () => {
        subscription.remove();
      };
    },
  }), [prefixes]);

  return (
    <DeepLinkContext.Provider
      value={{ pendingUrl, setPendingUrl, consumePendingUrl, linkingConfig }}
    >
      {children}
    </DeepLinkContext.Provider>
  );
}

export function useDeepLink() {
  const context = useContext(DeepLinkContext);
  if (!context) {
    throw new Error('useDeepLink must be used within DeepLinkProvider');
  }
  return context;
}

export function usePendingDeepLink() {
  const { pendingUrl } = useDeepLink();
  return pendingUrl;
}

export function useLinkingConfig() {
  const { linkingConfig } = useDeepLink();
  return linkingConfig;
}
