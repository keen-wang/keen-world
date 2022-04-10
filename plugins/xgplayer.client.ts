

import 'xgplayer';
import Music from 'xgplayer-music';

export default defineNuxtPlugin((nuxtApp) => {
    // Doing something with nuxtApp
    return {
        provide: {
            xgplayer: Music,
        },
    }
})