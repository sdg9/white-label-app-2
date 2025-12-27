import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface CardScreenProps {
  onCardControlsPress?: () => void;
  onCardDetailsPress?: () => void;
  onOrderPhysicalCardPress?: () => void;
  onReportIssuePress?: () => void;
}

export function CardScreen({
  onCardControlsPress,
  onCardDetailsPress,
  onOrderPhysicalCardPress,
  onReportIssuePress,
}: CardScreenProps) {
  return (
    <PlaceholderScreen
      title="Card"
      description="Your virtual Uber Pro Card"
      sections={[
        'Full virtual card display',
        'Card number (tap to copy)',
        'Expiry date',
        'CVV (tap to reveal)',
        'Add to Apple/Google Wallet button',
        'Card freeze toggle',
        'Card controls section',
        'Order physical card option',
      ]}
      actions={[
        ...(onCardDetailsPress ? [{ label: 'View Card Details', onPress: onCardDetailsPress }] : []),
        ...(onCardControlsPress ? [{ label: 'Card Controls', onPress: onCardControlsPress }] : []),
        ...(onOrderPhysicalCardPress ? [{ label: 'Order Physical Card', onPress: onOrderPhysicalCardPress }] : []),
        ...(onReportIssuePress ? [{ label: 'Report Issue', onPress: onReportIssuePress }] : []),
      ]}
    />
  );
}
