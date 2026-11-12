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
    "package.json",
    "tsconfig.json",
  ]),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.mjs", "manifest.json"],
        },
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: [".json"],
      },
    },
  },
  ...obsidianmd.configs.recommended,
);
