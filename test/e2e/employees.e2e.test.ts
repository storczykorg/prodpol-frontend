import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { PiniaColada } from "@pinia/colada";
import { createRouter, createMemoryHistory } from "vue-router";
import { createI18n } from "vue-i18n";
import { setupMockApi } from "./setup";

setupMockApi();

vi.mock("@vueuse/router", () => ({
  useRouteQuery: <T>(_key: string, defaultValue: T) => ({
    __v_isRef: true,
    value: defaultValue,
  }),
}));

function createTestI18n() {
  return createI18n({
    locale: "pl",
    fallbackLocale: "pl",
    messages: {
      pl: {
        admin: {
          employees: {
            link: "Pracownicy",
            add: "Dodaj",
            enabled: "Aktywny",
          },
        },
        ui: {
          search: { title: "Szukaj" },
          sorting: {
            title: "Sortowanie",
            sorting_keys: "Klucz sortowania",
            sorting_order: "Kolejność",
            descending: "Malejąco",
            ascending: "Rosnąco",
            created_at: "Data utworzenia",
            full_name: "Nazwa",
            identifier: "Identyfikator",
            role_name: "Rola",
          },
          found_results: "Znaleziono",
          error: { loading: "Błąd ładowania" },
          common: {
            yes: "Tak",
            no: "Nie",
            added: "Dodano",
            options: "Opcje",
          },
        },
        site: { contact: "Kontakt" },
      },
    },
  });
}

describe("employees page (firefox)", () => {
  it("renders employee table with mocked data", async () => {
    const pinia = createPinia();
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/admin/employees",
          name: "employees",
          component: () => import("../../src/pages/admin/employees/index.vue"),
        },
      ],
    });
    const i18n = createTestI18n();

    const wrapper = mount(await (await router.resolve("/admin/employees").route?.component?.()) ?? (await import("../../src/pages/admin/employees/index.vue")).default, {
      global: {
        plugins: [pinia, router, PiniaColada, i18n],
        stubs: {
          EmployeeListOptions: true,
          EmployeePicture: true,
          RouterLink: true,
        },
      },
    });

    expect(wrapper.find("h2").text()).toBe("Pracownicy");
  });
});

describe("employees page (chromium)", () => {
  it("renders employee table with mocked data", async () => {
    const pinia = createPinia();
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: "/admin/employees",
          name: "employees",
          component: () => import("../../src/pages/admin/employees/index.vue"),
        },
      ],
    });
    const i18n = createTestI18n();

    const wrapper = mount(await (await router.resolve("/admin/employees").route?.component?.()) ?? (await import("../../src/pages/admin/employees/index.vue")).default, {
      global: {
        plugins: [pinia, router, PiniaColada, i18n],
        stubs: {
          EmployeeListOptions: true,
          EmployeePicture: true,
          RouterLink: true,
        },
      },
    });

    expect(wrapper.find("h2").text()).toBe("Pracownicy");
  });
});
