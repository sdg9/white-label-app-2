import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface WalletScreenProps {
  onTransactionPress?: (txId: string) => void;
  onGasMapPress?: () => void;
  onATMPress?: () => void;
  onAddFundsPress?: () => void;
  onTransferPress?: () => void;
  onRewardsPress?: () => void;
  onDirectDepositPress?: () => void;
}

export function WalletScreen({
  onTransactionPress,
  onGasMapPress,
  onATMPress,
  onAddFundsPress,
  onTransferPress,
  onRewardsPress,
  onDirectDepositPress,
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
        ...(onAddFundsPress ? [{ label: 'Add Funds', onPress: onAddFundsPress }] : []),
        ...(onTransferPress ? [{ label: 'Transfer', onPress: onTransferPress }] : []),
        ...(onRewardsPress ? [{ label: 'Rewards', onPress: onRewardsPress }] : []),
        ...(onDirectDepositPress ? [{ label: 'Direct Deposit', onPress: onDirectDepositPress }] : []),
        {
          label: 'View Transaction',
          onPress: () => onTransactionPress?.('tx-mock-001'),
        },
        ...(onGasMapPress ? [{ label: 'Gas Map', onPress: onGasMapPress }] : []),
        ...(onATMPress ? [{ label: 'Find ATM', onPress: onATMPress }] : []),
      ]}
    />
  );
}
