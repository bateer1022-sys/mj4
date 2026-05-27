
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/super_html_playable.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvc3VwZXJfaHRtbF9wbGF5YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7R0FLRztBQUNIO0lBQUE7SUFpRUEsQ0FBQztJQS9ERyxzQ0FBUSxHQUFSO1FBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4QixZQUFZO1FBQ1osSUFBSSxNQUFNLENBQUMsVUFBVSxJQUFJLE9BQU8sVUFBVSxDQUFDLFFBQVEsS0FBSyxVQUFVLEVBQUU7WUFDaEUsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3pCO0lBQ0wsQ0FBQztJQUVELHNDQUFRLEdBQVI7UUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hCLFlBQVk7UUFDWixJQUFJLE1BQU0sQ0FBQyxVQUFVLElBQUksT0FBTyxVQUFVLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRTtZQUNoRSxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDekI7SUFDTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsOENBQWdCLEdBQWhCO1FBQ0ksWUFBWTtRQUNaLElBQUksTUFBTSxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsZ0JBQWdCLEVBQUU7WUFDbEQsWUFBWTtZQUNaLE9BQU8sVUFBVSxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDeEM7UUFDRCxPQUFPLEtBQUssQ0FBQTtJQUNoQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGlEQUFtQixHQUFuQixVQUFvQixHQUFXO1FBQzNCLFlBQVk7UUFDWixNQUFNLENBQUMsVUFBVSxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQ7Ozs7TUFJRTtJQUNGLCtDQUFpQixHQUFqQixVQUFrQixHQUFXO1FBQ3pCLFlBQVk7UUFDWixNQUFNLENBQUMsVUFBVSxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQ7OztNQUdFO0lBQ0Ysc0NBQVEsR0FBUjtRQUNJLFlBQVk7UUFDWixJQUFJLE1BQU0sQ0FBQyxVQUFVLElBQUksT0FBTyxVQUFVLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRTtZQUNoRSxZQUFZO1lBQ1osT0FBTyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDaEM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBR0wsMEJBQUM7QUFBRCxDQWpFQSxBQWlFQyxJQUFBO0FBakVZLGtEQUFtQjtBQWtFaEMsa0JBQWUsSUFBSSxtQkFBbUIsRUFBRSxDQUFDIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBzdXBlci1odG1sIHBsYXlhYmxlIGFkYXB0ZXJcbiAqIEBoZWxwIGh0dHBzOi8vc3RvcmUuY29jb3MuY29tL2FwcC9kZXRhaWwvMzY1N1xuICogQGhvbWUgaHR0cHM6Ly9naXRodWIuY29tL21hZ2ljaWFuLWYvY29jb3MtcGxheWFibGUtZGVtb1xuICogQGF1dGhvciBodHRwczovL2dpdGh1Yi5jb20vbWFnaWNpYW4tZlxuICovXG5leHBvcnQgY2xhc3Mgc3VwZXJfaHRtbF9wbGF5YWJsZSB7XG5cbiAgICBkb3dubG9hZCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJkb3dubG9hZFwiKTtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGlmICh3aW5kb3cuc3VwZXJfaHRtbCAmJiB0eXBlb2Ygc3VwZXJfaHRtbC5kb3dubG9hZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgc3VwZXJfaHRtbC5kb3dubG9hZCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2FtZV9lbmQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZ2FtZSBlbmRcIik7XG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICBpZiAod2luZG93LnN1cGVyX2h0bWwgJiYgdHlwZW9mIHN1cGVyX2h0bWwuZ2FtZV9lbmQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHN1cGVyX2h0bWwuZ2FtZV9lbmQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOaYr+WQpumakOiXj+S4i+i9veaMiemSru+8jOaEj+WRs+edgOS9v+eUqOW5s+WPsOazqOWFpeeahOS4i+i9veaMiemSrlxuICAgICAqIGNoYW5uZWwgOiBnb29nbGVcbiAgICAgKi9cbiAgICBpc19oaWRlX2Rvd25sb2FkKCkge1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgaWYgKHdpbmRvdy5zdXBlcl9odG1sICYmIHN1cGVyX2h0bWwuaXNfaGlkZV9kb3dubG9hZCkge1xuICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICByZXR1cm4gc3VwZXJfaHRtbC5pc19oaWRlX2Rvd25sb2FkKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6K6+572u5ZWG5bqX5Zyw5Z2AXG4gICAgICogY2hhbm5lbCA6IHVuaXR5XG4gICAgICogQHBhcmFtIHVybCBodHRwczovL3BsYXkuZ29vZ2xlLmNvbS9zdG9yZS9hcHBzL2RldGFpbHM/aWQ9Y29tLnVuaXR5M2QuYXVpY3JlYXRpdmV0ZXN0YXBwXG4gICAgICovXG4gICAgc2V0X2dvb2dsZV9wbGF5X3VybCh1cmw6IHN0cmluZykge1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgd2luZG93LnN1cGVyX2h0bWwgJiYgKHN1cGVyX2h0bWwuZ29vZ2xlX3BsYXlfdXJsID0gdXJsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIOiuvue9ruWVhuW6l+WcsOWdgFxuICAgICogY2hhbm5lbCA6IHVuaXR5XG4gICAgKiBAcGFyYW0gdXJsIGh0dHBzOi8vYXBwcy5hcHBsZS5jb20vdXMvYXBwL2FkLXRlc3RpbmcvaWQxNDYzMDE2OTA2XG4gICAgKi9cbiAgICBzZXRfYXBwX3N0b3JlX3VybCh1cmw6IHN0cmluZykge1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgd2luZG93LnN1cGVyX2h0bWwgJiYgKHN1cGVyX2h0bWwuYXBwc3RvcmVfdXJsID0gdXJsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIOaYr+WQpuW8gOWQr+WjsOmfs1xuICAgICogY2hhbm5lbCA6IGlyb25zb3VyY2VcbiAgICAqL1xuICAgIGlzX2F1ZGlvKCkge1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgaWYgKHdpbmRvdy5zdXBlcl9odG1sICYmIHR5cGVvZiBzdXBlcl9odG1sLmlzX2F1ZGlvID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgIHJldHVybiBzdXBlcl9odG1sLmlzX2F1ZGlvKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG5cbn1cbmV4cG9ydCBkZWZhdWx0IG5ldyBzdXBlcl9odG1sX3BsYXlhYmxlKCk7Il19