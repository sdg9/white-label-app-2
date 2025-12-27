import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface TransactionDetailScreenProps {
  txId: string;
  onBack?: () => void;
  onReportIssue?: () => void;
}

export function TransactionDetailScreen({
  txId,
  onBack,
  onReportIssue,
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
      actions={[
        ...(onReportIssue ? [{ label: 'Report Issue', onPress: onReportIssue }] : []),
        ...(onBack ? [{ label: 'Go Back', onPress: onBack }] : []),
      ]}
    />
  );
}
