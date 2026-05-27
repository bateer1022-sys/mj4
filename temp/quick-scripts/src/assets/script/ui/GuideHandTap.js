"use strict";
cc._RF.push(module, 'b8f3cIaTl1KiZwSfW6PChss', 'GuideHandTap');
// script/ui/GuideHandTap.ts

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
/**
 * 已废弃：引导小手点击动画在 BoardManager 内实现。
 * 保留空组件仅为避免旧编译缓存 require 报错。
 */
var ccclass = cc._decorator.ccclass;
var GuideHandTap = /** @class */ (function (_super) {
    __extends(GuideHandTap, _super);
    function GuideHandTap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GuideHandTap = __decorate([
        ccclass
    ], GuideHandTap);
    return GuideHandTap;
}(cc.Component));
exports.default = GuideHandTap;

cc._RF.pop();