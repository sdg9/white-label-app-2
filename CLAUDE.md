# Project Guidelines

## Reference Codebase

The v1 application is located at `/Users/steven/dev/marqeta/white-label-app-nx` and can be referenced for code snippets and patterns.

**Important:** This v2 aims for a simpler architecture. Do not blindly copy complex code from v1. Always evaluate if there's a simpler approach before adapting existing patterns.

## Development Principles

- Prefer simplicity over flexibility
- Question complexity inherited from v1
- Only add abstractions when clearly needed

## Navigation

When creating new stack navigators, use `headerBackButtonDisplayMode: 'minimal'` in screenOptions to show only the back arrow (no title text):

```tsx
const MyStack = createNativeStackNavigator({
  screenOptions: defaultStackScreenOptions, // defined in Navigation.tsx
  screens: { ... }
});
```
