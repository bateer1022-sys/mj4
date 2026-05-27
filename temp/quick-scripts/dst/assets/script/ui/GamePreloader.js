
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/ui/GamePreloader.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvdWkvR2FtZVByZWxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSx5REFBc0c7QUFDdEcsK0NBQStGO0FBQy9GLGlFQUF1RTtBQUV2RSxJQUFNLFVBQVUsR0FBRyxlQUFlLENBQUM7QUFDbkMsSUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUM7QUFDakMsSUFBTSxlQUFlLEdBQUcsbUJBQW1CLENBQUM7QUFXNUM7OztHQUdHO0FBQ0g7SUFBQTtJQXdFQSxDQUFDO0lBdkVVLGlCQUFHLEdBQVYsVUFBVyxVQUFzQixFQUFFLFVBQWdFO1FBQy9GLElBQU0sRUFBRSxHQUFHLHNDQUFrQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFZCxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFNBQVMsRUFBRSxVQUFDLEdBQUcsRUFBRSxLQUFLO1lBQ25ELElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNmLFVBQVUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQzdCLE9BQU87YUFDVjtZQUVELElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFtQixDQUFDO1lBQ3hDLElBQU0sUUFBUSxHQUFHLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDN0QsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsSUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLElBQU0sTUFBTSxHQUEyQixFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQztZQUU3RCxJQUFNLElBQUksR0FBRztnQkFDVCxJQUFJLEVBQUUsQ0FBQztnQkFDUCxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLElBQUksSUFBSSxHQUFHLEtBQUssRUFBRTtvQkFDZCxPQUFPO2lCQUNWO2dCQUNELElBQUksc0NBQWtCLEVBQUU7b0JBQ3BCLEVBQUUsQ0FBQyxHQUFHLENBQUMscURBQXlCLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLHdCQUFRLFFBQVEsQ0FBQyxNQUFNLDhCQUFPLENBQUMsQ0FBQztpQkFDbEY7Z0JBQ0QsVUFBVSxDQUFDLE1BQXVCLENBQUMsQ0FBQztZQUN4QyxDQUFDLENBQUM7WUFFRixFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsU0FBUyxFQUFFLFVBQUMsRUFBRSxFQUFFLElBQUk7Z0JBQ3ZELElBQUksQ0FBQyxFQUFFLElBQUksSUFBSSxFQUFFO29CQUNiLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2lCQUMzQjtnQkFDRCxJQUFJLEVBQUUsQ0FBQztZQUNYLENBQUMsQ0FBQyxDQUFDO1lBQ0gsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBQyxFQUFFLEVBQUUsSUFBSTtnQkFDdkQsSUFBSSxDQUFDLEVBQUUsSUFBSSxJQUFJLEVBQUU7b0JBQ2IsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7aUJBQzNCO2dCQUNELElBQUksRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUM7WUFDSCxrQ0FBbUIsQ0FBQyxtQ0FBZSxFQUFFLFVBQUMsRUFBRTtnQkFDcEMsSUFBSSxFQUFFLEVBQUU7b0JBQ0osTUFBTSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7aUJBQzNCO2dCQUNELElBQUksRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUM7WUFDSCxrQ0FBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQscUJBQXFCO0lBQ2QsbUNBQXFCLEdBQTVCLFVBQTZCLE1BQW1CO1FBQzVDLElBQU0sRUFBRSxHQUFHLHNDQUFrQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQyxJQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsaUNBQWEsQ0FBQyxNQUFNLENBQUM7UUFDdkMsSUFBTSxNQUFNLEdBQUc7WUFDWCxPQUFPLEVBQUUsQ0FBQztZQUNWLElBQUksT0FBTyxJQUFJLENBQUMsRUFBRTtnQkFDZCxJQUFJLHNDQUFrQixFQUFFO29CQUNwQixFQUFFLENBQUMsR0FBRyxDQUFDLHFEQUF5QixJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxRQUFJLENBQUMsQ0FBQztpQkFDeEQ7Z0JBQ0QsSUFBSSxNQUFNLEVBQUU7b0JBQ1IsTUFBTSxFQUFFLENBQUM7aUJBQ1o7YUFDSjtRQUNMLENBQUMsQ0FBQztRQUVGLG9EQUE0QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxpQ0FBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQyxrQ0FBbUIsQ0FBQywrQkFBVyxDQUFDLGlDQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxjQUFNLE9BQUEsTUFBTSxFQUFFLEVBQVIsQ0FBUSxDQUFDLENBQUM7U0FDdEU7SUFDTCxDQUFDO0lBQ0wsb0JBQUM7QUFBRCxDQXhFQSxBQXdFQyxJQUFBO0FBeEVZLHNDQUFhIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTGV2ZWxDb25maWcgfSBmcm9tICcuLi9tb2RlbC9MZXZlbENvbmZpZyc7XG5pbXBvcnQgeyBHVUlERV9IQU5EX1BBVEgsIExPQURJTkdfTE9HX1RJTUlORywgUkFURV9SRVNfS0VZUywgcmF0ZVJlc1BhdGggfSBmcm9tICcuL0dhbWVQcmVsb2FkQ29uZmlnJztcbmltcG9ydCB7IGxvYWRHYW1lU3ByaXRlRnJhbWUsIHByZWxvYWRHYW1lSW1nQXRsYXMsIHByZWxvYWRUaWxlSWNvbktleXMgfSBmcm9tICcuL0dhbWVJbWdBdGxhcyc7XG5pbXBvcnQgeyBwcmVsb2FkTWF0Y2hFbGltaW5hdGlvblNwaW5lIH0gZnJvbSAnLi9NYXRjaEVsaW1pbmF0aW9uU3BpbmUnO1xuXG5jb25zdCBMRVZFTF9QQVRIID0gJ2RhdGEvbGV2ZWxfMDEnO1xuY29uc3QgQ0hFQ0tfU09VTkRfUEFUSCA9ICdjaGVjayc7XG5jb25zdCBTQ09SRV9GT05UX1BBVEggPSAnZm9udC9zY29yZV9kaWdpdHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFByZWxvYWRSZXN1bHQge1xuICAgIGxldmVsQXNzZXQ6IGNjLkpzb25Bc3NldDtcbiAgICBjaGVja0NsaXA/OiBjYy5BdWRpb0NsaXA7XG4gICAgc2NvcmVGb250PzogY2MuQml0bWFwRm9udDtcbiAgICBndWlkZUhhbmRTZj86IGNjLlNwcml0ZUZyYW1lO1xufVxuXG50eXBlIFByb2dyZXNzRm4gPSAocmF0aW86IG51bWJlcikgPT4gdm9pZDtcblxuLyoqXG4gKiDpmLvloZ7pooTliqDovb3vvJrlhbPljaEgSlNPTiDihpIg5bm26KGM5Yqg6L296Z+z5pWIL+Wtl+S9ky/lm77pm4bniYzpnaIv5bCP5omL44CCXG4gKiDor4Tnuqflm77jgIHmtojpmaQgU3BpbmUg6L+b5bGA5ZCO5ZCO5Y+w5Yqg6L2944CCXG4gKi9cbmV4cG9ydCBjbGFzcyBHYW1lUHJlbG9hZGVyIHtcbiAgICBzdGF0aWMgcnVuKG9uUHJvZ3Jlc3M6IFByb2dyZXNzRm4sIG9uQ29tcGxldGU6IChyZXN1bHQ6IFByZWxvYWRSZXN1bHQgfCBudWxsLCBlcnI/OiBzdHJpbmcpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgdDAgPSBMT0FESU5HX0xPR19USU1JTkcgPyBEYXRlLm5vdygpIDogMDtcbiAgICAgICAgb25Qcm9ncmVzcygwKTtcblxuICAgICAgICBjYy5yZXNvdXJjZXMubG9hZChMRVZFTF9QQVRILCBjYy5Kc29uQXNzZXQsIChlcnIsIGFzc2V0KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyIHx8ICFhc3NldCkge1xuICAgICAgICAgICAgICAgIG9uQ29tcGxldGUobnVsbCwgJ+WFs+WNoeaVsOaNruWKoOi9veWksei0pScpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbGV2ZWwgPSBhc3NldC5qc29uIGFzIExldmVsQ29uZmlnO1xuICAgICAgICAgICAgY29uc3QgaWNvbktleXMgPSBsZXZlbCAmJiBsZXZlbC5rZXlQb29sID8gbGV2ZWwua2V5UG9vbCA6IFtdO1xuICAgICAgICAgICAgbGV0IGRvbmUgPSAwO1xuICAgICAgICAgICAgY29uc3QgdG90YWwgPSA0O1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0OiBQYXJ0aWFsPFByZWxvYWRSZXN1bHQ+ID0geyBsZXZlbEFzc2V0OiBhc3NldCB9O1xuXG4gICAgICAgICAgICBjb25zdCB0aWNrID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIGRvbmUrKztcbiAgICAgICAgICAgICAgICBvblByb2dyZXNzKE1hdGgubWluKDEsIGRvbmUgLyB0b3RhbCkpO1xuICAgICAgICAgICAgICAgIGlmIChkb25lIDwgdG90YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoTE9BRElOR19MT0dfVElNSU5HKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZyhgW0dhbWVQcmVsb2FkZXJdIOmYu+WhnumihOWKoOi9vSAke0RhdGUubm93KCkgLSB0MH1tc++8iOWQqyAke2ljb25LZXlzLmxlbmd0aH0g56eN54mM6Z2i77yJYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGUocmVzdWx0IGFzIFByZWxvYWRSZXN1bHQpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY2MucmVzb3VyY2VzLmxvYWQoQ0hFQ0tfU09VTkRfUEFUSCwgY2MuQXVkaW9DbGlwLCAoZTEsIGNsaXApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWUxICYmIGNsaXApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmNoZWNrQ2xpcCA9IGNsaXA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRpY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2MucmVzb3VyY2VzLmxvYWQoU0NPUkVfRk9OVF9QQVRILCBjYy5CaXRtYXBGb250LCAoZTIsIGZvbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWUyICYmIGZvbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnNjb3JlRm9udCA9IGZvbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRpY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbG9hZEdhbWVTcHJpdGVGcmFtZShHVUlERV9IQU5EX1BBVEgsIChzZikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzZikge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuZ3VpZGVIYW5kU2YgPSBzZjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGljaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcmVsb2FkVGlsZUljb25LZXlzKGljb25LZXlzLCB0aWNrKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqIOi/m+WxgOWQjuWcqOWQjuWPsOWKoOi9ve+8jOS4jemYu+WhnummluWxjyAqL1xuICAgIHN0YXRpYyBwcmVsb2FkR2FtZXBsYXlBc3NldHMob25Eb25lPzogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgICBjb25zdCB0MCA9IExPQURJTkdfTE9HX1RJTUlORyA/IERhdGUubm93KCkgOiAwO1xuICAgICAgICBsZXQgcGVuZGluZyA9IDEgKyBSQVRFX1JFU19LRVlTLmxlbmd0aDtcbiAgICAgICAgY29uc3QgZmluaXNoID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgcGVuZGluZy0tO1xuICAgICAgICAgICAgaWYgKHBlbmRpbmcgPD0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChMT0FESU5HX0xPR19USU1JTkcpIHtcbiAgICAgICAgICAgICAgICAgICAgY2MubG9nKGBbR2FtZVByZWxvYWRlcl0g5ZCO5Y+w6aKE5Yqg6L29ICR7RGF0ZS5ub3coKSAtIHQwfW1zYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvbkRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgb25Eb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHByZWxvYWRNYXRjaEVsaW1pbmF0aW9uU3BpbmUoZmluaXNoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBSQVRFX1JFU19LRVlTLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsb2FkR2FtZVNwcml0ZUZyYW1lKHJhdGVSZXNQYXRoKFJBVEVfUkVTX0tFWVNbaV0pLCAoKSA9PiBmaW5pc2goKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=