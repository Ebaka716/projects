import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = [
  // Apply ESLint recommended and Next.js core rules first
  ...compat.extends("eslint:recommended", "next/core-web-vitals"),
  // TypeScript specific configurations
  {
    files: ["**/*.ts", "**/*.tsx"], // Target TypeScript files
    plugins: {
      "@typescript-eslint": typescriptPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
    },
    rules: {
      // Apply recommended TS rules
      ...typescriptPlugin.configs["recommended"].rules,
      // Turn off base rule to avoid conflict
      "no-unused-vars": "off",
      // Configure TS version to ignore underscore prefix
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      // Add any other rule overrides here if needed
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off"
    },
  },
  // Add Prettier configuration last if you use it
  // ...compat.extends("plugin:prettier/recommended"), // Optional: If using Prettier
];

export default eslintConfig;
