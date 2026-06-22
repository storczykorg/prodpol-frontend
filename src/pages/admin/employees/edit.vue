<script setup lang="ts">
import {ArrowLeft} from "@lucide/vue";
import {computed, onBeforeUnmount, reactive, type Ref, ref, watch} from "vue";
import {useRouter} from "vue-router";
import EmployeeGroupSelector from "../../../components/admin/EmployeeGroupSelector.vue";
import {useRouteQuery} from "@vueuse/router";
import {useMutation, useQuery} from "@pinia/colada";
import {defineEmployeeQuery, useEmployeeUpdate} from "../../../data/server/employees/employees.ts";
import {useAllEmployeeRolesQuery} from "../../../data/server/employees/employeeRoles.ts";
import type {EmployeeRead} from "#server/types/employees/EmployeeRead.ts";
import type {EmployeeRoleReadArray} from "#server/types/employees/EmployeeRoleRead.ts";

const router = useRouter();

const userId = useRouteQuery("id", null satisfies number | null, {transform: Number})

const {
  data,
} = useQuery<EmployeeRead, Error, EmployeeRead>(() => defineEmployeeQuery(userId.value))

const emp = computed(() => data?.value ?? {
  id: 0,
  nameFirst: "",
  nameLast: "",
  email: "",
  phoneNumber: "",
  createdAt: "",
  roleId: 0,
  roleName: "",
  enabled: false,
  normalizedName: "",
  normalizedEmail: "",
} satisfies EmployeeRead)

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  roleName: null as string | null,
})

const {data: roles} = useAllEmployeeRolesQuery();

const {
  mutateAsync: updateEmployee,
  error: updateError,
  isLoading: updateLoading,
} = useMutation(useEmployeeUpdate());

watch(emp, (e) => {
  form.firstName = e.nameFirst;
  form.lastName = e.nameLast;
  form.email = e.email;
  form.phone = e.phoneNumber;
  form.roleName = e.roleName;
}, {immediate: true})

function resolveRoleId(roleName: string | null, allRoles: EmployeeRoleReadArray | undefined): number | null {
  if (!roleName || !allRoles) return null;
  const found = allRoles.find(r => r.roleName === roleName);
  return found ? found.id : null;
}

async function onSubmit() {
  const patch: Array<{ op: "replace"; path: string; value: unknown }> = [];

  if (form.firstName !== emp.value.nameFirst) {
    patch.push({op: "replace", path: "/nameFirst", value: form.firstName});
  }
  if (form.lastName !== emp.value.nameLast) {
    patch.push({op: "replace", path: "/nameLast", value: form.lastName});
  }
  if (form.email !== emp.value.email) {
    patch.push({op: "replace", path: "/email", value: form.email});
  }
  if (form.phone !== emp.value.phoneNumber) {
    patch.push({op: "replace", path: "/phoneNumber", value: form.phone});
  }

  const currentRoleId = emp.value.roleId;
  const newRoleId = resolveRoleId(form.roleName, roles.value);
  if (newRoleId !== currentRoleId) {
    patch.push({op: "replace", path: "/roleId", value: newRoleId});
  }

  if (patch.length === 0) return;

  try {
    await updateEmployee({id: userId.value, patch});
    // success — cache is auto-invalidated by mutation key
  } catch {
    // error is reactive via updateEmployee.error
  }
}

let picUrl: Ref<string | null> = ref(null);

const canBack = computed(() => {
  return window.history.length
})

function fileChanged(e: Event) {
  const input = e.target as HTMLInputElement;
  const files = (e as InputEvent).dataTransfer?.files || input.files;
  const file = files?.item(0)
  if (file == null) return;

  picUrl.value = URL.createObjectURL(file);
}

watch(picUrl, (_, prevVal) => {
  if (prevVal) {
    URL.revokeObjectURL(prevVal);
  }
})

onBeforeUnmount(() => {
  picUrl.value = null
})

</script>

<template>
  <article class="container max-w-4xl mx-auto bg-base-100 shadow-xl rounded-2xl p-6 lg:p-10 min-h-[50vh] mt-8">

    <header class="flex items-center gap-4 mb-8 border-b border-base-200 pb-4">
      <button v-if="canBack" class="btn btn-circle btn-ghost" @click="router.back()">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <div>
        <h1 class="text-2xl font-bold">Edycja Pracownika</h1>
        <p class="text-sm text-base-content/70">Zaktualizuj dane profilowe i kontaktowe</p>
      </div>
    </header>

    <div v-if="updateLoading" class="alert alert-info mb-4">Zapisywanie...</div>
    <div v-if="updateError" class="alert alert-error mb-4">
      {{ updateError?.message ?? "Wystąpił błąd podczas zapisu" }}
    </div>

    <form @submit.prevent="onSubmit" class="flex flex-col gap-8">

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

        <div class="md:col-span-1 flex flex-col items-center gap-4">
          <div class="avatar">
            <div class="w-48 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-2">
              <img v-if="picUrl" :src="picUrl" class="object-cover" />
              <img v-else :src="`https://ui-avatars.com/api/?name=${emp.nameFirst}+${emp.nameLast}&background=random`" />
            </div>
          </div>

          <div class="w-full max-w-xs text-center">
            <label class="btn btn-outline btn-sm w-full cursor-pointer">
              Zmień zdjęcie
              <input type="file" class="hidden" accept="image/*" @change="fileChanged" />
            </label>
            <span class="text-xs text-base-content/60 mt-2 inline-block">Maksymalny rozmiar pliku: 2MB</span>
          </div>
        </div>

        <div class="md:col-span-2 space-y-6">

          <div>
            <h2 class="text-lg font-semibold mb-4">Dane podstawowe</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label class="form-control w-full">
                <span class="label"><span class="label-text">Imię</span></span>
                <input type="text" class="input input-bordered w-full"
                       :placeholder="emp.nameFirst"
                       v-model="form.firstName" />
              </label>
              <label class="form-control w-full">
                <span class="label"><span class="label-text">Nazwisko</span></span>
                <input type="text" class="input input-bordered w-full"
                       :placeholder="emp.nameLast"
                       v-model="form.lastName" />
              </label>
            </div>
          </div>

          <div class="divider"></div>

          <div>
            <h2 class="text-lg font-semibold mb-4">Kontakt</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label class="form-control w-full">
                <span class="label"><span class="label-text">Adres e-mail</span></span>
                <input type="email" class="input input-bordered w-full"
                       :placeholder="emp.email"
                       v-model="form.email" />
              </label>
              <label class="form-control w-full">
                <span class="label"><span class="label-text">Numer telefonu</span></span>
                <input type="tel" class="input input-bordered w-full"
                       :placeholder="emp.phoneNumber"
                       v-model="form.phone" />
              </label>
            </div>
          </div>

          <div class="divider"></div>

          <div>
            <h2 class="text-lg font-semibold mb-4">Organizacja</h2>
            <label class="form-control w-full">
              <span class="label"><span class="label-text">Grupa:</span></span>
              <employee-group-selector
                  allow-empty
                  v-model="form.roleName" />
            </label>
          </div>

        </div>
      </div>

      <div class="flex justify-end gap-3 mt-6 border-t border-base-200 pt-6">
        <button type="button" class="btn btn-ghost" @click="router.back()">Anuluj</button>
        <button type="submit" class="btn btn-primary" :disabled="updateLoading">Zapisz zmiany</button>
      </div>

    </form>
  </article>
</template>

<style scoped>

</style>
