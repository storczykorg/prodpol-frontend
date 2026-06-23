/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    allowAnonymous?: boolean;
    admin?: boolean;
    noNavigation?: boolean;
  }
}
