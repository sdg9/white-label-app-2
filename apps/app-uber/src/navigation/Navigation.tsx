import React, { useState, useEffect } from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
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
import {
  useIsAuthenticated,
  useIsGuest,
  useAuth,
} from '../context/AuthContext';

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTER SCREEN FACTORY
// ═══════════════════════════════════════════════════════════════════════════════

function createRouterScreen<TParams extends object>(
  useDecision: (params: TParams) => {
    isLoading: boolean;
    destination: string;
    destinationParams?: object;
  },
) {
  const Screen = function RouterScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { isLoading, destination, destinationParams } = useDecision(
      route.params ?? {},
    );

    useEffect(() => {
      if (!isLoading && destination) {
        navigation.replace(destination, destinationParams);
      }
    }, [isLoading, destination, destinationParams, navigation]);

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  };

  // Attach recommended options as a static property
  Screen.screenOptions = {
    presentation: 'transparentModal' as const,
    headerShown: false,
    animation: 'none' as const,
  };

  return Screen;
}

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

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSACTION DETAIL ROUTER (async decision -> A or B)
// ═══════════════════════════════════════════════════════════════════════════════

function useTransactionDetailDecision(params: { txId: string }) {
  const [state, setState] = useState({
    isLoading: true,
    destination: '',
    destinationParams: {} as object,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const destination =
        Math.random() > 0.5 ? 'TransactionDetailA' : 'TransactionDetailB';
      setState({
        isLoading: false,
        destination,
        destinationParams: { txId: params.txId },
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [params.txId]);

  return state;
}

const TransactionDetailRouter = createRouterScreen(useTransactionDetailDecision);

function TransactionDetailAWrapper() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  return (
    <TransactionDetailScreen
      txId={route.params?.txId ?? 'unknown'}
      onBack={() => navigation.goBack()}
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
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GAS MAP ROUTER (async decision -> A or B)
// ═══════════════════════════════════════════════════════════════════════════════

function useGasMapDecision() {
  const [state, setState] = useState({ isLoading: true, destination: '' });

  useEffect(() => {
    const timer = setTimeout(() => {
      const destination = Math.random() > 0.5 ? 'GasMapA' : 'GasMapB';
      setState({ isLoading: false, destination });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return state;
}

const GasMapRouter = createRouterScreen(useGasMapDecision);

function GasMapAWrapper() {
  const navigation = useNavigation<any>();
  return <GasMapScreen onClose={() => navigation.goBack()} />;
}

function GasMapBWrapper() {
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
  screens: {
    Wallet: {
      screen: WalletScreenWrapper,
      options: {
        headerShown: false,
      },
      linking: 'wallet',
    },
    TransactionDetail: {
      screen: TransactionDetailRouter,
      options: TransactionDetailRouter.screenOptions,
      linking: 'wallet/transaction/:txId',
    },
    TransactionDetailA: {
      screen: TransactionDetailAWrapper,
      options: {
        title: 'Transaction A',
      },
    },
    TransactionDetailB: {
      screen: TransactionDetailBWrapper,
      options: {
        title: 'Transaction B',
      },
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
