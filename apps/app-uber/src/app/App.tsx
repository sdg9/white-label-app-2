import React, { useRef, useEffect, useCallback } from 'react';
import { StatusBar } from 'react-native';
import type { NavigationContainerRef } from '@react-navigation/native';
import {
  DeepLinkProvider,
  useDeepLink,
  useLinkingConfig,
} from '@wla/platform-navigation';
import { AuthProvider, useIsAuthenticated } from '../context/AuthContext';
import { Navigation, RootStackParamList } from '../navigation/Navigation';

const PREFIXES = ['appuber://', 'https://app.uber.com'];

// Parse deep link URL to navigation params
function parseDeepLinkUrl(url: string): { screen: string; params?: object } | null {
  try {
    // Remove prefix
    let path = url;
    for (const prefix of PREFIXES) {
      if (url.startsWith(prefix)) {
        path = url.slice(prefix.length);
        break;
      }
    }

    // Remove leading slash if present
    path = path.replace(/^\//, '');

    // Parse path segments
    const segments = path.split('/').filter(Boolean);

    if (segments.length === 0) {
      return null;
    }

    // Map paths to navigation structure
    switch (segments[0]) {
      case 'card':
        return { screen: 'Main', params: { screen: 'CardTab' } };
      case 'wallet':
        if (segments[1] === 'transaction' && segments[2]) {
          return {
            screen: 'Main',
            params: {
              screen: 'WalletTab',
              params: { screen: 'TransactionDetail', params: { txId: segments[2] } },
            },
          };
        }
        return { screen: 'Main', params: { screen: 'WalletTab' } };
      case 'activity':
        if (segments[1] === 'transaction' && segments[2]) {
          return {
            screen: 'Main',
            params: {
              screen: 'ActivityTab',
              params: { screen: 'TransactionDetail', params: { txId: segments[2] } },
            },
          };
        }
        return { screen: 'Main', params: { screen: 'ActivityTab' } };
      case 'settings':
        return { screen: 'Main', params: { screen: 'SettingsTab' } };
      case 'gas-map':
        return { screen: 'GasMap' };
      case 'atm':
        return { screen: 'ATMLocator' };
      default:
        return null;
    }
  } catch (e) {
    console.error('[DeepLink] Error parsing URL:', e);
    return null;
  }
}

function NavigationWithDeepLinks() {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const linkingConfig = useLinkingConfig();
  const { pendingUrl, consumePendingUrl } = useDeepLink();
  const isAuthenticated = useIsAuthenticated();

  // Store pending navigation URL to execute when nav state updates
  const pendingNavigationRef = useRef<string | null>(null);

  // When user becomes authenticated with a pending URL, queue it for navigation
  useEffect(() => {
    if (isAuthenticated && pendingUrl) {
      const url = consumePendingUrl();
      if (url) {
        console.log('[DeepLink] User authenticated with pending URL, queuing:', url);
        pendingNavigationRef.current = url;
      }
    }
  }, [isAuthenticated, pendingUrl, consumePendingUrl]);

  // Execute pending navigation when nav state changes to include authenticated screens
  const handleStateChange = useCallback(() => {
    if (!pendingNavigationRef.current || !navigationRef.current?.isReady()) {
      return;
    }

    // Check if authenticated screens are now available (Main route exists)
    const state = navigationRef.current.getRootState();
    const hasAuthenticatedScreens = state?.routes?.some((r) => r.name === 'Main');

    if (!hasAuthenticatedScreens) {
      return;
    }

    const url = pendingNavigationRef.current;
    pendingNavigationRef.current = null;

    const navParams = parseDeepLinkUrl(url);
    console.log('[DeepLink] Navigation state ready, navigating to:', navParams);

    if (navParams) {
      navigationRef.current.navigate(navParams.screen as any, navParams.params);
    }
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Navigation
        ref={navigationRef}
        linking={linkingConfig}
        onStateChange={handleStateChange}
      />
    </>
  );
}

function AppContent() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <DeepLinkProvider isAuthenticated={isAuthenticated} prefixes={PREFIXES}>
      <NavigationWithDeepLinks />
    </DeepLinkProvider>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
