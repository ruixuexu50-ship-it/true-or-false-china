import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  trailingSlash: "always",
  // Bilingual routing: English is the default locale and stays at the site
  // root (no `/en/` prefix). Chinese lives under `/zh/`.
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
