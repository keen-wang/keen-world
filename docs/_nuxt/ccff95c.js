(window.webpackJsonp=window.webpackJsonp||[]).push([[7,6],{455:function(t,n,e){var r=e(3),o=e(207),c=e(148);r({target:"Array",proto:!0},{fill:o}),c("fill")},458:function(t,n,e){"use strict";e.r(n),e.d(n,"Bubble",(function(){return c})),e.d(n,"random",(function(){return h})),e.d(n,"randomColor",(function(){return l}));var r=e(208),o=e(209),c=(e(455),e(89),function(){function t(n,e,o){Object(r.a)(this,t),this.context=n,this.w=e,this.h=o,this.r=h(30,80),this.x=h(this.r,e-this.r),this.y=h(this.r,o-this.r),this.color=l(),this.vx=h(-2,2)||h(-2,2),this.vy=h(-1,1)||h(-1,1)}return Object(o.a)(t,[{key:"draw",value:function(){var t=this.context;t.beginPath(),t.fillStyle=this.color,t.arc(this.x,this.y,this.r,0,2*Math.PI),t.fill()}},{key:"move",value:function(){this.x+=this.vx,this.y+=this.vy,(this.x<this.r||this.x+this.r>this.w)&&(this.vx=-this.vx),(this.y<this.r||this.y+this.r>this.h)&&(this.vy=-this.vy),this.draw()}},{key:"resize",value:function(t,n){this.w=t,this.h=n}}]),t}());function h(t,n){return Math.floor(Math.random()*(n-t)+t)}function l(){var t,g,b,a;return t=h(0,255),g=h(0,255),b=h(0,255),a=Math.random(),"rgba(".concat(t,",").concat(g,",").concat(b,",").concat(a,")")}},461:function(t,n,e){var content=e(471);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(147).default)("1b7833da",content,!0,{sourceMap:!1})},462:function(t,n,e){var content=e(473);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(147).default)("52be5f6e",content,!0,{sourceMap:!1})},470:function(t,n,e){"use strict";e(461)},471:function(t,n,e){var r=e(146)(!1);r.push([t.i,"*{margin:0;padding:0}",""]),t.exports=r},472:function(t,n,e){"use strict";e(462)},473:function(t,n,e){var r=e(146)(!1);r.push([t.i,".home-wrap[data-v-7341d5bb]{position:relative;background-color:#45535a;height:100%;width:100%;display:flex;justify-content:center}.home-wrap canvas[data-v-7341d5bb]{background-color:#defdf5;display:block;position:absolute;left:0;top:0;height:100vh;width:100vw}.home-wrap .content[data-v-7341d5bb]{width:300px;z-index:1;text-align:center;padding:30px;margin-top:20%}.home-wrap .content h1[data-v-7341d5bb]{font-family:sans-serif;-webkit-text-stroke:2px #fff;color:#000}.home-wrap .content a[data-v-7341d5bb]{font-size:16px}",""]),t.exports=r},479:function(t,n,e){"use strict";e.r(n);e(20),e(40),e(73),e(59),e(46),e(71),e(33),e(32),e(39),e(60),e(72),e(41);var r=e(1),o=e(458);function c(t,n){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=function(t,n){if(!t)return;if("string"==typeof t)return h(t,n);var e=Object.prototype.toString.call(t).slice(8,-1);"Object"===e&&t.constructor&&(e=t.constructor.name);if("Map"===e||"Set"===e)return Array.from(t);if("Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return h(t,n)}(t))||n&&t&&"number"==typeof t.length){e&&(t=e);var i=0,r=function(){};return{s:r,n:function(){return i>=t.length?{done:!0}:{done:!1,value:t[i++]}},e:function(t){throw t},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,c=!0,l=!1;return{s:function(){e=e.call(t)},n:function(){var t=e.next();return c=t.done,t},e:function(t){l=!0,o=t},f:function(){try{c||null==e.return||e.return()}finally{if(l)throw o}}}}function h(t,n){(null==n||n>t.length)&&(n=t.length);for(var i=0,e=new Array(n);i<n;i++)e[i]=t[i];return e}var l=r.default.extend({data:function(){return{bubbleList:[],canvas:null,canContext:null,showBG:!1}},methods:{create:function(t){if(this.canContext)for(var i=0;i<t;i++){var n=new o.Bubble(this.canContext,window.innerWidth,window.innerHeight);n.draw(),this.bubbleList.push(n)}},resize:function(){var t=window.innerWidth,n=window.innerHeight;this.canvas.width=t,this.canvas.height=n,this.bubbleList.forEach((function(e){e.resize(t,n)}))}},mounted:function(){var t,n=this;this.canvas=document.querySelector("canvas"),this.canContext=(null===(t=this.canvas)||void 0===t?void 0:t.getContext("2d"))||null,this.create(30),setInterval((function(){if(n.canContext){n.canContext.clearRect(0,0,window.innerWidth,window.innerHeight);var t,e=c(n.bubbleList);try{for(e.s();!(t=e.n()).done;){t.value.move()}}catch(t){e.e(t)}finally{e.f()}}}),1e3/60),this.resize(),window.onresize=this.resize}}),f=(e(470),e(472),e(70)),component=Object(f.a)(l,(function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"home-wrap"},[e("canvas"),t._v(" "),e("div",{staticClass:"content"},[e("h1",[t._v("Keen World!")]),t._v(" "),e("div",[e("NuxtLink",{attrs:{to:"/"}},[t._v("home")]),t._v(" |\n      "),e("NuxtLink",{attrs:{to:"/music"}},[t._v("music player")])],1)])])}),[],!1,null,"7341d5bb",null);n.default=component.exports}}]);