import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface OrderPhysicalCardScreenProps {
  onConfirmAddress?: () => void;
  onBack?: () => void;
}

export function OrderPhysicalCardScreen({ onConfirmAddress, onBack }: OrderPhysicalCardScreenProps) {
  return (
    <PlaceholderScreen
      title="Order Physical Card"
      description="Get a physical Uber Pro Card"
      sections={[
        'Card design preview',
        'Shipping address',
        'Edit address option',
        'Shipping speed selection',
        'Standard (5-7 days) - Free',
        'Expedited (2-3 days) - Fee',
        'Order summary',
        'Confirm order button',
      ]}
      actions={[
        ...(onConfirmAddress ? [{ label: 'Confirm Address', onPress: onConfirmAddress }] : []),
        ...(onBack ? [{ label: 'Cancel', onPress: onBack }] : []),
      ]}
    />
  );
}
