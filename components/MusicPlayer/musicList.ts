// // @ts-ignore
// import mp3Wenfeng from ;
// // import mp3Wenfeng from './music/问风-Keen.mp3';
// @ts-ignore
import mp3Wenfeng from '~/assets/music/wenfeng.mp3'
// @ts-ignore
import xiangjianni from '~/assets/music/xiangjianni.mp3'
// @ts-ignore
import hxazgsj from '~/assets/music/hxazgsj.mp3'
import lrcWenfeng from '~/assets/music/wenfeng'
import lrcXjn from '~/assets/music/xiangjianni'
import lrcHxazgsj from '~/assets/music/hxazgsj'
const musicList = [
  {
    src: hxazgsj,
    poster:
      "https://y.qq.com/music/photo_new/T002R300x300M000000QS9AZ18Dbnb_1.jpg?max_age=2592000",
    lyric: lrcHxazgsj,
    songName: "好想爱这个世界啊",
    singer: "Keen",
    album: "王牌对王牌第五季 第12期"
  },
  {
    src: xiangjianni,
    poster:
      "https://y.qq.com/music/photo_new/T002R300x300M000003MlPxI0gqWpU_1.jpg?max_age=2592000",
    lyric: lrcXjn,
    songName: "想见你想见你想见你",
    singer: "Keen",
    album: "想见你"
  },
  {
    src: mp3Wenfeng,
    poster:
      "http://p1.music.126.net/M1gk3yEHg5TnPlj1-w4Mzw==/109951166466504110.jpg?param=177y177",
    lyric: lrcWenfeng,
    songName: "问风",
    singer: "Keen",
    album: "问风"
  },
  {
    src: "//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/music/audio.mp3",
    poster:
      "//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/music/poster-small.jpeg",
    lyric: `[00:00.00] 脆弱一分钟\n[00:00.00] 作曲 : 林家谦\n[00:00.00] 作词 : 徐世珍/吴辉福\n[00:00.000]编曲：林家谦\n[00:00.000]时钟不要走\n[00:04.220]让我脆弱一分钟\n[00:07.440]要多久才能习惯被放手\n[00:15.800]马克杯空了 暖暖的温热\n[00:22.660]却还在我手中停留\n[00:27.960]\n[00:29.790]勇气不要走\n[00:32.200]给我理由再冲动\n[00:35.690]去相信爱情 就算还在痛\n[00:43.960]如果我不说不会有人懂\n[00:50.720]失去你我有多寂寞\n[00:55.610]还是愿意\n[00:57.580]付出一切仅仅为了一个好梦\n[01:03.980]梦里有人真心爱我 陪我快乐也陪我沉默\n[01:11.260]没有无缘无故的痛承受越多越成熟\n[01:18.630]能让你拥抱更好的我\n[01:25.030] 谁也不要走\n[01:28.270]应该是一种奢求\n[01:31.900]可是我只想 握紧你的手\n[01:39.780]我宁愿等候 也不愿错过\n[01:46.630]你对我微笑的时候\n[01:56.780]\n[02:18.910]还是愿意\n[02:21.320]用尽全力仅仅为了一个以后\n[02:27.870]哪怕生命并不温柔哪怕被幸福一再反驳\n[02:34.870]也要相信伤痕累累 其实只是在琢磨\n[02:42.070]能让你为之一亮 的我\n[02:53.910]\n[02:56.350]制作人：林宥嘉\n[02:57.750]制作助理：张婕汝\n[02:59.010]录音师：陈文骏、叶育轩\n[03:00.410]录音室：白金录音室\n[03:01.740]混音师：SimonLi @ nOiz\n[03:03.000]OP: Terence Lam Production & Co. (Warner/Chappell Music, HK Ltd.)\n[03:04.050]SP: Warner/Chappell Music Taiwan Ltd.\n[03:04.910]OP：Universal Ms Publ Ltd Taiwan\n`,
    songName: "脆弱一分钟",
    singer: "林宥嘉",
    album: "脆弱一分钟"
  },
].map((item: any) => ({
  name: `${item.singer} · ${item.songName}`,
  ...item,
}))
export default musicList
