/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { EmployeeRead } from "#server/types/employees/EmployeeRead.ts";
import { employeeReadSchema } from "#server/types/employees/EmployeeRead.ts";

export const useAuthStore = defineStore("Prodpol/Auth", () => {
  const user = ref<EmployeeRead | null>(null);
  const isInitialized = ref(false);

  const isAuthenticated = computed(() => user.value !== null || isInitialized.value);

  let _initPromise: Promise<void> | null = null;

  async function initialize() {
    if (_initPromise) return _initPromise;
    _initPromise = (async () => {
      try {
        const response = await fetch("/api/data/employees/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          user.value = employeeReadSchema.parse(data);
        }
      }
      catch {
        user.value = null;
      }
      finally {
        isInitialized.value = true;
      }
    })();
    return _initPromise;
  }

  async function login(email: string, password: string): Promise<void> {
    const response = await fetch("/api/employee/auth/login?useCookies=true", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const detail = body?.title ?? body?.detail ?? "Login failed";
      throw new Error(detail);
    }
    await initialize();
  }

  async function logout() {
    try {
      await fetch("/api/employee/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    }
    finally {
      user.value = null;
    }
  }

  async function forgotPassword(email: string): Promise<void> {
    const response = await fetch("/api/employee/auth/forgotPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      throw new Error("Failed to send reset link");
    }
  }

  return { user, isInitialized, isAuthenticated, initialize, login, logout, forgotPassword };
});
