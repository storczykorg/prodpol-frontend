<!--
  - Copyright 2026 storczyk.org. All rights reserved.
  - This work is licensed under the terms of the MIT license.
  - For a copy, see <https://opensource.org/licenses/MIT>.
  -->

<template>
  <router-view/>
</template>
<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "admin": true
  }
}
</route>