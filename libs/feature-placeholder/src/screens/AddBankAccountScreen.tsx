import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface AddBankAccountScreenProps {
  onBack?: () => void;
}

export function AddBankAccountScreen({ onBack }: AddBankAccountScreenProps) {
  return (
    <PlaceholderScreen
      title="Add Bank Account"
      description="Link a new bank account"
      sections={[
        'Search for your bank',
        'Popular banks list',
        'Plaid integration flow',
        'Manual account entry option',
        'Routing number input',
        'Account number input',
        'Account type selection',
        'Verify account ownership',
      ]}
      actions={
        onBack
          ? [{ label: 'Cancel', onPress: onBack }]
          : []
      }
    />
  );
}
