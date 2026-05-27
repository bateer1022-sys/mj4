
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/ui/VictoryEndPanel.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'e7b2cTRWj9Oi5wtbxoLjn1C', 'VictoryEndPanel');
// script/ui/VictoryEndPanel.ts

"use strict";
/** end 结算分步动画 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetVictoryEndUnlock = exports.playVictoryEndUnlock = exports.playVictoryEndSequenceLegacy = exports.playVictoryEndSequence = exports.bindVictoryEndDownloadButton = exports.unbindVictoryEndDownloadButton = exports.layoutVictoryEndDimBackdrop = exports.ensureVictoryEndDimBackdrop = exports.VICTORY_END_STYLE = void 0;
var is_valid_1 = require("../is-valid");
var GamePreloadConfig_1 = require("./GamePreloadConfig");
var ShowAllLayout_1 = require("./ShowAllLayout");
var END_DIM_BACKDROP_NAME = 'end_dim_backdrop';
/** 纯黑遮罩透明度 0.5（0–255） */
var END_DIM_OPACITY = 128;
var cachedWhiteSpriteFrame = null;
function getWhiteSpriteFrame() {
    if (cachedWhiteSpriteFrame) {
        return cachedWhiteSpriteFrame;
    }
    var tex = new cc.Texture2D();
    tex.initWithData(new Uint8Array([255, 255, 255, 255]), cc.Texture2D.PixelFormat.RGBA8888, 1, 1);
    cachedWhiteSpriteFrame = new cc.SpriteFrame();
    cachedWhiteSpriteFrame.setTexture(tex);
    return cachedWhiteSpriteFrame;
}
var NODE_ICON = 'icon';
var NODE_VICTORY = 'victory';
var NODE_TASK_LIGHT = 'TaskLight';
/** 场景里常见节点名（优先 download，兼容旧名） */
var DOWNLOAD_BTN_NAMES = ['download', 'btn_download_en_250x80'];
var NODE_END_SCORE = 'end_score';
var STAR_NAMES = ['star1', 'star2', 'star3'];
var SPINE_VICTORY_APPEAR = 'Appear';
var SPINE_VICTORY_LOOP = 'Loop';
var SPINE_TASK_APPEAR = 'Appear1';
/** victory Appear 监听超时兜底（秒） */
var VICTORY_APPEAR_FALLBACK = 0.72;
/** icon 从小放大到场景设计缩放 */
var ICON_START_SCALE = 0.15;
var ICON_POP_DURATION = 0.26;
var ICON_SETTLE_DURATION = 0.08;
var STAR_START_SCALE = 0.1;
var STAR_POP_DURATION = 0.3;
var STAR_STAGGER = 0.07;
/** TaskLight Appear1 监听超时兜底（秒） */
var TASK_APPEAR_FALLBACK = 0.95;
/** 相对 TaskLight 的 Y 偏移（end 本地坐标） */
var SCORE_ABOVE_TASK_Y = 0;
var END_SCORE_Z_INDEX = 55;
var SCORE_FONT_SIZE = 54;
var SCORE_LINE_HEIGHT = 70;
var SCORE_PUNCH_SCALE = 1.08;
var SCORE_PUNCH_DURATION = 0.1;
var BTN_POP_DURATION = 0.24;
/** 下载按钮弹出后的呼吸缩放（相对设计缩放） */
var BTN_BREATH_PEAK_RATIO = 1.06;
var BTN_BREATH_HALF_DURATION = 0.55;
/** 星星弹出后多久接 TaskLight / 分数（可重叠，不必等星星全结束） */
var STEP_TASK_OVERLAP = 0.18;
/** 分数弹出后多久出下载按钮 */
var STEP_BTN_AFTER_SCORE = 0;
exports.VICTORY_END_STYLE = {
    petalCenterX: 0,
    petalCenterY: 60,
};
function findDownloadBtn(endRoot) {
    for (var i = 0; i < DOWNLOAD_BTN_NAMES.length; i++) {
        var node = endRoot.getChildByName(DOWNLOAD_BTN_NAMES[i]);
        if (node && is_valid_1.isValid(node)) {
            return node;
        }
    }
    var stack = [];
    for (var i = 0; i < endRoot.childrenCount; i++) {
        stack.push(endRoot.children[i]);
    }
    while (stack.length > 0) {
        var cur = stack.pop();
        if (!cur || !is_valid_1.isValid(cur)) {
            continue;
        }
        for (var j = 0; j < DOWNLOAD_BTN_NAMES.length; j++) {
            if (cur.name === DOWNLOAD_BTN_NAMES[j]) {
                return cur;
            }
        }
        for (var k = 0; k < cur.childrenCount; k++) {
            stack.push(cur.children[k]);
        }
    }
    return null;
}
function getEndNodes(endRoot) {
    if (!endRoot || !is_valid_1.isValid(endRoot)) {
        return null;
    }
    var icon = endRoot.getChildByName(NODE_ICON);
    var victory = endRoot.getChildByName(NODE_VICTORY);
    var taskLight = endRoot.getChildByName(NODE_TASK_LIGHT);
    var downloadBtn = findDownloadBtn(endRoot);
    if (!icon || !victory || !taskLight || !downloadBtn) {
        cc.warn('[VictoryEndPanel] end 子节点缺失，需包含 icon / victory / TaskLight / download');
        return null;
    }
    var iconTargetScale = Math.max(Math.abs(icon.scaleX), 0.01);
    var stars = [];
    for (var i = 0; i < STAR_NAMES.length; i++) {
        var node = endRoot.getChildByName(STAR_NAMES[i]);
        if (node && is_valid_1.isValid(node)) {
            stars.push({ node: node, targetX: node.x, targetY: node.y });
        }
    }
    return { icon: icon, iconTargetScale: iconTargetScale, victory: victory, taskLight: taskLight, downloadBtn: downloadBtn, stars: stars };
}
function getPetalCenter(nodes) {
    return cc.v2(nodes.victory.x, nodes.victory.y);
}
function getCanvasFromEnd(endRoot) {
    var parent = endRoot && endRoot.parent;
    return parent && is_valid_1.isValid(parent) ? parent : null;
}
/** end 最底层半透明黑底，尺寸与 bg 相同（SHOW_ALL cover） */
function ensureVictoryEndDimBackdrop(endRoot, canvas) {
    if (!endRoot || !is_valid_1.isValid(endRoot)) {
        return null;
    }
    var canvasNode = canvas && is_valid_1.isValid(canvas) ? canvas : getCanvasFromEnd(endRoot);
    if (!canvasNode) {
        return null;
    }
    var bg = canvasNode.getChildByName('bg');
    if (!bg || !is_valid_1.isValid(bg)) {
        return null;
    }
    // 场景里 end 常为黑色 color，会乘到子节点上导致遮罩发闷、看不出透明
    endRoot.color = cc.Color.WHITE;
    endRoot.opacity = 255;
    var dim = endRoot.getChildByName(END_DIM_BACKDROP_NAME);
    if (!dim || !is_valid_1.isValid(dim)) {
        dim = new cc.Node(END_DIM_BACKDROP_NAME);
        dim.setAnchorPoint(0.5, 0.5);
        dim.setPosition(0, 0);
        endRoot.insertChild(dim, 0);
    }
    var oldGraphics = dim.getComponent(cc.Graphics);
    if (oldGraphics) {
        oldGraphics.destroy();
    }
    var sprite = dim.getComponent(cc.Sprite);
    if (!sprite) {
        sprite = dim.addComponent(cc.Sprite);
    }
    sprite.spriteFrame = getWhiteSpriteFrame();
    sprite.type = cc.Sprite.Type.SIMPLE;
    sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
    dim.active = true;
    dim.zIndex = GamePreloadConfig_1.Z_ORDER_END_CHILD.DIM_BACKDROP;
    dim.color = cc.Color.BLACK;
    dim.opacity = END_DIM_OPACITY;
    dim.setContentSize(bg.width, bg.height);
    ShowAllLayout_1.layoutShowAllCover(dim, canvasNode);
    return dim;
}
exports.ensureVictoryEndDimBackdrop = ensureVictoryEndDimBackdrop;
function layoutVictoryEndDimBackdrop(endRoot, canvas) {
    ensureVictoryEndDimBackdrop(endRoot, canvas);
}
exports.layoutVictoryEndDimBackdrop = layoutVictoryEndDimBackdrop;
function hideNode(node) {
    node.stopAllActions();
    node.active = false;
    node.opacity = 0;
}
/** 保持 active，仅透明（inactive 节点上 runAction 在 2.4 可能不执行） */
function hideNodeVisual(node) {
    node.stopAllActions();
    node.active = true;
    node.opacity = 0;
}
/** icon：从 ICON_START_SCALE 弹到场景设计缩放（勿用当前 scale 当 base，prepare 会改小） */
function playIconPopBounce(icon, targetScale) {
    icon.stopAllActions();
    icon.active = true;
    icon.opacity = 0;
    icon.setScale(ICON_START_SCALE);
    var peak = targetScale * 1.12;
    icon.runAction(cc.sequence(cc.spawn(cc.fadeIn(0.1), cc.scaleTo(ICON_POP_DURATION, peak).easing(cc.easeBackOut())), cc.scaleTo(ICON_SETTLE_DURATION, targetScale).easing(cc.easeSineOut())));
}
function playVictoryAppearThenLoop(victory, onAppearDone) {
    victory.active = true;
    victory.opacity = 255;
    var sk = victory.getComponent(sp.Skeleton);
    if (!sk) {
        cc.warn('[VictoryEndPanel] victory 缺少 sp.Skeleton');
        onAppearDone();
        return;
    }
    sk.setCompleteListener(null);
    sk.loop = false;
    sk.setAnimation(0, SPINE_VICTORY_APPEAR, false);
    var done = false;
    var finish = function () {
        if (done || !is_valid_1.isValid(victory)) {
            return;
        }
        done = true;
        sk.setCompleteListener(null);
        sk.loop = true;
        sk.setAnimation(0, SPINE_VICTORY_LOOP, true);
        onAppearDone();
    };
    sk.setCompleteListener(finish);
    victory.runAction(cc.sequence(cc.delayTime(VICTORY_APPEAR_FALLBACK), cc.callFunc(finish, null)));
}
function playStarsPop(stars, center) {
    for (var i = 0; i < stars.length; i++) {
        var slot = stars[i];
        var node = slot.node;
        node.stopAllActions();
        node.active = true;
        node.zIndex = 20;
        node.setPosition(center.x, center.y);
        node.setScale(STAR_START_SCALE);
        node.opacity = 0;
        node.runAction(cc.sequence(cc.delayTime(i * STAR_STAGGER), cc.spawn(cc.fadeIn(0.08), cc.moveTo(STAR_POP_DURATION, slot.targetX, slot.targetY).easing(cc.easeBackOut()), cc.scaleTo(STAR_POP_DURATION, 1).easing(cc.easeBackOut()))));
    }
}
function destroyEndScoreLabel(endRoot) {
    var old = endRoot.getChildByName(NODE_END_SCORE);
    if (old && is_valid_1.isValid(old)) {
        old.destroy();
    }
}
/** 分数挂在 end 上（勿挂在 Spine TaskLight 子节点，2.4 下常不显示） */
function ensureEndScoreLabel(endRoot, taskLight, font, score) {
    destroyEndScoreLabel(endRoot);
    var node = new cc.Node(NODE_END_SCORE);
    var label = node.addComponent(cc.Label);
    label.font = font;
    label.fontSize = SCORE_FONT_SIZE;
    label.lineHeight = SCORE_LINE_HEIGHT;
    label.enableWrapText = false;
    label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
    label.verticalAlign = cc.Label.VerticalAlign.CENTER;
    label.string = String(Math.max(0, Math.floor(score)));
    node.setAnchorPoint(0.5, 0.5);
    node.setPosition(taskLight.x, taskLight.y + SCORE_ABOVE_TASK_Y);
    node.zIndex = END_SCORE_Z_INDEX;
    endRoot.addChild(node);
    return node;
}
function showSettlementScore(endRoot, taskLight, score, scoreFont, scoreDisplay) {
    if (scoreDisplay && is_valid_1.isValid(scoreDisplay.root)) {
        scoreDisplay.setValue(score, false);
        scoreDisplay.setVisible(true);
        scoreDisplay.mountOnEndSettle(endRoot, taskLight.x, taskLight.y + SCORE_ABOVE_TASK_Y);
        scoreDisplay.playSettleReveal();
        return;
    }
    var font = scoreFont || (scoreDisplay ? scoreDisplay.getBitmapFont() : null);
    if (!font) {
        cc.warn('[VictoryEndPanel] 无位图字体，跳过分数字幕');
        return;
    }
    var scoreNode = ensureEndScoreLabel(endRoot, taskLight, font, score);
    playScorePunch(scoreNode);
}
function playScorePunch(scoreNode) {
    scoreNode.stopAllActions();
    scoreNode.active = true;
    scoreNode.opacity = 255;
    scoreNode.setScale(0.35);
    scoreNode.runAction(cc.sequence(cc.spawn(cc.fadeIn(0.06), cc.scaleTo(0.22, SCORE_PUNCH_SCALE).easing(cc.easeBackOut())), cc.scaleTo(SCORE_PUNCH_DURATION, 1).easing(cc.easeSineOut())));
}
function playTaskLightAppear1(taskLight, onDone) {
    taskLight.stopAllActions();
    taskLight.active = true;
    taskLight.opacity = 255;
    var sk = taskLight.getComponent(sp.Skeleton);
    if (!sk) {
        cc.warn('[VictoryEndPanel] TaskLight 缺少 sp.Skeleton');
        onDone();
        return;
    }
    sk.setCompleteListener(null);
    sk.loop = false;
    sk.setAnimation(0, SPINE_TASK_APPEAR, false);
    var done = false;
    var finish = function () {
        if (done) {
            return;
        }
        done = true;
        sk.setCompleteListener(null);
        onDone();
    };
    sk.setCompleteListener(finish);
    taskLight.runAction(cc.sequence(cc.delayTime(TASK_APPEAR_FALLBACK), cc.callFunc(finish, null)));
}
function playDownloadBtnBreathLoop(btn, baseScale) {
    var peak = baseScale * BTN_BREATH_PEAK_RATIO;
    btn.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(BTN_BREATH_HALF_DURATION, peak).easing(cc.easeSineInOut()), cc.scaleTo(BTN_BREATH_HALF_DURATION, baseScale).easing(cc.easeSineInOut()))));
}
function unbindVictoryEndDownloadButton(btn) {
    if (!btn || !is_valid_1.isValid(btn)) {
        return;
    }
    btn.off('click');
    btn.off(cc.Node.EventType.TOUCH_END);
    var button = btn.getComponent(cc.Button);
    if (button) {
        button.clickEvents = [];
    }
}
exports.unbindVictoryEndDownloadButton = unbindVictoryEndDownloadButton;
/** 绑定 download 节点点击（仅 reset 时用；正常绑定在 GameController.bindEndDownloadButton） */
function bindVictoryEndDownloadButton(btn, onClick) {
    if (!btn || !is_valid_1.isValid(btn) || !onClick) {
        return;
    }
    unbindVictoryEndDownloadButton(btn);
    var button = btn.getComponent(cc.Button);
    if (button) {
        button.interactable = true;
        btn.on('click', onClick, btn);
        return;
    }
    btn.on(cc.Node.EventType.TOUCH_END, onClick, btn);
}
exports.bindVictoryEndDownloadButton = bindVictoryEndDownloadButton;
function playDownloadBtnReveal(btn) {
    btn.stopAllActions();
    btn.active = true;
    btn.zIndex = GamePreloadConfig_1.Z_ORDER_END_CHILD.DOWNLOAD;
    var targetScale = Math.max(Math.abs(btn.scaleX), 0.01);
    btn.setScale(targetScale * 0.55);
    btn.opacity = 0;
    btn.runAction(cc.sequence(cc.spawn(cc.fadeIn(BTN_POP_DURATION), cc.sequence(cc.scaleTo(BTN_POP_DURATION, targetScale * 1.08).easing(cc.easeBackOut()), cc.scaleTo(0.08, targetScale).easing(cc.easeSineOut()))), cc.callFunc(function () {
        if (!btn || !is_valid_1.isValid(btn)) {
            return;
        }
        btn.setScale(targetScale);
        playDownloadBtnBreathLoop(btn, targetScale);
    }, null)));
}
/** 下载按钮延时必须挂在 endRoot（勿挂在 active=false 的按钮上） */
function scheduleDownloadBtnReveal(endRoot, btn, delay) {
    endRoot.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function () { return playDownloadBtnReveal(btn); }, null)));
}
function resolveEndRoot(endRoot, nodes) {
    if (endRoot && is_valid_1.isValid(endRoot)) {
        return endRoot;
    }
    if (nodes && nodes.icon && is_valid_1.isValid(nodes.icon.parent)) {
        return nodes.icon.parent;
    }
    return endRoot;
}
function prepareEndPanel(endRoot, nodes) {
    // 兼容旧 quick_compile 缓存：曾写成 prepareEndPanel(nodes)
    var panel = nodes;
    var root = endRoot;
    if (!panel && endRoot && endRoot.icon) {
        panel = endRoot;
        root = panel.icon.parent;
    }
    if (!panel || !panel.icon) {
        cc.warn('[VictoryEndPanel] prepareEndPanel: 无效的 end 节点结构');
        return;
    }
    root = resolveEndRoot(root, panel);
    root.opacity = 255;
    ensureVictoryEndDimBackdrop(root);
    panel.icon.stopAllActions();
    panel.victory.stopAllActions();
    panel.taskLight.stopAllActions();
    panel.downloadBtn.stopAllActions();
    panel.icon.active = true;
    panel.icon.opacity = 0;
    panel.icon.setScale(ICON_START_SCALE);
    panel.victory.active = true;
    panel.victory.opacity = 255;
    hideNode(panel.taskLight);
    hideNodeVisual(panel.downloadBtn);
    var center = getPetalCenter(panel);
    for (var i = 0; i < panel.stars.length; i++) {
        var slot = panel.stars[i];
        slot.node.stopAllActions();
        slot.node.active = false;
        slot.node.opacity = 0;
        slot.node.setPosition(center.x, center.y);
        slot.node.setScale(STAR_START_SCALE);
    }
    destroyEndScoreLabel(root);
}
function playStepTaskAndScore(endRoot, nodes, score, scoreFont, scoreDisplay) {
    playTaskLightAppear1(nodes.taskLight, function () { });
    showSettlementScore(endRoot, nodes.taskLight, score, scoreFont, scoreDisplay);
    scheduleDownloadBtnReveal(endRoot, nodes.downloadBtn, STEP_BTN_AFTER_SCORE);
}
/**
 * ① icon 弹跳 + victory Appear（并行）
 * ② Appear 结束 → 星星飞出，并短延迟重叠 TaskLight + 分数
 * ③ 下载按钮
 */
