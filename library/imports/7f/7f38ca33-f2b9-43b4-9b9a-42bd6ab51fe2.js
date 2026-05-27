"use strict";
cc._RF.push(module, '7f38coz8rlDtJuaQr1qtR/i', 'ShowAllLayout');
// script/ui/ShowAllLayout.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.layoutShowAllCover = void 0;
var is_valid_1 = require("../is-valid");
/** 与 Canvas 上 bg 相同：按 SHOW_ALL 策略 cover 铺满可视区域 */
function layoutShowAllCover(node, canvas) {
    if (!node || !is_valid_1.isValid(node) || !canvas || !is_valid_1.isValid(canvas)) {
        return;
    }
    node.setPosition(0, 0);
    var scaleForShowAll = Math.min(cc.view.getCanvasSize().width / canvas.width, cc.view.getCanvasSize().height / canvas.height);
    var realWidth = node.width * scaleForShowAll;
    var realHeight = node.height * scaleForShowAll;
    node.scale = Math.max(cc.view.getCanvasSize().width / realWidth, cc.view.getCanvasSize().height / realHeight);
}
exports.layoutShowAllCover = layoutShowAllCover;

cc._RF.pop();