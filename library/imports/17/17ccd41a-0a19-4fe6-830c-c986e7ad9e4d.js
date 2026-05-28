"use strict";
cc._RF.push(module, '17ccdQaChlP5oMMyYbnrZ5N', 'super_html_playable');
// script/super_html_playable.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.super_html_playable = void 0;
var super_html_playable = /** @class */ (function () {
    function super_html_playable() {
    }
    super_html_playable.prototype.download = function () {
        console.log("download");
        var api = window.super_html;
        if (api && typeof api.download === 'function') {
            api.download();
        }
    };
    super_html_playable.prototype.game_end = function () {
        console.log("game end");
        var api = window.super_html;
        if (api && typeof api.game_end === 'function') {
            api.game_end();
        }
    };
    /**
     * 是否隐藏下载按钮，意味着使用平台注入的下载按钮
     * channel : google
     */
    super_html_playable.prototype.is_hide_download = function () {
        var api = window.super_html;
        if (api && api.is_hide_download) {
            return api.is_hide_download();
        }
        return false;
    };
    /**
     * 设置商店地址
     * channel : unity
     * @param url https://play.google.com/store/apps/details?id=com.unity3d.auicreativetestapp
     */
    super_html_playable.prototype.set_google_play_url = function (url) {
        var api = window.super_html;
        if (api) {
            api.google_play_url = url;
        }
    };
    /**
    * 设置商店地址
    * channel : unity
    * @param url https://apps.apple.com/us/app/ad-testing/id1463016906
    */
    super_html_playable.prototype.set_app_store_url = function (url) {
        var api = window.super_html;
        if (api) {
            api.appstore_url = url;
        }
    };
    /**
    * 是否开启声音
    * channel : ironsource
    */
    super_html_playable.prototype.is_audio = function () {
        var api = window.super_html;
        if (api && typeof api.is_audio === 'function') {
            return api.is_audio();
        }
        return true;
    };
    return super_html_playable;
}());
exports.super_html_playable = super_html_playable;
exports.default = new super_html_playable();

cc._RF.pop();