<template>
  <div>
    <div id="pitchContainer"></div>
    <audio ref="player" :src="musicSrc" controls></audio>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ZegoPitchView } from "~/plugins/ZegoPitchView";
// @ts-ignore
import ffxdz from "~/assets/music/pitchMusic.mp3";
import { pitch } from "./pitch";

export default Vue.extend({
  name: "Pitch",
  data(): {
    pitchView: ZegoPitchView | null;
    musicSrc: any;
  } {
    return {
      pitchView: null,
      musicSrc: ffxdz
    };
  },
  mounted() {
    this.pitchView = new ZegoPitchView();
    const el = document.getElementById("pitchContainer");
    if (!el) return;
    this.pitchView.mount(el);
    this.pitchView.setStandardPitch(pitch);

    const player = this.$refs.player as HTMLMediaElement;
    // this.pitchView.setCurrentSongProgress(3000, 0);
    player.onseeked = () => {
      console.log("onseeked", player?.paused, this.pitchView);
      if (player && this.pitchView) {
        this.pitchView.setCurrentSongProgress(player.currentTime * 1000, 0);
      }
    };
    setInterval(() => {
      if (!player.paused && this.pitchView) {
        this.pitchView.setCurrentSongProgress(player.currentTime * 1000, 3);
      }
    }, 60);
  }
});
</script>
<style lang="less" scoped>
#pitchContainer {
  width: 800px;
  height: 240px;
  background-color: #e5fee2;
  padding: 10px;
}
</style>
