
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/ui/LoadingScreen.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvdWkvTG9hZGluZ1NjcmVlbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx3Q0FBc0M7QUFDdEMsaURBQXFEO0FBQ3JELHlEQUF1RTtBQUV2RSxJQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQztBQUU5Qjs7R0FFRztBQUNIO0lBTUksdUJBQVksTUFBZTtRQUhuQixhQUFRLEdBQVksSUFBSSxDQUFDO1FBQ3pCLFlBQU8sR0FBRyxDQUFDLENBQUM7UUFHaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsMkJBQU8sQ0FBQyxPQUFPLENBQUM7UUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBRXhCLElBQU0sSUFBSSxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNwQyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3QyxLQUFLLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDaEQsS0FBSyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDcEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BELEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxD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UUFBUSxDQUFDLFdBQVcsRUFBRTtZQUNwQyxPQUFPO1NBQ1Y7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdkMsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pELFVBQVUsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztRQUM5QyxVQUFVLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7UUFDeEMsVUFBVSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ0wsb0JBQUM7QUFBRCxDQXRGQSxBQXNGQyxJQUFBO0FBdEZZLHNDQUFhIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNWYWxpZCB9IGZyb20gJy4uL2lzLXZhbGlkJztcbmltcG9ydCB7IGxheW91dFNob3dBbGxDb3ZlciB9IGZyb20gJy4vU2hvd0FsbExheW91dCc7XG5pbXBvcnQgeyBMT0FESU5HX01JTl9WSVNJQkxFX1NFQywgWl9PUkRFUiB9IGZyb20gJy4vR2FtZVByZWxvYWRDb25maWcnO1xuXG5jb25zdCBMT0FESU5HX0ZBREVfT1VUID0gMC4xODtcblxuLyoqXG4gKiDlhajlsY/liqDovb3vvJrpga7nvankuI4gYmcg5ZCM5Zu+5ZCM57yp5pS+77yM5Lit5aSu5ZyG5b2i6L2s5ZyI44CCXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2FkaW5nU2NyZWVuIHtcbiAgICByZWFkb25seSByb290OiBjYy5Ob2RlO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgY2FudmFzOiBjYy5Ob2RlO1xuICAgIHByaXZhdGUgbWFza05vZGU6IGNjLk5vZGUgPSBudWxsO1xuICAgIHByaXZhdGUgc2hvd25BdCA9IDA7XG5cbiAgICBjb25zdHJ1Y3RvcihjYW52YXM6IGNjLk5vZGUpIHtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgICAgIHRoaXMucm9vdCA9IG5ldyBjYy5Ob2RlKCdMb2FkaW5nU2NyZWVuJyk7XG4gICAgICAgIHRoaXMucm9vdC56SW5kZXggPSBaX09SREVSLkxPQURJTkc7XG4gICAgICAgIHRoaXMucm9vdC5vcGFjaXR5ID0gMjU1O1xuXG4gICAgICAgIGNvbnN0IHNwaW4gPSBuZXcgY2MuTm9kZSgnU3Bpbm5lcicpO1xuICAgICAgICBjb25zdCBzcGluRyA9IHNwaW4uYWRkQ29tcG9uZW50KGNjLkdyYXBoaWNzKTtcbiAgICAgICAgc3Bpbkcuc3Ryb2tlQ29sb3IgPSBjYy5jb2xvcigyNTUsIDIxMCwgOTAsIDIyMCk7XG4gICAgICAgIHNwaW5HLmxpbmVXaWR0aCA9IDU7XG4gICAgICAgIHNwaW5HLmFyYygwLCAwLCAzMiwgMC4xNSAqIE1hdGguUEksIDEuNjUgKiBNYXRoLlBJKTtcbiAgICAgICAgc3Bpbkcuc3Ryb2tlKCk7XG4gICAgICAgIHRoaXMucm9vdC5hZGRDaGlsZChzcGluKTtcbiAgICAgICAgc3Bpbi5ydW5BY3Rpb24oY2MucmVwZWF0Rm9yZXZlcihjYy5yb3RhdGVCeSgxLjEsIDM2MCkpKTtcbiAgICB9XG5cbiAgICBzaG93KHBhcmVudDogY2MuTm9kZSk6IHZvaWQge1xuICAgICAgICBpZiAoIXBhcmVudCB8fCAhaXNWYWxpZChwYXJlbnQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaG93bkF0ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgdGhpcy5lbnN1cmVNYXNrKCk7XG4gICAgICAgIHRoaXMubGF5b3V0KCk7XG4gICAgICAgIHRoaXMucm9vdC5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICB0aGlzLnJvb3Qub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgaWYgKHRoaXMucm9vdC5wYXJlbnQgIT09IHBhcmVudCkge1xuICAgICAgICAgICAgdGhpcy5yb290LnJlbW92ZUZyb21QYXJlbnQoZmFsc2UpO1xuICAgICAgICAgICAgcGFyZW50LmFkZENoaWxkKHRoaXMucm9vdCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb290LmFjdGl2ZSA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqIOeql+WPo+WPmOWMluaXtuS4jiBiZyDkuIDotbfph43mlrDpk7rmu6EgKi9cbiAgICBsYXlvdXQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLm1hc2tOb2RlICYmIGlzVmFsaWQodGhpcy5tYXNrTm9kZSkpIHtcbiAgICAgICAgICAgIGxheW91dFNob3dBbGxDb3Zlcih0aGlzLm1hc2tOb2RlLCB0aGlzLmNhbnZhcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoaWRlKG9uRG9uZT86ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZWxhcHNlZCA9IChEYXRlLm5vdygpIC0gdGhpcy5zaG93bkF0KSAvIDEwMDA7XG4gICAgICAgIGNvbnN0IHdhaXQgPSBNYXRoLm1heCgwLCBMT0FESU5HX01JTl9WSVNJQkxFX1NFQyAtIGVsYXBzZWQpO1xuICAgICAgICB0aGlzLnJvb3Quc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgdGhpcy5yb290LnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShcbiAgICAgICAgICAgIGNjLmRlbGF5VGltZSh3YWl0KSxcbiAgICAgICAgICAgIGNjLmZhZGVPdXQoTE9BRElOR19GQURFX09VVCksXG4gICAgICAgICAgICBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucm9vdCAmJiBpc1ZhbGlkKHRoaXMucm9vdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290LmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3Qub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG9uRG9uZSkge1xuICAgICAgICAgICAgICAgICAgICBvbkRvbmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICApKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGVuc3VyZU1hc2soKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLm1hc2tOb2RlICYmIGlzVmFsaWQodGhpcy5tYXNrTm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBiZyA9IHRoaXMuY2FudmFzLmdldENoaWxkQnlOYW1lKCdiZycpO1xuICAgICAgICBpZiAoIWJnIHx8ICFpc1ZhbGlkKGJnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJnU3ByaXRlID0gYmcuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgIGlmICghYmdTcHJpdGUgfHwgIWJnU3ByaXRlLnNwcml0ZUZyYW1lKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1hc2tOb2RlID0gbmV3IGNjLk5vZGUoJ0xvYWRpbmdNYXNrJyk7XG4gICAgICAgIHRoaXMubWFza05vZGUuc2V0QW5jaG9yUG9pbnQoMC41LCAwLjUpO1xuICAgICAgICBjb25zdCBtYXNrU3ByaXRlID0gdGhpcy5tYXNrTm9kZS5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgbWFza1Nwcml0ZS5zcHJpdGVGcmFtZSA9IGJnU3ByaXRlLnNwcml0ZUZyYW1lO1xuICAgICAgICBtYXNrU3ByaXRlLnNpemVNb2RlID0gYmdTcHJpdGUuc2l6ZU1vZGU7XG4gICAgICAgIG1hc2tTcHJpdGUudHlwZSA9IGJnU3ByaXRlLnR5cGU7XG4gICAgICAgIHRoaXMucm9vdC5hZGRDaGlsZCh0aGlzLm1hc2tOb2RlKTtcbiAgICAgICAgdGhpcy5tYXNrTm9kZS5zZXRTaWJsaW5nSW5kZXgoMCk7XG4gICAgfVxufVxuIl19