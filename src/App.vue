<script lang="ts" setup>
import "./style.css";

import {useRouter} from "vue-router"
import {layoutStrategy} from "./layouts";
import {computed, watch} from "vue";
import {useI18n} from "vue-i18n";

const router = useRouter()

const layout = computed(() => layoutStrategy(router))

const {locale} = useI18n();

watch(locale, (val) => {
  localStorage.setItem("lang", val);
});

</script>

<template>
  <RouterView v-slot="{ Component }">
    <component :is="layout" v-if="Component">
      <KeepAlive>
        <Suspense>
          <component :is="Component"></component>
          <template #fallback>
            Loading...
          </template>
        </Suspense>
      </KeepAlive>
    </component>
    <component :is="layout" v-else/>
  </RouterView>
</template>