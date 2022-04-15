<template>
  <div>
    <NuxtLink to="/page2">{{ aa }}</NuxtLink>
    <Tutorial />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
   name: "IndexPage",
  data() {
    return {
      aa: "啊啊啊啊啊",
    };
  },
});
</script>
