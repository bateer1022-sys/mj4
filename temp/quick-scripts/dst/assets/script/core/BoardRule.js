
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/core/BoardRule.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvY29yZS9Cb2FyZFJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsd0NBQXNDO0FBSXRDLFNBQVMsWUFBWSxDQUFDLENBQVUsRUFBRSxDQUFVO0lBQ3hDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLO1FBQ3RCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNuQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU07UUFDcEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsQ0FBQztBQUVELDJCQUEyQjtBQUMzQixTQUFnQixZQUFZLENBQUMsQ0FBWSxFQUFFLENBQVksRUFBRSxHQUFnQjtJQUNyRSxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxLQUFLO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFDdkQsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CLElBQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztJQUM3RCxJQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7SUFDN0QsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDOUIsQ0FBQztBQVBELG9DQU9DO0FBRUQsOEJBQThCO0FBQzlCLFNBQWdCLG1CQUFtQixDQUFDLElBQWUsRUFBRSxLQUFrQixFQUFFLEdBQWdCO0lBQ3JGLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ25DLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsRUFBRTtZQUFFLFNBQVM7UUFDcEQsSUFBSSxLQUFLLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLO1lBQUUsU0FBUztRQUN4QyxJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQztZQUFFLE9BQU8sSUFBSSxDQUFDO0tBQ25EO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQztBQVJELGtEQVFDO0FBRUQsa0NBQWtDO0FBQ2xDLFNBQWdCLGdCQUFnQixDQUFDLElBQWUsRUFBRSxLQUFrQjtJQUNoRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLGtCQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUFFLE9BQU8sS0FBSyxDQUFDO0lBQ3BELElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUM5QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNuQyxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsSUFBSSxLQUFLLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUU7WUFBRSxTQUFTO1FBQ3BELElBQUksS0FBSyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSztZQUFFLFNBQVM7UUFDeEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxrQkFBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFBRSxTQUFTO1FBQ2xELElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUNwRCxJQUFJLFlBQVksQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUM7S0FDaEQ7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBWkQsNENBWUM7QUFFRCxxREFBcUQ7QUFDckQsU0FBZ0IsU0FBUyxDQUFDLElBQWUsRUFBRSxLQUFrQixFQUFFLEdBQWdCO0lBQzNFLElBQUksSUFBSSxDQUFDLE9BQU87UUFBRSxPQUFPLEtBQUssQ0FBQztJQUMvQixPQUFPLG1CQUFtQixDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDakQsQ0FBQztBQUhELDhCQUdDO0FBRUQscUJBQXFCO0FBQ3JCLFNBQVMsU0FBUyxDQUFDLENBQVksRUFBRSxDQUFZLEVBQUUsR0FBZ0I7SUFDM0QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xELENBQUM7QUFFRCxTQUFTLG9CQUFvQixDQUFDLElBQWUsRUFBRSxLQUFnQixFQUFFLEdBQWdCO0lBQzdFLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsS0FBSztRQUFFLE9BQU8sS0FBSyxDQUFDO0lBQzdDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUMvQyxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RDLElBQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ2hDLElBQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ2hDLE9BQU8sRUFBRSxJQUFJLE1BQU0sSUFBSSxFQUFFLElBQUksTUFBTSxDQUFDO0FBQ3hDLENBQUM7QUFFRCxTQUFnQixZQUFZLENBQUMsSUFBZSxFQUFFLEtBQWtCLEVBQUUsSUFBc0IsRUFBRSxHQUFnQjtJQUN0RyxPQUFPLGVBQWUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUM7QUFDNUQsQ0FBQztBQUZELG9DQUVDO0FBRUQseUJBQXlCO0FBQ3pCLFNBQWdCLGVBQWUsQ0FDM0IsSUFBZSxFQUNmLEtBQWtCLEVBQ2xCLElBQXNCLEVBQ3RCLEdBQWdCO0lBRWhCLElBQUksSUFBSSxHQUFjLElBQUksQ0FBQztJQUMzQixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUM7SUFDdEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDbkMsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFO1lBQUUsU0FBUztRQUNwRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUM7WUFBRSxTQUFTO1FBQ3RELElBQUksSUFBSSxLQUFLLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQUUsU0FBUztRQUNuRCxJQUFJLElBQUksS0FBSyxPQUFPLElBQUksS0FBSyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQztZQUFFLFNBQVM7UUFDcEQsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxJQUFJLEVBQUUsR0FBRyxNQUFNLEVBQUU7WUFDYixNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ1osSUFBSSxHQUFHLEtBQUssQ0FBQztTQUNoQjtLQUNKO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQztBQXJCRCwwQ0FxQkM7QUFFRCxTQUFnQixrQkFBa0IsQ0FBQyxJQUFlLEVBQUUsS0FBa0IsRUFBRSxHQUFnQjtJQUNwRixPQUFPLENBQ0gsZUFBZSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxLQUFLLElBQUk7UUFDbEQsZUFBZSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FDdEQsQ0FBQztBQUNOLENBQUM7QUFMRCxnREFLQztBQUVELGtCQUFrQjtBQUNsQixTQUFnQixnQkFBZ0IsQ0FBQyxJQUFlLEVBQUUsS0FBa0IsRUFBRSxHQUFnQjtJQUNsRixJQUFNLElBQUksR0FBZ0IsRUFBRSxDQUFDO0lBQzdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ25DLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsRUFBRTtZQUFFLFNBQVM7UUFDcEQsSUFBSSxLQUFLLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLO1lBQUUsU0FBUztRQUN4QyxJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQztZQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDeEQ7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDO0FBVEQsNENBU0M7QUFFRCxTQUFnQixNQUFNLENBQUMsSUFBZSxFQUFFLEtBQWtCLEVBQUUsR0FBZ0I7SUFDeEUsSUFBSSxJQUFJLENBQUMsT0FBTztRQUFFLE9BQU8sS0FBSyxDQUFDO0lBQy9CLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFDOUMsSUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzNELElBQU0sWUFBWSxHQUFHLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM3RCxPQUFPLENBQUMsV0FBVyxJQUFJLENBQUMsWUFBWSxDQUFDO0FBQ3pDLENBQUM7QUFORCx3QkFNQztBQUVELFNBQWdCLGNBQWMsQ0FBQyxJQUFlLEVBQUUsS0FBa0IsRUFBRSxHQUFnQjtJQUNoRixJQUFJLElBQUksQ0FBQyxPQUFPO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFDL0IsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUM5QyxJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUN6RCxJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUMxRCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDO0FBTkQsd0NBTUM7QUFFRCxTQUFnQixpQkFBaUIsQ0FBQyxLQUFrQixFQUFFLEdBQWdCO0lBQ2xFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ25DLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDZCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztZQUNsQixTQUFTO1NBQ1o7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDeEM7QUFDTCxDQUFDO0FBWEQsOENBV0MiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc1ZhbGlkIH0gZnJvbSAnLi4vaXMtdmFsaWQnO1xuaW1wb3J0IHsgVGlsZU1vZGVsIH0gZnJvbSAnLi4vbW9kZWwvVGlsZU1vZGVsJztcbmltcG9ydCB7IExldmVsQ29uZmlnIH0gZnJvbSAnLi4vbW9kZWwvTGV2ZWxDb25maWcnO1xuXG5mdW5jdGlvbiByZWN0c092ZXJsYXAoYTogY2MuUmVjdCwgYjogY2MuUmVjdCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBhLnggPCBiLnggKyBiLndpZHRoICYmXG4gICAgICAgIGEueCArIGEud2lkdGggPiBiLnggJiZcbiAgICAgICAgYS55IDwgYi55ICsgYi5oZWlnaHQgJiZcbiAgICAgICAgYS55ICsgYS5oZWlnaHQgPiBiLnk7XG59XG5cbi8qKiDku4XkuI3lkIzlsYLkuYvpl7TmiY3nrpfkuIrkuIvpga7mjKHvvIjlkIzlsYLnu53kuI3ph43lj6DvvIkgKi9cbmV4cG9ydCBmdW5jdGlvbiB0aWxlc092ZXJsYXAoYTogVGlsZU1vZGVsLCBiOiBUaWxlTW9kZWwsIGNmZzogTGV2ZWxDb25maWcpOiBib29sZWFuIHtcbiAgICBpZiAoYS5pZCA9PT0gYi5pZCB8fCBhLmxheWVyID09PSBiLmxheWVyKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgZHggPSBNYXRoLmFicyhhLnggLSBiLngpO1xuICAgIGNvbnN0IGR5ID0gTWF0aC5hYnMoYS55IC0gYi55KTtcbiAgICBjb25zdCBveCA9IGNmZy5vdmVybGFwWCA+IDAgPyBjZmcub3ZlcmxhcFggOiBjZmcudGlsZVcgKiAwLjU7XG4gICAgY29uc3Qgb3kgPSBjZmcub3ZlcmxhcFkgPiAwID8gY2ZnLm92ZXJsYXBZIDogY2ZnLnRpbGVIICogMC41O1xuICAgIHJldHVybiBkeCA8IG94ICYmIGR5IDwgb3k7XG59XG5cbi8qKiDlhbPljaHmsYLop6PnrYnml6DoioLngrnml7bvvJrmjInluIPlsYDlnZDmoIfliKTmlq3kuIrlsYLmmK/lkKbph43lkIggKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0NvdmVyZWRCeVBvc2l0aW9uKHRpbGU6IFRpbGVNb2RlbCwgYm9hcmQ6IFRpbGVNb2RlbFtdLCBjZmc6IExldmVsQ29uZmlnKTogYm9vbGVhbiB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBib2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBvdGhlciA9IGJvYXJkW2ldO1xuICAgICAgICBpZiAob3RoZXIucmVtb3ZlZCB8fCBvdGhlci5pZCA9PT0gdGlsZS5pZCkgY29udGludWU7XG4gICAgICAgIGlmIChvdGhlci5sYXllciA8PSB0aWxlLmxheWVyKSBjb250aW51ZTtcbiAgICAgICAgaWYgKHRpbGVzT3ZlcmxhcCh0aWxlLCBvdGhlciwgY2ZnKSkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqIOacieiKgueCueaXtu+8muaMieS4lueVjOWdkOagh+WMheWbtOebkuWIpOaWreS4iuWxguaYr+WQpuS4juivpeeJjOaciemdouenr+mHjeWPoCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQ292ZXJlZEJ5Tm9kZXModGlsZTogVGlsZU1vZGVsLCBib2FyZDogVGlsZU1vZGVsW10pOiBib29sZWFuIHtcbiAgICBpZiAoIXRpbGUubm9kZSB8fCAhaXNWYWxpZCh0aWxlLm5vZGUpKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgYm94ID0gdGlsZS5ub2RlLmdldEJvdW5kaW5nQm94VG9Xb3JsZCgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgb3RoZXIgPSBib2FyZFtpXTtcbiAgICAgICAgaWYgKG90aGVyLnJlbW92ZWQgfHwgb3RoZXIuaWQgPT09IHRpbGUuaWQpIGNvbnRpbnVlO1xuICAgICAgICBpZiAob3RoZXIubGF5ZXIgPD0gdGlsZS5sYXllcikgY29udGludWU7XG4gICAgICAgIGlmICghb3RoZXIubm9kZSB8fCAhaXNWYWxpZChvdGhlci5ub2RlKSkgY29udGludWU7XG4gICAgICAgIGNvbnN0IG90aGVyQm94ID0gb3RoZXIubm9kZS5nZXRCb3VuZGluZ0JveFRvV29ybGQoKTtcbiAgICAgICAgaWYgKHJlY3RzT3ZlcmxhcChib3gsIG90aGVyQm94KSkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqIOi/kOihjOaXtueUqOWdkOagh+WIpOWumumBruaMoe+8jOmBv+WFjSA0OCDlvKDniYzlj43lpI0gZ2V0Qm91bmRpbmdCb3hUb1dvcmxkIOWNoeatuyAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQ292ZXJlZCh0aWxlOiBUaWxlTW9kZWwsIGJvYXJkOiBUaWxlTW9kZWxbXSwgY2ZnOiBMZXZlbENvbmZpZyk6IGJvb2xlYW4ge1xuICAgIGlmICh0aWxlLnJlbW92ZWQpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gaXNDb3ZlcmVkQnlQb3NpdGlvbih0aWxlLCBib2FyZCwgY2ZnKTtcbn1cblxuLyoqIOWQjOS4gOihjO+8mue6teWQkeWBj+W3ruWwj+S6juWNiuW8oOeJjOmrmCAqL1xuZnVuY3Rpb24gaXNTYW1lUm93KGE6IFRpbGVNb2RlbCwgYjogVGlsZU1vZGVsLCBjZmc6IExldmVsQ29uZmlnKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIE1hdGguYWJzKGEueSAtIGIueSkgPCBjZmcudGlsZUggKiAwLjM1O1xufVxuXG5mdW5jdGlvbiBpc0hvcml6b250YWxOZWlnaGJvcih0aWxlOiBUaWxlTW9kZWwsIG90aGVyOiBUaWxlTW9kZWwsIGNmZzogTGV2ZWxDb25maWcpOiBib29sZWFuIHtcbiAgICBpZiAodGlsZS5sYXllciAhPT0gb3RoZXIubGF5ZXIpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoIWlzU2FtZVJvdyh0aWxlLCBvdGhlciwgY2ZnKSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGR4ID0gTWF0aC5hYnModGlsZS54IC0gb3RoZXIueCk7XG4gICAgY29uc3QgbWluR2FwID0gY2ZnLnRpbGVXICogMC44NTtcbiAgICBjb25zdCBtYXhHYXAgPSBjZmcudGlsZVcgKiAxLjE1O1xuICAgIHJldHVybiBkeCA+PSBtaW5HYXAgJiYgZHggPD0gbWF4R2FwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzU2lkZUJsb2NrKHRpbGU6IFRpbGVNb2RlbCwgYm9hcmQ6IFRpbGVNb2RlbFtdLCBzaWRlOiAnbGVmdCcgfCAncmlnaHQnLCBjZmc6IExldmVsQ29uZmlnKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGdldFNpZGVOZWlnaGJvcih0aWxlLCBib2FyZCwgc2lkZSwgY2ZnKSAhPT0gbnVsbDtcbn1cblxuLyoqIOWQjOWxguW3puWPs+e0p+mCu+aMoeeJjO+8iOWPlui3neemu+acgOi/keeahOS4gOW8oO+8iSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNpZGVOZWlnaGJvcihcbiAgICB0aWxlOiBUaWxlTW9kZWwsXG4gICAgYm9hcmQ6IFRpbGVNb2RlbFtdLFxuICAgIHNpZGU6ICdsZWZ0JyB8ICdyaWdodCcsXG4gICAgY2ZnOiBMZXZlbENvbmZpZ1xuKTogVGlsZU1vZGVsIHwgbnVsbCB7XG4gICAgbGV0IGJlc3Q6IFRpbGVNb2RlbCA9IG51bGw7XG4gICAgbGV0IGJlc3REeCA9IEluZmluaXR5O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgb3RoZXIgPSBib2FyZFtpXTtcbiAgICAgICAgaWYgKG90aGVyLnJlbW92ZWQgfHwgb3RoZXIuaWQgPT09IHRpbGUuaWQpIGNvbnRpbnVlO1xuICAgICAgICBpZiAoIWlzSG9yaXpvbnRhbE5laWdoYm9yKHRpbGUsIG90aGVyLCBjZmcpKSBjb250aW51ZTtcbiAgICAgICAgaWYgKHNpZGUgPT09ICdsZWZ0JyAmJiBvdGhlci54ID49IHRpbGUueCkgY29udGludWU7XG4gICAgICAgIGlmIChzaWRlID09PSAncmlnaHQnICYmIG90aGVyLnggPD0gdGlsZS54KSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgZHggPSBNYXRoLmFicyhvdGhlci54IC0gdGlsZS54KTtcbiAgICAgICAgaWYgKGR4IDwgYmVzdER4KSB7XG4gICAgICAgICAgICBiZXN0RHggPSBkeDtcbiAgICAgICAgICAgIGJlc3QgPSBvdGhlcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYmVzdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQm90aFNpZGVzQmxvY2tlZCh0aWxlOiBUaWxlTW9kZWwsIGJvYXJkOiBUaWxlTW9kZWxbXSwgY2ZnOiBMZXZlbENvbmZpZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIGdldFNpZGVOZWlnaGJvcih0aWxlLCBib2FyZCwgJ2xlZnQnLCBjZmcpICE9PSBudWxsICYmXG4gICAgICAgIGdldFNpZGVOZWlnaGJvcih0aWxlLCBib2FyZCwgJ3JpZ2h0JywgY2ZnKSAhPT0gbnVsbFxuICAgICk7XG59XG5cbi8qKiDljovlnKjor6XniYzkuIrnmoTmiYDmnInkuIrlsYLniYwgKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb3ZlcmluZ1RpbGVzKHRpbGU6IFRpbGVNb2RlbCwgYm9hcmQ6IFRpbGVNb2RlbFtdLCBjZmc6IExldmVsQ29uZmlnKTogVGlsZU1vZGVsW10ge1xuICAgIGNvbnN0IGxpc3Q6IFRpbGVNb2RlbFtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBib2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBvdGhlciA9IGJvYXJkW2ldO1xuICAgICAgICBpZiAob3RoZXIucmVtb3ZlZCB8fCBvdGhlci5pZCA9PT0gdGlsZS5pZCkgY29udGludWU7XG4gICAgICAgIGlmIChvdGhlci5sYXllciA8PSB0aWxlLmxheWVyKSBjb250aW51ZTtcbiAgICAgICAgaWYgKHRpbGVzT3ZlcmxhcCh0aWxlLCBvdGhlciwgY2ZnKSkgbGlzdC5wdXNoKG90aGVyKTtcbiAgICB9XG4gICAgcmV0dXJuIGxpc3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ZyZWUodGlsZTogVGlsZU1vZGVsLCBib2FyZDogVGlsZU1vZGVsW10sIGNmZzogTGV2ZWxDb25maWcpOiBib29sZWFuIHtcbiAgICBpZiAodGlsZS5yZW1vdmVkKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGlzQ292ZXJlZCh0aWxlLCBib2FyZCwgY2ZnKSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGxlZnRCbG9ja2VkID0gaGFzU2lkZUJsb2NrKHRpbGUsIGJvYXJkLCAnbGVmdCcsIGNmZyk7XG4gICAgY29uc3QgcmlnaHRCbG9ja2VkID0gaGFzU2lkZUJsb2NrKHRpbGUsIGJvYXJkLCAncmlnaHQnLCBjZmcpO1xuICAgIHJldHVybiAhbGVmdEJsb2NrZWQgfHwgIXJpZ2h0QmxvY2tlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRnVsbHlFeHBvc2VkKHRpbGU6IFRpbGVNb2RlbCwgYm9hcmQ6IFRpbGVNb2RlbFtdLCBjZmc6IExldmVsQ29uZmlnKTogYm9vbGVhbiB7XG4gICAgaWYgKHRpbGUucmVtb3ZlZCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChpc0NvdmVyZWQodGlsZSwgYm9hcmQsIGNmZykpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoaGFzU2lkZUJsb2NrKHRpbGUsIGJvYXJkLCAnbGVmdCcsIGNmZykpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoaGFzU2lkZUJsb2NrKHRpbGUsIGJvYXJkLCAncmlnaHQnLCBjZmcpKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWZyZXNoVGlsZVN0YXRlcyhib2FyZDogVGlsZU1vZGVsW10sIGNmZzogTGV2ZWxDb25maWcpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHRpbGUgPSBib2FyZFtpXTtcbiAgICAgICAgaWYgKHRpbGUucmVtb3ZlZCkge1xuICAgICAgICAgICAgdGlsZS5jb3ZlcmVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aWxlLmZyZWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRpbGUuY292ZXJlZCA9IGlzQ292ZXJlZCh0aWxlLCBib2FyZCwgY2ZnKTtcbiAgICAgICAgdGlsZS5mcmVlID0gaXNGcmVlKHRpbGUsIGJvYXJkLCBjZmcpO1xuICAgIH1cbn1cbiJdfQ==