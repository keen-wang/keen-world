<template>
  <div class="home-wrap">
    <canvas></canvas>
    <div class="content">
      <h1>Keen World!</h1>
      <div>
        <NuxtLink to="/">home</NuxtLink> |
        <NuxtLink to="/music">music player</NuxtLink>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Bubble } from "./bubble";

export default Vue.extend({
  data(): {
    bubbleList: Bubble[];
    canvas: HTMLCanvasElement | null;
    canContext: CanvasRenderingContext2D | null;
    showBG: boolean;
  } {
    return {
      bubbleList: [],
      canvas: null,
      canContext: null,
      showBG: false,
    };
  },
  methods: {
    create(num: number) {
      if (!this.canContext) return;
      for (var i = 0; i < num; i++) {
        var bubble = new Bubble(
          this.canContext,
          window.innerWidth,
          window.innerHeight
        );
        bubble.draw();
        this.bubbleList.push(bubble);
      }
    },
    resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.canvas!.width = w;
      this.canvas!.height = h;
      this.bubbleList.forEach((item) => {
        item.resize(w, h);
      });
    },
  },
  mounted() {
    this.canvas = document.querySelector("canvas");
    this.canContext = this.canvas?.getContext("2d") || null;
    this.create(30);
    setInterval(() => {
      if (!this.canContext) return;
      this.canContext.clearRect(0, 0, window.innerWidth, window.innerHeight); //必须有这一句，不然贱泪横生
      for (var item of this.bubbleList) {
        item.move();
      }
    }, 1000 / 60);
    this.resize();
    window.onresize = this.resize;
  },
});
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
</style>
<style lang="less" scoped>
.home-wrap {
  position: relative;
  background-color: #45535a;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  canvas {
    background-color: #defdf5;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    height: 100vh;
    width: 100vw;
  }
  .content {
    width: 300px;
    z-index: 1;
    text-align: center;
    padding: 30px;
    margin-top: 20%;
    h1 {
      font-family: sans-serif;
      -webkit-text-stroke: 2px #fff;
      color: black;
    }
    a {
      font-size: 16px;
    }
  }
}
</style>
