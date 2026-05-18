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
