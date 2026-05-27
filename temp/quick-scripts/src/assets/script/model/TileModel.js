"use strict";
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