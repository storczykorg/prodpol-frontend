/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

import { PiniaColadaQueryHooksPlugin } from "@pinia/colada";
import type { PiniaColadaPlugin } from "@pinia/colada";
import { useAuthStore } from "#pinia/auth.ts";

export const PiniaColadaAuthPlugin: PiniaColadaPlugin = (context) => {
  const hooksPlugin = PiniaColadaQueryHooksPlugin({
    onError(error) {
      if (
        error != null
        && typeof error === "object"
        && "status" in error
        && (error as { status: number }).status === 401
      ) {
        const authStore = useAuthStore(context.pinia);
        authStore.logout();
      }
    },
  });

  hooksPlugin(context);
};
