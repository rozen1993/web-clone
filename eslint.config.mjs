import tsParser from "@typescript-eslint/parser";
import { defineConfig, globalIgnores } from "eslint/config";
import astro from "eslint-plugin-astro";

const eslintConfig = defineConfig([
  ...astro.configs.recommended,
  {
    // The frontmatter of an .astro file is TypeScript. Without this, the Astro
    // parser falls back to espree and chokes on `interface`, `type`, etc.
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: { parser: tsParser },
    },
  },
  globalIgnores(["dist/**", ".astro/**"]),
]);

export default eslintConfig;
