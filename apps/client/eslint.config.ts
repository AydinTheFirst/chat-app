import js from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  perfectionist.configs["recommended-alphabetical"],
  reactHooks.configs["recommended-latest"],
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["dist", ".react-router"],
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" }
      ],
      "@typescript-eslint/no-non-null-assertion": "off",
      "perfectionist/sort-imports": "error"
    }
  }
);
