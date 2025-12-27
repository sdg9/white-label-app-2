import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface TransferScreenProps {
  onSelectDestination?: () => void;
  onBack?: () => void;
}

export function TransferScreen({ onSelectDestination, onBack }: TransferScreenProps) {
  return (
    <PlaceholderScreen
      title="Transfer"
      description="Transfer money from your card"
      sections={[
        'Available balance display',
        'Amount input field',
        'Transfer to selection',
        'Linked bank accounts',
        'Add new bank account',
        'Transfer speed options (instant vs standard)',
        'Fee information',
        'Estimated arrival time',
        'Transfer button',
      ]}
      actions={[
        ...(onSelectDestination ? [{ label: 'Select Destination', onPress: onSelectDestination }] : []),
        ...(onBack ? [{ label: 'Cancel', onPress: onBack }] : []),
      ]}
    />
  );
}
