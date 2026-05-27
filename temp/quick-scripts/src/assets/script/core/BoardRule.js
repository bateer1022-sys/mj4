"use strict";
cc._RF.push(module, '4d311k7/upBqramajkt9VxE', 'BoardRule');
// script/core/BoardRule.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTileStates = exports.isFullyExposed = exports.isFree = exports.getCoveringTiles = exports.isBothSidesBlocked = exports.getSideNeighbor = exports.hasSideBlock = exports.isCovered = exports.isCoveredByNodes = exports.isCoveredByPosition = exports.tilesOverlap = void 0;
var is_valid_1 = require("../is-valid");
function rectsOverlap(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
/** 仅不同层之间才算上下遮挡（同层绝不重叠） */
function tilesOverlap(a, b, cfg) {
    if (a.id === b.id || a.layer === b.layer)
        return false;
    var dx = Math.abs(a.x - b.x);
    var dy = Math.abs(a.y - b.y);
    var ox = cfg.overlapX > 0 ? cfg.overlapX : cfg.tileW * 0.5;
    var oy = cfg.overlapY > 0 ? cfg.overlapY : cfg.tileH * 0.5;
    return dx < ox && dy < oy;
}
exports.tilesOverlap = tilesOverlap;
/** 关卡求解等无节点时：按布局坐标判断上层是否重合 */
function isCoveredByPosition(tile, board, cfg) {
    for (var i = 0; i < board.length; i++) {
        var other = board[i];
        if (other.removed || other.id === tile.id)
            continue;
        if (other.layer <= tile.layer)
            continue;
        if (tilesOverlap(tile, other, cfg))
            return true;
    }
    return false;
}
exports.isCoveredByPosition = isCoveredByPosition;
/** 有节点时：按世界坐标包围盒判断上层是否与该牌有面积重叠 */
function isCoveredByNodes(tile, board) {
    if (!tile.node || !is_valid_1.isValid(tile.node))
        return false;
    var box = tile.node.getBoundingBoxToWorld();
    for (var i = 0; i < board.length; i++) {
        var other = board[i];
        if (other.removed || other.id === tile.id)
            continue;
        if (other.layer <= tile.layer)
            continue;
        if (!other.node || !is_valid_1.isValid(other.node))
            continue;
        var otherBox = other.node.getBoundingBoxToWorld();
        if (rectsOverlap(box, otherBox))
            return true;
    }
    return false;
}
exports.isCoveredByNodes = isCoveredByNodes;
/** 运行时用坐标判定遮挡，避免 48 张牌反复 getBoundingBoxToWorld 卡死 */
function isCovered(tile, board, cfg) {
    if (tile.removed)
        return false;
    return isCoveredByPosition(tile, board, cfg);
}
exports.isCovered = isCovered;
/** 同一行：纵向偏差小于半张牌高 */
function isSameRow(a, b, cfg) {
    return Math.abs(a.y - b.y) < cfg.tileH * 0.35;
}
function isHorizontalNeighbor(tile, other, cfg) {
    if (tile.layer !== other.layer)
        return false;
    if (!isSameRow(tile, other, cfg))
        return false;
    var dx = Math.abs(tile.x - other.x);
    var minGap = cfg.tileW * 0.85;
    var maxGap = cfg.tileW * 1.15;
    return dx >= minGap && dx <= maxGap;
}
function hasSideBlock(tile, board, side, cfg) {
    return getSideNeighbor(tile, board, side, cfg) !== null;
}
exports.hasSideBlock = hasSideBlock;
/** 同层左右紧邻挡牌（取距离最近的一张） */
function getSideNeighbor(tile, board, side, cfg) {
    var best = null;
    var bestDx = Infinity;
    for (var i = 0; i < board.length; i++) {
        var other = board[i];
        if (other.removed || other.id === tile.id)
            continue;
        if (!isHorizontalNeighbor(tile, other, cfg))
            continue;
        if (side === 'left' && other.x >= tile.x)
            continue;
        if (side === 'right' && other.x <= tile.x)
            continue;
        var dx = Math.abs(other.x - tile.x);
        if (dx < bestDx) {
            bestDx = dx;
            best = other;
        }
    }
    return best;
}
exports.getSideNeighbor = getSideNeighbor;
function isBothSidesBlocked(tile, board, cfg) {
    return (getSideNeighbor(tile, board, 'left', cfg) !== null &&
        getSideNeighbor(tile, board, 'right', cfg) !== null);
}
exports.isBothSidesBlocked = isBothSidesBlocked;
/** 压在该牌上的所有上层牌 */
function getCoveringTiles(tile, board, cfg) {
    var list = [];
    for (var i = 0; i < board.length; i++) {
        var other = board[i];
        if (other.removed || other.id === tile.id)
            continue;
        if (other.layer <= tile.layer)
            continue;
        if (tilesOverlap(tile, other, cfg))
            list.push(other);
    }
    return list;
}
exports.getCoveringTiles = getCoveringTiles;
function isFree(tile, board, cfg) {
    if (tile.removed)
        return false;
    if (isCovered(tile, board, cfg))
        return false;
    var leftBlocked = hasSideBlock(tile, board, 'left', cfg);
    var rightBlocked = hasSideBlock(tile, board, 'right', cfg);
    return !leftBlocked || !rightBlocked;
}
exports.isFree = isFree;
function isFullyExposed(tile, board, cfg) {
    if (tile.removed)
        return false;
    if (isCovered(tile, board, cfg))
        return false;
    if (hasSideBlock(tile, board, 'left', cfg))
        return false;
    if (hasSideBlock(tile, board, 'right', cfg))
        return false;
    return true;
}
exports.isFullyExposed = isFullyExposed;
function refreshTileStates(board, cfg) {
    for (var i = 0; i < board.length; i++) {
        var tile = board[i];
        if (tile.removed) {
            tile.covered = false;
            tile.free = false;
            continue;
        }
        tile.covered = isCovered(tile, board, cfg);
        tile.free = isFree(tile, board, cfg);
    }
}
exports.refreshTileStates = refreshTileStates;

cc._RF.pop();