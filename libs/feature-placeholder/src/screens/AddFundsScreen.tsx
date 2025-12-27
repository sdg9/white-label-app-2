import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface AddFundsScreenProps {
  onSelectBankAccount?: () => void;
  onBack?: () => void;
}

export function AddFundsScreen({ onSelectBankAccount, onBack }: AddFundsScreenProps) {
  return (
    <PlaceholderScreen
      title="Add Funds"
      description="Add money to your Uber Pro Card"
      sections={[
        'Current balance display',
        'Amount input field',
        'Quick amount buttons ($25, $50, $100, $200)',
        'Select funding source',
        'Linked bank accounts list',
        'Add new bank account option',
        'Direct deposit information',
        'Estimated arrival time',
        'Add Funds button',
      ]}
      actions={[
        ...(onSelectBankAccount ? [{ label: 'Select Bank Account', onPress: onSelectBankAccount }] : []),
        ...(onBack ? [{ label: 'Cancel', onPress: onBack }] : []),
      ]}
    />
  );
}
