/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 *
 */

import eslint from "@eslint/js";
import type {Linter} from "eslint";
import globals from "globals";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  stylistic.configs.customize({
    indent: 2,
    quotes: "double",
    semi: true,
  }),
  {
    ignores: [
      "**/.history",
      "**/.husky",
      "**/.vscode",
      "**/coverage",
      "**/dist",
      "**/node_modules",
    ],
  },
  {
    plugins: {
      typescriptEslint: tseslint.plugin,
      stylistic,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tseslint.parser,
    },
    rules: {
    },
  },
] satisfies Linter.Config[];
