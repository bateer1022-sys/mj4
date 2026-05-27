
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/main.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var is_valid_1 = require("./is-valid");
var MatchRule_1 = require("./core/MatchRule");
var BoardManager_1 = require("./core/BoardManager");
var HintSolver_1 = require("./core/HintSolver");
var ArtScoreDisplay_1 = require("./ui/ArtScoreDisplay");
var GamePreloader_1 = require("./ui/GamePreloader");
var LoadingScreen_1 = require("./ui/LoadingScreen");
var GamePreloadConfig_1 = require("./ui/GamePreloadConfig");
var GameImgAtlas_1 = require("./ui/GameImgAtlas");
var ShowAllLayout_1 = require("./ui/ShowAllLayout");
var VictoryEndPanel_1 = require("./ui/VictoryEndPanel");
var super_html_playable_1 = require("./super_html_playable");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var LEVEL_PATH = 'data/level_01';
var CHECK_SOUND_PATH = 'check';
/** 无操作多少秒后自动高亮可消的一对 */
var IDLE_GUIDE_SECONDS = 2;
/** 提示跑马灯/晃动固定展示时长（秒内点击不提前关掉） */
var HINT_DISPLAY_SECONDS = 3;
/** 点击不可消牌：Canvas 上 hit 节点闪烁 */
var HIT_BLINK_STEP = 0.1;
var HIT_BLINK_COUNT = 3;
var HIT_BLINK_PEAK = 220;
var HIT_BLINK_LOW = 50;
/** 消除：先外弹 → 对齐 Y 中心 → 横向靠拢碰撞 → 消失 */
var MATCH_OUTWARD_DURATION = 0.14;
var MATCH_OUTWARD_DIST = 44;
var MATCH_ALIGN_Y_DURATION = 0.2;
var MATCH_MOVE_X_DURATION = 0.16;
var MATCH_TOUCH_DURATION = 0.08;
/** 两牌贴边相碰后停留再淡出 */
var MATCH_TOUCH_HOLD_DURATION = 0.18;
var MATCH_FADE_DURATION = 0.2;
/** 贴边后向中线轻顶一下（像素），不越过对侧 */
var MATCH_TOUCH_NUDGE = 5;
/** 结算前剩余牌快速自动消除 */
var AUTO_CLEAR_PAIR_FADE = 0.16;
var AUTO_CLEAR_MOVE_DURATION = 0.12;
var AUTO_CLEAR_STAGGER_MAX = 0.09;
/** 连消评级：情绪由弱到强，每多消 RATE_MATCH_STEP 对才升一级 */
var RATE_MATCH_STEP = 2;
var RATE_POP_IN_DURATION = 0.22;
var RATE_HOLD_DURATION = 0.55;
var RATE_POP_OUT_DURATION = 0.2;
/** 各档位基准缩放，越往后情绪越强、字越大 */
var RATE_TIER_SCALES = [0.68, 0.76, 0.84, 0.92, 1.02];
/** 评级图最大占屏宽比例，避免 unbelievable 等长图超出 */
var RATE_MAX_WIDTH_RATIO = 0.88;
/** 积分：基础 + 连击 + 评级阶段额外叠加 */
var SCORE_BASE = 200;
var SCORE_COMBO_ADD = 40;
var SCORE_RATE_BONUS = [100, 200, 350, 500, 800];
var SCORE_TOP_MARGIN = 64;
var GameController = /** @class */ (function (_super) {
    __extends(GameController, _super);
    function GameController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tilePrefab = null;
        _this.boardNode = null;
        _this.board = new BoardManager_1.BoardManager();
        _this.selected = null;
        _this.guideHighlight = null;
        /** 当前提示是否在固定展示窗口内（3 秒内不因点击取消） */
        _this.hintDisplayLocked = false;
        _this.gameReady = false;
        _this.isRemoving = false;
        _this.checkClip = null;
        _this.hitNode = null;
        _this.endNode = null;
        _this.comboNum = 0;
        /** 本局已成功消除的对数（达 SETTLEMENT_MATCH_PAIRS 即结算） */
        _this.matchPairCount = 0;
        _this.rateFrames = [];
        _this.ratePopupNode = null;
        _this.scoreNum = 0;
        _this.scoreDisplay = null;
        _this.scoreFont = null;
        _this.cachedLevelAsset = null;
        _this.loadingScreen = null;
        _this.isGameOver = false;
        /** 达结算条件后正在快速扫尾消除剩余牌 */
        _this.isAutoClearing = false;
        /** 本局是否已因点击收起引导小手 */
        _this.guideHandDismissedThisLevel = false;
        _this.onHintDisplayEnd = function () {
            if (!_this.isGuideHintActive()) {
                return;
            }
            _this.hintDisplayLocked = false;
            _this.clearGuideHighlight();
            _this.resetIdleGuideTimer();
        };
        _this.showFirstGuideHandDeferred = function () {
            if (!_this.guideHighlight || _this.guideHandDismissedThisLevel) {
                return;
            }
            _this.tryShowFirstGuideHand(_this.guideHighlight);
        };
        _this.finishAutoClearThenVictory = function () {
            if (!_this.isAutoClearing) {
                return;
            }
            _this.isAutoClearing = false;
            _this.fadeOutUnpairedRemainders();
            _this.board.refreshVisuals();
            _this.showVictory();
        };
        return _this;
    }
    GameController.prototype.onLoad = function () {
        var _this = this;
        if (GamePreloadConfig_1.TARGET_FRAME_RATE > 0) {
            cc.game.setFrameRate(GamePreloadConfig_1.TARGET_FRAME_RATE);
        }
        cc.view.setResizeCallback(function () {
            _this.layoutBackground();
            _this.layoutHit();
            _this.layoutScoreTop();
            _this.layoutEndDimBackdrop();
            if (_this.loadingScreen) {
                _this.loadingScreen.layout();
            }
        }, this);
    };
    GameController.prototype.onDestroy = function () {
        cc.view.setResizeCallback(null, null);
        this.unschedule(this.onIdleGuide);
    };
    GameController.prototype.start = function () {
        if (!this.tilePrefab) {
            cc.error('[GameController] 请在 Canvas 上绑定 mj 预制体');
            return;
        }
        this.boardNode = new cc.Node('Board');
        this.node.addChild(this.boardNode);
        this.hitNode = this.node.getChildByName('hit');
        if (this.hitNode && is_valid_1.isValid(this.hitNode)) {
            this.hitNode.active = false;
            this.hitNode.opacity = 0;
        }
        this.endNode = this.node.getChildByName('end');
        this.hideEndPanel();
        this.layoutBackground();
        this.layoutHit();
        this.layoutScoreTop();
        this.boardNode.active = false;
        this.startWithLoading();
        var google_play = "https://apps.apple.com/us/app/mahjong-royal-tiles/id6747492600";
        var appstore = "https://play.google.com/store/apps/details?id=com.nebula.mahjongtile";
        super_html_playable_1.default.set_google_play_url(google_play);
        super_html_playable_1.default.set_app_store_url(appstore);
    };
    /** 显示加载界面，预加载资源后进入关卡 */
    GameController.prototype.startWithLoading = function () {
        var _this = this;
        var loadT0 = GamePreloadConfig_1.LOADING_LOG_TIMING ? Date.now() : 0;
        this.loadingScreen = new LoadingScreen_1.LoadingScreen(this.node);
        this.loadingScreen.show(this.node);
        GamePreloader_1.GamePreloader.run(function () { }, function (result, err) {
            if (err || !result) {
                if (_this.loadingScreen) {
                    _this.loadingScreen.hide();
                }
                cc.warn('[GameController]', err || '加载失败');
                return;
            }
            _this.cachedLevelAsset = result.levelAsset;
            _this.applyPreloadResult(result);
            GamePreloader_1.GamePreloader.preloadGameplayAssets(function () { return _this.refreshLazyAssets(); });
            var levelT0 = GamePreloadConfig_1.LOADING_LOG_TIMING ? Date.now() : 0;
            _this.loadLevel(result.levelAsset, function () {
                _this.boardNode.active = true;
                if (_this.loadingScreen) {
                    _this.loadingScreen.hide(function () {
                        if (GamePreloadConfig_1.LOADING_LOG_TIMING) {
                            cc.log("[GameController] \u81F3\u5173\u52A0\u8F7D\u5C4F\u5173\u95ED " + (Date.now() - loadT0) + "ms" +
                                ("\uFF08\u5EFA\u5173 " + (Date.now() - levelT0) + "ms\uFF09"));
                        }
                    });
                }
            });
        });
    };
    GameController.prototype.applyPreloadResult = function (result) {
        if (result.checkClip) {
            this.checkClip = result.checkClip;
        }
        if (result.scoreFont) {
            this.scoreFont = result.scoreFont;
            this.scoreDisplay = ArtScoreDisplay_1.ArtScoreDisplay.fromFont(result.scoreFont);
            this.scoreDisplay.mount(this.node, SCORE_TOP_MARGIN);
            this.scoreDisplay.setValue(0, false);
        }
        if (result.guideHandSf) {
            this.board.setGuideHandSprite(result.guideHandSf);
        }
    };
    /** 后台资源进缓存后刷新引用 */
    GameController.prototype.refreshLazyAssets = function () {
        var _this = this;
        var frames = new Array(GamePreloadConfig_1.RATE_RES_KEYS.length);
        var pending = GamePreloadConfig_1.RATE_RES_KEYS.length;
        GamePreloadConfig_1.RATE_RES_KEYS.forEach(function (key, idx) {
            GameImgAtlas_1.loadGameSpriteFrame(GamePreloadConfig_1.rateResPath(key), function (frame) {
                pending--;
                if (frame) {
                    frames[idx] = frame;
                }
                if (pending === 0) {
                    _this.rateFrames = frames;
                }
            });
        });
        GameImgAtlas_1.loadGameSpriteFrame(GamePreloadConfig_1.GUIDE_HAND_PATH, function (sf) {
            if (sf) {
                _this.board.setGuideHandSprite(sf);
            }
        });
    };
    /** 引导小手：指向提示对子中靠左的一张 */
    GameController.prototype.tryShowFirstGuideHand = function (hint) {
        if (this.guideHandDismissedThisLevel) {
            return;
        }
        this.board.showHintGuideHand(this.pickLeftGuideHandTile(hint));
    };
    GameController.prototype.pickLeftGuideHandTile = function (hint) {
        if (hint.a.x !== hint.b.x) {
            return hint.a.x < hint.b.x ? hint.a : hint.b;
        }
        return hint.a.y <= hint.b.y ? hint.a : hint.b;
    };
    /** 顶部居中：Widget 对齐（位图字体 Label） */
    GameController.prototype.layoutScoreTop = function () {
        if (!this.scoreDisplay || !is_valid_1.isValid(this.scoreDisplay.root)) {
            return;
        }
        this.scoreDisplay.setTopMargin(SCORE_TOP_MARGIN);
    };
    /** SHOW_ALL 下背景 cover 铺满可视区域（不含屏外黑边） */
    GameController.prototype.layoutBackground = function () {
        var bg = this.node.getChildByName('bg');
        if (!bg || !is_valid_1.isValid(bg)) {
            return;
        }
        ShowAllLayout_1.layoutShowAllCover(bg, this.node);
        this.layoutEndDimBackdrop();
    };
    /** 结算 end 黑底与 bg 同步缩放 */
    GameController.prototype.layoutEndDimBackdrop = function () {
        if (!this.endNode || !is_valid_1.isValid(this.endNode) || !this.endNode.active) {
            return;
        }
        VictoryEndPanel_1.layoutVictoryEndDimBackdrop(this.endNode, this.node);
    };
    /** 与 bg 相同：hit 按 SHOW_ALL 铺满可视区域 */
    GameController.prototype.layoutHit = function () {
        var hit = this.hitNode;
        if (!hit || !is_valid_1.isValid(hit)) {
            return;
        }
        ShowAllLayout_1.layoutShowAllCover(hit, this.node);
        hit.setPosition(0, 0);
    };
    /** 全屏 hit 遮罩闪烁（点击不可消牌） */
    GameController.prototype.playHitBlink = function () {
        if (!this.hitNode || !is_valid_1.isValid(this.hitNode)) {
            return;
        }
        var hit = this.hitNode;
        this.layoutHit();
        hit.stopAllActions();
        hit.zIndex = GamePreloadConfig_1.Z_ORDER.HIT;
        hit.active = true;
        hit.opacity = 0;
        var steps = [];
        for (var i = 0; i < HIT_BLINK_COUNT; i++) {
            steps.push(cc.fadeTo(HIT_BLINK_STEP, HIT_BLINK_PEAK));
            steps.push(cc.fadeTo(HIT_BLINK_STEP, HIT_BLINK_LOW));
        }
        steps.push(cc.fadeTo(HIT_BLINK_STEP, 0));
        steps.push(cc.callFunc(function () {
            if (hit && is_valid_1.isValid(hit)) {
                hit.active = false;
                hit.opacity = 0;
            }
        }, this));
        hit.runAction(cc.sequence(steps));
    };
    GameController.prototype.loadLevel = function (cachedLevel, onReady) {
        var _this = this;
        this.gameReady = false;
        this.isGameOver = false;
        this.isAutoClearing = false;
        this.unschedule(this.finishAutoClearThenVictory);
        this.hideEndPanel();
        this.comboNum = 0;
        this.matchPairCount = 0;
        this.scoreNum = 0;
        if (this.scoreDisplay) {
            this.scoreDisplay.setValue(0, false);
        }
        this.board.hideHintGuideHand();
        this.guideHandDismissedThisLevel = false;
        this.clearGuideHighlight();
        this.unschedule(this.onIdleGuide);
        this.board.loadLevel(LEVEL_PATH, function (err) {
            if (err) {
                cc.warn('[GameController]', err);
                if (onReady) {
                    onReady();
                }
                return;
            }
            _this.board.spawn(_this.tilePrefab, _this.boardNode, function () {
                _this.board.bindBoardClick(_this.node, function (tile) { return _this.onTileTap(tile); });
                _this.gameReady = true;
                _this.resetIdleGuideTimer();
                if (GamePreloadConfig_1.LOADING_HIDE_BEFORE_ENTRANCE && onReady) {
                    onReady();
                }
            }, function () {
                _this.showGuideHighlight();
                if (!GamePreloadConfig_1.LOADING_HIDE_BEFORE_ENTRANCE && onReady) {
                    onReady();
                }
            });
        }, cachedLevel);
    };
    /** 当前是否正在展示提示（跑马灯/晃动窗口内不再重复触发） */
    GameController.prototype.isGuideHintActive = function () {
        return this.hintDisplayLocked && this.guideHighlight != null;
    };
    /** 高亮一对可消除的牌（入场完成 / 长时间无操作）：外缘跑马灯，固定展示 3 秒 */
    GameController.prototype.showGuideHighlight = function () {
        if (!this.gameReady || this.isRemoving || this.board.entrancePlaying)
            return;
        if (this.isGuideHintActive()) {
            return;
        }
        var hint = HintSolver_1.findHint(this.board.tiles);
        if (!hint) {
            this.clearGuideHighlight();
            return;
        }
        this.clearGuideHighlight();
        this.guideHighlight = hint;
        this.guideHandDismissedThisLevel = false;
        this.hintDisplayLocked = true;
        this.unschedule(this.onHintDisplayEnd);
        this.scheduleOnce(this.onHintDisplayEnd, HINT_DISPLAY_SECONDS);
        this.board.showGuideHintPair(hint.a, hint.b);
        this.unschedule(this.showFirstGuideHandDeferred);
        this.scheduleOnce(this.showFirstGuideHandDeferred, 0.12);
    };
    GameController.prototype.clearGuideHighlight = function () {
        this.unschedule(this.onHintDisplayEnd);
        this.unschedule(this.showFirstGuideHandDeferred);
        this.hintDisplayLocked = false;
        this.board.hideHintGuideHand();
        this.board.clearAllGuideMarquees();
        this.guideHighlight = null;
    };
    /** 点击选中牌时：取消全部跑马灯 / 晃动 / 小手提示 */
    GameController.prototype.cancelHintsOnSelect = function () {
        this.guideHandDismissedThisLevel = true;
        this.clearGuideHighlight();
        this.resetIdleGuideTimer();
    };
    GameController.prototype.resetIdleGuideTimer = function () {
        this.unschedule(this.onIdleGuide);
        if (!this.gameReady || this.isRemoving || this.board.entrancePlaying)
            return;
        this.scheduleOnce(this.onIdleGuide, IDLE_GUIDE_SECONDS);
    };
    GameController.prototype.onIdleGuide = function () {
        if (!this.gameReady || this.isAutoClearing || this.selected || this.isRemoving || this.board.entrancePlaying) {
            return;
        }
        if (this.isGuideHintActive()) {
            this.unschedule(this.onIdleGuide);
            this.scheduleOnce(this.onIdleGuide, IDLE_GUIDE_SECONDS);
            return;
        }
        this.showGuideHighlight();
    };
    GameController.prototype.onTileTap = function (tile) {
        if (this.isGameOver || this.isAutoClearing || tile.removed || this.isRemoving || this.board.entrancePlaying) {
            return;
        }
        if (!tile.free) {
            if (this.selected && this.selected.id !== tile.id) {
                this.deselectTile(this.selected);
            }
            this.comboNum = 0;
            this.board.playBlockedFeedback(tile);
            this.playHitBlink();
            return;
        }
        if (!this.selected) {
            this.cancelHintsOnSelect();
            this.selectTile(tile);
            return;
        }
        if (this.selected.id === tile.id) {
            this.deselectTile(this.selected);
            this.resetIdleGuideTimer();
            return;
        }
        if (!this.selected.free) {
            this.cancelHintsOnSelect();
            this.deselectTile(this.selected);
            this.selectTile(tile);
            return;
        }
        if (MatchRule_1.canMatch(this.selected, tile)) {
            var first = this.selected;
            this.selected = null;
            this.removePair(first, tile);
            return;
        }
        this.cancelHintsOnSelect();
        this.switchSelection(tile);
    };
    GameController.prototype.switchSelection = function (tile) {
        var prev = this.selected;
        if (prev && prev.id !== tile.id) {
            this.deselectTile(prev);
        }
        this.selectTile(tile);
    };
    GameController.prototype.selectTile = function (tile) {
        if (!tile.node || !is_valid_1.isValid(tile.node)) {
            return;
        }
        if (this.selected && this.selected.id !== tile.id) {
            this.deselectTile(this.selected);
        }
        this.selected = tile;
        this.board.bringTilesToFront([tile]);
        this.board.highlightTileSelect(tile);
    };
    GameController.prototype.deselectTile = function (tile, restoreZ) {
        if (restoreZ === void 0) { restoreZ = true; }
        if (this.selected && this.selected.id === tile.id) {
            this.selected = null;
        }
        if (!tile.removed && tile.node && is_valid_1.isValid(tile.node)) {
            this.board.restoreTileSelect(tile);
            if (restoreZ)
                this.board.restoreTileZIndex(tile);
            this.board.applyVisual(tile);
        }
        this.resetIdleGuideTimer();
    };
    GameController.prototype.removePair = function (a, b) {
        var _this = this;
        if (!a.node || !b.node || !is_valid_1.isValid(a.node) || !is_valid_1.isValid(b.node))
            return;
        this.unschedule(this.onIdleGuide);
        this.clearGuideHighlight();
        this.selected = null;
        this.board.clearTileSelectForMatch(a);
        this.board.clearTileSelectForMatch(b);
        var leftTile = a.x <= b.x ? a : b;
        var rightTile = a.x <= b.x ? b : a;
        this.board.bringMatchPairToFront(leftTile, rightTile);
        a.removed = true;
        b.removed = true;
        this.isRemoving = true;
        var midY = (a.y + b.y) * 0.5;
        var midX = (a.x + b.x) * 0.5;
        var pairDist = Math.abs(leftTile.x - rightTile.x);
        var meetGap = Math.max(this.board.getMatchMeetCenterGap(leftTile, true), this.board.getMatchMeetCenterGap(rightTile, true));
        var halfGap = meetGap * 0.5;
        var leftStopX = midX - halfGap;
        var rightStopX = midX + halfGap;
        var outwardDist = Math.max(MATCH_OUTWARD_DIST, pairDist * 0.2 + 28);
        this.playMatchCollideAnim(leftTile, midX, midY, 'left', leftStopX, outwardDist);
        this.playMatchCollideAnim(rightTile, midX, midY, 'right', rightStopX, outwardDist);
        var meetMoment = MATCH_OUTWARD_DURATION + MATCH_ALIGN_Y_DURATION + MATCH_MOVE_X_DURATION + MATCH_TOUCH_DURATION;
        this.scheduleOnce(function () {
            _this.board.bringMatchPairToFront(leftTile, rightTile);
            _this.board.playMatchEliminationEffect(midX, midY);
        }, meetMoment);
        var bumpDelay = MATCH_OUTWARD_DURATION +
            MATCH_ALIGN_Y_DURATION +
            MATCH_MOVE_X_DURATION +
            MATCH_TOUCH_DURATION +
            MATCH_TOUCH_HOLD_DURATION;
        this.comboNum++;
        this.matchPairCount++;
        var rateTier = this.getRateTierIndex(this.comboNum);
        var scoreGain = this.calcMatchScoreGain(this.comboNum, rateTier);
        this.scheduleOnce(function () {
            _this.playCheckSound();
            if (rateTier !== null) {
                _this.playRatePopup(rateTier);
            }
            _this.addScore(scoreGain);
        }, bumpDelay);
        var total = MATCH_OUTWARD_DURATION +
            MATCH_ALIGN_Y_DURATION +
            MATCH_MOVE_X_DURATION +
            MATCH_TOUCH_DURATION +
            MATCH_TOUCH_HOLD_DURATION +
            MATCH_FADE_DURATION;
        this.scheduleOnce(function () {
            _this.isRemoving = false;
            _this.board.refreshVisuals();
            _this.checkWin();
        }, total + 0.05);
    };
    /**
     * 1. 沿左右先往外弹开（保持当前 Y）
     * 2. 移到两牌 Y 中心高度
     * 3. 横向靠拢到中线两侧（中心距 = 牌宽，贴边不叠）
     * 4. 轻顶相碰 → 停留片刻 → 淡出销毁
     */
    GameController.prototype.playMatchCollideAnim = function (tile, midX, midY, side, stopX, outwardDist) {
        var node = tile.node;
        this.board.clearTileSelectForMatch(tile);
        var startX = tile.x;
        var startY = tile.y;
        node.setPosition(startX, startY);
        var outX = side === 'left' ? startX - outwardDist : startX + outwardDist;
        var baseScale = this.board.getBaseScale(tile);
        var touchX = side === 'left'
            ? Math.min(stopX + MATCH_TOUCH_NUDGE, midX - 1)
            : Math.max(stopX - MATCH_TOUCH_NUDGE, midX + 1);
        node.stopAllActions();
        node.runAction(cc.sequence(cc.moveTo(MATCH_OUTWARD_DURATION, outX, startY).easing(cc.easeBackOut()), cc.moveTo(MATCH_ALIGN_Y_DURATION, outX, midY).easing(cc.easeSineOut()), cc.moveTo(MATCH_MOVE_X_DURATION, stopX, midY).easing(cc.easeCubicActionIn()), 
        // cc.moveTo(MATCH_TOUCH_DURATION, touchX, midY).easing(cc.easeSineIn()),
        // cc.delayTime(MATCH_TOUCH_HOLD_DURATION),
        cc.spawn(cc.sequence(cc.scaleTo(MATCH_FADE_DURATION * 0.35, baseScale * 1.06), cc.scaleTo(MATCH_FADE_DURATION, 0).easing(cc.easeBackIn())), cc.fadeOut(MATCH_FADE_DURATION)), cc.callFunc(function () {
            if (node && is_valid_1.isValid(node))
                node.destroy();
        })));
    };
    /** 本局消除得分：基础分 + 连击加成 + 评级阶段奖励 */
    GameController.prototype.calcMatchScoreGain = function (combo, rateTier) {
        var gain = SCORE_BASE + SCORE_COMBO_ADD * combo;
        if (rateTier !== null) {
            gain += SCORE_RATE_BONUS[rateTier] || 0;
        }
        return gain;
    };
    GameController.prototype.addScore = function (delta) {
        this.scoreNum += delta;
        if (this.scoreDisplay) {
            this.scoreDisplay.addValue(delta);
        }
    };
    /**
     * 连消 2 对 → good，4 对 → great … 10+ → unbelievable。
     * 未到下一档间隔时不弹字。
     */
    GameController.prototype.getRateTierIndex = function (combo) {
        if (combo <= 0 || combo % RATE_MATCH_STEP !== 0) {
            return null;
        }
        var idx = Math.floor(combo / RATE_MATCH_STEP) - 1;
        if (idx < 0) {
            return null;
        }
        return Math.min(idx, GamePreloadConfig_1.RATE_RES_KEYS.length - 1);
    };
    /** 评级图在屏宽内的最大缩放（设计坐标） */
    GameController.prototype.getRatePopupFitCap = function (frame) {
        var spriteW = frame ? frame.getRect().width : 0;
        if (spriteW <= 0 || !this.node || !is_valid_1.isValid(this.node)) {
            return Number.POSITIVE_INFINITY;
        }
        return (this.node.width * RATE_MAX_WIDTH_RATIO) / spriteW;
    };
    GameController.prototype.getRatePopupTargetScale = function (tierIndex, frame) {
        var tierScale = RATE_TIER_SCALES[tierIndex] || RATE_TIER_SCALES[0];
        return Math.min(tierScale, this.getRatePopupFitCap(frame));
    };
    /** 屏幕正中弹出评级字，带弹出与收回动画 */
    GameController.prototype.playRatePopup = function (tierIndex) {
        var _this = this;
        if (!this.node || !is_valid_1.isValid(this.node)) {
            return;
        }
        var frame = this.rateFrames[tierIndex];
        if (!frame) {
            return;
        }
        if (this.ratePopupNode && is_valid_1.isValid(this.ratePopupNode)) {
            this.ratePopupNode.stopAllActions();
            this.ratePopupNode.destroy();
            this.ratePopupNode = null;
        }
        var node = new cc.Node('RatePopup');
        node.setPosition(0, 0);
        node.zIndex = GamePreloadConfig_1.Z_ORDER.RATE_POPUP;
        node.scale = 0;
        node.opacity = 0;
        this.node.addChild(node);
        this.ratePopupNode = node;
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = frame;
        sprite.sizeMode = cc.Sprite.SizeMode.TRIMMED;
        var targetScale = this.getRatePopupTargetScale(tierIndex, frame);
        var fitCap = this.getRatePopupFitCap(frame);
        var popPeak = Math.min(targetScale * 1.14, fitCap);
        var popOutScale = Math.min(targetScale * 1.22, fitCap);
        node.stopAllActions();
        node.runAction(cc.sequence(cc.spawn(cc.scaleTo(RATE_POP_IN_DURATION, popPeak).easing(cc.easeBackOut()), cc.fadeIn(RATE_POP_IN_DURATION * 0.65)), cc.scaleTo(0.06, targetScale).easing(cc.easeSineOut()), cc.delayTime(RATE_HOLD_DURATION), cc.spawn(cc.scaleTo(RATE_POP_OUT_DURATION, popOutScale).easing(cc.easeBackIn()), cc.fadeOut(RATE_POP_OUT_DURATION)), cc.callFunc(function () {
            if (_this.ratePopupNode === node) {
                _this.ratePopupNode = null;
            }
            if (node && is_valid_1.isValid(node)) {
                node.destroy();
            }
        }, this)));
    };
    GameController.prototype.playCheckSound = function () {
        var _this = this;
        if (!super_html_playable_1.default.is_audio()) {
            return;
        }
        if (this.checkClip) {
            cc.audioEngine.playEffect(this.checkClip, false);
            return;
        }
        cc.resources.load(CHECK_SOUND_PATH, cc.AudioClip, function (err, clip) {
            if (!err && clip) {
                _this.checkClip = clip;
                cc.audioEngine.playEffect(clip, false);
            }
        });
    };
    GameController.prototype.checkWin = function () {
        if (this.isAutoClearing) {
            return;
        }
        if (this.matchPairCount >= GamePreloadConfig_1.SETTLEMENT_MATCH_PAIRS) {
            this.beginVictoryWithAutoClear();
            return;
        }
        var left = this.board.getActiveCount();
        if (left === 0) {
            this.showVictory();
            return;
        }
        this.resetIdleGuideTimer();
    };
    /** 剩余牌在 AUTO_CLEAR_BEFORE_SETTLEMENT_SEC 内快速配对消除，再出结算 */
    GameController.prototype.beginVictoryWithAutoClear = function () {
        var _this = this;
        if (this.isGameOver || this.isAutoClearing) {
            return;
        }
        var pairs = HintSolver_1.collectRemainingMatchPairs(this.board.tiles);
        if (pairs.length === 0) {
            this.showVictory();
            return;
        }
        this.isAutoClearing = true;
        this.gameReady = false;
        this.unschedule(this.onIdleGuide);
        this.board.hideHintGuideHand();
        this.clearGuideHighlight();
        if (this.selected) {
            this.deselectTile(this.selected);
            this.selected = null;
        }
        var budget = GamePreloadConfig_1.AUTO_CLEAR_BEFORE_SETTLEMENT_SEC;
        var pairAnim = AUTO_CLEAR_MOVE_DURATION + AUTO_CLEAR_PAIR_FADE;
        var n = pairs.length;
        var stagger = n <= 1
            ? 0
            : Math.min(AUTO_CLEAR_STAGGER_MAX, (budget - pairAnim) / (n - 1));
        var _loop_1 = function (i) {
            var pair = pairs[i];
            this_1.scheduleOnce(function () {
                _this.removePairAuto(pair.a, pair.b);
            }, i * stagger);
        };
        var this_1 = this;
        for (var i = 0; i < n; i++) {
            _loop_1(i);
        }
        this.unschedule(this.finishAutoClearThenVictory);
        this.scheduleOnce(this.finishAutoClearThenVictory, budget);
    };
    /** 无法配对的零星剩余牌直接淡出 */
    GameController.prototype.fadeOutUnpairedRemainders = function () {
        var _loop_2 = function (i) {
            var tile = this_2.board.tiles[i];
            if (tile.removed || !tile.node || !is_valid_1.isValid(tile.node)) {
                return "continue";
            }
            tile.removed = true;
            var node = tile.node;
            node.stopAllActions();
            node.runAction(cc.sequence(cc.fadeOut(AUTO_CLEAR_PAIR_FADE), cc.callFunc(function () {
                if (node && is_valid_1.isValid(node)) {
                    node.destroy();
                }
            })));
        };
        var this_2 = this;
        for (var i = 0; i < this.board.tiles.length; i++) {
            _loop_2(i);
        }
    };
    /** 结算扫尾：短移动 + 淡出，可并行多对 */
    GameController.prototype.removePairAuto = function (a, b) {
        if (!a.node || !b.node || !is_valid_1.isValid(a.node) || !is_valid_1.isValid(b.node) || a.removed || b.removed) {
            return;
        }
        this.board.clearTileSelectForMatch(a);
        this.board.clearTileSelectForMatch(b);
        var leftTile = a.x <= b.x ? a : b;
        var rightTile = a.x <= b.x ? b : a;
        this.board.bringMatchPairToFront(leftTile, rightTile);
        a.removed = true;
        b.removed = true;
        var midX = (leftTile.x + rightTile.x) * 0.5;
        var midY = (leftTile.y + rightTile.y) * 0.5;
        this.board.playMatchEliminationEffect(midX, midY);
        this.comboNum++;
        this.addScore(this.calcMatchScoreGain(this.comboNum, null));
        this.playAutoClearTileAnim(leftTile, midX, midY, 'left');
        this.playAutoClearTileAnim(rightTile, midX, midY, 'right');
    };
    GameController.prototype.playAutoClearTileAnim = function (tile, midX, midY, side) {
        var node = tile.node;
        if (!node || !is_valid_1.isValid(node)) {
            return;
        }
        var startX = tile.x;
        var startY = tile.y;
        var targetX = side === 'left' ? midX - 8 : midX + 8;
        var baseScale = this.board.getBaseScale(tile);
        node.stopAllActions();
        node.setScale(baseScale);
        node.runAction(cc.sequence(cc.spawn(cc.moveTo(AUTO_CLEAR_MOVE_DURATION, targetX, midY).easing(cc.easeSineOut()), cc.fadeTo(AUTO_CLEAR_MOVE_DURATION, 230), cc.scaleTo(AUTO_CLEAR_MOVE_DURATION, baseScale * 1.04)), cc.spawn(cc.scaleTo(AUTO_CLEAR_PAIR_FADE, 0).easing(cc.easeBackIn()), cc.fadeOut(AUTO_CLEAR_PAIR_FADE)), cc.callFunc(function () {
            if (node && is_valid_1.isValid(node)) {
                node.destroy();
            }
        })));
    };
    GameController.prototype.hideEndPanel = function () {
        if (!this.endNode || !is_valid_1.isValid(this.endNode)) {
            return;
        }
        this.unschedule(this.bindEndDownloadButton);
        var download = this.endNode.getChildByName('download');
        if (download && is_valid_1.isValid(download)) {
            download.targetOff(this);
        }
        VictoryEndPanel_1.resetVictoryEndUnlock(this.endNode);
        this.endNode.stopAllActions();
        this.endNode.active = false;
        this.endNode.scale = 1;
        this.endNode.opacity = 255;
        if (this.scoreDisplay) {
            this.scoreDisplay.remountToGameHud(this.node, SCORE_TOP_MARGIN);
            this.scoreDisplay.setVisible(true);
        }
    };
    /** 显示 Canvas 上配置的 end 节点：分步播放 icon / victory / 星星 / TaskLight / 下载按钮 */
    GameController.prototype.showEndPanel = function () {
        var _this = this;
        if (!this.endNode || !is_valid_1.isValid(this.endNode)) {
            cc.warn('[GameController] 未找到 Canvas/end 节点');
            return;
        }
        super_html_playable_1.default.game_end();
        this.endNode.zIndex = GamePreloadConfig_1.Z_ORDER.END_PANEL;
        this.endNode.active = true;
        this.endNode.stopAllActions();
        this.endNode.scale = 1;
        this.endNode.opacity = 255;
        this.endNode.color = cc.Color.WHITE;
        VictoryEndPanel_1.layoutVictoryEndDimBackdrop(this.endNode, this.node);
        VictoryEndPanel_1.playVictoryEndSequence(this.endNode, this.scoreNum, this.scoreFont, this.scoreDisplay);
        this.bindEndDownloadButton();
        this.scheduleOnce(function () { return _this.bindEndDownloadButton(); }, 2);
    };
    /** 绑定 end/download（有 Button 用 clickEvents，否则 TOUCH_END） */
    GameController.prototype.bindEndDownloadButton = function () {
        if (!this.endNode || !is_valid_1.isValid(this.endNode)) {
            return;
        }
        var btn = this.endNode.getChildByName('download');
        if (!btn || !is_valid_1.isValid(btn)) {
            cc.warn('[GameController] end/download 节点不存在');
            return;
        }
        btn.active = true;
        btn.opacity = 255;
        btn.zIndex = GamePreloadConfig_1.Z_ORDER_END_CHILD.DOWNLOAD;
        btn.targetOff(this);
        var button = btn.getComponent(cc.Button);
        if (button) {
            button.interactable = true;
            button.clickEvents = [];
            var ev = new cc.Component.EventHandler();
            ev.target = this.node;
            ev.component = 'GameController';
            ev.handler = 'onEndDownloadClick';
            button.clickEvents.push(ev);
            return;
        }
        btn.on(cc.Node.EventType.TOUCH_END, this.onEndDownloadClick, this);
    };
    /** 结算 download（public：供 Button.clickEvents 调用） */
    GameController.prototype.onEndDownloadClick = function () {
        super_html_playable_1.default.download();
    };
    GameController.prototype.showVictory = function () {
        var _this = this;
        if (this.isGameOver) {
            return;
        }
        this.isGameOver = true;
        this.gameReady = false;
        if (this.scoreDisplay) {
            this.scoreDisplay.setVisible(false);
        }
        this.unschedule(this.onIdleGuide);
        this.board.hideHintGuideHand();
        this.clearGuideHighlight();
        if (this.selected) {
            this.deselectTile(this.selected);
            this.selected = null;
        }
        this.scheduleOnce(function () {
            if (_this.scoreDisplay) {
                _this.scoreDisplay.setValue(_this.scoreNum, false);
            }
            _this.showEndPanel();
        }, 0.2);
    };
    __decorate([
        property(cc.Prefab)
    ], GameController.prototype, "tilePrefab", void 0);
    GameController = __decorate([
        ccclass('GameController')
    ], GameController);
    return GameController;
}(cc.Component));
exports.default = GameController;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QztRQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN2QixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdkM7UUFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDM0IsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2YsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7U0FDeEI7UUFFRCxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQ2QsSUFBSSxLQUFJLENBQUMsWUFBWSxFQUFFO2dCQUNuQixLQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ3BEO1lBQ0QsS0FBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3hCLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNaLENBQUM7SUF4NEJEO1FBREMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUM7c0RBQ1M7SUFIWixjQUFjO1FBRGxDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztPQUNMLGNBQWMsQ0E0NEJsQztJQUFELHFCQUFDO0NBNTRCRCxBQTQ0QkMsQ0E1NEIyQyxFQUFFLENBQUMsU0FBUyxHQTQ0QnZEO2tCQTU0Qm9CLGNBQWMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc1ZhbGlkIH0gZnJvbSAnLi9pcy12YWxpZCc7XG5pbXBvcnQgeyBUaWxlTW9kZWwgfSBmcm9tICcuL21vZGVsL1RpbGVNb2RlbCc7XG5pbXBvcnQgeyBjYW5NYXRjaCB9IGZyb20gJy4vY29yZS9NYXRjaFJ1bGUnO1xuaW1wb3J0IHsgQm9hcmRNYW5hZ2VyIH0gZnJvbSAnLi9jb3JlL0JvYXJkTWFuYWdlcic7XG5pbXBvcnQgeyBjb2xsZWN0UmVtYWluaW5nTWF0Y2hQYWlycywgZmluZEhpbnQsIEhpbnRQYWlyIH0gZnJvbSAnLi9jb3JlL0hpbnRTb2x2ZXInO1xuaW1wb3J0IHsgQXJ0U2NvcmVEaXNwbGF5IH0gZnJvbSAnLi91aS9BcnRTY29yZURpc3BsYXknO1xuaW1wb3J0IHsgR2FtZVByZWxvYWRlciwgUHJlbG9hZFJlc3VsdCB9IGZyb20gJy4vdWkvR2FtZVByZWxvYWRlcic7XG5pbXBvcnQgeyBMb2FkaW5nU2NyZWVuIH0gZnJvbSAnLi91aS9Mb2FkaW5nU2NyZWVuJztcbmltcG9ydCB7XG4gICAgQVVUT19DTEVBUl9CRUZPUkVfU0VUVExFTUVOVF9TRUMsXG4gICAgUkFURV9SRVNfS0VZUyxcbiAgICByYXRlUmVzUGF0aCxcbiAgICBMT0FESU5HX0hJREVfQkVGT1JFX0VOVFJBTkNFLFxuICAgIExPQURJTkdfTE9HX1RJTUlORyxcbiAgICBUQVJHRVRfRlJBTUVfUkFURSxcbiAgICBTRVRUTEVNRU5UX01BVENIX1BBSVJTLFxuICAgIEdVSURFX0hBTkRfUEFUSCxcbiAgICBaX09SREVSLFxuICAgIFpfT1JERVJfRU5EX0NISUxELFxufSBmcm9tICcuL3VpL0dhbWVQcmVsb2FkQ29uZmlnJztcbmltcG9ydCB7IGxvYWRHYW1lU3ByaXRlRnJhbWUgfSBmcm9tICcuL3VpL0dhbWVJbWdBdGxhcyc7XG5pbXBvcnQgeyBsYXlvdXRTaG93QWxsQ292ZXIgfSBmcm9tICcuL3VpL1Nob3dBbGxMYXlvdXQnO1xuaW1wb3J0IHtcbiAgICBsYXlvdXRWaWN0b3J5RW5kRGltQmFja2Ryb3AsXG4gICAgcGxheVZpY3RvcnlFbmRTZXF1ZW5jZSxcbiAgICByZXNldFZpY3RvcnlFbmRVbmxvY2ssXG59IGZyb20gJy4vdWkvVmljdG9yeUVuZFBhbmVsJztcbmltcG9ydCBzdXBlcl9odG1sX3BsYXlhYmxlIGZyb20gJy4vc3VwZXJfaHRtbF9wbGF5YWJsZSc7XG5cbmNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XG5cbmNvbnN0IExFVkVMX1BBVEggPSAnZGF0YS9sZXZlbF8wMSc7XG5jb25zdCBDSEVDS19TT1VORF9QQVRIID0gJ2NoZWNrJztcbi8qKiDml6Dmk43kvZzlpJrlsJHnp5LlkI7oh6rliqjpq5jkuq7lj6/mtojnmoTkuIDlr7kgKi9cbmNvbnN0IElETEVfR1VJREVfU0VDT05EUyA9IDI7XG4vKiog5o+Q56S66LeR6ams54GvL+aZg+WKqOWbuuWumuWxleekuuaXtumVv++8iOenkuWGheeCueWHu+S4jeaPkOWJjeWFs+aOie+8iSAqL1xuY29uc3QgSElOVF9ESVNQTEFZX1NFQ09ORFMgPSAzO1xuLyoqIOeCueWHu+S4jeWPr+a2iOeJjO+8mkNhbnZhcyDkuIogaGl0IOiKgueCuemXqueDgSAqL1xuY29uc3QgSElUX0JMSU5LX1NURVAgPSAwLjE7XG5jb25zdCBISVRfQkxJTktfQ09VTlQgPSAzO1xuY29uc3QgSElUX0JMSU5LX1BFQUsgPSAyMjA7XG5jb25zdCBISVRfQkxJTktfTE9XID0gNTA7XG5cbi8qKiDmtojpmaTvvJrlhYjlpJblvLkg4oaSIOWvuem9kCBZIOS4reW/gyDihpIg5qiq5ZCR6Z2g5oui56Kw5pKeIOKGkiDmtojlpLEgKi9cbmNvbnN0IE1BVENIX09VVFdBUkRfRFVSQVRJT04gPSAwLjE0O1xuY29uc3QgTUFUQ0hfT1VUV0FSRF9ESVNUID0gNDQ7XG5jb25zdCBNQVRDSF9BTElHTl9ZX0RVUkFUSU9OID0gMC4yO1xuY29uc3QgTUFUQ0hfTU9WRV9YX0RVUkFUSU9OID0gMC4xNjtcbmNvbnN0IE1BVENIX1RPVUNIX0RVUkFUSU9OID0gMC4wODtcbi8qKiDkuKTniYzotLTovrnnm7jnorDlkI7lgZznlZnlho3mt6Hlh7ogKi9cbmNvbnN0IE1BVENIX1RPVUNIX0hPTERfRFVSQVRJT04gPSAwLjE4O1xuY29uc3QgTUFUQ0hfRkFERV9EVVJBVElPTiA9IDAuMjtcbi8qKiDotLTovrnlkI7lkJHkuK3nur/ovbvpobbkuIDkuIvvvIjlg4/ntKDvvInvvIzkuI3otorov4flr7nkvqcgKi9cbmNvbnN0IE1BVENIX1RPVUNIX05VREdFID0gNTtcblxuLyoqIOe7k+eul+WJjeWJqeS9meeJjOW/q+mAn+iHquWKqOa2iOmZpCAqL1xuY29uc3QgQVVUT19DTEVBUl9QQUlSX0ZBREUgPSAwLjE2O1xuY29uc3QgQVVUT19DTEVBUl9NT1ZFX0RVUkFUSU9OID0gMC4xMjtcbmNvbnN0IEFVVE9fQ0xFQVJfU1RBR0dFUl9NQVggPSAwLjA5O1xuXG4vKiog6L+e5raI6K+E57qn77ya5oOF57uq55Sx5byx5Yiw5by677yM5q+P5aSa5raIIFJBVEVfTUFUQ0hfU1RFUCDlr7nmiY3ljYfkuIDnuqcgKi9cbmNvbnN0IFJBVEVfTUFUQ0hfU1RFUCA9IDI7XG5jb25zdCBSQVRFX1BPUF9JTl9EVVJBVElPTiA9IDAuMjI7XG5jb25zdCBSQVRFX0hPTERfRFVSQVRJT04gPSAwLjU1O1xuY29uc3QgUkFURV9QT1BfT1VUX0RVUkFUSU9OID0gMC4yO1xuLyoqIOWQhOaho+S9jeWfuuWHhue8qeaUvu+8jOi2iuW+gOWQjuaDhee7qui2iuW8uuOAgeWtl+i2iuWkpyAqL1xuY29uc3QgUkFURV9USUVSX1NDQUxFUyA9IFswLjY4LCAwLjc2LCAwLjg0LCAwLjkyLCAxLjAyXTtcbi8qKiDor4Tnuqflm77mnIDlpKfljaDlsY/lrr3mr5TkvovvvIzpgb/lhY0gdW5iZWxpZXZhYmxlIOetiemVv+Wbvui2heWHuiAqL1xuY29uc3QgUkFURV9NQVhfV0lEVEhfUkFUSU8gPSAwLjg4O1xuXG4vKiog56ev5YiG77ya5Z+656GAICsg6L+e5Ye7ICsg6K+E57qn6Zi25q616aKd5aSW5Y+g5YqgICovXG5jb25zdCBTQ09SRV9CQVNFID0gMjAwO1xuY29uc3QgU0NPUkVfQ09NQk9fQUREID0gNDA7XG5jb25zdCBTQ09SRV9SQVRFX0JPTlVTID0gWzEwMCwgMjAwLCAzNTAsIDUwMCwgODAwXTtcbmNvbnN0IFNDT1JFX1RPUF9NQVJHSU4gPSA2NDtcblxuXG5AY2NjbGFzcygnR2FtZUNvbnRyb2xsZXInKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUNvbnRyb2xsZXIgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xuXG4gICAgQHByb3BlcnR5KGNjLlByZWZhYilcbiAgICB0aWxlUHJlZmFiOiBjYy5QcmVmYWIgPSBudWxsO1xuXG4gICAgcHJpdmF0ZSBib2FyZE5vZGU6IGNjLk5vZGUgPSBudWxsO1xuICAgIHByaXZhdGUgYm9hcmQgPSBuZXcgQm9hcmRNYW5hZ2VyKCk7XG4gICAgcHJpdmF0ZSBzZWxlY3RlZDogVGlsZU1vZGVsID0gbnVsbDtcbiAgICBwcml2YXRlIGd1aWRlSGlnaGxpZ2h0OiBIaW50UGFpciA9IG51bGw7XG4gICAgLyoqIOW9k+WJjeaPkOekuuaYr+WQpuWcqOWbuuWumuWxleekuueql+WPo+WGhe+8iDMg56eS5YaF5LiN5Zug54K55Ye75Y+W5raI77yJICovXG4gICAgcHJpdmF0ZSBoaW50RGlzcGxheUxvY2tlZCA9IGZhbHNlO1xuICAgIHByaXZhdGUgZ2FtZVJlYWR5ID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBpc1JlbW92aW5nID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBjaGVja0NsaXA6IGNjLkF1ZGlvQ2xpcCA9IG51bGw7XG4gICAgcHJpdmF0ZSBoaXROb2RlOiBjYy5Ob2RlID0gbnVsbDtcbiAgICBwcml2YXRlIGVuZE5vZGU6IGNjLk5vZGUgPSBudWxsO1xuICAgIHByaXZhdGUgY29tYm9OdW0gPSAwO1xuICAgIC8qKiDmnKzlsYDlt7LmiJDlip/mtojpmaTnmoTlr7nmlbDvvIjovr4gU0VUVExFTUVOVF9NQVRDSF9QQUlSUyDljbPnu5PnrpfvvIkgKi9cbiAgICBwcml2YXRlIG1hdGNoUGFpckNvdW50ID0gMDtcbiAgICBwcml2YXRlIHJhdGVGcmFtZXM6IGNjLlNwcml0ZUZyYW1lW10gPSBbXTtcbiAgICBwcml2YXRlIHJhdGVQb3B1cE5vZGU6IGNjLk5vZGUgPSBudWxsO1xuICAgIHByaXZhdGUgc2NvcmVOdW0gPSAwO1xuICAgIHByaXZhdGUgc2NvcmVEaXNwbGF5OiBBcnRTY29yZURpc3BsYXkgPSBudWxsO1xuICAgIHByaXZhdGUgc2NvcmVGb250OiBjYy5CaXRtYXBGb250ID0gbnVsbDtcbiAgICBwcml2YXRlIGNhY2hlZExldmVsQXNzZXQ6IGNjLkpzb25Bc3NldCA9IG51bGw7XG4gICAgcHJpdmF0ZSBsb2FkaW5nU2NyZWVuOiBMb2FkaW5nU2NyZWVuID0gbnVsbDtcbiAgICBwcml2YXRlIGlzR2FtZU92ZXIgPSBmYWxzZTtcbiAgICAvKiog6L6+57uT566X5p2h5Lu25ZCO5q2j5Zyo5b+r6YCf5omr5bC+5raI6Zmk5Ymp5L2Z54mMICovXG4gICAgcHJpdmF0ZSBpc0F1dG9DbGVhcmluZyA9IGZhbHNlO1xuXG4gICAgb25Mb2FkKCkge1xuICAgICAgICBpZiAoVEFSR0VUX0ZSQU1FX1JBVEUgPiAwKSB7XG4gICAgICAgICAgICBjYy5nYW1lLnNldEZyYW1lUmF0ZShUQVJHRVRfRlJBTUVfUkFURSk7XG4gICAgICAgIH1cbiAgICAgICAgY2Mudmlldy5zZXRSZXNpemVDYWxsYmFjaygoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxheW91dEJhY2tncm91bmQoKTtcbiAgICAgICAgICAgIHRoaXMubGF5b3V0SGl0KCk7XG4gICAgICAgICAgICB0aGlzLmxheW91dFNjb3JlVG9wKCk7XG4gICAgICAgICAgICB0aGlzLmxheW91dEVuZERpbUJhY2tkcm9wKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5sb2FkaW5nU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nU2NyZWVuLmxheW91dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbiAgICBvbkRlc3Ryb3koKSB7XG4gICAgICAgIGNjLnZpZXcuc2V0UmVzaXplQ2FsbGJhY2sobnVsbCwgbnVsbCk7XG4gICAgICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLm9uSWRsZUd1aWRlKTtcbiAgICB9XG5cbiAgICBzdGFydCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRpbGVQcmVmYWIpIHtcbiAgICAgICAgICAgIGNjLmVycm9yKCdbR2FtZUNvbnRyb2xsZXJdIOivt+WcqCBDYW52YXMg5LiK57uR5a6aIG1qIOmihOWItuS9kycpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYm9hcmROb2RlID0gbmV3IGNjLk5vZGUoJ0JvYXJkJyk7XG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZCh0aGlzLmJvYXJkTm9kZSk7XG4gICAgICAgIHRoaXMuaGl0Tm9kZSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZSgnaGl0Jyk7XG4gICAgICAgIGlmICh0aGlzLmhpdE5vZGUgJiYgaXNWYWxpZCh0aGlzLmhpdE5vZGUpKSB7XG4gICAgICAgICAgICB0aGlzLmhpdE5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmhpdE5vZGUub3BhY2l0eSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbmROb2RlID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdlbmQnKTtcbiAgICAgICAgdGhpcy5oaWRlRW5kUGFuZWwoKTtcbiAgICAgICAgdGhpcy5sYXlvdXRCYWNrZ3JvdW5kKCk7XG4gICAgICAgIHRoaXMubGF5b3V0SGl0KCk7XG4gICAgICAgIHRoaXMubGF5b3V0U2NvcmVUb3AoKTtcbiAgICAgICAgdGhpcy5ib2FyZE5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3RhcnRXaXRoTG9hZGluZygpO1xuXG4gICAgICAgIGNvbnN0IGdvb2dsZV9wbGF5ID0gXCJodHRwczovL2FwcHMuYXBwbGUuY29tL3VzL2FwcC9tYWhqb25nLXJveWFsLXRpbGVzL2lkNjc0NzQ5MjYwMFwiO1xuICAgICAgICBjb25zdCBhcHBzdG9yZSA9IFwiaHR0cHM6Ly9wbGF5Lmdvb2dsZS5jb20vc3RvcmUvYXBwcy9kZXRhaWxzP2lkPWNvbS5uZWJ1bGEubWFoam9uZ3RpbGVcIjtcblxuICAgICAgICBzdXBlcl9odG1sX3BsYXlhYmxlLnNldF9nb29nbGVfcGxheV91cmwoZ29vZ2xlX3BsYXkpO1xuICAgICAgICBzdXBlcl9odG1sX3BsYXlhYmxlLnNldF9hcHBfc3RvcmVfdXJsKGFwcHN0b3JlKTtcbiAgICB9XG5cbiAgICAvKiog5pi+56S65Yqg6L2955WM6Z2i77yM6aKE5Yqg6L296LWE5rqQ5ZCO6L+b5YWl5YWz5Y2hICovXG4gICAgcHJpdmF0ZSBzdGFydFdpdGhMb2FkaW5nKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBsb2FkVDAgPSBMT0FESU5HX0xPR19USU1JTkcgPyBEYXRlLm5vdygpIDogMDtcbiAgICAgICAgdGhpcy5sb2FkaW5nU2NyZWVuID0gbmV3IExvYWRpbmdTY3JlZW4odGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5sb2FkaW5nU2NyZWVuLnNob3codGhpcy5ub2RlKTtcblxuICAgICAgICBHYW1lUHJlbG9hZGVyLnJ1bigoKSA9PiB7fSwgKHJlc3VsdCwgZXJyKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyIHx8ICFyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sb2FkaW5nU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZ1NjcmVlbi5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNjLndhcm4oJ1tHYW1lQ29udHJvbGxlcl0nLCBlcnIgfHwgJ+WKoOi9veWksei0pScpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2FjaGVkTGV2ZWxBc3NldCA9IHJlc3VsdC5sZXZlbEFzc2V0O1xuICAgICAgICAgICAgdGhpcy5hcHBseVByZWxvYWRSZXN1bHQocmVzdWx0KTtcbiAgICAgICAgICAgIEdhbWVQcmVsb2FkZXIucHJlbG9hZEdhbWVwbGF5QXNzZXRzKCgpID0+IHRoaXMucmVmcmVzaExhenlBc3NldHMoKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGxldmVsVDAgPSBMT0FESU5HX0xPR19USU1JTkcgPyBEYXRlLm5vdygpIDogMDtcbiAgICAgICAgICAgIHRoaXMubG9hZExldmVsKHJlc3VsdC5sZXZlbEFzc2V0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZE5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sb2FkaW5nU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZ1NjcmVlbi5oaWRlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChMT0FESU5HX0xPR19USU1JTkcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5sb2coXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBbR2FtZUNvbnRyb2xsZXJdIOiHs+WFs+WKoOi9veWxj+WFs+mXrSAke0RhdGUubm93KCkgLSBsb2FkVDB9bXNgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYO+8iOW7uuWFsyAke0RhdGUubm93KCkgLSBsZXZlbFQwfW1z77yJYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFwcGx5UHJlbG9hZFJlc3VsdChyZXN1bHQ6IFByZWxvYWRSZXN1bHQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHJlc3VsdC5jaGVja0NsaXApIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tDbGlwID0gcmVzdWx0LmNoZWNrQ2xpcDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0LnNjb3JlRm9udCkge1xuICAgICAgICAgICAgdGhpcy5zY29yZUZvbnQgPSByZXN1bHQuc2NvcmVGb250O1xuICAgICAgICAgICAgdGhpcy5zY29yZURpc3BsYXkgPSBBcnRTY29yZURpc3BsYXkuZnJvbUZvbnQocmVzdWx0LnNjb3JlRm9udCk7XG4gICAgICAgICAgICB0aGlzLnNjb3JlRGlzcGxheS5tb3VudCh0aGlzLm5vZGUsIFNDT1JFX1RPUF9NQVJHSU4pO1xuICAgICAgICAgICAgdGhpcy5zY29yZURpc3BsYXkuc2V0VmFsdWUoMCwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQuZ3VpZGVIYW5kU2YpIHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuc2V0R3VpZGVIYW5kU3ByaXRlKHJlc3VsdC5ndWlkZUhhbmRTZik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiog5ZCO5Y+w6LWE5rqQ6L+b57yT5a2Y5ZCO5Yi35paw5byV55SoICovXG4gICAgcHJpdmF0ZSByZWZyZXNoTGF6eUFzc2V0cygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZnJhbWVzOiBjYy5TcHJpdGVGcmFtZVtdID0gbmV3IEFycmF5KFJBVEVfUkVTX0tFWVMubGVuZ3RoKTtcbiAgICAgICAgbGV0IHBlbmRpbmcgPSBSQVRFX1JFU19LRVlTLmxlbmd0aDtcbiAgICAgICAgUkFURV9SRVNfS0VZUy5mb3JFYWNoKChrZXksIGlkeCkgPT4ge1xuICAgICAgICAgICAgbG9hZEdhbWVTcHJpdGVGcmFtZShyYXRlUmVzUGF0aChrZXkpLCAoZnJhbWUpID0+IHtcbiAgICAgICAgICAgICAgICBwZW5kaW5nLS07XG4gICAgICAgICAgICAgICAgaWYgKGZyYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyYW1lc1tpZHhdID0gZnJhbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwZW5kaW5nID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmF0ZUZyYW1lcyA9IGZyYW1lcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGxvYWRHYW1lU3ByaXRlRnJhbWUoR1VJREVfSEFORF9QQVRILCAoc2YpID0+IHtcbiAgICAgICAgICAgIGlmIChzZikge1xuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQuc2V0R3VpZGVIYW5kU3ByaXRlKHNmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqIOacrOWxgOaYr+WQpuW3suWboOeCueWHu+aUtui1t+W8leWvvOWwj+aJiyAqL1xuICAgIHByaXZhdGUgZ3VpZGVIYW5kRGlzbWlzc2VkVGhpc0xldmVsID0gZmFsc2U7XG5cbiAgICAvKiog5byV5a+85bCP5omL77ya5oyH5ZCR5o+Q56S65a+55a2Q5Lit6Z2g5bem55qE5LiA5bygICovXG4gICAgcHJpdmF0ZSB0cnlTaG93Rmlyc3RHdWlkZUhhbmQoaGludDogSGludFBhaXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZ3VpZGVIYW5kRGlzbWlzc2VkVGhpc0xldmVsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ib2FyZC5zaG93SGludEd1aWRlSGFuZCh0aGlzLnBpY2tMZWZ0R3VpZGVIYW5kVGlsZShoaW50KSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwaWNrTGVmdEd1aWRlSGFuZFRpbGUoaGludDogSGludFBhaXIpOiBUaWxlTW9kZWwge1xuICAgICAgICBpZiAoaGludC5hLnggIT09IGhpbnQuYi54KSB7XG4gICAgICAgICAgICByZXR1cm4gaGludC5hLnggPCBoaW50LmIueCA/IGhpbnQuYSA6IGhpbnQuYjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGludC5hLnkgPD0gaGludC5iLnkgPyBoaW50LmEgOiBoaW50LmI7XG4gICAgfVxuXG4gICAgLyoqIOmhtumDqOWxheS4re+8mldpZGdldCDlr7npvZDvvIjkvY3lm77lrZfkvZMgTGFiZWzvvIkgKi9cbiAgICBwcml2YXRlIGxheW91dFNjb3JlVG9wKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuc2NvcmVEaXNwbGF5IHx8ICFpc1ZhbGlkKHRoaXMuc2NvcmVEaXNwbGF5LnJvb3QpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zY29yZURpc3BsYXkuc2V0VG9wTWFyZ2luKFNDT1JFX1RPUF9NQVJHSU4pO1xuICAgIH1cblxuICAgIC8qKiBTSE9XX0FMTCDkuIvog4zmma8gY292ZXIg6ZO65ruh5Y+v6KeG5Yy65Z+f77yI5LiN5ZCr5bGP5aSW6buR6L6577yJICovXG4gICAgcHJpdmF0ZSBsYXlvdXRCYWNrZ3JvdW5kKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBiZyA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZSgnYmcnKTtcbiAgICAgICAgaWYgKCFiZyB8fCAhaXNWYWxpZChiZykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsYXlvdXRTaG93QWxsQ292ZXIoYmcsIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubGF5b3V0RW5kRGltQmFja2Ryb3AoKTtcbiAgICB9XG5cbiAgICAvKiog57uT566XIGVuZCDpu5HlupXkuI4gYmcg5ZCM5q2l57yp5pS+ICovXG4gICAgcHJpdmF0ZSBsYXlvdXRFbmREaW1CYWNrZHJvcCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmVuZE5vZGUgfHwgIWlzVmFsaWQodGhpcy5lbmROb2RlKSB8fCAhdGhpcy5lbmROb2RlLmFjdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxheW91dFZpY3RvcnlFbmREaW1CYWNrZHJvcCh0aGlzLmVuZE5vZGUsIHRoaXMubm9kZSk7XG4gICAgfVxuXG4gICAgLyoqIOS4jiBiZyDnm7jlkIzvvJpoaXQg5oyJIFNIT1dfQUxMIOmTuua7oeWPr+inhuWMuuWfnyAqL1xuICAgIHByaXZhdGUgbGF5b3V0SGl0KCk6IHZvaWQge1xuICAgICAgICBjb25zdCBoaXQgPSB0aGlzLmhpdE5vZGU7XG4gICAgICAgIGlmICghaGl0IHx8ICFpc1ZhbGlkKGhpdCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxheW91dFNob3dBbGxDb3ZlcihoaXQsIHRoaXMubm9kZSk7XG4gICAgICAgIGhpdC5zZXRQb3NpdGlvbigwLCAwKTtcbiAgICB9XG5cbiAgICAvKiog5YWo5bGPIGhpdCDpga7nvanpl6rng4HvvIjngrnlh7vkuI3lj6/mtojniYzvvIkgKi9cbiAgICBwcml2YXRlIHBsYXlIaXRCbGluaygpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmhpdE5vZGUgfHwgIWlzVmFsaWQodGhpcy5oaXROb2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGhpdCA9IHRoaXMuaGl0Tm9kZTtcbiAgICAgICAgdGhpcy5sYXlvdXRIaXQoKTtcbiAgICAgICAgaGl0LnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIGhpdC56SW5kZXggPSBaX09SREVSLkhJVDtcbiAgICAgICAgaGl0LmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIGhpdC5vcGFjaXR5ID0gMDtcblxuICAgICAgICBjb25zdCBzdGVwczogY2MuRmluaXRlVGltZUFjdGlvbltdID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgSElUX0JMSU5LX0NPVU5UOyBpKyspIHtcbiAgICAgICAgICAgIHN0ZXBzLnB1c2goY2MuZmFkZVRvKEhJVF9CTElOS19TVEVQLCBISVRfQkxJTktfUEVBSykpO1xuICAgICAgICAgICAgc3RlcHMucHVzaChjYy5mYWRlVG8oSElUX0JMSU5LX1NURVAsIEhJVF9CTElOS19MT1cpKTtcbiAgICAgICAgfVxuICAgICAgICBzdGVwcy5wdXNoKGNjLmZhZGVUbyhISVRfQkxJTktfU1RFUCwgMCkpO1xuICAgICAgICBzdGVwcy5wdXNoKGNjLmNhbGxGdW5jKCgpID0+IHtcbiAgICAgICAgICAgIGlmIChoaXQgJiYgaXNWYWxpZChoaXQpKSB7XG4gICAgICAgICAgICAgICAgaGl0LmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGhpdC5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcykpO1xuICAgICAgICBoaXQucnVuQWN0aW9uKGNjLnNlcXVlbmNlKHN0ZXBzKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkTGV2ZWwoY2FjaGVkTGV2ZWw/OiBjYy5Kc29uQXNzZXQsIG9uUmVhZHk/OiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuZ2FtZVJlYWR5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNHYW1lT3ZlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzQXV0b0NsZWFyaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLmZpbmlzaEF1dG9DbGVhclRoZW5WaWN0b3J5KTtcbiAgICAgICAgdGhpcy5oaWRlRW5kUGFuZWwoKTtcbiAgICAgICAgdGhpcy5jb21ib051bSA9IDA7XG4gICAgICAgIHRoaXMubWF0Y2hQYWlyQ291bnQgPSAwO1xuICAgICAgICB0aGlzLnNjb3JlTnVtID0gMDtcbiAgICAgICAgaWYgKHRoaXMuc2NvcmVEaXNwbGF5KSB7XG4gICAgICAgICAgICB0aGlzLnNjb3JlRGlzcGxheS5zZXRWYWx1ZSgwLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ib2FyZC5oaWRlSGludEd1aWRlSGFuZCgpO1xuICAgICAgICB0aGlzLmd1aWRlSGFuZERpc21pc3NlZFRoaXNMZXZlbCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsZWFyR3VpZGVIaWdobGlnaHQoKTtcbiAgICAgICAgdGhpcy51bnNjaGVkdWxlKHRoaXMub25JZGxlR3VpZGUpO1xuICAgICAgICB0aGlzLmJvYXJkLmxvYWRMZXZlbChMRVZFTF9QQVRILCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybignW0dhbWVDb250cm9sbGVyXScsIGVycik7XG4gICAgICAgICAgICAgICAgaWYgKG9uUmVhZHkpIHtcbiAgICAgICAgICAgICAgICAgICAgb25SZWFkeSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmJvYXJkLnNwYXduKFxuICAgICAgICAgICAgICAgIHRoaXMudGlsZVByZWZhYixcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkTm9kZSxcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQuYmluZEJvYXJkQ2xpY2sodGhpcy5ub2RlLCAodGlsZSkgPT4gdGhpcy5vblRpbGVUYXAodGlsZSkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVSZWFkeSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXRJZGxlR3VpZGVUaW1lcigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTE9BRElOR19ISURFX0JFRk9SRV9FTlRSQU5DRSAmJiBvblJlYWR5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvblJlYWR5KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93R3VpZGVIaWdobGlnaHQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFMT0FESU5HX0hJREVfQkVGT1JFX0VOVFJBTkNFICYmIG9uUmVhZHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uUmVhZHkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0sIGNhY2hlZExldmVsKTtcbiAgICB9XG5cbiAgICAvKiog5b2T5YmN5piv5ZCm5q2j5Zyo5bGV56S65o+Q56S677yI6LeR6ams54GvL+aZg+WKqOeql+WPo+WGheS4jeWGjemHjeWkjeinpuWPke+8iSAqL1xuICAgIHByaXZhdGUgaXNHdWlkZUhpbnRBY3RpdmUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpbnREaXNwbGF5TG9ja2VkICYmIHRoaXMuZ3VpZGVIaWdobGlnaHQgIT0gbnVsbDtcbiAgICB9XG5cbiAgICAvKiog6auY5Lqu5LiA5a+55Y+v5raI6Zmk55qE54mM77yI5YWl5Zy65a6M5oiQIC8g6ZW/5pe26Ze05peg5pON5L2c77yJ77ya5aSW57yY6LeR6ams54Gv77yM5Zu65a6a5bGV56S6IDMg56eSICovXG4gICAgcHJpdmF0ZSBzaG93R3VpZGVIaWdobGlnaHQoKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5nYW1lUmVhZHkgfHwgdGhpcy5pc1JlbW92aW5nIHx8IHRoaXMuYm9hcmQuZW50cmFuY2VQbGF5aW5nKSByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLmlzR3VpZGVIaW50QWN0aXZlKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBoaW50ID0gZmluZEhpbnQodGhpcy5ib2FyZC50aWxlcyk7XG4gICAgICAgIGlmICghaGludCkge1xuICAgICAgICAgICAgdGhpcy5jbGVhckd1aWRlSGlnaGxpZ2h0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbGVhckd1aWRlSGlnaGxpZ2h0KCk7XG4gICAgICAgIHRoaXMuZ3VpZGVIaWdobGlnaHQgPSBoaW50O1xuICAgICAgICB0aGlzLmd1aWRlSGFuZERpc21pc3NlZFRoaXNMZXZlbCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmhpbnREaXNwbGF5TG9ja2VkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51bnNjaGVkdWxlKHRoaXMub25IaW50RGlzcGxheUVuZCk7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKHRoaXMub25IaW50RGlzcGxheUVuZCwgSElOVF9ESVNQTEFZX1NFQ09ORFMpO1xuICAgICAgICB0aGlzLmJvYXJkLnNob3dHdWlkZUhpbnRQYWlyKGhpbnQuYSwgaGludC5iKTtcbiAgICAgICAgdGhpcy51bnNjaGVkdWxlKHRoaXMuc2hvd0ZpcnN0R3VpZGVIYW5kRGVmZXJyZWQpO1xuICAgICAgICB0aGlzLnNjaGVkdWxlT25jZSh0aGlzLnNob3dGaXJzdEd1aWRlSGFuZERlZmVycmVkLCAwLjEyKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uSGludERpc3BsYXlFbmQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICghdGhpcy5pc0d1aWRlSGludEFjdGl2ZSgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oaW50RGlzcGxheUxvY2tlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsZWFyR3VpZGVIaWdobGlnaHQoKTtcbiAgICAgICAgdGhpcy5yZXNldElkbGVHdWlkZVRpbWVyKCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgc2hvd0ZpcnN0R3VpZGVIYW5kRGVmZXJyZWQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICghdGhpcy5ndWlkZUhpZ2hsaWdodCB8fCB0aGlzLmd1aWRlSGFuZERpc21pc3NlZFRoaXNMZXZlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudHJ5U2hvd0ZpcnN0R3VpZGVIYW5kKHRoaXMuZ3VpZGVIaWdobGlnaHQpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIGNsZWFyR3VpZGVIaWdobGlnaHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLm9uSGludERpc3BsYXlFbmQpO1xuICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5zaG93Rmlyc3RHdWlkZUhhbmREZWZlcnJlZCk7XG4gICAgICAgIHRoaXMuaGludERpc3BsYXlMb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ib2FyZC5oaWRlSGludEd1aWRlSGFuZCgpO1xuICAgICAgICB0aGlzLmJvYXJkLmNsZWFyQWxsR3VpZGVNYXJxdWVlcygpO1xuICAgICAgICB0aGlzLmd1aWRlSGlnaGxpZ2h0ID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKiog54K55Ye76YCJ5Lit54mM5pe277ya5Y+W5raI5YWo6YOo6LeR6ams54GvIC8g5pmD5YqoIC8g5bCP5omL5o+Q56S6ICovXG4gICAgcHJpdmF0ZSBjYW5jZWxIaW50c09uU2VsZWN0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmd1aWRlSGFuZERpc21pc3NlZFRoaXNMZXZlbCA9IHRydWU7XG4gICAgICAgIHRoaXMuY2xlYXJHdWlkZUhpZ2hsaWdodCgpO1xuICAgICAgICB0aGlzLnJlc2V0SWRsZUd1aWRlVGltZXIoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc2V0SWRsZUd1aWRlVGltZXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLm9uSWRsZUd1aWRlKTtcbiAgICAgICAgaWYgKCF0aGlzLmdhbWVSZWFkeSB8fCB0aGlzLmlzUmVtb3ZpbmcgfHwgdGhpcy5ib2FyZC5lbnRyYW5jZVBsYXlpbmcpIHJldHVybjtcbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UodGhpcy5vbklkbGVHdWlkZSwgSURMRV9HVUlERV9TRUNPTkRTKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uSWRsZUd1aWRlKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuZ2FtZVJlYWR5IHx8IHRoaXMuaXNBdXRvQ2xlYXJpbmcgfHwgdGhpcy5zZWxlY3RlZCB8fCB0aGlzLmlzUmVtb3ZpbmcgfHwgdGhpcy5ib2FyZC5lbnRyYW5jZVBsYXlpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pc0d1aWRlSGludEFjdGl2ZSgpKSB7XG4gICAgICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5vbklkbGVHdWlkZSk7XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZSh0aGlzLm9uSWRsZUd1aWRlLCBJRExFX0dVSURFX1NFQ09ORFMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2hvd0d1aWRlSGlnaGxpZ2h0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvblRpbGVUYXAodGlsZTogVGlsZU1vZGVsKSB7XG4gICAgICAgIGlmICh0aGlzLmlzR2FtZU92ZXIgfHwgdGhpcy5pc0F1dG9DbGVhcmluZyB8fCB0aWxlLnJlbW92ZWQgfHwgdGhpcy5pc1JlbW92aW5nIHx8IHRoaXMuYm9hcmQuZW50cmFuY2VQbGF5aW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aWxlLmZyZWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkICYmIHRoaXMuc2VsZWN0ZWQuaWQgIT09IHRpbGUuaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2VsZWN0VGlsZSh0aGlzLnNlbGVjdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY29tYm9OdW0gPSAwO1xuICAgICAgICAgICAgdGhpcy5ib2FyZC5wbGF5QmxvY2tlZEZlZWRiYWNrKHRpbGUpO1xuICAgICAgICAgICAgdGhpcy5wbGF5SGl0QmxpbmsoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5zZWxlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5jYW5jZWxIaW50c09uU2VsZWN0KCk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdFRpbGUodGlsZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZC5pZCA9PT0gdGlsZS5pZCkge1xuICAgICAgICAgICAgdGhpcy5kZXNlbGVjdFRpbGUodGhpcy5zZWxlY3RlZCk7XG4gICAgICAgICAgICB0aGlzLnJlc2V0SWRsZUd1aWRlVGltZXIoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5zZWxlY3RlZC5mcmVlKSB7XG4gICAgICAgICAgICB0aGlzLmNhbmNlbEhpbnRzT25TZWxlY3QoKTtcbiAgICAgICAgICAgIHRoaXMuZGVzZWxlY3RUaWxlKHRoaXMuc2VsZWN0ZWQpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RUaWxlKHRpbGUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNhbk1hdGNoKHRoaXMuc2VsZWN0ZWQsIHRpbGUpKSB7XG4gICAgICAgICAgICBjb25zdCBmaXJzdCA9IHRoaXMuc2VsZWN0ZWQ7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlUGFpcihmaXJzdCwgdGlsZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbmNlbEhpbnRzT25TZWxlY3QoKTtcbiAgICAgICAgdGhpcy5zd2l0Y2hTZWxlY3Rpb24odGlsZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzd2l0Y2hTZWxlY3Rpb24odGlsZTogVGlsZU1vZGVsKSB7XG4gICAgICAgIGNvbnN0IHByZXYgPSB0aGlzLnNlbGVjdGVkO1xuICAgICAgICBpZiAocHJldiAmJiBwcmV2LmlkICE9PSB0aWxlLmlkKSB7XG4gICAgICAgICAgICB0aGlzLmRlc2VsZWN0VGlsZShwcmV2KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlbGVjdFRpbGUodGlsZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZWxlY3RUaWxlKHRpbGU6IFRpbGVNb2RlbCkge1xuICAgICAgICBpZiAoIXRpbGUubm9kZSB8fCAhaXNWYWxpZCh0aWxlLm5vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQgJiYgdGhpcy5zZWxlY3RlZC5pZCAhPT0gdGlsZS5pZCkge1xuICAgICAgICAgICAgdGhpcy5kZXNlbGVjdFRpbGUodGhpcy5zZWxlY3RlZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHRpbGU7XG4gICAgICAgIHRoaXMuYm9hcmQuYnJpbmdUaWxlc1RvRnJvbnQoW3RpbGVdKTtcbiAgICAgICAgdGhpcy5ib2FyZC5oaWdobGlnaHRUaWxlU2VsZWN0KHRpbGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVzZWxlY3RUaWxlKHRpbGU6IFRpbGVNb2RlbCwgcmVzdG9yZVo6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkICYmIHRoaXMuc2VsZWN0ZWQuaWQgPT09IHRpbGUuaWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGlsZS5yZW1vdmVkICYmIHRpbGUubm9kZSAmJiBpc1ZhbGlkKHRpbGUubm9kZSkpIHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucmVzdG9yZVRpbGVTZWxlY3QodGlsZSk7XG4gICAgICAgICAgICBpZiAocmVzdG9yZVopIHRoaXMuYm9hcmQucmVzdG9yZVRpbGVaSW5kZXgodGlsZSk7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLmFwcGx5VmlzdWFsKHRpbGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzZXRJZGxlR3VpZGVUaW1lcigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVtb3ZlUGFpcihhOiBUaWxlTW9kZWwsIGI6IFRpbGVNb2RlbCkge1xuICAgICAgICBpZiAoIWEubm9kZSB8fCAhYi5ub2RlIHx8ICFpc1ZhbGlkKGEubm9kZSkgfHwgIWlzVmFsaWQoYi5ub2RlKSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLm9uSWRsZUd1aWRlKTtcbiAgICAgICAgdGhpcy5jbGVhckd1aWRlSGlnaGxpZ2h0KCk7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBudWxsO1xuICAgICAgICB0aGlzLmJvYXJkLmNsZWFyVGlsZVNlbGVjdEZvck1hdGNoKGEpO1xuICAgICAgICB0aGlzLmJvYXJkLmNsZWFyVGlsZVNlbGVjdEZvck1hdGNoKGIpO1xuICAgICAgICBjb25zdCBsZWZ0VGlsZSA9IGEueCA8PSBiLnggPyBhIDogYjtcbiAgICAgICAgY29uc3QgcmlnaHRUaWxlID0gYS54IDw9IGIueCA/IGIgOiBhO1xuICAgICAgICB0aGlzLmJvYXJkLmJyaW5nTWF0Y2hQYWlyVG9Gcm9udChsZWZ0VGlsZSwgcmlnaHRUaWxlKTtcbiAgICAgICAgYS5yZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgYi5yZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pc1JlbW92aW5nID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCBtaWRZID0gKGEueSArIGIueSkgKiAwLjU7XG4gICAgICAgIGNvbnN0IG1pZFggPSAoYS54ICsgYi54KSAqIDAuNTtcbiAgICAgICAgY29uc3QgcGFpckRpc3QgPSBNYXRoLmFicyhsZWZ0VGlsZS54IC0gcmlnaHRUaWxlLngpO1xuICAgICAgICBjb25zdCBtZWV0R2FwID0gTWF0aC5tYXgoXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmdldE1hdGNoTWVldENlbnRlckdhcChsZWZ0VGlsZSwgdHJ1ZSksXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmdldE1hdGNoTWVldENlbnRlckdhcChyaWdodFRpbGUsIHRydWUpXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGhhbGZHYXAgPSBtZWV0R2FwICogMC41O1xuICAgICAgICBjb25zdCBsZWZ0U3RvcFggPSBtaWRYIC0gaGFsZkdhcDtcbiAgICAgICAgY29uc3QgcmlnaHRTdG9wWCA9IG1pZFggKyBoYWxmR2FwO1xuICAgICAgICBjb25zdCBvdXR3YXJkRGlzdCA9IE1hdGgubWF4KE1BVENIX09VVFdBUkRfRElTVCwgcGFpckRpc3QgKiAwLjIgKyAyOCk7XG5cbiAgICAgICAgdGhpcy5wbGF5TWF0Y2hDb2xsaWRlQW5pbShsZWZ0VGlsZSwgbWlkWCwgbWlkWSwgJ2xlZnQnLCBsZWZ0U3RvcFgsIG91dHdhcmREaXN0KTtcbiAgICAgICAgdGhpcy5wbGF5TWF0Y2hDb2xsaWRlQW5pbShyaWdodFRpbGUsIG1pZFgsIG1pZFksICdyaWdodCcsIHJpZ2h0U3RvcFgsIG91dHdhcmREaXN0KTtcblxuICAgICAgICBjb25zdCBtZWV0TW9tZW50ID1cbiAgICAgICAgICAgIE1BVENIX09VVFdBUkRfRFVSQVRJT04gKyBNQVRDSF9BTElHTl9ZX0RVUkFUSU9OICsgTUFUQ0hfTU9WRV9YX0RVUkFUSU9OICsgTUFUQ0hfVE9VQ0hfRFVSQVRJT047XG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuYnJpbmdNYXRjaFBhaXJUb0Zyb250KGxlZnRUaWxlLCByaWdodFRpbGUpO1xuICAgICAgICAgICAgdGhpcy5ib2FyZC5wbGF5TWF0Y2hFbGltaW5hdGlvbkVmZmVjdChtaWRYLCBtaWRZKTtcbiAgICAgICAgfSwgbWVldE1vbWVudCk7XG5cbiAgICAgICAgY29uc3QgYnVtcERlbGF5ID1cbiAgICAgICAgICAgIE1BVENIX09VVFdBUkRfRFVSQVRJT04gK1xuICAgICAgICAgICAgTUFUQ0hfQUxJR05fWV9EVVJBVElPTiArXG4gICAgICAgICAgICBNQVRDSF9NT1ZFX1hfRFVSQVRJT04gK1xuICAgICAgICAgICAgTUFUQ0hfVE9VQ0hfRFVSQVRJT04gK1xuICAgICAgICAgICAgTUFUQ0hfVE9VQ0hfSE9MRF9EVVJBVElPTjtcbiAgICAgICAgdGhpcy5jb21ib051bSsrO1xuICAgICAgICB0aGlzLm1hdGNoUGFpckNvdW50Kys7XG4gICAgICAgIGNvbnN0IHJhdGVUaWVyID0gdGhpcy5nZXRSYXRlVGllckluZGV4KHRoaXMuY29tYm9OdW0pO1xuICAgICAgICBjb25zdCBzY29yZUdhaW4gPSB0aGlzLmNhbGNNYXRjaFNjb3JlR2Fpbih0aGlzLmNvbWJvTnVtLCByYXRlVGllcik7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGxheUNoZWNrU291bmQoKTtcbiAgICAgICAgICAgIGlmIChyYXRlVGllciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGxheVJhdGVQb3B1cChyYXRlVGllcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFkZFNjb3JlKHNjb3JlR2Fpbik7XG4gICAgICAgIH0sIGJ1bXBEZWxheSk7XG5cbiAgICAgICAgY29uc3QgdG90YWwgPVxuICAgICAgICAgICAgTUFUQ0hfT1VUV0FSRF9EVVJBVElPTiArXG4gICAgICAgICAgICBNQVRDSF9BTElHTl9ZX0RVUkFUSU9OICtcbiAgICAgICAgICAgIE1BVENIX01PVkVfWF9EVVJBVElPTiArXG4gICAgICAgICAgICBNQVRDSF9UT1VDSF9EVVJBVElPTiArXG4gICAgICAgICAgICBNQVRDSF9UT1VDSF9IT0xEX0RVUkFUSU9OICtcbiAgICAgICAgICAgIE1BVENIX0ZBREVfRFVSQVRJT047XG5cbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pc1JlbW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLnJlZnJlc2hWaXN1YWxzKCk7XG4gICAgICAgICAgICB0aGlzLmNoZWNrV2luKCk7XG4gICAgICAgIH0sIHRvdGFsICsgMC4wNSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogMS4g5rK/5bem5Y+z5YWI5b6A5aSW5by55byA77yI5L+d5oyB5b2T5YmNIFnvvIlcbiAgICAgKiAyLiDnp7vliLDkuKTniYwgWSDkuK3lv4Ppq5jluqZcbiAgICAgKiAzLiDmqKrlkJHpnaDmi6LliLDkuK3nur/kuKTkvqfvvIjkuK3lv4Pot50gPSDniYzlrr3vvIzotLTovrnkuI3lj6DvvIlcbiAgICAgKiA0LiDovbvpobbnm7jnorAg4oaSIOWBnOeVmeeJh+WIuyDihpIg5reh5Ye66ZSA5q+BXG4gICAgICovXG4gICAgcHJpdmF0ZSBwbGF5TWF0Y2hDb2xsaWRlQW5pbShcbiAgICAgICAgdGlsZTogVGlsZU1vZGVsLFxuICAgICAgICBtaWRYOiBudW1iZXIsXG4gICAgICAgIG1pZFk6IG51bWJlcixcbiAgICAgICAgc2lkZTogJ2xlZnQnIHwgJ3JpZ2h0JyxcbiAgICAgICAgc3RvcFg6IG51bWJlcixcbiAgICAgICAgb3V0d2FyZERpc3Q6IG51bWJlclxuICAgICk6IHZvaWQge1xuICAgICAgICBjb25zdCBub2RlID0gdGlsZS5ub2RlO1xuICAgICAgICB0aGlzLmJvYXJkLmNsZWFyVGlsZVNlbGVjdEZvck1hdGNoKHRpbGUpO1xuICAgICAgICBjb25zdCBzdGFydFggPSB0aWxlLng7XG4gICAgICAgIGNvbnN0IHN0YXJ0WSA9IHRpbGUueTtcbiAgICAgICAgbm9kZS5zZXRQb3NpdGlvbihzdGFydFgsIHN0YXJ0WSk7XG4gICAgICAgIGNvbnN0IG91dFggPSBzaWRlID09PSAnbGVmdCcgPyBzdGFydFggLSBvdXR3YXJkRGlzdCA6IHN0YXJ0WCArIG91dHdhcmREaXN0O1xuICAgICAgICBjb25zdCBiYXNlU2NhbGUgPSB0aGlzLmJvYXJkLmdldEJhc2VTY2FsZSh0aWxlKTtcbiAgICAgICAgY29uc3QgdG91Y2hYID0gc2lkZSA9PT0gJ2xlZnQnXG4gICAgICAgICAgICA/IE1hdGgubWluKHN0b3BYICsgTUFUQ0hfVE9VQ0hfTlVER0UsIG1pZFggLSAxKVxuICAgICAgICAgICAgOiBNYXRoLm1heChzdG9wWCAtIE1BVENIX1RPVUNIX05VREdFLCBtaWRYICsgMSk7XG5cbiAgICAgICAgbm9kZS5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICBub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShcbiAgICAgICAgICAgIGNjLm1vdmVUbyhNQVRDSF9PVVRXQVJEX0RVUkFUSU9OLCBvdXRYLCBzdGFydFkpLmVhc2luZyhjYy5lYXNlQmFja091dCgpKSxcbiAgICAgICAgICAgIGNjLm1vdmVUbyhNQVRDSF9BTElHTl9ZX0RVUkFUSU9OLCBvdXRYLCBtaWRZKS5lYXNpbmcoY2MuZWFzZVNpbmVPdXQoKSksXG4gICAgICAgICAgICBjYy5tb3ZlVG8oTUFUQ0hfTU9WRV9YX0RVUkFUSU9OLCBzdG9wWCwgbWlkWSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbkluKCkpLFxuICAgICAgICAgICAgLy8gY2MubW92ZVRvKE1BVENIX1RPVUNIX0RVUkFUSU9OLCB0b3VjaFgsIG1pZFkpLmVhc2luZyhjYy5lYXNlU2luZUluKCkpLFxuICAgICAgICAgICAgLy8gY2MuZGVsYXlUaW1lKE1BVENIX1RPVUNIX0hPTERfRFVSQVRJT04pLFxuICAgICAgICAgICAgY2Muc3Bhd24oXG4gICAgICAgICAgICAgICAgY2Muc2VxdWVuY2UoXG4gICAgICAgICAgICAgICAgICAgIGNjLnNjYWxlVG8oTUFUQ0hfRkFERV9EVVJBVElPTiAqIDAuMzUsIGJhc2VTY2FsZSAqIDEuMDYpLFxuICAgICAgICAgICAgICAgICAgICBjYy5zY2FsZVRvKE1BVENIX0ZBREVfRFVSQVRJT04sIDApLmVhc2luZyhjYy5lYXNlQmFja0luKCkpXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBjYy5mYWRlT3V0KE1BVENIX0ZBREVfRFVSQVRJT04pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChub2RlICYmIGlzVmFsaWQobm9kZSkpIG5vZGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKSk7XG4gICAgfVxuXG4gICAgLyoqIOacrOWxgOa2iOmZpOW+l+WIhu+8muWfuuehgOWIhiArIOi/nuWHu+WKoOaIkCArIOivhOe6p+mYtuauteWlluWKsSAqL1xuICAgIHByaXZhdGUgY2FsY01hdGNoU2NvcmVHYWluKGNvbWJvOiBudW1iZXIsIHJhdGVUaWVyOiBudW1iZXIgfCBudWxsKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGdhaW4gPSBTQ09SRV9CQVNFICsgU0NPUkVfQ09NQk9fQUREICogY29tYm87XG4gICAgICAgIGlmIChyYXRlVGllciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgZ2FpbiArPSBTQ09SRV9SQVRFX0JPTlVTW3JhdGVUaWVyXSB8fCAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnYWluO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWRkU2NvcmUoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnNjb3JlTnVtICs9IGRlbHRhO1xuICAgICAgICBpZiAodGhpcy5zY29yZURpc3BsYXkpIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcmVEaXNwbGF5LmFkZFZhbHVlKGRlbHRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOi/nua2iCAyIOWvuSDihpIgZ29vZO+8jDQg5a+5IOKGkiBncmVhdCDigKYgMTArIOKGkiB1bmJlbGlldmFibGXjgIJcbiAgICAgKiDmnKrliLDkuIvkuIDmoaPpl7TpmpTml7bkuI3lvLnlrZfjgIJcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldFJhdGVUaWVySW5kZXgoY29tYm86IG51bWJlcik6IG51bWJlciB8IG51bGwge1xuICAgICAgICBpZiAoY29tYm8gPD0gMCB8fCBjb21ibyAlIFJBVEVfTUFUQ0hfU1RFUCAhPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaWR4ID0gTWF0aC5mbG9vcihjb21ibyAvIFJBVEVfTUFUQ0hfU1RFUCkgLSAxO1xuICAgICAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGgubWluKGlkeCwgUkFURV9SRVNfS0VZUy5sZW5ndGggLSAxKTtcbiAgICB9XG5cbiAgICAvKiog6K+E57qn5Zu+5Zyo5bGP5a695YaF55qE5pyA5aSn57yp5pS+77yI6K6+6K6h5Z2Q5qCH77yJICovXG4gICAgcHJpdmF0ZSBnZXRSYXRlUG9wdXBGaXRDYXAoZnJhbWU6IGNjLlNwcml0ZUZyYW1lKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3Qgc3ByaXRlVyA9IGZyYW1lID8gZnJhbWUuZ2V0UmVjdCgpLndpZHRoIDogMDtcbiAgICAgICAgaWYgKHNwcml0ZVcgPD0gMCB8fCAhdGhpcy5ub2RlIHx8ICFpc1ZhbGlkKHRoaXMubm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICh0aGlzLm5vZGUud2lkdGggKiBSQVRFX01BWF9XSURUSF9SQVRJTykgLyBzcHJpdGVXO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0UmF0ZVBvcHVwVGFyZ2V0U2NhbGUodGllckluZGV4OiBudW1iZXIsIGZyYW1lOiBjYy5TcHJpdGVGcmFtZSk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IHRpZXJTY2FsZSA9IFJBVEVfVElFUl9TQ0FMRVNbdGllckluZGV4XSB8fCBSQVRFX1RJRVJfU0NBTEVTWzBdO1xuICAgICAgICByZXR1cm4gTWF0aC5taW4odGllclNjYWxlLCB0aGlzLmdldFJhdGVQb3B1cEZpdENhcChmcmFtZSkpO1xuICAgIH1cblxuICAgIC8qKiDlsY/luZXmraPkuK3lvLnlh7ror4TnuqflrZfvvIzluKblvLnlh7rkuI7mlLblm57liqjnlLsgKi9cbiAgICBwbGF5UmF0ZVBvcHVwKHRpZXJJbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5ub2RlIHx8ICFpc1ZhbGlkKHRoaXMubm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmcmFtZSA9IHRoaXMucmF0ZUZyYW1lc1t0aWVySW5kZXhdO1xuICAgICAgICBpZiAoIWZyYW1lKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5yYXRlUG9wdXBOb2RlICYmIGlzVmFsaWQodGhpcy5yYXRlUG9wdXBOb2RlKSkge1xuICAgICAgICAgICAgdGhpcy5yYXRlUG9wdXBOb2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgICAgICB0aGlzLnJhdGVQb3B1cE5vZGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5yYXRlUG9wdXBOb2RlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5vZGUgPSBuZXcgY2MuTm9kZSgnUmF0ZVBvcHVwJyk7XG4gICAgICAgIG5vZGUuc2V0UG9zaXRpb24oMCwgMCk7XG4gICAgICAgIG5vZGUuekluZGV4ID0gWl9PUkRFUi5SQVRFX1BPUFVQO1xuICAgICAgICBub2RlLnNjYWxlID0gMDtcbiAgICAgICAgbm9kZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKG5vZGUpO1xuICAgICAgICB0aGlzLnJhdGVQb3B1cE5vZGUgPSBub2RlO1xuXG4gICAgICAgIGNvbnN0IHNwcml0ZSA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgIHNwcml0ZS5zcHJpdGVGcmFtZSA9IGZyYW1lO1xuICAgICAgICBzcHJpdGUuc2l6ZU1vZGUgPSBjYy5TcHJpdGUuU2l6ZU1vZGUuVFJJTU1FRDtcblxuICAgICAgICBjb25zdCB0YXJnZXRTY2FsZSA9IHRoaXMuZ2V0UmF0ZVBvcHVwVGFyZ2V0U2NhbGUodGllckluZGV4LCBmcmFtZSk7XG4gICAgICAgIGNvbnN0IGZpdENhcCA9IHRoaXMuZ2V0UmF0ZVBvcHVwRml0Q2FwKGZyYW1lKTtcbiAgICAgICAgY29uc3QgcG9wUGVhayA9IE1hdGgubWluKHRhcmdldFNjYWxlICogMS4xNCwgZml0Q2FwKTtcbiAgICAgICAgY29uc3QgcG9wT3V0U2NhbGUgPSBNYXRoLm1pbih0YXJnZXRTY2FsZSAqIDEuMjIsIGZpdENhcCk7XG4gICAgICAgIG5vZGUuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgbm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoXG4gICAgICAgICAgICBjYy5zcGF3bihcbiAgICAgICAgICAgICAgICBjYy5zY2FsZVRvKFJBVEVfUE9QX0lOX0RVUkFUSU9OLCBwb3BQZWFrKS5lYXNpbmcoY2MuZWFzZUJhY2tPdXQoKSksXG4gICAgICAgICAgICAgICAgY2MuZmFkZUluKFJBVEVfUE9QX0lOX0RVUkFUSU9OICogMC42NSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBjYy5zY2FsZVRvKDAuMDYsIHRhcmdldFNjYWxlKS5lYXNpbmcoY2MuZWFzZVNpbmVPdXQoKSksXG4gICAgICAgICAgICBjYy5kZWxheVRpbWUoUkFURV9IT0xEX0RVUkFUSU9OKSxcbiAgICAgICAgICAgIGNjLnNwYXduKFxuICAgICAgICAgICAgICAgIGNjLnNjYWxlVG8oUkFURV9QT1BfT1VUX0RVUkFUSU9OLCBwb3BPdXRTY2FsZSkuZWFzaW5nKGNjLmVhc2VCYWNrSW4oKSksXG4gICAgICAgICAgICAgICAgY2MuZmFkZU91dChSQVRFX1BPUF9PVVRfRFVSQVRJT04pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJhdGVQb3B1cE5vZGUgPT09IG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yYXRlUG9wdXBOb2RlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUgJiYgaXNWYWxpZChub2RlKSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKVxuICAgICAgICApKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBsYXlDaGVja1NvdW5kKCk6IHZvaWQge1xuICAgICAgICBpZighc3VwZXJfaHRtbF9wbGF5YWJsZS5pc19hdWRpbygpKSB7IFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQ2xpcCkge1xuICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmNoZWNrQ2xpcCwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNjLnJlc291cmNlcy5sb2FkKENIRUNLX1NPVU5EX1BBVEgsIGNjLkF1ZGlvQ2xpcCwgKGVyciwgY2xpcCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFlcnIgJiYgY2xpcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tDbGlwID0gY2xpcDtcbiAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KGNsaXAsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjaGVja1dpbigpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBdXRvQ2xlYXJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5tYXRjaFBhaXJDb3VudCA+PSBTRVRUTEVNRU5UX01BVENIX1BBSVJTKSB7XG4gICAgICAgICAgICB0aGlzLmJlZ2luVmljdG9yeVdpdGhBdXRvQ2xlYXIoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsZWZ0ID0gdGhpcy5ib2FyZC5nZXRBY3RpdmVDb3VudCgpO1xuICAgICAgICBpZiAobGVmdCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5zaG93VmljdG9yeSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzZXRJZGxlR3VpZGVUaW1lcigpO1xuICAgIH1cblxuICAgIC8qKiDliankvZnniYzlnKggQVVUT19DTEVBUl9CRUZPUkVfU0VUVExFTUVOVF9TRUMg5YaF5b+r6YCf6YWN5a+55raI6Zmk77yM5YaN5Ye657uT566XICovXG4gICAgcHJpdmF0ZSBiZWdpblZpY3RvcnlXaXRoQXV0b0NsZWFyKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0dhbWVPdmVyIHx8IHRoaXMuaXNBdXRvQ2xlYXJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwYWlycyA9IGNvbGxlY3RSZW1haW5pbmdNYXRjaFBhaXJzKHRoaXMuYm9hcmQudGlsZXMpO1xuICAgICAgICBpZiAocGFpcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dWaWN0b3J5KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlzQXV0b0NsZWFyaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5nYW1lUmVhZHkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51bnNjaGVkdWxlKHRoaXMub25JZGxlR3VpZGUpO1xuICAgICAgICB0aGlzLmJvYXJkLmhpZGVIaW50R3VpZGVIYW5kKCk7XG4gICAgICAgIHRoaXMuY2xlYXJHdWlkZUhpZ2hsaWdodCgpO1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5kZXNlbGVjdFRpbGUodGhpcy5zZWxlY3RlZCk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJ1ZGdldCA9IEFVVE9fQ0xFQVJfQkVGT1JFX1NFVFRMRU1FTlRfU0VDO1xuICAgICAgICBjb25zdCBwYWlyQW5pbSA9IEFVVE9fQ0xFQVJfTU9WRV9EVVJBVElPTiArIEFVVE9fQ0xFQVJfUEFJUl9GQURFO1xuICAgICAgICBjb25zdCBuID0gcGFpcnMubGVuZ3RoO1xuICAgICAgICBjb25zdCBzdGFnZ2VyID0gbiA8PSAxXG4gICAgICAgICAgICA/IDBcbiAgICAgICAgICAgIDogTWF0aC5taW4oQVVUT19DTEVBUl9TVEFHR0VSX01BWCwgKGJ1ZGdldCAtIHBhaXJBbmltKSAvIChuIC0gMSkpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwYWlyID0gcGFpcnNbaV07XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVQYWlyQXV0byhwYWlyLmEsIHBhaXIuYik7XG4gICAgICAgICAgICB9LCBpICogc3RhZ2dlcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5maW5pc2hBdXRvQ2xlYXJUaGVuVmljdG9yeSk7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKHRoaXMuZmluaXNoQXV0b0NsZWFyVGhlblZpY3RvcnksIGJ1ZGdldCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaW5pc2hBdXRvQ2xlYXJUaGVuVmljdG9yeSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQXV0b0NsZWFyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc0F1dG9DbGVhcmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmZhZGVPdXRVbnBhaXJlZFJlbWFpbmRlcnMoKTtcbiAgICAgICAgdGhpcy5ib2FyZC5yZWZyZXNoVmlzdWFscygpO1xuICAgICAgICB0aGlzLnNob3dWaWN0b3J5KCk7XG4gICAgfTtcblxuICAgIC8qKiDml6Dms5XphY3lr7nnmoTpm7bmmJ/liankvZnniYznm7TmjqXmt6Hlh7ogKi9cbiAgICBwcml2YXRlIGZhZGVPdXRVbnBhaXJlZFJlbWFpbmRlcnMoKTogdm9pZCB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ib2FyZC50aWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdGlsZSA9IHRoaXMuYm9hcmQudGlsZXNbaV07XG4gICAgICAgICAgICBpZiAodGlsZS5yZW1vdmVkIHx8ICF0aWxlLm5vZGUgfHwgIWlzVmFsaWQodGlsZS5ub2RlKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGlsZS5yZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aWxlLm5vZGU7XG4gICAgICAgICAgICBub2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgICAgICBub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShcbiAgICAgICAgICAgICAgICBjYy5mYWRlT3V0KEFVVE9fQ0xFQVJfUEFJUl9GQURFKSxcbiAgICAgICAgICAgICAgICBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlICYmIGlzVmFsaWQobm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIOe7k+eul+aJq+Wwvu+8muefreenu+WKqCArIOa3oeWHuu+8jOWPr+W5tuihjOWkmuWvuSAqL1xuICAgIHByaXZhdGUgcmVtb3ZlUGFpckF1dG8oYTogVGlsZU1vZGVsLCBiOiBUaWxlTW9kZWwpOiB2b2lkIHtcbiAgICAgICAgaWYgKCFhLm5vZGUgfHwgIWIubm9kZSB8fCAhaXNWYWxpZChhLm5vZGUpIHx8ICFpc1ZhbGlkKGIubm9kZSkgfHwgYS5yZW1vdmVkIHx8IGIucmVtb3ZlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ib2FyZC5jbGVhclRpbGVTZWxlY3RGb3JNYXRjaChhKTtcbiAgICAgICAgdGhpcy5ib2FyZC5jbGVhclRpbGVTZWxlY3RGb3JNYXRjaChiKTtcbiAgICAgICAgY29uc3QgbGVmdFRpbGUgPSBhLnggPD0gYi54ID8gYSA6IGI7XG4gICAgICAgIGNvbnN0IHJpZ2h0VGlsZSA9IGEueCA8PSBiLnggPyBiIDogYTtcbiAgICAgICAgdGhpcy5ib2FyZC5icmluZ01hdGNoUGFpclRvRnJvbnQobGVmdFRpbGUsIHJpZ2h0VGlsZSk7XG5cbiAgICAgICAgYS5yZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgYi5yZW1vdmVkID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCBtaWRYID0gKGxlZnRUaWxlLnggKyByaWdodFRpbGUueCkgKiAwLjU7XG4gICAgICAgIGNvbnN0IG1pZFkgPSAobGVmdFRpbGUueSArIHJpZ2h0VGlsZS55KSAqIDAuNTtcbiAgICAgICAgdGhpcy5ib2FyZC5wbGF5TWF0Y2hFbGltaW5hdGlvbkVmZmVjdChtaWRYLCBtaWRZKTtcblxuICAgICAgICB0aGlzLmNvbWJvTnVtKys7XG4gICAgICAgIHRoaXMuYWRkU2NvcmUodGhpcy5jYWxjTWF0Y2hTY29yZUdhaW4odGhpcy5jb21ib051bSwgbnVsbCkpO1xuXG4gICAgICAgIHRoaXMucGxheUF1dG9DbGVhclRpbGVBbmltKGxlZnRUaWxlLCBtaWRYLCBtaWRZLCAnbGVmdCcpO1xuICAgICAgICB0aGlzLnBsYXlBdXRvQ2xlYXJUaWxlQW5pbShyaWdodFRpbGUsIG1pZFgsIG1pZFksICdyaWdodCcpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGxheUF1dG9DbGVhclRpbGVBbmltKFxuICAgICAgICB0aWxlOiBUaWxlTW9kZWwsXG4gICAgICAgIG1pZFg6IG51bWJlcixcbiAgICAgICAgbWlkWTogbnVtYmVyLFxuICAgICAgICBzaWRlOiAnbGVmdCcgfCAncmlnaHQnXG4gICAgKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aWxlLm5vZGU7XG4gICAgICAgIGlmICghbm9kZSB8fCAhaXNWYWxpZChub2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN0YXJ0WCA9IHRpbGUueDtcbiAgICAgICAgY29uc3Qgc3RhcnRZID0gdGlsZS55O1xuICAgICAgICBjb25zdCB0YXJnZXRYID0gc2lkZSA9PT0gJ2xlZnQnID8gbWlkWCAtIDggOiBtaWRYICsgODtcbiAgICAgICAgY29uc3QgYmFzZVNjYWxlID0gdGhpcy5ib2FyZC5nZXRCYXNlU2NhbGUodGlsZSk7XG4gICAgICAgIG5vZGUuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgbm9kZS5zZXRTY2FsZShiYXNlU2NhbGUpO1xuICAgICAgICBub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShcbiAgICAgICAgICAgIGNjLnNwYXduKFxuICAgICAgICAgICAgICAgIGNjLm1vdmVUbyhBVVRPX0NMRUFSX01PVkVfRFVSQVRJT04sIHRhcmdldFgsIG1pZFkpLmVhc2luZyhjYy5lYXNlU2luZU91dCgpKSxcbiAgICAgICAgICAgICAgICBjYy5mYWRlVG8oQVVUT19DTEVBUl9NT1ZFX0RVUkFUSU9OLCAyMzApLFxuICAgICAgICAgICAgICAgIGNjLnNjYWxlVG8oQVVUT19DTEVBUl9NT1ZFX0RVUkFUSU9OLCBiYXNlU2NhbGUgKiAxLjA0KVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGNjLnNwYXduKFxuICAgICAgICAgICAgICAgIGNjLnNjYWxlVG8oQVVUT19DTEVBUl9QQUlSX0ZBREUsIDApLmVhc2luZyhjYy5lYXNlQmFja0luKCkpLFxuICAgICAgICAgICAgICAgIGNjLmZhZGVPdXQoQVVUT19DTEVBUl9QQUlSX0ZBREUpXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChub2RlICYmIGlzVmFsaWQobm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoaWRlRW5kUGFuZWwoKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5lbmROb2RlIHx8ICFpc1ZhbGlkKHRoaXMuZW5kTm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5iaW5kRW5kRG93bmxvYWRCdXR0b24pO1xuICAgICAgICBjb25zdCBkb3dubG9hZCA9IHRoaXMuZW5kTm9kZS5nZXRDaGlsZEJ5TmFtZSgnZG93bmxvYWQnKTtcbiAgICAgICAgaWYgKGRvd25sb2FkICYmIGlzVmFsaWQoZG93bmxvYWQpKSB7XG4gICAgICAgICAgICBkb3dubG9hZC50YXJnZXRPZmYodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzZXRWaWN0b3J5RW5kVW5sb2NrKHRoaXMuZW5kTm9kZSk7XG4gICAgICAgIHRoaXMuZW5kTm9kZS5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICB0aGlzLmVuZE5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZW5kTm9kZS5zY2FsZSA9IDE7XG4gICAgICAgIHRoaXMuZW5kTm9kZS5vcGFjaXR5ID0gMjU1O1xuICAgICAgICBpZiAodGhpcy5zY29yZURpc3BsYXkpIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcmVEaXNwbGF5LnJlbW91bnRUb0dhbWVIdWQodGhpcy5ub2RlLCBTQ09SRV9UT1BfTUFSR0lOKTtcbiAgICAgICAgICAgIHRoaXMuc2NvcmVEaXNwbGF5LnNldFZpc2libGUodHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiog5pi+56S6IENhbnZhcyDkuIrphY3nva7nmoQgZW5kIOiKgueCue+8muWIhuatpeaSreaUviBpY29uIC8gdmljdG9yeSAvIOaYn+aYnyAvIFRhc2tMaWdodCAvIOS4i+i9veaMiemSriAqL1xuICAgIHByaXZhdGUgc2hvd0VuZFBhbmVsKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuZW5kTm9kZSB8fCAhaXNWYWxpZCh0aGlzLmVuZE5vZGUpKSB7XG4gICAgICAgICAgICBjYy53YXJuKCdbR2FtZUNvbnRyb2xsZXJdIOacquaJvuWIsCBDYW52YXMvZW5kIOiKgueCuScpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyX2h0bWxfcGxheWFibGUuZ2FtZV9lbmQoKTtcbiAgICAgICAgdGhpcy5lbmROb2RlLnpJbmRleCA9IFpfT1JERVIuRU5EX1BBTkVMO1xuICAgICAgICB0aGlzLmVuZE5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lbmROb2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIHRoaXMuZW5kTm9kZS5zY2FsZSA9IDE7XG4gICAgICAgIHRoaXMuZW5kTm9kZS5vcGFjaXR5ID0gMjU1O1xuICAgICAgICB0aGlzLmVuZE5vZGUuY29sb3IgPSBjYy5Db2xvci5XSElURTtcbiAgICAgICAgbGF5b3V0VmljdG9yeUVuZERpbUJhY2tkcm9wKHRoaXMuZW5kTm9kZSwgdGhpcy5ub2RlKTtcbiAgICAgICAgcGxheVZpY3RvcnlFbmRTZXF1ZW5jZShcbiAgICAgICAgICAgIHRoaXMuZW5kTm9kZSxcbiAgICAgICAgICAgIHRoaXMuc2NvcmVOdW0sXG4gICAgICAgICAgICB0aGlzLnNjb3JlRm9udCxcbiAgICAgICAgICAgIHRoaXMuc2NvcmVEaXNwbGF5XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuYmluZEVuZERvd25sb2FkQnV0dG9uKCk7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKCgpID0+IHRoaXMuYmluZEVuZERvd25sb2FkQnV0dG9uKCksIDIpO1xuICAgIH1cblxuICAgIC8qKiDnu5HlrpogZW5kL2Rvd25sb2Fk77yI5pyJIEJ1dHRvbiDnlKggY2xpY2tFdmVudHPvvIzlkKbliJkgVE9VQ0hfRU5E77yJICovXG4gICAgcHJpdmF0ZSBiaW5kRW5kRG93bmxvYWRCdXR0b24oKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5lbmROb2RlIHx8ICFpc1ZhbGlkKHRoaXMuZW5kTm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBidG4gPSB0aGlzLmVuZE5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ2Rvd25sb2FkJyk7XG4gICAgICAgIGlmICghYnRuIHx8ICFpc1ZhbGlkKGJ0bikpIHtcbiAgICAgICAgICAgIGNjLndhcm4oJ1tHYW1lQ29udHJvbGxlcl0gZW5kL2Rvd25sb2FkIOiKgueCueS4jeWtmOWcqCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGJ0bi5hY3RpdmUgPSB0cnVlO1xuICAgICAgICBidG4ub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgYnRuLnpJbmRleCA9IFpfT1JERVJfRU5EX0NISUxELkRPV05MT0FEO1xuXG4gICAgICAgIGJ0bi50YXJnZXRPZmYodGhpcyk7XG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IGJ0bi5nZXRDb21wb25lbnQoY2MuQnV0dG9uKTtcbiAgICAgICAgaWYgKGJ1dHRvbikge1xuICAgICAgICAgICAgYnV0dG9uLmludGVyYWN0YWJsZSA9IHRydWU7XG4gICAgICAgICAgICBidXR0b24uY2xpY2tFdmVudHMgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IGV2ID0gbmV3IGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIoKTtcbiAgICAgICAgICAgIGV2LnRhcmdldCA9IHRoaXMubm9kZTtcbiAgICAgICAgICAgIGV2LmNvbXBvbmVudCA9ICdHYW1lQ29udHJvbGxlcic7XG4gICAgICAgICAgICBldi5oYW5kbGVyID0gJ29uRW5kRG93bmxvYWRDbGljayc7XG4gICAgICAgICAgICBidXR0b24uY2xpY2tFdmVudHMucHVzaChldik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYnRuLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5vbkVuZERvd25sb2FkQ2xpY2ssIHRoaXMpO1xuICAgIH1cblxuICAgIC8qKiDnu5PnrpcgZG93bmxvYWTvvIhwdWJsaWPvvJrkvpsgQnV0dG9uLmNsaWNrRXZlbnRzIOiwg+eUqO+8iSAqL1xuICAgIHB1YmxpYyBvbkVuZERvd25sb2FkQ2xpY2soKTogdm9pZCB7XG4gICAgICAgIHN1cGVyX2h0bWxfcGxheWFibGUuZG93bmxvYWQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3dWaWN0b3J5KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0dhbWVPdmVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc0dhbWVPdmVyID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5nYW1lUmVhZHkgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuc2NvcmVEaXNwbGF5KSB7XG4gICAgICAgICAgICB0aGlzLnNjb3JlRGlzcGxheS5zZXRWaXNpYmxlKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5vbklkbGVHdWlkZSk7XG4gICAgICAgIHRoaXMuYm9hcmQuaGlkZUhpbnRHdWlkZUhhbmQoKTtcbiAgICAgICAgdGhpcy5jbGVhckd1aWRlSGlnaGxpZ2h0KCk7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmRlc2VsZWN0VGlsZSh0aGlzLnNlbGVjdGVkKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2NvcmVEaXNwbGF5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY29yZURpc3BsYXkuc2V0VmFsdWUodGhpcy5zY29yZU51bSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zaG93RW5kUGFuZWwoKTtcbiAgICAgICAgfSwgMC4yKTtcbiAgICB9XG59XG4iXX0=