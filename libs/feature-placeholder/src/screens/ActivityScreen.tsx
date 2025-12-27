import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface ActivityScreenProps {
  onTransactionPress?: (txId: string) => void;
}

export function ActivityScreen({ onTransactionPress }: ActivityScreenProps) {
  return (
    <PlaceholderScreen
      title="Activity"
      description="Complete transaction history"
      sections={[
        'Date range filter',
        'Transaction type filter (All, Purchases, Deposits, Transfers)',
        'Search transactions',
        'Grouped by date sections',
        'Transaction list items with merchant, amount, status',
        'Pull to refresh',
        'Infinite scroll pagination',
      ]}
      actions={[
        {
          label: 'View Sample Transaction',
          onPress: () => onTransactionPress?.('tx-mock-002'),
        },
      ]}
    />
  );
}
