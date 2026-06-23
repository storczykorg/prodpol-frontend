/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

import { createApp } from "vue";
import { router } from "./routes";
import App from "./App.vue";
import { createPinia } from "pinia";
import { PiniaColada } from "@pinia/colada";
import { i18n } from "./i18n.ts";
import { PiniaColadaAutoRefetch } from "@pinia/colada-plugin-auto-refetch";
import { PiniaColadaAuthPlugin } from "#server/auth/coladaAuthPlugin.ts";
import Popper from "vue3-popper";
const pinia = createPinia();

const app = createApp(App)
  .use(router)
  .use(pinia)
  .use(PiniaColada, {
    plugins: [
      PiniaColadaAutoRefetch({
        autoRefetch: false,
      }),
      PiniaColadaAuthPlugin,
    ],
  })
  .use(i18n);

app.component("Popper", Popper);

app.mount("#app");
