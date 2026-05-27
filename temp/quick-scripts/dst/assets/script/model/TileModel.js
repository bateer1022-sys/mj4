
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/model/TileModel.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '71190M8MWtNOY8yQpI4bPwS', 'TileModel');
// script/model/TileModel.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTileDisplayName = exports.getTileKind = exports.TileKind = void 0;
var TileModelKinds_1 = require("./TileModelKinds");
var TileModelKinds_2 = require("./TileModelKinds");
Object.defineProperty(exports, "TileKind", { enumerable: true, get: function () { return TileModelKinds_2.TileKind; } });
function getTileKind(key) {
    if (key.indexOf('H_') === 0)
        return TileModelKinds_1.TileKind.Flower;
    if (key.indexOf('J_') === 0)
        return TileModelKinds_1.TileKind.Season;
    if (key.indexOf('Z_') === 0)
        return TileModelKinds_1.TileKind.Honor;
    return TileModelKinds_1.TileKind.Suit;
}
exports.getTileKind = getTileKind;
var CN_NUM = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
var SUIT_SUFFIX = { w: '万', t: '条', b: '筒' };
var SPECIAL_NAMES = {
    Z_dong: '东', Z_nan: '南', Z_xi: '西', Z_bei: '北',
    Z_zhong: '红中', Z_fa: '发财', Z_bai: '白板',
    J_chun: '春', J_xia: '夏', J_qiu: '秋', J_dong: '冬',
    H_mei: '梅', H_lan: '兰', H_ju: '菊', H_zhu: '竹',
};
/** 资源 key → 底部状态栏等处的麻将术语显示名 */
function getTileDisplayName(key) {
    if (SPECIAL_NAMES[key]) {
        return SPECIAL_NAMES[key];
    }
    var m = key.match(/^([wtb])(\d)$/);
    if (m) {
        var n = parseInt(m[2], 10);
        if (n >= 1 && n <= 9) {
            return CN_NUM[n] + SUIT_SUFFIX[m[1]];
        }
    }
    return key;
}
exports.getTileDisplayName = getTileDisplayName;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvbW9kZWwvVGlsZU1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG1EQUE0QztBQUU1QyxtREFBNEM7QUFBbkMsMEdBQUEsUUFBUSxPQUFBO0FBdUJqQixTQUFnQixXQUFXLENBQUMsR0FBVztJQUNuQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUFFLE9BQU8seUJBQVEsQ0FBQyxNQUFNLENBQUM7SUFDcEQsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFBRSxPQUFPLHlCQUFRLENBQUMsTUFBTSxDQUFDO0lBQ3BELElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQUUsT0FBTyx5QkFBUSxDQUFDLEtBQUssQ0FBQztJQUNuRCxPQUFPLHlCQUFRLENBQUMsSUFBSSxDQUFDO0FBQ3pCLENBQUM7QUFMRCxrQ0FLQztBQUVELElBQU0sTUFBTSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDakUsSUFBTSxXQUFXLEdBQStCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUUzRSxJQUFNLGFBQWEsR0FBOEI7SUFDN0MsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUc7SUFDOUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJO0lBQ3RDLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHO0lBQ2hELEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHO0NBQ2hELENBQUM7QUFFRiwrQkFBK0I7QUFDL0IsU0FBZ0Isa0JBQWtCLENBQUMsR0FBVztJQUMxQyxJQUFJLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNwQixPQUFPLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUM3QjtJQUNELElBQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDckMsSUFBSSxDQUFDLEVBQUU7UUFDSCxJQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2xCLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN4QztLQUNKO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBWkQsZ0RBWUMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUaWxlS2luZCB9IGZyb20gJy4vVGlsZU1vZGVsS2luZHMnO1xuXG5leHBvcnQgeyBUaWxlS2luZCB9IGZyb20gJy4vVGlsZU1vZGVsS2luZHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRpbGVNb2RlbCB7XG4gICAgaWQ6IG51bWJlcjtcbiAgICBrZXk6IHN0cmluZztcbiAgICBraW5kOiBUaWxlS2luZDtcbiAgICBsYXllcjogbnVtYmVyO1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG4gICAgcmVtb3ZlZDogYm9vbGVhbjtcbiAgICAvKiog5piv5ZCm5Y+v54K55Ye75raI6Zmk77yI5LiK5peg6YGu5oyh5LiU5bem5Y+z6Iez5bCR5LiA5L6n56m677yJICovXG4gICAgZnJlZTogYm9vbGVhbjtcbiAgICAvKiog5LiK5bGC5piv5ZCm5pyJ54mM5LiO5LmL6YeN5ZCI77yI5LuF55So5LqO5Y2K6YCP5piO5pi+56S677yJICovXG4gICAgY292ZXJlZDogYm9vbGVhbjtcbiAgICBub2RlOiBjYy5Ob2RlO1xuICAgIC8qKiDmraPluLjlj6DmlL7ml7bnmoQgekluZGV477yM5Y+W5raI6YCJ5Lit5ZCO5oGi5aSNICovXG4gICAgYmFzZVpJbmRleD86IG51bWJlcjtcbiAgICAvKiog6aKE5Yi25L2T6buY6K6k57yp5pS+77yI5aaCIDAuNe+8ie+8jOmAieS4reaUvuWkpy/lj5bmtojpg73ln7rkuo7mraTlgLwgKi9cbiAgICBiYXNlU2NhbGU/OiBudW1iZXI7XG4gICAgLyoqIOmihOWItuS9kyBtYXNrIOmBrum7keaYr+WQpuW3suaYvuekuu+8iOmBv+WFjemHjeWkjeWKqOeUu+WvvOiHtOmXqueDge+8iSAqL1xuICAgIGRpbU1hc2tPbj86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUaWxlS2luZChrZXk6IHN0cmluZyk6IFRpbGVLaW5kIHtcbiAgICBpZiAoa2V5LmluZGV4T2YoJ0hfJykgPT09IDApIHJldHVybiBUaWxlS2luZC5GbG93ZXI7XG4gICAgaWYgKGtleS5pbmRleE9mKCdKXycpID09PSAwKSByZXR1cm4gVGlsZUtpbmQuU2Vhc29uO1xuICAgIGlmIChrZXkuaW5kZXhPZignWl8nKSA9PT0gMCkgcmV0dXJuIFRpbGVLaW5kLkhvbm9yO1xuICAgIHJldHVybiBUaWxlS2luZC5TdWl0O1xufVxuXG5jb25zdCBDTl9OVU0gPSBbJycsICfkuIAnLCAn5LqMJywgJ+S4iScsICflm5snLCAn5LqUJywgJ+WFrScsICfkuIMnLCAn5YWrJywgJ+S5nSddO1xuY29uc3QgU1VJVF9TVUZGSVg6IHsgW3N1aXQ6IHN0cmluZ106IHN0cmluZyB9ID0geyB3OiAn5LiHJywgdDogJ+adoScsIGI6ICfnrZInIH07XG5cbmNvbnN0IFNQRUNJQUxfTkFNRVM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7XG4gICAgWl9kb25nOiAn5LicJywgWl9uYW46ICfljZcnLCBaX3hpOiAn6KW/JywgWl9iZWk6ICfljJcnLFxuICAgIFpfemhvbmc6ICfnuqLkuK0nLCBaX2ZhOiAn5Y+R6LSiJywgWl9iYWk6ICfnmb3mnb8nLFxuICAgIEpfY2h1bjogJ+aYpScsIEpfeGlhOiAn5aSPJywgSl9xaXU6ICfnp4snLCBKX2Rvbmc6ICflhqwnLFxuICAgIEhfbWVpOiAn5qKFJywgSF9sYW46ICflhbAnLCBIX2p1OiAn6I+KJywgSF96aHU6ICfnq7knLFxufTtcblxuLyoqIOi1hOa6kCBrZXkg4oaSIOW6lemDqOeKtuaAgeagj+etieWkhOeahOm6u+Wwhuacr+ivreaYvuekuuWQjSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbGVEaXNwbGF5TmFtZShrZXk6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKFNQRUNJQUxfTkFNRVNba2V5XSkge1xuICAgICAgICByZXR1cm4gU1BFQ0lBTF9OQU1FU1trZXldO1xuICAgIH1cbiAgICBjb25zdCBtID0ga2V5Lm1hdGNoKC9eKFt3dGJdKShcXGQpJC8pO1xuICAgIGlmIChtKSB7XG4gICAgICAgIGNvbnN0IG4gPSBwYXJzZUludChtWzJdLCAxMCk7XG4gICAgICAgIGlmIChuID49IDEgJiYgbiA8PSA5KSB7XG4gICAgICAgICAgICByZXR1cm4gQ05fTlVNW25dICsgU1VJVF9TVUZGSVhbbVsxXV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGtleTtcbn1cbiJdfQ==