
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/ui/ShowAllLayout.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvdWkvU2hvd0FsbExheW91dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx3Q0FBc0M7QUFFdEMsa0RBQWtEO0FBQ2xELFNBQWdCLGtCQUFrQixDQUFDLElBQWEsRUFBRSxNQUFlO0lBQzdELElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxrQkFBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsa0JBQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUN4RCxPQUFPO0tBQ1Y7SUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN2QixJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUM1QixFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxFQUM1QyxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUNqRCxDQUFDO0lBQ0YsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxlQUFlLENBQUM7SUFDL0MsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUM7SUFDakQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUNqQixFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLEtBQUssR0FBRyxTQUFTLEVBQ3pDLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FDOUMsQ0FBQztBQUNOLENBQUM7QUFmRCxnREFlQyIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzVmFsaWQgfSBmcm9tICcuLi9pcy12YWxpZCc7XG5cbi8qKiDkuI4gQ2FudmFzIOS4iiBiZyDnm7jlkIzvvJrmjIkgU0hPV19BTEwg562W55WlIGNvdmVyIOmTuua7oeWPr+inhuWMuuWfnyAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxheW91dFNob3dBbGxDb3Zlcihub2RlOiBjYy5Ob2RlLCBjYW52YXM6IGNjLk5vZGUpOiB2b2lkIHtcbiAgICBpZiAoIW5vZGUgfHwgIWlzVmFsaWQobm9kZSkgfHwgIWNhbnZhcyB8fCAhaXNWYWxpZChjYW52YXMpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbm9kZS5zZXRQb3NpdGlvbigwLCAwKTtcbiAgICBjb25zdCBzY2FsZUZvclNob3dBbGwgPSBNYXRoLm1pbihcbiAgICAgICAgY2Mudmlldy5nZXRDYW52YXNTaXplKCkud2lkdGggLyBjYW52YXMud2lkdGgsXG4gICAgICAgIGNjLnZpZXcuZ2V0Q2FudmFzU2l6ZSgpLmhlaWdodCAvIGNhbnZhcy5oZWlnaHRcbiAgICApO1xuICAgIGNvbnN0IHJlYWxXaWR0aCA9IG5vZGUud2lkdGggKiBzY2FsZUZvclNob3dBbGw7XG4gICAgY29uc3QgcmVhbEhlaWdodCA9IG5vZGUuaGVpZ2h0ICogc2NhbGVGb3JTaG93QWxsO1xuICAgIG5vZGUuc2NhbGUgPSBNYXRoLm1heChcbiAgICAgICAgY2Mudmlldy5nZXRDYW52YXNTaXplKCkud2lkdGggLyByZWFsV2lkdGgsXG4gICAgICAgIGNjLnZpZXcuZ2V0Q2FudmFzU2l6ZSgpLmhlaWdodCAvIHJlYWxIZWlnaHRcbiAgICApO1xufVxuIl19