<template>
  <div class="music-wrapper">
    <MusicPlayer playerId="music-player1"></MusicPlayer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "MusicPage",
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
html,
body {
  width: 100%;
  height: 100%;
  background: white;
  margin: auto;
  overflow: hidden;
}
</style>
