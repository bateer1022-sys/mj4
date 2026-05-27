
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/ui/GamePreloadConfig.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'ef326Z8EtBIVLoOIdA7qltl', 'GamePreloadConfig');
// script/ui/GamePreloadConfig.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SELECT_SWEEP_STYLE = exports.MATCH_ELIMINATION_SPINE = exports.HINT_SWAY_STYLE = exports.GUIDE_HAND_SEEN_STORAGE_KEY = exports.GUIDE_HAND_STYLE = exports.GUIDE_HAND_PATH = exports.FORBIDDEN_ICON_PATH = exports.SCORE_GLOW_PATH = exports.TILE_ICON_PATH = exports.rateResPath = exports.RATE_RES_KEYS = exports.TARGET_FRAME_RATE = exports.LOADING_LOG_TIMING = exports.LOADING_HIDE_BEFORE_ENTRANCE = exports.LOADING_MIN_VISIBLE_SEC = exports.AUTO_CLEAR_BEFORE_SETTLEMENT_SEC = exports.SETTLEMENT_MATCH_PAIRS = exports.IMG_AUTO_ATLAS_PAC = exports.IMG_DIR = exports.IMG_BG_DIR = exports.Z_ORDER_END_CHILD = exports.Z_ORDER = void 0;
/**
 * UI 层级（Cocos 2.4 的 cc.macro.MAX_ZINDEX 为 32767，禁止更大）
 * 数值越大越靠前。
 */
exports.Z_ORDER = {
    MATCH_SPINE: 2000,
    SCORE_HUD: 3000,
    HIT: 4000,
    RATE_POPUP: 5000,
    GUIDE_HAND: 6000,
    END_PANEL: 7000,
    LOADING: 8000,
};
/** 结算 end 节点内子节点相对层级 */
exports.Z_ORDER_END_CHILD = {
    DIM_BACKDROP: 0,
    STAR: 20,
    SCORE: 55,
    DOWNLOAD: 65,
};
/** 背景图（不合图，单独保留） */
exports.IMG_BG_DIR = 'img';
/** 碎图自动图集目录（ui.pac，构建时合成一张/多张图集） */
exports.IMG_DIR = 'img/atlas';
/** 自动图集配置资源名（与 atlas/ui.pac 对应） */
exports.IMG_AUTO_ATLAS_PAC = exports.IMG_DIR + "/ui";
/** 消除多少「对」后进入结算界面（改此值即可，不必清完整盘） */
exports.SETTLEMENT_MATCH_PAIRS = 4;
/** 达结算条件后，剩余牌自动配对消除的总时长（秒），结束后再弹出结算 */
exports.AUTO_CLEAR_BEFORE_SETTLEMENT_SEC = 2;
/** 加载屏最短展示（秒） */
exports.LOADING_MIN_VISIBLE_SEC = 0.08;
/** 资源就绪即关加载屏，入场落牌动画与可玩状态并行 */
exports.LOADING_HIDE_BEFORE_ENTRANCE = true;
/** 控制台输出各阶段耗时（调试加载速度） */
exports.LOADING_LOG_TIMING = true;
/** 游戏目标帧率（0 表示不限制；高刷屏预览建议 60） */
exports.TARGET_FRAME_RATE = 60;
/** 连消评级档位名（与贴图文件名一致） */
exports.RATE_RES_KEYS = ['good', 'great', 'excellent', 'amazing', 'unbelievable'];
/** cc.resources.load 用的评级图路径（图集内子图） */
function rateResPath(name) {
    return exports.IMG_DIR + "/" + name;
}
exports.rateResPath = rateResPath;
/** 麻将牌面图目录（图集内 牌面/ 子目录） */
exports.TILE_ICON_PATH = exports.IMG_DIR + "/\u724C\u9762/";
/** 分数变化时牌面后的背光 */
exports.SCORE_GLOW_PATH = exports.IMG_DIR + "/\u80CC\u5149";
/** 不可消提示图标 */
exports.FORBIDDEN_ICON_PATH = exports.IMG_DIR + "/icon_forbidden_50";
/** 引导小手 */
exports.GUIDE_HAND_PATH = exports.IMG_DIR + "/\u624B\u6307\u5934";
/**
 * 小手显示（棋盘坐标系像素）
 * - 锚点 (0,0) 对齐「靠左提示牌」根节点中心的世界坐标
 * - offsetX / offsetY：在棋盘上的微调（改这里会生效）
 */
