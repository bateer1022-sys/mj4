"use strict";
cc._RF.push(module, '77505DUHA9AXYWpG4IIdCuT', 'ArtScoreDisplay');
// script/ui/ArtScoreDisplay.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtScoreDisplay = void 0;
/** 使用 Cocos 官方位图字体（.fnt + .png）+ Label 显示积分 */
var is_valid_1 = require("../is-valid");
var GamePreloadConfig_1 = require("./GamePreloadConfig");
var GameImgAtlas_1 = require("./GameImgAtlas");
var SCORE_FONT_PATH = 'font/score_digits';
var SCORE_LABEL_FONT_SIZE = 54;
var SCORE_LABEL_LINE_HEIGHT = 70;
var SCORE_PUNCH_SCALE = 1.08;
var SCORE_PUNCH_DURATION = 0.12;
var SETTLE_POP_SCALE = 1.32;
var SETTLE_POP_IN_DURATION = 0.28;
/** 背光：由小变大并淡出 */
var SCORE_GLOW_SCALE_START = 0.35;
var SCORE_GLOW_SCALE_END = 1.15;
var SCORE_GLOW_DURATION = 0.48;
var ArtScoreDisplay = /** @class */ (function () {
    function ArtScoreDisplay(font) {
        this.value = 0;
        this.glowSf = null;
        this.root = new cc.Node('ScorePanel');
        this.root.zIndex = GamePreloadConfig_1.Z_ORDER.SCORE_HUD;
        this.glowNode = new cc.Node('score_glow');
        this.glowNode.setAnchorPoint(0.5, 0.5);
        this.glowNode.active = false;
        this.glowNode.opacity = 0;
        this.root.addChild(this.glowNode);
        var labelNode = new cc.Node('score_label');
        labelNode.setAnchorPoint(0.5, 0.5);
        this.root.addChild(labelNode);
        this.label = labelNode.addComponent(cc.Label);
        this.label.font = font;
        this.label.fontSize = SCORE_LABEL_FONT_SIZE;
        this.label.lineHeight = SCORE_LABEL_LINE_HEIGHT;
        this.label.enableWrapText = false;
        this.label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        this.label.verticalAlign = cc.Label.VerticalAlign.CENTER;
        this.label.string = '0';
        var widget = this.root.addComponent(cc.Widget);
        widget.isAlignTop = true;
        widget.isAlignHorizontalCenter = true;
        widget.horizontalCenter = 0;
        widget.isAbsoluteTop = true;
        widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
    }
    ArtScoreDisplay.load = function (onReady) {
        cc.resources.load(SCORE_FONT_PATH, cc.BitmapFont, function (err, font) {
            if (err || !font) {
                cc.warn('[ArtScoreDisplay] 位图字体加载失败:', SCORE_FONT_PATH, err);
                onReady(null);
                return;
            }
            onReady(ArtScoreDisplay.fromFont(font));
        });
    };
    ArtScoreDisplay.fromFont = function (font) {
        return new ArtScoreDisplay(font);
    };
    ArtScoreDisplay.prototype.mount = function (parent, topMargin) {
        parent.addChild(this.root);
        this.setTopMargin(topMargin);
        this.setValue(0, false);
    };
    ArtScoreDisplay.prototype.setTopMargin = function (top) {
        var widget = this.root.getComponent(cc.Widget);
        if (widget) {
            widget.top = top;
            widget.updateAlignment();
        }
    };
    ArtScoreDisplay.prototype.getValue = function () {
        return this.value;
    };
    ArtScoreDisplay.prototype.setVisible = function (visible) {
        if (is_valid_1.isValid(this.root)) {
            this.root.active = visible;
        }
    };
    ArtScoreDisplay.prototype.setValue = function (next, animate) {
        if (animate === void 0) { animate = true; }
        this.value = Math.max(0, Math.floor(next));
        this.label.string = String(this.value);
        this.syncGlowToScore();
        if (animate) {
            this.playPunch();
            this.playScoreGlow();
        }
    };
    ArtScoreDisplay.prototype.addValue = function (delta) {
        if (delta <= 0) {
            return;
        }
        this.setValue(this.value + delta, true);
    };
    /** 背光与分数同锚点 (0.5,0.5)、同位置 */
    ArtScoreDisplay.prototype.syncGlowToScore = function () {
        var labelNode = this.label.node;
        if (!labelNode || !is_valid_1.isValid(labelNode) || !is_valid_1.isValid(this.glowNode)) {
            return;
        }
        labelNode.setAnchorPoint(0.5, 0.5);
        this.glowNode.setAnchorPoint(0.5, 0.5);
        this.glowNode.setPosition(labelNode.x, labelNode.y);
    };
    ArtScoreDisplay.prototype.playPunch = function () {
        var labelNode = this.label.node;
        labelNode.stopAllActions();
        var base = 1;
        labelNode.scale = base;
        labelNode.runAction(cc.sequence(cc.scaleTo(SCORE_PUNCH_DURATION, SCORE_PUNCH_SCALE).easing(cc.easeBackOut()), cc.scaleTo(SCORE_PUNCH_DURATION, base).easing(cc.easeSineOut())));
    };
    ArtScoreDisplay.prototype.playScoreGlow = function () {
        var _this = this;
        var run = function () {
            if (!_this.glowSf || !is_valid_1.isValid(_this.glowNode)) {
                return;
            }
            var sprite = _this.glowNode.getComponent(cc.Sprite);
            if (!sprite) {
                sprite = _this.glowNode.addComponent(cc.Sprite);
            }
            sprite.spriteFrame = _this.glowSf;
            sprite.sizeMode = cc.Sprite.SizeMode.TRIMMED;
            _this.syncGlowToScore();
            _this.glowNode.stopAllActions();
            _this.glowNode.active = true;
            _this.glowNode.opacity = 255;
            _this.glowNode.setScale(SCORE_GLOW_SCALE_START);
            _this.glowNode.runAction(cc.spawn(cc.scaleTo(SCORE_GLOW_DURATION, SCORE_GLOW_SCALE_END).easing(cc.easeSineOut()), cc.sequence(cc.delayTime(SCORE_GLOW_DURATION * 0.2), cc.fadeOut(SCORE_GLOW_DURATION * 0.8).easing(cc.easeSineIn()))));
            _this.glowNode.runAction(cc.sequence(cc.delayTime(SCORE_GLOW_DURATION + 0.02), cc.callFunc(function () {
                if (_this.glowNode && is_valid_1.isValid(_this.glowNode)) {
                    _this.glowNode.active = false;
                    _this.glowNode.opacity = 0;
                }
            }, null)));
        };
        if (this.glowSf) {
            run();
            return;
        }
        GameImgAtlas_1.loadGameSpriteFrame(GamePreloadConfig_1.SCORE_GLOW_PATH, function (sf) {
            if (sf) {
                _this.glowSf = sf;
            }
            run();
        });
    };
    ArtScoreDisplay.prototype.getBitmapFont = function () {
        return this.label && this.label.font ? this.label.font : null;
    };
    /** 挂到 end 节点上，在 TaskLight 附近显示结算分 */
    ArtScoreDisplay.prototype.mountOnEndSettle = function (endRoot, localX, localY) {
        if (!endRoot || !is_valid_1.isValid(endRoot) || !is_valid_1.isValid(this.root)) {
            return;
        }
        var widget = this.root.getComponent(cc.Widget);
        if (widget) {
            widget.enabled = false;
        }
        if (this.root.parent !== endRoot) {
            this.root.removeFromParent(false);
            endRoot.addChild(this.root);
        }
        this.root.setPosition(localX, localY);
        this.root.zIndex = GamePreloadConfig_1.Z_ORDER_END_CHILD.SCORE;
        this.root.active = true;
    };
    /** 结算结束，恢复顶部 HUD */
    ArtScoreDisplay.prototype.remountToGameHud = function (canvas, topMargin) {
        if (!canvas || !is_valid_1.isValid(canvas) || !is_valid_1.isValid(this.root)) {
            return;
        }
        if (this.glowNode && is_valid_1.isValid(this.glowNode)) {
            this.glowNode.stopAllActions();
            this.glowNode.active = false;
            this.glowNode.opacity = 0;
        }
        this.root.stopAllActions();
        this.root.scale = 1;
        this.root.opacity = 255;
        if (this.root.parent !== canvas) {
            this.root.removeFromParent(false);
            canvas.addChild(this.root);
        }
        this.root.zIndex = GamePreloadConfig_1.Z_ORDER.SCORE_HUD;
        var widget = this.root.getComponent(cc.Widget);
        if (widget) {
            widget.enabled = true;
            widget.isAlignTop = true;
            widget.isAlignHorizontalCenter = true;
            widget.horizontalCenter = 0;
            widget.isAbsoluteTop = true;
        }
        this.setTopMargin(topMargin);
    };
    /** 通关结算：沿用顶部唯一位图 Label，避免再建 Label 导致主分数消失 */
    ArtScoreDisplay.prototype.playSettleReveal = function () {
        if (this.glowNode && is_valid_1.isValid(this.glowNode)) {
            this.glowNode.stopAllActions();
            this.glowNode.active = false;
        }
        this.root.zIndex = GamePreloadConfig_1.Z_ORDER_END_CHILD.SCORE;
        this.label.string = String(this.value);
        this.root.stopAllActions();
        this.root.scale = 0.3;
        this.root.opacity = 0;
        this.root.runAction(cc.spawn(cc.scaleTo(SETTLE_POP_IN_DURATION, SETTLE_POP_SCALE).easing(cc.easeBackOut()), cc.fadeIn(SETTLE_POP_IN_DURATION * 0.7)));
        this.root.runAction(cc.sequence(cc.delayTime(SETTLE_POP_IN_DURATION), cc.scaleTo(0.08, 1).easing(cc.easeSineOut())));
    };
    return ArtScoreDisplay;
}());
exports.ArtScoreDisplay = ArtScoreDisplay;

cc._RF.pop();