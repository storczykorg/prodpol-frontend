/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

import {defineConfig, loadEnv} from "vite";
import VueRouter from "vue-router/vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import path from "path";

import * as child from "child_process";
import virtual from "@rollup/plugin-virtual";

const commitInfo = child.execSync("git log -1 HEAD").toString();

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const backendUrl = env.VITE_API_URL;
  console.assert(backendUrl, "Frontend must be connected to server");

  return {
    plugins: [
      VueRouter({
      }),
      vue(),
      tailwindcss({
        optimize: true,
      }),
      VueI18nPlugin({
        include: [path.resolve(__dirname, "./src/locales/**")],
      }),
      virtual({
        "virtual:commitInfo": `const commitInfo = ${JSON.stringify(commitInfo)}; export default commitInfo;`,
      }),
    ],
    build: {
      cssCodeSplit: true,
      license: true,
      target: "baseline-widely-available",
    },
    server: {
      port: parseInt(env.VITE_PORT),
      proxy: {
      // "apiservice" is the name of the API in AppHost.cs.
        "/api": {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    } };
});
