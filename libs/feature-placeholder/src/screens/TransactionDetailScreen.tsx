import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface TransactionDetailScreenProps {
  txId: string;
  onBack?: () => void;
}

export function TransactionDetailScreen({
  txId,
  onBack,
}: TransactionDetailScreenProps) {
  return (
    <PlaceholderScreen
      title="Transaction Detail"
      description={`Viewing transaction: ${txId}`}
      sections={[
        'Merchant name and logo',
        'Transaction amount (large)',
        'Date and time',
        'Transaction status',
        'Payment method used',
        'Rewards earned',
        'Category',
        'Location (if available)',
        'Receipt image (if available)',
        'Report issue button',
      ]}
      actions={
        onBack
          ? [
              {
                label: 'Go Back',
                onPress: onBack,
              },
            ]
          : []
      }
    />
  );
}
