# ⚡ Next.js 15 + Tailwind CSS 4 Starter Kit

![Node.js 22+](https://img.shields.io/badge/node-22%2B-blue?logo=node.js)
![pnpm 10.x](https://img.shields.io/badge/pnpm-10.x-4B8BBE?logo=pnpm)
[![Linting: ESLint](https://img.shields.io/badge/linting-eslint-blue?logo=eslint)](https://eslint.org/)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?logo=prettier)](https://prettier.io/)
![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)

A modern, well-structured starter kit for building fast, accessible, and scalable web applications using **Next.js 15**, **Tailwind CSS 4**, and a curated set of developer tools.

---

## 📚 Table of Contents

- [🚀 Features](#features)
- [📦 Tech Stack](#tech-stack)
- [📁 Folder Structure](#folder-structure)
- [⚙️ Getting Started](#getting-started)
- [🧪 Scripts](#scripts)
- [🛠️ Tooling Configuration](#tooling-configuration)
- [🧱 Development Workflow](#development-workflow)
- [♿ Accessibility](#accessibility)
- [🧪 Commit Guidelines](#commit-guidelines)
- [📚 Resources](#resources)
- [📄 License](#license)

---

<a id="features"></a>

## 🚀 Features

- **Next.js 15** App Router with Turbopack for fast builds and instant refreshes
- **Tailwind CSS 4** with `prettier-plugin-tailwindcss` for automatic class sorting
- **Dark mode support** via [`next-themes`](https://github.com/pacocoursey/next-themes)
- **Radix UI** primitives for accessible components
- **TypeScript** for type-safe development
- **ESLint + Prettier** with a shared config for consistent formatting
- **Husky + lint-staged** for automated pre-commit checks
- **Release It!** for automated semantic versioning and changelog updates
- **Commitlint + Conventional Commits** for structured commit history
- **ShadCN UI** fully customizable, locally owned components

---

<a id="tech-stack"></a>

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4.1, PostCSS
- **Language**: TypeScript
- **Linting & Formatting**: ESLint (Flat Config), Prettier (shared config)
- **Dev Tools**: pnpm, Husky, lint-staged, Commitlint, Release It!
- **UI & Icons**: Radix UI, Lucide, ShadCN UI

---

<a id="folder-structure"></a>

## 📁 Folder Structure

```txt
.
├── src/
│   ├── app/                 # App Router entry point and global styles
│   │   ├── globals.css      # Tailwind theme tokens and base styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # Reusable UI and theme components
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── ...
│   │   └── ui/              # ShadCN UI components
│   │       ├── button.tsx
│   │       ├── dropdown-menu.tsx
│   │       └── ...
│   ├── lib/                 # Shared utilities and helpers
│   │   └── utils.ts
├── public/                  # Static assets served at root
├── .husky/                  # Git hooks
├── components.json          # ShadCN UI CLI config
├── commitlint.config.mjs    # Conventional commit rules
├── eslint.config.mjs        # Flat ESLint configuration with Prettier integration
├── prettier.config.mjs      # Prettier with Tailwind plugin
├── postcss.config.mjs       # PostCSS config for Tailwind CSS
├── .lintstagedrc.mjs        # Format and lint staged files
├── .release-it.ts           # Semantic versioning and changelog
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project metadata and npm scripts
```

<a id="getting-started"></a>

## ⚙️ Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+

### 1. Clone the repo

```bash
npx degit https://github.com/b3t0247/nextjs-tailwind my-app
```

```bash
cd my-app
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

<a id="scripts"></a>

## 🧪 Scripts

| Command           | Description                                | Notes                        |
| ----------------- | ------------------------------------------ | ---------------------------- |
| `pnpm dev`        | Start the dev server with Turbopack        | Requires Node.js 22+         |
| `pnpm build`      | Build the app for production               | Outputs to `.next/`          |
| `pnpm start`      | Start the production server                | Requires prior build         |
| `pnpm lint`       | Run ESLint with auto-fix                   | Uses Flat Config             |
| `pnpm lint:check` | Run ESLint without auto-fix (optional)     | Uses Flat Config             |
| `pnpm format`     | Format code using Prettier                 | Includes Tailwind plugin     |
| `pnpm release`    | Automated versioning and changelog updates | Uses `.release-it.ts` config |

> 💡 Tip: Use `pnpm lint --fix` or `pnpm exec prettier --write .` to auto-fix issues and format all files.

<a id="tooling-configuration"></a>

## 🛠️ Tooling Configuration

| File                    | Purpose                                                                   |
| ----------------------- | ------------------------------------------------------------------------- |
| `eslint.config.mjs`     | Flat Config for ESLint with TypeScript, Prettier, and accessibility rules |
| `prettier.config.mjs`   | Shared Prettier configuration used by both ESLint and Prettier CLI        |
| `.lintstagedrc.mjs`     | Runs ESLint and Prettier on staged files before commits using lint-staged |
| `.prettierignore`       | Excludes files and folders from Prettier formatting                       |
| `.release-it.ts`        | Automated semantic versioning and changelog generation                    |
| `commitlint.config.mjs` | Enforces Conventional Commits and custom rules for commit messages        |
| `.husky/`               | Contains Git hooks (e.g., pre-commit) managed by Husky                    |
| `tailwind.config.ts`    | Tailwind CSS configuration for design tokens, themes, and plugins         |
| `postcss.config.mjs`    | Configures PostCSS plugins (e.g., Tailwind CSS integration)               |
| `components.json`       | ShadCN UI CLI config for scaffolding components and managing aliases      |
| `tsconfig.json`         | TypeScript compiler configuration                                         |

---

<a id="development-workflow"></a>

## 🧱 Development Workflow

- Formatting tools (Prettier, ESLint, lint-staged)
- Customization options (Tailwind tokens, ESLint/Prettier configuration, ShadCN UI edits, Husky hooks)

### 🔍 Code Formatting & Linting

This project uses unified configs for consistent code quality:

- **Prettier**: Formatting rules are defined in `prettier.config.mjs` and used by both ESLint and the Prettier CLI.
- **ESLint**: Uses native Flat Config (`eslint.config.mjs`) with TypeScript, Prettier, and accessibility plugins.
- **lint-staged**: Automatically formats staged files before commits using ESLint and Prettier.
- **No `.prettierrc` needed**: All formatting rules live in `prettier.config.mjs` to avoid duplication.

```bash
pnpm format      # Runs Prettier using shared config
pnpm lint        # Runs ESLint with auto-fix enabled
```

### 🛠️ Project Customization

Customize your workflow and design system:

- **Tailwind CSS** v4 follows a CSS-first configuration model. Rather than using the conventional `tailwind.config.ts` file for design tokens, this project defines them directly in `global.css` using Tailwind’s `@theme`, `@custom-variant`, and `@layer` directives. OKLCH-based color tokens, radius scales, and font families are set inline within the `@theme` block, while base styles are applied using `@layer` base. To modify the design system, edit `app/global.css`.

- **ShadCN UI** components are copied into your project and fully owned. Customize them freely using Tailwind, CVA variants, and your design tokens. ShadCN CLI scaffolds components into `@/components/ui`, and aliases like `@/lib/utils` and `@/hooks` keep your imports clean.

- **ESLint Rules** Extend or override rules in `eslint.config.mjs` file or your shared config package. You can also add plugins for accessibility, import sorting, or testing.

- **Prettier** Add a `.prettierrc` file to customize formatting preferences like tab width, trailing commas, or quote style. This project uses inline Prettier config with `prettier-plugin-tailwindcss` for class sorting.

- **Commitlint** Adjust `commitlint.config.mjs` to enforce or relax rules around commit scopes, types, or message length.

- **Release Strategy** Tweak `.release-it.ts` to change version bumping behavior, changelog formatting, or GitHub release settings.

- **Husky Hooks** Add or modify Git hooks in `./husky` to run tests, type checks, or other validations before commits or pushes.

<a id="accessibility"></a>

## ♿ Accessibility

[**Next.js**](https://nextjs.org/docs/architecture/accessibility) includes strong accessibility support out of the box, helping you build inclusive web experiences by default.

### ✅ Built-in Features

- **Route Announcer**: Automatically announces page changes to screen readers during client-side navigation.

- **ESLint Accessibility Rules**: Includes [`eslint-plugin-jsx-a11y`](https://nextjs.org/learn/dashboard-app/improving-accessibility) by default to catch common accessibility issues in JSX.

- **Semantic HTML Encouragement**: Encourages use of `<main>`, `<nav>`, `<header>`, and other semantic elements.

- **Keyboard Navigation**: Core components like `<Link>` (next/link) and `<Image>` (next/image) are accessible by default.

### 🔧 Recommended Enhancements

- **Descriptive Page Titles**  
  Use `<Head>` to set meaningful titles for screen readers:

  ```tsx
  <Head>
    <title>Dashboard – MyApp</title>
  </Head>
  ```

- **Skip to Content Link**  
  Add a visually hidden link to let keyboard users bypass navigation:

  ```tsx
  <a href="#main-content" className="sr-only focus:not-sr-only">
    Skip to content
  </a>
  ```

- **Language Declaration** Set the default language in `next.config.js`:

  ```js
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  }
  ```

- **ARIA Roles (When Needed)** Use ARIA attributes for custom components like modals, tabs, or dropdowns - but prefer semantic HTML when possible.

- **Accessibility Testing Tools** Use tools like [axe DevTools](https://www.deque.com/axe/devtools/), [Lighthouse](https://developer.chrome.com/docs/lighthouse/accessibility/scoring), or screen readers like NVDA or VoiceOver to audit your app.

> 💡 Tip: Accessibility is not just about compliance — it improves usability for everyone.

<a id="commit-guidelines"></a>

## 🧪 Commit Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for consistent commit messages.

<a id="license"></a>

## 📄 License

This project is licensed under the [MIT License](./LICENSE). Feel free to use, fork, and contribute!

<a id="resources"></a>

## 📚 Resources

---

| Tool / Library                                          | Purpose                                             |
| ------------------------------------------------------- | --------------------------------------------------- |
| [Next.js 15](https://nextjs.org/docs)                   | React framework with App Router and Turbopack       |
| [Tailwind CSS](https://tailwindcss.com/docs)            | Utility-first CSS framework with OKLCH support      |
| [TypeScript](https://www.typescriptlang.org/)           | Static typing for JavaScript                        |
| [Radix UI](https://www.radix-ui.com/)                   | Accessible, unstyled UI primitives                  |
| [ShadCN UI](https://ui.shadcn.com/)                     | Build your own component library                    |
| [Lucide](https://lucide.dev/)                           | Beautiful, consistent icon set                      |
| [Husky](https://typicode.github.io/husky/)              | Git hook manager for running scripts before commits |
| [Lint-staged](https://github.com/okonet/lint-staged)    | Run linters on staged files before committing       |
| [Commitlint](https://commitlint.js.org/)                | Enforce Conventional Commit messages                |
| [Release It!](https://github.com/release-it/release-it) | Automate versioning and changelog generation        |

---

## 🚀 Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

The easiest way to deploy this Next.js app is with [Vercel](https://vercel.com), the creators of Next.js.

📘 Learn more: [Next.js Deployment Docs](https://nextjs.org/docs/app/getting-started/deploying)
