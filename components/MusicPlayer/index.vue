<template>
  <div class="player-wrap">
    <div class="bg_player_mask"></div>
    <div
      class="bg_player"
      :style="{
        'background-image': `url(
         ${activeMusic.poster}
        )`,
      }"
    ></div>
    <div class="mod_player">
      <div class="player__bd">
        <div id="song_info__info" class="bd-left">
          <img
            class="song_info__pic"
            loading="lazy"
            :src="activeMusic.poster"
            alt="晚风心里吹"
          />
          <div class="info-list">
            <div class="info-item song_info__name">
              <span class="item-key">歌曲名：</span>
              <span class="item-value">{{ activeMusic.songName }}</span>
            </div>
            <div class="info-item song_info__singer">
              <span class="item-key">歌手：</span>
              <span class="item-value">{{ activeMusic.singer }}</span>
            </div>
            <div class="info-item song_info__album">
              <span class="item-key">专辑：</span>
              <span class="item-value">{{ activeMusic.album }}</span>
            </div>
          </div>
        </div>
        <div id="song_info__lyric" ref="lyricBox" class="bd-right"></div>
      </div>
      <div :id="playerId"></div>
    </div>
    <!-- <div id="canvas">
      <canvas width="550" height="110"></canvas>
    </div> -->
    <div id="mask"></div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import musicList from "./musicList";

export default Vue.extend({
  name: "MusicPlayer",
  props: {
    playerId: {
      type: String,
      required: true,
      default: "music-player",
    },
  },
  data(): {
    musicList: any[];
    activeMusic: any;
    player: any;
  } {
    return {
      musicList: musicList,
      activeMusic: musicList[0],
      player: null,
    };
  },
  watch: {
    activePlayer: {
      handler(val) {
        if (!document) return;
        document.title = val.name + " - Music Time";
      },
    },
  },
  methods: {
    initPlayer() {
      this.player = new (this as any).$XGMusicPlayer({
        id: this.playerId,
        url: this.musicList,
        volume: 0.5,
        volumeShow: true,
        width: "100%",
      });
      const { player } = this;
      player.crossOrigin = "anonymous";
      let nullText = 0;
      player.on("lyricUpdate", (res: any) => {
        console.log("lyricUpdate", res);
        if (res.lyric === "\n") {
          // nullText++;
        }
      });
      if (this.activeMusic.lyric) {
        player.lyric(this.activeMusic.lyric, this.$refs.lyricBox);
        player.__lyric__.show();
      }
      // var an = player.analyze(document.querySelector("canvas"));
      // an.style = {
      //   bgColor: "#c8c8c8",
      //   color: "#909099",
      // };
      player.on("change", ({ name }: any) => {
        this.activeMusic = this.musicList.find((item) => item.name === name);
        const lyricBox = this.$refs.lyricBox as Element;
        if (!lyricBox) {
          throw Error("lyric box not found!");
        }
        while (lyricBox.firstChild) {
          lyricBox?.removeChild(lyricBox.firstChild);
        }
        if (this.activeMusic.lyric) {
          debugger;
          player.off("lyricUpdate", player.__lyric__.__updateHandle__);
          player.off("lyricUpdate", player.__lyric__.__handle__);
          player.__lyric__.__updateHandle__ = () => {};
          player.__lyric__.__handle__ = () => {};
          player.lyric(this.activeMusic.lyric, lyricBox);
          player.__lyric__.show();
        }
      });
    },
  },
  mounted() {
    document.title = this.activeMusic.name + " - Music Time";
    this.initPlayer();
  },
});
</script>

<style lang="less">
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
        .info-list {
          min-width: 320px;
          margin: 0 auto;
          text-align: left;
          .item-key {
            width: 100px;
            text-align: right;
            display: inline-block;
          }
        }
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
          min-width: 220px;
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

        .xgplayer-lrcBack,
        .xgplayer-lrcForward {
          display: none;
        }
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
              height: 40px;
              line-height: 40px;
              font-size: 18px;
              color: #31c27c;
            }
          }
        }
      }
    }
    .player__ft,
    .xgplayer {
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
      .xgplayer-cover {
        display: none;
      }
    }
  }
}
@media screen and (max-width: 500px) {
  .player-wrap {
    width: 100%;
    height: auto;
    padding-top: 50px;
    .mod_player {
      // bottom: 0;
      // left: 0;
      position: relative;
      // margin-bottom: 4%;
      // background: rgba(0, 0, 0, 0);
      // background-image: none;
      .player__bd {
        flex-direction: column;
        position: relative;
        left: 0;
        top: 0;
        .bd-right,
        .bd-left {
          flex: auto;
        }
        .bd-right {
          height: 200px;
          margin-top: 10px;
        }
      }
      .xgplayer.xgplayer-mobile {
        position: relative;
        margin: 0;
        padding-bottom: 10px;
        .xgplayer-controls {
          display: flex;
          justify-content: center;
          .xgplayer-time,
          .xgplayer-progress,
          .xgplayer-placeholder {
            visibility: hidden;
            position: absolute;
            margin-bottom: 50px;
          }
        }
      }
    }
  }
}
</style>
