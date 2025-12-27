import nx from "@nx/eslint-plugin";
import reactNativeA11y from "eslint-plugin-react-native-a11y";
import reactHooks from "eslint-plugin-react-hooks";

export default [
    ...nx.configs["flat/base"],
    ...nx.configs["flat/typescript"],
    ...nx.configs["flat/javascript"],
    {
        ignores: [
            "**/dist",
            "**/generated/*.generated.ts",
            // Generated .d.ts files are gitignored and regenerated during typecheck
            // No need to lint them - they're build artifacts
            "libs/**/src/**/*.d.ts",
            "!libs/**/src/**/globals.d.ts"
        ]
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.js",
            "**/*.jsx"
        ],
        rules: {
            "@nx/enforce-module-boundaries": [
                "error",
                {
                    // Disabled: This project uses Metro bundler, not TypeScript compilation
                    // Libraries are bundled from source, no build targets needed
                    enforceBuildableLibDependency: false,
                    allow: [
                        "^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$"
                    ],
                    depConstraints: [
                        {
                            sourceTag: "scope:app",
                            onlyDependOnLibsWithTags: [
                                "scope:app",
                                "scope:feature",
                                "scope:feature-composite",
                                "scope:domain",
                                "scope:platform",
                                "scope:devtools"
                            ]
                        },
                        {
                            sourceTag: "scope:feature",
                            onlyDependOnLibsWithTags: [
                                "scope:domain",
                                "scope:platform"
                            ]
                        },
                        {
                            sourceTag: "scope:feature-composite",
                            onlyDependOnLibsWithTags: [
                                "scope:feature",
                                "scope:domain",
                                "scope:platform"
                            ]
                        },
                        {
                            sourceTag: "scope:domain",
                            onlyDependOnLibsWithTags: [
                                "scope:domain",
                                "scope:platform",
                                "scope:testing"
                            ]
                        },
                        {
                            sourceTag: "scope:platform",
                            onlyDependOnLibsWithTags: ["scope:platform"]
                        },
                        {
                            // Tools (like mock-server) can import from any scope
                            // They are dev-only and not bundled into production apps
                            sourceTag: "scope:tools",
                            onlyDependOnLibsWithTags: [
                                "scope:domain",
                                "scope:platform",
                                "scope:testing"
                            ]
                        },
                        {
                            // DevTools plugins can import from any scope
                            // They need access to inspect registries, state, and navigation
                            sourceTag: "scope:devtools",
                            onlyDependOnLibsWithTags: [
                                "scope:devtools",
                                "scope:feature",
                                "scope:domain",
                                "scope:platform"
                            ]
                        }
                    ]
                }
            ]
        }
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.cts",
            "**/*.mts",
            "**/*.js",
            "**/*.jsx",
            "**/*.cjs",
            "**/*.mjs"
        ],
        // Override or add rules here
        rules: {}
    },
    // React Hooks Rules
    // Enforces the Rules of Hooks - prevents hooks in conditionals/loops and ensures consistent order
    // https://react.dev/reference/rules/rules-of-hooks
    {
        files: [
            "libs/**/*.tsx",
            "libs/**/*.ts",
            "apps/**/*.tsx",
            "apps/**/*.ts"
        ],
        plugins: {
            "react-hooks": reactHooks
        },
        rules: {
            // Error on hooks called conditionally or in loops - causes runtime crashes
            "react-hooks/rules-of-hooks": "error",
            // Warn on missing dependencies in useEffect/useCallback/useMemo
            "react-hooks/exhaustive-deps": "warn"
        }
    },
    // React Native Accessibility Rules
    // Ensures interactive elements have proper accessibility labels
    {
        files: [
            "libs/**/*.tsx",
            "apps/**/*.tsx"
        ],
        plugins: {
            "react-native-a11y": reactNativeA11y
        },
        rules: {
            // Warn on Touchable/Pressable without accessibility props
            "react-native-a11y/has-accessibility-props": "warn",
            // Warn on invalid accessibility roles
            "react-native-a11y/has-valid-accessibility-role": "warn",
            // Error on nested touchables (causes accessibility issues)
            "react-native-a11y/no-nested-touchables": "error"
        }
    },
    // React Native Safe Area Rules
    // Enforce using SafeAreaView from react-native-safe-area-context for proper edge-to-edge support
    {
        files: [
            "**/*.tsx"
        ],
        ignores: [
            "**/node_modules/**",
            "**/dist/**"
        ],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        {
                            name: "react-native",
                            importNames: ["SafeAreaView"],
                            message: "Use SafeAreaView from 'react-native-safe-area-context' with explicit edges prop for proper Android edge-to-edge support."
                        }
                    ]
                }
            ]
        }
    }
];
