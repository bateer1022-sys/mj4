"use strict";
cc._RF.push(module, '08d41lw+D5Aybz3bs2TwNYZ', 'GamePreloader');
// script/ui/GamePreloader.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamePreloader = void 0;
var GamePreloadConfig_1 = require("./GamePreloadConfig");
var GameImgAtlas_1 = require("./GameImgAtlas");
var MatchEliminationSpine_1 = require("./MatchEliminationSpine");
var LEVEL_PATH = 'data/level_01';
var CHECK_SOUND_PATH = 'check';
var SCORE_FONT_PATH = 'font/score_digits';
/**
 * 阻塞预加载：关卡 JSON → 并行加载音效/字体/图集牌面/小手。
 * 评级图、消除 Spine 进局后后台加载。
 */
var GamePreloader = /** @class */ (function () {
    function GamePreloader() {
    }
    GamePreloader.run = function (onProgress, onComplete) {
        var t0 = GamePreloadConfig_1.LOADING_LOG_TIMING ? Date.now() : 0;
        onProgress(0);
        cc.resources.load(LEVEL_PATH, cc.JsonAsset, function (err, asset) {
            if (err || !asset) {
                onComplete(null, '关卡数据加载失败');
                return;
            }
            var level = asset.json;
            var iconKeys = level && level.keyPool ? level.keyPool : [];
            var done = 0;
            var total = 4;
            var result = { levelAsset: asset };
            var tick = function () {
                done++;
                onProgress(Math.min(1, done / total));
                if (done < total) {
                    return;
                }
                if (GamePreloadConfig_1.LOADING_LOG_TIMING) {
                    cc.log("[GamePreloader] \u963B\u585E\u9884\u52A0\u8F7D " + (Date.now() - t0) + "ms\uFF08\u542B " + iconKeys.length + " \u79CD\u724C\u9762\uFF09");
                }
                onComplete(result);
            };
            cc.resources.load(CHECK_SOUND_PATH, cc.AudioClip, function (e1, clip) {
                if (!e1 && clip) {
                    result.checkClip = clip;
                }
                tick();
            });
            cc.resources.load(SCORE_FONT_PATH, cc.BitmapFont, function (e2, font) {
                if (!e2 && font) {
                    result.scoreFont = font;
                }
                tick();
            });
            GameImgAtlas_1.loadGameSpriteFrame(GamePreloadConfig_1.GUIDE_HAND_PATH, function (sf) {
                if (sf) {
                    result.guideHandSf = sf;
                }
                tick();
            });
            GameImgAtlas_1.preloadTileIconKeys(iconKeys, tick);
        });
    };
    /** 进局后在后台加载，不阻塞首屏 */
    GamePreloader.preloadGameplayAssets = function (onDone) {
        var t0 = GamePreloadConfig_1.LOADING_LOG_TIMING ? Date.now() : 0;
        var pending = 1 + GamePreloadConfig_1.RATE_RES_KEYS.length;
        var finish = function () {
            pending--;
            if (pending <= 0) {
                if (GamePreloadConfig_1.LOADING_LOG_TIMING) {
                    cc.log("[GamePreloader] \u540E\u53F0\u9884\u52A0\u8F7D " + (Date.now() - t0) + "ms");
                }
                if (onDone) {
                    onDone();
                }
            }
        };
        MatchEliminationSpine_1.preloadMatchEliminationSpine(finish);
        for (var i = 0; i < GamePreloadConfig_1.RATE_RES_KEYS.length; i++) {
            GameImgAtlas_1.loadGameSpriteFrame(GamePreloadConfig_1.rateResPath(GamePreloadConfig_1.RATE_RES_KEYS[i]), function () { return finish(); });
        }
    };
    return GamePreloader;
}());
exports.GamePreloader = GamePreloader;

cc._RF.pop();