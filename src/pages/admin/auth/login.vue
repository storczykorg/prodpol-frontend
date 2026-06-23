<!--
  - Copyright 2026 storczyk.org. All rights reserved.
  - This work is licensed under the terms of the MIT license.
  - For a copy, see <https://opensource.org/licenses/MIT>.
  -->

<script setup lang="ts">
import {ref} from "vue";
import {useRouter, useRoute} from "vue-router";
import {useAuthStore} from "#pinia/auth.ts";
import {useI18n} from "vue-i18n";
import {ArrowRight} from "@lucide/vue";

const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function onSubmit() {
  error.value = "";
  loading.value = true;
  try {
    await authStore.login(email.value, password.value);
    const redirect = typeof route.query.redirect === "string" ? route.query.redirect : "/admin";
    router.push(redirect);
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : "Login failed";
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="card w-full max-w-sm shadow-xl">
      <div class="card-body">
        <h1 class="card-title text-2xl font-bold">Sign in</h1>

        <div v-if="error" class="alert alert-error alert-soft">
          {{ error }}
        </div>

        <form @submit.prevent="onSubmit">
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Email</legend>
            <input
              v-model="email"
              type="email"
              class="input w-full"
              placeholder="name@example.com"
              required
              autocomplete="email"
            />
          </fieldset>

          <fieldset class="fieldset">
            <legend class="fieldset-legend">Password</legend>
            <input
              v-model="password"
              type="password"
              class="input w-full"
              placeholder="Password"
              required
              autocomplete="current-password"
            />
          </fieldset>

          <router-link to="/admin/auth/forgotPassword" class="link link-hover mt-2 block text-right text-sm">
            {{ t("auth.login.forgot_password") }}
          </router-link>

          <button
            type="submit"
            class="btn btn-primary mt-4 w-full"
            :disabled="loading"
          >
            <span v-if="loading" class="loading loading-spinner" />
            <ArrowRight v-else class="size-4" />
            Sign in
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>

<route lang="json">
{
  "meta": {
    "allowAnonymous": true,
    "noNavigation": true
  }
}
</route>
