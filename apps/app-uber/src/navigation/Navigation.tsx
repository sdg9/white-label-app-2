import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
} from '@wla/feature-placeholder';

// Auth hooks
import { useIsAuthenticated, useIsGuest, useAuth } from '../context/AuthContext';

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN WRAPPERS (connect placeholder screens to navigation)
// ═══════════════════════════════════════════════════════════════════════════════

function LoginScreenWrapper() {
  const { signIn } = useAuth();
  return <LoginScreen onLogin={signIn} />;
}

function WalletScreenWrapper() {
  const navigation = useNavigation<any>();
  return (
    <WalletScreen
      onTransactionPress={(txId) =>
        navigation.navigate('TransactionDetail', { txId })
      }
      onGasMapPress={() => navigation.navigate('GasMap')}
      onATMPress={() => navigation.navigate('ATMLocator')}
    />
  );
}

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

function CardScreenWrapper() {
  return (
    <CardScreen
      onCardControlsPress={() => {
        console.log('Card controls pressed');
      }}
    />
  );
}

function SettingsScreenWrapper() {
  const { signOut } = useAuth();
  return <SettingsScreen onLogout={signOut} />;
}

function TransactionDetailWrapper() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  return (
    <TransactionDetailScreen
      txId={route.params?.txId ?? 'unknown'}
      onBack={() => navigation.goBack()}
    />
  );
}

function GasMapWrapper() {
  const navigation = useNavigation<any>();
  return <GasMapScreen onClose={() => navigation.goBack()} />;
}

function ATMLocatorWrapper() {
  const navigation = useNavigation<any>();
  return <ATMLocatorScreen onClose={() => navigation.goBack()} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB ICON HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

// SF Symbols for iOS, Android drawable resources for Android
const createTabIcon = (
  sfSymbol: string,
  sfSymbolFilled: string,
  androidDrawable: string
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
  activity: createTabIcon('list.bullet.rectangle', 'list.bullet.rectangle.fill', 'ic_list'),
  card: createTabIcon('creditcard', 'creditcard.fill', 'ic_card'),
  settings: createTabIcon('gearshape', 'gearshape.fill', 'ic_settings'),
};

// ═══════════════════════════════════════════════════════════════════════════════
// WALLET TAB STACK
// ═══════════════════════════════════════════════════════════════════════════════

const WalletStack = createNativeStackNavigator({
  screens: {
    Wallet: {
      screen: WalletScreenWrapper,
      options: {
        headerShown: false,
      },
      linking: 'wallet',
    },
    TransactionDetail: {
      screen: TransactionDetailWrapper,
      options: {
        title: 'Transaction',
      },
      linking: 'wallet/transaction/:txId',
    },
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVITY TAB STACK
// ═══════════════════════════════════════════════════════════════════════════════

const ActivityStack = createNativeStackNavigator({
  screens: {
    Activity: {
      screen: ActivityScreenWrapper,
      options: {
        headerShown: false,
      },
      linking: 'activity',
    },
    TransactionDetail: {
      screen: TransactionDetailWrapper,
      options: {
        title: 'Transaction',
      },
      linking: 'activity/transaction/:txId',
    },
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// CARD TAB STACK
// ═══════════════════════════════════════════════════════════════════════════════

const CardStack = createNativeStackNavigator({
  screens: {
    Card: {
      screen: CardScreenWrapper,
      options: {
        headerShown: false,
      },
      linking: 'card',
    },
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS TAB STACK
// ═══════════════════════════════════════════════════════════════════════════════

const SettingsStack = createNativeStackNavigator({
  screens: {
    Settings: {
      screen: SettingsScreenWrapper,
      options: {
        headerShown: false,
      },
      linking: 'settings',
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
      options: {
        headerShown: false,
      },
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
          screen: GasMapWrapper,
          options: {
            presentation: 'modal',
            headerShown: true,
            title: 'Gas Stations',
          },
          linking: 'gas-map',
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