function playVictoryEndSequence(endRoot, score, scoreFont, scoreDisplay) {
    if (scoreDisplay === void 0) { scoreDisplay = null; }
    var nodes = getEndNodes(endRoot);
    if (!nodes) {
        return;
    }
    prepareEndPanel(endRoot, nodes);
    endRoot.stopAllActions();
    var center = getPetalCenter(nodes);
    playIconPopBounce(nodes.icon, nodes.iconTargetScale);
    playVictoryAppearThenLoop(nodes.victory, function () {
        playStarsPop(nodes.stars, center);
        endRoot.runAction(cc.sequence(cc.delayTime(STEP_TASK_OVERLAP), cc.callFunc(function () { return playStepTaskAndScore(endRoot, nodes, score, scoreFont, scoreDisplay); }, null)));
    });
}
exports.playVictoryEndSequence = playVictoryEndSequence;
/** @deprecated 使用 playVictoryEndSequence */
function playVictoryEndSequenceLegacy(endRoot) {
    playVictoryEndSequence(endRoot, 0, null);
}
exports.playVictoryEndSequenceLegacy = playVictoryEndSequenceLegacy;
/** @deprecated */
function playVictoryEndUnlock(endRoot) {
    playVictoryEndSequence(endRoot, 0, null);
}
exports.playVictoryEndUnlock = playVictoryEndUnlock;
function resetVictoryEndUnlock(endRoot) {
    if (!endRoot || !is_valid_1.isValid(endRoot)) {
        return;
    }
    endRoot.stopAllActions();
    var nodes = getEndNodes(endRoot);
    if (!nodes) {
        return;
    }
    var victorySk = nodes.victory.getComponent(sp.Skeleton);
    if (victorySk) {
        victorySk.setCompleteListener(null);
        victorySk.loop = false;
    }
    var taskSk = nodes.taskLight.getComponent(sp.Skeleton);
    if (taskSk) {
        taskSk.setCompleteListener(null);
        taskSk.loop = false;
    }
    nodes.icon.stopAllActions();
    nodes.icon.active = true;
    nodes.icon.opacity = 255;
    nodes.icon.setScale(nodes.iconTargetScale);
    nodes.victory.stopAllActions();
    nodes.victory.active = true;
    nodes.victory.opacity = 255;
    nodes.taskLight.stopAllActions();
    nodes.taskLight.active = true;
    nodes.taskLight.opacity = 255;
    nodes.downloadBtn.stopAllActions();
    unbindVictoryEndDownloadButton(nodes.downloadBtn);
    nodes.downloadBtn.active = true;
    nodes.downloadBtn.zIndex = GamePreloadConfig_1.Z_ORDER_END_CHILD.DOWNLOAD;
    nodes.downloadBtn.opacity = 255;
    nodes.downloadBtn.setScale(Math.max(Math.abs(nodes.downloadBtn.scaleX), 0.01));
    endRoot.opacity = 255;
    ensureVictoryEndDimBackdrop(endRoot);
    destroyEndScoreLabel(endRoot);
    for (var i = 0; i < nodes.stars.length; i++) {
        var slot = nodes.stars[i];
        slot.node.stopAllActions();
        slot.node.active = true;
        slot.node.setPosition(slot.targetX, slot.targetY);
        slot.node.setScale(1);
        slot.node.opacity = 255;
    }
}
exports.resetVictoryEndUnlock = resetVictoryEndUnlock;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvdWkvVmljdG9yeUVuZFBhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkFBaUI7OztBQUVqQix3Q0FBc0M7QUFDdEMseURBQXdEO0FBRXhELGlEQUFxRDtBQUVyRCxJQUFNLHFCQUFxQixHQUFHLGtCQUFrQixDQUFDO0FBQ2pELHlCQUF5QjtBQUN6QixJQUFNLGVBQWUsR0FBRyxHQUFHLENBQUM7QUFFNUIsSUFBSSxzQkFBc0IsR0FBbUIsSUFBSSxDQUFDO0FBRWxELFNBQVMsbUJBQW1CO0lBQ3hCLElBQUksc0JBQXNCLEVBQUU7UUFDeEIsT0FBTyxzQkFBc0IsQ0FBQztLQUNqQztJQUNELElBQU0sR0FBRyxHQUFHLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQy9CLEdBQUcsQ0FBQyxZQUFZLENBQ1osSUFBSSxVQUFVLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUNwQyxFQUFFLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQ2pDLENBQUMsRUFDRCxDQUFDLENBQ0osQ0FBQztJQUNGLHNCQUFzQixHQUFHLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzlDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2QyxPQUFPLHNCQUFzQixDQUFDO0FBQ2xDLENBQUM7QUFFRCxJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUM7QUFDekIsSUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDO0FBQy9CLElBQU0sZUFBZSxHQUFHLFdBQVcsQ0FBQztBQUNwQyxpQ0FBaUM7QUFDakMsSUFBTSxrQkFBa0IsR0FBRyxDQUFDLFVBQVUsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO0FBQ2xFLElBQU0sY0FBYyxHQUFHLFdBQVcsQ0FBQztBQUNuQyxJQUFNLFVBQVUsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFFL0MsSUFBTSxvQkFBb0IsR0FBRyxRQUFRLENBQUM7QUFDdEMsSUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUM7QUFDbEMsSUFBTSxpQkFBaUIsR0FBRyxTQUFTLENBQUM7QUFFcEMsK0JBQStCO0FBQy9CLElBQU0sdUJBQXVCLEdBQUcsSUFBSSxDQUFDO0FBQ3JDLHVCQUF1QjtBQUN2QixJQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQztBQUM5QixJQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQztBQUMvQixJQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQztBQUNsQyxJQUFNLGdCQUFnQixHQUFHLEdBQUcsQ0FBQztBQUM3QixJQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQztBQUM5QixJQUFNLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDMUIsa0NBQWtDO0FBQ2xDLElBQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDO0FBQ2xDLG9DQUFvQztBQUNwQyxJQUFNLGtCQUFrQixHQUFHLENBQUMsQ0FBQztBQUM3QixJQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUM3QixJQUFNLGVBQWUsR0FBRyxFQUFFLENBQUM7QUFDM0IsSUFBTSxpQkFBaUIsR0FBRyxFQUFFLENBQUM7QUFDN0IsSUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUM7QUFDL0IsSUFBTSxvQkFBb0IsR0FBRyxHQUFHLENBQUM7QUFDakMsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFDOUIsMkJBQTJCO0FBQzNCLElBQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDO0FBQ25DLElBQU0sd0JBQXdCLEdBQUcsSUFBSSxDQUFDO0FBQ3RDLDRDQUE0QztBQUM1QyxJQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQztBQUMvQixtQkFBbUI7QUFDbkIsSUFBTSxvQkFBb0IsR0FBRyxDQUFDLENBQUM7QUFLbEIsUUFBQSxpQkFBaUIsR0FBRztJQUM3QixZQUFZLEVBQUUsQ0FBQztJQUNmLFlBQVksRUFBRSxFQUFFO0NBQ25CLENBQUM7QUFpQkYsU0FBUyxlQUFlLENBQUMsT0FBZ0I7SUFDckMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNoRCxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0QsSUFBSSxJQUFJLElBQUksa0JBQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN2QixPQUFPLElBQUksQ0FBQztTQUNmO0tBQ0o7SUFDRCxJQUFNLEtBQUssR0FBYyxFQUFFLENBQUM7SUFDNUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDNUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbkM7SUFDRCxPQUFPLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ3JCLElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsa0JBQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN2QixTQUFTO1NBQ1o7UUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2hELElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDcEMsT0FBTyxHQUFHLENBQUM7YUFDZDtTQUNKO1FBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDeEMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDL0I7S0FDSjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxPQUFnQjtJQUNqQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsa0JBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUMvQixPQUFPLElBQUksQ0FBQztLQUNmO0lBQ0QsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMvQyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3JELElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDMUQsSUFBTSxXQUFXLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxXQUFXLEVBQUU7UUFDakQsRUFBRSxDQUFDLElBQUksQ0FBQyx1RUFBdUUsQ0FBQyxDQUFDO1FBQ2pGLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzlELElBQU0sS0FBSyxHQUFlLEVBQUUsQ0FBQztJQUM3QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN4QyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELElBQUksSUFBSSxJQUFJLGtCQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdkIsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBQSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUMxRDtLQUNKO0lBQ0QsT0FBTyxFQUFFLElBQUksTUFBQSxFQUFFLGVBQWUsaUJBQUEsRUFBRSxPQUFPLFNBQUEsRUFBRSxTQUFTLFdBQUEsRUFBRSxXQUFXLGFBQUEsRUFBRSxLQUFLLE9BQUEsRUFBRSxDQUFDO0FBQzdFLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxLQUFlO0lBQ25DLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFFRCxTQUFTLGdCQUFnQixDQUFDLE9BQWdCO0lBQ3RDLElBQU0sTUFBTSxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQ3pDLE9BQU8sTUFBTSxJQUFJLGtCQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ3JELENBQUM7QUFFRCw2Q0FBNkM7QUFDN0MsU0FBZ0IsMkJBQTJCLENBQUMsT0FBZ0IsRUFBRSxNQUFnQjtJQUMxRSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsa0JBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUMvQixPQUFPLElBQUksQ0FBQztLQUNmO0lBQ0QsSUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFJLGtCQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEYsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUNiLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFFRCxJQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxrQkFBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ3JCLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFFRCx5Q0FBeUM7SUFDekMsT0FBTyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztJQUMvQixPQUFPLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztJQUV0QixJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDeEQsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGtCQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDdkIsR0FBRyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQ3pDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQy9CO0lBRUQsSUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEQsSUFBSSxXQUFXLEVBQUU7UUFDYixXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDekI7SUFFRCxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN6QyxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ1QsTUFBTSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3hDO0lBQ0QsTUFBTSxDQUFDLFdBQVcsR0FBRyxtQkFBbUIsRUFBRSxDQUFDO0lBQzNDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3BDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0lBRTVDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ2xCLEdBQUcsQ0FBQyxNQUFNLEdBQUcscUNBQWlCLENBQUMsWUFBWSxDQUFDO0lBQzVDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDM0IsR0FBRyxDQUFDLE9BQU8sR0FBRyxlQUFlLENBQUM7SUFDOUIsR0FBRyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4QyxrQ0FBa0IsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFFcEMsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBL0NELGtFQStDQztBQUVELFNBQWdCLDJCQUEyQixDQUFDLE9BQWdCLEVBQUUsTUFBZ0I7SUFDMUUsMkJBQTJCLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2pELENBQUM7QUFGRCxrRUFFQztBQUVELFNBQVMsUUFBUSxDQUFDLElBQWE7SUFDM0IsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLENBQUM7QUFFRCx3REFBd0Q7QUFDeEQsU0FBUyxjQUFjLENBQUMsSUFBYTtJQUNqQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFDckIsQ0FBQztBQUVELHNFQUFzRTtBQUN0RSxTQUFTLGlCQUFpQixDQUFDLElBQWEsRUFBRSxXQUFtQjtJQUN6RCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFDakIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ2hDLElBQU0sSUFBSSxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDaEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUN0QixFQUFFLENBQUMsS0FBSyxDQUNKLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQ2QsRUFBRSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQy9ELEVBQ0QsRUFBRSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQ3pFLENBQUMsQ0FBQztBQUNQLENBQUM7QUFFRCxTQUFTLHlCQUF5QixDQUFDLE9BQWdCLEVBQUUsWUFBd0I7SUFDekUsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDdEIsT0FBTyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7SUFDdEIsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0MsSUFBSSxDQUFDLEVBQUUsRUFBRTtRQUNMLEVBQUUsQ0FBQyxJQUFJLENBQUMsMENBQTBDLENBQUMsQ0FBQztRQUNwRCxZQUFZLEVBQUUsQ0FBQztRQUNmLE9BQU87S0FDVjtJQUNELEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixFQUFFLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUNoQixFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxvQkFBb0IsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoRCxJQUFJLElBQUksR0FBRyxLQUFLLENBQUM7SUFDakIsSUFBTSxNQUFNLEdBQUc7UUFDWCxJQUFJLElBQUksSUFBSSxDQUFDLGtCQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDM0IsT0FBTztTQUNWO1FBQ0QsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNaLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNmLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdDLFlBQVksRUFBRSxDQUFDO0lBQ25CLENBQUMsQ0FBQztJQUNGLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQixPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQ3pCLEVBQUUsQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsRUFDckMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQzVCLENBQUMsQ0FBQztBQUNQLENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBQyxLQUFpQixFQUFFLE1BQWU7SUFDcEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDbkMsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FDdEIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLEVBQzlCLEVBQUUsQ0FBQyxLQUFLLENBQ0osRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFDZixFQUFFLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsRUFDakYsRUFBRSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQzVELENBQ0osQ0FBQyxDQUFDO0tBQ047QUFDTCxDQUFDO0FBRUQsU0FBUyxvQkFBb0IsQ0FBQyxPQUFnQjtJQUMxQyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ25ELElBQUksR0FBRyxJQUFJLGtCQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDckIsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ2pCO0FBQ0wsQ0FBQztBQUVELG9EQUFvRDtBQUNwRCxTQUFTLG1CQUFtQixDQUN4QixPQUFnQixFQUNoQixTQUFrQixFQUNsQixJQUFtQixFQUNuQixLQUFhO0lBRWIsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUIsSUFBTSxJQUFJLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3pDLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2xCLEtBQUssQ0FBQyxRQUFRLEdBQUcsZUFBZSxDQUFDO0lBQ2pDLEtBQUssQ0FBQyxVQUFVLEdBQUcsaUJBQWlCLENBQUM7SUFDckMsS0FBSyxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7SUFDN0IsS0FBSyxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUM7SUFDeEQsS0FBSyxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7SUFDcEQsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDOUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUcsa0JBQWtCLENBQUMsQ0FBQztJQUNoRSxJQUFJLENBQUMsTUFBTSxHQUFHLGlCQUFpQixDQUFDO0lBQ2hDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkIsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQztBQUVELFNBQVMsbUJBQW1CLENBQ3hCLE9BQWdCLEVBQ2hCLFNBQWtCLEVBQ2xCLEtBQWEsRUFDYixTQUErQixFQUMvQixZQUFvQztJQUVwQyxJQUFJLFlBQVksSUFBSSxrQkFBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUM1QyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNwQyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLFlBQVksQ0FBQyxnQkFBZ0IsQ0FDekIsT0FBTyxFQUNQLFNBQVMsQ0FBQyxDQUFDLEVBQ1gsU0FBUyxDQUFDLENBQUMsR0FBRyxrQkFBa0IsQ0FDbkMsQ0FBQztRQUNGLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ2hDLE9BQU87S0FDVjtJQUNELElBQU0sSUFBSSxHQUFHLFNBQVMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvRSxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ1AsRUFBRSxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQzFDLE9BQU87S0FDVjtJQUNELElBQU0sU0FBUyxHQUFHLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3ZFLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM5QixDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsU0FBa0I7SUFDdEMsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzNCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLFNBQVMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO0lBQ3hCLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekIsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUMzQixFQUFFLENBQUMsS0FBSyxDQUNKLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQ2YsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQy9ELEVBQ0QsRUFBRSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQy9ELENBQUMsQ0FBQztBQUNQLENBQUM7QUFFRCxTQUFTLG9CQUFvQixDQUFDLFNBQWtCLEVBQUUsTUFBa0I7SUFDaEUsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzNCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLFNBQVMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO0lBQ3hCLElBQU0sRUFBRSxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQy9DLElBQUksQ0FBQyxFQUFFLEVBQUU7UUFDTCxFQUFFLENBQUMsSUFBSSxDQUFDLDRDQUE0QyxDQUFDLENBQUM7UUFDdEQsTUFBTSxFQUFFLENBQUM7UUFDVCxPQUFPO0tBQ1Y7SUFDRCxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0IsRUFBRSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7SUFDaEIsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0MsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQ2pCLElBQU0sTUFBTSxHQUFHO1FBQ1gsSUFBSSxJQUFJLEVBQUU7WUFDTixPQUFPO1NBQ1Y7UUFDRCxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ1osRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLE1BQU0sRUFBRSxDQUFDO0lBQ2IsQ0FBQyxDQUFDO0lBQ0YsRUFBRSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FDM0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUNsQyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FDNUIsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUVELFNBQVMseUJBQXlCLENBQUMsR0FBWSxFQUFFLFNBQWlCO0lBQzlELElBQU0sSUFBSSxHQUFHLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQztJQUMvQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FDdEMsRUFBRSxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLEVBQ3JFLEVBQUUsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEVBQUUsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUM3RSxDQUFDLENBQUMsQ0FBQztBQUNSLENBQUM7QUFFRCxTQUFnQiw4QkFBOEIsQ0FBQyxHQUFZO0lBQ3ZELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxrQkFBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3ZCLE9BQU87S0FDVjtJQUNELEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyQyxJQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMzQyxJQUFJLE1BQU0sRUFBRTtRQUNSLE1BQU0sQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0tBQzNCO0FBQ0wsQ0FBQztBQVZELHdFQVVDO0FBRUQsOEVBQThFO0FBQzlFLFNBQWdCLDRCQUE0QixDQUFDLEdBQVksRUFBRSxPQUFtQztJQUMxRixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsa0JBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtRQUNuQyxPQUFPO0tBQ1Y7SUFDRCw4QkFBOEIsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwQyxJQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMzQyxJQUFJLE1BQU0sRUFBRTtRQUNSLE1BQU0sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQzNCLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM5QixPQUFPO0tBQ1Y7SUFDRCxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdEQsQ0FBQztBQVpELG9FQVlDO0FBRUQsU0FBUyxxQkFBcUIsQ0FBQyxHQUFZO0lBQ3ZDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUNyQixHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUNsQixHQUFHLENBQUMsTUFBTSxHQUFHLHFDQUFpQixDQUFDLFFBQVEsQ0FBQztJQUN4QyxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3pELEdBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ2pDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FDckIsRUFBRSxDQUFDLEtBQUssQ0FDSixFQUFFLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEVBQzNCLEVBQUUsQ0FBQyxRQUFRLENBQ1AsRUFBRSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUN6RSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQ3pELENBQ0osRUFDRCxFQUFFLENBQUMsUUFBUSxDQUFDO1FBQ1IsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGtCQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDdkIsT0FBTztTQUNWO1FBQ0QsR0FBRyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMxQix5QkFBeUIsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDaEQsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUNYLENBQUMsQ0FBQztBQUNQLENBQUM7QUFFRCxnREFBZ0Q7QUFDaEQsU0FBUyx5QkFBeUIsQ0FBQyxPQUFnQixFQUFFLEdBQVksRUFBRSxLQUFhO0lBQzVFLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FDekIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFDbkIsRUFBRSxDQUFDLFFBQVEsQ0FBQyxjQUFNLE9BQUEscUJBQXFCLENBQUMsR0FBRyxDQUFDLEVBQTFCLENBQTBCLEVBQUUsSUFBSSxDQUFDLENBQ3RELENBQUMsQ0FBQztBQUNQLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxPQUFnQixFQUFFLEtBQWU7SUFDckQsSUFBSSxPQUFPLElBQUksa0JBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUM3QixPQUFPLE9BQU8sQ0FBQztLQUNsQjtJQUNELElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksa0JBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ25ELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7S0FDNUI7SUFDRCxPQUFPLE9BQU8sQ0FBQztBQUNuQixDQUFDO0FBRUQsU0FBUyxlQUFlLENBQUMsT0FBZ0IsRUFBRSxLQUFnQjtJQUN2RCxrREFBa0Q7SUFDbEQsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ2xCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQztJQUNuQixJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sSUFBSyxPQUFvQixDQUFDLElBQUksRUFBRTtRQUNqRCxLQUFLLEdBQUcsT0FBOEIsQ0FBQztRQUN2QyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7S0FDNUI7SUFDRCxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtRQUN2QixFQUFFLENBQUMsSUFBSSxDQUFDLGlEQUFpRCxDQUFDLENBQUM7UUFDM0QsT0FBTztLQUNWO0lBQ0QsSUFBSSxHQUFHLGNBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7SUFDbkIsMkJBQTJCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFbEMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUM1QixLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQy9CLEtBQUssQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDakMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUVuQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDekIsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZCLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFFdEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQzVCLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztJQUU1QixRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFCLGNBQWMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFFbEMsSUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN6QyxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0tBQ3hDO0lBRUQsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQUVELFNBQVMsb0JBQW9CLENBQ3pCLE9BQWdCLEVBQ2hCLEtBQWUsRUFDZixLQUFhLEVBQ2IsU0FBK0IsRUFDL0IsWUFBb0M7SUFFcEMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxjQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ2hELG1CQUFtQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDOUUseUJBQXlCLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQUNoRixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLHNCQUFzQixDQUNsQyxPQUFnQixFQUNoQixLQUFhLEVBQ2IsU0FBK0IsRUFDL0IsWUFBMkM7SUFBM0MsNkJBQUEsRUFBQSxtQkFBMkM7SUFFM0MsSUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ25DLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDUixPQUFPO0tBQ1Y7SUFDRCxlQUFlLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUV6QixJQUFNLE1BQU0sR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFckMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDckQseUJBQXlCLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRTtRQUNyQyxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNsQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQ3pCLEVBQUUsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsRUFDL0IsRUFBRSxDQUFDLFFBQVEsQ0FDUCxjQUFNLE9BQUEsb0JBQW9CLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFlBQVksQ0FBQyxFQUFwRSxDQUFvRSxFQUMxRSxJQUFJLENBQ1AsQ0FDSixDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUExQkQsd0RBMEJDO0FBRUQsNENBQTRDO0FBQzVDLFNBQWdCLDRCQUE0QixDQUFDLE9BQWdCO0lBQ3pELHNCQUFzQixDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUZELG9FQUVDO0FBRUQsa0JBQWtCO0FBQ2xCLFNBQWdCLG9CQUFvQixDQUFDLE9BQWdCO0lBQ2pELHNCQUFzQixDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUZELG9EQUVDO0FBRUQsU0FBZ0IscUJBQXFCLENBQUMsT0FBZ0I7SUFDbEQsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLGtCQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDL0IsT0FBTztLQUNWO0lBQ0QsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3pCLElBQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuQyxJQUFJLENBQUMsS0FBSyxFQUFFO1FBQ1IsT0FBTztLQUNWO0lBRUQsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzFELElBQUksU0FBUyxFQUFFO1FBQ1gsU0FBUyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0tBQzFCO0lBQ0QsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pELElBQUksTUFBTSxFQUFFO1FBQ1IsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0tBQ3ZCO0lBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUM1QixLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDekIsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO0lBQ3pCLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUUzQyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQy9CLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUM1QixLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7SUFFNUIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUNqQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDOUIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO0lBRTlCLEtBQUssQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDbkMsOEJBQThCLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ2xELEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUNoQyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxxQ0FBaUIsQ0FBQyxRQUFRLENBQUM7SUFDdEQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO0lBQ2hDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFL0UsT0FBTyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7SUFDdEIsMkJBQTJCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFckMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3pDLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO0tBQzNCO0FBQ0wsQ0FBQztBQXRERCxzREFzREMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvKiogZW5kIOe7k+eul+WIhuatpeWKqOeUuyAqL1xuXG5pbXBvcnQgeyBpc1ZhbGlkIH0gZnJvbSAnLi4vaXMtdmFsaWQnO1xuaW1wb3J0IHsgWl9PUkRFUl9FTkRfQ0hJTEQgfSBmcm9tICcuL0dhbWVQcmVsb2FkQ29uZmlnJztcbmltcG9ydCB7IEFydFNjb3JlRGlzcGxheSB9IGZyb20gJy4vQXJ0U2NvcmVEaXNwbGF5JztcbmltcG9ydCB7IGxheW91dFNob3dBbGxDb3ZlciB9IGZyb20gJy4vU2hvd0FsbExheW91dCc7XG5cbmNvbnN0IEVORF9ESU1fQkFDS0RST1BfTkFNRSA9ICdlbmRfZGltX2JhY2tkcm9wJztcbi8qKiDnuq/pu5Hpga7nvanpgI/mmI7luqYgMC4177yIMOKAkzI1Ne+8iSAqL1xuY29uc3QgRU5EX0RJTV9PUEFDSVRZID0gMTI4O1xuXG5sZXQgY2FjaGVkV2hpdGVTcHJpdGVGcmFtZTogY2MuU3ByaXRlRnJhbWUgPSBudWxsO1xuXG5mdW5jdGlvbiBnZXRXaGl0ZVNwcml0ZUZyYW1lKCk6IGNjLlNwcml0ZUZyYW1lIHtcbiAgICBpZiAoY2FjaGVkV2hpdGVTcHJpdGVGcmFtZSkge1xuICAgICAgICByZXR1cm4gY2FjaGVkV2hpdGVTcHJpdGVGcmFtZTtcbiAgICB9XG4gICAgY29uc3QgdGV4ID0gbmV3IGNjLlRleHR1cmUyRCgpO1xuICAgIHRleC5pbml0V2l0aERhdGEoXG4gICAgICAgIG5ldyBVaW50OEFycmF5KFsyNTUsIDI1NSwgMjU1LCAyNTVdKSxcbiAgICAgICAgY2MuVGV4dHVyZTJELlBpeGVsRm9ybWF0LlJHQkE4ODg4LFxuICAgICAgICAxLFxuICAgICAgICAxXG4gICAgKTtcbiAgICBjYWNoZWRXaGl0ZVNwcml0ZUZyYW1lID0gbmV3IGNjLlNwcml0ZUZyYW1lKCk7XG4gICAgY2FjaGVkV2hpdGVTcHJpdGVGcmFtZS5zZXRUZXh0dXJlKHRleCk7XG4gICAgcmV0dXJuIGNhY2hlZFdoaXRlU3ByaXRlRnJhbWU7XG59XG5cbmNvbnN0IE5PREVfSUNPTiA9ICdpY29uJztcbmNvbnN0IE5PREVfVklDVE9SWSA9ICd2aWN0b3J5JztcbmNvbnN0IE5PREVfVEFTS19MSUdIVCA9ICdUYXNrTGlnaHQnO1xuLyoqIOWcuuaZr+mHjOW4uOingeiKgueCueWQje+8iOS8mOWFiCBkb3dubG9hZO+8jOWFvOWuueaXp+WQje+8iSAqL1xuY29uc3QgRE9XTkxPQURfQlROX05BTUVTID0gWydkb3dubG9hZCcsICdidG5fZG93bmxvYWRfZW5fMjUweDgwJ107XG5jb25zdCBOT0RFX0VORF9TQ09SRSA9ICdlbmRfc2NvcmUnO1xuY29uc3QgU1RBUl9OQU1FUyA9IFsnc3RhcjEnLCAnc3RhcjInLCAnc3RhcjMnXTtcblxuY29uc3QgU1BJTkVfVklDVE9SWV9BUFBFQVIgPSAnQXBwZWFyJztcbmNvbnN0IFNQSU5FX1ZJQ1RPUllfTE9PUCA9ICdMb29wJztcbmNvbnN0IFNQSU5FX1RBU0tfQVBQRUFSID0gJ0FwcGVhcjEnO1xuXG4vKiogdmljdG9yeSBBcHBlYXIg55uR5ZCs6LaF5pe25YWc5bqV77yI56eS77yJICovXG5jb25zdCBWSUNUT1JZX0FQUEVBUl9GQUxMQkFDSyA9IDAuNzI7XG4vKiogaWNvbiDku47lsI/mlL7lpKfliLDlnLrmma/orr7orqHnvKnmlL4gKi9cbmNvbnN0IElDT05fU1RBUlRfU0NBTEUgPSAwLjE1O1xuY29uc3QgSUNPTl9QT1BfRFVSQVRJT04gPSAwLjI2O1xuY29uc3QgSUNPTl9TRVRUTEVfRFVSQVRJT04gPSAwLjA4O1xuY29uc3QgU1RBUl9TVEFSVF9TQ0FMRSA9IDAuMTtcbmNvbnN0IFNUQVJfUE9QX0RVUkFUSU9OID0gMC4zO1xuY29uc3QgU1RBUl9TVEFHR0VSID0gMC4wNztcbi8qKiBUYXNrTGlnaHQgQXBwZWFyMSDnm5HlkKzotoXml7blhZzlupXvvIjnp5LvvIkgKi9cbmNvbnN0IFRBU0tfQVBQRUFSX0ZBTExCQUNLID0gMC45NTtcbi8qKiDnm7jlr7kgVGFza0xpZ2h0IOeahCBZIOWBj+enu++8iGVuZCDmnKzlnLDlnZDmoIfvvIkgKi9cbmNvbnN0IFNDT1JFX0FCT1ZFX1RBU0tfWSA9IDA7XG5jb25zdCBFTkRfU0NPUkVfWl9JTkRFWCA9IDU1O1xuY29uc3QgU0NPUkVfRk9OVF9TSVpFID0gNTQ7XG5jb25zdCBTQ09SRV9MSU5FX0hFSUdIVCA9IDcwO1xuY29uc3QgU0NPUkVfUFVOQ0hfU0NBTEUgPSAxLjA4O1xuY29uc3QgU0NPUkVfUFVOQ0hfRFVSQVRJT04gPSAwLjE7XG5jb25zdCBCVE5fUE9QX0RVUkFUSU9OID0gMC4yNDtcbi8qKiDkuIvovb3mjInpkq7lvLnlh7rlkI7nmoTlkbzlkLjnvKnmlL7vvIjnm7jlr7norr7orqHnvKnmlL7vvIkgKi9cbmNvbnN0IEJUTl9CUkVBVEhfUEVBS19SQVRJTyA9IDEuMDY7XG5jb25zdCBCVE5fQlJFQVRIX0hBTEZfRFVSQVRJT04gPSAwLjU1O1xuLyoqIOaYn+aYn+W8ueWHuuWQjuWkmuS5heaOpSBUYXNrTGlnaHQgLyDliIbmlbDvvIjlj6/ph43lj6DvvIzkuI3lv4XnrYnmmJ/mmJ/lhajnu5PmnZ/vvIkgKi9cbmNvbnN0IFNURVBfVEFTS19PVkVSTEFQID0gMC4xODtcbi8qKiDliIbmlbDlvLnlh7rlkI7lpJrkuYXlh7rkuIvovb3mjInpkq4gKi9cbmNvbnN0IFNURVBfQlROX0FGVEVSX1NDT1JFID0gMDtcblxuLyoqIOe7k+eul+mhtSBkb3dubG9hZCDmjInpkq7ngrnlh7sgKi9cbmV4cG9ydCB0eXBlIFZpY3RvcnlFbmREb3dubG9hZENhbGxiYWNrID0gKCkgPT4gdm9pZDtcblxuZXhwb3J0IGNvbnN0IFZJQ1RPUllfRU5EX1NUWUxFID0ge1xuICAgIHBldGFsQ2VudGVyWDogMCxcbiAgICBwZXRhbENlbnRlclk6IDYwLFxufTtcblxuaW50ZXJmYWNlIFN0YXJTbG90IHtcbiAgICBub2RlOiBjYy5Ob2RlO1xuICAgIHRhcmdldFg6IG51bWJlcjtcbiAgICB0YXJnZXRZOiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBFbmROb2RlcyB7XG4gICAgaWNvbjogY2MuTm9kZTtcbiAgICBpY29uVGFyZ2V0U2NhbGU6IG51bWJlcjtcbiAgICB2aWN0b3J5OiBjYy5Ob2RlO1xuICAgIHRhc2tMaWdodDogY2MuTm9kZTtcbiAgICBkb3dubG9hZEJ0bjogY2MuTm9kZTtcbiAgICBzdGFyczogU3RhclNsb3RbXTtcbn1cblxuZnVuY3Rpb24gZmluZERvd25sb2FkQnRuKGVuZFJvb3Q6IGNjLk5vZGUpOiBjYy5Ob2RlIHwgbnVsbCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBET1dOTE9BRF9CVE5fTkFNRVMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGVuZFJvb3QuZ2V0Q2hpbGRCeU5hbWUoRE9XTkxPQURfQlROX05BTUVTW2ldKTtcbiAgICAgICAgaWYgKG5vZGUgJiYgaXNWYWxpZChub2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3Qgc3RhY2s6IGNjLk5vZGVbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW5kUm9vdC5jaGlsZHJlbkNvdW50OyBpKyspIHtcbiAgICAgICAgc3RhY2sucHVzaChlbmRSb290LmNoaWxkcmVuW2ldKTtcbiAgICB9XG4gICAgd2hpbGUgKHN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgY3VyID0gc3RhY2sucG9wKCk7XG4gICAgICAgIGlmICghY3VyIHx8ICFpc1ZhbGlkKGN1cikpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgRE9XTkxPQURfQlROX05BTUVTLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAoY3VyLm5hbWUgPT09IERPV05MT0FEX0JUTl9OQU1FU1tqXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBjdXIuY2hpbGRyZW5Db3VudDsgaysrKSB7XG4gICAgICAgICAgICBzdGFjay5wdXNoKGN1ci5jaGlsZHJlbltrXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGdldEVuZE5vZGVzKGVuZFJvb3Q6IGNjLk5vZGUpOiBFbmROb2RlcyB8IG51bGwge1xuICAgIGlmICghZW5kUm9vdCB8fCAhaXNWYWxpZChlbmRSb290KSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgaWNvbiA9IGVuZFJvb3QuZ2V0Q2hpbGRCeU5hbWUoTk9ERV9JQ09OKTtcbiAgICBjb25zdCB2aWN0b3J5ID0gZW5kUm9vdC5nZXRDaGlsZEJ5TmFtZShOT0RFX1ZJQ1RPUlkpO1xuICAgIGNvbnN0IHRhc2tMaWdodCA9IGVuZFJvb3QuZ2V0Q2hpbGRCeU5hbWUoTk9ERV9UQVNLX0xJR0hUKTtcbiAgICBjb25zdCBkb3dubG9hZEJ0biA9IGZpbmREb3dubG9hZEJ0bihlbmRSb290KTtcbiAgICBpZiAoIWljb24gfHwgIXZpY3RvcnkgfHwgIXRhc2tMaWdodCB8fCAhZG93bmxvYWRCdG4pIHtcbiAgICAgICAgY2Mud2FybignW1ZpY3RvcnlFbmRQYW5lbF0gZW5kIOWtkOiKgueCuee8uuWkse+8jOmcgOWMheWQqyBpY29uIC8gdmljdG9yeSAvIFRhc2tMaWdodCAvIGRvd25sb2FkJyk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBpY29uVGFyZ2V0U2NhbGUgPSBNYXRoLm1heChNYXRoLmFicyhpY29uLnNjYWxlWCksIDAuMDEpO1xuICAgIGNvbnN0IHN0YXJzOiBTdGFyU2xvdFtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBTVEFSX05BTUVTLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBlbmRSb290LmdldENoaWxkQnlOYW1lKFNUQVJfTkFNRVNbaV0pO1xuICAgICAgICBpZiAobm9kZSAmJiBpc1ZhbGlkKG5vZGUpKSB7XG4gICAgICAgICAgICBzdGFycy5wdXNoKHsgbm9kZSwgdGFyZ2V0WDogbm9kZS54LCB0YXJnZXRZOiBub2RlLnkgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHsgaWNvbiwgaWNvblRhcmdldFNjYWxlLCB2aWN0b3J5LCB0YXNrTGlnaHQsIGRvd25sb2FkQnRuLCBzdGFycyB9O1xufVxuXG5mdW5jdGlvbiBnZXRQZXRhbENlbnRlcihub2RlczogRW5kTm9kZXMpOiBjYy5WZWMyIHtcbiAgICByZXR1cm4gY2MudjIobm9kZXMudmljdG9yeS54LCBub2Rlcy52aWN0b3J5LnkpO1xufVxuXG5mdW5jdGlvbiBnZXRDYW52YXNGcm9tRW5kKGVuZFJvb3Q6IGNjLk5vZGUpOiBjYy5Ob2RlIHwgbnVsbCB7XG4gICAgY29uc3QgcGFyZW50ID0gZW5kUm9vdCAmJiBlbmRSb290LnBhcmVudDtcbiAgICByZXR1cm4gcGFyZW50ICYmIGlzVmFsaWQocGFyZW50KSA/IHBhcmVudCA6IG51bGw7XG59XG5cbi8qKiBlbmQg5pyA5bqV5bGC5Y2K6YCP5piO6buR5bqV77yM5bC65a+45LiOIGJnIOebuOWQjO+8iFNIT1dfQUxMIGNvdmVy77yJICovXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlVmljdG9yeUVuZERpbUJhY2tkcm9wKGVuZFJvb3Q6IGNjLk5vZGUsIGNhbnZhcz86IGNjLk5vZGUpOiBjYy5Ob2RlIHwgbnVsbCB7XG4gICAgaWYgKCFlbmRSb290IHx8ICFpc1ZhbGlkKGVuZFJvb3QpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBjYW52YXNOb2RlID0gY2FudmFzICYmIGlzVmFsaWQoY2FudmFzKSA/IGNhbnZhcyA6IGdldENhbnZhc0Zyb21FbmQoZW5kUm9vdCk7XG4gICAgaWYgKCFjYW52YXNOb2RlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGJnID0gY2FudmFzTm9kZS5nZXRDaGlsZEJ5TmFtZSgnYmcnKTtcbiAgICBpZiAoIWJnIHx8ICFpc1ZhbGlkKGJnKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyDlnLrmma/ph4wgZW5kIOW4uOS4uum7keiJsiBjb2xvcu+8jOS8muS5mOWIsOWtkOiKgueCueS4iuWvvOiHtOmBrue9qeWPkemXt+OAgeeci+S4jeWHuumAj+aYjlxuICAgIGVuZFJvb3QuY29sb3IgPSBjYy5Db2xvci5XSElURTtcbiAgICBlbmRSb290Lm9wYWNpdHkgPSAyNTU7XG5cbiAgICBsZXQgZGltID0gZW5kUm9vdC5nZXRDaGlsZEJ5TmFtZShFTkRfRElNX0JBQ0tEUk9QX05BTUUpO1xuICAgIGlmICghZGltIHx8ICFpc1ZhbGlkKGRpbSkpIHtcbiAgICAgICAgZGltID0gbmV3IGNjLk5vZGUoRU5EX0RJTV9CQUNLRFJPUF9OQU1FKTtcbiAgICAgICAgZGltLnNldEFuY2hvclBvaW50KDAuNSwgMC41KTtcbiAgICAgICAgZGltLnNldFBvc2l0aW9uKDAsIDApO1xuICAgICAgICBlbmRSb290Lmluc2VydENoaWxkKGRpbSwgMCk7XG4gICAgfVxuXG4gICAgY29uc3Qgb2xkR3JhcGhpY3MgPSBkaW0uZ2V0Q29tcG9uZW50KGNjLkdyYXBoaWNzKTtcbiAgICBpZiAob2xkR3JhcGhpY3MpIHtcbiAgICAgICAgb2xkR3JhcGhpY3MuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIGxldCBzcHJpdGUgPSBkaW0uZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgaWYgKCFzcHJpdGUpIHtcbiAgICAgICAgc3ByaXRlID0gZGltLmFkZENvbXBvbmVudChjYy5TcHJpdGUpO1xuICAgIH1cbiAgICBzcHJpdGUuc3ByaXRlRnJhbWUgPSBnZXRXaGl0ZVNwcml0ZUZyYW1lKCk7XG4gICAgc3ByaXRlLnR5cGUgPSBjYy5TcHJpdGUuVHlwZS5TSU1QTEU7XG4gICAgc3ByaXRlLnNpemVNb2RlID0gY2MuU3ByaXRlLlNpemVNb2RlLkNVU1RPTTtcblxuICAgIGRpbS5hY3RpdmUgPSB0cnVlO1xuICAgIGRpbS56SW5kZXggPSBaX09SREVSX0VORF9DSElMRC5ESU1fQkFDS0RST1A7XG4gICAgZGltLmNvbG9yID0gY2MuQ29sb3IuQkxBQ0s7XG4gICAgZGltLm9wYWNpdHkgPSBFTkRfRElNX09QQUNJVFk7XG4gICAgZGltLnNldENvbnRlbnRTaXplKGJnLndpZHRoLCBiZy5oZWlnaHQpO1xuICAgIGxheW91dFNob3dBbGxDb3ZlcihkaW0sIGNhbnZhc05vZGUpO1xuXG4gICAgcmV0dXJuIGRpbTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxheW91dFZpY3RvcnlFbmREaW1CYWNrZHJvcChlbmRSb290OiBjYy5Ob2RlLCBjYW52YXM/OiBjYy5Ob2RlKTogdm9pZCB7XG4gICAgZW5zdXJlVmljdG9yeUVuZERpbUJhY2tkcm9wKGVuZFJvb3QsIGNhbnZhcyk7XG59XG5cbmZ1bmN0aW9uIGhpZGVOb2RlKG5vZGU6IGNjLk5vZGUpOiB2b2lkIHtcbiAgICBub2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICBub2RlLm9wYWNpdHkgPSAwO1xufVxuXG4vKiog5L+d5oyBIGFjdGl2Ze+8jOS7hemAj+aYju+8iGluYWN0aXZlIOiKgueCueS4iiBydW5BY3Rpb24g5ZyoIDIuNCDlj6/og73kuI3miafooYzvvIkgKi9cbmZ1bmN0aW9uIGhpZGVOb2RlVmlzdWFsKG5vZGU6IGNjLk5vZGUpOiB2b2lkIHtcbiAgICBub2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgbm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgIG5vZGUub3BhY2l0eSA9IDA7XG59XG5cbi8qKiBpY29u77ya5LuOIElDT05fU1RBUlRfU0NBTEUg5by55Yiw5Zy65pmv6K6+6K6h57yp5pS+77yI5Yu/55So5b2T5YmNIHNjYWxlIOW9kyBiYXNl77yMcHJlcGFyZSDkvJrmlLnlsI/vvIkgKi9cbmZ1bmN0aW9uIHBsYXlJY29uUG9wQm91bmNlKGljb246IGNjLk5vZGUsIHRhcmdldFNjYWxlOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpY29uLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgaWNvbi5hY3RpdmUgPSB0cnVlO1xuICAgIGljb24ub3BhY2l0eSA9IDA7XG4gICAgaWNvbi5zZXRTY2FsZShJQ09OX1NUQVJUX1NDQUxFKTtcbiAgICBjb25zdCBwZWFrID0gdGFyZ2V0U2NhbGUgKiAxLjEyO1xuICAgIGljb24ucnVuQWN0aW9uKGNjLnNlcXVlbmNlKFxuICAgICAgICBjYy5zcGF3bihcbiAgICAgICAgICAgIGNjLmZhZGVJbigwLjEpLFxuICAgICAgICAgICAgY2Muc2NhbGVUbyhJQ09OX1BPUF9EVVJBVElPTiwgcGVhaykuZWFzaW5nKGNjLmVhc2VCYWNrT3V0KCkpXG4gICAgICAgICksXG4gICAgICAgIGNjLnNjYWxlVG8oSUNPTl9TRVRUTEVfRFVSQVRJT04sIHRhcmdldFNjYWxlKS5lYXNpbmcoY2MuZWFzZVNpbmVPdXQoKSlcbiAgICApKTtcbn1cblxuZnVuY3Rpb24gcGxheVZpY3RvcnlBcHBlYXJUaGVuTG9vcCh2aWN0b3J5OiBjYy5Ob2RlLCBvbkFwcGVhckRvbmU6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB2aWN0b3J5LmFjdGl2ZSA9IHRydWU7XG4gICAgdmljdG9yeS5vcGFjaXR5ID0gMjU1O1xuICAgIGNvbnN0IHNrID0gdmljdG9yeS5nZXRDb21wb25lbnQoc3AuU2tlbGV0b24pO1xuICAgIGlmICghc2spIHtcbiAgICAgICAgY2Mud2FybignW1ZpY3RvcnlFbmRQYW5lbF0gdmljdG9yeSDnvLrlsJEgc3AuU2tlbGV0b24nKTtcbiAgICAgICAgb25BcHBlYXJEb25lKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2suc2V0Q29tcGxldGVMaXN0ZW5lcihudWxsKTtcbiAgICBzay5sb29wID0gZmFsc2U7XG4gICAgc2suc2V0QW5pbWF0aW9uKDAsIFNQSU5FX1ZJQ1RPUllfQVBQRUFSLCBmYWxzZSk7XG4gICAgbGV0IGRvbmUgPSBmYWxzZTtcbiAgICBjb25zdCBmaW5pc2ggPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGlmIChkb25lIHx8ICFpc1ZhbGlkKHZpY3RvcnkpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIHNrLnNldENvbXBsZXRlTGlzdGVuZXIobnVsbCk7XG4gICAgICAgIHNrLmxvb3AgPSB0cnVlO1xuICAgICAgICBzay5zZXRBbmltYXRpb24oMCwgU1BJTkVfVklDVE9SWV9MT09QLCB0cnVlKTtcbiAgICAgICAgb25BcHBlYXJEb25lKCk7XG4gICAgfTtcbiAgICBzay5zZXRDb21wbGV0ZUxpc3RlbmVyKGZpbmlzaCk7XG4gICAgdmljdG9yeS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoXG4gICAgICAgIGNjLmRlbGF5VGltZShWSUNUT1JZX0FQUEVBUl9GQUxMQkFDSyksXG4gICAgICAgIGNjLmNhbGxGdW5jKGZpbmlzaCwgbnVsbClcbiAgICApKTtcbn1cblxuZnVuY3Rpb24gcGxheVN0YXJzUG9wKHN0YXJzOiBTdGFyU2xvdFtdLCBjZW50ZXI6IGNjLlZlYzIpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHNsb3QgPSBzdGFyc1tpXTtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHNsb3Qubm9kZTtcbiAgICAgICAgbm9kZS5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICBub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIG5vZGUuekluZGV4ID0gMjA7XG4gICAgICAgIG5vZGUuc2V0UG9zaXRpb24oY2VudGVyLngsIGNlbnRlci55KTtcbiAgICAgICAgbm9kZS5zZXRTY2FsZShTVEFSX1NUQVJUX1NDQUxFKTtcbiAgICAgICAgbm9kZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgbm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoXG4gICAgICAgICAgICBjYy5kZWxheVRpbWUoaSAqIFNUQVJfU1RBR0dFUiksXG4gICAgICAgICAgICBjYy5zcGF3bihcbiAgICAgICAgICAgICAgICBjYy5mYWRlSW4oMC4wOCksXG4gICAgICAgICAgICAgICAgY2MubW92ZVRvKFNUQVJfUE9QX0RVUkFUSU9OLCBzbG90LnRhcmdldFgsIHNsb3QudGFyZ2V0WSkuZWFzaW5nKGNjLmVhc2VCYWNrT3V0KCkpLFxuICAgICAgICAgICAgICAgIGNjLnNjYWxlVG8oU1RBUl9QT1BfRFVSQVRJT04sIDEpLmVhc2luZyhjYy5lYXNlQmFja091dCgpKVxuICAgICAgICAgICAgKVxuICAgICAgICApKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRlc3Ryb3lFbmRTY29yZUxhYmVsKGVuZFJvb3Q6IGNjLk5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCBvbGQgPSBlbmRSb290LmdldENoaWxkQnlOYW1lKE5PREVfRU5EX1NDT1JFKTtcbiAgICBpZiAob2xkICYmIGlzVmFsaWQob2xkKSkge1xuICAgICAgICBvbGQuZGVzdHJveSgpO1xuICAgIH1cbn1cblxuLyoqIOWIhuaVsOaMguWcqCBlbmQg5LiK77yI5Yu/5oyC5ZyoIFNwaW5lIFRhc2tMaWdodCDlrZDoioLngrnvvIwyLjQg5LiL5bi45LiN5pi+56S677yJICovXG5mdW5jdGlvbiBlbnN1cmVFbmRTY29yZUxhYmVsKFxuICAgIGVuZFJvb3Q6IGNjLk5vZGUsXG4gICAgdGFza0xpZ2h0OiBjYy5Ob2RlLFxuICAgIGZvbnQ6IGNjLkJpdG1hcEZvbnQsXG4gICAgc2NvcmU6IG51bWJlclxuKTogY2MuTm9kZSB7XG4gICAgZGVzdHJveUVuZFNjb3JlTGFiZWwoZW5kUm9vdCk7XG4gICAgY29uc3Qgbm9kZSA9IG5ldyBjYy5Ob2RlKE5PREVfRU5EX1NDT1JFKTtcbiAgICBjb25zdCBsYWJlbCA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLkxhYmVsKTtcbiAgICBsYWJlbC5mb250ID0gZm9udDtcbiAgICBsYWJlbC5mb250U2l6ZSA9IFNDT1JFX0ZPTlRfU0laRTtcbiAgICBsYWJlbC5saW5lSGVpZ2h0ID0gU0NPUkVfTElORV9IRUlHSFQ7XG4gICAgbGFiZWwuZW5hYmxlV3JhcFRleHQgPSBmYWxzZTtcbiAgICBsYWJlbC5ob3Jpem9udGFsQWxpZ24gPSBjYy5MYWJlbC5Ib3Jpem9udGFsQWxpZ24uQ0VOVEVSO1xuICAgIGxhYmVsLnZlcnRpY2FsQWxpZ24gPSBjYy5MYWJlbC5WZXJ0aWNhbEFsaWduLkNFTlRFUjtcbiAgICBsYWJlbC5zdHJpbmcgPSBTdHJpbmcoTWF0aC5tYXgoMCwgTWF0aC5mbG9vcihzY29yZSkpKTtcbiAgICBub2RlLnNldEFuY2hvclBvaW50KDAuNSwgMC41KTtcbiAgICBub2RlLnNldFBvc2l0aW9uKHRhc2tMaWdodC54LCB0YXNrTGlnaHQueSArIFNDT1JFX0FCT1ZFX1RBU0tfWSk7XG4gICAgbm9kZS56SW5kZXggPSBFTkRfU0NPUkVfWl9JTkRFWDtcbiAgICBlbmRSb290LmFkZENoaWxkKG5vZGUpO1xuICAgIHJldHVybiBub2RlO1xufVxuXG5mdW5jdGlvbiBzaG93U2V0dGxlbWVudFNjb3JlKFxuICAgIGVuZFJvb3Q6IGNjLk5vZGUsXG4gICAgdGFza0xpZ2h0OiBjYy5Ob2RlLFxuICAgIHNjb3JlOiBudW1iZXIsXG4gICAgc2NvcmVGb250OiBjYy5CaXRtYXBGb250IHwgbnVsbCxcbiAgICBzY29yZURpc3BsYXk6IEFydFNjb3JlRGlzcGxheSB8IG51bGxcbik6IHZvaWQge1xuICAgIGlmIChzY29yZURpc3BsYXkgJiYgaXNWYWxpZChzY29yZURpc3BsYXkucm9vdCkpIHtcbiAgICAgICAgc2NvcmVEaXNwbGF5LnNldFZhbHVlKHNjb3JlLCBmYWxzZSk7XG4gICAgICAgIHNjb3JlRGlzcGxheS5zZXRWaXNpYmxlKHRydWUpO1xuICAgICAgICBzY29yZURpc3BsYXkubW91bnRPbkVuZFNldHRsZShcbiAgICAgICAgICAgIGVuZFJvb3QsXG4gICAgICAgICAgICB0YXNrTGlnaHQueCxcbiAgICAgICAgICAgIHRhc2tMaWdodC55ICsgU0NPUkVfQUJPVkVfVEFTS19ZXG4gICAgICAgICk7XG4gICAgICAgIHNjb3JlRGlzcGxheS5wbGF5U2V0dGxlUmV2ZWFsKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZm9udCA9IHNjb3JlRm9udCB8fCAoc2NvcmVEaXNwbGF5ID8gc2NvcmVEaXNwbGF5LmdldEJpdG1hcEZvbnQoKSA6IG51bGwpO1xuICAgIGlmICghZm9udCkge1xuICAgICAgICBjYy53YXJuKCdbVmljdG9yeUVuZFBhbmVsXSDml6DkvY3lm77lrZfkvZPvvIzot7Pov4fliIbmlbDlrZfluZUnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzY29yZU5vZGUgPSBlbnN1cmVFbmRTY29yZUxhYmVsKGVuZFJvb3QsIHRhc2tMaWdodCwgZm9udCwgc2NvcmUpO1xuICAgIHBsYXlTY29yZVB1bmNoKHNjb3JlTm9kZSk7XG59XG5cbmZ1bmN0aW9uIHBsYXlTY29yZVB1bmNoKHNjb3JlTm9kZTogY2MuTm9kZSk6IHZvaWQge1xuICAgIHNjb3JlTm9kZS5zdG9wQWxsQWN0aW9ucygpO1xuICAgIHNjb3JlTm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgIHNjb3JlTm9kZS5vcGFjaXR5ID0gMjU1O1xuICAgIHNjb3JlTm9kZS5zZXRTY2FsZSgwLjM1KTtcbiAgICBzY29yZU5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKFxuICAgICAgICBjYy5zcGF3bihcbiAgICAgICAgICAgIGNjLmZhZGVJbigwLjA2KSxcbiAgICAgICAgICAgIGNjLnNjYWxlVG8oMC4yMiwgU0NPUkVfUFVOQ0hfU0NBTEUpLmVhc2luZyhjYy5lYXNlQmFja091dCgpKVxuICAgICAgICApLFxuICAgICAgICBjYy5zY2FsZVRvKFNDT1JFX1BVTkNIX0RVUkFUSU9OLCAxKS5lYXNpbmcoY2MuZWFzZVNpbmVPdXQoKSlcbiAgICApKTtcbn1cblxuZnVuY3Rpb24gcGxheVRhc2tMaWdodEFwcGVhcjEodGFza0xpZ2h0OiBjYy5Ob2RlLCBvbkRvbmU6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0YXNrTGlnaHQuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICB0YXNrTGlnaHQuYWN0aXZlID0gdHJ1ZTtcbiAgICB0YXNrTGlnaHQub3BhY2l0eSA9IDI1NTtcbiAgICBjb25zdCBzayA9IHRhc2tMaWdodC5nZXRDb21wb25lbnQoc3AuU2tlbGV0b24pO1xuICAgIGlmICghc2spIHtcbiAgICAgICAgY2Mud2FybignW1ZpY3RvcnlFbmRQYW5lbF0gVGFza0xpZ2h0IOe8uuWwkSBzcC5Ta2VsZXRvbicpO1xuICAgICAgICBvbkRvbmUoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzay5zZXRDb21wbGV0ZUxpc3RlbmVyKG51bGwpO1xuICAgIHNrLmxvb3AgPSBmYWxzZTtcbiAgICBzay5zZXRBbmltYXRpb24oMCwgU1BJTkVfVEFTS19BUFBFQVIsIGZhbHNlKTtcbiAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgIGNvbnN0IGZpbmlzaCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgc2suc2V0Q29tcGxldGVMaXN0ZW5lcihudWxsKTtcbiAgICAgICAgb25Eb25lKCk7XG4gICAgfTtcbiAgICBzay5zZXRDb21wbGV0ZUxpc3RlbmVyKGZpbmlzaCk7XG4gICAgdGFza0xpZ2h0LnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShcbiAgICAgICAgY2MuZGVsYXlUaW1lKFRBU0tfQVBQRUFSX0ZBTExCQUNLKSxcbiAgICAgICAgY2MuY2FsbEZ1bmMoZmluaXNoLCBudWxsKVxuICAgICkpO1xufVxuXG5mdW5jdGlvbiBwbGF5RG93bmxvYWRCdG5CcmVhdGhMb29wKGJ0bjogY2MuTm9kZSwgYmFzZVNjYWxlOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBwZWFrID0gYmFzZVNjYWxlICogQlROX0JSRUFUSF9QRUFLX1JBVElPO1xuICAgIGJ0bi5ydW5BY3Rpb24oY2MucmVwZWF0Rm9yZXZlcihjYy5zZXF1ZW5jZShcbiAgICAgICAgY2Muc2NhbGVUbyhCVE5fQlJFQVRIX0hBTEZfRFVSQVRJT04sIHBlYWspLmVhc2luZyhjYy5lYXNlU2luZUluT3V0KCkpLFxuICAgICAgICBjYy5zY2FsZVRvKEJUTl9CUkVBVEhfSEFMRl9EVVJBVElPTiwgYmFzZVNjYWxlKS5lYXNpbmcoY2MuZWFzZVNpbmVJbk91dCgpKVxuICAgICkpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuYmluZFZpY3RvcnlFbmREb3dubG9hZEJ1dHRvbihidG46IGNjLk5vZGUpOiB2b2lkIHtcbiAgICBpZiAoIWJ0biB8fCAhaXNWYWxpZChidG4pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYnRuLm9mZignY2xpY2snKTtcbiAgICBidG4ub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCk7XG4gICAgY29uc3QgYnV0dG9uID0gYnRuLmdldENvbXBvbmVudChjYy5CdXR0b24pO1xuICAgIGlmIChidXR0b24pIHtcbiAgICAgICAgYnV0dG9uLmNsaWNrRXZlbnRzID0gW107XG4gICAgfVxufVxuXG4vKiog57uR5a6aIGRvd25sb2FkIOiKgueCueeCueWHu++8iOS7hSByZXNldCDml7bnlKjvvJvmraPluLjnu5HlrprlnKggR2FtZUNvbnRyb2xsZXIuYmluZEVuZERvd25sb2FkQnV0dG9u77yJICovXG5leHBvcnQgZnVuY3Rpb24gYmluZFZpY3RvcnlFbmREb3dubG9hZEJ1dHRvbihidG46IGNjLk5vZGUsIG9uQ2xpY2s6IFZpY3RvcnlFbmREb3dubG9hZENhbGxiYWNrKTogdm9pZCB7XG4gICAgaWYgKCFidG4gfHwgIWlzVmFsaWQoYnRuKSB8fCAhb25DbGljaykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHVuYmluZFZpY3RvcnlFbmREb3dubG9hZEJ1dHRvbihidG4pO1xuICAgIGNvbnN0IGJ1dHRvbiA9IGJ0bi5nZXRDb21wb25lbnQoY2MuQnV0dG9uKTtcbiAgICBpZiAoYnV0dG9uKSB7XG4gICAgICAgIGJ1dHRvbi5pbnRlcmFjdGFibGUgPSB0cnVlO1xuICAgICAgICBidG4ub24oJ2NsaWNrJywgb25DbGljaywgYnRuKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBidG4ub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCBvbkNsaWNrLCBidG4pO1xufVxuXG5mdW5jdGlvbiBwbGF5RG93bmxvYWRCdG5SZXZlYWwoYnRuOiBjYy5Ob2RlKTogdm9pZCB7XG4gICAgYnRuLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgYnRuLmFjdGl2ZSA9IHRydWU7XG4gICAgYnRuLnpJbmRleCA9IFpfT1JERVJfRU5EX0NISUxELkRPV05MT0FEO1xuICAgIGNvbnN0IHRhcmdldFNjYWxlID0gTWF0aC5tYXgoTWF0aC5hYnMoYnRuLnNjYWxlWCksIDAuMDEpO1xuICAgIGJ0bi5zZXRTY2FsZSh0YXJnZXRTY2FsZSAqIDAuNTUpO1xuICAgIGJ0bi5vcGFjaXR5ID0gMDtcbiAgICBidG4ucnVuQWN0aW9uKGNjLnNlcXVlbmNlKFxuICAgICAgICBjYy5zcGF3bihcbiAgICAgICAgICAgIGNjLmZhZGVJbihCVE5fUE9QX0RVUkFUSU9OKSxcbiAgICAgICAgICAgIGNjLnNlcXVlbmNlKFxuICAgICAgICAgICAgICAgIGNjLnNjYWxlVG8oQlROX1BPUF9EVVJBVElPTiwgdGFyZ2V0U2NhbGUgKiAxLjA4KS5lYXNpbmcoY2MuZWFzZUJhY2tPdXQoKSksXG4gICAgICAgICAgICAgICAgY2Muc2NhbGVUbygwLjA4LCB0YXJnZXRTY2FsZSkuZWFzaW5nKGNjLmVhc2VTaW5lT3V0KCkpXG4gICAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIGNjLmNhbGxGdW5jKCgpID0+IHtcbiAgICAgICAgICAgIGlmICghYnRuIHx8ICFpc1ZhbGlkKGJ0bikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBidG4uc2V0U2NhbGUodGFyZ2V0U2NhbGUpO1xuICAgICAgICAgICAgcGxheURvd25sb2FkQnRuQnJlYXRoTG9vcChidG4sIHRhcmdldFNjYWxlKTtcbiAgICAgICAgfSwgbnVsbClcbiAgICApKTtcbn1cblxuLyoqIOS4i+i9veaMiemSruW7tuaXtuW/hemhu+aMguWcqCBlbmRSb29077yI5Yu/5oyC5ZyoIGFjdGl2ZT1mYWxzZSDnmoTmjInpkq7kuIrvvIkgKi9cbmZ1bmN0aW9uIHNjaGVkdWxlRG93bmxvYWRCdG5SZXZlYWwoZW5kUm9vdDogY2MuTm9kZSwgYnRuOiBjYy5Ob2RlLCBkZWxheTogbnVtYmVyKTogdm9pZCB7XG4gICAgZW5kUm9vdC5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoXG4gICAgICAgIGNjLmRlbGF5VGltZShkZWxheSksXG4gICAgICAgIGNjLmNhbGxGdW5jKCgpID0+IHBsYXlEb3dubG9hZEJ0blJldmVhbChidG4pLCBudWxsKVxuICAgICkpO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlRW5kUm9vdChlbmRSb290OiBjYy5Ob2RlLCBub2RlczogRW5kTm9kZXMpOiBjYy5Ob2RlIHtcbiAgICBpZiAoZW5kUm9vdCAmJiBpc1ZhbGlkKGVuZFJvb3QpKSB7XG4gICAgICAgIHJldHVybiBlbmRSb290O1xuICAgIH1cbiAgICBpZiAobm9kZXMgJiYgbm9kZXMuaWNvbiAmJiBpc1ZhbGlkKG5vZGVzLmljb24ucGFyZW50KSkge1xuICAgICAgICByZXR1cm4gbm9kZXMuaWNvbi5wYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBlbmRSb290O1xufVxuXG5mdW5jdGlvbiBwcmVwYXJlRW5kUGFuZWwoZW5kUm9vdDogY2MuTm9kZSwgbm9kZXM/OiBFbmROb2Rlcyk6IHZvaWQge1xuICAgIC8vIOWFvOWuueaXpyBxdWlja19jb21waWxlIOe8k+WtmO+8muabvuWGmeaIkCBwcmVwYXJlRW5kUGFuZWwobm9kZXMpXG4gICAgbGV0IHBhbmVsID0gbm9kZXM7XG4gICAgbGV0IHJvb3QgPSBlbmRSb290O1xuICAgIGlmICghcGFuZWwgJiYgZW5kUm9vdCAmJiAoZW5kUm9vdCBhcyBFbmROb2RlcykuaWNvbikge1xuICAgICAgICBwYW5lbCA9IGVuZFJvb3QgYXMgdW5rbm93biBhcyBFbmROb2RlcztcbiAgICAgICAgcm9vdCA9IHBhbmVsLmljb24ucGFyZW50O1xuICAgIH1cbiAgICBpZiAoIXBhbmVsIHx8ICFwYW5lbC5pY29uKSB7XG4gICAgICAgIGNjLndhcm4oJ1tWaWN0b3J5RW5kUGFuZWxdIHByZXBhcmVFbmRQYW5lbDog5peg5pWI55qEIGVuZCDoioLngrnnu5PmnoQnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByb290ID0gcmVzb2x2ZUVuZFJvb3Qocm9vdCwgcGFuZWwpO1xuICAgIHJvb3Qub3BhY2l0eSA9IDI1NTtcbiAgICBlbnN1cmVWaWN0b3J5RW5kRGltQmFja2Ryb3Aocm9vdCk7XG5cbiAgICBwYW5lbC5pY29uLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgcGFuZWwudmljdG9yeS5zdG9wQWxsQWN0aW9ucygpO1xuICAgIHBhbmVsLnRhc2tMaWdodC5zdG9wQWxsQWN0aW9ucygpO1xuICAgIHBhbmVsLmRvd25sb2FkQnRuLnN0b3BBbGxBY3Rpb25zKCk7XG5cbiAgICBwYW5lbC5pY29uLmFjdGl2ZSA9IHRydWU7XG4gICAgcGFuZWwuaWNvbi5vcGFjaXR5ID0gMDtcbiAgICBwYW5lbC5pY29uLnNldFNjYWxlKElDT05fU1RBUlRfU0NBTEUpO1xuXG4gICAgcGFuZWwudmljdG9yeS5hY3RpdmUgPSB0cnVlO1xuICAgIHBhbmVsLnZpY3Rvcnkub3BhY2l0eSA9IDI1NTtcblxuICAgIGhpZGVOb2RlKHBhbmVsLnRhc2tMaWdodCk7XG4gICAgaGlkZU5vZGVWaXN1YWwocGFuZWwuZG93bmxvYWRCdG4pO1xuXG4gICAgY29uc3QgY2VudGVyID0gZ2V0UGV0YWxDZW50ZXIocGFuZWwpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFuZWwuc3RhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc2xvdCA9IHBhbmVsLnN0YXJzW2ldO1xuICAgICAgICBzbG90Lm5vZGUuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgc2xvdC5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICBzbG90Lm5vZGUub3BhY2l0eSA9IDA7XG4gICAgICAgIHNsb3Qubm9kZS5zZXRQb3NpdGlvbihjZW50ZXIueCwgY2VudGVyLnkpO1xuICAgICAgICBzbG90Lm5vZGUuc2V0U2NhbGUoU1RBUl9TVEFSVF9TQ0FMRSk7XG4gICAgfVxuXG4gICAgZGVzdHJveUVuZFNjb3JlTGFiZWwocm9vdCk7XG59XG5cbmZ1bmN0aW9uIHBsYXlTdGVwVGFza0FuZFNjb3JlKFxuICAgIGVuZFJvb3Q6IGNjLk5vZGUsXG4gICAgbm9kZXM6IEVuZE5vZGVzLFxuICAgIHNjb3JlOiBudW1iZXIsXG4gICAgc2NvcmVGb250OiBjYy5CaXRtYXBGb250IHwgbnVsbCxcbiAgICBzY29yZURpc3BsYXk6IEFydFNjb3JlRGlzcGxheSB8IG51bGxcbik6IHZvaWQge1xuICAgIHBsYXlUYXNrTGlnaHRBcHBlYXIxKG5vZGVzLnRhc2tMaWdodCwgKCkgPT4ge30pO1xuICAgIHNob3dTZXR0bGVtZW50U2NvcmUoZW5kUm9vdCwgbm9kZXMudGFza0xpZ2h0LCBzY29yZSwgc2NvcmVGb250LCBzY29yZURpc3BsYXkpO1xuICAgIHNjaGVkdWxlRG93bmxvYWRCdG5SZXZlYWwoZW5kUm9vdCwgbm9kZXMuZG93bmxvYWRCdG4sIFNURVBfQlROX0FGVEVSX1NDT1JFKTtcbn1cblxuLyoqXG4gKiDikaAgaWNvbiDlvLnot7MgKyB2aWN0b3J5IEFwcGVhcu+8iOW5tuihjO+8iVxuICog4pGhIEFwcGVhciDnu5PmnZ8g4oaSIOaYn+aYn+mjnuWHuu+8jOW5tuefreW7tui/n+mHjeWPoCBUYXNrTGlnaHQgKyDliIbmlbBcbiAqIOKRoiDkuIvovb3mjInpkq5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBsYXlWaWN0b3J5RW5kU2VxdWVuY2UoXG4gICAgZW5kUm9vdDogY2MuTm9kZSxcbiAgICBzY29yZTogbnVtYmVyLFxuICAgIHNjb3JlRm9udDogY2MuQml0bWFwRm9udCB8IG51bGwsXG4gICAgc2NvcmVEaXNwbGF5OiBBcnRTY29yZURpc3BsYXkgfCBudWxsID0gbnVsbFxuKTogdm9pZCB7XG4gICAgY29uc3Qgbm9kZXMgPSBnZXRFbmROb2RlcyhlbmRSb290KTtcbiAgICBpZiAoIW5vZGVzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcHJlcGFyZUVuZFBhbmVsKGVuZFJvb3QsIG5vZGVzKTtcbiAgICBlbmRSb290LnN0b3BBbGxBY3Rpb25zKCk7XG5cbiAgICBjb25zdCBjZW50ZXIgPSBnZXRQZXRhbENlbnRlcihub2Rlcyk7XG5cbiAgICBwbGF5SWNvblBvcEJvdW5jZShub2Rlcy5pY29uLCBub2Rlcy5pY29uVGFyZ2V0U2NhbGUpO1xuICAgIHBsYXlWaWN0b3J5QXBwZWFyVGhlbkxvb3Aobm9kZXMudmljdG9yeSwgKCkgPT4ge1xuICAgICAgICBwbGF5U3RhcnNQb3Aobm9kZXMuc3RhcnMsIGNlbnRlcik7XG4gICAgICAgIGVuZFJvb3QucnVuQWN0aW9uKGNjLnNlcXVlbmNlKFxuICAgICAgICAgICAgY2MuZGVsYXlUaW1lKFNURVBfVEFTS19PVkVSTEFQKSxcbiAgICAgICAgICAgIGNjLmNhbGxGdW5jKFxuICAgICAgICAgICAgICAgICgpID0+IHBsYXlTdGVwVGFza0FuZFNjb3JlKGVuZFJvb3QsIG5vZGVzLCBzY29yZSwgc2NvcmVGb250LCBzY29yZURpc3BsYXkpLFxuICAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgIClcbiAgICAgICAgKSk7XG4gICAgfSk7XG59XG5cbi8qKiBAZGVwcmVjYXRlZCDkvb/nlKggcGxheVZpY3RvcnlFbmRTZXF1ZW5jZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBsYXlWaWN0b3J5RW5kU2VxdWVuY2VMZWdhY3koZW5kUm9vdDogY2MuTm9kZSk6IHZvaWQge1xuICAgIHBsYXlWaWN0b3J5RW5kU2VxdWVuY2UoZW5kUm9vdCwgMCwgbnVsbCk7XG59XG5cbi8qKiBAZGVwcmVjYXRlZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBsYXlWaWN0b3J5RW5kVW5sb2NrKGVuZFJvb3Q6IGNjLk5vZGUpOiB2b2lkIHtcbiAgICBwbGF5VmljdG9yeUVuZFNlcXVlbmNlKGVuZFJvb3QsIDAsIG51bGwpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRWaWN0b3J5RW5kVW5sb2NrKGVuZFJvb3Q6IGNjLk5vZGUpOiB2b2lkIHtcbiAgICBpZiAoIWVuZFJvb3QgfHwgIWlzVmFsaWQoZW5kUm9vdCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlbmRSb290LnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgY29uc3Qgbm9kZXMgPSBnZXRFbmROb2RlcyhlbmRSb290KTtcbiAgICBpZiAoIW5vZGVzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB2aWN0b3J5U2sgPSBub2Rlcy52aWN0b3J5LmdldENvbXBvbmVudChzcC5Ta2VsZXRvbik7XG4gICAgaWYgKHZpY3RvcnlTaykge1xuICAgICAgICB2aWN0b3J5U2suc2V0Q29tcGxldGVMaXN0ZW5lcihudWxsKTtcbiAgICAgICAgdmljdG9yeVNrLmxvb3AgPSBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgdGFza1NrID0gbm9kZXMudGFza0xpZ2h0LmdldENvbXBvbmVudChzcC5Ta2VsZXRvbik7XG4gICAgaWYgKHRhc2tTaykge1xuICAgICAgICB0YXNrU2suc2V0Q29tcGxldGVMaXN0ZW5lcihudWxsKTtcbiAgICAgICAgdGFza1NrLmxvb3AgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBub2Rlcy5pY29uLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgbm9kZXMuaWNvbi5hY3RpdmUgPSB0cnVlO1xuICAgIG5vZGVzLmljb24ub3BhY2l0eSA9IDI1NTtcbiAgICBub2Rlcy5pY29uLnNldFNjYWxlKG5vZGVzLmljb25UYXJnZXRTY2FsZSk7XG5cbiAgICBub2Rlcy52aWN0b3J5LnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgbm9kZXMudmljdG9yeS5hY3RpdmUgPSB0cnVlO1xuICAgIG5vZGVzLnZpY3Rvcnkub3BhY2l0eSA9IDI1NTtcblxuICAgIG5vZGVzLnRhc2tMaWdodC5zdG9wQWxsQWN0aW9ucygpO1xuICAgIG5vZGVzLnRhc2tMaWdodC5hY3RpdmUgPSB0cnVlO1xuICAgIG5vZGVzLnRhc2tMaWdodC5vcGFjaXR5ID0gMjU1O1xuXG4gICAgbm9kZXMuZG93bmxvYWRCdG4uc3RvcEFsbEFjdGlvbnMoKTtcbiAgICB1bmJpbmRWaWN0b3J5RW5kRG93bmxvYWRCdXR0b24obm9kZXMuZG93bmxvYWRCdG4pO1xuICAgIG5vZGVzLmRvd25sb2FkQnRuLmFjdGl2ZSA9IHRydWU7XG4gICAgbm9kZXMuZG93bmxvYWRCdG4uekluZGV4ID0gWl9PUkRFUl9FTkRfQ0hJTEQuRE9XTkxPQUQ7XG4gICAgbm9kZXMuZG93bmxvYWRCdG4ub3BhY2l0eSA9IDI1NTtcbiAgICBub2Rlcy5kb3dubG9hZEJ0bi5zZXRTY2FsZShNYXRoLm1heChNYXRoLmFicyhub2Rlcy5kb3dubG9hZEJ0bi5zY2FsZVgpLCAwLjAxKSk7XG5cbiAgICBlbmRSb290Lm9wYWNpdHkgPSAyNTU7XG4gICAgZW5zdXJlVmljdG9yeUVuZERpbUJhY2tkcm9wKGVuZFJvb3QpO1xuXG4gICAgZGVzdHJveUVuZFNjb3JlTGFiZWwoZW5kUm9vdCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLnN0YXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHNsb3QgPSBub2Rlcy5zdGFyc1tpXTtcbiAgICAgICAgc2xvdC5ub2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIHNsb3Qubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICBzbG90Lm5vZGUuc2V0UG9zaXRpb24oc2xvdC50YXJnZXRYLCBzbG90LnRhcmdldFkpO1xuICAgICAgICBzbG90Lm5vZGUuc2V0U2NhbGUoMSk7XG4gICAgICAgIHNsb3Qubm9kZS5vcGFjaXR5ID0gMjU1O1xuICAgIH1cbn1cbiJdfQ==