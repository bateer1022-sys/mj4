"use strict";
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