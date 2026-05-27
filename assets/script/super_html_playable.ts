/**
 * super-html playable adapter
 * @help https://store.cocos.com/app/detail/3657
 * @home https://github.com/magician-f/cocos-playable-demo
 * @author https://github.com/magician-f
 */
interface SuperHtmlApi {
    download?: () => void;
    game_end?: () => void;
    is_hide_download?: () => boolean;
    google_play_url?: string;
    appstore_url?: string;
    is_audio?: () => boolean;
}

declare global {
    interface Window {
        super_html?: SuperHtmlApi;
    }
}

export class super_html_playable {

    download() {
        console.log("download");
        const api = window.super_html;
        if (api && typeof api.download === 'function') {
            api.download();
        }
    }

    game_end() {
        console.log("game end");
        const api = window.super_html;
        if (api && typeof api.game_end === 'function') {
            api.game_end();
        }
    }

    /**
     * 是否隐藏下载按钮，意味着使用平台注入的下载按钮
     * channel : google
     */
    is_hide_download() {
        const api = window.super_html;
        if (api && api.is_hide_download) {
            return api.is_hide_download();
        }
        return false
    }

    /**
     * 设置商店地址
     * channel : unity
     * @param url https://play.google.com/store/apps/details?id=com.unity3d.auicreativetestapp
     */
    set_google_play_url(url: string) {
        const api = window.super_html;
        if (api) {
            api.google_play_url = url;
        }
    }

    /**
    * 设置商店地址
    * channel : unity
    * @param url https://apps.apple.com/us/app/ad-testing/id1463016906
    */
    set_app_store_url(url: string) {
        const api = window.super_html;
        if (api) {
            api.appstore_url = url;
        }
    }

    /**
    * 是否开启声音
    * channel : ironsource
    */
    is_audio() {
        const api = window.super_html;
        if (api && typeof api.is_audio === 'function') {
            return api.is_audio();
        }
        return true;
    }


}
export default new super_html_playable();