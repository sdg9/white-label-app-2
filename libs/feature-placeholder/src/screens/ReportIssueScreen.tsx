import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface ReportIssueScreenProps {
  txId?: string;
  onBack?: () => void;
}

export function ReportIssueScreen({ txId, onBack }: ReportIssueScreenProps) {
  return (
    <PlaceholderScreen
      title="Report Issue"
      description={txId ? `Report issue for transaction: ${txId}` : 'Report an issue with your card or transaction'}
      sections={[
        'Issue type selection',
        'Unauthorized transaction',
        'Incorrect amount',
        'Duplicate charge',
        'Merchant dispute',
        'Card not working',
        'Description text field',
        'Attach supporting documents',
        'Submit report button',
      ]}
      actions={
        onBack
          ? [{ label: 'Cancel', onPress: onBack }]
          : []
      }
    />
  );
}
