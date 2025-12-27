import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createStaticNavigation,
  StaticParamList,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

// Placeholder screens
import {
  LoginScreen,
  WalletScreen,
  ActivityScreen,
  CardScreen,
  SettingsScreen,
  TransactionDetailScreen,
  GasMapScreen,
  ATMLocatorScreen,
  // Wallet sub-screens
  AddFundsScreen,
  TransferScreen,
  RewardsScreen,
  DirectDepositScreen,
  // Card sub-screens
  CardControlsScreen,
  CardDetailsScreen,
  OrderPhysicalCardScreen,
  ReportIssueScreen,
  // Settings sub-screens
  ProfileScreen,
  NotificationPreferencesScreen,
  SecuritySettingsScreen,
  ChangePinScreen,
  LinkedBankAccountsScreen,
  AddBankAccountScreen,
  HelpSupportScreen,
  FAQScreen,
  ContactSupportScreen,
  LegalScreen,
  TermsScreen,
  PrivacyPolicyScreen,
} from '@wla/feature-placeholder';

// Auth hooks
import {
  useIsAuthenticated,
  useIsGuest,
  useAuth,
} from '../context/AuthContext';

// Router screen factories
import {
  createRouterScreen,
  createRouterScreenFromHook,
} from '@wla/platform-navigation';

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN WRAPPERS (connect placeholder screens to navigation)
// ═══════════════════════════════════════════════════════════════════════════════

