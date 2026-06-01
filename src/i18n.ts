/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

import { createI18n, type PluralizationRule } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";

const plPluralization: PluralizationRule = (choice) => {
  choice = Math.abs(choice);
  if ((choice % 1) > 1e-8) {
    return 3;
  }
  if (choice === 0) {
    return 0;
  }
  else if (choice === 1) {
    return 1;
  }
  if (Math.floor(choice % 10) < 5) {
    return 2;
  }
  else {
    return 3;
  }
};

export const i18n = createI18n({
  fallbackLocale: "en",
  pluralRules: {
    pl: plPluralization,
  },
  messages,
  locale: localStorage.getItem("lang") ?? "pl",
  availableLocales: ["en", "pl"],
});
