// Platform navigation utilities
export {
  DeepLinkProvider,
  useDeepLink,
  usePendingDeepLink,
  useLinkingConfig,
} from './lib/DeepLinkContext';
export type { DeepLinkProviderProps } from './lib/DeepLinkContext';

export {
  createRouterScreen,
  createRouterScreenFromHook,
  routerScreenOptions,
} from './lib/RouterScreen';
export type {
  RouterScreenOptions,
  RouterScreenComponent,
  RouterDecisionResult,
} from './lib/RouterScreen';
