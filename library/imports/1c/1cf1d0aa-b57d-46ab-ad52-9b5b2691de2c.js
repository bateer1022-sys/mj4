"use strict";
cc._RF.push(module, '1cf1dCqtX1Gq61Sm1smkd4s', 'LevelSolver');
// script/core/LevelSolver.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSolvableKeys = void 0;
var TileModel_1 = require("../model/TileModel");
var BoardRule_1 = require("./BoardRule");
function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
}
function shuffleIndices(arr) {
    var list = arr;
    for (var i = list.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = list[i];
        list[i] = list[j];
        list[j] = tmp;
    }
}
function makeTempTile(id, slot, key) {
    return {
        id: id,
        key: key,
        kind: TileModel_1.getTileKind(key),
        layer: slot.layer,
        x: slot.x,
        y: slot.y,
        removed: false,
        free: true,
        covered: false,
        node: null,
    };
}
function collectFreeIndices(cfg, keys, placed) {
    var list = [];
    for (var i = 0; i < cfg.slots.length; i++) {
        if (keys[i])
            continue;
        var probe = makeTempTile(i, cfg.slots[i], 'w1');
        if (BoardRule_1.isFree(probe, placed, cfg))
            list.push(i);
    }
    return list;
}
function sortFreeByLayerDesc(indices, cfg) {
    indices.sort(function (a, b) { return cfg.slots[b].layer - cfg.slots[a].layer; });
}
/** 反向构造：每步尝试所有可放对子，回溯保证能放满 */
function tryBuildKeys(cfg, keys, placed, pool, poolIndex, nodes, nodeLimit) {
    if (poolIndex >= pool.length)
        return true;
    if (nodes.n++ > nodeLimit)
        return false;
    var freeIndices = collectFreeIndices(cfg, keys, placed);
    if (freeIndices.length < 2)
        return false;
    sortFreeByLayerDesc(freeIndices, cfg);
    var pairs = [];
    for (var a = 0; a < freeIndices.length; a++) {
        for (var b = a + 1; b < freeIndices.length; b++) {
            pairs.push([freeIndices[a], freeIndices[b]]);
        }
    }
    shuffleIndices(pairs);
    var tryPairs = pairs.length > 48 ? pairs.slice(0, 48) : pairs;
    var key = pool[poolIndex];
    for (var pi = 0; pi < tryPairs.length; pi++) {
        var i1 = tryPairs[pi][0];
        var i2 = tryPairs[pi][1];
        keys[i1] = key;
        keys[i2] = key;
        placed.push(makeTempTile(i1, cfg.slots[i1], key));
        placed.push(makeTempTile(i2, cfg.slots[i2], key));
        if (tryBuildKeys(cfg, keys, placed, pool, poolIndex + 1, nodes, nodeLimit)) {
            return true;
        }
        keys[i1] = null;
        keys[i2] = null;
        placed.pop();
        placed.pop();
    }
    return false;
}
/**
 * 反向构造可解牌面（保证存在一条按自由牌顺序的消牌路径）
 */
function generateSolvableKeys(cfg) {
    var slotCount = cfg.slots.length;
    var pairCount = Math.floor(slotCount / 2);
    if (pairCount * 2 !== slotCount)
        return null;
    var nodeLimit = Math.max(500000, pairCount * pairCount * 8000);
    for (var attempt = 0; attempt < 80; attempt++) {
        var keys = new Array(slotCount);
        for (var i = 0; i < slotCount; i++)
            keys[i] = null;
        var placed = [];
        var pool = [];
        for (var i = 0; i < pairCount; i++) {
            pool.push(cfg.keyPool[i % cfg.keyPool.length]);
        }
        shuffleArray(pool);
        var nodes = { n: 0 };
        if (tryBuildKeys(cfg, keys, placed, pool, 0, nodes, nodeLimit)) {
            var result = new Array(slotCount);
            for (var i = 0; i < slotCount; i++)
                result[i] = keys[i];
            return result;
        }
    }
    return null;
}
exports.generateSolvableKeys = generateSolvableKeys;

cc._RF.pop();