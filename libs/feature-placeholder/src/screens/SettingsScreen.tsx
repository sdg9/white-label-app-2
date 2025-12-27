import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface SettingsScreenProps {
  onLogout: () => void;
  onProfilePress?: () => void;
  onNotificationsPress?: () => void;
  onSecurityPress?: () => void;
  onLinkedAccountsPress?: () => void;
  onHelpPress?: () => void;
  onLegalPress?: () => void;
}

export function SettingsScreen({
  onLogout,
  onProfilePress,
  onNotificationsPress,
  onSecurityPress,
  onLinkedAccountsPress,
  onHelpPress,
  onLegalPress,
}: SettingsScreenProps) {
  return (
    <PlaceholderScreen
      title="Settings"
      description="Account settings and preferences"
      sections={[
        'Profile section (name, email, phone)',
        'Notification preferences',
        'Security settings',
        'Linked bank accounts',
        'Help & Support',
        'Legal (Terms, Privacy)',
        'App version',
        'Sign out button',
      ]}
      actions={[
        ...(onProfilePress ? [{ label: 'Profile', onPress: onProfilePress }] : []),
        ...(onNotificationsPress ? [{ label: 'Notifications', onPress: onNotificationsPress }] : []),
        ...(onSecurityPress ? [{ label: 'Security', onPress: onSecurityPress }] : []),
        ...(onLinkedAccountsPress ? [{ label: 'Linked Accounts', onPress: onLinkedAccountsPress }] : []),
        ...(onHelpPress ? [{ label: 'Help & Support', onPress: onHelpPress }] : []),
        ...(onLegalPress ? [{ label: 'Legal', onPress: onLegalPress }] : []),
        { label: 'Sign Out', onPress: onLogout },
      ]}
    />
  );
}
