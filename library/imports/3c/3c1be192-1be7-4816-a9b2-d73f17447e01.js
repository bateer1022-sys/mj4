"use strict";
cc._RF.push(module, '3c1beGSG+dIFqmy1z8XRH4B', 'is-valid');
// script/is-valid.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValid = void 0;
/**
 * 节点/资源是否仍有效。
 * super-html 等试玩壳里 cc 常无 cc.isValid，业务代码应使用本函数而非 cc.isValid。
 */
function isValid(target, strictMode) {
    if (target == null) {
        return false;
    }
    if (typeof cc !== 'undefined' && typeof cc.isValid === 'function') {
        return cc.isValid(target, strictMode);
    }
    if (typeof cc !== 'undefined' && cc.Object && target instanceof cc.Object) {
        return strictMode ? !!target.isValid : target.isValid !== false;
    }
    return false;
}
exports.isValid = isValid;

cc._RF.pop();