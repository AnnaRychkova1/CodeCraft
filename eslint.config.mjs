import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    files: ["src/generated/**"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-console": "off",
      "no-debugger": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "no-empty": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-this-alias": "off",
      "max-classes-per-file": "off",
      "no-plusplus": "off",
      "no-param-reassign": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "import/no-unresolved": "off",
      "import/extensions": "off",
      "no-redeclare": "off",
      "@typescript-eslint/no-unnecessary-type-constraint": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
    },
  },
];

export default eslintConfig;
