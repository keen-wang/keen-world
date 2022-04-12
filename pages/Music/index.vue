<template>
  <div class="music-wrapper">
    <!-- <ClientOnly> -->
      <MusicPlayer id="music-player"></MusicPlayer>
    <!-- </ClientOnly> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {},
});
</script>
<style lang="less" scoped>
.music-wrapper {
  width: 100%;
  height: 100%;
  // margin: auto;
  // overflow: hidden;
  // background: white;
  // background-image: url("//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/music/bg.jpg");
  // background-size: 100% 100%;
}
</style>

<style>
#__nuxt {
  width: 100%;
  height: 100%;
}
</style>
