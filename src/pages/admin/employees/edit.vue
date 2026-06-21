<!--
  - Copyright 2026 storczyk.org. All rights reserved.
  - This work is licensed under the terms of the MIT license.
  - For a copy, see <https://opensource.org/licenses/MIT>.
  -->

<script setup lang="ts">
import {ArrowLeft} from "@lucide/vue";
import {computed, onBeforeUnmount, reactive, type Ref, ref, watch} from "vue";
import {useRouter} from "vue-router";
import EmployeeGroupSelector from "../../../components/admin/EmployeeGroupSelector.vue";
import {useRouteQuery} from "@vueuse/router";
import {useQuery} from "@pinia/colada";
import {defineEmployeeQuery} from "../../../data/server/employees/employees.ts";
import type {EmployeeRead} from "#server/types/employees/EmployeeRead.ts";

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
  enabled: false,
  normalizedName: "",
  roleName: "",
  normalizedEmail: ""
} satisfies EmployeeRead)

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  groupId: null as number | null,
})

let picUrl: Ref<string | null> = ref(null);

const canBack = computed(() => {
  return window.history.length
})

function fileChanged(e: InputEvent) {
  const files = e.dataTransfer?.files || (e.target as HTMLInputElement).files;
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

function onSubmit() {

}

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
              <span class="label"><span class="label-text">Grupa: {{ emp.roleName }}</span></span>
              <br/>
              <employee-group-selector
                  :defaultValue="emp.roleName"
                  allow-empty="allow-empty"
                  v-model="form.groupId" />
            </label>
          </div>

        </div>
      </div>

      <div class="flex justify-end gap-3 mt-6 border-t border-base-200 pt-6">
        <button type="button" class="btn btn-ghost" @click="router.back()">Anuluj</button>
        <button type="submit" class="btn btn-primary">Zapisz zmiany</button>
      </div>

    </form>
  </article>
</template>

<style scoped>

</style>