/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

import type {Component} from "vue";

export type MenuItem = MenuLinkType | MenuGroup;
export type MenuLinkType = {
  type: "link";
  link: string;
  text: string;
  icon?: Component;
};
export type MenuGroup = {
  type: "group";
  text: string;
  links: MenuLinkType[];
  icon?: Component;
};
