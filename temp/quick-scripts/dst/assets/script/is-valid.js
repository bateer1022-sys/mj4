
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/is-valid.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvaXMtdmFsaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztHQUdHO0FBQ0gsU0FBZ0IsT0FBTyxDQUFDLE1BQVcsRUFBRSxVQUFvQjtJQUNyRCxJQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUU7UUFDaEIsT0FBTyxLQUFLLENBQUM7S0FDaEI7SUFDRCxJQUFJLE9BQU8sRUFBRSxLQUFLLFdBQVcsSUFBSSxPQUFPLEVBQUUsQ0FBQyxPQUFPLEtBQUssVUFBVSxFQUFFO1FBQy9ELE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7S0FDekM7SUFDRCxJQUFJLE9BQU8sRUFBRSxLQUFLLFdBQVcsSUFBSSxFQUFFLENBQUMsTUFBTSxJQUFJLE1BQU0sWUFBWSxFQUFFLENBQUMsTUFBTSxFQUFFO1FBQ3ZFLE9BQU8sVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUM7S0FDbkU7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBWEQsMEJBV0MiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIOiKgueCuS/otYTmupDmmK/lkKbku43mnInmlYjjgIJcbiAqIHN1cGVyLWh0bWwg562J6K+V546p5aOz6YeMIGNjIOW4uOaXoCBjYy5pc1ZhbGlk77yM5Lia5Yqh5Luj56CB5bqU5L2/55So5pys5Ye95pWw6ICM6Z2eIGNjLmlzVmFsaWTjgIJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWQodGFyZ2V0OiBhbnksIHN0cmljdE1vZGU/OiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgaWYgKHRhcmdldCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBjYyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGNjLmlzVmFsaWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGNjLmlzVmFsaWQodGFyZ2V0LCBzdHJpY3RNb2RlKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBjYyAhPT0gJ3VuZGVmaW5lZCcgJiYgY2MuT2JqZWN0ICYmIHRhcmdldCBpbnN0YW5jZW9mIGNjLk9iamVjdCkge1xuICAgICAgICByZXR1cm4gc3RyaWN0TW9kZSA/ICEhdGFyZ2V0LmlzVmFsaWQgOiB0YXJnZXQuaXNWYWxpZCAhPT0gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbiJdfQ==