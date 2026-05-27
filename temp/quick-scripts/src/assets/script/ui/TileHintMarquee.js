"use strict";
cc._RF.push(module, 'a649ehPextClLQG7sQF8lUa', 'TileHintMarquee');
// script/ui/TileHintMarquee.ts

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
exports.HINT_MARQUEE_STYLE = exports.tileFaceBoundsFromTrim = exports.MJ_TILE_FACE_TRIM = void 0;
var is_valid_1 = require("../is-valid");
var ccclass = cc._decorator.ccclass;
exports.MJ_TILE_FACE_TRIM = {
    left: 5,
    right: 10,
    top: 5,
    bottom: 15,
};
/** 由牌面尺寸与四边裁切算出跑马灯边界（中心锚点坐标系） */
function tileFaceBoundsFromTrim(faceWidth, faceHeight, scaleX, scaleY, trim) {
    if (trim === void 0) { trim = exports.MJ_TILE_FACE_TRIM; }
    var halfW = faceWidth * scaleX * 0.5;
    var halfH = faceHeight * scaleY * 0.5;
    return {
        left: -halfW + trim.left * scaleX,
        right: halfW - trim.right * scaleX,
        bottom: -halfH + trim.bottom * scaleY,
        top: halfH - trim.top * scaleY,
    };
}
exports.tileFaceBoundsFromTrim = tileFaceBoundsFromTrim;
/** 跑马灯颜色与线宽（按需调整） */
exports.HINT_MARQUEE_STYLE = {
    trackColor: { r: 255, g: 180, b: 0, a: 255 },
    glowColor: { r: 255, g: 90, b: 0, a: 220 },
    brightOuterColor: { r: 255, g: 255, b: 255, a: 255 },
    brightCoreColor: { r: 0, g: 255, b: 220, a: 255 },
    trackLineWidth: 5,
    glowLineWidth: 12,
    brightOuterLineWidth: 14,
    brightCoreLineWidth: 7,
    speed: 1.05,
    segmentFrac: 0.34,
};
/** 沿圆角麻将牌面可见区域外缘的跑马灯描边（空闲提示） */
var TileHintMarquee = /** @class */ (function (_super) {
    __extends(TileHintMarquee, _super);
    function TileHintMarquee() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.graphics = null;
        _this.left = -80;
        _this.right = 80;
        _this.bottom = -100;
        _this.top = 100;
        _this.cornerR = 18;
        _this.phase = 0;
        _this.pulse = 0;
        _this.speed = exports.HINT_MARQUEE_STYLE.speed;
        _this.segmentFrac = exports.HINT_MARQUEE_STYLE.segmentFrac;
        _this.trackColor = cc.color(exports.HINT_MARQUEE_STYLE.trackColor.r, exports.HINT_MARQUEE_STYLE.trackColor.g, exports.HINT_MARQUEE_STYLE.trackColor.b, exports.HINT_MARQUEE_STYLE.trackColor.a);
        _this.brightOuterColor = cc.color(exports.HINT_MARQUEE_STYLE.brightOuterColor.r, exports.HINT_MARQUEE_STYLE.brightOuterColor.g, exports.HINT_MARQUEE_STYLE.brightOuterColor.b, exports.HINT_MARQUEE_STYLE.brightOuterColor.a);
        _this.brightCoreColor = cc.color(exports.HINT_MARQUEE_STYLE.brightCoreColor.r, exports.HINT_MARQUEE_STYLE.brightCoreColor.g, exports.HINT_MARQUEE_STYLE.brightCoreColor.b, exports.HINT_MARQUEE_STYLE.brightCoreColor.a);
        _this.glowColor = cc.color(exports.HINT_MARQUEE_STYLE.glowColor.r, exports.HINT_MARQUEE_STYLE.glowColor.g, exports.HINT_MARQUEE_STYLE.glowColor.b, exports.HINT_MARQUEE_STYLE.glowColor.a);
        _this.trackLineWidth = exports.HINT_MARQUEE_STYLE.trackLineWidth;
        _this.brightOuterLineWidth = exports.HINT_MARQUEE_STYLE.brightOuterLineWidth;
        _this.brightCoreLineWidth = exports.HINT_MARQUEE_STYLE.brightCoreLineWidth;
        _this.glowLineWidth = exports.HINT_MARQUEE_STYLE.glowLineWidth;
        return _this;
    }
    /**
     * 按牌面可见矩形设置（中心锚点坐标系）。
     * @param left right bottom top 相对牌面节点中心的边界
     */
    TileHintMarquee.prototype.setupRect = function (left, right, bottom, top, inset, cornerRadius) {
        if (inset === void 0) { inset = 2; }
        this.left = left + inset;
        this.right = right - inset;
        this.bottom = bottom + inset;
        this.top = top - inset;
        var w = Math.max(8, (this.right - this.left) * 0.5);
        var h = Math.max(8, (this.top - this.bottom) * 0.5);
        this.cornerR = cornerRadius !== undefined
            ? cornerRadius
            : Math.min(w, h) * 0.22;
        this.cornerR = Math.min(this.cornerR, w * 0.45, h * 0.45);
        this.graphics = this.getComponent(cc.Graphics) || this.addComponent(cc.Graphics);
        this.phase = 0;
        this.pulse = 0;
        this.redraw();
    };
    TileHintMarquee.prototype.update = function (dt) {
        if (!this.graphics || !is_valid_1.isValid(this.graphics)) {
            return;
        }
        this.phase = (this.phase + dt * this.speed) % 1;
        this.pulse = (this.pulse + dt * 4.5) % (Math.PI * 2);
        this.redraw();
    };
    TileHintMarquee.prototype.redraw = function () {
        var g = this.graphics;
        var r = this.cornerR;
        g.clear();
        var pulseA = 0.82 + 0.18 * Math.sin(this.pulse);
        g.lineWidth = this.glowLineWidth;
        g.strokeColor = cc.color(this.glowColor.r, this.glowColor.g, this.glowColor.b, Math.min(255, Math.floor(this.glowColor.a * pulseA)));
        this.strokeRoundRect(g, r + 3);
        g.lineWidth = this.trackLineWidth;
        g.strokeColor = this.trackColor;
        this.strokeRoundRect(g, r);
        g.lineWidth = this.brightOuterLineWidth;
        g.strokeColor = this.brightOuterColor;
        this.strokeSegment(g, r, this.phase, this.segmentFrac);
        g.lineWidth = this.brightCoreLineWidth;
        g.strokeColor = this.brightCoreColor;
        this.strokeSegment(g, r, this.phase, this.segmentFrac);
    };
    TileHintMarquee.prototype.clampRadius = function (r) {
        var w = this.right - this.left;
        var h = this.top - this.bottom;
        return Math.min(Math.max(4, r), w * 0.45, h * 0.45);
    };
    TileHintMarquee.prototype.strokeRoundRect = function (g, r) {
        var radius = this.clampRadius(r);
        var w = this.right - this.left;
        var h = this.top - this.bottom;
        g.roundRect(this.left, this.bottom, w, h, radius);
        g.stroke();
    };
    TileHintMarquee.prototype.perimeter = function (r) {
        var radius = this.clampRadius(r);
        var w = this.right - this.left;
        var h = this.top - this.bottom;
        var straight = 2 * (w - 2 * radius) + 2 * (h - 2 * radius);
        var arcs = Math.PI * 2 * radius;
        return straight + arcs;
    };
    /** 圆角矩形路径采样（顺时针，从顶边左端开始） */
    TileHintMarquee.prototype.pointOnRoundRect = function (t, r) {
        var radius = this.clampRadius(r);
        var L = this.left;
        var R = this.right;
        var B = this.bottom;
        var T = this.top;
        var topLen = (R - L) - 2 * radius;
        var sideLen = (T - B) - 2 * radius;
        var arcLen = Math.PI * 0.5 * radius;
        var total = this.perimeter(r);
        var d = (t % 1) * total;
        if (d < topLen) {
            return cc.v2(L + radius + d, T);
        }
        d -= topLen;
        if (d < arcLen) {
            var ang_1 = Math.PI * 0.5 - (d / arcLen) * (Math.PI * 0.5);
            return cc.v2((R - radius) + Math.cos(ang_1) * radius, (T - radius) + Math.sin(ang_1) * radius);
        }
        d -= arcLen;
        if (d < sideLen) {
            return cc.v2(R, T - radius - d);
        }
        d -= sideLen;
        if (d < arcLen) {
            var ang_2 = 0 - (d / arcLen) * (Math.PI * 0.5);
            return cc.v2((R - radius) + Math.cos(ang_2) * radius, (B + radius) + Math.sin(ang_2) * radius);
        }
        d -= arcLen;
        if (d < topLen) {
            return cc.v2(R - radius - d, B);
        }
        d -= topLen;
        if (d < arcLen) {
            var ang_3 = -Math.PI * 0.5 - (d / arcLen) * (Math.PI * 0.5);
            return cc.v2((L + radius) + Math.cos(ang_3) * radius, (B + radius) + Math.sin(ang_3) * radius);
        }
        d -= arcLen;
        if (d < sideLen) {
            return cc.v2(L, B + radius + d);
        }
        d -= sideLen;
        var ang = Math.PI - (d / arcLen) * (Math.PI * 0.5);
        return cc.v2((L + radius) + Math.cos(ang) * radius, (T - radius) + Math.sin(ang) * radius);
    };
    TileHintMarquee.prototype.strokeSegment = function (g, r, startT, lenFrac) {
        var steps = 36;
        for (var i = 0; i <= steps; i++) {
            var t = (startT + lenFrac * (i / steps)) % 1;
            var p = this.pointOnRoundRect(t, r);
            if (i === 0) {
                g.moveTo(p.x, p.y);
            }
            else {
                g.lineTo(p.x, p.y);
            }
        }
        g.stroke();
    };
    TileHintMarquee = __decorate([
        ccclass
    ], TileHintMarquee);
    return TileHintMarquee;
}(cc.Component));
exports.default = TileHintMarquee;

cc._RF.pop();