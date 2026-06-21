/*
 * Copyright 2026 storczyk.org. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */
import { defineStore } from "pinia";

export interface PlanStep {
  name: string;
  execute: () => Promise<void>;
}

export interface Plan {
  name: string;
  steps: PlanStep[];
}

export interface PlanStoreState {
  planStack: Plan[];
}

export const usePlanStore = defineStore(
  "Prodpol/Plans", {
    state: () => ({}),
    actions: {},
    getters: {},
  });
