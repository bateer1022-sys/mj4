
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/core/HintSolver.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '2046atHSuRB64A5K6o/ylze', 'HintSolver');
// script/core/HintSolver.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectRemainingMatchPairs = exports.findHint = void 0;
var is_valid_1 = require("../is-valid");
var MatchRule_1 = require("./MatchRule");
function findHint(board) {
    var freeTiles = [];
    for (var i = 0; i < board.length; i++) {
        if (!board[i].removed && board[i].free)
            freeTiles.push(board[i]);
    }
    for (var i = 0; i < freeTiles.length; i++) {
        for (var j = i + 1; j < freeTiles.length; j++) {
            if (MatchRule_1.canMatch(freeTiles[i], freeTiles[j])) {
                return { a: freeTiles[i], b: freeTiles[j] };
            }
        }
    }
    return null;
}
exports.findHint = findHint;
/** 结算前扫尾：在剩余牌中贪心配对（不要求 free，用于快速自动消除） */
function collectRemainingMatchPairs(board) {
    var active = [];
    for (var i = 0; i < board.length; i++) {
        var t = board[i];
        if (!t.removed && t.node && is_valid_1.isValid(t.node)) {
            active.push(t);
        }
    }
    var used = new Set();
    var pairs = [];
    for (var i = 0; i < active.length; i++) {
        var a = active[i];
        if (used.has(a.id)) {
            continue;
        }
        for (var j = i + 1; j < active.length; j++) {
            var b = active[j];
            if (used.has(b.id)) {
                continue;
            }
            if (MatchRule_1.canMatch(a, b)) {
                pairs.push({ a: a, b: b });
                used.add(a.id);
                used.add(b.id);
                break;
            }
        }
    }
    return pairs;
}
exports.collectRemainingMatchPairs = collectRemainingMatchPairs;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvY29yZS9IaW50U29sdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHdDQUFzQztBQUV0Qyx5Q0FBdUM7QUFPdkMsU0FBZ0IsUUFBUSxDQUFDLEtBQWtCO0lBQ3ZDLElBQU0sU0FBUyxHQUFnQixFQUFFLENBQUM7SUFDbEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDbkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7WUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3BFO0lBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNDLElBQUksb0JBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3RDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQzthQUMvQztTQUNKO0tBQ0o7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDO0FBYkQsNEJBYUM7QUFFRCx5Q0FBeUM7QUFDekMsU0FBZ0IsMEJBQTBCLENBQUMsS0FBa0I7SUFDekQsSUFBTSxNQUFNLEdBQWdCLEVBQUUsQ0FBQztJQUMvQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNuQyxJQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxrQkFBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN6QyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xCO0tBQ0o7SUFDRCxJQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO0lBQy9CLElBQU0sS0FBSyxHQUFlLEVBQUUsQ0FBQztJQUM3QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNwQyxJQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNoQixTQUFTO1NBQ1o7UUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDeEMsSUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQ2hCLFNBQVM7YUFDWjtZQUNELElBQUksb0JBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2hCLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUEsRUFBRSxDQUFDLEdBQUEsRUFBRSxDQUFDLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNmLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNmLE1BQU07YUFDVDtTQUNKO0tBQ0o7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBN0JELGdFQTZCQyIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzVmFsaWQgfSBmcm9tICcuLi9pcy12YWxpZCc7XG5pbXBvcnQgeyBUaWxlTW9kZWwgfSBmcm9tICcuLi9tb2RlbC9UaWxlTW9kZWwnO1xuaW1wb3J0IHsgY2FuTWF0Y2ggfSBmcm9tICcuL01hdGNoUnVsZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSGludFBhaXIge1xuICAgIGE6IFRpbGVNb2RlbDtcbiAgICBiOiBUaWxlTW9kZWw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kSGludChib2FyZDogVGlsZU1vZGVsW10pOiBIaW50UGFpciB8IG51bGwge1xuICAgIGNvbnN0IGZyZWVUaWxlczogVGlsZU1vZGVsW10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghYm9hcmRbaV0ucmVtb3ZlZCAmJiBib2FyZFtpXS5mcmVlKSBmcmVlVGlsZXMucHVzaChib2FyZFtpXSk7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJlZVRpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IGZyZWVUaWxlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKGNhbk1hdGNoKGZyZWVUaWxlc1tpXSwgZnJlZVRpbGVzW2pdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGE6IGZyZWVUaWxlc1tpXSwgYjogZnJlZVRpbGVzW2pdIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbi8qKiDnu5PnrpfliY3miavlsL7vvJrlnKjliankvZnniYzkuK3otKrlv4PphY3lr7nvvIjkuI3opoHmsYIgZnJlZe+8jOeUqOS6juW/q+mAn+iHquWKqOa2iOmZpO+8iSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbGxlY3RSZW1haW5pbmdNYXRjaFBhaXJzKGJvYXJkOiBUaWxlTW9kZWxbXSk6IEhpbnRQYWlyW10ge1xuICAgIGNvbnN0IGFjdGl2ZTogVGlsZU1vZGVsW10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHQgPSBib2FyZFtpXTtcbiAgICAgICAgaWYgKCF0LnJlbW92ZWQgJiYgdC5ub2RlICYmIGlzVmFsaWQodC5ub2RlKSkge1xuICAgICAgICAgICAgYWN0aXZlLnB1c2godCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgdXNlZCA9IG5ldyBTZXQ8bnVtYmVyPigpO1xuICAgIGNvbnN0IHBhaXJzOiBIaW50UGFpcltdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhY3RpdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgYSA9IGFjdGl2ZVtpXTtcbiAgICAgICAgaWYgKHVzZWQuaGFzKGEuaWQpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCBhY3RpdmUubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGIgPSBhY3RpdmVbal07XG4gICAgICAgICAgICBpZiAodXNlZC5oYXMoYi5pZCkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjYW5NYXRjaChhLCBiKSkge1xuICAgICAgICAgICAgICAgIHBhaXJzLnB1c2goeyBhLCBiIH0pO1xuICAgICAgICAgICAgICAgIHVzZWQuYWRkKGEuaWQpO1xuICAgICAgICAgICAgICAgIHVzZWQuYWRkKGIuaWQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYWlycztcbn1cbiJdfQ==