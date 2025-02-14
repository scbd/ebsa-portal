import vClickOutside from 'click-outside-vue3';
import { createVfm } from 'vue-final-modal';

export default defineNuxtPlugin({
    name: 'site',
    async setup (nuxtApp){
        const vfm = createVfm();
        
        nuxtApp.vueApp.use(vClickOutside);
        nuxtApp.vueApp.use(vfm);




        // nuxtApp.hook('i18n:beforeLocaleSwitch', async ({ oldLocale, newLocale }) => {
        //     consola.info('local-change', { oldLocale, newLocale });
        // })

    }
});




