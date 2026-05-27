"use strict";
cc._RF.push(module, '17ccdQaChlP5oMMyYbnrZ5N', 'super_html_playable');
// script/super_html_playable.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.super_html_playable = void 0;
/**
 * super-html playable adapter
 * @help https://store.cocos.com/app/detail/3657
 * @home https://github.com/magician-f/cocos-playable-demo
 * @author https://github.com/magician-f
 */
var super_html_playable = /** @class */ (function () {
    function super_html_playable() {
    }
    super_html_playable.prototype.download = function () {
        console.log("download");
        //@ts-ignore
        if (window.super_html && typeof super_html.download === 'function') {
            super_html.download();
        }
    };
    super_html_playable.prototype.game_end = function () {
        console.log("game end");
        //@ts-ignore
        if (window.super_html && typeof super_html.game_end === 'function') {
            super_html.game_end();
        }
    };
    /**
     * 是否隐藏下载按钮，意味着使用平台注入的下载按钮
     * channel : google
     */
    super_html_playable.prototype.is_hide_download = function () {
        //@ts-ignore
        if (window.super_html && super_html.is_hide_download) {
            //@ts-ignore
            return super_html.is_hide_download();
        }
        return false;
    };
    /**
     * 设置商店地址
     * channel : unity
     * @param url https://play.google.com/store/apps/details?id=com.unity3d.auicreativetestapp
     */
    super_html_playable.prototype.set_google_play_url = function (url) {
        //@ts-ignore
        window.super_html && (super_html.google_play_url = url);
    };
    /**
    * 设置商店地址
    * channel : unity
    * @param url https://apps.apple.com/us/app/ad-testing/id1463016906
    */
    super_html_playable.prototype.set_app_store_url = function (url) {
        //@ts-ignore
        window.super_html && (super_html.appstore_url = url);
    };
    /**
    * 是否开启声音
    * channel : ironsource
    */
    super_html_playable.prototype.is_audio = function () {
        //@ts-ignore
        if (window.super_html && typeof super_html.is_audio === 'function') {
            //@ts-ignore
            return super_html.is_audio();
        }
        return true;
    };
    return super_html_playable;
}());
exports.super_html_playable = super_html_playable;
exports.default = new super_html_playable();

cc._RF.pop();