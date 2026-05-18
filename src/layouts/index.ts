/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 *
 */

import type {Router} from "vue-router";
import type {Component} from "vue";
import DefaultLayout from "./DefaultLayout.vue";
import NavLayout from "./NavLayout.vue";
import AdminLayout from "./AdminLayout.vue";

export function layoutStrategy(router: Router): Component {
  const current = router.currentRoute.value;

  if (current.matched.some((e) => {
    return Boolean(e.meta["noNavigation"]);
  })) {
    return DefaultLayout;
  }
  else if (current.matched.some((e) => {
    return Boolean(e.meta["admin"]);
  })) {
    return AdminLayout;
  }
  return NavLayout;
}
