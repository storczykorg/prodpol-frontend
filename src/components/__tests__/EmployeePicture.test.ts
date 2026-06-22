import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import EmployeePicture from "../employees/EmployeePicture.vue";

describe("EmployeePicture", () => {
  const emp = {
    id: 1,
    nameFirst: "Jan",
    nameLast: "Kowalski",
    email: "jan@example.com",
    phoneNumber: "+48123456789",
    createdAt: "2026-01-15T10:00:00Z",
    roleId: 1,
    enabled: true,
  };

  it("renders fallback URL with employee name", () => {
    const wrapper = mount(EmployeePicture, { props: { emp } });
    const obj = wrapper.find("object");
    expect(obj.attributes("data")).toContain("Jan");
    expect(obj.attributes("data")).toContain("Kowalski");
  });

  it("uses custom fallback when provided", () => {
    const wrapper = mount(EmployeePicture, {
      props: { emp, fallback: "https://example.com/photo.png" },
    });
    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe("https://example.com/photo.png");
  });

  it("renders avatar container", () => {
    const wrapper = mount(EmployeePicture, { props: { emp } });
    expect(wrapper.find(".avatar").exists()).toBe(true);
  });
});
