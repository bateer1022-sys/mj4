"use strict";
cc._RF.push(module, '49626hq109HEbkBpp06YFH5', 'LoadingScreen');
// script/ui/LoadingScreen.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingScreen = void 0;
var is_valid_1 = require("../is-valid");
var ShowAllLayout_1 = require("./ShowAllLayout");
var GamePreloadConfig_1 = require("./GamePreloadConfig");
var LOADING_FADE_OUT = 0.18;
/**
 * 全屏加载：遮罩与 bg 同图同缩放，中央圆形转圈。
 */
var LoadingScreen = /** @class */ (function () {
    function LoadingScreen(canvas) {
        this.maskNode = null;
        this.shownAt = 0;
        this.canvas = canvas;
        this.root = new cc.Node('LoadingScreen');
        this.root.zIndex = GamePreloadConfig_1.Z_ORDER.LOADING;
        this.root.opacity = 255;
        var spin = new cc.Node('Spinner');
        var spinG = spin.addComponent(cc.Graphics);
        spinG.strokeColor = cc.color(255, 210, 90, 220);
        spinG.lineWidth = 5;
        spinG.arc(0, 0, 32, 0.15 * Math.PI, 1.65 * Math.PI);
        spinG.stroke();
        this.root.addChild(spin);
        spin.runAction(cc.repeatForever(cc.rotateBy(1.1, 360)));
    }
    LoadingScreen.prototype.show = function (parent) {
        if (!parent || !is_valid_1.isValid(parent)) {
            return;
        }
        this.shownAt = Date.now();
        this.ensureMask();
        this.layout();
        this.root.stopAllActions();
        this.root.opacity = 255;
        if (this.root.parent !== parent) {
            this.root.removeFromParent(false);
            parent.addChild(this.root);
        }
        this.root.active = true;
    };
    /** 窗口变化时与 bg 一起重新铺满 */
    LoadingScreen.prototype.layout = function () {
        if (this.maskNode && is_valid_1.isValid(this.maskNode)) {
            ShowAllLayout_1.layoutShowAllCover(this.maskNode, this.canvas);
        }
    };
    LoadingScreen.prototype.hide = function (onDone) {
        var _this = this;
        var elapsed = (Date.now() - this.shownAt) / 1000;
        var wait = Math.max(0, GamePreloadConfig_1.LOADING_MIN_VISIBLE_SEC - elapsed);
        this.root.stopAllActions();
        this.root.runAction(cc.sequence(cc.delayTime(wait), cc.fadeOut(LOADING_FADE_OUT), cc.callFunc(function () {
            if (_this.root && is_valid_1.isValid(_this.root)) {
                _this.root.active = false;
                _this.root.opacity = 255;
            }
            if (onDone) {
                onDone();
            }
        })));
    };
    LoadingScreen.prototype.ensureMask = function () {
        if (this.maskNode && is_valid_1.isValid(this.maskNode)) {
            return;
        }
        var bg = this.canvas.getChildByName('bg');
        if (!bg || !is_valid_1.isValid(bg)) {
            return;
        }
        var bgSprite = bg.getComponent(cc.Sprite);
        if (!bgSprite || !bgSprite.spriteFrame) {
            return;
        }
        this.maskNode = new cc.Node('LoadingMask');
        this.maskNode.setAnchorPoint(0.5, 0.5);
        var maskSprite = this.maskNode.addComponent(cc.Sprite);
        maskSprite.spriteFrame = bgSprite.spriteFrame;
        maskSprite.sizeMode = bgSprite.sizeMode;
        maskSprite.type = bgSprite.type;
        this.root.addChild(this.maskNode);
        this.maskNode.setSiblingIndex(0);
    };
    return LoadingScreen;
}());
exports.LoadingScreen = LoadingScreen;

cc._RF.pop();