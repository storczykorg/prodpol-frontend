/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

import { createRouter, createWebHistory } from "vue-router";
import { handleHotUpdate, routes } from "vue-router/auto-routes";
import { useAuthStore } from "#pinia/auth.ts";

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const needsAuth = to.matched.some(r => r.meta.requiresAuth);
  const isAnonymous = to.matched.some(r => r.meta.allowAnonymous);

  if (needsAuth && !isAnonymous) {
    const authStore = useAuthStore();
    if (!authStore.isInitialized) {
      await authStore.initialize();
    }
    if (!authStore.isAuthenticated) {
      return { path: "/admin/auth/login", query: { redirect: to.fullPath } };
    }
  }
});

if (import.meta.hot) {
  handleHotUpdate(router);
}
