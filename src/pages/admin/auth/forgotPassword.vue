<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "#pinia/auth.ts";
import { useI18n } from "vue-i18n";
import { ArrowRight, MailCheck } from "@lucide/vue";

const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const error = ref("");
const loading = ref(false);
const sent = ref(false);

async function onSubmit() {
  error.value = "";
  loading.value = true;
  try {
    await authStore.forgotPassword(email.value);
    sent.value = true;
  }
  catch {
    error.value = t("message.error_occurred");
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
        <template v-if="sent">
          <h1 class="card-title text-2xl font-bold">{{ t("auth.forgot_password.title") }}</h1>
          <div class="alert alert-success alert-soft mt-4">
            <MailCheck class="size-5" />
            {{ t("auth.forgot_password.success") }}
          </div>
          <router-link to="/admin/auth/login" class="link link-hover mt-4 text-sm">
            {{ t("auth.forgot_password.back_to_login") }}
          </router-link>
        </template>

        <template v-else>
          <h1 class="card-title text-2xl font-bold">{{ t("auth.forgot_password.title") }}</h1>

          <div v-if="error" class="alert alert-error alert-soft">
            {{ error }}
          </div>

          <form @submit.prevent="onSubmit">
            <fieldset class="fieldset">
              <legend class="fieldset-legend">{{ t("auth.forgot_password.email") }}</legend>
              <input
                v-model="email"
                type="email"
                class="input w-full"
                placeholder="name@example.com"
                required
                autocomplete="email"
              />
            </fieldset>

            <button
              type="submit"
              class="btn btn-primary mt-4 w-full"
              :disabled="loading"
            >
              <span v-if="loading" class="loading loading-spinner" />
              <ArrowRight v-else class="size-4" />
              {{ t("auth.forgot_password.send") }}
            </button>
          </form>

          <router-link to="/admin/auth/login" class="link link-hover mt-4 text-sm">
            {{ t("auth.forgot_password.back_to_login") }}
          </router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<route lang="json">
{
  "meta": {
    "allowAnonymous": true,
    "noNavigation": true
  }
}
</route>
