import React, { useState, useEffect } from 'react';
import { Platform, View, ActivityIndicator, Alert } from 'react-native';
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
// ROUTER SCREEN FACTORIES
// ═══════════════════════════════════════════════════════════════════════════════

type RouterScreenOptions = {
  presentation: 'transparentModal';
  headerShown: false;
  animation: 'none';
};

type RouterScreenComponent = React.FC & {
  screenOptions: RouterScreenOptions;
};

const routerScreenOptions: RouterScreenOptions = {
  presentation: 'transparentModal',
  headerShown: false,
  animation: 'none',
};

/**
 * Creates a router screen from an async decision function.
 * This is the preferred approach for simple async routing decisions.
 *
 * @example
 * const CheckoutRouter = createRouterScreen(async ({ cartId }) => {
 *   const result = await api.checkEligibility(cartId);
 *   return {
 *     destination: result.approved ? 'CheckoutForm' : 'CheckoutBlocked',
 *     destinationParams: { cartId },
 *   };
 * });
 */
function createRouterScreen<TParams extends object>(
  decide: (params: TParams) => Promise<{
    destination: string;
    destinationParams?: object;
  }>,
): RouterScreenComponent {
  const Screen: RouterScreenComponent = function RouterScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      let cancelled = false;

      decide(route.params ?? {})
        .then(({ destination, destinationParams }) => {
          if (!cancelled) {
            navigation.replace(destination, destinationParams);
          }
        })
        .catch((err) => {
          if (!cancelled) {
            const message =
              err instanceof Error
                ? err.message
                : String(err) || 'Something went wrong';
            setError(message);
          }
        });

      return () => {
        cancelled = true;
      };
    }, [navigation, route.params]);

    if (error) {
      Alert.alert('Oops', error, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
      return null;
    }

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

  Screen.screenOptions = routerScreenOptions;
  return Screen;
}

/**
 * Creates a router screen from a React hook.
 * Use this when you need access to React context or complex state logic.
 *
 * @example
 * function useMyDecision(params: { id: string }) {
 *   const { user } = useAuth(); // Can use hooks!
 *   const [state, setState] = useState({ isLoading: true, destination: '' });
 *
 *   useEffect(() => {
 *     // Complex logic using hooks...
 *   }, [params.id, user.role]);
 *
 *   return state;
 * }
 *
 * const MyRouter = createRouterScreenFromHook(useMyDecision);
 */
function createRouterScreenFromHook<TParams extends object>(
  useDecision: (params: TParams) => {
    isLoading: boolean;
    destination?: string;
    destinationParams?: object;
    error?: string | Error;
  },
): RouterScreenComponent {
  const Screen: RouterScreenComponent = function RouterScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { isLoading, destination, destinationParams, error } = useDecision(
      route.params ?? {},
    );

    useEffect(() => {
      if (!isLoading) {
        if (error) {
          const message = typeof error === 'string' ? error : error.message;
          Alert.alert('Oops', message || 'Something went wrong', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        } else if (destination) {
          navigation.replace(destination, destinationParams);
        }
      }
    }, [isLoading, destination, destinationParams, error, navigation]);

    if (error) {
      return null;
    }

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

  Screen.screenOptions = routerScreenOptions;
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
// TRANSACTION DETAIL ROUTER (hook-based example)
// ═══════════════════════════════════════════════════════════════════════════════
// Use the hook-based approach when you need access to React context (auth, feature
// flags, etc.) or have complex state logic that benefits from React's hook system.

function useTransactionDetailDecision(params: { txId: string }) {
  // Example: You could use hooks here that aren't available in a plain async function
  // const { user } = useAuth();
  // const isNewDetailEnabled = useFeatureFlag('new-transaction-detail');

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
// GAS MAP ROUTER (promise-based example with custom error)
// ═══════════════════════════════════════════════════════════════════════════════

// Simulated API call
async function fetchGasMapType(): Promise<'A' | 'B'> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 20% chance of error for demo
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
