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