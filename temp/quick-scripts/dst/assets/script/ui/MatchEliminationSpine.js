
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/ui/MatchEliminationSpine.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvdWkvTWF0Y2hFbGltaW5hdGlvblNwaW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHdDQUFzQztBQUN0Qyx5REFBOEQ7QUFFOUQsSUFBSSxVQUFVLEdBQW9CLElBQUksQ0FBQztBQUV2QyxpQ0FBaUM7QUFDakMsU0FBZ0IsNEJBQTRCLENBQUMsTUFBbUI7SUFDNUQsSUFBSSxVQUFVLEVBQUU7UUFDWixJQUFJLE1BQU0sRUFBRTtZQUNSLE1BQU0sRUFBRSxDQUFDO1NBQ1o7UUFDRCxPQUFPO0tBQ1Y7SUFDRCxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQywyQ0FBdUIsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFDLEdBQUcsRUFBRSxJQUFJO1FBQ3ZFLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFO1lBQ2QsVUFBVSxHQUFHLElBQUksQ0FBQztTQUNyQjthQUFNO1lBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsRUFBRSwyQ0FBdUIsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDdEY7UUFDRCxJQUFJLE1BQU0sRUFBRTtZQUNSLE1BQU0sRUFBRSxDQUFDO1NBQ1o7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFqQkQsb0VBaUJDO0FBRUQsMkJBQTJCO0FBQzNCLFNBQWdCLHlCQUF5QixDQUFDLE1BQWUsRUFBRSxDQUFTLEVBQUUsQ0FBUztJQUMzRSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsa0JBQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUM3QixPQUFPO0tBQ1Y7SUFFRCxJQUFNLEtBQUssR0FBRyxVQUFDLElBQXFCO1FBQ2hDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxrQkFBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzNCLE9BQU87U0FDVjtRQUNELElBQU0sSUFBSSxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzdDLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLEVBQUUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLEVBQUUsQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7UUFDOUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQywyQ0FBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSwyQ0FBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV0RCxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSwyQ0FBdUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEQsRUFBRSxDQUFDLG1CQUFtQixDQUFDO1lBQ25CLElBQUksSUFBSSxJQUFJLGtCQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3ZCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUNsQjtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUN0QixFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUNqQixFQUFFLENBQUMsUUFBUSxDQUFDO1lBQ1IsSUFBSSxJQUFJLElBQUksa0JBQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDdkIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ2xCO1FBQ0wsQ0FBQyxDQUFDLENBQ0wsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDO0lBRUYsSUFBSSxVQUFVLEVBQUU7UUFDWixLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEIsT0FBTztLQUNWO0lBQ0QsNEJBQTRCLENBQUM7UUFDekIsSUFBSSxVQUFVLEVBQUU7WUFDWixLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDckI7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUExQ0QsOERBMENDIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNWYWxpZCB9IGZyb20gJy4uL2lzLXZhbGlkJztcbmltcG9ydCB7IE1BVENIX0VMSU1JTkFUSU9OX1NQSU5FIH0gZnJvbSAnLi9HYW1lUHJlbG9hZENvbmZpZyc7XG5cbmxldCBjYWNoZWREYXRhOiBzcC5Ta2VsZXRvbkRhdGEgPSBudWxsO1xuXG4vKiog6aKE5Yqg6L295raI6ZmkIFNwaW5l77yI6L+b5bGA5ZCO5Y+w5Yqg6L2977yM6YG/5YWN6aaW5raI5Y2h6aG/77yJICovXG5leHBvcnQgZnVuY3Rpb24gcHJlbG9hZE1hdGNoRWxpbWluYXRpb25TcGluZShvbkRvbmU/OiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgaWYgKGNhY2hlZERhdGEpIHtcbiAgICAgICAgaWYgKG9uRG9uZSkge1xuICAgICAgICAgICAgb25Eb25lKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjYy5yZXNvdXJjZXMubG9hZChNQVRDSF9FTElNSU5BVElPTl9TUElORS5wYXRoLCBzcC5Ta2VsZXRvbkRhdGEsIChlcnIsIGRhdGEpID0+IHtcbiAgICAgICAgaWYgKCFlcnIgJiYgZGF0YSkge1xuICAgICAgICAgICAgY2FjaGVkRGF0YSA9IGRhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYy53YXJuKCdbTWF0Y2hFbGltaW5hdGlvblNwaW5lXSBsb2FkIGZhaWxlZDonLCBNQVRDSF9FTElNSU5BVElPTl9TUElORS5wYXRoLCBlcnIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvbkRvbmUpIHtcbiAgICAgICAgICAgIG9uRG9uZSgpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKiDlnKjmo4vnm5jlnZDmoIcgKHgseSkg5pKt5pS+5LiA5qyh5raI6Zmk54m55pWIICovXG5leHBvcnQgZnVuY3Rpb24gcGxheU1hdGNoRWxpbWluYXRpb25TcGluZShwYXJlbnQ6IGNjLk5vZGUsIHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKCFwYXJlbnQgfHwgIWlzVmFsaWQocGFyZW50KSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc3Bhd24gPSAoZGF0YTogc3AuU2tlbGV0b25EYXRhKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICghZGF0YSB8fCAhaXNWYWxpZChwYXJlbnQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgbm9kZSA9IG5ldyBjYy5Ob2RlKCdtYXRjaF9lbGltX3NwaW5lJyk7XG4gICAgICAgIGNvbnN0IHNrID0gbm9kZS5hZGRDb21wb25lbnQoc3AuU2tlbGV0b24pO1xuICAgICAgICBzay5za2VsZXRvbkRhdGEgPSBkYXRhO1xuICAgICAgICBzay5wcmVtdWx0aXBsaWVkQWxwaGEgPSBmYWxzZTtcbiAgICAgICAgbm9kZS5zZXRQb3NpdGlvbih4LCB5KTtcbiAgICAgICAgbm9kZS5zZXRTY2FsZShNQVRDSF9FTElNSU5BVElPTl9TUElORS5zY2FsZSk7XG4gICAgICAgIHBhcmVudC5hZGRDaGlsZChub2RlLCBNQVRDSF9FTElNSU5BVElPTl9TUElORS56SW5kZXgpO1xuXG4gICAgICAgIHNrLnNldEFuaW1hdGlvbigwLCBNQVRDSF9FTElNSU5BVElPTl9TUElORS5hbmltLCBmYWxzZSk7XG4gICAgICAgIHNrLnNldENvbXBsZXRlTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKG5vZGUgJiYgaXNWYWxpZChub2RlKSkge1xuICAgICAgICAgICAgICAgIG5vZGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoXG4gICAgICAgICAgICBjYy5kZWxheVRpbWUoMS4yKSxcbiAgICAgICAgICAgIGNjLmNhbGxGdW5jKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZSAmJiBpc1ZhbGlkKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICkpO1xuICAgIH07XG5cbiAgICBpZiAoY2FjaGVkRGF0YSkge1xuICAgICAgICBzcGF3bihjYWNoZWREYXRhKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBwcmVsb2FkTWF0Y2hFbGltaW5hdGlvblNwaW5lKCgpID0+IHtcbiAgICAgICAgaWYgKGNhY2hlZERhdGEpIHtcbiAgICAgICAgICAgIHNwYXduKGNhY2hlZERhdGEpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4iXX0=