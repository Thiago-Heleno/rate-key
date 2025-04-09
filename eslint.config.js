import globals from "globals";
// Removed duplicate import: import pluginJs from "@eslint/js"; (it's imported below as eslint)
// Removed duplicate import: import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser"; // Keep parser import if needed separately, though tseslint.config usually handles it
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js"; // Using recommended config
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";

import eslint from "@eslint/js";
import tseslint from "typescript-eslint"; // Use the combined package

export default tseslint.config(
  {
    // Global ignores - Added src-tauri/target/
    ignores: ["dist/", "src-tauri/gen/", "src-tauri/target/", "node_modules/"],
  },
  // Base JS configuration (applies globally)
  eslint.configs.recommended,
  // TypeScript specific configuration for source files
  ...tseslint.configs.recommendedTypeChecked.map(config => ({
    ...config,
    files: ["src/**/*.{ts,tsx}"], // Apply only to src files
    languageOptions: {
      ...config.languageOptions,
      parserOptions: {
        ...config.languageOptions?.parserOptions,
        project: true, // Automatically find tsconfig.json
        tsconfigRootDir: import.meta.dirname, // Helps find tsconfig relative to eslint.config.js
      },
      globals: {
        ...globals.browser, // Keep browser globals
        ...globals.es2020, // Keep ES2020 globals
      },
    },
    // Keep existing plugins and rules if needed, or rely on recommendedTypeChecked
    // plugins: { ... },
    // rules: { ... },
  })),
  // Configuration for React files (inherits TS config)
  {
    files: ["src/**/*.{jsx,tsx}"], // Apply only to React files in src
    ...pluginReactConfig, // Apply recommended React rules
    settings: {
      react: {
        version: "detect", // Detect React version
      },
    },
    plugins: {
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
  // Configuration for JS/CJS config files (like vite.config.ts, eslint.config.js)
  // Uses basic TS parser without project linking
  {
    files: ["*.{js,cjs,mjs}", "vite.config.ts"], // Target config files
    languageOptions: {
      parser: tsParser, // Use TS parser for potential TS syntax in JS files
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module", // Assume module for vite.config.ts etc.
      },
      globals: {
        ...globals.node, // Use Node.js globals for config files
        ...globals.es2020,
      },
    },
    rules: {
      // Relax rules for config files if necessary
      "@typescript-eslint/no-var-requires": "off", // Allow require() in CJS files if needed
    },
  },
  // Configuration specifically for mock files
  {
    files: ["src/__mocks__/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-call": "off", // Potentially needed for vi.fn() calls
      "@typescript-eslint/no-unsafe-member-access": "off", // Potentially needed
      "@typescript-eslint/require-await": "off", // Allow async functions without await
    },
  }
);
