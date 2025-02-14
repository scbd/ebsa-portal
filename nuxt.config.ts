import locales from './i18n/locales'        ;
import en      from './i18n/locales/en.json';
// import pages from './i18n/pages'             ;


export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    baseURL: '/ebsa'
  },
  extends:[
    './layers/scbd-auth'
],
  css: ['bootstrap/dist/css/bootstrap.css','~/assets/main.scss','@scbd/ckeditor5-build-inline-full/build/content-style.css','vue-multiselect/dist/vue-multiselect.min.css'],
  runtimeConfig:{
    algoliaAppId     : '',
    algoliaApiKey : '',
    public: {
      cbdApi: '',
      oasisApi: '',
      googleMapsKey: '',
    }
  },

  modules: [
    '@nuxt/devtools',
    '@nuxtjs/i18n',
    '@nuxt/image',
    'nuxt-delay-hydration',
    '@nuxtjs/google-fonts',
    'nuxt-seo-utils',
    '@nuxt/scripts',
    'nuxt-viewport',
  ],

  router: {
    options: {
      linkActiveClass: "active",
      linkExactActiveClass: "exact-active"
    }
  },
  imports: { presets: [  { from: 'consola', imports: ['consola'] } ] },
  i18n: {
    locales,
    debug                : false,
    baseUrl              : '/',
    messages             :{ en },
    defaultLocale        : 'en',
    fallbackLocale       : 'en',
    locale               : 'en',
    precompile           : { strictMessage: false, },
    lazy                 : true,
    langDir              : '',
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
        },
      },
    },
    server: {
      hmr: { protocol: 'ws', host: 'localhost', clientPort: 3000 }
    }
  },
  delayHydration: { mode: 'init' },
  googleFonts: {
    families: {
      'Source+Sans+Pro': [400,700],
      'Overlock':{
        wght: [700],
        ital: [700]
      }
    }
  }
})