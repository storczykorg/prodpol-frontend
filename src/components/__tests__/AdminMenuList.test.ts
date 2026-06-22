import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import AdminMenuList from "../admin/AdminMenuList.vue";

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/:pathMatch(.*)*", component: { template: "<div/>" } }],
  });
}

describe("AdminMenuList", () => {
  const linkItems = [
    { type: "link" as const, link: "/admin", text: "Dashboard" },
  ];

  const groupItems = [
    {
      type: "group" as const,
      text: "Settings",
      links: [
        { type: "link" as const, link: "/admin/general", text: "General" },
      ],
    },
  ];

  it("renders links", () => {
    const wrapper = mount(AdminMenuList, {
      props: { items: linkItems },
      global: { plugins: [createTestRouter()] },
    });
    expect(wrapper.text()).toContain("Dashboard");
  });

  it("renders groups with sub-links", () => {
    const wrapper = mount(AdminMenuList, {
      props: { items: groupItems },
      global: { plugins: [createTestRouter()] },
    });
    expect(wrapper.text()).toContain("Settings");
    expect(wrapper.text()).toContain("General");
  });

  it("renders horizontal menu when inNavbar", () => {
    const wrapper = mount(AdminMenuList, {
      props: { items: linkItems, inNavbar: true },
      global: { plugins: [createTestRouter()] },
    });
    expect(wrapper.find(".menu-horizontal").exists()).toBe(true);
  });
});
