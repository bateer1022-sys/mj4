"use strict";
cc._RF.push(module, 'e216aWcAc5LWZ+JKFI6x6JN', 'main');
// script/main.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var super_html_playable_1 = require("./super_html_playable");
var ccclass = cc._decorator.ccclass;
/** 随机牌面 key 集合 */
var MJ_FACE_KEYS = ['w1', 't1', 'b1', 'w5', 't5', 'b5', 'Z_bei', 'b9', 'Z_zhong', 't8'];
/** 无消除后再次引导的间隔秒数 */
var GUIDE_IDLE_SECONDS = 3;
/** 托盘内交换相邻麻将的时长（秒） */
var TRAY_SWAP_DURATION = 0.3;
/** 达到该累计消除对数时触发下载 */
var DOWNLOAD_TRIGGER_PAIR_COUNT = 3;
/** 对撞前左右外拉距离（像素） */
var TRAY_ELIM_SPREAD = 50;
/** 对撞前外拉阶段时长（秒） */
var TRAY_ELIM_OUT_DURATION = 0.2;
/** 对撞回中阶段时长（秒，使用加速 easing） */
var TRAY_ELIM_IN_DURATION = 0.1;
/** 交换完成后到开始对撞的间隔（秒） */
var TRAY_COLLISION_DELAY_AFTER_SWAP = 0.2;
/** 激励词首轮触发步长（累计消除数：2/4/6/...） */
var WORD_VFX_FIRST_TRIGGER_STEP = 2;
/** 激励词首轮全部播完后，最终词触发间隔 */
var WORD_VFX_REPEAT_INTERVAL = 4;
/** 激励词动画顺序（按累计消除阈值递进） */
var WORD_VFX_ANIMS = ['in_good', 'in_great', 'in_excellent', 'in_amazing', 'in_unbelievable'];
/** 一局清盘目标总分基准（约 2W，每局在此附近小幅浮动） */
var TARGET_FINAL_SCORE = 20000;
/** 清盘总分相对基准的最大浮动（±，结果为 10 的倍数） */
var TARGET_FINAL_SCORE_JITTER = 400;
/** 每次加分的最小步进 */
var SCORE_DELTA_STEP = 10;
/** 各激励档位得分权重（与 WORD_VFX_ANIMS 递进对应） */
var SCORE_TIER_WEIGHTS = [1, 1.85, 2.7, 3.8, 5.2, 7.5];
/** unbelievable 每叠一层额外权重 */
var SCORE_UNBELIEVABLE_WEIGHT_STEP = 1.15;
/** 连消音效资源路径（按递进顺序，使用 resources 相对路径且不带扩展名） */
var COMBO_SOUND_PATHS = [
    'sound/s_combo_1',
    'sound/s_combo_2',
    'sound/s_combo_3',
    'sound/s_combo_4',
    'sound/s_combo_5',
    'sound/s_combo_6',
];
/** 分数变化时播放的 spine 动画名 */
var SCORE_VFX_ANIM = 'in1';
/** 高亮圈按麻将尺寸适配的基准系数 */
var GUIDE_HINT_TILE_FIT_MARGIN = 1.08;
/** 高亮圈最终放大倍率（可调） */
var GUIDE_HINT_SCALE_MULTIPLIER = 1.9;
/** 启动加载：棋盘准备完成 key */
var LOADING_KEY_BOARD = 'board';
/** 启动加载：消除特效准备完成 key */
var LOADING_KEY_ELIMINATION = 'elimination';
/** 启动加载：高亮引导准备完成 key */
var LOADING_KEY_GUIDE_HINT = 'guide_hint';
/** 启动加载：手指引导准备完成 key */
var LOADING_KEY_GUIDE_FINGER = 'guide_finger';
/** 阴影 X 偏移（像素） */
var SHADOW_OFFSET_X = 0;
/** 阴影 Y 偏移（像素） */
var SHADOW_OFFSET_Y = 0;
/** 阴影 X 缩放 */
var SHADOW_SCALE_X = 1.05;
/** 阴影 Y 缩放 */
var SHADOW_SCALE_Y = 1.05;
/** 阴影透明度（0-255） */
var SHADOW_OPACITY = 185;
/** 麻将水平间距系数（1=刚好相接） */
var TILE_PAD_X = 0.94;
/** 麻将垂直间距系数（1=刚好相接） */
var TILE_PAD_Y = 0.94;
function isValid(node) {
    return node && cc.isValid(node);
}
/** SHOW_ALL 下背景 cover 铺满可视区域（不含屏外黑边） */
function layoutShowAllCover(node, canvas) {
    if (!node || !isValid(node) || !canvas || !isValid(canvas)) {
        return;
    }
    node.setPosition(0, 0);
    var scaleForShowAll = Math.min(cc.view.getCanvasSize().width / canvas.width, cc.view.getCanvasSize().height / canvas.height);
    var realWidth = node.width * scaleForShowAll;
    var realHeight = node.height * scaleForShowAll;
    node.scale = Math.max(cc.view.getCanvasSize().width / realWidth, cc.view.getCanvasSize().height / realHeight);
}
var GameController = /** @class */ (function (_super) {
    __extends(GameController, _super);
    function GameController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.boardRoot = null;
        _this.faceFrames = {};
        _this.shadowFrame = null;
        _this.banFrame = null;
        _this.tileScale = 1;
        _this.layer1CenterY = -90;
        _this.boardOffsetY = 0;
        _this.boardPadding = 10;
        _this.boardBottomGap = 20;
        _this.hasBoardBounds = false;
        _this.boardMinX = 0;
        _this.boardMinY = 0;
        _this.boardMaxX = 0;
        _this.boardMaxY = 0;
        _this.boardStepX = 0;
        _this.boardStepY = 0;
        _this.allTiles = [];
        _this.slotNodes = [];
        _this.tray = [null, null, null, null];
        _this.trayBusy = false;
        _this.eliminationVfxNode = null;
        _this.eliminationVfx = null;
        _this.banHintNodes = [];
        _this.guideHintSpineData = null;
        _this.guideFingerSpineData = null;
        _this.guideHintNodes = [];
        _this.guideFingerNode = null;
        _this.guideLastEliminationAt = 0;
        _this.guideNeedsFirstShow = true;
        _this.loadingMaskNode = null;
        _this.loadingSpinnerNode = null;
        _this.startupPending = new Set();
        _this.scoreCount = 0;
        /** 本局已消除对数（用于激励词/音效/下载，与显示分数分离） */
        _this.eliminationPairCount = 0;
        /** 按消除序号预分配的加分（总和约 TARGET_FINAL_SCORE） */
        _this.scoreDeltaByPairIndex = [];
        _this.countLabel = null;
        _this.scoreVfxNode = null;
        _this.scoreVfx = null;
        _this.wordVfxNode = null;
        _this.wordVfx = null;
        _this.wordTierIndex = 0;
        _this.wordLastFinalTriggerCount = 0;
        _this.comboSounds = [];
        _this.settlementShown = false;
        _this.settlementVictoryNode = null;
        _this.settlementVictorySk = null;
        _this.settlementTaskLightSk = null;
        _this.settlementCountLabel = null;
        _this.settlementDownloadNode = null;
        _this.settlementStarNodes = [];
        _this.settlementStarTargets = [];
        _this.downloadTriggered = false;
        /** 本局棋盘发牌序列（每种牌面数量为偶数） */
        _this.boardFaceKeys = [];
        _this.boardFaceKeyIndex = 0;
        return _this;
    }
    /** 组件加载时初始化所有运行时数据与资源 */
    GameController.prototype.onLoad = function () {
        var _this = this;
        this.showLoadingScreen();
        this.startupPending = new Set([
            LOADING_KEY_BOARD,
            LOADING_KEY_ELIMINATION,
            LOADING_KEY_GUIDE_HINT,
            LOADING_KEY_GUIDE_FINGER,
        ]);
        cc.view.setResizeCallback(function () {
            _this.layoutBackground();
            _this.fitBoardToScreen();
            _this.layoutLoadingScreen();
        }, this);
        this.ensureBoardRoot();
        this.initScoreUI();
        this.collectSlotNodes();
        this.initEliminationVfx();
        this.initWordVfx();
        this.initComboSounds();
        this.initGuideAssets();
        this.schedule(this.tickGuideHint, GUIDE_IDLE_SECONDS);
        this.loadFacesAndBuild();
    };
    /** 组件销毁时清理定时器与回调 */
    GameController.prototype.onDestroy = function () {
        cc.view.setResizeCallback(null, null);
        this.unschedule(this.tickGuideHint);
    };
    /** 首帧启动入口，设置背景与跳转链接 */
    GameController.prototype.start = function () {
        this.layoutBackground();
        super_html_playable_1.default.set_google_play_url('https://apps.apple.com/us/app/mahjong-blast/id6754014472');
        super_html_playable_1.default.set_app_store_url('https://play.google.com/store/apps/details?id=com.hungrystudio.mahjong');
    };
    /** 下载 */
    GameController.prototype.downLoad = function () {
        super_html_playable_1.default.game_end();
        super_html_playable_1.default.download();
    };
    /** 游戏结束 */
    GameController.prototype.gameEnd = function () {
    };
    /** 适配并铺满背景图 */
    GameController.prototype.layoutBackground = function () {
        var bg = this.node.getChildByName('bg');
        if (!bg || !isValid(bg)) {
            return;
        }
        layoutShowAllCover(bg, this.node);
        var end = this.node.getChildByName('end');
        var mask = end.getChildByName('mask');
        if (mask && mask != null) {
            layoutShowAllCover(mask, this.node);
        }
    };
    /** 创建并显示启动加载遮罩 */
    GameController.prototype.showLoadingScreen = function () {
        if (this.loadingMaskNode && cc.isValid(this.loadingMaskNode)) {
            this.loadingMaskNode.active = true;
            return;
        }
        var mask = new cc.Node('loading_mask');
        mask.parent = this.node;
        mask.zIndex = 20000;
        mask.opacity = 220;
        mask.color = new cc.Color(0, 0, 0, 255);
        mask.addComponent(cc.BlockInputEvents);
        var bg = mask.addComponent(cc.Sprite);
        bg.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        var spinner = new cc.Node('loading_spinner');
        spinner.parent = mask;
        spinner.setPosition(0, 0);
        var g = spinner.addComponent(cc.Graphics);
        g.lineWidth = 9;
        g.strokeColor = new cc.Color(255, 255, 255, 255);
        g.circle(0, 0, 34);
        g.stroke();
        this.playLoadingSpinnerLoop(spinner);
        this.loadingMaskNode = mask;
        this.loadingSpinnerNode = spinner;
        this.layoutLoadingScreen();
    };
    /** 根据画布尺寸更新加载遮罩布局 */
    GameController.prototype.layoutLoadingScreen = function () {
        if (!this.loadingMaskNode || !cc.isValid(this.loadingMaskNode)) {
            return;
        }
        this.loadingMaskNode.setContentSize(this.node.width, this.node.height);
        this.loadingMaskNode.setPosition(0, 0);
        if (this.loadingSpinnerNode && cc.isValid(this.loadingSpinnerNode)) {
            this.loadingSpinnerNode.setPosition(0, 0);
        }
    };
    /** 标记单项启动资源完成，全部完成后关闭加载页 */
    GameController.prototype.markStartupReady = function (key) {
        if (!this.startupPending.has(key)) {
            return;
        }
        this.startupPending.delete(key);
        if (this.startupPending.size === 0) {
            this.hideLoadingScreen();
        }
    };
    /** 隐藏并销毁加载遮罩 */
    GameController.prototype.hideLoadingScreen = function () {
        if (!this.loadingMaskNode || !cc.isValid(this.loadingMaskNode)) {
            return;
        }
        if (this.loadingSpinnerNode && cc.isValid(this.loadingSpinnerNode)) {
            this.loadingSpinnerNode.stopAllActions();
            this.loadingSpinnerNode.destroy();
            this.loadingSpinnerNode = null;
        }
        this.loadingMaskNode.destroy();
        this.loadingMaskNode = null;
    };
    /** 递归播放加载圆环旋转动画 */
    GameController.prototype.playLoadingSpinnerLoop = function (spinner) {
        var _this = this;
        if (!spinner || !cc.isValid(spinner) || !spinner.activeInHierarchy) {
            return;
        }
        cc.tween(spinner)
            .by(0.8, { angle: -360 })
            .call(function () { return _this.playLoadingSpinnerLoop(spinner); })
            .start();
    };
    /** 缓存结算页相关节点与组件引用 */
    GameController.prototype.cacheSettlementNodes = function () {
        var endNode = this.node.getChildByName('end');
        if (!endNode || !cc.isValid(endNode)) {
            return;
        }
        this.settlementVictoryNode = endNode.getChildByName('victory');
        this.settlementVictorySk = this.settlementVictoryNode ? this.settlementVictoryNode.getComponent(sp.Skeleton) : null;
        var taskLightNode = endNode.getChildByName('TaskLight');
        this.settlementTaskLightSk = taskLightNode ? taskLightNode.getComponent(sp.Skeleton) : null;
        var endCountNode = taskLightNode ? taskLightNode.getChildByName('endCount') : null;
        this.settlementCountLabel = endCountNode ? endCountNode.getComponent(cc.Label) : null;
        this.settlementDownloadNode = endNode.getChildByName('download');
        this.settlementStarNodes = ['star1', 'star2', 'star3']
            .map(function (n) { return endNode.getChildByName(n); })
            .filter(function (n) { return !!n && cc.isValid(n); });
        this.settlementStarTargets = this.settlementStarNodes.map(function (n) { return cc.v2(n.x, n.y); });
    };
    /** 重置结算页所有可动画元素到初始状态 */
    GameController.prototype.resetSettlementPresentation = function () {
        var _this = this;
        this.cacheSettlementNodes();
        if (this.settlementDownloadNode && cc.isValid(this.settlementDownloadNode)) {
            this.settlementDownloadNode.stopAllActions();
            this.settlementDownloadNode.scale = 1;
            this.settlementDownloadNode.active = false;
        }
        this.settlementStarNodes.forEach(function (n, idx) {
            if (!n || !cc.isValid(n)) {
                return;
            }
            n.stopAllActions();
            var target = _this.settlementStarTargets[idx];
            if (target) {
                n.setPosition(target);
            }
            n.setScale(1);
            n.opacity = 255;
        });
        if (this.settlementCountLabel && cc.isValid(this.settlementCountLabel.node)) {
            this.settlementCountLabel.node.stopAllActions();
            this.settlementCountLabel.node.setScale(1);
        }
        if (this.settlementTaskLightSk) {
            this.settlementTaskLightSk.clearTracks();
        }
        if (this.settlementVictorySk) {
            this.settlementVictorySk.clearTracks();
            this.settlementVictorySk.setCompleteListener(null);
        }
    };
    /** 播放结算页整套演出动画 */
    GameController.prototype.playSettlementSequence = function () {
        var _this = this;
        this.cacheSettlementNodes();
        if (this.settlementDownloadNode && cc.isValid(this.settlementDownloadNode)) {
            this.settlementDownloadNode.stopAllActions();
            this.settlementDownloadNode.scale = 1;
            this.settlementDownloadNode.active = false;
        }
        if (this.settlementVictorySk && this.settlementVictorySk.skeletonData) {
            var enterAnim = this.getSpineAnimName(this.settlementVictorySk.skeletonData, '合体_enter');
            var loopAnim_1 = this.getSpineAnimName(this.settlementVictorySk.skeletonData, '合体_Loop')
                || this.getSpineAnimName(this.settlementVictorySk.skeletonData, '合体_loop');
            if (!enterAnim || !loopAnim_1) {
                cc.warn('[GameController] victory 缺少合体_enter/合体_loop 动画');
            }
            else {
                this.settlementVictorySk.loop = false;
                this.settlementVictorySk.clearTracks();
                this.settlementVictorySk.setToSetupPose();
                this.settlementVictorySk.setAnimation(0, enterAnim, false);
                this.settlementVictorySk.setCompleteListener(function () {
                    if (!_this.settlementVictorySk) {
                        return;
                    }
                    _this.settlementVictorySk.setCompleteListener(null);
                    _this.settlementVictorySk.setAnimation(0, loopAnim_1, true);
                });
            }
        }
        this.settlementStarNodes.forEach(function (n, idx) {
            if (!n || !cc.isValid(n)) {
                return;
            }
            var target = _this.settlementStarTargets[idx] || cc.v2(n.x, n.y);
            n.stopAllActions();
            n.setPosition(0, 0);
            n.setScale(0.2);
            n.opacity = 0;
            cc.tween(n)
                .to(0.45, { position: target, scale: 1, opacity: 255 }, { easing: 'backOut' })
                .start();
        });
        if (this.settlementTaskLightSk && this.settlementTaskLightSk.skeletonData) {
            var taskAnim = this.getSpineAnimName(this.settlementTaskLightSk.skeletonData, 'Appear1');
            if (!taskAnim) {
                cc.warn('[GameController] TaskLight 缺少 Appear1 动画');
            }
            else {
                this.settlementTaskLightSk.loop = true;
                this.settlementTaskLightSk.clearTracks();
                this.settlementTaskLightSk.setToSetupPose();
                this.settlementTaskLightSk.setAnimation(0, taskAnim, true);
            }
        }
        if (this.settlementCountLabel && cc.isValid(this.settlementCountLabel.node)) {
            this.settlementCountLabel.string = this.formatScore(this.scoreCount);
            var n = this.settlementCountLabel.node;
            n.stopAllActions();
            n.setScale(1);
            cc.tween(n)
                .to(0.12, { scale: 1.16 }, { easing: 'quadOut' })
                .to(0.14, { scale: 1 }, { easing: 'quadIn' })
                .to(0.1, { scale: 1.1 }, { easing: 'quadOut' })
                .to(0.12, { scale: 1 }, { easing: 'quadIn' })
                .start();
        }
        if (this.settlementDownloadNode && cc.isValid(this.settlementDownloadNode)) {
            this.scheduleOnce(function () {
                if (!_this.settlementDownloadNode || !cc.isValid(_this.settlementDownloadNode)) {
                    return;
                }
                _this.settlementDownloadNode.active = true;
                _this.settlementDownloadNode.stopAllActions();
                _this.settlementDownloadNode.setScale(1);
                _this.playSettlementDownloadPulse();
            }, 0.65);
        }
    };
    /** 递归播放结算下载按钮呼吸动画 */
    GameController.prototype.playSettlementDownloadPulse = function () {
        var _this = this;
        if (!this.settlementDownloadNode || !cc.isValid(this.settlementDownloadNode) || !this.settlementDownloadNode.activeInHierarchy) {
            return;
        }
        cc.tween(this.settlementDownloadNode)
            .to(0.55, { scale: 1.08 }, { easing: 'sineInOut' })
            .to(0.55, { scale: 1.0 }, { easing: 'sineInOut' })
            .call(function () { return _this.playSettlementDownloadPulse(); })
            .start();
    };
    /** 确保牌盘根节点存在并放到正确层级 */
    GameController.prototype.ensureBoardRoot = function () {
        var root = this.node.getChildByName('tiles_board');
        if (!root) {
            root = new cc.Node('tiles_board');
            root.parent = this.node;
            root.setPosition(0, 0);
        }
        var beforeOverlay = this.node.getChildByName('hit') || this.node.getChildByName('end');
        if (beforeOverlay) {
            root.setSiblingIndex(beforeOverlay.getSiblingIndex());
        }
        else {
            root.setSiblingIndex(this.node.childrenCount - 1);
        }
        root.setPosition(0, this.boardOffsetY);
        this.boardRoot = root;
    };
    /** 初始化主界面分数显示与结算相关状态 */
    GameController.prototype.initScoreUI = function () {
        var countNode = this.node.getChildByName('count');
        this.countLabel = countNode ? countNode.getComponent(cc.Label) : null;
        this.initScoreVfx();
        this.scoreCount = 0;
        this.eliminationPairCount = 0;
        this.scoreDeltaByPairIndex = [];
        this.downloadTriggered = false;
        this.refreshScoreLabel(false);
        this.resetWordVfxProgress();
        this.settlementShown = false;
        var endNode = this.node.getChildByName('end');
        if (endNode && cc.isValid(endNode)) {
            endNode.active = false;
        }
        this.cacheSettlementNodes();
        this.resetSettlementPresentation();
    };
    /** 刷新主界面分数字符串，可选触发分数特效 */
    GameController.prototype.refreshScoreLabel = function (playVfx) {
        if (playVfx === void 0) { playVfx = true; }
        if (!this.countLabel || !cc.isValid(this.countLabel.node)) {
            return;
        }
        this.countLabel.string = this.formatScore(this.scoreCount);
        if (playVfx) {
            this.playScoreVfx();
        }
    };
    /** 初始化分数变化特效 spine */
    GameController.prototype.initScoreVfx = function () {
        this.scoreVfxNode = this.node.getChildByName('gameplay_score');
        this.scoreVfx = this.scoreVfxNode ? this.scoreVfxNode.getComponent(sp.Skeleton) : null;
        if (!this.scoreVfxNode || !this.scoreVfx) {
            return;
        }
        this.scoreVfx.loop = false;
        this.scoreVfx.clearTracks();
        this.scoreVfxNode.active = false;
    };
    /** 播放一次分数变化特效 */
    GameController.prototype.playScoreVfx = function () {
        var _this = this;
        if (!this.scoreVfx || !this.scoreVfxNode || !cc.isValid(this.scoreVfxNode) || !this.scoreVfx.skeletonData) {
            return;
        }
        var anim = this.getSpineAnimName(this.scoreVfx.skeletonData, SCORE_VFX_ANIM);
        if (!anim) {
            return;
        }
        this.scoreVfxNode.active = true;
        this.scoreVfx.clearTracks();
        this.scoreVfx.setToSetupPose();
        this.scoreVfx.setAnimation(0, anim, false);
        this.scoreVfx.setCompleteListener(function () {
            if (_this.scoreVfxNode && cc.isValid(_this.scoreVfxNode)) {
                _this.scoreVfxNode.active = false;
            }
            if (_this.scoreVfx) {
                _this.scoreVfx.setCompleteListener(null);
            }
        });
    };
    /** 加载牌面与相关资源，完成后构建牌盘 */
    GameController.prototype.loadFacesAndBuild = function () {
        var _this = this;
        var pending = MJ_FACE_KEYS.length + 2;
        MJ_FACE_KEYS.forEach(function (key) {
            cc.resources.load("img/atlas/\u724C\u9762/" + key, cc.SpriteFrame, function (err, sf) {
                if (!err && sf) {
                    _this.faceFrames[key] = sf;
                }
                pending -= 1;
                if (pending <= 0) {
                    _this.buildMahjongBoard();
                }
            });
        });
        cc.resources.load('img/atlas/shadow', cc.SpriteFrame, function (err, sf) {
            if (!err && sf) {
                _this.shadowFrame = sf;
            }
            else {
                cc.warn('[GameController] 阴影图加载失败，回退到 prefab di', err);
            }
            pending -= 1;
            if (pending <= 0) {
                _this.buildMahjongBoard();
            }
        });
        cc.resources.load('img/atlas/gameplay_ban', cc.SpriteFrame, function (err, sf) {
            if (!err && sf) {
                _this.banFrame = sf;
            }
            else {
                cc.warn('[GameController] 锁提示图加载失败', err);
            }
            pending -= 1;
            if (pending <= 0) {
                _this.buildMahjongBoard();
            }
        });
    };
    /** 重建整局麻将（层、牌、状态） */
    GameController.prototype.buildMahjongBoard = function () {
        var _this = this;
        if (!this.boardRoot || !cc.isValid(this.boardRoot)) {
            this.markStartupReady(LOADING_KEY_BOARD);
            return;
        }
        this.boardRoot.removeAllChildren();
        this.boardRoot.setScale(1);
        this.boardRoot.setPosition(0, this.boardOffsetY);
        this.hasBoardBounds = false;
        this.allTiles = [];
        this.tray = [null, null, null, null];
        this.trayBusy = false;
        this.scoreCount = 0;
        this.eliminationPairCount = 0;
        this.downloadTriggered = false;
        this.refreshScoreLabel(false);
        this.resetWordVfxProgress();
        this.settlementShown = false;
        var endNode = this.node.getChildByName('end');
        if (endNode && cc.isValid(endNode)) {
            endNode.active = false;
        }
        this.resetSettlementPresentation();
        this.clearGuideHintNow();
        this.guideNeedsFirstShow = true;
        this.guideLastEliminationAt = Date.now() / 1000;
        this.collectSlotNodes();
        cc.resources.load('mj', cc.Prefab, function (err, prefab) {
            if (err || !prefab) {
                cc.error('[GameController] 加载 mj 预制体失败', err);
                _this.markStartupReady(LOADING_KEY_BOARD);
                return;
            }
            var _a = _this.measureTileStep(prefab), stepX = _a.stepX, stepY = _a.stepY;
            _this.boardStepX = stepX;
            _this.boardStepY = stepY;
            var layout = _this.getReferenceLayoutUnits();
            _this.prepareBoardFaceKeys(layout);
            var layer1Shadow = _this.createLayer('layer_1_shadow', 0);
            var layer1 = _this.createLayer('layer_1', 1);
            _this.spawnByUnits(layer1, layer1Shadow, prefab, layout.layer1, stepX, stepY, 0, 1);
            var layer2Shadow = _this.createLayer('layer_2_shadow', 100);
            var layer2 = _this.createLayer('layer_2', 101);
            _this.spawnByUnits(layer2, layer2Shadow, prefab, layout.layer2, stepX, stepY, 100, 2, 0, 0.38);
            var layer3Shadow = _this.createLayer('layer_3_shadow', 200);
            var layer3 = _this.createLayer('layer_3', 201);
            _this.spawnByUnits(layer3, layer3Shadow, prefab, layout.layer3, stepX, stepY, 200, 3, 0, 0.72);
            cc.log('[GameController] 麻将已生成', layout.layer1.length, layout.layer2.length, layout.layer3.length);
            _this.cacheBoardBounds();
            _this.fitBoardToScreen();
            _this.tryShowGuideHint(true);
            _this.markStartupReady(LOADING_KEY_BOARD);
        });
    };
    /** 只按牌本体尺寸算步长（不含阴影），让牌与牌自然挨着 */
    /** 测量麻将步长用于网格排布 */
    GameController.prototype.measureTileStep = function (prefab) {
        var sample = cc.instantiate(prefab);
        sample.setScale(this.tileScale);
        var w = sample.width * this.tileScale;
        var h = sample.height * this.tileScale;
        sample.destroy();
        return {
            stepX: w * TILE_PAD_X,
            stepY: h * TILE_PAD_Y,
        };
    };
    /** 创建牌层/阴影层节点 */
    GameController.prototype.createLayer = function (name, zIndex) {
        var layer = new cc.Node(name);
        layer.parent = this.boardRoot;
        layer.zIndex = zIndex;
        return layer;
    };
    /** 参照示意图的上中下堆叠 + 中空结构 */
    /** 返回三层麻将参考布局坐标 */
    GameController.prototype.getReferenceLayoutUnits = function () {
        var make = function (source) {
            var seen = {};
            var out = [];
            source.forEach(function (_a) {
                var x = _a[0], y = _a[1];
                var key = x + "_" + y;
                if (!seen[key]) {
                    seen[key] = true;
                    out.push({ x: x, y: y });
                }
            });
            return out;
        };
        var layer1 = [];
        var layer2 = [];
        var layer3 = [];
        var addRect = function (arr, x0, x1, y0, y1) {
            for (var y = y0; y <= y1; y++) {
                for (var x = x0; x <= x1; x++) {
                    arr.push([x, y]);
                }
            }
        };
        var cutRect = function (arr, x0, x1, y0, y1) {
            for (var i = arr.length - 1; i >= 0; i--) {
                var _a = arr[i], x = _a[0], y = _a[1];
                if (x >= x0 && x <= x1 && y >= y0 && y <= y1) {
                    arr.splice(i, 1);
                }
            }
        };
        // 底层：减列（x: -3..3），总行数控制为 8 行（y: -4..3）
        // 上块（窄）
        addRect(layer1, -2, 2, 2, 3);
        addRect(layer1, -3, -3, 1, 3);
        addRect(layer1, 3, 3, 1, 3);
        addRect(layer1, -1, 1, 2, 2);
        // 过渡连接
        addRect(layer1, -3, -3, 1, 1);
        addRect(layer1, 3, 3, 1, 1);
        addRect(layer1, -2, 2, 0, 0);
        // 下块（高）
        addRect(layer1, -3, 3, -4, -2);
        addRect(layer1, -3, 3, -1, -1);
        addRect(layer1, -3, -3, 0, 0);
        addRect(layer1, 3, 3, 0, 0);
        addRect(layer1, -2, 2, 0, 0);
        // 底部中间局部镂空
        cutRect(layer1, -1, 1, -3, -2);
        // 第二层：纵向过渡（8 行范围）
        addRect(layer2, -2, 2, 2, 2);
        addRect(layer2, -1, 1, 2, 2);
        addRect(layer2, -1, 1, 1, 1);
        addRect(layer2, -1, 1, 0, 0);
        addRect(layer2, -1, 1, -1, -1);
        addRect(layer2, -2, 2, -2, -2);
        addRect(layer2, -1, 1, -3, -3);
        // 第三层：中心竖向小堆（8 行范围）
        addRect(layer3, -1, 1, 2, 2);
        addRect(layer3, 0, 0, 2, 2);
        addRect(layer3, -1, 1, 0, 0);
        addRect(layer3, 0, 0, -1, -1);
        addRect(layer3, -1, 1, -2, -2);
        // 补 1 格使总牌数为偶数，保证可全部成对消除
        addRect(layer3, 0, 0, -3, -3);
        return {
            layer1: make(layer1),
            layer2: make(layer2),
            layer3: make(layer3),
        };
    };
    /** 生成成对牌面序列并打乱，保证整盘可两两消除 */
    GameController.prototype.prepareBoardFaceKeys = function (layout) {
        var total = layout.layer1.length + layout.layer2.length + layout.layer3.length;
        this.boardFaceKeys = this.buildPairedFaceKeys(total);
        this.boardFaceKeyIndex = 0;
        this.prepareScoreCurve(Math.floor(total / 2));
    };
    /** 将加分取整为 SCORE_DELTA_STEP 的倍数（至少一步） */
    GameController.prototype.roundScoreDelta = function (value) {
        var step = SCORE_DELTA_STEP;
        return Math.max(step, Math.round(value / step) * step);
    };
    /** 本局清盘目标分：约 2W，每局在基准附近随机浮动且为 10 的倍数 */
    GameController.prototype.pickSessionTargetScore = function () {
        var jitterSteps = Math.floor(TARGET_FINAL_SCORE_JITTER / SCORE_DELTA_STEP);
        var offset = (Math.floor(Math.random() * (jitterSteps * 2 + 1)) - jitterSteps) * SCORE_DELTA_STEP;
        return TARGET_FINAL_SCORE + offset;
    };
    /** 按激励档位权重预分配每对消除加分（每项为 10 的倍数，总和约 2W 但不凑整） */
    GameController.prototype.prepareScoreCurve = function (totalPairs) {
        var _this = this;
        if (totalPairs <= 0) {
            this.scoreDeltaByPairIndex = [];
            return;
        }
        var sessionTarget = this.pickSessionTargetScore();
        var weights = [];
        for (var pair = 1; pair <= totalPairs; pair += 1) {
            var tier = this.getElimWordTier(pair);
            var capped = Math.min(tier, SCORE_TIER_WEIGHTS.length - 1);
            var base = SCORE_TIER_WEIGHTS[capped];
            var w = tier <= 5
                ? base
                : SCORE_TIER_WEIGHTS[5] + (tier - 5) * SCORE_UNBELIEVABLE_WEIGHT_STEP;
            weights.push(w);
        }
        var weightSum = weights.reduce(function (sum, w) { return sum + w; }, 0);
        this.scoreDeltaByPairIndex = weights.map(function (w) { return _this.roundScoreDelta((sessionTarget * w) / weightSum); });
    };
    /** 与激励词 spine 阈值一致的消除档位（0=未触发 good） */
    GameController.prototype.getElimWordTier = function (pairCount) {
        if (pairCount < 2) {
            return 0;
        }
        if (pairCount < 4) {
            return 1;
        }
        if (pairCount < 6) {
            return 2;
        }
        if (pairCount < 8) {
            return 3;
        }
        if (pairCount < 10) {
            return 4;
        }
        return 5 + Math.floor((pairCount - 10) / WORD_VFX_REPEAT_INTERVAL);
    };
    /** 消除一对后按档位叠加分数 */
    GameController.prototype.addScoreOnElimination = function () {
        this.eliminationPairCount += 1;
        var idx = this.eliminationPairCount - 1;
        var delta = SCORE_DELTA_STEP;
        if (idx >= 0 && idx < this.scoreDeltaByPairIndex.length) {
            delta = this.scoreDeltaByPairIndex[idx];
        }
        else {
            var tier = this.getElimWordTier(this.eliminationPairCount);
            var capped = Math.min(tier, SCORE_TIER_WEIGHTS.length - 1);
            var base = SCORE_TIER_WEIGHTS[capped];
            var w = tier <= 5
                ? base
                : SCORE_TIER_WEIGHTS[5] + (tier - 5) * SCORE_UNBELIEVABLE_WEIGHT_STEP;
            var weightSum = SCORE_TIER_WEIGHTS.reduce(function (s, v) { return s + v; }, 0);
            delta = this.roundScoreDelta((TARGET_FINAL_SCORE * w) / weightSum);
        }
        this.scoreCount += delta;
        this.refreshScoreLabel();
    };
    /** 分数展示格式化 */
    GameController.prototype.formatScore = function (value) {
        return "" + Math.max(0, Math.floor(value));
    };
    /** 构建偶数张牌面 key 列表（每种 key 成对出现） */
    GameController.prototype.buildPairedFaceKeys = function (tileCount) {
        if (tileCount % 2 !== 0) {
            cc.warn('[GameController] 牌数为奇数，无法保证全部成对，请检查布局');
        }
        var count = tileCount - (tileCount % 2);
        var keys = [];
        var source = MJ_FACE_KEYS;
        var pairCount = Math.max(0, Math.floor(count / 2));
        for (var i = 0; i < pairCount; i += 1) {
            var key = source[Math.floor(Math.random() * source.length)];
            keys.push(key, key);
        }
        for (var i = keys.length - 1; i > 0; i -= 1) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = keys[i];
            keys[i] = keys[j];
            keys[j] = tmp;
        }
        return keys;
    };
    /** 取下一张待发牌面 key；用尽时返回 null（不再发牌） */
    GameController.prototype.takeBoardFaceKey = function () {
        if (this.boardFaceKeyIndex >= this.boardFaceKeys.length) {
            return null;
        }
        var key = this.boardFaceKeys[this.boardFaceKeyIndex];
        this.boardFaceKeyIndex += 1;
        return key;
    };
    /** 按坐标批量生成一层麻将 */
    GameController.prototype.spawnByUnits = function (parent, shadowParent, prefab, units, stepX, stepY, zBase, layerOrder, offsetXUnits, offsetYUnits) {
        var _this = this;
        if (offsetXUnits === void 0) { offsetXUnits = 0; }
        if (offsetYUnits === void 0) { offsetYUnits = 0; }
        // 同一层渲染顺序：按右下方向递增，确保右下角 zIndex 最高
        var ordered = units.slice().sort(function (a, b) {
            var ax = a.x + offsetXUnits;
            var ay = a.y + offsetYUnits;
            var bx = b.x + offsetXUnits;
            var by = b.y + offsetYUnits;
            var aKey = ax - ay;
            var bKey = bx - by;
            if (Math.abs(aKey - bKey) > 0.0001) {
                return aKey - bKey;
            }
            if (Math.abs(ay - by) > 0.0001) {
                return by - ay;
            }
            return ax - bx;
        });
        ordered.forEach(function (u, idx) {
            var gridX = u.x + offsetXUnits;
            var gridY = u.y + offsetYUnits;
            var x = gridX * stepX;
            var y = gridY * stepY + _this.layer1CenterY;
            var faceKey = _this.takeBoardFaceKey();
            if (faceKey === null) {
                return;
            }
            _this.spawnTile(parent, shadowParent, prefab, x, y, zBase + idx, layerOrder, gridX, gridY, faceKey);
        });
    };
    /** 自动适配到屏幕安全区域，避免超出边界 */
    /** 将牌盘缩放并对齐到安全区域 */
    GameController.prototype.fitBoardToScreen = function () {
        if (!this.boardRoot || !cc.isValid(this.boardRoot) || !this.hasBoardBounds) {
            return;
        }
        var boundsW = Math.max(1, this.boardMaxX - this.boardMinX);
        var boundsH = Math.max(1, this.boardMaxY - this.boardMinY);
        var safeW = this.node.width - this.boardPadding * 2;
        var safeH = this.node.height - this.boardPadding * 2;
        var fitScale = Math.min(1, safeW / boundsW, safeH / boundsH);
        this.boardRoot.setScale(fitScale);
        var boundsCX = (this.boardMinX + this.boardMaxX) * 0.5;
        var targetCX = 0;
        var targetMinY = -this.node.height * 0.5 + this.boardBottomGap;
        this.boardRoot.setPosition(targetCX - boundsCX * fitScale, targetMinY - this.boardMinY * fitScale);
    };
    /** 仅在重建布局后计算一次包围盒，避免重复遍历 */
    /** 缓存牌盘包围盒供适配使用 */
    GameController.prototype.cacheBoardBounds = function () {
        if (!this.boardRoot || !cc.isValid(this.boardRoot) || this.boardRoot.childrenCount <= 0) {
            this.hasBoardBounds = false;
            return;
        }
        var minX = Number.POSITIVE_INFINITY;
        var minY = Number.POSITIVE_INFINITY;
        var maxX = Number.NEGATIVE_INFINITY;
        var maxY = Number.NEGATIVE_INFINITY;
        var hasRect = false;
        this.boardRoot.children.forEach(function (layer) {
            layer.children.forEach(function (n) {
                var r = n.getBoundingBox();
                if (!r) {
                    return;
                }
                hasRect = true;
                minX = Math.min(minX, r.xMin);
                minY = Math.min(minY, r.yMin);
                maxX = Math.max(maxX, r.xMax);
                maxY = Math.max(maxY, r.yMax);
            });
        });
        if (!hasRect) {
            this.hasBoardBounds = false;
            return;
        }
        this.boardMinX = minX;
        this.boardMinY = minY;
        this.boardMaxX = maxX;
        this.boardMaxY = maxY;
        this.hasBoardBounds = true;
    };
    /** 初始化消除特效 spine */
    GameController.prototype.initEliminationVfx = function () {
        var _this = this;
        var scene = cc.director.getScene();
        var root = scene || this.node;
        var name = 'gameplay_elimination_a';
        var node = root.getChildByName(name);
        if (!node) {
            node = cc.find(name);
        }
        if (!node) {
            node = new cc.Node(name);
        }
        if (node.parent !== this.node) {
            // 统一挂到 Canvas 下，避免在场景根节点导致被 UI 层遮挡
            node.parent = this.node;
        }
        this.eliminationVfxNode = node;
        this.eliminationVfx = node.getComponent(sp.Skeleton) || node.addComponent(sp.Skeleton);
        if (!this.eliminationVfx) {
            cc.warn('[GameController] 无法创建消除特效 sp.Skeleton 组件');
            this.markStartupReady(LOADING_KEY_ELIMINATION);
            return;
        }
        this.eliminationVfx.loop = false;
        this.eliminationVfxNode.zIndex = 9998;
        node.active = false;
        cc.resources.load('spine/gameplay_elimination_a', sp.SkeletonData, function (err, data) {
            if (err || !data || !_this.eliminationVfx || !cc.isValid(_this.eliminationVfx.node)) {
                cc.warn('[GameController] 消除特效资源加载失败', err);
                _this.markStartupReady(LOADING_KEY_ELIMINATION);
                return;
            }
            _this.eliminationVfx.skeletonData = data;
            _this.eliminationVfx.clearTracks();
            _this.eliminationVfx.setToSetupPose();
            _this.markStartupReady(LOADING_KEY_ELIMINATION);
        });
    };
    /** 获取消除特效实际可播放动画名 */
    GameController.prototype.getEliminationAnimName = function () {
        return this.getSpineAnimName(this.eliminationVfx ? this.eliminationVfx.skeletonData : null, 'in');
    };
    /** 初始化激励词特效 spine */
    GameController.prototype.initWordVfx = function () {
        var node = this.node.getChildByName('gameplay_word') || cc.find('Canvas/gameplay_word');
        if (!node) {
            cc.warn('[GameController] 未找到激励词节点 gameplay_word');
            return;
        }
        this.wordVfxNode = node;
        this.wordVfx = node.getComponent(sp.Skeleton);
        if (!this.wordVfx) {
            cc.warn('[GameController] gameplay_word 缺少 sp.Skeleton 组件');
            return;
        }
        this.wordVfx.loop = false;
        node.active = false;
    };
    /** 重置激励词触发进度 */
    GameController.prototype.resetWordVfxProgress = function () {
        this.wordTierIndex = 0;
        this.wordLastFinalTriggerCount = 0;
        if (this.wordVfx) {
            this.wordVfx.clearTracks();
            this.wordVfx.setCompleteListener(null);
        }
        if (this.wordVfxNode && cc.isValid(this.wordVfxNode)) {
            this.wordVfxNode.active = false;
        }
    };
    /** 按累计消除数判断并播放激励词 */
    GameController.prototype.tryPlayWordVfxByCount = function () {
        if (!this.wordVfx || !this.wordVfxNode || !cc.isValid(this.wordVfxNode) || !this.wordVfx.skeletonData) {
            return;
        }
        var total = this.eliminationPairCount;
        if (this.wordTierIndex < WORD_VFX_ANIMS.length) {
            var need = (this.wordTierIndex + 1) * WORD_VFX_FIRST_TRIGGER_STEP;
            if (total < need) {
                return;
            }
            var anim = WORD_VFX_ANIMS[this.wordTierIndex];
            this.wordTierIndex += 1;
            if (this.wordTierIndex >= WORD_VFX_ANIMS.length) {
                this.wordLastFinalTriggerCount = total;
            }
            this.playWordVfx(anim);
            return;
        }
        if (total - this.wordLastFinalTriggerCount < WORD_VFX_REPEAT_INTERVAL) {
            return;
        }
        this.wordLastFinalTriggerCount = total;
        this.playWordVfx(WORD_VFX_ANIMS[WORD_VFX_ANIMS.length - 1]);
    };
    /** 播放指定激励词动画 */
    GameController.prototype.playWordVfx = function (animName) {
        var _this = this;
        if (!this.wordVfx || !this.wordVfxNode || !cc.isValid(this.wordVfxNode)) {
            return;
        }
        this.wordVfxNode.active = true;
        this.wordVfxNode.setSiblingIndex(this.node.childrenCount - 1);
        this.wordVfx.clearTracks();
        this.wordVfx.setToSetupPose();
        this.wordVfx.setAnimation(0, animName, false);
        this.wordVfx.setCompleteListener(function () {
            if (_this.wordVfxNode && cc.isValid(_this.wordVfxNode)) {
                _this.wordVfxNode.active = false;
            }
            if (_this.wordVfx) {
                _this.wordVfx.setCompleteListener(null);
            }
        });
    };
    /** 预加载连消音效资源 */
    GameController.prototype.initComboSounds = function () {
        var _this = this;
        this.comboSounds = new Array(COMBO_SOUND_PATHS.length).fill(null);
        COMBO_SOUND_PATHS.forEach(function (path, idx) {
            cc.resources.load(path, cc.AudioClip, function (err, clip) {
                if (err || !clip) {
                    cc.warn('[GameController] 连消音效加载失败', path, err);
                    return;
                }
                _this.comboSounds[idx] = clip;
            });
        });
    };
    /** 按当前累计消除数播放递进音效 */
    GameController.prototype.playComboSoundByCount = function () {
        if (this.comboSounds.length === 0) {
            return;
        }
        var index = Math.max(0, Math.min(this.eliminationPairCount - 1, this.comboSounds.length - 1));
        var clip = this.comboSounds[index];
        if (!clip) {
            return;
        }
        cc.audioEngine.playEffect(clip, false);
    };
    /** 达到指定消除对数后触发一次下载 */
    GameController.prototype.checkAndTriggerDownloadByScore = function () {
        if (this.downloadTriggered) {
            return;
        }
        if (this.eliminationPairCount < DOWNLOAD_TRIGGER_PAIR_COUNT) {
            return;
        }
        this.downloadTriggered = true;
        this.downLoad();
    };
    /** 在两张牌中点播放消除特效 */
    GameController.prototype.playEliminationVfx = function (tileA, tileB) {
        var _this = this;
        if (!this.eliminationVfx || !this.eliminationVfxNode || !cc.isValid(this.eliminationVfxNode) || !this.eliminationVfx.skeletonData) {
            return;
        }
        var wA = tileA.convertToWorldSpaceAR(cc.v2(0, 0));
        var wB = tileB.convertToWorldSpaceAR(cc.v2(0, 0));
        var world = cc.v2((wA.x + wB.x) * 0.5, (wA.y + wB.y) * 0.5);
        var parent = this.eliminationVfxNode.parent;
        var local = parent ? parent.convertToNodeSpaceAR(world) : world;
        this.eliminationVfxNode.setPosition(local);
        this.eliminationVfxNode.active = true;
        this.eliminationVfxNode.setSiblingIndex(parent ? parent.childrenCount - 1 : 0);
        this.eliminationVfx.clearTracks();
        var animName = this.getEliminationAnimName();
        if (!animName) {
            this.eliminationVfxNode.active = false;
            return;
        }
        this.eliminationVfx.setAnimation(0, animName, false);
        this.eliminationVfx.setCompleteListener(function () {
            if (cc.isValid(_this.eliminationVfxNode)) {
                _this.eliminationVfxNode.active = false;
            }
            if (_this.eliminationVfx) {
                _this.eliminationVfx.setCompleteListener(null);
            }
        });
    };
    /** 搜索并缓存4个托盘格子节点 */
    GameController.prototype.collectSlotNodes = function () {
        var found = [];
        var visit = function (node) {
            if (node.name === 'slot_frame') {
                found.push(node);
            }
            node.children.forEach(function (ch) { return visit(ch); });
        };
        visit(this.node);
        found.sort(function (a, b) {
            if (Math.abs(a.y - b.y) > 1) {
                return b.y - a.y;
            }
            return a.x - b.x;
        });
        this.slotNodes = found.slice(0, 4);
    };
    /** 处理麻将点击逻辑（可点校验与入托盘） */
    GameController.prototype.onTileTap = function (state) {
        if (this.settlementShown || this.trayBusy || state.removed || state.inTray || state.isAnimating || !cc.isValid(state.node)) {
            return;
        }
        this.clearGuideHintNow();
        var above = this.getBlockingAbove(state);
        if (above.length > 0) {
            this.shakeNodes(__spreadArrays([state], above));
            cc.log('不能点击：上层有麻将');
            return;
        }
        var side = this.getSideNeighbors(state);
        if (side.left && side.right) {
            this.shakeNodes([state, side.left, side.right]);
            this.showBanHints(state.node);
            cc.log('不能点击：左右都被挡住');
            return;
        }
        this.moveToTray(state);
    };
    /** 预加载引导相关 spine 资源 */
    GameController.prototype.initGuideAssets = function () {
        var _this = this;
        cc.resources.load('spine/gameplay_hint', sp.SkeletonData, function (err, data) {
            if (err || !data) {
                cc.warn('[GameController] 引导光圈资源加载失败', err);
                _this.markStartupReady(LOADING_KEY_GUIDE_HINT);
                return;
            }
            _this.guideHintSpineData = data;
            _this.tryShowGuideHint(true);
            _this.markStartupReady(LOADING_KEY_GUIDE_HINT);
        });
        cc.resources.load('spine/gameplay_guide_finger', sp.SkeletonData, function (err, data) {
            if (err || !data) {
                cc.warn('[GameController] 引导手指资源加载失败', err);
                _this.markStartupReady(LOADING_KEY_GUIDE_FINGER);
                return;
            }
            _this.guideFingerSpineData = data;
            _this.tryShowGuideHint(true);
            _this.markStartupReady(LOADING_KEY_GUIDE_FINGER);
        });
    };
    /** 引导定时检查入口 */
    GameController.prototype.tickGuideHint = function () {
        if (this.trayBusy) {
            return;
        }
        // 每隔 3 秒检查一次；若当前已有引导在播，直接返回
        if (this.isGuideHintShowing()) {
            return;
        }
        this.tryShowGuideHint(false);
    };
    /** 根据时机判断是否显示引导 */
    GameController.prototype.tryShowGuideHint = function (forceFirst) {
        if (!this.guideHintSpineData || !this.guideFingerSpineData || this.allTiles.length === 0) {
            return;
        }
        if (this.isGuideHintShowing()) {
            return;
        }
        var now = Date.now() / 1000;
        var shouldShowFirst = this.guideNeedsFirstShow && forceFirst;
        var shouldShowByIdle = !this.guideNeedsFirstShow
            && now - this.guideLastEliminationAt >= GUIDE_IDLE_SECONDS;
        if (!shouldShowFirst && !shouldShowByIdle) {
            return;
        }
        var pair = this.findHintPair();
        if (!pair) {
            return;
        }
        this.showGuideHintPair(pair[0], pair[1]);
        this.guideNeedsFirstShow = false;
    };
    /** 挑选当前应引导的一对目标牌 */
    GameController.prototype.findHintPair = function () {
        var clickableBoardTiles = this.getClickableBoardTiles();
        var trayTiles = this.tray.filter(function (s) {
            return !!s && !s.removed && s.inTray && cc.isValid(s.node);
        });
        // 格子里有麻将时，优先引导「格子里的牌 + 下面可点同牌」
        if (trayTiles.length > 0) {
            var _loop_1 = function (i) {
                var trayState = trayTiles[i];
                var matched = clickableBoardTiles.find(function (b) { return b.faceKey === trayState.faceKey; });
                if (matched) {
                    return { value: [trayState, matched] };
                }
            };
            for (var i = 0; i < trayTiles.length; i += 1) {
                var state_1 = _loop_1(i);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
        }
        // 4 个格子为空（或无可匹配）时，从下面可点麻将里找一对
        var groups = {};
        clickableBoardTiles.forEach(function (s) {
            groups[s.faceKey] = groups[s.faceKey] || [];
            groups[s.faceKey].push(s);
        });
        var keys = Object.keys(groups);
        for (var i = 0; i < keys.length; i += 1) {
            var list = groups[keys[i]];
            if (list.length >= 2) {
                return [list[0], list[1]];
            }
        }
        return null;
    };
    /** 获取当前底牌中可点击集合 */
    GameController.prototype.getClickableBoardTiles = function () {
        var _this = this;
        return this.allTiles.filter(function (s) {
            if (s.removed || s.inTray || s.isAnimating || !cc.isValid(s.node)) {
                return false;
            }
            if (_this.getBlockingAbove(s).length > 0) {
                return false;
            }
            var side = _this.getSideNeighbors(s);
            return !(side.left && side.right);
        });
    };
    /** 确保引导高亮节点数量充足 */
    GameController.prototype.ensureGuideHintNodes = function (count) {
        var parent = this.boardRoot || this.node;
        for (var i = 0; i < count; i += 1) {
            var oldNode = this.guideHintNodes[i];
            if (oldNode && cc.isValid(oldNode)) {
                continue;
            }
            var node = new cc.Node("guide_hint_" + i);
            var skeleton = node.addComponent(sp.Skeleton);
            skeleton.loop = true;
            node.active = false;
            node.parent = parent;
            node.zIndex = 9997;
            this.guideHintNodes[i] = node;
        }
    };
    /** 确保引导手指节点存在 */
    GameController.prototype.ensureGuideFingerNode = function () {
        if (this.guideFingerNode && cc.isValid(this.guideFingerNode)) {
            return this.guideFingerNode;
        }
        var node = new cc.Node('guide_finger');
        node.parent = this.node;
        node.zIndex = 9998;
        node.active = false;
        this.guideFingerNode = node;
        node.addComponent(sp.Skeleton);
        return node;
    };
    /** 从 skeletonData 中选取可播放动画名 */
    GameController.prototype.getSpineAnimName = function (data, preferred) {
        if (!data) {
            return null;
        }
        var json = data.skeletonJson;
        var animations = json && json.animations ? Object.keys(json.animations) : [];
        if (animations.length === 0) {
            return null;
        }
        return animations.indexOf(preferred) >= 0 ? preferred : animations[0];
    };
    /** 读取 spine 资源的原始尺寸 */
    GameController.prototype.getSkeletonSize = function (data) {
        var json = data ? data.skeletonJson : null;
        var sk = json && json.skeleton ? json.skeleton : null;
        return {
            width: Math.max(1, sk && sk.width ? sk.width : 1),
            height: Math.max(1, sk && sk.height ? sk.height : 1),
        };
    };
    /** 显示一对麻将的引导（光圈+手指） */
    GameController.prototype.showGuideHintPair = function (a, b) {
        var _this = this;
        if (!cc.isValid(a.node) || !cc.isValid(b.node)) {
            return;
        }
        this.clearGuideHintNow();
        var pair = [a, b];
        this.ensureGuideHintNodes(pair.length);
        var hintAnim = this.getSpineAnimName(this.guideHintSpineData, 'in');
        if (!hintAnim) {
            return;
        }
        var skSize = this.getSkeletonSize(this.guideHintSpineData);
        pair.forEach(function (state, idx) {
            var hintNode = _this.guideHintNodes[idx];
            if (!hintNode || !cc.isValid(hintNode) || !cc.isValid(state.node)) {
                return;
            }
            var sk = hintNode.getComponent(sp.Skeleton);
            if (!sk) {
                return;
            }
            // 提示 spine 直接挂到麻将节点下
            hintNode.parent = state.node;
            hintNode.setSiblingIndex(Math.max(0, state.node.childrenCount - 1));
            hintNode.setPosition(0, 0);
            hintNode.active = true;
            sk.skeletonData = _this.guideHintSpineData;
            sk.loop = true;
            sk.clearTracks();
            sk.setToSetupPose();
            sk.setAnimation(0, hintAnim, true);
            var fitScale = Math.min((state.node.width * GUIDE_HINT_TILE_FIT_MARGIN) / skSize.width, (state.node.height * GUIDE_HINT_TILE_FIT_MARGIN) / skSize.height);
            hintNode.setScale(Math.max(0.1, fitScale * GUIDE_HINT_SCALE_MULTIPLIER));
            _this.shakeGuideTile(state.node);
        });
        var finger = this.ensureGuideFingerNode();
        var fingerSk = finger.getComponent(sp.Skeleton);
        var fingerAnim = this.getSpineAnimName(this.guideFingerSpineData, 'in');
        if (fingerSk && fingerAnim) {
            var fingerTarget = a.inTray && !b.inTray ? b : a;
            finger.active = true;
            fingerSk.skeletonData = this.guideFingerSpineData;
            fingerSk.loop = true;
            fingerSk.clearTracks();
            fingerSk.setToSetupPose();
            fingerSk.setAnimation(0, fingerAnim, true);
            var anchorWorld = fingerTarget.node.convertToWorldSpaceAR(cc.v2(fingerTarget.node.width * 0.16, fingerTarget.node.height * 0.18));
            finger.setPosition(this.node.convertToNodeSpaceAR(anchorWorld));
            var fingerSize = this.getSkeletonSize(this.guideFingerSpineData);
            var fingerScale = Math.max(0.2, (fingerTarget.node.height * 0.55) / fingerSize.height);
            finger.setScale(fingerScale);
        }
    };
    /** 判断当前是否已有引导正在显示 */
    GameController.prototype.isGuideHintShowing = function () {
        var hasHint = this.guideHintNodes.some(function (node) { return node && cc.isValid(node) && node.active; });
        var hasFinger = !!(this.guideFingerNode && cc.isValid(this.guideFingerNode) && this.guideFingerNode.active);
        return hasHint || hasFinger;
    };
    /** 引导目标麻将的轻微晃动动画 */
    GameController.prototype.shakeGuideTile = function (tileNode) {
        if (!cc.isValid(tileNode)) {
            return;
        }
        var p = tileNode.getPosition();
        cc.tween(tileNode)
            .to(0.05, { position: cc.v2(p.x - 7, p.y) })
            .to(0.05, { position: cc.v2(p.x + 7, p.y) })
            .to(0.05, { position: cc.v2(p.x - 5, p.y) })
            .to(0.05, { position: cc.v2(p.x + 5, p.y) })
            .to(0.05, { position: p })
            .start();
    };
    /** 立即清除当前所有引导表现 */
    GameController.prototype.clearGuideHintNow = function () {
        this.guideHintNodes.forEach(function (node) {
            if (!node || !cc.isValid(node)) {
                return;
            }
            var sk = node.getComponent(sp.Skeleton);
            if (sk) {
                sk.clearTracks();
            }
            node.active = false;
        });
        if (this.guideFingerNode && cc.isValid(this.guideFingerNode)) {
            var fingerSk = this.guideFingerNode.getComponent(sp.Skeleton);
            if (fingerSk) {
                fingerSk.clearTracks();
            }
            this.guideFingerNode.active = false;
        }
    };
    /** 确保左右锁提示节点存在 */
    GameController.prototype.ensureBanHintNodes = function () {
        if (this.banHintNodes.length === 2 && this.banHintNodes.every(function (n) { return cc.isValid(n); })) {
            return;
        }
        this.banHintNodes = [];
        var parent = this.boardRoot || this.node;
        for (var i = 0; i < 2; i++) {
            var node = new cc.Node("ban_hint_" + i);
            var sprite = node.addComponent(cc.Sprite);
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            node.active = false;
            node.opacity = 0;
            node.zIndex = 9999;
            node.parent = parent;
            this.banHintNodes.push(node);
        }
    };
    /** 显示被左右卡住时的锁提示 */
    GameController.prototype.showBanHints = function (targetNode) {
        var _this = this;
        if (!this.banFrame || !isValid(targetNode)) {
            return;
        }
        this.ensureBanHintNodes();
        if (this.banHintNodes.length !== 2 || !this.banHintNodes.every(function (n) { return cc.isValid(n); })) {
            return;
        }
        var worldRect = targetNode.getBoundingBoxToWorld();
        var edgeOffset = 0;
        var centerY = worldRect.center.y;
        var worldLeft = cc.v2(worldRect.xMin - edgeOffset, centerY);
        var worldRight = cc.v2(worldRect.xMax + edgeOffset, centerY);
        var positions = [worldLeft, worldRight];
        this.banHintNodes.forEach(function (hintNode, idx) {
            var sprite = hintNode.getComponent(cc.Sprite);
            if (!sprite) {
                return;
            }
            sprite.spriteFrame = _this.banFrame;
            hintNode.width = _this.banFrame.getRect().width;
            hintNode.height = _this.banFrame.getRect().height;
            var parent = hintNode.parent;
            var localPos = parent ? parent.convertToNodeSpaceAR(positions[idx]) : positions[idx];
            hintNode.setPosition(localPos);
            hintNode.stopAllActions();
            hintNode.active = true;
            hintNode.opacity = 0;
            hintNode.setScale(1);
            cc.tween(hintNode)
                .to(0.08, { opacity: 255, scale: 1.02 })
                .to(0.1, { scale: 0.98 })
                .delay(0.08)
                .to(0.12, { opacity: 0, scale: 0.9 })
                .call(function () {
                if (cc.isValid(hintNode)) {
                    hintNode.active = false;
                }
            })
                .start();
        });
    };
    /** 获取覆盖在当前牌上方的阻挡牌 */
    GameController.prototype.getBlockingAbove = function (state) {
        var _this = this;
        var baseRect = state.node.getBoundingBoxToWorld();
        return this.allTiles.filter(function (t) {
            return !t.removed
                && !t.inTray
                && t.layerOrder > state.layerOrder
                && _this.rectOverlapRatio(baseRect, t.node.getBoundingBoxToWorld()) > 0.08;
        });
    };
    /** 获取同层左右相邻牌 */
    GameController.prototype.getSideNeighbors = function (state) {
        var left = null;
        var right = null;
        this.allTiles.forEach(function (t) {
            if (t === state || t.removed || t.inTray || t.layerOrder !== state.layerOrder) {
                return;
            }
            var dy = Math.abs(t.gridY - state.gridY);
            if (dy > 0.2) {
                return;
            }
            var dx = t.gridX - state.gridX;
            if (dx < -0.75 && dx > -1.25) {
                left = t;
            }
            else if (dx > 0.75 && dx < 1.25) {
                right = t;
            }
        });
        return { left: left, right: right };
    };
    /** 计算两个矩形重叠比例 */
    GameController.prototype.rectOverlapRatio = function (a, b) {
        var left = Math.max(a.xMin, b.xMin);
        var right = Math.min(a.xMax, b.xMax);
        var low = Math.max(a.yMin, b.yMin);
        var high = Math.min(a.yMax, b.yMax);
        if (right <= left || high <= low) {
            return 0;
        }
        var overlap = (right - left) * (high - low);
        var area = Math.max(1, a.width * a.height);
        return overlap / area;
    };
    /** 批量播放节点抖动反馈 */
    GameController.prototype.shakeNodes = function (states) {
        var handled = new Set();
        states.forEach(function (s) {
            var n = s.node;
            if (!n || !cc.isValid(n) || handled.has(n)) {
                return;
            }
            handled.add(n);
            var p = n.getPosition();
            n.stopAllActions();
            cc.tween(n)
                .to(0.04, { position: cc.v2(p.x - 8, p.y) })
                .to(0.04, { position: cc.v2(p.x + 8, p.y) })
                .to(0.04, { position: cc.v2(p.x - 5, p.y) })
                .to(0.04, { position: cc.v2(p.x + 5, p.y) })
                .to(0.04, { position: p })
                .start();
        });
    };
    /** 将可点击麻将移动到托盘 */
    GameController.prototype.moveToTray = function (state) {
        var _this = this;
        if (this.slotNodes.length < 4) {
            this.collectSlotNodes();
        }
        var slotIdx = this.tray.findIndex(function (s) { return s === null; });
        if (slotIdx < 0 || !this.slotNodes[slotIdx]) {
            cc.log('上方格子已满');
            return;
        }
        var slot = this.slotNodes[slotIdx];
        var targetScale = this.getScaleForSlot(state.node, slot);
        state.inTray = true;
        state.isAnimating = true;
        var node = state.node;
        if (state.shadowNode && cc.isValid(state.shadowNode)) {
            state.shadowNode.destroy();
            state.shadowNode = null;
        }
        var targetWorld = slot.convertToWorldSpaceAR(cc.v2(0, 0));
        var targetLocal = node.parent.convertToNodeSpaceAR(targetWorld);
        node.stopAllActions();
        cc.tween(node)
            .to(0.2, { position: targetLocal, scale: targetScale })
            .call(function () {
            if (!cc.isValid(node)) {
                return;
            }
            node.parent = slot;
            node.setPosition(0, 0);
            node.setScale(targetScale);
            state.isAnimating = false;
            _this.tray[slotIdx] = state;
            _this.resolveTrayPairs();
        })
            .start();
    };
    /** 扫描并处理托盘可消除配对 */
    GameController.prototype.resolveTrayPairs = function () {
        var _this = this;
        if (this.settlementShown || this.trayBusy) {
            return;
        }
        var pair = this.findFirstTrayPair();
        if (!pair) {
            if (this.isAllTilesCleared()) {
                this.showSettlementPage();
            }
            else if (this.isTrayFull()) {
                this.showSettlementPage();
            }
            return;
        }
        this.clearGuideHintNow();
        this.guideLastEliminationAt = Date.now() / 1000;
        this.trayBusy = true;
        this.eliminateTrayPair(pair[0], pair[1], function () {
            _this.compactTray();
            _this.trayBusy = false;
            _this.resolveTrayPairs();
        });
    };
    /** 判断托盘4格是否已满 */
    GameController.prototype.isTrayFull = function () {
        return this.tray.every(function (s) { return !!s; });
    };
    /** 棋盘与托盘均已无剩余牌（全部消除完成） */
    GameController.prototype.isAllTilesCleared = function () {
        if (this.allTiles.length <= 0) {
            return false;
        }
        var boardEmpty = this.allTiles.every(function (t) { return t.removed; });
        var trayEmpty = this.tray.every(function (s) { return !s; });
        return boardEmpty && trayEmpty;
    };
    /** 显示结算页并播放结算演出 */
    GameController.prototype.showSettlementPage = function () {
        var _a;
        if (this.settlementShown) {
            return;
        }
        this.settlementShown = true;
        this.trayBusy = true;
        this.clearGuideHintNow();
        var endNode = this.node.getChildByName('end');
        if (!endNode || !cc.isValid(endNode)) {
            return;
        }
        this.slotNodes.forEach(function (slot) {
            if (slot && cc.isValid(slot)) {
                slot.active = false;
            }
        });
        if (this.boardRoot && cc.isValid(this.boardRoot)) {
            this.boardRoot.active = false;
        }
        (_a = this.countLabel) === null || _a === void 0 ? void 0 : _a.node.active = false;
        endNode.active = true;
        endNode.setSiblingIndex(this.node.childrenCount - 1);
        this.resetSettlementPresentation();
        this.playSettlementSequence();
    };
    /** 查找托盘中的第一组可配对下标 */
    GameController.prototype.findFirstTrayPair = function () {
        var groups = {};
        this.tray.forEach(function (s, i) {
            if (!s) {
                return;
            }
            groups[s.faceKey] = groups[s.faceKey] || [];
            groups[s.faceKey].push(i);
        });
        var keys = Object.keys(groups);
        for (var i = 0; i < keys.length; i += 1) {
            var idxs = groups[keys[i]];
            if (idxs.length >= 2) {
                return [idxs[0], idxs[1]];
            }
        }
        return null;
    };
    /** 执行托盘一对麻将的消除流程 */
    GameController.prototype.eliminateTrayPair = function (idxA, idxB, onDone) {
        var _this = this;
        this.makePairAdjacent(idxA, idxB, function (leftIdx, rightIdx) {
            var leftState = _this.tray[leftIdx];
            var rightState = _this.tray[rightIdx];
            if (!leftState || !rightState || !cc.isValid(leftState.node) || !cc.isValid(rightState.node)) {
                _this.markTrayTileRemoved(leftIdx);
                _this.markTrayTileRemoved(rightIdx);
                onDone();
                return;
            }
            _this.scheduleOnce(function () {
                _this.animateTrayPairCollision(leftIdx, rightIdx, onDone);
            }, TRAY_COLLISION_DELAY_AFTER_SWAP);
        });
    };
    /** 将托盘中一对牌交换成相邻位置 */
    GameController.prototype.makePairAdjacent = function (idxA, idxB, onDone) {
        var _this = this;
        var left = Math.min(idxA, idxB);
        var right = Math.max(idxA, idxB);
        var step = function () {
            if (right - left <= 1) {
                onDone(left, right);
                return;
            }
            _this.swapTraySlots(right - 1, right, function () {
                right -= 1;
                step();
            });
        };
        step();
    };
    /** 交换两个托盘槽位中的麻将 */
    GameController.prototype.swapTraySlots = function (i, j, onDone) {
        if (i === j || i < 0 || j < 0 || i >= this.tray.length || j >= this.tray.length) {
            onDone();
            return;
        }
        var slotI = this.slotNodes[i];
        var slotJ = this.slotNodes[j];
        if (!slotI || !slotJ) {
            onDone();
            return;
        }
        var stateI = this.tray[i];
        var stateJ = this.tray[j];
        this.tray[i] = stateJ;
        this.tray[j] = stateI;
        var pending = 0;
        var doneOne = function () {
            pending -= 1;
            if (pending <= 0) {
                onDone();
            }
        };
        if (stateI) {
            pending += 1;
            this.moveTrayStateToSlot(stateI, slotJ, TRAY_SWAP_DURATION, doneOne, 'cubicIn');
        }
        if (stateJ) {
            pending += 1;
            this.moveTrayStateToSlot(stateJ, slotI, TRAY_SWAP_DURATION, doneOne, 'cubicIn');
        }
        if (pending === 0) {
            onDone();
        }
    };
    /** 将托盘麻将状态移动到目标槽位 */
    GameController.prototype.moveTrayStateToSlot = function (state, slot, duration, onDone, easing) {
        if (easing === void 0) { easing = 'cubicIn'; }
        if (!state || !cc.isValid(state.node) || !slot || !cc.isValid(slot)) {
            onDone();
            return;
        }
        var n = state.node;
        var world = n.parent.convertToWorldSpaceAR(n.getPosition());
        n.parent = this.node;
        n.setPosition(this.node.convertToNodeSpaceAR(world));
        var targetWorld = slot.convertToWorldSpaceAR(cc.v2(0, 0));
        var targetLocal = this.node.convertToNodeSpaceAR(targetWorld);
        var targetScale = this.getScaleForSlot(n, slot);
        n.stopAllActions();
        cc.tween(n)
            .to(duration, { position: targetLocal, scale: targetScale }, { easing: easing })
            .call(function () {
            if (!cc.isValid(n)) {
                onDone();
                return;
            }
            n.parent = slot;
            n.setPosition(0, 0);
            n.setScale(targetScale);
            onDone();
        })
            .start();
    };
    /** 播放托盘两张牌对撞消除动画 */
    GameController.prototype.animateTrayPairCollision = function (leftIdx, rightIdx, onDone) {
        var _this = this;
        var left = this.tray[leftIdx];
        var right = this.tray[rightIdx];
        if (!left || !right || !cc.isValid(left.node) || !cc.isValid(right.node)) {
            this.markTrayTileRemoved(leftIdx);
            this.markTrayTileRemoved(rightIdx);
            onDone();
            return;
        }
        var leftNode = left.node;
        var rightNode = right.node;
        var leftWorld = leftNode.parent.convertToWorldSpaceAR(leftNode.getPosition());
        var rightWorld = rightNode.parent.convertToWorldSpaceAR(rightNode.getPosition());
        leftNode.parent = this.node;
        rightNode.parent = this.node;
        leftNode.setPosition(this.node.convertToNodeSpaceAR(leftWorld));
        rightNode.setPosition(this.node.convertToNodeSpaceAR(rightWorld));
        var pLeft = leftNode.getPosition();
        var pRight = rightNode.getPosition();
        var center = cc.v2((pLeft.x + pRight.x) * 0.5, (pLeft.y + pRight.y) * 0.5);
        var spread = Math.max(TRAY_ELIM_SPREAD, Math.abs(pRight.x - pLeft.x) * 0.18);
        var outLeft = cc.v2(pLeft.x - spread, pLeft.y);
        var outRight = cc.v2(pRight.x + spread, pRight.y);
        var meetDone = 0;
        var onMeet = function () {
            meetDone += 1;
            if (meetDone < 2) {
                return;
            }
            _this.playEliminationVfx(leftNode, rightNode);
            _this.addScoreOnElimination();
            _this.playComboSoundByCount();
            _this.tryPlayWordVfxByCount();
            _this.checkAndTriggerDownloadByScore();
            _this.markTrayTileRemoved(leftIdx);
            _this.markTrayTileRemoved(rightIdx);
            var destroyDone = 0;
            var onDestroyed = function () {
                destroyDone += 1;
                if (destroyDone >= 2) {
                    onDone();
                }
            };
            [leftNode, rightNode].forEach(function (n) {
                n.stopAllActions();
                cc.tween(n)
                    .to(0.09, { scale: 0 }, { easing: 'quartIn' })
                    .call(function () {
                    if (cc.isValid(n)) {
                        n.destroy();
                    }
                    onDestroyed();
                })
                    .start();
            });
        };
        leftNode.stopAllActions();
        rightNode.stopAllActions();
        cc.tween(leftNode)
            .to(TRAY_ELIM_OUT_DURATION, { position: outLeft }, { easing: 'quadIn' })
            .to(TRAY_ELIM_IN_DURATION, { position: center }, { easing: 'quartIn' })
            .call(onMeet)
            .start();
        cc.tween(rightNode)
            .to(TRAY_ELIM_OUT_DURATION, { position: outRight }, { easing: 'quadIn' })
            .to(TRAY_ELIM_IN_DURATION, { position: center }, { easing: 'quartIn' })
            .call(onMeet)
            .start();
    };
    /** 标记并清理托盘中已消除牌状态 */
    GameController.prototype.markTrayTileRemoved = function (idx) {
        if (idx < 0 || idx >= this.tray.length) {
            return;
        }
        var s = this.tray[idx];
        if (!s) {
            return;
        }
        s.removed = true;
        s.inTray = false;
        if (s.shadowNode && cc.isValid(s.shadowNode)) {
            s.shadowNode.destroy();
            s.shadowNode = null;
        }
        this.tray[idx] = null;
    };
    /** 消除后压缩托盘空位 */
    GameController.prototype.compactTray = function () {
        var _this = this;
        if (this.slotNodes.length < 4) {
            return;
        }
        var kept = this.tray.filter(function (s) { return !!s && !s.removed; });
        this.tray = [null, null, null, null];
        kept.forEach(function (s, i) {
            var targetSlot = _this.slotNodes[i];
            var targetScale = _this.getScaleForSlot(s.node, targetSlot);
            _this.tray[i] = s;
            var n = s.node;
            if (!cc.isValid(n) || !targetSlot) {
                return;
            }
            var world = n.parent.convertToWorldSpaceAR(n.getPosition());
            n.parent = _this.node;
            n.setPosition(_this.node.convertToNodeSpaceAR(world));
            var targetWorld = targetSlot.convertToWorldSpaceAR(cc.v2(0, 0));
            var targetLocal = _this.node.convertToNodeSpaceAR(targetWorld);
            cc.tween(n)
                .to(0.12, { position: targetLocal, scale: targetScale })
                .call(function () {
                if (!cc.isValid(n)) {
                    return;
                }
                n.parent = targetSlot;
                n.setPosition(0, 0);
                n.setScale(targetScale);
            })
                .start();
        });
    };
    /** 计算麻将适配托盘槽位的缩放 */
    GameController.prototype.getScaleForSlot = function (tileNode, slot) {
        var margin = 0.82;
        var sx = (slot.width * margin) / Math.max(1, tileNode.width);
        var sy = (slot.height * margin) / Math.max(1, tileNode.height);
        return Math.max(0.2, Math.min(sx, sy));
    };
    /** 生成单张麻将并绑定交互状态 */
    GameController.prototype.spawnTile = function (parent, shadowParent, prefab, x, y, zIndex, layerOrder, gridX, gridY, assignedFaceKey) {
        var _this = this;
        var node = cc.instantiate(prefab);
        node.parent = parent;
        node.setPosition(x, y);
        node.setScale(this.tileScale);
        node.zIndex = zIndex;
        var shadowNode = this.spawnTileShadow(node, shadowParent, x, y, zIndex);
        var faceKey = this.applyFace(node, assignedFaceKey);
        var state = {
            node: node,
            shadowNode: shadowNode,
            faceKey: faceKey,
            layerOrder: layerOrder,
            gridX: gridX,
            gridY: gridY,
            inTray: false,
            removed: false,
            isAnimating: false,
        };
        node.__tileState = state;
        this.allTiles.push(state);
        node.on(cc.Node.EventType.TOUCH_END, function () { return _this.onTileTap(state); }, this);
    };
    /** 生成独立阴影节点 */
    GameController.prototype.spawnTileShadow = function (tileNode, shadowParent, x, y, zIndex) {
        if (!this.shadowFrame) {
            return null;
        }
        var shadowNode = new cc.Node('mj_shadow');
        shadowNode.parent = shadowParent;
        shadowNode.zIndex = zIndex;
        shadowNode.setAnchorPoint(0.5, 0.5);
        var baseW = tileNode.width;
        var baseH = tileNode.height;
        shadowNode.setContentSize(baseW, baseH);
        shadowNode.opacity = SHADOW_OPACITY;
        shadowNode.color = new cc.Color(0, 0, 0, 255);
        shadowNode.setPosition(x + SHADOW_OFFSET_X, y + SHADOW_OFFSET_Y);
        shadowNode.setScale(this.tileScale * SHADOW_SCALE_X, this.tileScale * SHADOW_SCALE_Y);
        var spr = shadowNode.addComponent(cc.Sprite);
        spr.spriteFrame = this.shadowFrame;
        spr.type = cc.Sprite.Type.SIMPLE;
        spr.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        return shadowNode;
    };
    /** 将指定牌面贴图应用到麻将 */
    GameController.prototype.applyFace = function (node, faceKey) {
        var key = faceKey || MJ_FACE_KEYS[0];
        var sf = this.faceFrames[key];
        var icon = node.getChildByName('icon');
        if (!icon) {
            return key;
        }
        icon.active = true;
        if (sf) {
            var spr = icon.getComponent(cc.Sprite);
            if (spr) {
                spr.spriteFrame = sf;
                spr.sizeMode = cc.Sprite.SizeMode.TRIMMED;
            }
        }
        return key;
    };
    GameController = __decorate([
        ccclass
    ], GameController);
    return GameController;
}(cc.Component));
exports.default = GameController;

cc._RF.pop();