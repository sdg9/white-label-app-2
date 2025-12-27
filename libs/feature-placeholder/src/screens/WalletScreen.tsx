import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface WalletScreenProps {
  onTransactionPress?: (txId: string) => void;
  onGasMapPress?: () => void;
  onATMPress?: () => void;
}

export function WalletScreen({
  onTransactionPress,
  onGasMapPress,
  onATMPress,
}: WalletScreenProps) {
  return (
    <PlaceholderScreen
      title="Wallet"
      description="Your Uber Pro Card balance and recent activity"
      sections={[
        'Current balance display',
        'Virtual card preview',
        'Quick actions (Add funds, Transfer)',
        'Recent transactions (last 5)',
        'Rewards summary',
        'Backup balance status',
      ]}
      actions={[
        {
          label: 'View Transaction Detail',
          onPress: () => onTransactionPress?.('tx-mock-001'),
        },
        {
          label: 'Open Gas Map',
          onPress: () => onGasMapPress?.(),
        },
        {
          label: 'Find ATM',
          onPress: () => onATMPress?.(),
        },
      ]}
    />
  );
}
