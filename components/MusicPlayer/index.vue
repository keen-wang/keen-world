<template>
  <div class="player-wrap">
    <div class="bg_player_mask"></div>
    <div
      class="bg_player"
      :style="{
        'background-image': `url(
         ${data.activeMusic.poster}
        )`,
      }"
    ></div>
    <div class="mod_player">
      <div class="player__bd">
        <div id="song_info__info" class="bd-left">
          <img
            class="song_info__pic"
            loading="lazy"
            :src="data.activeMusic.poster"
            data-qar-def="//y.qq.com/mediastyle/global/img/album_300.png?max_age=2592000"
            alt="晚风心里吹"
          />
          <div class="song_info__name">
            歌曲名： {{ data.activeMusic.songName }}
          </div>
          <div class="song_info__singer">
            歌手： {{ data.activeMusic.singer }}
          </div>
          <div class="song_info__album">专辑：{{ data.activeMusic.album }}</div>
        </div>
        <div id="song_info__lyric" class="bd-right"></div>
      </div>
      <div class="player__ft" :id="id"></div>
    </div>
    <!-- <div id="canvas">
      <canvas width="550" height="110"></canvas>
    </div> -->
    <div id="mask"></div>
  </div>
</template>
<script setup>
import { onMounted, watch } from "vue";
import musicList from "./musicList";
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
  document.title = "Music Time";
  try {
    initPlayer();
  } catch (error) {
    console.error(error.toString());
  }
});
const { $xgplayer } = useNuxtApp();
let player = undefined;
const data = reactive({
  list: musicList,
  activeMusic: musicList[0],
});
const initPlayer = () => {
  player = new $xgplayer({
    id: props.id,
    url: data.list,
    volume: 0.5,
    volumeShow: true,
    width: "100%",
  });
  player.crossOrigin = "anonymous";
  // let nullText = 0;
  // player.on("lyricUpdate", (res) => {
  //   console.log(res);
  //   if (res.lyric === "\n") {
  //     nullText++;
  //   }
  // });

  player.lyric(
    data.activeMusic.lyric,
    document.querySelector("#song_info__lyric")
  );
  player.__lyric__.show();
  // var an = player.analyze(document.querySelector("canvas"));
  // an.style = {
  //   bgColor: "#c8c8c8",
  //   color: "#909099",
  // };
  player.on("change", ({ name }) => {
    player.__lyric__.unbind(player);
    document.querySelector("#song_info__lyric").innerHTML = "";
    data.activeMusic = musicList.find((item) => item.name === name);
    player.lyric(
      data.activeMusic.lyric,
      document.querySelector("#song_info__lyric")
    );
    document.title = data.activeMusic.name + " - Music Time";
    player.__lyric__.show();
  });
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
    .player__bd {
      position: absolute;
      width: 100%;
      top: 11%;
      bottom: 18%;
      min-height: 328px;
      cursor: default;
      display: flex;
      .bd-left,
      .bd-right {
        flex: 1;
        height: 100%;
      }
      #song_info__info {
        display: flex;
        flex-direction: column;
        text-align: center;
        font-size: 14px;
        line-height: 24px;
        color: hsla(0, 0%, 88.2%, 0.8);
        align-items: center;
        justify-content: center;
        .song_info__album,
        .song_info__name,
        .song_info__singer {
          white-space: nowrap;
          width: 100%;
          text-overflow: ellipsis;
          height: 28px;
        }
        .song_info__name {
          margin-top: 15px;
        }
        .song_info__pic {
          height: 60%;
          margin: 0 auto;
        }
      }
      #song_info__lyric {
        -webkit-mask-image: linear-gradient(
          180deg,
          hsla(0, 0%, 100%, 0) 0,
          hsla(0, 0%, 100%, 0.6) 15%,
          #fff 25%,
          #fff 75%,
          hsla(0, 0%, 100%, 0.6) 85%,
          hsla(0, 0%, 100%, 0)
        );
        .xgplayer-lrcWrap {
          height: 100%;
          text-align: center;
          border: 0;
          box-sizing: border-box;
          &::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }
          &::-webkit-scrollbar-thumb {
            background-color: #cccccc2e;
            border-radius: 5px;
          }
          &::-webkit-scrollbar-track {
            background: transparent;
          }
          .xgplayer-lyric-item {
            color: hsla(0, 0%, 88.2%, 0.8);
            height: 26px;
            line-height: 26px;
            &.xgplayer-lyric-item-active {
              height: 34px;
              line-height: 34px;
              font-size: 16px;
              color: #31c27c;
            }
          }
        }
      }
    }
    .xgplayer-music.player__ft {
      bottom: 0;
      left: 0;
      position: absolute;
      margin-bottom: 4%;
      background: #0000;
      background-image: none;
      .xgplayer-controls {
        background: #0000;
        .xgplayer-progress-played {
          background-image: linear-gradient(-90deg, #47f3bb, #81d998);
        }
        .xgplayer-drag {
          background: linear-gradient(-90deg, #47f3bb, #81d998);
        }
      }
    }
  }
}
</style>