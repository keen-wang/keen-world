<template>
  <div class="player-wrap">
    <div class="bg_player_mask"></div>
    <div class="bg_player" style=""></div>
    <div class="mod_player">
      <div class="player__ft" :id="id"></div>
    </div>
    <!-- <div id="left">
      <div id="album"></div>
      <div id="info">
        脆弱一分钟
        <div>歌手：林宥嘉</div>
        <div>专辑：脆弱一分钟</div>
      </div>
    </div> -->
    <!-- <div id="canvas">
      <canvas width="550" height="110"></canvas>
    </div>
    <div id="mask"><div id="gc"></div></div>

    <div id="mse"></div> -->
  </div>
</template>
<script setup>
import { onMounted, watch } from "vue";
const props = defineProps({
  id: {
    type: String,
    required: true,
    default: "music-player",
  },
});
watch(
  () => props.videoUrl,
  (newUrl) => {
    initPlayer();
  },
  {
    deep: true,
  }
);
onMounted(() => {
  try {
    initPlayer();
  } catch (error) {
    console.error(error.toString());
  }
});
const { $xgplayer } = useNuxtApp();
const initPlayer = () => {
  let player = new $xgplayer({
    id: props.id,
    url: [
      {
        src: "//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/music/audio.mp3",
        name: "林宥嘉·脆弱一分钟",
        poster:
          "//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/music/poster-small.jpeg",
      },
    ],
    volume: 0.8,
    width: "100%",
  });
  // player.crossOrigin = "anonymous";
  // let lyric = `[00:00.00] 脆弱一分钟\n[00:00.00] 作曲 : 林家谦\n[00:00.00] 作词 : 徐世珍/吴辉福\n[00:00.000]编曲：林家谦\n[00:00.000]时钟不要走\n[00:04.220]让我脆弱一分钟\n[00:07.440]要多久才能习惯被放手\n[00:15.800]马克杯空了 暖暖的温热\n[00:22.660]却还在我手中停留\n[00:27.960]\n[00:29.790]勇气不要走\n[00:32.200]给我理由再冲动\n[00:35.690]去相信爱情 就算还在痛\n[00:43.960]如果我不说不会有人懂\n[00:50.720]失去你我有多寂寞\n[00:55.610]还是愿意\n[00:57.580]付出一切仅仅为了一个好梦\n[01:03.980]梦里有人真心爱我 陪我快乐也陪我沉默\n[01:11.260]没有无缘无故的痛承受越多越成熟\n[01:18.630]能让你拥抱更好的我\n[01:25.030] 谁也不要走\n[01:28.270]应该是一种奢求\n[01:31.900]可是我只想 握紧你的手\n[01:39.780]我宁愿等候 也不愿错过\n[01:46.630]你对我微笑的时候\n[01:56.780]\n[02:18.910]还是愿意\n[02:21.320]用尽全力仅仅为了一个以后\n[02:27.870]哪怕生命并不温柔哪怕被幸福一再反驳\n[02:34.870]也要相信伤痕累累 其实只是在琢磨\n[02:42.070]能让你为之一亮 的我\n[02:53.910]\n[02:56.350]制作人：林宥嘉\n[02:57.750]制作助理：张婕汝\n[02:59.010]录音师：陈文骏、叶育轩\n[03:00.410]录音室：白金录音室\n[03:01.740]混音师：SimonLi @ nOiz\n[03:03.000]OP: Terence Lam Production & Co. (Warner/Chappell Music, HK Ltd.)\n[03:04.050]SP: Warner/Chappell Music Taiwan Ltd.\n[03:04.910]OP：Universal Ms Publ Ltd Taiwan\n`;
  // let nullText = 0;
  // player.on("lyricUpdate", (res) => {
  //   console.log(res);
  //   if (res.lyric === "\n") {
  //     nullText++;
  //   }
  // });
  // var an = player.analyze(document.querySelector("canvas"));
  // an.style = {
  //   bgColor: "#c8c8c8",
  //   color: "#909099",
  // };
  // player.on("playing", function () {
  //   player.lyric(lyric, document.querySelector("#gc"));
  //   player.__lyric__.show();
  //   player.mode = 2;
  // });
};
</script>
<style lang="less" scope>
.player-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #45535a;
  .bg_player_mask,
  .bg_player {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
  }
  .bg_player_mask {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #292a2b;
    background-color: rgba(0, 0, 0, 0.35);
    z-index: 2;
  }
  .bg_player {
    // 设置背景
    display: block;
    background-image: url(//y.qq.com/music/photo_new/T002R300x300M000000Hg3fW1GN9NF.jpg?max_age=2592000);
    background-color: rgb(255, 255, 255);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50%;
    background-position-x: 50%;
    background-position-y: center;
    filter: blur(65px);
    opacity: 0.6;
    transform: translateZ(0);
  }
  .mod_player {
    height: 100vh;
    margin: 0 7.638889%;
    position: relative;
    z-index: 3;
    .xgplayer-music.player__ft {
      bottom: 0;
      left: 0;
      position: absolute;
      margin-bottom: 4%;
      .xgplayer-controls {
        background-color: #0000;
        background-image: none;
      }
    }
  }
}
</style>