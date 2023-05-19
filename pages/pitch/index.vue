<template>
  <div>
    <svg id="pitchView" width="100%" height="120">
      <rect x="0" y="0" width="100%" height="120" fill="#111" />
      <rect id="line1" x="-50%" y="50" width="100%" height="2" fill="#fff" />
      <rect id="line2" x="-50%" y="70" width="100%" height="2" fill="#fff" />
      <rect id="line3" x="-50%" y="90" width="100%" height="2" fill="#fff" />
      <rect id="line4" x="-50%" y="110" width="100%" height="2" fill="#fff" />
    </svg>
    <div id="pitchContainer"></div>
    <audio ref="player" :src="musicSrc" controls></audio>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ZegoPitchView } from "~/plugins/ZegoPitchView";
// @ts-ignore
import ffxdz from "~/assets/music/反方向的钟.mp3";
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
    player.onseeked = () => {
      console.log("onseeked", player?.paused, this.pitchView);
      if (player && this.pitchView) {
        this.pitchView.setCurrentSongProgress(player.currentTime * 1000, 0);
      }
    };
    setInterval(() => {
      if (!player.paused && this.pitchView) {
        this.pitchView.setCurrentSongProgress(player.currentTime * 1000, 0);
      }
    }, 100);
  }
});
</script>
<style lang="less" scoped>
#pitchContainer {
  width: 800px;
  height: 240px;
  background-color: #dfdfdf;
  padding: 10px;
}
</style>
