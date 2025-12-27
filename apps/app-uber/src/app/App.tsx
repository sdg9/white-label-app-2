import React, { useEffect } from 'react';
import { StatusBar, Linking } from 'react-native';
import {
  DeepLinkProvider,
  useDeepLink,
  useLinkingConfig,
} from '@wla/platform-navigation';
import { AuthProvider, useIsAuthenticated } from '../context/AuthContext';
import { Navigation } from '../navigation/Navigation';

const PREFIXES = ['appuber://', 'https://app.uber.com'];

function NavigationWithDeepLinks() {
  const linkingConfig = useLinkingConfig();
  const { pendingUrl, consumePendingUrl } = useDeepLink();
  const isAuthenticated = useIsAuthenticated();

  // Replay pending URL when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && pendingUrl) {
      const url = consumePendingUrl();
      if (url) {
        console.log('[DeepLink] Replaying URL:', url);
        // Let React Navigation handle parsing - screens exist now
        Linking.openURL(url);
      }
    }
  }, [isAuthenticated, pendingUrl, consumePendingUrl]);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Navigation linking={linkingConfig} />
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
