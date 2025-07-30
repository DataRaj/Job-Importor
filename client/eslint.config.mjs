// import js from "@eslint/js";
// import tseslint from "typescript-eslint";
// import pluginReact from "eslint-plugin-react";
// import pluginReactHooks from "eslint-plugin-react-hooks";
// import pluginNext from "@next/eslint-plugin-next";

// /**
//  * A basic ESLint configuration for a Next.js, React, and TypeScript project.
//  * This setup uses the recommended rule sets from the core plugins to catch
//  * common errors and potential bugs, without being overly strict or stylistic.
//  */
// export default tseslint.config(
//   // Applies ESLint's recommended built-in rules.
//   js.configs.recommended,

//   // Applies the recommended rules from @typescript-eslint/eslint-plugin.
//   ...tseslint.configs.recommended,

//   // Configuration specific to React and Next.js.
//   {
//     plugins: {
//       react: pluginReact,
//       "react-hooks": pluginReactHooks,
//       "@next/next": pluginNext,
//     },
//     rules: {
//       // Apply recommended rules from plugins
//       ...pluginReact.configs.recommended.rules,
//       ...pluginReactHooks.configs.recommended.rules,
//       ...pluginNext.configs.recommended.rules,

//       // Common adjustments for modern React/Next.js with TypeScript.
//       "react/react-in-jsx-scope": "off", // Not needed with Next.js/React 17+
//       "react/prop-types": "off", // This is handled by TypeScript's type checking.
//     },
//     settings: {
//       react: {
//         // Automatically detect the version of React to use.
//         version: "detect",
//       },
//     },
//   }
// );
