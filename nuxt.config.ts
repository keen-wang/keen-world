
import { NuxtConfig } from '@nuxt/types'

const config: NuxtConfig = {
  // 在编写配置文件时，使用自动完成以及类型检查 // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'keen-world',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  router: {
    base: '/keen-world/'
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/element-ui', ssr: true },
    { src: '@/plugins/xgplayer', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],
  loaders: [{ // 配置mp3音频格式loader，否则音频文件无法正常引用
    enforce: 'pre',
    test: /\.(mp3|pdf)(\?.*)?$/,
    loader: 'url-loader',
    exclude: /(node_modules)/
  }],
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/, "xgplayer"],
    // extend(config, { isDev, isClient }) {

    //   // // Run ESLint on save
    //   // const vueLoader = config.module.rules.find((loader) => loader.loader === 'vue-loader');
    //   // /* 把audio标签在编译时转成src属性 */
    //   // vueLoader.options.transformToRequire = {
    //   //   audio: 'src'
    //   // };
    //   /* 对mp3等格式的文件用url-loader进行处理 */
    //   config.module.rules.push({
    //     test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
    //     loader: 'url-loader',
    //     options: {
    //       limit: 10000,
    //       name: process.env.NODE_ENV === 'production'
    //         ? path.posix.join('./', 'media/[name].[hash:7].[ext]')
    //         : path.posix.join('./', 'media/[name].[hash:7].[ext]')
    //     }
    //   });
    //   // if (isDev && isClient) {
    //   //   config.module.rules.push({
    //   //     enforce: 'pre',
    //   //     test: /\.(js|vue)$/,
    //   //     loader: 'eslint-loader',
    //   //     exclude: /(node_modules)/
    //   //   });
    //   // }

    // }

    extend(config, { isDev }) {
      if (isDev) {
        config.devtool = 'eval-source-map'
      }
      if (!config.module) return
      // config.module.rules.some((loader) => {
      //   if (loader.use) {
      //     //这里需要用indexOf
      //     const urlLoader = (loader.use as any).find((use: any) => ~use.loader.indexOf('url-loader'))
      //     if (urlLoader) {
      //       // Increase limit to 100KO
      //       urlLoader.options.limit = 100000
      //       return true
      //     }
      //   }
      //   return false
      // })
      config.module.rules.push({
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac|txt)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000000,
          name: 'media/[name].[hash:7].[ext]'
        }
      });
    }
  },
  // typescript: {
  //   typeCheck: {
  //     eslint: {
  //       files: './**/*.{ts,js,vue}'
  //     }
  //   }
  // }
}

export default config
