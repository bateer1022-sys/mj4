
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/ui/GameImgAtlas.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'af5f7mZBYBFpo6Q4cJl8sRl', 'GameImgAtlas');
// script/ui/GameImgAtlas.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearGameImgAtlasCache = exports.getCachedTileIcon = exports.preloadTileIconKeys = exports.loadGameSpriteFrame = exports.preloadGameImgAtlas = void 0;
var GamePreloadConfig_1 = require("./GamePreloadConfig");
var cachedAtlas = null;
var atlasLoadPending = [];
var tileIconCache = {};
/**
 * 预加载自动图集（构建后由 ui.pac 生成 SpriteAtlas；编辑器内仍可按子路径 load SpriteFrame）。
 */
function preloadGameImgAtlas(onDone) {
    if (cachedAtlas) {
        if (onDone) {
            onDone(cachedAtlas);
        }
        return;
    }
    if (onDone) {
        atlasLoadPending.push(onDone);
    }
    cc.resources.load(GamePreloadConfig_1.IMG_AUTO_ATLAS_PAC, cc.SpriteAtlas, function (err, atlas) {
        if (!err && atlas) {
            cachedAtlas = atlas;
        }
        var pending = atlasLoadPending.slice();
        atlasLoadPending.length = 0;
        for (var i = 0; i < pending.length; i++) {
            pending[i](cachedAtlas);
        }
    });
}
exports.preloadGameImgAtlas = preloadGameImgAtlas;
/** 从图集或 resources 子路径加载 SpriteFrame（路径相对 resources，无扩展名） */
function loadGameSpriteFrame(resPath, onReady) {
    var tryAtlas = function () {
        if (!cachedAtlas) {
            finishDirect();
            return;
        }
        var base = resPath.indexOf(GamePreloadConfig_1.IMG_DIR) === 0
            ? resPath.slice(GamePreloadConfig_1.IMG_DIR.length + 1)
            : resPath;
        var names = [base, base.split('/').pop() || base];
        for (var i = 0; i < names.length; i++) {
            var sf = cachedAtlas.getSpriteFrame(names[i]);
            if (sf) {
                onReady(sf);
                return;
            }
        }
        finishDirect();
    };
    var finishDirect = function () {
        cc.resources.load(resPath, cc.SpriteFrame, function (err, sf) {
            onReady(!err && sf ? sf : null);
        });
    };
    if (cachedAtlas) {
        tryAtlas();
        return;
    }
    preloadGameImgAtlas(function () { return tryAtlas(); });
}
exports.loadGameSpriteFrame = loadGameSpriteFrame;
/** 进局前批量预加载本关会用到的牌面图（写入缓存，开局不再逐个 load） */
function preloadTileIconKeys(keys, onDone) {
    var unique = [];
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (k && unique.indexOf(k) === -1) {
            unique.push(k);
        }
    }
    if (unique.length === 0) {
        onDone();
        return;
    }
    var pending = unique.length;
    var finishOne = function () {
        pending--;
        if (pending <= 0) {
            onDone();
        }
    };
    preloadGameImgAtlas(function () {
        var _loop_1 = function (i) {
            var key = unique[i];
            if (tileIconCache[key]) {
                finishOne();
                return "continue";
            }
            var path = GamePreloadConfig_1.TILE_ICON_PATH + key;
            loadGameSpriteFrame(path, function (sf) {
                if (sf) {
                    tileIconCache[key] = sf;
                }
                finishOne();
            });
        };
        for (var i = 0; i < unique.length; i++) {
            _loop_1(i);
        }
    });
}
exports.preloadTileIconKeys = preloadTileIconKeys;
function getCachedTileIcon(key) {
    return tileIconCache[key] || null;
}
exports.getCachedTileIcon = getCachedTileIcon;
function clearGameImgAtlasCache() {
    cachedAtlas = null;
    atlasLoadPending.length = 0;
    for (var k in tileIconCache) {
        if (tileIconCache.hasOwnProperty(k)) {
            delete tileIconCache[k];
        }
    }
}
exports.clearGameImgAtlasCache = clearGameImgAtlasCache;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvdWkvR2FtZUltZ0F0bGFzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlEQUFrRjtBQUVsRixJQUFJLFdBQVcsR0FBbUIsSUFBSSxDQUFDO0FBQ3ZDLElBQUksZ0JBQWdCLEdBQWtELEVBQUUsQ0FBQztBQUN6RSxJQUFNLGFBQWEsR0FBc0MsRUFBRSxDQUFDO0FBRTVEOztHQUVHO0FBQ0gsU0FBZ0IsbUJBQW1CLENBQUMsTUFBK0M7SUFDL0UsSUFBSSxXQUFXLEVBQUU7UUFDYixJQUFJLE1BQU0sRUFBRTtZQUNSLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUN2QjtRQUNELE9BQU87S0FDVjtJQUNELElBQUksTUFBTSxFQUFFO1FBQ1IsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2pDO0lBQ0QsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsc0NBQWtCLEVBQUUsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFDLEdBQUcsRUFBRSxLQUFLO1FBQzdELElBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxFQUFFO1lBQ2YsV0FBVyxHQUFHLEtBQUssQ0FBQztTQUN2QjtRQUNELElBQU0sT0FBTyxHQUFHLGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3pDLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDNUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQzNCO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBcEJELGtEQW9CQztBQUVELDREQUE0RDtBQUM1RCxTQUFnQixtQkFBbUIsQ0FDL0IsT0FBZSxFQUNmLE9BQStDO0lBRS9DLElBQU0sUUFBUSxHQUFH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RSxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxDQUFDOztRQVpQLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtvQkFBN0IsQ0FBQztTQWFUO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBckNELGtEQXFDQztBQUVELFNBQWdCLGlCQUFpQixDQUFDLEdBQVc7SUFDekMsT0FBTyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDO0FBQ3RDLENBQUM7QUFGRCw4Q0FFQztBQUVELFNBQWdCLHNCQUFzQjtJQUNsQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQ25CLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDNUIsS0FBSyxJQUFNLENBQUMsSUFBSSxhQUFhLEVBQUU7UUFDM0IsSUFBSSxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2pDLE9BQU8sYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzNCO0tBQ0o7QUFDTCxDQUFDO0FBUkQsd0RBUUMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJTUdfQVVUT19BVExBU19QQUMsIElNR19ESVIsIFRJTEVfSUNPTl9QQVRIIH0gZnJvbSAnLi9HYW1lUHJlbG9hZENvbmZpZyc7XG5cbmxldCBjYWNoZWRBdGxhczogY2MuU3ByaXRlQXRsYXMgPSBudWxsO1xubGV0IGF0bGFzTG9hZFBlbmRpbmc6IEFycmF5PChhdGxhczogY2MuU3ByaXRlQXRsYXMgfCBudWxsKSA9PiB2b2lkPiA9IFtdO1xuY29uc3QgdGlsZUljb25DYWNoZTogeyBba2V5OiBzdHJpbmddOiBjYy5TcHJpdGVGcmFtZSB9ID0ge307XG5cbi8qKlxuICog6aKE5Yqg6L296Ieq5Yqo5Zu+6ZuG77yI5p6E5bu65ZCO55SxIHVpLnBhYyDnlJ/miJAgU3ByaXRlQXRsYXPvvJvnvJbovpHlmajlhoXku43lj6/mjInlrZDot6/lvoQgbG9hZCBTcHJpdGVGcmFtZe+8ieOAglxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJlbG9hZEdhbWVJbWdBdGxhcyhvbkRvbmU/OiAoYXRsYXM6IGNjLlNwcml0ZUF0bGFzIHwgbnVsbCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIGlmIChjYWNoZWRBdGxhcykge1xuICAgICAgICBpZiAob25Eb25lKSB7XG4gICAgICAgICAgICBvbkRvbmUoY2FjaGVkQXRsYXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG9uRG9uZSkge1xuICAgICAgICBhdGxhc0xvYWRQZW5kaW5nLnB1c2gob25Eb25lKTtcbiAgICB9XG4gICAgY2MucmVzb3VyY2VzLmxvYWQoSU1HX0FVVE9fQVRMQVNfUEFDLCBjYy5TcHJpdGVBdGxhcywgKGVyciwgYXRsYXMpID0+IHtcbiAgICAgICAgaWYgKCFlcnIgJiYgYXRsYXMpIHtcbiAgICAgICAgICAgIGNhY2hlZEF0bGFzID0gYXRsYXM7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGVuZGluZyA9IGF0bGFzTG9hZFBlbmRpbmcuc2xpY2UoKTtcbiAgICAgICAgYXRsYXNMb2FkUGVuZGluZy5sZW5ndGggPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBlbmRpbmcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHBlbmRpbmdbaV0oY2FjaGVkQXRsYXMpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKiDku47lm77pm4bmiJYgcmVzb3VyY2VzIOWtkOi3r+W+hOWKoOi9vSBTcHJpdGVGcmFtZe+8iOi3r+W+hOebuOWvuSByZXNvdXJjZXPvvIzml6DmianlsZXlkI3vvIkgKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkR2FtZVNwcml0ZUZyYW1lKFxuICAgIHJlc1BhdGg6IHN0cmluZyxcbiAgICBvblJlYWR5OiAoZnJhbWU6IGNjLlNwcml0ZUZyYW1lIHwgbnVsbCkgPT4gdm9pZFxuKTogdm9pZCB7XG4gICAgY29uc3QgdHJ5QXRsYXMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICghY2FjaGVkQXRsYXMpIHtcbiAgICAgICAgICAgIGZpbmlzaERpcmVjdCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJhc2UgPSByZXNQYXRoLmluZGV4T2YoSU1HX0RJUikgPT09IDBcbiAgICAgICAgICAgID8gcmVzUGF0aC5zbGljZShJTUdfRElSLmxlbmd0aCArIDEpXG4gICAgICAgICAgICA6IHJlc1BhdGg7XG4gICAgICAgIGNvbnN0IG5hbWVzID0gW2Jhc2UsIGJhc2Uuc3BsaXQoJy8nKS5wb3AoKSB8fCBiYXNlXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgc2YgPSBjYWNoZWRBdGxhcy5nZXRTcHJpdGVGcmFtZShuYW1lc1tpXSk7XG4gICAgICAgICAgICBpZiAoc2YpIHtcbiAgICAgICAgICAgICAgICBvblJlYWR5KHNmKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZmluaXNoRGlyZWN0KCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGZpbmlzaERpcmVjdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgY2MucmVzb3VyY2VzLmxvYWQocmVzUGF0aCwgY2MuU3ByaXRlRnJhbWUsIChlcnIsIHNmKSA9PiB7XG4gICAgICAgICAgICBvblJlYWR5KCFlcnIgJiYgc2YgPyBzZiA6IG51bGwpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgaWYgKGNhY2hlZEF0bGFzKSB7XG4gICAgICAgIHRyeUF0bGFzKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcHJlbG9hZEdhbWVJbWdBdGxhcygoKSA9PiB0cnlBdGxhcygpKTtcbn1cblxuLyoqIOi/m+WxgOWJjeaJuemHj+mihOWKoOi9veacrOWFs+S8mueUqOWIsOeahOeJjOmdouWbvu+8iOWGmeWFpee8k+WtmO+8jOW8gOWxgOS4jeWGjemAkOS4qiBsb2Fk77yJICovXG5leHBvcnQgZnVuY3Rpb24gcHJlbG9hZFRpbGVJY29uS2V5cyhrZXlzOiBzdHJpbmdbXSwgb25Eb25lOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgY29uc3QgdW5pcXVlOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBrID0ga2V5c1tpXTtcbiAgICAgICAgaWYgKGsgJiYgdW5pcXVlLmluZGV4T2YoaykgPT09IC0xKSB7XG4gICAgICAgICAgICB1bmlxdWUucHVzaChrKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAodW5pcXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBvbkRvbmUoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBwZW5kaW5nID0gdW5pcXVlLmxlbmd0aDtcbiAgICBjb25zdCBmaW5pc2hPbmUgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHBlbmRpbmctLTtcbiAgICAgICAgaWYgKHBlbmRpbmcgPD0gMCkge1xuICAgICAgICAgICAgb25Eb25lKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcHJlbG9hZEdhbWVJbWdBdGxhcygoKSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdW5pcXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSB1bmlxdWVbaV07XG4gICAgICAgICAgICBpZiAodGlsZUljb25DYWNoZVtrZXldKSB7XG4gICAgICAgICAgICAgICAgZmluaXNoT25lKCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwYXRoID0gVElMRV9JQ09OX1BBVEggKyBrZXk7XG4gICAgICAgICAgICBsb2FkR2FtZVNwcml0ZUZyYW1lKHBhdGgsIChzZikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzZikge1xuICAgICAgICAgICAgICAgICAgICB0aWxlSWNvbkNhY2hlW2tleV0gPSBzZjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmluaXNoT25lKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FjaGVkVGlsZUljb24oa2V5OiBzdHJpbmcpOiBjYy5TcHJpdGVGcmFtZSB8IG51bGwge1xuICAgIHJldHVybiB0aWxlSWNvbkNhY2hlW2tleV0gfHwgbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyR2FtZUltZ0F0bGFzQ2FjaGUoKTogdm9pZCB7XG4gICAgY2FjaGVkQXRsYXMgPSBudWxsO1xuICAgIGF0bGFzTG9hZFBlbmRpbmcubGVuZ3RoID0gMDtcbiAgICBmb3IgKGNvbnN0IGsgaW4gdGlsZUljb25DYWNoZSkge1xuICAgICAgICBpZiAodGlsZUljb25DYWNoZS5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgZGVsZXRlIHRpbGVJY29uQ2FjaGVba107XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=