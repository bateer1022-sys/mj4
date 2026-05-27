"use strict";
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