"use strict";
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