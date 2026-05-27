"use strict";
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