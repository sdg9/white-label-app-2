import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface RewardsScreenProps {
  onViewRewardDetails?: (rewardId: string) => void;
  onBack?: () => void;
}

export function RewardsScreen({ onViewRewardDetails, onBack }: RewardsScreenProps) {
  return (
    <PlaceholderScreen
      title="Rewards"
      description="Your Uber Pro Card rewards and benefits"
      sections={[
        'Total rewards earned',
        'Pending rewards',
        'Cashback summary',
        'Gas savings total',
        'Category bonuses',
        'Special offers',
        'Rewards history',
        'How to earn more section',
      ]}
      actions={[
        ...(onViewRewardDetails ? [{ label: 'View Reward Details', onPress: () => onViewRewardDetails('reward-001') }] : []),
        ...(onBack ? [{ label: 'Go Back', onPress: onBack }] : []),
      ]}
    />
  );
}
