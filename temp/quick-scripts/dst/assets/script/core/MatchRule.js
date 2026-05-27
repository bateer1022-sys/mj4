
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/core/MatchRule.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '06b5e6e491ANpvsxz7Lrwop', 'MatchRule');
// script/core/MatchRule.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canMatch = void 0;
var TileModelKinds_1 = require("../model/TileModelKinds");
function canMatch(a, b) {
    if (a.removed || b.removed || a.id === b.id)
        return false;
    if (a.kind === TileModelKinds_1.TileKind.Flower && b.kind === TileModelKinds_1.TileKind.Flower)
        return true;
    if (a.kind === TileModelKinds_1.TileKind.Season && b.kind === TileModelKinds_1.TileKind.Season)
        return true;
    return a.key === b.key;
}
exports.canMatch = canMatch;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvY29yZS9NYXRjaFJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMERBQW1EO0FBRW5ELFNBQWdCLFFBQVEsQ0FBQyxDQUFZLEVBQUUsQ0FBWTtJQUMvQyxJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFDMUQsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLHlCQUFRLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUsseUJBQVEsQ0FBQyxNQUFNO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDMUUsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLHlCQUFRLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUsseUJBQVEsQ0FBQyxNQUFNO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDMUUsT0FBTyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDM0IsQ0FBQztBQUxELDRCQUtDIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGlsZU1vZGVsIH0gZnJvbSAnLi4vbW9kZWwvVGlsZU1vZGVsJztcbmltcG9ydCB7IFRpbGVLaW5kIH0gZnJvbSAnLi4vbW9kZWwvVGlsZU1vZGVsS2luZHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY2FuTWF0Y2goYTogVGlsZU1vZGVsLCBiOiBUaWxlTW9kZWwpOiBib29sZWFuIHtcbiAgICBpZiAoYS5yZW1vdmVkIHx8IGIucmVtb3ZlZCB8fCBhLmlkID09PSBiLmlkKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGEua2luZCA9PT0gVGlsZUtpbmQuRmxvd2VyICYmIGIua2luZCA9PT0gVGlsZUtpbmQuRmxvd2VyKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoYS5raW5kID09PSBUaWxlS2luZC5TZWFzb24gJiYgYi5raW5kID09PSBUaWxlS2luZC5TZWFzb24pIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBhLmtleSA9PT0gYi5rZXk7XG59XG4iXX0=