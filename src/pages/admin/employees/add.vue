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

const router = useRouter();

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

const form = reactive({
  email: useRouteQuery("email", "" as string, { transform: String }),
  password: ref("password"),
  setPassword: useRouteQuery("setPassword", "", { transform: Boolean }),
  phoneNumber: useRouteQuery("phone", "" as string, { transform: String }),
  role: useRouteQuery("role", "" as string),
  nameFirst: useRouteQuery("name", "" as string, { transform: String }),
  nameLast: useRouteQuery("nameLast", "" as string, { transform: String }),
})



</script>

<template>
<article class="contrainer
lg:w-5/6
bg-base-200 border border-base-100
rounded-2xl p-8 min-h-[50vh]
flex justify-start flex-col
items-center
">
  <div class="flex justify-start w-full">
    <button v-if="canBack" class="btn btn-ghost" @click="router.back()"> <ArrowLeft /> </button>
  </div>
  <div class="flex flex-col justify-center items-stretch w-64">

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Zdjęcie</legend>
      <img
          class="w-64 h-64 object-cover rounded-2xl border-base-100 border"
          v-if="picUrl" :src="picUrl">
      <input type="file" class="file-input" accept="image/*" @input="fileChanged" />
      <label class="label">Max size 2MB</label>
    </fieldset>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Imię:</legend>
      <input type="text" class="input"
             placeholder="Type here"
             v-model="form.nameFirst"
      />
    </fieldset>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Nazwisko:</legend>
      <input type="text" class="input"
             placeholder="Type here"
             v-model="form.nameLast"
      />
    </fieldset>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Email:</legend>
      <input type="email" class="input"
             placeholder="Type here"
             v-model="form.email"
      />
    </fieldset>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Numer telefonu:</legend>
      <input type="tel" class="input"
             placeholder="Type here"
             v-model="form.phoneNumber"
      />
    </fieldset>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Grupa</legend>
      <employee-group-selector v-model="form.role"/>
    </fieldset>
    <button class="btn btn-primary btn-wide my-4">Dodaj</button>
  </div>
</article>
</template>

<style scoped>

</style>