function LoginScreenWrapper() {
  const { signIn } = useAuth();
  return <LoginScreen onLogin={signIn} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// WALLET SCREEN WRAPPERS
// ─────────────────────────────────────────────────────────────────────────────

function WalletScreenWrapper() {
  const navigation = useNavigation<any>();
  return (
    <WalletScreen
      onTransactionPress={(txId) =>
        navigation.navigate('TransactionDetail', { txId })
      }
      onGasMapPress={() => navigation.navigate('GasMap')}
      onATMPress={() => navigation.navigate('ATMLocator')}
      onAddFundsPress={() => navigation.navigate('AddFunds')}
      onTransferPress={() => navigation.navigate('Transfer')}
      onRewardsPress={() => navigation.navigate('Rewards')}
      onDirectDepositPress={() => navigation.navigate('DirectDeposit')}
    />
  );
}

function AddFundsWrapper() {
  const navigation = useNavigation<any>();
  return (
    <AddFundsScreen
      onSelectBankAccount={() => navigation.navigate('LinkedBankAccounts')}
      onBack={() => navigation.goBack()}
    />
  );
}

function TransferWrapper() {
  const navigation = useNavigation<any>();
  return (
    <TransferScreen
      onSelectDestination={() => navigation.navigate('LinkedBankAccounts')}
      onBack={() => navigation.goBack()}
    />
  );
}

function RewardsWrapper() {
  const navigation = useNavigation<any>();
  return (
    <RewardsScreen
      onViewRewardDetails={(rewardId) => console.log('View reward:', rewardId)}
      onBack={() => navigation.goBack()}
    />
  );
}

function DirectDepositWrapper() {
  const navigation = useNavigation<any>();
  return <DirectDepositScreen onBack={() => navigation.goBack()} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY SCREEN WRAPPERS
// ─────────────────────────────────────────────────────────────────────────────

function ActivityScreenWrapper() {
  const navigation = useNavigation<any>();
  return (
    <ActivityScreen
      onTransactionPress={(txId) =>
        navigation.navigate('TransactionDetail', { txId })
      }
    />
  );
}

function TransactionDetailWrapper() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  return (
    <TransactionDetailScreen
      txId={route.params?.txId ?? 'unknown'}
      onBack={() => navigation.goBack()}
      onReportIssue={() =>
        navigation.navigate('ReportIssue', { txId: route.params?.txId })
      }
    />
  );
}

function ReportIssueWrapper() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  return (
    <ReportIssueScreen
      txId={route.params?.txId}
      onBack={() => navigation.goBack()}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD SCREEN WRAPPERS
// ─────────────────────────────────────────────────────────────────────────────

function CardScreenWrapper() {
  const navigation = useNavigation<any>();
  return (
    <CardScreen
      onCardControlsPress={() => navigation.navigate('CardControls')}
      onCardDetailsPress={() => navigation.navigate('CardDetails')}
      onOrderPhysicalCardPress={() => navigation.navigate('OrderPhysicalCard')}
      onReportIssuePress={() => navigation.navigate('ReportIssue', {})}
    />
  );
}

function CardControlsWrapper() {
  const navigation = useNavigation<any>();
  return <CardControlsScreen onBack={() => navigation.goBack()} />;
}

function CardDetailsWrapper() {
  const navigation = useNavigation<any>();
  return <CardDetailsScreen onBack={() => navigation.goBack()} />;
}

function OrderPhysicalCardWrapper() {
  const navigation = useNavigation<any>();
  return (
    <OrderPhysicalCardScreen
      onConfirmAddress={() => console.log('Confirm address')}
      onBack={() => navigation.goBack()}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS SCREEN WRAPPERS
// ─────────────────────────────────────────────────────────────────────────────

function SettingsScreenWrapper() {
  const { signOut } = useAuth();
  const navigation = useNavigation<any>();
  return (
    <SettingsScreen
      onLogout={signOut}
      onProfilePress={() => navigation.navigate('Profile')}
      onNotificationsPress={() => navigation.navigate('NotificationPreferences')}
      onSecurityPress={() => navigation.navigate('SecuritySettings')}
      onLinkedAccountsPress={() => navigation.navigate('LinkedBankAccounts')}
      onHelpPress={() => navigation.navigate('HelpSupport')}
      onLegalPress={() => navigation.navigate('Legal')}
    />
  );
}

function ProfileWrapper() {
  const navigation = useNavigation<any>();
  return <ProfileScreen onBack={() => navigation.goBack()} />;
}

function NotificationPreferencesWrapper() {
  const navigation = useNavigation<any>();
  return <NotificationPreferencesScreen onBack={() => navigation.goBack()} />;
}

function SecuritySettingsWrapper() {
  const navigation = useNavigation<any>();
  return (
    <SecuritySettingsScreen
      onChangePin={() => navigation.navigate('ChangePin')}
      onBack={() => navigation.goBack()}
    />
  );
}

function ChangePinWrapper() {
  const navigation = useNavigation<any>();
  return <ChangePinScreen onBack={() => navigation.goBack()} />;
}

function LinkedBankAccountsWrapper() {
  const navigation = useNavigation<any>();
  return (
    <LinkedBankAccountsScreen
      onAddAccount={() => navigation.navigate('AddBankAccount')}
      onBack={() => navigation.goBack()}
    />
  );
}

function AddBankAccountWrapper() {
  const navigation = useNavigation<any>();
  return <AddBankAccountScreen onBack={() => navigation.goBack()} />;
}

function HelpSupportWrapper() {
  const navigation = useNavigation<any>();
  return (
    <HelpSupportScreen
      onFAQ={() => navigation.navigate('FAQ')}
      onContactSupport={() => navigation.navigate('ContactSupport')}
      onBack={() => navigation.goBack()}
    />
  );
}

function FAQWrapper() {
  const navigation = useNavigation<any>();
  return <FAQScreen onBack={() => navigation.goBack()} />;
}

function ContactSupportWrapper() {
  const navigation = useNavigation<any>();
  return <ContactSupportScreen onBack={() => navigation.goBack()} />;
}

function LegalWrapper() {
  const navigation = useNavigation<any>();
  return (
    <LegalScreen
      onTermsPress={() => navigation.navigate('Terms')}
      onPrivacyPress={() => navigation.navigate('PrivacyPolicy')}
      onBack={() => navigation.goBack()}
    />
  );
}

function TermsWrapper() {
  const navigation = useNavigation<any>();
  return <TermsScreen onBack={() => navigation.goBack()} />;
}

function PrivacyPolicyWrapper() {
  const navigation = useNavigation<any>();
  return <PrivacyPolicyScreen onBack={() => navigation.goBack()} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAP SCREEN WRAPPERS
// ─────────────────────────────────────────────────────────────────────────────

function GasMapWrapper() {
  const navigation = useNavigation<any>();
  return <GasMapScreen onClose={() => navigation.goBack()} />;
}

function ATMLocatorWrapper() {
  const navigation = useNavigation<any>();
  return <ATMLocatorScreen onClose={() => navigation.goBack()} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSACTION DETAIL ROUTER (hook-based example)
// ═══════════════════════════════════════════════════════════════════════════════

function useTransactionDetailDecision(params: { txId: string }) {
  const [state, setState] = useState({
    isLoading: true,
    destination: '',
    destinationParams: {} as object,
  });

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(() => {
      if (cancelled) return;

      const destination =
        Math.random() > 0.5 ? 'TransactionDetailA' : 'TransactionDetailB';
      setState({
        isLoading: false,
        destination,
        destinationParams: { txId: params.txId },
      });
    }, 1000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [params.txId]);

  return state;
}

const TransactionDetailRouter = createRouterScreenFromHook(
  useTransactionDetailDecision,
);

function TransactionDetailAWrapper() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  return (
    <TransactionDetailScreen
      txId={route.params?.txId ?? 'unknown'}
      onBack={() => navigation.goBack()}
      onReportIssue={() =>
        navigation.navigate('ReportIssue', { txId: route.params?.txId })
      }
    />
  );
}

function TransactionDetailBWrapper() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  return (
    <TransactionDetailScreen
      txId={route.params?.txId ?? 'unknown'}
      onBack={() => navigation.goBack()}
      onReportIssue={() =>
        navigation.navigate('ReportIssue', { txId: route.params?.txId })
      }
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GAS MAP ROUTER (promise-based example with custom error)
// ═══════════════════════════════════════════════════════════════════════════════

async function fetchGasMapType(): Promise<'A' | 'B'> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (Math.random() < 0.2) {
    throw new Error(
      'Unable to load gas stations. Please check your connection and try again.',
    );
  }

  return Math.random() > 0.5 ? 'A' : 'B';
}

const GasMapRouter = createRouterScreen(async () => {
  const type = await fetchGasMapType();
  return {
    destination: type === 'A' ? 'GasMapA' : 'GasMapB',
  };
});

function GasMapAWrapper() {
  const navigation = useNavigation<any>();
  return <GasMapScreen onClose={() => navigation.goBack()} />;
}

function GasMapBWrapper() {
  const navigation = useNavigation<any>();
  return <GasMapScreen onClose={() => navigation.goBack()} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT SCREEN OPTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const defaultStackScreenOptions: NativeStackNavigationOptions = {
  headerBackButtonDisplayMode: 'minimal',
};

// ═══════════════════════════════════════════════════════════════════════════════
// TAB ICON HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

const createTabIcon = (
  sfSymbol: string,
  sfSymbolFilled: string,
  androidDrawable: string,
) =>
  Platform.select({
    ios: ({ focused }: { focused: boolean }) => ({
      type: 'sfSymbol' as const,
      name: focused ? sfSymbolFilled : sfSymbol,
    }),
    default: {
      type: 'drawableResource' as const,
      name: androidDrawable,
    },
  });

const tabIcons = {
  wallet: createTabIcon('creditcard', 'creditcard.fill', 'ic_wallet'),
  activity: createTabIcon(
    'list.bullet.rectangle',
    'list.bullet.rectangle.fill',
    'ic_list',
  ),
  card: createTabIcon('creditcard', 'creditcard.fill', 'ic_card'),
  settings: createTabIcon('gearshape', 'gearshape.fill', 'ic_settings'),
};

// ═══════════════════════════════════════════════════════════════════════════════
// WALLET TAB STACK
// ═══════════════════════════════════════════════════════════════════════════════

const WalletStack = createNativeStackNavigator({
  screenOptions: defaultStackScreenOptions,
  screens: {
    Wallet: {
      screen: WalletScreenWrapper,
      options: { headerShown: false },
      linking: 'wallet',
    },
    TransactionDetail: {
      screen: TransactionDetailRouter,
      options: TransactionDetailRouter.screenOptions,
      linking: 'wallet/transaction/:txId',
    },
    TransactionDetailA: {
      screen: TransactionDetailAWrapper,
      options: { title: 'Transaction A' },
    },
    TransactionDetailB: {
      screen: TransactionDetailBWrapper,
      options: { title: 'Transaction B' },
    },
    AddFunds: {
      screen: AddFundsWrapper,
      options: { title: 'Add Funds' },
      linking: 'wallet/add-funds',
    },
    Transfer: {
      screen: TransferWrapper,
      options: { title: 'Transfer' },
      linking: 'wallet/transfer',
    },
    Rewards: {
      screen: RewardsWrapper,
      options: { title: 'Rewards' },
      linking: 'wallet/rewards',
    },
    DirectDeposit: {
      screen: DirectDepositWrapper,
      options: { title: 'Direct Deposit' },
      linking: 'wallet/direct-deposit',
    },
    ReportIssue: {
      screen: ReportIssueWrapper,
      options: { title: 'Report Issue' },
    },
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVITY TAB STACK
// ═══════════════════════════════════════════════════════════════════════════════

const ActivityStack = createNativeStackNavigator({
  screenOptions: defaultStackScreenOptions,
  screens: {
    Activity: {
      screen: ActivityScreenWrapper,
      options: { headerShown: false },
      linking: 'activity',
    },
    TransactionDetail: {
      screen: TransactionDetailWrapper,
      options: { title: 'Transaction' },
      linking: 'activity/transaction/:txId',
    },
    ReportIssue: {
      screen: ReportIssueWrapper,
      options: { title: 'Report Issue' },
    },
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// CARD TAB STACK
// ═══════════════════════════════════════════════════════════════════════════════

const CardStack = createNativeStackNavigator({
  screenOptions: defaultStackScreenOptions,
  screens: {
    Card: {
      screen: CardScreenWrapper,
      options: { headerShown: false },
      linking: 'card',
    },
    CardControls: {
      screen: CardControlsWrapper,
      options: { title: 'Card Controls' },
      linking: 'card/controls',
    },
    CardDetails: {
      screen: CardDetailsWrapper,
      options: { title: 'Card Details' },
      linking: 'card/details',
    },
    OrderPhysicalCard: {
      screen: OrderPhysicalCardWrapper,
      options: { title: 'Order Physical Card' },
      linking: 'card/order-physical',
    },
    ReportIssue: {
      screen: ReportIssueWrapper,
      options: { title: 'Report Issue' },
    },
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS TAB STACK
// ═══════════════════════════════════════════════════════════════════════════════

const SettingsStack = createNativeStackNavigator({
  screenOptions: defaultStackScreenOptions,
  screens: {
    Settings: {
      screen: SettingsScreenWrapper,
      options: { headerShown: false },
      linking: 'settings',
    },
    Profile: {
      screen: ProfileWrapper,
      options: { title: 'Profile' },
      linking: 'settings/profile',
    },
    NotificationPreferences: {
      screen: NotificationPreferencesWrapper,
      options: { title: 'Notifications' },
      linking: 'settings/notifications',
    },
    SecuritySettings: {
      screen: SecuritySettingsWrapper,
      options: { title: 'Security' },
      linking: 'settings/security',
    },
    ChangePin: {
      screen: ChangePinWrapper,
      options: { title: 'Change PIN' },
      linking: 'settings/security/change-pin',
    },
    LinkedBankAccounts: {
      screen: LinkedBankAccountsWrapper,
      options: { title: 'Linked Accounts' },
      linking: 'settings/linked-accounts',
    },
    AddBankAccount: {
      screen: AddBankAccountWrapper,
      options: { title: 'Add Bank Account' },
      linking: 'settings/linked-accounts/add',
    },
    HelpSupport: {
      screen: HelpSupportWrapper,
      options: { title: 'Help & Support' },
      linking: 'settings/help',
    },
    FAQ: {
      screen: FAQWrapper,
      options: { title: 'FAQ' },
      linking: 'settings/help/faq',
    },
    ContactSupport: {
      screen: ContactSupportWrapper,
      options: { title: 'Contact Support' },
      linking: 'settings/help/contact',
    },
    Legal: {
      screen: LegalWrapper,
      options: { title: 'Legal' },
      linking: 'settings/legal',
    },
    Terms: {
      screen: TermsWrapper,
      options: { title: 'Terms of Service' },
      linking: 'settings/legal/terms',
    },
    PrivacyPolicy: {
      screen: PrivacyPolicyWrapper,
      options: { title: 'Privacy Policy' },
      linking: 'settings/legal/privacy',
    },
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN TABS (Native Bottom Tabs - React Navigation v8)
// ═══════════════════════════════════════════════════════════════════════════════

const MainTabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
    tabBarActiveTintColor: '#000',
    tabBarInactiveTintColor: '#999',
  },
  screens: {
    WalletTab: {
      screen: WalletStack,
      options: {
        tabBarLabel: 'Wallet',
        tabBarIcon: tabIcons.wallet,
      },
    },
    ActivityTab: {
      screen: ActivityStack,
      options: {
        tabBarLabel: 'Activity',
        tabBarIcon: tabIcons.activity,
      },
    },
    CardTab: {
      screen: CardStack,
      options: {
        tabBarLabel: 'Card',
        tabBarIcon: tabIcons.card,
      },
    },
    SettingsTab: {
      screen: SettingsStack,
      options: {
        tabBarLabel: 'Settings',
        tabBarIcon: tabIcons.settings,
      },
    },
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH STACK (Guest screens)
// ═══════════════════════════════════════════════════════════════════════════════

const AuthStack = createNativeStackNavigator({
  screens: {
    Login: {
      screen: LoginScreenWrapper,
      options: { headerShown: false },
      linking: 'login',
    },
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT STACK (combines Auth + Main with conditional groups)
// ═══════════════════════════════════════════════════════════════════════════════

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  groups: {
    // Guest group - shown when NOT authenticated
    Guest: {
      if: useIsGuest,
      screens: {
        Auth: {
          screen: AuthStack,
        },
      },
    },
    // Authenticated group - shown when authenticated
    Authenticated: {
      if: useIsAuthenticated,
      screens: {
        Main: {
          screen: MainTabs,
        },
        // Root-level modals (accessible from any tab)
        GasMap: {
          screen: GasMapRouter,
          options: GasMapRouter.screenOptions,
          linking: 'gas-map',
        },
        GasMapA: {
          screen: GasMapAWrapper,
          options: {
            presentation: 'modal',
            headerShown: true,
            title: 'Gas Stations A',
          },
        },
        GasMapB: {
          screen: GasMapBWrapper,
          options: {
            presentation: 'modal',
            headerShown: true,
            title: 'Gas Stations B',
          },
        },
        ATMLocator: {
          screen: ATMLocatorWrapper,
          options: {
            presentation: 'modal',
            headerShown: true,
            title: 'ATM Locator',
          },
          linking: 'atm',
        },
      },
    },
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const Navigation = createStaticNavigation(RootStack);

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type RootStackParamList = StaticParamList<typeof RootStack>;
