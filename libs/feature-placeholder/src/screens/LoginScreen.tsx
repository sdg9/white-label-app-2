import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <PlaceholderScreen
      title="Login"
      description="Authentication screen for Uber Pro Card app"
      sections={[
        'Email/Phone input field',
        'Password input field',
        'Login button',
        'Forgot password link',
        'Create account link',
        'Biometric authentication option',
      ]}
      actions={[
        {
          label: 'Sign In (Mock)',
          onPress: onLogin,
        },
      ]}
    />
  );
}
