"use strict";
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