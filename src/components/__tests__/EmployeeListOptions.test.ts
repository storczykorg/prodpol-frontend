import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createI18n } from "vue-i18n";
import EmployeeListOptions from "../admin/EmployeeListOptions.vue";
import EmployeeGroupSelector from "../admin/EmployeeGroupSelector.vue";

vi.mock("../../data/server/employees/employeeRoles", () => ({
  useAllEmployeeRolesQuery: () => ({
    data: { value: [] },
    error: { value: null },
    refresh: vi.fn(),
    isPending: { value: false },
  }),
}));

function createI18nInstance() {
  return createI18n({
    locale: "pl",
    fallbackLocale: "pl",
    messages: {
      pl: {
        ui: {
          search: { title: "Szukaj", placeholder: "Wpisz..." },
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
        },
        admin: {
          employees: {
            search: { full_name: "Imię i nazwisko" },
          },
          employee: { roles: {} },
        },
      },
    },
  });
}

describe("EmployeeListOptions", () => {
  it("renders search fieldset", () => {
    const wrapper = mount(EmployeeListOptions, {
      global: {
        plugins: [createI18nInstance()],
        stubs: { EmployeeGroupSelector: true },
      },
    });
    expect(wrapper.text()).toContain("Szukaj");
  });

  it("renders sorting fieldset", () => {
    const wrapper = mount(EmployeeListOptions, {
      global: {
        plugins: [createI18nInstance()],
        stubs: { EmployeeGroupSelector: true },
      },
    });
    expect(wrapper.text()).toContain("Sortowanie");
  });

  it("emits refetch on button click", async () => {
    const wrapper = mount(EmployeeListOptions, {
      global: {
        plugins: [createI18nInstance()],
        stubs: { EmployeeGroupSelector: true },
      },
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("refetch")).toHaveLength(1);
  });
});
