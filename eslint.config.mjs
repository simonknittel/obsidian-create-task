import obsidianmd from "eslint-plugin-obsidianmd";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

export default defineConfig(
  globalIgnores([
    "node_modules",
    "esbuild.config.mjs",
    "version-bump.mjs",
    "versions.json",
    "main.js",
    "tsconfig.json",
  ]),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.mjs"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...obsidianmd.configs.recommended,
  {
    rules: {
      "obsidianmd/ui/sentence-case": ["warn", { brands: ["Create Task"] }],
    },
  },
);
