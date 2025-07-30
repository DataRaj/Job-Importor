import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import * as tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import prettierOptions from "./prettier.config.mjs";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginNext from "@next/eslint-plugin-next";

// Rule Merge Helper
const mergeStrictRules = (configs) =>
  configs.reduce((acc, cfg) => ({ ...acc, ...cfg.rules }), {});

export default defineConfig([
  // Base JS rules
  js.configs.recommended,

  // React + Next.js + Core Web Vitals
  {
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "@next/next": pluginNext,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
      "react/react-in-jsx-scope": "off",
    },
  },

  // TypeScript rules (type-aware)
  {
    // Use expanded globs for .ts/.tsx — safer than "**/*.{ts,tsx}" in nested setups
    files: ["src/**/*.ts", "src/**/*.tsx"],
    ignores: [".release-it.ts"], // Exclude this file from typed linting
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      ...mergeStrictRules(tseslint.configs.strict),
      "@typescript-eslint/no-unused-vars": ["warn"],
    },
  },

  // Fallback for .release-it.ts (non-type-aware)
  {
    files: [".release-it.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      // Lightweight rules — no type-checking required
      "@typescript-eslint/no-unused-vars": ["warn"],
      semi: ["error", "always"],
      quotes: ["error", "single"],
      "no-console": "warn",
      "prettier/prettier": ["error", prettierOptions],
    },
  },

  // Prettier integration
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": ["error", prettierOptions, { usePrettierrc: false }],
    },
  },

  // Global Ignore Using Flat Config API
  globalIgnores([".lintstagedrc.mjs", "postcss.config.mjs"]),
]);
