import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface LinkedBankAccountsScreenProps {
  onAddAccount?: () => void;
  onBack?: () => void;
}

export function LinkedBankAccountsScreen({ onAddAccount, onBack }: LinkedBankAccountsScreenProps) {
  return (
    <PlaceholderScreen
      title="Linked Accounts"
      description="Manage your linked bank accounts"
      sections={[
        'List of linked bank accounts',
        'Account nickname',
        'Bank name and logo',
        'Account type (checking/savings)',
        'Last 4 digits of account',
        'Primary account indicator',
        'Remove account option',
        'Add new account button',
      ]}
      actions={[
        ...(onAddAccount ? [{ label: 'Add Bank Account', onPress: onAddAccount }] : []),
        ...(onBack ? [{ label: 'Go Back', onPress: onBack }] : []),
      ]}
    />
  );
}
