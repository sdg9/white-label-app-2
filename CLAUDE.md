# Project Guidelines

## Reference Codebase

The v1 application is located at `/Users/steven/dev/marqeta/white-label-app-nx` and can be referenced for code snippets and patterns.

**Important:** This v2 aims for a simpler architecture. Do not blindly copy complex code from v1. Always evaluate if there's a simpler approach before adapting existing patterns.

## Development Principles

- Prefer simplicity over flexibility
- Question complexity inherited from v1
- Only add abstractions when clearly needed

## Build & Deployment (NO EAS)

**IMPORTANT:** This project does NOT use EAS Build, EAS Update, or any Expo Application Services.

| What             | How                                          |
| ---------------- | -------------------------------------------- |
| **Local builds** | `expo prebuild` → `xcodebuild`/`gradlew`     |
| **CI builds**    | GitHub Actions (self-hosted runners for iOS) |
| **Distribution** | Firebase App Distribution                    |

**Why:** Security requirements mandate builds run in our own CI infrastructure, not Expo's cloud.

**DO NOT:**

- Add `eas build` or `eas update` commands
- Configure `EAS_PROJECT_ID` in app.config.ts
- Install `eas-cli` as a dependency
- Reference EAS services in documentation

## Git Safety (CRITICAL)

**BEFORE running ANY of these commands, check for uncommitted changes:**

- `git rebase` (any form, including --abort)
- `git reset --hard`
- `git checkout <branch>` (when switching branches)
- `git clean`
- `git stash drop/clear`
- `git branch -D/-d`

**Required workflow:**

1. Run `git status` to check for uncommitted changes
2. If changes exist, ASK the user: "You have uncommitted changes. Should I commit them or stash them first?"
3. Only proceed with the destructive command after changes are saved

**Why:** Uncommitted work cannot be recovered after these operations. Always preserve work first.

## Navigation

When creating new stack navigators, use `headerBackButtonDisplayMode: 'minimal'` in screenOptions to show only the back arrow (no title text):

```tsx
const MyStack = createNativeStackNavigator({
  screenOptions: defaultStackScreenOptions, // defined in Navigation.tsx
  screens: { ... }
});
```

## Import Conventions

### NO file extensions (Metro resolves automatically)

```typescript
// ✅ Correct
import { Button } from './components/Button';
import { useAppConfig } from '@wla/platform-config';

// ❌ Wrong - causes Metro errors
import { Button } from './components/Button.js';
```

## Dependency Layers

```
platform-* → scope:platform → no deps on domain/feature
domain-*   → scope:domain   → can depend on platform
feature-*  → scope:feature  → can depend on platform, domain
app-core   → scope:app      → can depend on everything
apps/*     → scope:app      → use app-core, inject partner config
```

## Nx + Metro Configuration

Metro bundles from TypeScript source directly - NO compilation to `dist/`. Nx manages dependency graph, not TS project references.

**DO NOT add to libraries:**

- TypeScript project references or `composite: true`
- `@nx/js:tsc` build targets
- `module`/`moduleResolution` overrides in tsconfig
- `main`/`types` pointing to `dist/` in package.json

**Correct package.json:**

```json
{
  "name": "@wla/my-lib",
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": {
      "@wla/source": "./src/index.ts",
      "default": "./src/index.ts"
    }
  }
}
```

## React Native Unistyles (Styling)

Use `react-native-unistyles` v3. Critical patterns:

```typescript
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

// ✅ Define at module level
const styles = StyleSheet.create((theme) => ({
  container: { backgroundColor: theme.colors.background },
}));

function MyComponent() {
  const { theme } = useUnistyles(); // Only theme, NO parameters!
  return <View style={styles.container} />; // Use styles directly
}

// ❌ Wrong - causes "Cannot read property of undefined"
const { styles } = useUnistyles(myStyles); // styles will be undefined!
```

## Design Tokens

All visual properties use tokens, not raw numbers:

| Category       | Example                                                        |
| -------------- | -------------------------------------------------------------- |
| `colors`       | `theme.colors.primary`, `theme.colors.surface`                 |
| `spacing`      | `theme.spacing.md` (4pt grid: xs=4, sm=8, md=16, lg=24, xl=32) |
| `typography`   | `theme.typography.body.fontSize`                               |
| `borderRadius` | `theme.borderRadius.md` (sm=4, md=8, lg=16)                    |
| `sizes`        | `theme.sizes.touchTarget` (44), `theme.sizes.iconMd` (24)      |
| `shadows`      | `...theme.shadows.md` (spread in styles)                       |
| `opacity`      | `theme.opacity.disabled` (0.38)                                |
| `borderWidth`  | `theme.borderWidth.thin` (1)                                   |

```typescript
// ✅ Correct
const styles = StyleSheet.create((theme) => ({
  container: { padding: theme.spacing.md, borderRadius: theme.borderRadius.lg },
}));

// ❌ Wrong - raw numbers
const styles = StyleSheet.create((theme) => ({
  container: { padding: 16, borderRadius: 8 },
}));
```

## Feature-Encapsulated Translations (i18n)

Features own their translations. Namespace by feature: `common.*` (platform), `auth.*`, `dashboard.*`, `activity.*`, etc.

**Merge order:** Platform base → Feature translations → Partner overrides (highest priority)

## Accessibility

Interactive elements MUST have accessibility props:

```typescript
<Pressable
  onPress={handlePress}
  accessibilityRole="button"
  accessibilityLabel={t('dashboard.balance.toggleVisibility')}
  accessibilityState={{ disabled: isDisabled }}
/>
```

Icon-only buttons need explicit labels.
