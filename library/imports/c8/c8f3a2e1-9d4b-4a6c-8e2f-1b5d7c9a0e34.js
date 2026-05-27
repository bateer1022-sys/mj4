"use strict";
cc._RF.push(module, 'c8f3aLhnUtKbI4vG118mg40', 'MatchEliminationSpine');
// script/ui/MatchEliminationSpine.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playMatchEliminationSpine = exports.preloadMatchEliminationSpine = void 0;
var is_valid_1 = require("../is-valid");
var GamePreloadConfig_1 = require("./GamePreloadConfig");
var cachedData = null;
/** 预加载消除 Spine（进局后台加载，避免首消卡顿） */
function preloadMatchEliminationSpine(onDone) {
    if (cachedData) {
        if (onDone) {
            onDone();
        }
        return;
    }
    cc.resources.load(GamePreloadConfig_1.MATCH_ELIMINATION_SPINE.path, sp.SkeletonData, function (err, data) {
        if (!err && data) {
            cachedData = data;
        }
        else {
            cc.warn('[MatchEliminationSpine] load failed:', GamePreloadConfig_1.MATCH_ELIMINATION_SPINE.path, err);
        }
        if (onDone) {
            onDone();
        }
    });
}
exports.preloadMatchEliminationSpine = preloadMatchEliminationSpine;
/** 在棋盘坐标 (x,y) 播放一次消除特效 */
function playMatchEliminationSpine(parent, x, y) {
    if (!parent || !is_valid_1.isValid(parent)) {
        return;
    }
    var spawn = function (data) {
        if (!data || !is_valid_1.isValid(parent)) {
            return;
        }
        var node = new cc.Node('match_elim_spine');
        var sk = node.addComponent(sp.Skeleton);
        sk.skeletonData = data;
        sk.premultipliedAlpha = false;
        node.setPosition(x, y);
        node.setScale(GamePreloadConfig_1.MATCH_ELIMINATION_SPINE.scale);
        parent.addChild(node, GamePreloadConfig_1.MATCH_ELIMINATION_SPINE.zIndex);
        sk.setAnimation(0, GamePreloadConfig_1.MATCH_ELIMINATION_SPINE.anim, false);
        sk.setCompleteListener(function () {
            if (node && is_valid_1.isValid(node)) {
                node.destroy();
            }
        });
        node.runAction(cc.sequence(cc.delayTime(1.2), cc.callFunc(function () {
            if (node && is_valid_1.isValid(node)) {
                node.destroy();
            }
        })));
    };
    if (cachedData) {
        spawn(cachedData);
        return;
    }
    preloadMatchEliminationSpine(function () {
        if (cachedData) {
            spawn(cachedData);
        }
    });
}
exports.playMatchEliminationSpine = playMatchEliminationSpine;

cc._RF.pop();