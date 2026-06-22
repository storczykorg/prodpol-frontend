import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import VueRouter from "vue-router/vite";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import path from "path";

export default defineConfig({
  plugins: [
    vue(),
    VueRouter(),
    VueI18nPlugin({
      include: [path.resolve(__dirname, "./src/locales/**")],
    }),
  ],
  test: {
    include: ["test/e2e/**/*.e2e.test.ts"],
    browser: {
      enabled: true,
      provider: "playwright",
      headless: true,
      instances: [
        { browser: "chromium" },
        { browser: "firefox" },
      ],
    },
    globals: true,
    css: true,
  },
  resolve: {
    alias: {
      "#server/types": path.resolve(__dirname, "./src/data/types"),
      "#server": path.resolve(__dirname, "./src/data/server"),
      "#colada": path.resolve(__dirname, "./src/data/server"),
      "#pinia": path.resolve(__dirname, "./src/data/store"),
    },
  },
});