exports.GUIDE_HAND_STYLE = {
    scale: 0.38,
    offsetX: 0,
    offsetY: 0,
};
/** localStorage：是否已展示过首次点击引导小手 */
exports.GUIDE_HAND_SEEN_STORAGE_KEY = 'mj_guide_hand_seen';
/** 提示麻将左右晃动（循环播放，每轮间隔 gap 秒） */
exports.HINT_SWAY_STYLE = {
    angle: 7,
    step: 0.1,
    gap: 1.5,
};
/** 消除 Spine：resources/spine/gameplay_elimination，动画名 in */
exports.MATCH_ELIMINATION_SPINE = {
    path: 'spine/gameplay_elimination',
    anim: 'in',
    scale: 0.45,
    zIndex: exports.Z_ORDER.MATCH_SPINE,
};
/** 选中扫光（牌面遮罩内细条扫过） */
exports.SELECT_SWEEP_STYLE = {
    duration: 0.55,
    gap: 0.4,
    edgeInset: 3,
    barWidth: 14,
    barHeightRatio: 0.98,
    angle: -14,
    peakOpacity: 140,
};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvdWkvR2FtZVByZWxvYWRDb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztHQUdHO0FBQ1UsUUFBQSxPQUFPLEdBQUc7SUFDbkIsV0FBVyxFQUFFLElBQUk7SUFDakIsU0FBUyxFQUFFLElBQUk7SUFDZixHQUFHLEVBQUUsSUFBSTtJQUNULFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFNBQVMsRUFBRSxJQUFJO0lBQ2YsT0FBTyxFQUFFLElBQUk7Q0FDUCxDQUFDO0FBRVgsd0JBQXdCO0FBQ1gsUUFBQSxpQkFBaUIsR0FBRztJQUM3QixZQUFZLEVBQUUsQ0FBQztJQUNmLElBQUksRUFBRSxFQUFFO0lBQ1IsS0FBSyxFQUFFLEVBQUU7SUFDVCxRQUFRLEVBQUUsRUFBRTtDQUNOLENBQUM7QUFFWCxvQkFBb0I7QUFDUCxRQUFBLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFFaEMsb0NBQW9DO0FBQ3ZCLFFBQUEsT0FBTyxHQUFHLFdBQVcsQ0FBQztBQUVuQyxtQ0FBbUM7QUFDdEIsUUFBQSxrQkFBa0IsR0FBTSxlQUFPLFFBQUssQ0FBQztBQUVsRCxtQ0FBbUM7QUFDdEIsUUFBQSxzQkFBc0IsR0FBRyxDQUFDLENBQUM7QUFFeEMsdUNBQXVDO0FBQzFCLFFBQUEsZ0NBQWdDLEdBQUcsQ0FBQyxDQUFDO0FBRWxELGlCQUFpQjtBQUNKLFFBQUEsdUJBQXVCLEdBQUcsSUFBSSxDQUFDO0FBRTVDLDhCQUE4QjtBQUNqQixRQUFBLDRCQUE0QixHQUFHLElBQUksQ0FBQztBQUVqRCx5QkFBeUI7QUFDWixRQUFBLGtCQUFrQixHQUFHLElBQUksQ0FBQztBQUV2QyxpQ0FBaUM7QUFDcEIsUUFBQSxpQkFBaUIsR0FBRyxFQUFFLENBQUM7QUFFcEMsd0JBQXdCO0FBQ1gsUUFBQSxhQUFhLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsY0FBYyxDQUFVLENBQUM7QUFFaEcsdUNBQXVDO0FBQ3ZDLFNBQWdCLFdBQVcsQ0FBQyxJQUFrQztJQUMxRCxPQUFVLGVBQU8sU0FBSSxJQUFNLENBQUM7QUFDaEMsQ0FBQztBQUZELGtDQUVDO0FBRUQsMkJBQTJCO0FBQ2QsUUFBQSxjQUFjLEdBQU0sZUFBTyxtQkFBTSxDQUFDO0FBRS9DLGtCQUFrQjtBQUNMLFFBQUEsZUFBZSxHQUFNLGVBQU8sa0JBQUssQ0FBQztBQUUvQyxjQUFjO0FBQ0QsUUFBQSxtQkFBbUIsR0FBTSxlQUFPLHVCQUFvQixDQUFDO0FBRWxFLFdBQVc7QUFDRSxRQUFBLGVBQWUsR0FBTSxlQUFPLHdCQUFNLENBQUM7QUFFaEQ7Ozs7R0FJRztBQUNVLFFBQUEsZ0JBQWdCLEdBQUc7SUFDNUIsS0FBSyxFQUFFLElBQUk7SUFDWCxPQUFPLEVBQUUsQ0FBQztJQUNWLE9BQU8sRUFBRSxDQUFDO0NBQ2IsQ0FBQztBQUVGLGtDQUFrQztBQUNyQixRQUFBLDJCQUEyQixHQUFHLG9CQUFvQixDQUFDO0FBRWhFLGdDQUFnQztBQUNuQixRQUFBLGVBQWUsR0FBRztJQUMzQixLQUFLLEVBQUUsQ0FBQztJQUNSLElBQUksRUFBRSxHQUFHO0lBQ1QsR0FBRyxFQUFFLEdBQUc7Q0FDWCxDQUFDO0FBRUYsMkRBQTJEO0FBQzlDLFFBQUEsdUJBQXVCLEdBQUc7SUFDbkMsSUFBSSxFQUFFLDRCQUE0QjtJQUNsQyxJQUFJLEVBQUUsSUFBSTtJQUNWLEtBQUssRUFBRSxJQUFJO0lBQ1gsTUFBTSxFQUFFLGVBQU8sQ0FBQyxXQUFXO0NBQzlCLENBQUM7QUFFRixzQkFBc0I7QUFDVCxRQUFBLGtCQUFrQixHQUFHO0lBQzlCLFFBQVEsRUFBRSxJQUFJO0lBQ2QsR0FBRyxFQUFFLEdBQUc7SUFDUixTQUFTLEVBQUUsQ0FBQztJQUNaLFFBQVEsRUFBRSxFQUFFO0lBQ1osY0FBYyxFQUFFLElBQUk7SUFDcEIsS0FBSyxFQUFFLENBQUMsRUFBRTtJQUNWLFdBQVcsRUFBRSxHQUFHO0NBQ25CLENBQUMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFVJIOWxgue6p++8iENvY29zIDIuNCDnmoQgY2MubWFjcm8uTUFYX1pJTkRFWCDkuLogMzI3NjfvvIznpoHmraLmm7TlpKfvvIlcbiAqIOaVsOWAvOi2iuWkp+i2iumdoOWJjeOAglxuICovXG5leHBvcnQgY29uc3QgWl9PUkRFUiA9IHtcbiAgICBNQVRDSF9TUElORTogMjAwMCxcbiAgICBTQ09SRV9IVUQ6IDMwMDAsXG4gICAgSElUOiA0MDAwLFxuICAgIFJBVEVfUE9QVVA6IDUwMDAsXG4gICAgR1VJREVfSEFORDogNjAwMCxcbiAgICBFTkRfUEFORUw6IDcwMDAsXG4gICAgTE9BRElORzogODAwMCxcbn0gYXMgY29uc3Q7XG5cbi8qKiDnu5PnrpcgZW5kIOiKgueCueWGheWtkOiKgueCueebuOWvueWxgue6pyAqL1xuZXhwb3J0IGNvbnN0IFpfT1JERVJfRU5EX0NISUxEID0ge1xuICAgIERJTV9CQUNLRFJPUDogMCxcbiAgICBTVEFSOiAyMCxcbiAgICBTQ09SRTogNTUsXG4gICAgRE9XTkxPQUQ6IDY1LFxufSBhcyBjb25zdDtcblxuLyoqIOiDjOaZr+Wbvu+8iOS4jeWQiOWbvu+8jOWNleeLrOS/neeVme+8iSAqL1xuZXhwb3J0IGNvbnN0IElNR19CR19ESVIgPSAnaW1nJztcblxuLyoqIOeijuWbvuiHquWKqOWbvumbhuebruW9le+8iHVpLnBhY++8jOaehOW7uuaXtuWQiOaIkOS4gOW8oC/lpJrlvKDlm77pm4bvvIkgKi9cbmV4cG9ydCBjb25zdCBJTUdfRElSID0gJ2ltZy9hdGxhcyc7XG5cbi8qKiDoh6rliqjlm77pm4bphY3nva7otYTmupDlkI3vvIjkuI4gYXRsYXMvdWkucGFjIOWvueW6lO+8iSAqL1xuZXhwb3J0IGNvbnN0IElNR19BVVRPX0FUTEFTX1BBQyA9IGAke0lNR19ESVJ9L3VpYDtcblxuLyoqIOa2iOmZpOWkmuWwkeOAjOWvueOAjeWQjui/m+WFpee7k+eul+eVjOmdou+8iOaUueatpOWAvOWNs+WPr++8jOS4jeW/hea4heWujOaVtOebmO+8iSAqL1xuZXhwb3J0IGNvbnN0IFNFVFRMRU1FTlRfTUFUQ0hfUEFJUlMgPSA0O1xuXG4vKiog6L6+57uT566X5p2h5Lu25ZCO77yM5Ymp5L2Z54mM6Ieq5Yqo6YWN5a+55raI6Zmk55qE5oC75pe26ZW/77yI56eS77yJ77yM57uT5p2f5ZCO5YaN5by55Ye657uT566XICovXG5leHBvcnQgY29uc3QgQVVUT19DTEVBUl9CRUZPUkVfU0VUVExFTUVOVF9TRUMgPSAyO1xuXG4vKiog5Yqg6L295bGP5pyA55+t5bGV56S677yI56eS77yJICovXG5leHBvcnQgY29uc3QgTE9BRElOR19NSU5fVklTSUJMRV9TRUMgPSAwLjA4O1xuXG4vKiog6LWE5rqQ5bCx57uq5Y2z5YWz5Yqg6L295bGP77yM5YWl5Zy66JC954mM5Yqo55S75LiO5Y+v546p54q25oCB5bm26KGMICovXG5leHBvcnQgY29uc3QgTE9BRElOR19ISURFX0JFRk9SRV9FTlRSQU5DRSA9IHRydWU7XG5cbi8qKiDmjqfliLblj7DovpPlh7rlkITpmLbmrrXogJfml7bvvIjosIPor5XliqDovb3pgJ/luqbvvIkgKi9cbmV4cG9ydCBjb25zdCBMT0FESU5HX0xPR19USU1JTkcgPSB0cnVlO1xuXG4vKiog5ri45oiP55uu5qCH5bin546H77yIMCDooajnpLrkuI3pmZDliLbvvJvpq5jliLflsY/pooTop4jlu7rorq4gNjDvvIkgKi9cbmV4cG9ydCBjb25zdCBUQVJHRVRfRlJBTUVfUkFURSA9IDYwO1xuXG4vKiog6L+e5raI6K+E57qn5qGj5L2N5ZCN77yI5LiO6LS05Zu+5paH5Lu25ZCN5LiA6Ie077yJICovXG5leHBvcnQgY29uc3QgUkFURV9SRVNfS0VZUyA9IFsnZ29vZCcsICdncmVhdCcsICdleGNlbGxlbnQnLCAnYW1hemluZycsICd1bmJlbGlldmFibGUnXSBhcyBjb25zdDtcblxuLyoqIGNjLnJlc291cmNlcy5sb2FkIOeUqOeahOivhOe6p+Wbvui3r+W+hO+8iOWbvumbhuWGheWtkOWbvu+8iSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhdGVSZXNQYXRoKG5hbWU6IHR5cGVvZiBSQVRFX1JFU19LRVlTW251bWJlcl0pOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHtJTUdfRElSfS8ke25hbWV9YDtcbn1cblxuLyoqIOm6u+WwhueJjOmdouWbvuebruW9le+8iOWbvumbhuWGhSDniYzpnaIvIOWtkOebruW9le+8iSAqL1xuZXhwb3J0IGNvbnN0IFRJTEVfSUNPTl9QQVRIID0gYCR7SU1HX0RJUn0v54mM6Z2iL2A7XG5cbi8qKiDliIbmlbDlj5jljJbml7bniYzpnaLlkI7nmoTog4zlhYkgKi9cbmV4cG9ydCBjb25zdCBTQ09SRV9HTE9XX1BBVEggPSBgJHtJTUdfRElSfS/og4zlhYlgO1xuXG4vKiog5LiN5Y+v5raI5o+Q56S65Zu+5qCHICovXG5leHBvcnQgY29uc3QgRk9SQklEREVOX0lDT05fUEFUSCA9IGAke0lNR19ESVJ9L2ljb25fZm9yYmlkZGVuXzUwYDtcblxuLyoqIOW8leWvvOWwj+aJiyAqL1xuZXhwb3J0IGNvbnN0IEdVSURFX0hBTkRfUEFUSCA9IGAke0lNR19ESVJ9L+aJi+aMh+WktGA7XG5cbi8qKlxuICog5bCP5omL5pi+56S677yI5qOL55uY5Z2Q5qCH57O75YOP57Sg77yJXG4gKiAtIOmUmueCuSAoMCwwKSDlr7npvZDjgIzpnaDlt6bmj5DnpLrniYzjgI3moLnoioLngrnkuK3lv4PnmoTkuJbnlYzlnZDmoIdcbiAqIC0gb2Zmc2V0WCAvIG9mZnNldFnvvJrlnKjmo4vnm5jkuIrnmoTlvq7osIPvvIjmlLnov5nph4zkvJrnlJ/mlYjvvIlcbiAqL1xuZXhwb3J0IGNvbnN0IEdVSURFX0hBTkRfU1RZTEUgPSB7XG4gICAgc2NhbGU6IDAuMzgsXG4gICAgb2Zmc2V0WDogMCxcbiAgICBvZmZzZXRZOiAwLFxufTtcblxuLyoqIGxvY2FsU3RvcmFnZe+8muaYr+WQpuW3suWxleekuui/h+mmluasoeeCueWHu+W8leWvvOWwj+aJiyAqL1xuZXhwb3J0IGNvbnN0IEdVSURFX0hBTkRfU0VFTl9TVE9SQUdFX0tFWSA9ICdtal9ndWlkZV9oYW5kX3NlZW4nO1xuXG4vKiog5o+Q56S66bq75bCG5bem5Y+z5pmD5Yqo77yI5b6q546v5pKt5pS+77yM5q+P6L2u6Ze06ZqUIGdhcCDnp5LvvIkgKi9cbmV4cG9ydCBjb25zdCBISU5UX1NXQVlfU1RZTEUgPSB7XG4gICAgYW5nbGU6IDcsXG4gICAgc3RlcDogMC4xLFxuICAgIGdhcDogMS41LFxufTtcblxuLyoqIOa2iOmZpCBTcGluZe+8mnJlc291cmNlcy9zcGluZS9nYW1lcGxheV9lbGltaW5hdGlvbu+8jOWKqOeUu+WQjSBpbiAqL1xuZXhwb3J0IGNvbnN0IE1BVENIX0VMSU1JTkFUSU9OX1NQSU5FID0ge1xuICAgIHBhdGg6ICdzcGluZS9nYW1lcGxheV9lbGltaW5hdGlvbicsXG4gICAgYW5pbTogJ2luJyxcbiAgICBzY2FsZTogMC40NSxcbiAgICB6SW5kZXg6IFpfT1JERVIuTUFUQ0hfU1BJTkUsXG59O1xuXG4vKiog6YCJ5Lit5omr5YWJ77yI54mM6Z2i6YGu572p5YaF57uG5p2h5omr6L+H77yJICovXG5leHBvcnQgY29uc3QgU0VMRUNUX1NXRUVQX1NUWUxFID0ge1xuICAgIGR1cmF0aW9uOiAwLjU1LFxuICAgIGdhcDogMC40LFxuICAgIGVkZ2VJbnNldDogMyxcbiAgICBiYXJXaWR0aDogMTQsXG4gICAgYmFySGVpZ2h0UmF0aW86IDAuOTgsXG4gICAgYW5nbGU6IC0xNCxcbiAgICBwZWFrT3BhY2l0eTogMTQwLFxufTtcbiJdfQ==