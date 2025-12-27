/**
 * RouterScreen - Async Routing Decision Screens
 *
 * Factory functions for creating "router screens" that make async decisions
 * before navigating to the actual destination. Useful for:
 * - API calls to determine eligibility
 * - Feature flag checks
 * - Loading user preferences
 *
 * ## Problem
 * React Navigation's `navigate()` is synchronous. If you need async logic
 * to determine which screen to show, you'd typically do this in the calling
 * screen, which couples business logic to the wrong location.
 *
 * ## Solution
 * A router screen is a transparent overlay that:
 * 1. Appears instantly (no animation)
 * 2. Shows a loading spinner
 * 3. Runs your async decision logic
 * 4. Calls `replace()` to the actual destination
 *
 * ## Exports
 * - `createRouterScreen` - Promise-based factory for simple async decisions
 * - `createRouterScreenFromHook` - Hook-based factory for React context access
 * - `routerScreenOptions` - Default screen options for router screens
 */

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

/**
 * Screen options for router screens.
 * Makes the screen appear as a transparent overlay with no animation.
 */
export type RouterScreenOptions = {
  presentation: 'transparentModal';
  headerShown: false;
  animation: 'none';
};

/**
 * A router screen component with attached screenOptions.
 */
export type RouterScreenComponent = React.FC & {
  screenOptions: RouterScreenOptions;
};

/**
 * Default screen options for router screens.
 * Use these when registering a router screen in your navigator.
 */
export const routerScreenOptions: RouterScreenOptions = {
  presentation: 'transparentModal',
  headerShown: false,
  animation: 'none',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});

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
 *
 * // With custom error messages - throw an Error:
 * const GasMapRouter = createRouterScreen(async () => {
 *   const response = await api.getGasStations();
 *   if (!response.ok) {
 *     throw new Error('Unable to load gas stations. Please check your connection.');
 *   }
 *   return { destination: response.data.type === 'A' ? 'GasMapA' : 'GasMapB' };
 * });
 */
export function createRouterScreen<TParams extends object = object>(
  decide: (params: TParams) => Promise<{
    destination: string;
    destinationParams?: object;
  }>,
): RouterScreenComponent {
  const Screen: RouterScreenComponent = function RouterScreen() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const navigation = useNavigation() as any;
    const route = useRoute();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      let cancelled = false;

      decide((route.params ?? {}) as TParams)
        .then(({ destination, destinationParams }) => {
          if (!cancelled) {
            navigation.replace(destination, destinationParams);
          }
        })
        .catch((err: unknown) => {
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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  };

  Screen.screenOptions = routerScreenOptions;
  return Screen;
}

/**
 * Result type for hook-based router decisions.
 */
export type RouterDecisionResult = {
  isLoading: boolean;
  destination?: string;
  destinationParams?: object;
  error?: string | Error;
};

/**
 * Creates a router screen from a React hook.
 * Use this when you need access to React context or complex state logic.
 *
 * @example
 * function useCheckoutDecision(params: { cartId: string }) {
 *   const { user } = useAuth(); // Can use hooks!
 *   const isNewCheckoutEnabled = useFeatureFlag('new-checkout');
 *   const [state, setState] = useState({ isLoading: true, destination: '' });
 *
 *   useEffect(() => {
 *     let cancelled = false;
 *     async function decide() {
 *       const eligibility = await checkEligibility(params.cartId, user.id);
 *       if (cancelled) return;
 *       setState({
 *         isLoading: false,
 *         destination: eligibility.approved
 *           ? (isNewCheckoutEnabled ? 'CheckoutFormV2' : 'CheckoutForm')
 *           : 'CheckoutBlocked',
 *         destinationParams: { cartId: params.cartId },
 *       });
 *     }
 *     decide();
 *     return () => { cancelled = true; };
 *   }, [params.cartId, user.id, isNewCheckoutEnabled]);
 *
 *   return state;
 * }
 *
 * const CheckoutRouter = createRouterScreenFromHook(useCheckoutDecision);
 */
export function createRouterScreenFromHook<TParams extends object = object>(
  useDecision: (params: TParams) => RouterDecisionResult,
): RouterScreenComponent {
  const Screen: RouterScreenComponent = function RouterScreen() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const navigation = useNavigation() as any;
    const route = useRoute();
    const { isLoading, destination, destinationParams, error } = useDecision(
      (route.params ?? {}) as TParams,
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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  };

  Screen.screenOptions = routerScreenOptions;
  return Screen;
}
