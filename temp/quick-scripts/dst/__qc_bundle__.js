
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/__qc_index__.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}
require('./assets/script/core/BoardManager');
require('./assets/script/core/BoardRule');
require('./assets/script/core/HintSolver');
require('./assets/script/core/LevelSolver');
require('./assets/script/core/MatchRule');
require('./assets/script/is-valid');
require('./assets/script/main');
require('./assets/script/model/LevelConfig');
require('./assets/script/model/TileModel');
require('./assets/script/model/TileModelKinds');
require('./assets/script/super_html_playable');
require('./assets/script/ui/ArtScoreDisplay');
require('./assets/script/ui/GameImgAtlas');
require('./assets/script/ui/GamePreloadConfig');
require('./assets/script/ui/GamePreloader');
require('./assets/script/ui/GuideHandTap');
require('./assets/script/ui/LoadingScreen');
require('./assets/script/ui/MatchEliminationSpine');
require('./assets/script/ui/ShowAllLayout');
require('./assets/script/ui/TileHintMarquee');
require('./assets/script/ui/VictoryEndPanel');

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
//------QC-SOURCE-SPLIT------

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvdWkvVmljdG9yeUVuZFBhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkFBaUI7OztBQUVqQix3Q0FBc0M7QUFDdEMseURBQXdEO0FBRXhELGlEQUFxRDtBQUVyRCxJQUFNLHFCQUFxQixHQUFHLGtCQUFrQixDQUFDO0FBQ2pELHlCQUF5QjtBQUN6QixJQUFNLGVBQWUsR0FBRyxHQUFHLENBQUM7QUFFNUIsSUFBSSxzQkFBc0IsR0FBbUIsSUFBSSxDQUFDO0FBRWxELFNBQVMsbUJBQW1CO0lBQ3hCLElBQUksc0JBQXNCLEVBQUU7UUFDeEIsT0FBTyxzQkFBc0IsQ0FBQztLQUNqQztJQUNELElBQU0sR0FBRyxHQUFHLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQy9CLEdBQUcsQ0FBQyxZQUFZLENBQ1osSUFBSSxVQUFVLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUNwQyxFQUFFLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQ2pDLENBQUMsRUFDRCxDQUFDLENBQ0osQ0FBQztJQUNGLHNCQUFzQixHQUFHLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzlDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2QyxPQUFPLHNCQUFzQixDQUFDO0FBQ2xDLENBQUM7QUFFRCxJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUM7QUFDekIsSUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDO0FBQy9CLElBQU0sZUFBZSxHQUFHLFdBQVcsQ0FBQztBQUNwQyxpQ0FBaUM7QUFDakMsSUFBTSxrQkFBa0IsR0FBRyxDQUFDLFVBQVUsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO0FBQ2xFLElBQU0sY0FBYyxHQUFHLFdBQVcsQ0FBQztBQUNuQyxJQUFNLFVBQVUsR0FBRyxDQUFDLE9BQU8sRUFB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QUksQ0FBQztJQUNoQyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxxQ0FBaUIsQ0FBQyxRQUFRLENBQUM7SUFDdEQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO0lBQ2hDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFL0UsT0FBTyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7SUFDdEIsMkJBQTJCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFckMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3pDLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO0tBQzNCO0FBQ0wsQ0FBQztBQXRERCxzREFzREMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvKiogZW5kIOe7k+eul+WIhuatpeWKqOeUuyAqL1xuXG5pbXBvcnQgeyBpc1ZhbGlkIH0gZnJvbSAnLi4vaXMtdmFsaWQnO1xuaW1wb3J0IHsgWl9PUkRFUl9FTkRfQ0hJTEQgfSBmcm9tICcuL0dhbWVQcmVsb2FkQ29uZmlnJztcbmltcG9ydCB7IEFydFNjb3JlRGlzcGxheSB9IGZyb20gJy4vQXJ0U2NvcmVEaXNwbGF5JztcbmltcG9ydCB7IGxheW91dFNob3dBbGxDb3ZlciB9IGZyb20gJy4vU2hvd0FsbExheW91dCc7XG5cbmNvbnN0IEVORF9ESU1fQkFDS0RST1BfTkFNRSA9ICdlbmRfZGltX2JhY2tkcm9wJztcbi8qKiDnuq/pu5Hpga7nvanpgI/mmI7luqYgMC4177yIMOKAkzI1Ne+8iSAqL1xuY29uc3QgRU5EX0RJTV9PUEFDSVRZID0gMTI4O1xuXG5sZXQgY2FjaGVkV2hpdGVTcHJpdGVGcmFtZTogY2MuU3ByaXRlRnJhbWUgPSBudWxsO1xuXG5mdW5jdGlvbiBnZXRXaGl0ZVNwcml0ZUZyYW1lKCk6IGNjLlNwcml0ZUZyYW1lIHtcbiAgICBpZiAoY2FjaGVkV2hpdGVTcHJpdGVGcmFtZSkge1xuICAgICAgICByZXR1cm4gY2FjaGVkV2hpdGVTcHJpdGVGcmFtZTtcbiAgICB9XG4gICAgY29uc3QgdGV4ID0gbmV3IGNjLlRleHR1cmUyRCgpO1xuICAgIHRleC5pbml0V2l0aERhdGEoXG4gICAgICAgIG5ldyBVaW50OEFycmF5KFsyNTUsIDI1NSwgMjU1LCAyNTVdKSxcbiAgICAgICAgY2MuVGV4dHVyZTJELlBpeGVsRm9ybWF0LlJHQkE4ODg4LFxuICAgICAgICAxLFxuICAgICAgICAxXG4gICAgKTtcbiAgICBjYWNoZWRXaGl0ZVNwcml0ZUZyYW1lID0gbmV3IGNjLlNwcml0ZUZyYW1lKCk7XG4gICAgY2FjaGVkV2hpdGVTcHJpdGVGcmFtZS5zZXRUZXh0dXJlKHRleCk7XG4gICAgcmV0dXJuIGNhY2hlZFdoaXRlU3ByaXRlRnJhbWU7XG59XG5cbmNvbnN0IE5PREVfSUNPTiA9ICdpY29uJztcbmNvbnN0IE5PREVfVklDVE9SWSA9ICd2aWN0b3J5JztcbmNvbnN0IE5PREVfVEFTS19MSUdIVCA9ICdUYXNrTGlnaHQnO1xuLyoqIOWcuuaZr+mHjOW4uOingeiKgueCueWQje+8iOS8mOWFiCBkb3dubG9hZO+8jOWFvOWuueaXp+WQje+8iSAqL1xuY29uc3QgRE9XTkxPQURfQlROX05BTUVTID0gWydkb3dubG9hZCcsICdidG5fZG93bmxvYWRfZW5fMjUweDgwJ107XG5jb25zdCBOT0RFX0VORF9TQ09SRSA9ICdlbmRfc2NvcmUnO1xuY29uc3QgU1RBUl9OQU1FUyA9IFsnc3RhcjEnLCAnc3RhcjInLCAnc3RhcjMnXTtcblxuY29uc3QgU1BJTkVfVklDVE9SWV9BUFBFQVIgPSAnQXBwZWFyJztcbmNvbnN0IFNQSU5FX1ZJQ1RPUllfTE9PUCA9ICdMb29wJztcbmNvbnN0IFNQSU5FX1RBU0tfQVBQRUFSID0gJ0FwcGVhcjEnO1xuXG4vKiogdmljdG9yeSBBcHBlYXIg55uR5ZCs6LaF5pe25YWc5bqV77yI56eS77yJICovXG5jb25zdCBWSUNUT1JZX0FQUEVBUl9GQUxMQkFDSyA9IDAuNzI7XG4vKiogaWNvbiDku47lsI/mlL7lpKfliLDlnLrmma/orr7orqHnvKnmlL4gKi9cbmNvbnN0IElDT05fU1RBUlRfU0NBTEUgPSAwLjE1O1xuY29uc3QgSUNPTl9QT1BfRFVSQVRJT04gPSAwLjI2O1xuY29uc3QgSUNPTl9TRVRUTEVfRFVSQVRJT04gPSAwLjA4O1xuY29uc3QgU1RBUl9TVEFSVF9TQ0FMRSA9IDAuMTtcbmNvbnN0IFNUQVJfUE9QX0RVUkFUSU9OID0gMC4zO1xuY29uc3QgU1RBUl9TVEFHR0VSID0gMC4wNztcbi8qKiBUYXNrTGlnaHQgQXBwZWFyMSDnm5HlkKzotoXml7blhZzlupXvvIjnp5LvvIkgKi9cbmNvbnN0IFRBU0tfQVBQRUFSX0ZBTExCQUNLID0gMC45NTtcbi8qKiDnm7jlr7kgVGFza0xpZ2h0IOeahCBZIOWBj+enu++8iGVuZCDmnKzlnLDlnZDmoIfvvIkgKi9cbmNvbnN0IFNDT1JFX0FCT1ZFX1RBU0tfWSA9IDA7XG5jb25zdCBFTkRfU0NPUkVfWl9JTkRFWCA9IDU1O1xuY29uc3QgU0NPUkVfRk9OVF9TSVpFID0gNTQ7XG5jb25zdCBTQ09SRV9MSU5FX0hFSUdIVCA9IDcwO1xuY29uc3QgU0NPUkVfUFVOQ0hfU0NBTEUgPSAxLjA4O1xuY29uc3QgU0NPUkVfUFVOQ0hfRFVSQVRJT04gPSAwLjE7XG5jb25zdCBCVE5fUE9QX0RVUkFUSU9OID0gMC4yNDtcbi8qKiDkuIvovb3mjInpkq7lvLnlh7rlkI7nmoTlkbzlkLjnvKnmlL7vvIjnm7jlr7norr7orqHnvKnmlL7vvIkgKi9cbmNvbnN0IEJUTl9CUkVBVEhfUEVBS19SQVRJTyA9IDEuMDY7XG5jb25zdCBCVE5fQlJFQVRIX0hBTEZfRFVSQVRJT04gPSAwLjU1O1xuLyoqIOaYn+aYn+W8ueWHuuWQjuWkmuS5heaOpSBUYXNrTGlnaHQgLyDliIbmlbDvvIjlj6/ph43lj6DvvIzkuI3lv4XnrYnmmJ/mmJ/lhajnu5PmnZ/vvIkgKi9cbmNvbnN0IFNURVBfVEFTS19PVkVSTEFQID0gMC4xODtcbi8qKiDliIbmlbDlvLnlh7rlkI7lpJrkuYXlh7rkuIvovb3mjInpkq4gKi9cbmNvbnN0IFNURVBfQlROX0FGVEVSX1NDT1JFID0gMDtcblxuLyoqIOe7k+eul+mhtSBkb3dubG9hZCDmjInpkq7ngrnlh7sgKi9cbmV4cG9ydCB0eXBlIFZpY3RvcnlFbmREb3dubG9hZENhbGxiYWNrID0gKCkgPT4gdm9pZDtcblxuZXhwb3J0IGNvbnN0IFZJQ1RPUllfRU5EX1NUWUxFID0ge1xuICAgIHBldGFsQ2VudGVyWDogMCxcbiAgICBwZXRhbENlbnRlclk6IDYwLFxufTtcblxuaW50ZXJmYWNlIFN0YXJTbG90IHtcbiAgICBub2RlOiBjYy5Ob2RlO1xuICAgIHRhcmdldFg6IG51bWJlcjtcbiAgICB0YXJnZXRZOiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBFbmROb2RlcyB7XG4gICAgaWNvbjogY2MuTm9kZTtcbiAgICBpY29uVGFyZ2V0U2NhbGU6IG51bWJlcjtcbiAgICB2aWN0b3J5OiBjYy5Ob2RlO1xuICAgIHRhc2tMaWdodDogY2MuTm9kZTtcbiAgICBkb3dubG9hZEJ0bjogY2MuTm9kZTtcbiAgICBzdGFyczogU3RhclNsb3RbXTtcbn1cblxuZnVuY3Rpb24gZmluZERvd25sb2FkQnRuKGVuZFJvb3Q6IGNjLk5vZGUpOiBjYy5Ob2RlIHwgbnVsbCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBET1dOTE9BRF9CVE5fTkFNRVMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IGVuZFJvb3QuZ2V0Q2hpbGRCeU5hbWUoRE9XTkxPQURfQlROX05BTUVTW2ldKTtcbiAgICAgICAgaWYgKG5vZGUgJiYgaXNWYWxpZChub2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3Qgc3RhY2s6IGNjLk5vZGVbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW5kUm9vdC5jaGlsZHJlbkNvdW50OyBpKyspIHtcbiAgICAgICAgc3RhY2sucHVzaChlbmRSb290LmNoaWxkcmVuW2ldKTtcbiAgICB9XG4gICAgd2hpbGUgKHN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgY3VyID0gc3RhY2sucG9wKCk7XG4gICAgICAgIGlmICghY3VyIHx8ICFpc1ZhbGlkKGN1cikpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgRE9XTkxPQURfQlROX05BTUVTLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAoY3VyLm5hbWUgPT09IERPV05MT0FEX0JUTl9OQU1FU1tqXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBjdXIuY2hpbGRyZW5Db3VudDsgaysrKSB7XG4gICAgICAgICAgICBzdGFjay5wdXNoKGN1ci5jaGlsZHJlbltrXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGdldEVuZE5vZGVzKGVuZFJvb3Q6IGNjLk5vZGUpOiBFbmROb2RlcyB8IG51bGwge1xuICAgIGlmICghZW5kUm9vdCB8fCAhaXNWYWxpZChlbmRSb290KSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgaWNvbiA9IGVuZFJvb3QuZ2V0Q2hpbGRCeU5hbWUoTk9ERV9JQ09OKTtcbiAgICBjb25zdCB2aWN0b3J5ID0gZW5kUm9vdC5nZXRDaGlsZEJ5TmFtZShOT0RFX1ZJQ1RPUlkpO1xuICAgIGNvbnN0IHRhc2tMaWdodCA9IGVuZFJvb3QuZ2V0Q2hpbGRCeU5hbWUoTk9ERV9UQVNLX0xJR0hUKTtcbiAgICBjb25zdCBkb3dubG9hZEJ0biA9IGZpbmREb3dubG9hZEJ0bihlbmRSb290KTtcbiAgICBpZiAoIWljb24gfHwgIXZpY3RvcnkgfHwgIXRhc2tMaWdodCB8fCAhZG93bmxvYWRCdG4pIHtcbiAgICAgICAgY2Mud2FybignW1ZpY3RvcnlFbmRQYW5lbF0gZW5kIOWtkOiKgueCuee8uuWkse+8jOmcgOWMheWQqyBpY29uIC8gdmljdG9yeSAvIFRhc2tMaWdodCAvIGRvd25sb2FkJyk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBpY29uVGFyZ2V0U2NhbGUgPSBNYXRoLm1heChNYXRoLmFicyhpY29uLnNjYWxlWCksIDAuMDEpO1xuICAgIGNvbnN0IHN0YXJzOiBTdGFyU2xvdFtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBTVEFSX05BTUVTLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBlbmRSb290LmdldENoaWxkQnlOYW1lKFNUQVJfTkFNRVNbaV0pO1xuICAgICAgICBpZiAobm9kZSAmJiBpc1ZhbGlkKG5vZGUpKSB7XG4gICAgICAgICAgICBzdGFycy5wdXNoKHsgbm9kZSwgdGFyZ2V0WDogbm9kZS54LCB0YXJnZXRZOiBub2RlLnkgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHsgaWNvbiwgaWNvblRhcmdldFNjYWxlLCB2aWN0b3J5LCB0YXNrTGlnaHQsIGRvd25sb2FkQnRuLCBzdGFycyB9O1xufVxuXG5mdW5jdGlvbiBnZXRQZXRhbENlbnRlcihub2RlczogRW5kTm9kZXMpOiBjYy5WZWMyIHtcbiAgICByZXR1cm4gY2MudjIobm9kZXMudmljdG9yeS54LCBub2Rlcy52aWN0b3J5LnkpO1xufVxuXG5mdW5jdGlvbiBnZXRDYW52YXNGcm9tRW5kKGVuZFJvb3Q6IGNjLk5vZGUpOiBjYy5Ob2RlIHwgbnVsbCB7XG4gICAgY29uc3QgcGFyZW50ID0gZW5kUm9vdCAmJiBlbmRSb290LnBhcmVudDtcbiAgICByZXR1cm4gcGFyZW50ICYmIGlzVmFsaWQocGFyZW50KSA/IHBhcmVudCA6IG51bGw7XG59XG5cbi8qKiBlbmQg5pyA5bqV5bGC5Y2K6YCP5piO6buR5bqV77yM5bC65a+45LiOIGJnIOebuOWQjO+8iFNIT1dfQUxMIGNvdmVy77yJICovXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlVmljdG9yeUVuZERpbUJhY2tkcm9wKGVuZFJvb3Q6IGNjLk5vZGUsIGNhbnZhcz86IGNjLk5vZGUpOiBjYy5Ob2RlIHwgbnVsbCB7XG4gICAgaWYgKCFlbmRSb290IHx8ICFpc1ZhbGlkKGVuZFJvb3QpKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBjYW52YXNOb2RlID0gY2FudmFzICYmIGlzVmFsaWQoY2FudmFzKSA/IGNhbnZhcyA6IGdldENhbnZhc0Zyb21FbmQoZW5kUm9vdCk7XG4gICAgaWYgKCFjYW52YXNOb2RlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGJnID0gY2FudmFzTm9kZS5nZXRDaGlsZEJ5TmFtZSgnYmcnKTtcbiAgICBpZiAoIWJnIHx8ICFpc1ZhbGlkKGJnKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyDlnLrmma/ph4wgZW5kIOW4uOS4uum7keiJsiBjb2xvcu+8jOS8muS5mOWIsOWtkOiKgueCueS4iuWvvOiHtOmBrue9qeWPkemXt+OAgeeci+S4jeWHuumAj+aYjlxuICAgIGVuZFJvb3QuY29sb3IgPSBjYy5Db2xvci5XSElURTtcbiAgICBlbmRSb290Lm9wYWNpdHkgPSAyNTU7XG5cbiAgICBsZXQgZGltID0gZW5kUm9vdC5nZXRDaGlsZEJ5TmFtZShFTkRfRElNX0JBQ0tEUk9QX05BTUUpO1xuICAgIGlmICghZGltIHx8ICFpc1ZhbGlkKGRpbSkpIHtcbiAgICAgICAgZGltID0gbmV3IGNjLk5vZGUoRU5EX0RJTV9CQUNLRFJPUF9OQU1FKTtcbiAgICAgICAgZGltLnNldEFuY2hvclBvaW50KDAuNSwgMC41KTtcbiAgICAgICAgZGltLnNldFBvc2l0aW9uKDAsIDApO1xuICAgICAgICBlbmRSb290Lmluc2VydENoaWxkKGRpbSwgMCk7XG4gICAgfVxuXG4gICAgY29uc3Qgb2xkR3JhcGhpY3MgPSBkaW0uZ2V0Q29tcG9uZW50KGNjLkdyYXBoaWNzKTtcbiAgICBpZiAob2xkR3JhcGhpY3MpIHtcbiAgICAgICAgb2xkR3JhcGhpY3MuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIGxldCBzcHJpdGUgPSBkaW0uZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgaWYgKCFzcHJpdGUpIHtcbiAgICAgICAgc3ByaXRlID0gZGltLmFkZENvbXBvbmVudChjYy5TcHJpdGUpO1xuICAgIH1cbiAgICBzcHJpdGUuc3ByaXRlRnJhbWUgPSBnZXRXaGl0ZVNwcml0ZUZyYW1lKCk7XG4gICAgc3ByaXRlLnR5cGUgPSBjYy5TcHJpdGUuVHlwZS5TSU1QTEU7XG4gICAgc3ByaXRlLnNpemVNb2RlID0gY2MuU3ByaXRlLlNpemVNb2RlLkNVU1RPTTtcblxuICAgIGRpbS5hY3RpdmUgPSB0cnVlO1xuICAgIGRpbS56SW5kZXggPSBaX09SREVSX0VORF9DSElMRC5ESU1fQkFDS0RST1A7XG4gICAgZGltLmNvbG9yID0gY2MuQ29sb3IuQkxBQ0s7XG4gICAgZGltLm9wYWNpdHkgPSBFTkRfRElNX09QQUNJVFk7XG4gICAgZGltLnNldENvbnRlbnRTaXplKGJnLndpZHRoLCBiZy5oZWlnaHQpO1xuICAgIGxheW91dFNob3dBbGxDb3ZlcihkaW0sIGNhbnZhc05vZGUpO1xuXG4gICAgcmV0dXJuIGRpbTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxheW91dFZpY3RvcnlFbmREaW1CYWNrZHJvcChlbmRSb290OiBjYy5Ob2RlLCBjYW52YXM/OiBjYy5Ob2RlKTogdm9pZCB7XG4gICAgZW5zdXJlVmljdG9yeUVuZERpbUJhY2tkcm9wKGVuZFJvb3QsIGNhbnZhcyk7XG59XG5cbmZ1bmN0aW9uIGhpZGVOb2RlKG5vZGU6IGNjLk5vZGUpOiB2b2lkIHtcbiAgICBub2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgbm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICBub2RlLm9wYWNpdHkgPSAwO1xufVxuXG4vKiog5L+d5oyBIGFjdGl2Ze+8jOS7hemAj+aYju+8iGluYWN0aXZlIOiKgueCueS4iiBydW5BY3Rpb24g5ZyoIDIuNCDlj6/og73kuI3miafooYzvvIkgKi9cbmZ1bmN0aW9uIGhpZGVOb2RlVmlzdWFsKG5vZGU6IGNjLk5vZGUpOiB2b2lkIHtcbiAgICBub2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgbm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgIG5vZGUub3BhY2l0eSA9IDA7XG59XG5cbi8qKiBpY29u77ya5LuOIElDT05fU1RBUlRfU0NBTEUg5by55Yiw5Zy65pmv6K6+6K6h57yp5pS+77yI5Yu/55So5b2T5YmNIHNjYWxlIOW9kyBiYXNl77yMcHJlcGFyZSDkvJrmlLnlsI/vvIkgKi9cbmZ1bmN0aW9uIHBsYXlJY29uUG9wQm91bmNlKGljb246IGNjLk5vZGUsIHRhcmdldFNjYWxlOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpY29uLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgaWNvbi5hY3RpdmUgPSB0cnVlO1xuICAgIGljb24ub3BhY2l0eSA9IDA7XG4gICAgaWNvbi5zZXRTY2FsZShJQ09OX1NUQVJUX1NDQUxFKTtcbiAgICBjb25zdCBwZWFrID0gdGFyZ2V0U2NhbGUgKiAxLjEyO1xuICAgIGljb24ucnVuQWN0aW9uKGNjLnNlcXVlbmNlKFxuICAgICAgICBjYy5zcGF3bihcbiAgICAgICAgICAgIGNjLmZhZGVJbigwLjEpLFxuICAgICAgICAgICAgY2Muc2NhbGVUbyhJQ09OX1BPUF9EVVJBVElPTiwgcGVhaykuZWFzaW5nKGNjLmVhc2VCYWNrT3V0KCkpXG4gICAgICAgICksXG4gICAgICAgIGNjLnNjYWxlVG8oSUNPTl9TRVRUTEVfRFVSQVRJT04sIHRhcmdldFNjYWxlKS5lYXNpbmcoY2MuZWFzZVNpbmVPdXQoKSlcbiAgICApKTtcbn1cblxuZnVuY3Rpb24gcGxheVZpY3RvcnlBcHBlYXJUaGVuTG9vcCh2aWN0b3J5OiBjYy5Ob2RlLCBvbkFwcGVhckRvbmU6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB2aWN0b3J5LmFjdGl2ZSA9IHRydWU7XG4gICAgdmljdG9yeS5vcGFjaXR5ID0gMjU1O1xuICAgIGNvbnN0IHNrID0gdmljdG9yeS5nZXRDb21wb25lbnQoc3AuU2tlbGV0b24pO1xuICAgIGlmICghc2spIHtcbiAgICAgICAgY2Mud2FybignW1ZpY3RvcnlFbmRQYW5lbF0gdmljdG9yeSDnvLrlsJEgc3AuU2tlbGV0b24nKTtcbiAgICAgICAgb25BcHBlYXJEb25lKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2suc2V0Q29tcGxldGVMaXN0ZW5lcihudWxsKTtcbiAgICBzay5sb29wID0gZmFsc2U7XG4gICAgc2suc2V0QW5pbWF0aW9uKDAsIFNQSU5FX1ZJQ1RPUllfQVBQRUFSLCBmYWxzZSk7XG4gICAgbGV0IGRvbmUgPSBmYWxzZTtcbiAgICBjb25zdCBmaW5pc2ggPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGlmIChkb25lIHx8ICFpc1ZhbGlkKHZpY3RvcnkpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIHNrLnNldENvbXBsZXRlTGlzdGVuZXIobnVsbCk7XG4gICAgICAgIHNrLmxvb3AgPSB0cnVlO1xuICAgICAgICBzay5zZXRBbmltYXRpb24oMCwgU1BJTkVfVklDVE9SWV9MT09QLCB0cnVlKTtcbiAgICAgICAgb25BcHBlYXJEb25lKCk7XG4gICAgfTtcbiAgICBzay5zZXRDb21wbGV0ZUxpc3RlbmVyKGZpbmlzaCk7XG4gICAgdmljdG9yeS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoXG4gICAgICAgIGNjLmRlbGF5VGltZShWSUNUT1JZX0FQUEVBUl9GQUxMQkFDSyksXG4gICAgICAgIGNjLmNhbGxGdW5jKGZpbmlzaCwgbnVsbClcbiAgICApKTtcbn1cblxuZnVuY3Rpb24gcGxheVN0YXJzUG9wKHN0YXJzOiBTdGFyU2xvdFtdLCBjZW50ZXI6IGNjLlZlYzIpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHNsb3QgPSBzdGFyc1tpXTtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHNsb3Qubm9kZTtcbiAgICAgICAgbm9kZS5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICBub2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIG5vZGUuekluZGV4ID0gMjA7XG4gICAgICAgIG5vZGUuc2V0UG9zaXRpb24oY2VudGVyLngsIGNlbnRlci55KTtcbiAgICAgICAgbm9kZS5zZXRTY2FsZShTVEFSX1NUQVJUX1NDQUxFKTtcbiAgICAgICAgbm9kZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgbm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoXG4gICAgICAgICAgICBjYy5kZWxheVRpbWUoaSAqIFNUQVJfU1RBR0dFUiksXG4gICAgICAgICAgICBjYy5zcGF3bihcbiAgICAgICAgICAgICAgICBjYy5mYWRlSW4oMC4wOCksXG4gICAgICAgICAgICAgICAgY2MubW92ZVRvKFNUQVJfUE9QX0RVUkFUSU9OLCBzbG90LnRhcmdldFgsIHNsb3QudGFyZ2V0WSkuZWFzaW5nKGNjLmVhc2VCYWNrT3V0KCkpLFxuICAgICAgICAgICAgICAgIGNjLnNjYWxlVG8oU1RBUl9QT1BfRFVSQVRJT04sIDEpLmVhc2luZyhjYy5lYXNlQmFja091dCgpKVxuICAgICAgICAgICAgKVxuICAgICAgICApKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRlc3Ryb3lFbmRTY29yZUxhYmVsKGVuZFJvb3Q6IGNjLk5vZGUpOiB2b2lkIHtcbiAgICBjb25zdCBvbGQgPSBlbmRSb290LmdldENoaWxkQnlOYW1lKE5PREVfRU5EX1NDT1JFKTtcbiAgICBpZiAob2xkICYmIGlzVmFsaWQob2xkKSkge1xuICAgICAgICBvbGQuZGVzdHJveSgpO1xuICAgIH1cbn1cblxuLyoqIOWIhuaVsOaMguWcqCBlbmQg5LiK77yI5Yu/5oyC5ZyoIFNwaW5lIFRhc2tMaWdodCDlrZDoioLngrnvvIwyLjQg5LiL5bi45LiN5pi+56S677yJICovXG5mdW5jdGlvbiBlbnN1cmVFbmRTY29yZUxhYmVsKFxuICAgIGVuZFJvb3Q6IGNjLk5vZGUsXG4gICAgdGFza0xpZ2h0OiBjYy5Ob2RlLFxuICAgIGZvbnQ6IGNjLkJpdG1hcEZvbnQsXG4gICAgc2NvcmU6IG51bWJlclxuKTogY2MuTm9kZSB7XG4gICAgZGVzdHJveUVuZFNjb3JlTGFiZWwoZW5kUm9vdCk7XG4gICAgY29uc3Qgbm9kZSA9IG5ldyBjYy5Ob2RlKE5PREVfRU5EX1NDT1JFKTtcbiAgICBjb25zdCBsYWJlbCA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLkxhYmVsKTtcbiAgICBsYWJlbC5mb250ID0gZm9udDtcbiAgICBsYWJlbC5mb250U2l6ZSA9IFNDT1JFX0ZPTlRfU0laRTtcbiAgICBsYWJlbC5saW5lSGVpZ2h0ID0gU0NPUkVfTElORV9IRUlHSFQ7XG4gICAgbGFiZWwuZW5hYmxlV3JhcFRleHQgPSBmYWxzZTtcbiAgICBsYWJlbC5ob3Jpem9udGFsQWxpZ24gPSBjYy5MYWJlbC5Ib3Jpem9udGFsQWxpZ24uQ0VOVEVSO1xuICAgIGxhYmVsLnZlcnRpY2FsQWxpZ24gPSBjYy5MYWJlbC5WZXJ0aWNhbEFsaWduLkNFTlRFUjtcbiAgICBsYWJlbC5zdHJpbmcgPSBTdHJpbmcoTWF0aC5tYXgoMCwgTWF0aC5mbG9vcihzY29yZSkpKTtcbiAgICBub2RlLnNldEFuY2hvclBvaW50KDAuNSwgMC41KTtcbiAgICBub2RlLnNldFBvc2l0aW9uKHRhc2tMaWdodC54LCB0YXNrTGlnaHQueSArIFNDT1JFX0FCT1ZFX1RBU0tfWSk7XG4gICAgbm9kZS56SW5kZXggPSBFTkRfU0NPUkVfWl9JTkRFWDtcbiAgICBlbmRSb290LmFkZENoaWxkKG5vZGUpO1xuICAgIHJldHVybiBub2RlO1xufVxuXG5mdW5jdGlvbiBzaG93U2V0dGxlbWVudFNjb3JlKFxuICAgIGVuZFJvb3Q6IGNjLk5vZGUsXG4gICAgdGFza0xpZ2h0OiBjYy5Ob2RlLFxuICAgIHNjb3JlOiBudW1iZXIsXG4gICAgc2NvcmVGb250OiBjYy5CaXRtYXBGb250IHwgbnVsbCxcbiAgICBzY29yZURpc3BsYXk6IEFydFNjb3JlRGlzcGxheSB8IG51bGxcbik6IHZvaWQge1xuICAgIGlmIChzY29yZURpc3BsYXkgJiYgaXNWYWxpZChzY29yZURpc3BsYXkucm9vdCkpIHtcbiAgICAgICAgc2NvcmVEaXNwbGF5LnNldFZhbHVlKHNjb3JlLCBmYWxzZSk7XG4gICAgICAgIHNjb3JlRGlzcGxheS5zZXRWaXNpYmxlKHRydWUpO1xuICAgICAgICBzY29yZURpc3BsYXkubW91bnRPbkVuZFNldHRsZShcbiAgICAgICAgICAgIGVuZFJvb3QsXG4gICAgICAgICAgICB0YXNrTGlnaHQueCxcbiAgICAgICAgICAgIHRhc2tMaWdodC55ICsgU0NPUkVfQUJPVkVfVEFTS19ZXG4gICAgICAgICk7XG4gICAgICAgIHNjb3JlRGlzcGxheS5wbGF5U2V0dGxlUmV2ZWFsKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZm9udCA9IHNjb3JlRm9udCB8fCAoc2NvcmVEaXNwbGF5ID8gc2NvcmVEaXNwbGF5LmdldEJpdG1hcEZvbnQoKSA6IG51bGwpO1xuICAgIGlmICghZm9udCkge1xuICAgICAgICBjYy53YXJuKCdbVmljdG9yeUVuZFBhbmVsXSDml6DkvY3lm77lrZfkvZPvvIzot7Pov4fliIbmlbDlrZfluZUnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzY29yZU5vZGUgPSBlbnN1cmVFbmRTY29yZUxhYmVsKGVuZFJvb3QsIHRhc2tMaWdodCwgZm9udCwgc2NvcmUpO1xuICAgIHBsYXlTY29yZVB1bmNoKHNjb3JlTm9kZSk7XG59XG5cbmZ1bmN0aW9uIHBsYXlTY29yZVB1bmNoKHNjb3JlTm9kZTogY2MuTm9kZSk6IHZvaWQge1xuICAgIHNjb3JlTm9kZS5zdG9wQWxsQWN0aW9ucygpO1xuICAgIHNjb3JlTm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgIHNjb3JlTm9kZS5vcGFjaXR5ID0gMjU1O1xuICAgIHNjb3JlTm9kZS5zZXRTY2FsZSgwLjM1KTtcbiAgICBzY29yZU5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKFxuICAgICAgICBjYy5zcGF3bihcbiAgICAgICAgICAgIGNjLmZhZGVJbigwLjA2KSxcbiAgICAgICAgICAgIGNjLnNjYWxlVG8oMC4yMiwgU0NPUkVfUFVOQ0hfU0NBTEUpLmVhc2luZyhjYy5lYXNlQmFja091dCgpKVxuICAgICAgICApLFxuICAgICAgICBjYy5zY2FsZVRvKFNDT1JFX1BVTkNIX0RVUkFUSU9OLCAxKS5lYXNpbmcoY2MuZWFzZVNpbmVPdXQoKSlcbiAgICApKTtcbn1cblxuZnVuY3Rpb24gcGxheVRhc2tMaWdodEFwcGVhcjEodGFza0xpZ2h0OiBjYy5Ob2RlLCBvbkRvbmU6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0YXNrTGlnaHQuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICB0YXNrTGlnaHQuYWN0aXZlID0gdHJ1ZTtcbiAgICB0YXNrTGlnaHQub3BhY2l0eSA9IDI1NTtcbiAgICBjb25zdCBzayA9IHRhc2tMaWdodC5nZXRDb21wb25lbnQoc3AuU2tlbGV0b24pO1xuICAgIGlmICghc2spIHtcbiAgICAgICAgY2Mud2FybignW1ZpY3RvcnlFbmRQYW5lbF0gVGFza0xpZ2h0IOe8uuWwkSBzcC5Ta2VsZXRvbicpO1xuICAgICAgICBvbkRvbmUoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzay5zZXRDb21wbGV0ZUxpc3RlbmVyKG51bGwpO1xuICAgIHNrLmxvb3AgPSBmYWxzZTtcbiAgICBzay5zZXRBbmltYXRpb24oMCwgU1BJTkVfVEFTS19BUFBFQVIsIGZhbHNlKTtcbiAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgIGNvbnN0IGZpbmlzaCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgc2suc2V0Q29tcGxldGVMaXN0ZW5lcihudWxsKTtcbiAgICAgICAgb25Eb25lKCk7XG4gICAgfTtcbiAgICBzay5zZXRDb21wbGV0ZUxpc3RlbmVyKGZpbmlzaCk7XG4gICAgdGFza0xpZ2h0LnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShcbiAgICAgICAgY2MuZGVsYXlUaW1lKFRBU0tfQVBQRUFSX0ZBTExCQUNLKSxcbiAgICAgICAgY2MuY2FsbEZ1bmMoZmluaXNoLCBudWxsKVxuICAgICkpO1xufVxuXG5mdW5jdGlvbiBwbGF5RG93bmxvYWRCdG5CcmVhdGhMb29wKGJ0bjogY2MuTm9kZSwgYmFzZVNjYWxlOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBwZWFrID0gYmFzZVNjYWxlICogQlROX0JSRUFUSF9QRUFLX1JBVElPO1xuICAgIGJ0bi5ydW5BY3Rpb24oY2MucmVwZWF0Rm9yZXZlcihjYy5zZXF1ZW5jZShcbiAgICAgICAgY2Muc2NhbGVUbyhCVE5fQlJFQVRIX0hBTEZfRFVSQVRJT04sIHBlYWspLmVhc2luZyhjYy5lYXNlU2luZUluT3V0KCkpLFxuICAgICAgICBjYy5zY2FsZVRvKEJUTl9CUkVBVEhfSEFMRl9EVVJBVElPTiwgYmFzZVNjYWxlKS5lYXNpbmcoY2MuZWFzZVNpbmVJbk91dCgpKVxuICAgICkpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuYmluZFZpY3RvcnlFbmREb3dubG9hZEJ1dHRvbihidG46IGNjLk5vZGUpOiB2b2lkIHtcbiAgICBpZiAoIWJ0biB8fCAhaXNWYWxpZChidG4pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYnRuLm9mZignY2xpY2snKTtcbiAgICBidG4ub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCk7XG4gICAgY29uc3QgYnV0dG9uID0gYnRuLmdldENvbXBvbmVudChjYy5CdXR0b24pO1xuICAgIGlmIChidXR0b24pIHtcbiAgICAgICAgYnV0dG9uLmNsaWNrRXZlbnRzID0gW107XG4gICAgfVxufVxuXG4vKiog57uR5a6aIGRvd25sb2FkIOiKgueCueeCueWHu++8iOS7hSByZXNldCDml7bnlKjvvJvmraPluLjnu5HlrprlnKggR2FtZUNvbnRyb2xsZXIuYmluZEVuZERvd25sb2FkQnV0dG9u77yJICovXG5leHBvcnQgZnVuY3Rpb24gYmluZFZpY3RvcnlFbmREb3dubG9hZEJ1dHRvbihidG46IGNjLk5vZGUsIG9uQ2xpY2s6IFZpY3RvcnlFbmREb3dubG9hZENhbGxiYWNrKTogdm9pZCB7XG4gICAgaWYgKCFidG4gfHwgIWlzVmFsaWQoYnRuKSB8fCAhb25DbGljaykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHVuYmluZFZpY3RvcnlFbmREb3dubG9hZEJ1dHRvbihidG4pO1xuICAgIGNvbnN0IGJ1dHRvbiA9IGJ0bi5nZXRDb21wb25lbnQoY2MuQnV0dG9uKTtcbiAgICBpZiAoYnV0dG9uKSB7XG4gICAgICAgIGJ1dHRvbi5pbnRlcmFjdGFibGUgPSB0cnVlO1xuICAgICAgICBidG4ub24oJ2NsaWNrJywgb25DbGljaywgYnRuKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBidG4ub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCBvbkNsaWNrLCBidG4pO1xufVxuXG5mdW5jdGlvbiBwbGF5RG93bmxvYWRCdG5SZXZlYWwoYnRuOiBjYy5Ob2RlKTogdm9pZCB7XG4gICAgYnRuLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgYnRuLmFjdGl2ZSA9IHRydWU7XG4gICAgYnRuLnpJbmRleCA9IFpfT1JERVJfRU5EX0NISUxELkRPV05MT0FEO1xuICAgIGNvbnN0IHRhcmdldFNjYWxlID0gTWF0aC5tYXgoTWF0aC5hYnMoYnRuLnNjYWxlWCksIDAuMDEpO1xuICAgIGJ0bi5zZXRTY2FsZSh0YXJnZXRTY2FsZSAqIDAuNTUpO1xuICAgIGJ0bi5vcGFjaXR5ID0gMDtcbiAgICBidG4ucnVuQWN0aW9uKGNjLnNlcXVlbmNlKFxuICAgICAgICBjYy5zcGF3bihcbiAgICAgICAgICAgIGNjLmZhZGVJbihCVE5fUE9QX0RVUkFUSU9OKSxcbiAgICAgICAgICAgIGNjLnNlcXVlbmNlKFxuICAgICAgICAgICAgICAgIGNjLnNjYWxlVG8oQlROX1BPUF9EVVJBVElPTiwgdGFyZ2V0U2NhbGUgKiAxLjA4KS5lYXNpbmcoY2MuZWFzZUJhY2tPdXQoKSksXG4gICAgICAgICAgICAgICAgY2Muc2NhbGVUbygwLjA4LCB0YXJnZXRTY2FsZSkuZWFzaW5nKGNjLmVhc2VTaW5lT3V0KCkpXG4gICAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIGNjLmNhbGxGdW5jKCgpID0+IHtcbiAgICAgICAgICAgIGlmICghYnRuIHx8ICFpc1ZhbGlkKGJ0bikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBidG4uc2V0U2NhbGUodGFyZ2V0U2NhbGUpO1xuICAgICAgICAgICAgcGxheURvd25sb2FkQnRuQnJlYXRoTG9vcChidG4sIHRhcmdldFNjYWxlKTtcbiAgICAgICAgfSwgbnVsbClcbiAgICApKTtcbn1cblxuLyoqIOS4i+i9veaMiemSruW7tuaXtuW/hemhu+aMguWcqCBlbmRSb29077yI5Yu/5oyC5ZyoIGFjdGl2ZT1mYWxzZSDnmoTmjInpkq7kuIrvvIkgKi9cbmZ1bmN0aW9uIHNjaGVkdWxlRG93bmxvYWRCdG5SZXZlYWwoZW5kUm9vdDogY2MuTm9kZSwgYnRuOiBjYy5Ob2RlLCBkZWxheTogbnVtYmVyKTogdm9pZCB7XG4gICAgZW5kUm9vdC5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoXG4gICAgICAgIGNjLmRlbGF5VGltZShkZWxheSksXG4gICAgICAgIGNjLmNhbGxGdW5jKCgpID0+IHBsYXlEb3dubG9hZEJ0blJldmVhbChidG4pLCBudWxsKVxuICAgICkpO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlRW5kUm9vdChlbmRSb290OiBjYy5Ob2RlLCBub2RlczogRW5kTm9kZXMpOiBjYy5Ob2RlIHtcbiAgICBpZiAoZW5kUm9vdCAmJiBpc1ZhbGlkKGVuZFJvb3QpKSB7XG4gICAgICAgIHJldHVybiBlbmRSb290O1xuICAgIH1cbiAgICBpZiAobm9kZXMgJiYgbm9kZXMuaWNvbiAmJiBpc1ZhbGlkKG5vZGVzLmljb24ucGFyZW50KSkge1xuICAgICAgICByZXR1cm4gbm9kZXMuaWNvbi5wYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBlbmRSb290O1xufVxuXG5mdW5jdGlvbiBwcmVwYXJlRW5kUGFuZWwoZW5kUm9vdDogY2MuTm9kZSwgbm9kZXM/OiBFbmROb2Rlcyk6IHZvaWQge1xuICAgIC8vIOWFvOWuueaXpyBxdWlja19jb21waWxlIOe8k+WtmO+8muabvuWGmeaIkCBwcmVwYXJlRW5kUGFuZWwobm9kZXMpXG4gICAgbGV0IHBhbmVsID0gbm9kZXM7XG4gICAgbGV0IHJvb3QgPSBlbmRSb290O1xuICAgIGlmICghcGFuZWwgJiYgZW5kUm9vdCAmJiAoZW5kUm9vdCBhcyBFbmROb2RlcykuaWNvbikge1xuICAgICAgICBwYW5lbCA9IGVuZFJvb3QgYXMgdW5rbm93biBhcyBFbmROb2RlcztcbiAgICAgICAgcm9vdCA9IHBhbmVsLmljb24ucGFyZW50O1xuICAgIH1cbiAgICBpZiAoIXBhbmVsIHx8ICFwYW5lbC5pY29uKSB7XG4gICAgICAgIGNjLndhcm4oJ1tWaWN0b3J5RW5kUGFuZWxdIHByZXBhcmVFbmRQYW5lbDog5peg5pWI55qEIGVuZCDoioLngrnnu5PmnoQnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByb290ID0gcmVzb2x2ZUVuZFJvb3Qocm9vdCwgcGFuZWwpO1xuICAgIHJvb3Qub3BhY2l0eSA9IDI1NTtcbiAgICBlbnN1cmVWaWN0b3J5RW5kRGltQmFja2Ryb3Aocm9vdCk7XG5cbiAgICBwYW5lbC5pY29uLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgcGFuZWwudmljdG9yeS5zdG9wQWxsQWN0aW9ucygpO1xuICAgIHBhbmVsLnRhc2tMaWdodC5zdG9wQWxsQWN0aW9ucygpO1xuICAgIHBhbmVsLmRvd25sb2FkQnRuLnN0b3BBbGxBY3Rpb25zKCk7XG5cbiAgICBwYW5lbC5pY29uLmFjdGl2ZSA9IHRydWU7XG4gICAgcGFuZWwuaWNvbi5vcGFjaXR5ID0gMDtcbiAgICBwYW5lbC5pY29uLnNldFNjYWxlKElDT05fU1RBUlRfU0NBTEUpO1xuXG4gICAgcGFuZWwudmljdG9yeS5hY3RpdmUgPSB0cnVlO1xuICAgIHBhbmVsLnZpY3Rvcnkub3BhY2l0eSA9IDI1NTtcblxuICAgIGhpZGVOb2RlKHBhbmVsLnRhc2tMaWdodCk7XG4gICAgaGlkZU5vZGVWaXN1YWwocGFuZWwuZG93bmxvYWRCdG4pO1xuXG4gICAgY29uc3QgY2VudGVyID0gZ2V0UGV0YWxDZW50ZXIocGFuZWwpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFuZWwuc3RhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc2xvdCA9IHBhbmVsLnN0YXJzW2ldO1xuICAgICAgICBzbG90Lm5vZGUuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgc2xvdC5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICBzbG90Lm5vZGUub3BhY2l0eSA9IDA7XG4gICAgICAgIHNsb3Qubm9kZS5zZXRQb3NpdGlvbihjZW50ZXIueCwgY2VudGVyLnkpO1xuICAgICAgICBzbG90Lm5vZGUuc2V0U2NhbGUoU1RBUl9TVEFSVF9TQ0FMRSk7XG4gICAgfVxuXG4gICAgZGVzdHJveUVuZFNjb3JlTGFiZWwocm9vdCk7XG59XG5cbmZ1bmN0aW9uIHBsYXlTdGVwVGFza0FuZFNjb3JlKFxuICAgIGVuZFJvb3Q6IGNjLk5vZGUsXG4gICAgbm9kZXM6IEVuZE5vZGVzLFxuICAgIHNjb3JlOiBudW1iZXIsXG4gICAgc2NvcmVGb250OiBjYy5CaXRtYXBGb250IHwgbnVsbCxcbiAgICBzY29yZURpc3BsYXk6IEFydFNjb3JlRGlzcGxheSB8IG51bGxcbik6IHZvaWQge1xuICAgIHBsYXlUYXNrTGlnaHRBcHBlYXIxKG5vZGVzLnRhc2tMaWdodCwgKCkgPT4ge30pO1xuICAgIHNob3dTZXR0bGVtZW50U2NvcmUoZW5kUm9vdCwgbm9kZXMudGFza0xpZ2h0LCBzY29yZSwgc2NvcmVGb250LCBzY29yZURpc3BsYXkpO1xuICAgIHNjaGVkdWxlRG93bmxvYWRCdG5SZXZlYWwoZW5kUm9vdCwgbm9kZXMuZG93bmxvYWRCdG4sIFNURVBfQlROX0FGVEVSX1NDT1JFKTtcbn1cblxuLyoqXG4gKiDikaAgaWNvbiDlvLnot7MgKyB2aWN0b3J5IEFwcGVhcu+8iOW5tuihjO+8iVxuICog4pGhIEFwcGVhciDnu5PmnZ8g4oaSIOaYn+aYn+mjnuWHuu+8jOW5tuefreW7tui/n+mHjeWPoCBUYXNrTGlnaHQgKyDliIbmlbBcbiAqIOKRoiDkuIvovb3mjInpkq5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBsYXlWaWN0b3J5RW5kU2VxdWVuY2UoXG4gICAgZW5kUm9vdDogY2MuTm9kZSxcbiAgICBzY29yZTogbnVtYmVyLFxuICAgIHNjb3JlRm9udDogY2MuQml0bWFwRm9udCB8IG51bGwsXG4gICAgc2NvcmVEaXNwbGF5OiBBcnRTY29yZURpc3BsYXkgfCBudWxsID0gbnVsbFxuKTogdm9pZCB7XG4gICAgY29uc3Qgbm9kZXMgPSBnZXRFbmROb2RlcyhlbmRSb290KTtcbiAgICBpZiAoIW5vZGVzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcHJlcGFyZUVuZFBhbmVsKGVuZFJvb3QsIG5vZGVzKTtcbiAgICBlbmRSb290LnN0b3BBbGxBY3Rpb25zKCk7XG5cbiAgICBjb25zdCBjZW50ZXIgPSBnZXRQZXRhbENlbnRlcihub2Rlcyk7XG5cbiAgICBwbGF5SWNvblBvcEJvdW5jZShub2Rlcy5pY29uLCBub2Rlcy5pY29uVGFyZ2V0U2NhbGUpO1xuICAgIHBsYXlWaWN0b3J5QXBwZWFyVGhlbkxvb3Aobm9kZXMudmljdG9yeSwgKCkgPT4ge1xuICAgICAgICBwbGF5U3RhcnNQb3Aobm9kZXMuc3RhcnMsIGNlbnRlcik7XG4gICAgICAgIGVuZFJvb3QucnVuQWN0aW9uKGNjLnNlcXVlbmNlKFxuICAgICAgICAgICAgY2MuZGVsYXlUaW1lKFNURVBfVEFTS19PVkVSTEFQKSxcbiAgICAgICAgICAgIGNjLmNhbGxGdW5jKFxuICAgICAgICAgICAgICAgICgpID0+IHBsYXlTdGVwVGFza0FuZFNjb3JlKGVuZFJvb3QsIG5vZGVzLCBzY29yZSwgc2NvcmVGb250LCBzY29yZURpc3BsYXkpLFxuICAgICAgICAgICAgICAgIG51bGxcbiAgICAgICAgICAgIClcbiAgICAgICAgKSk7XG4gICAgfSk7XG59XG5cbi8qKiBAZGVwcmVjYXRlZCDkvb/nlKggcGxheVZpY3RvcnlFbmRTZXF1ZW5jZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBsYXlWaWN0b3J5RW5kU2VxdWVuY2VMZWdhY3koZW5kUm9vdDogY2MuTm9kZSk6IHZvaWQge1xuICAgIHBsYXlWaWN0b3J5RW5kU2VxdWVuY2UoZW5kUm9vdCwgMCwgbnVsbCk7XG59XG5cbi8qKiBAZGVwcmVjYXRlZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBsYXlWaWN0b3J5RW5kVW5sb2NrKGVuZFJvb3Q6IGNjLk5vZGUpOiB2b2lkIHtcbiAgICBwbGF5VmljdG9yeUVuZFNlcXVlbmNlKGVuZFJvb3QsIDAsIG51bGwpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRWaWN0b3J5RW5kVW5sb2NrKGVuZFJvb3Q6IGNjLk5vZGUpOiB2b2lkIHtcbiAgICBpZiAoIWVuZFJvb3QgfHwgIWlzVmFsaWQoZW5kUm9vdCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlbmRSb290LnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgY29uc3Qgbm9kZXMgPSBnZXRFbmROb2RlcyhlbmRSb290KTtcbiAgICBpZiAoIW5vZGVzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB2aWN0b3J5U2sgPSBub2Rlcy52aWN0b3J5LmdldENvbXBvbmVudChzcC5Ta2VsZXRvbik7XG4gICAgaWYgKHZpY3RvcnlTaykge1xuICAgICAgICB2aWN0b3J5U2suc2V0Q29tcGxldGVMaXN0ZW5lcihudWxsKTtcbiAgICAgICAgdmljdG9yeVNrLmxvb3AgPSBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgdGFza1NrID0gbm9kZXMudGFza0xpZ2h0LmdldENvbXBvbmVudChzcC5Ta2VsZXRvbik7XG4gICAgaWYgKHRhc2tTaykge1xuICAgICAgICB0YXNrU2suc2V0Q29tcGxldGVMaXN0ZW5lcihudWxsKTtcbiAgICAgICAgdGFza1NrLmxvb3AgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBub2Rlcy5pY29uLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgbm9kZXMuaWNvbi5hY3RpdmUgPSB0cnVlO1xuICAgIG5vZGVzLmljb24ub3BhY2l0eSA9IDI1NTtcbiAgICBub2Rlcy5pY29uLnNldFNjYWxlKG5vZGVzLmljb25UYXJnZXRTY2FsZSk7XG5cbiAgICBub2Rlcy52aWN0b3J5LnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgbm9kZXMudmljdG9yeS5hY3RpdmUgPSB0cnVlO1xuICAgIG5vZGVzLnZpY3Rvcnkub3BhY2l0eSA9IDI1NTtcblxuICAgIG5vZGVzLnRhc2tMaWdodC5zdG9wQWxsQWN0aW9ucygpO1xuICAgIG5vZGVzLnRhc2tMaWdodC5hY3RpdmUgPSB0cnVlO1xuICAgIG5vZGVzLnRhc2tMaWdodC5vcGFjaXR5ID0gMjU1O1xuXG4gICAgbm9kZXMuZG93bmxvYWRCdG4uc3RvcEFsbEFjdGlvbnMoKTtcbiAgICB1bmJpbmRWaWN0b3J5RW5kRG93bmxvYWRCdXR0b24obm9kZXMuZG93bmxvYWRCdG4pO1xuICAgIG5vZGVzLmRvd25sb2FkQnRuLmFjdGl2ZSA9IHRydWU7XG4gICAgbm9kZXMuZG93bmxvYWRCdG4uekluZGV4ID0gWl9PUkRFUl9FTkRfQ0hJTEQuRE9XTkxPQUQ7XG4gICAgbm9kZXMuZG93bmxvYWRCdG4ub3BhY2l0eSA9IDI1NTtcbiAgICBub2Rlcy5kb3dubG9hZEJ0bi5zZXRTY2FsZShNYXRoLm1heChNYXRoLmFicyhub2Rlcy5kb3dubG9hZEJ0bi5zY2FsZVgpLCAwLjAxKSk7XG5cbiAgICBlbmRSb290Lm9wYWNpdHkgPSAyNTU7XG4gICAgZW5zdXJlVmljdG9yeUVuZERpbUJhY2tkcm9wKGVuZFJvb3QpO1xuXG4gICAgZGVzdHJveUVuZFNjb3JlTGFiZWwoZW5kUm9vdCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLnN0YXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHNsb3QgPSBub2Rlcy5zdGFyc1tpXTtcbiAgICAgICAgc2xvdC5ub2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIHNsb3Qubm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICBzbG90Lm5vZGUuc2V0UG9zaXRpb24oc2xvdC50YXJnZXRYLCBzbG90LnRhcmdldFkpO1xuICAgICAgICBzbG90Lm5vZGUuc2V0U2NhbGUoMSk7XG4gICAgICAgIHNsb3Qubm9kZS5vcGFjaXR5ID0gMjU1O1xuICAgIH1cbn1cbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/ui/ArtScoreDisplay.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '77505DUHA9AXYWpG4IIdCuT', 'ArtScoreDisplay');
// script/ui/ArtScoreDisplay.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtScoreDisplay = void 0;
/** 使用 Cocos 官方位图字体（.fnt + .png）+ Label 显示积分 */
var is_valid_1 = require("../is-valid");
var GamePreloadConfig_1 = require("./GamePreloadConfig");
var GameImgAtlas_1 = require("./GameImgAtlas");
var SCORE_FONT_PATH = 'font/score_digits';
var SCORE_LABEL_FONT_SIZE = 54;
var SCORE_LABEL_LINE_HEIGHT = 70;
var SCORE_PUNCH_SCALE = 1.08;
var SCORE_PUNCH_DURATION = 0.12;
var SETTLE_POP_SCALE = 1.32;
var SETTLE_POP_IN_DURATION = 0.28;
/** 背光：由小变大并淡出 */
var SCORE_GLOW_SCALE_START = 0.35;
var SCORE_GLOW_SCALE_END = 1.15;
var SCORE_GLOW_DURATION = 0.48;
var ArtScoreDisplay = /** @class */ (function () {
    function ArtScoreDisplay(font) {
        this.value = 0;
        this.glowSf = null;
        this.root = new cc.Node('ScorePanel');
        this.root.zIndex = GamePreloadConfig_1.Z_ORDER.SCORE_HUD;
        this.glowNode = new cc.Node('score_glow');
        this.glowNode.setAnchorPoint(0.5, 0.5);
        this.glowNode.active = false;
        this.glowNode.opacity = 0;
        this.root.addChild(this.glowNode);
        var labelNode = new cc.Node('score_label');
        labelNode.setAnchorPoint(0.5, 0.5);
        this.root.addChild(labelNode);
        this.label = labelNode.addComponent(cc.Label);
        this.label.font = font;
        this.label.fontSize = SCORE_LABEL_FONT_SIZE;
        this.label.lineHeight = SCORE_LABEL_LINE_HEIGHT;
        this.label.enableWrapText = false;
        this.label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        this.label.verticalAlign = cc.Label.VerticalAlign.CENTER;
        this.label.string = '0';
        var widget = this.root.addComponent(cc.Widget);
        widget.isAlignTop = true;
        widget.isAlignHorizontalCenter = true;
        widget.horizontalCenter = 0;
        widget.isAbsoluteTop = true;
        widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
    }
    ArtScoreDisplay.load = function (onReady) {
        cc.resources.load(SCORE_FONT_PATH, cc.BitmapFont, function (err, font) {
            if (err || !font) {
                cc.warn('[ArtScoreDisplay] 位图字体加载失败:', SCORE_FONT_PATH, err);
                onReady(null);
                return;
            }
            onReady(ArtScoreDisplay.fromFont(font));
        });
    };
    ArtScoreDisplay.fromFont = function (font) {
        return new ArtScoreDisplay(font);
    };
    ArtScoreDisplay.prototype.mount = function (parent, topMargin) {
        parent.addChild(this.root);
        this.setTopMargin(topMargin);
        this.setValue(0, false);
    };
    ArtScoreDisplay.prototype.setTopMargin = function (top) {
        var widget = this.root.getComponent(cc.Widget);
        if (widget) {
            widget.top = top;
            widget.updateAlignment();
        }
    };
    ArtScoreDisplay.prototype.getValue = function () {
        return this.value;
    };
    ArtScoreDisplay.prototype.setVisible = function (visible) {
        if (is_valid_1.isValid(this.root)) {
            this.root.active = visible;
        }
    };
    ArtScoreDisplay.prototype.setValue = function (next, animate) {
        if (animate === void 0) { animate = true; }
        this.value = Math.max(0, Math.floor(next));
        this.label.string = String(this.value);
        this.syncGlowToScore();
        if (animate) {
            this.playPunch();
            this.playScoreGlow();
        }
    };
    ArtScoreDisplay.prototype.addValue = function (delta) {
        if (delta <= 0) {
            return;
        }
        this.setValue(this.value + delta, true);
    };
    /** 背光与分数同锚点 (0.5,0.5)、同位置 */
    ArtScoreDisplay.prototype.syncGlowToScore = function () {
        var labelNode = this.label.node;
        if (!labelNode || !is_valid_1.isValid(labelNode) || !is_valid_1.isValid(this.glowNode)) {
            return;
        }
        labelNode.setAnchorPoint(0.5, 0.5);
        this.glowNode.setAnchorPoint(0.5, 0.5);
        this.glowNode.setPosition(labelNode.x, labelNode.y);
    };
    ArtScoreDisplay.prototype.playPunch = function () {
        var labelNode = this.label.node;
        labelNode.stopAllActions();
        var base = 1;
        labelNode.scale = base;
        labelNode.runAction(cc.sequence(cc.scaleTo(SCORE_PUNCH_DURATION, SCORE_PUNCH_SCALE).easing(cc.easeBackOut()), cc.scaleTo(SCORE_PUNCH_DURATION, base).easing(cc.easeSineOut())));
    };
    ArtScoreDisplay.prototype.playScoreGlow = function () {
        var _this = this;
        var run = function () {
            if (!_this.glowSf || !is_valid_1.isValid(_this.glowNode)) {
                return;
            }
            var sprite = _this.glowNode.getComponent(cc.Sprite);
            if (!sprite) {
                sprite = _this.glowNode.addComponent(cc.Sprite);
            }
            sprite.spriteFrame = _this.glowSf;
            sprite.sizeMode = cc.Sprite.SizeMode.TRIMMED;
            _this.syncGlowToScore();
            _this.glowNode.stopAllActions();
            _this.glowNode.active = true;
            _this.glowNode.opacity = 255;
            _this.glowNode.setScale(SCORE_GLOW_SCALE_START);
            _this.glowNode.runAction(cc.spawn(cc.scaleTo(SCORE_GLOW_DURATION, SCORE_GLOW_SCALE_END).easing(cc.easeSineOut()), cc.sequence(cc.delayTime(SCORE_GLOW_DURATION * 0.2), cc.fadeOut(SCORE_GLOW_DURATION * 0.8).easing(cc.easeSineIn()))));
            _this.glowNode.runAction(cc.sequence(cc.delayTime(SCORE_GLOW_DURATION + 0.02), cc.callFunc(function () {
                if (_this.glowNode && is_valid_1.isValid(_this.glowNode)) {
                    _this.glowNode.active = false;
                    _this.glowNode.opacity = 0;
                }
            }, null)));
        };
        if (this.glowSf) {
            run();
            return;
        }
        GameImgAtlas_1.loadGameSpriteFrame(GamePreloadConfig_1.SCORE_GLOW_PATH, function (sf) {
            if (sf) {
                _this.glowSf = sf;
            }
            run();
        });
    };
    ArtScoreDisplay.prototype.getBitmapFont = function () {
        return this.label && this.label.font ? this.label.font : null;
    };
    /** 挂到 end 节点上，在 TaskLight 附近显示结算分 */
    ArtScoreDisplay.prototype.mountOnEndSettle = function (endRoot, localX, localY) {
        if (!endRoot || !is_valid_1.isValid(endRoot) || !is_valid_1.isValid(this.root)) {
            return;
        }
        var widget = this.root.getComponent(cc.Widget);
        if (widget) {
            widget.enabled = false;
        }
        if (this.root.parent !== endRoot) {
            this.root.removeFromParent(false);
            endRoot.addChild(this.root);
        }
        this.root.setPosition(localX, localY);
        this.root.zIndex = GamePreloadConfig_1.Z_ORDER_END_CHILD.SCORE;
        this.root.active = true;
    };
    /** 结算结束，恢复顶部 HUD */
    ArtScoreDisplay.prototype.remountToGameHud = function (canvas, topMargin) {
        if (!canvas || !is_valid_1.isValid(canvas) || !is_valid_1.isValid(this.root)) {
            return;
        }
        if (this.glowNode && is_valid_1.isValid(this.glowNode)) {
            this.glowNode.stopAllActions();
            this.glowNode.active = false;
            this.glowNode.opacity = 0;
        }
        this.root.stopAllActions();
        this.root.scale = 1;
        this.root.opacity = 255;
        if (this.root.parent !== canvas) {
            this.root.removeFromParent(false);
            canvas.addChild(this.root);
        }
        this.root.zIndex = GamePreloadConfig_1.Z_ORDER.SCORE_HUD;
        var widget = this.root.getComponent(cc.Widget);
        if (widget) {
            widget.enabled = true;
            widget.isAlignTop = true;
            widget.isAlignHorizontalCenter = true;
            widget.horizontalCenter = 0;
            widget.isAbsoluteTop = true;
        }
        this.setTopMargin(topMargin);
    };
    /** 通关结算：沿用顶部唯一位图 Label，避免再建 Label 导致主分数消失 */
    ArtScoreDisplay.prototype.playSettleReveal = function () {
        if (this.glowNode && is_valid_1.isValid(this.glowNode)) {
            this.glowNode.stopAllActions();
            this.glowNode.active = false;
        }
        this.root.zIndex = GamePreloadConfig_1.Z_ORDER_END_CHILD.SCORE;
        this.label.string = String(this.value);
        this.root.stopAllActions();
        this.root.scale = 0.3;
        this.root.opacity = 0;
        this.root.runAction(cc.spawn(cc.scaleTo(SETTLE_POP_IN_DURATION, SETTLE_POP_SCALE).easing(cc.easeBackOut()), cc.fadeIn(SETTLE_POP_IN_DURATION * 0.7)));
        this.root.runAction(cc.sequence(cc.delayTime(SETTLE_POP_IN_DURATION), cc.scaleTo(0.08, 1).easing(cc.easeSineOut())));
    };
    return ArtScoreDisplay;
}());
exports.ArtScoreDisplay = ArtScoreDisplay;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvdWkvQXJ0U2NvcmVEaXNwbGF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtDQUErQztBQUMvQyx3Q0FBc0M7QUFDdEMseURBQWtGO0FBQ2xGLCtDQUFxRDtBQUVyRCxJQUFNLGVBQWUsR0FBRyxtQkFBbUIsQ0FBQztBQUM1QyxJQUFNLHFCQUFxQixHQUFHLEVBQUUsQ0FBQztBQUNqQyxJQUFNLHVCQUF1QixHQUFHLEVBQUUsQ0FBQztBQUNuQyxJQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQztBQUMvQixJQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQztBQUNsQyxJQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQztBQUM5QixJQUFNLHNCQUFzQixHQUFHLElBQUksQ0FBQztBQUVwQyxpQkFBaUI7QUFDakIsSUFBTSxzQkFBc0IsR0FBRyxJQUFJLENBQUM7QUFDcEMsSUFBTSxvQkFBb0IsR0FBRyxJQUFJLENBQUM7QUFDbEMsSUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUM7QUFFakM7SUFzQkkseUJBQW9CLElBQW1CO1FBbEIvQixVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsV0FBTSxHQUFtQixJQUFJLENBQUM7UUFrQmxDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLDJCQUFPLENBQUMsU0FBUyxDQUFDO1FBRXJDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxP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LENBQUMsRUFBRSxDQUFDLEtBQUssQ0FDeEIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsRUFDN0UsRUFBRSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsQ0FDMUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FDM0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxFQUNwQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQy9DLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDTCxzQkFBQztBQUFELENBM09BLEFBMk9DLElBQUE7QUEzT1ksMENBQWUiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvKiog5L2/55SoIENvY29zIOWumOaWueS9jeWbvuWtl+S9k++8iC5mbnQgKyAucG5n77yJKyBMYWJlbCDmmL7npLrnp6/liIYgKi9cbmltcG9ydCB7IGlzVmFsaWQgfSBmcm9tICcuLi9pcy12YWxpZCc7XG5pbXBvcnQgeyBTQ09SRV9HTE9XX1BBVEgsIFpfT1JERVIsIFpfT1JERVJfRU5EX0NISUxEIH0gZnJvbSAnLi9HYW1lUHJlbG9hZENvbmZpZyc7XG5pbXBvcnQgeyBsb2FkR2FtZVNwcml0ZUZyYW1lIH0gZnJvbSAnLi9HYW1lSW1nQXRsYXMnO1xuXG5jb25zdCBTQ09SRV9GT05UX1BBVEggPSAnZm9udC9zY29yZV9kaWdpdHMnO1xuY29uc3QgU0NPUkVfTEFCRUxfRk9OVF9TSVpFID0gNTQ7XG5jb25zdCBTQ09SRV9MQUJFTF9MSU5FX0hFSUdIVCA9IDcwO1xuY29uc3QgU0NPUkVfUFVOQ0hfU0NBTEUgPSAxLjA4O1xuY29uc3QgU0NPUkVfUFVOQ0hfRFVSQVRJT04gPSAwLjEyO1xuY29uc3QgU0VUVExFX1BPUF9TQ0FMRSA9IDEuMzI7XG5jb25zdCBTRVRUTEVfUE9QX0lOX0RVUkFUSU9OID0gMC4yODtcblxuLyoqIOiDjOWFie+8mueUseWwj+WPmOWkp+W5tua3oeWHuiAqL1xuY29uc3QgU0NPUkVfR0xPV19TQ0FMRV9TVEFSVCA9IDAuMzU7XG5jb25zdCBTQ09SRV9HTE9XX1NDQUxFX0VORCA9IDEuMTU7XG5jb25zdCBTQ09SRV9HTE9XX0RVUkFUSU9OID0gMC40ODtcblxuZXhwb3J0IGNsYXNzIEFydFNjb3JlRGlzcGxheSB7XG4gICAgcmVhZG9ubHkgcm9vdDogY2MuTm9kZTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGxhYmVsOiBjYy5MYWJlbDtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGdsb3dOb2RlOiBjYy5Ob2RlO1xuICAgIHByaXZhdGUgdmFsdWUgPSAwO1xuICAgIHByaXZhdGUgZ2xvd1NmOiBjYy5TcHJpdGVGcmFtZSA9IG51bGw7XG5cbiAgICBzdGF0aWMgbG9hZChvblJlYWR5OiAoZGlzcGxheTogQXJ0U2NvcmVEaXNwbGF5IHwgbnVsbCkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgICBjYy5yZXNvdXJjZXMubG9hZChTQ09SRV9GT05UX1BBVEgsIGNjLkJpdG1hcEZvbnQsIChlcnIsIGZvbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIgfHwgIWZvbnQpIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuKCdbQXJ0U2NvcmVEaXNwbGF5XSDkvY3lm77lrZfkvZPliqDovb3lpLHotKU6JywgU0NPUkVfRk9OVF9QQVRILCBlcnIpO1xuICAgICAgICAgICAgICAgIG9uUmVhZHkobnVsbCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb25SZWFkeShBcnRTY29yZURpc3BsYXkuZnJvbUZvbnQoZm9udCkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZnJvbUZvbnQoZm9udDogY2MuQml0bWFwRm9udCk6IEFydFNjb3JlRGlzcGxheSB7XG4gICAgICAgIHJldHVybiBuZXcgQXJ0U2NvcmVEaXNwbGF5KGZvbnQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoZm9udDogY2MuQml0bWFwRm9udCkge1xuICAgICAgICB0aGlzLnJvb3QgPSBuZXcgY2MuTm9kZSgnU2NvcmVQYW5lbCcpO1xuICAgICAgICB0aGlzLnJvb3QuekluZGV4ID0gWl9PUkRFUi5TQ09SRV9IVUQ7XG5cbiAgICAgICAgdGhpcy5nbG93Tm9kZSA9IG5ldyBjYy5Ob2RlKCdzY29yZV9nbG93Jyk7XG4gICAgICAgIHRoaXMuZ2xvd05vZGUuc2V0QW5jaG9yUG9pbnQoMC41LCAwLjUpO1xuICAgICAgICB0aGlzLmdsb3dOb2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmdsb3dOb2RlLm9wYWNpdHkgPSAwO1xuICAgICAgICB0aGlzLnJvb3QuYWRkQ2hpbGQodGhpcy5nbG93Tm9kZSk7XG5cbiAgICAgICAgY29uc3QgbGFiZWxOb2RlID0gbmV3IGNjLk5vZGUoJ3Njb3JlX2xhYmVsJyk7XG4gICAgICAgIGxhYmVsTm9kZS5zZXRBbmNob3JQb2ludCgwLjUsIDAuNSk7XG4gICAgICAgIHRoaXMucm9vdC5hZGRDaGlsZChsYWJlbE5vZGUpO1xuXG4gICAgICAgIHRoaXMubGFiZWwgPSBsYWJlbE5vZGUuYWRkQ29tcG9uZW50KGNjLkxhYmVsKTtcbiAgICAgICAgdGhpcy5sYWJlbC5mb250ID0gZm9udDtcbiAgICAgICAgdGhpcy5sYWJlbC5mb250U2l6ZSA9IFNDT1JFX0xBQkVMX0ZPTlRfU0laRTtcbiAgICAgICAgdGhpcy5sYWJlbC5saW5lSGVpZ2h0ID0gU0NPUkVfTEFCRUxfTElORV9IRUlHSFQ7XG4gICAgICAgIHRoaXMubGFiZWwuZW5hYmxlV3JhcFRleHQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5sYWJlbC5ob3Jpem9udGFsQWxpZ24gPSBjYy5MYWJlbC5Ib3Jpem9udGFsQWxpZ24uQ0VOVEVSO1xuICAgICAgICB0aGlzLmxhYmVsLnZlcnRpY2FsQWxpZ24gPSBjYy5MYWJlbC5WZXJ0aWNhbEFsaWduLkNFTlRFUjtcbiAgICAgICAgdGhpcy5sYWJlbC5zdHJpbmcgPSAnMCc7XG5cbiAgICAgICAgY29uc3Qgd2lkZ2V0ID0gdGhpcy5yb290LmFkZENvbXBvbmVudChjYy5XaWRnZXQpO1xuICAgICAgICB3aWRnZXQuaXNBbGlnblRvcCA9IHRydWU7XG4gICAgICAgIHdpZGdldC5pc0FsaWduSG9yaXpvbnRhbENlbnRlciA9IHRydWU7XG4gICAgICAgIHdpZGdldC5ob3Jpem9udGFsQ2VudGVyID0gMDtcbiAgICAgICAgd2lkZ2V0LmlzQWJzb2x1dGVUb3AgPSB0cnVlO1xuICAgICAgICB3aWRnZXQuYWxpZ25Nb2RlID0gY2MuV2lkZ2V0LkFsaWduTW9kZS5PTl9XSU5ET1dfUkVTSVpFO1xuICAgIH1cblxuICAgIG1vdW50KHBhcmVudDogY2MuTm9kZSwgdG9wTWFyZ2luOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgcGFyZW50LmFkZENoaWxkKHRoaXMucm9vdCk7XG4gICAgICAgIHRoaXMuc2V0VG9wTWFyZ2luKHRvcE1hcmdpbik7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoMCwgZmFsc2UpO1xuICAgIH1cblxuICAgIHNldFRvcE1hcmdpbih0b3A6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCB3aWRnZXQgPSB0aGlzLnJvb3QuZ2V0Q29tcG9uZW50KGNjLldpZGdldCk7XG4gICAgICAgIGlmICh3aWRnZXQpIHtcbiAgICAgICAgICAgIHdpZGdldC50b3AgPSB0b3A7XG4gICAgICAgICAgICB3aWRnZXQudXBkYXRlQWxpZ25tZW50KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRWYWx1ZSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgICB9XG5cbiAgICBzZXRWaXNpYmxlKHZpc2libGU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgaWYgKGlzVmFsaWQodGhpcy5yb290KSkge1xuICAgICAgICAgICAgdGhpcy5yb290LmFjdGl2ZSA9IHZpc2libGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRWYWx1ZShuZXh0OiBudW1iZXIsIGFuaW1hdGU6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgICAgIHRoaXMudmFsdWUgPSBNYXRoLm1heCgwLCBNYXRoLmZsb29yKG5leHQpKTtcbiAgICAgICAgdGhpcy5sYWJlbC5zdHJpbmcgPSBTdHJpbmcodGhpcy52YWx1ZSk7XG4gICAgICAgIHRoaXMuc3luY0dsb3dUb1Njb3JlKCk7XG4gICAgICAgIGlmIChhbmltYXRlKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlQdW5jaCgpO1xuICAgICAgICAgICAgdGhpcy5wbGF5U2NvcmVHbG93KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRWYWx1ZShkZWx0YTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmIChkZWx0YSA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLnZhbHVlICsgZGVsdGEsIHRydWUpO1xuICAgIH1cblxuICAgIC8qKiDog4zlhYnkuI7liIbmlbDlkIzplJrngrkgKDAuNSwwLjUp44CB5ZCM5L2N572uICovXG4gICAgcHJpdmF0ZSBzeW5jR2xvd1RvU2NvcmUoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGxhYmVsTm9kZSA9IHRoaXMubGFiZWwubm9kZTtcbiAgICAgICAgaWYgKCFsYWJlbE5vZGUgfHwgIWlzVmFsaWQobGFiZWxOb2RlKSB8fCAhaXNWYWxpZCh0aGlzLmdsb3dOb2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxhYmVsTm9kZS5zZXRBbmNob3JQb2ludCgwLjUsIDAuNSk7XG4gICAgICAgIHRoaXMuZ2xvd05vZGUuc2V0QW5jaG9yUG9pbnQoMC41LCAwLjUpO1xuICAgICAgICB0aGlzLmdsb3dOb2RlLnNldFBvc2l0aW9uKGxhYmVsTm9kZS54LCBsYWJlbE5vZGUueSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwbGF5UHVuY2goKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGxhYmVsTm9kZSA9IHRoaXMubGFiZWwubm9kZTtcbiAgICAgICAgbGFiZWxOb2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIGNvbnN0IGJhc2UgPSAxO1xuICAgICAgICBsYWJlbE5vZGUuc2NhbGUgPSBiYXNlO1xuICAgICAgICBsYWJlbE5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKFxuICAgICAgICAgICAgY2Muc2NhbGVUbyhTQ09SRV9QVU5DSF9EVVJBVElPTiwgU0NPUkVfUFVOQ0hfU0NBTEUpLmVhc2luZyhjYy5lYXNlQmFja091dCgpKSxcbiAgICAgICAgICAgIGNjLnNjYWxlVG8oU0NPUkVfUFVOQ0hfRFVSQVRJT04sIGJhc2UpLmVhc2luZyhjYy5lYXNlU2luZU91dCgpKVxuICAgICAgICApKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBsYXlTY29yZUdsb3coKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHJ1biA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5nbG93U2YgfHwgIWlzVmFsaWQodGhpcy5nbG93Tm9kZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgc3ByaXRlID0gdGhpcy5nbG93Tm9kZS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgICAgIGlmICghc3ByaXRlKSB7XG4gICAgICAgICAgICAgICAgc3ByaXRlID0gdGhpcy5nbG93Tm9kZS5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNwcml0ZS5zcHJpdGVGcmFtZSA9IHRoaXMuZ2xvd1NmO1xuICAgICAgICAgICAgc3ByaXRlLnNpemVNb2RlID0gY2MuU3ByaXRlLlNpemVNb2RlLlRSSU1NRUQ7XG5cbiAgICAgICAgICAgIHRoaXMuc3luY0dsb3dUb1Njb3JlKCk7XG5cbiAgICAgICAgICAgIHRoaXMuZ2xvd05vZGUuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgICAgIHRoaXMuZ2xvd05vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZ2xvd05vZGUub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgICAgIHRoaXMuZ2xvd05vZGUuc2V0U2NhbGUoU0NPUkVfR0xPV19TQ0FMRV9TVEFSVCk7XG4gICAgICAgICAgICB0aGlzLmdsb3dOb2RlLnJ1bkFjdGlvbihjYy5zcGF3bihcbiAgICAgICAgICAgICAgICBjYy5zY2FsZVRvKFNDT1JFX0dMT1dfRFVSQVRJT04sIFNDT1JFX0dMT1dfU0NBTEVfRU5EKS5lYXNpbmcoY2MuZWFzZVNpbmVPdXQoKSksXG4gICAgICAgICAgICAgICAgY2Muc2VxdWVuY2UoXG4gICAgICAgICAgICAgICAgICAgIGNjLmRlbGF5VGltZShTQ09SRV9HTE9XX0RVUkFUSU9OICogMC4yKSxcbiAgICAgICAgICAgICAgICAgICAgY2MuZmFkZU91dChTQ09SRV9HTE9XX0RVUkFUSU9OICogMC44KS5lYXNpbmcoY2MuZWFzZVNpbmVJbigpKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgdGhpcy5nbG93Tm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoXG4gICAgICAgICAgICAgICAgY2MuZGVsYXlUaW1lKFNDT1JFX0dMT1dfRFVSQVRJT04gKyAwLjAyKSxcbiAgICAgICAgICAgICAgICBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdsb3dOb2RlICYmIGlzVmFsaWQodGhpcy5nbG93Tm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2xvd05vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdsb3dOb2RlLm9wYWNpdHkgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgbnVsbClcbiAgICAgICAgICAgICkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0aGlzLmdsb3dTZikge1xuICAgICAgICAgICAgcnVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbG9hZEdhbWVTcHJpdGVGcmFtZShTQ09SRV9HTE9XX1BBVEgsIChzZikgPT4ge1xuICAgICAgICAgICAgaWYgKHNmKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nbG93U2YgPSBzZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJ1bigpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXRCaXRtYXBGb250KCk6IGNjLkJpdG1hcEZvbnQgfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGFiZWwgJiYgdGhpcy5sYWJlbC5mb250ID8gdGhpcy5sYWJlbC5mb250IDogbnVsbDtcbiAgICB9XG5cbiAgICAvKiog5oyC5YiwIGVuZCDoioLngrnkuIrvvIzlnKggVGFza0xpZ2h0IOmZhOi/keaYvuekuue7k+eul+WIhiAqL1xuICAgIG1vdW50T25FbmRTZXR0bGUoZW5kUm9vdDogY2MuTm9kZSwgbG9jYWxYOiBudW1iZXIsIGxvY2FsWTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmICghZW5kUm9vdCB8fCAhaXNWYWxpZChlbmRSb290KSB8fCAhaXNWYWxpZCh0aGlzLnJvb3QpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgd2lkZ2V0ID0gdGhpcy5yb290LmdldENvbXBvbmVudChjYy5XaWRnZXQpO1xuICAgICAgICBpZiAod2lkZ2V0KSB7XG4gICAgICAgICAgICB3aWRnZXQuZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJvb3QucGFyZW50ICE9PSBlbmRSb290KSB7XG4gICAgICAgICAgICB0aGlzLnJvb3QucmVtb3ZlRnJvbVBhcmVudChmYWxzZSk7XG4gICAgICAgICAgICBlbmRSb290LmFkZENoaWxkKHRoaXMucm9vdCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb290LnNldFBvc2l0aW9uKGxvY2FsWCwgbG9jYWxZKTtcbiAgICAgICAgdGhpcy5yb290LnpJbmRleCA9IFpfT1JERVJfRU5EX0NISUxELlNDT1JFO1xuICAgICAgICB0aGlzLnJvb3QuYWN0aXZlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKiog57uT566X57uT5p2f77yM5oGi5aSN6aG26YOoIEhVRCAqL1xuICAgIHJlbW91bnRUb0dhbWVIdWQoY2FudmFzOiBjYy5Ob2RlLCB0b3BNYXJnaW46IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoIWNhbnZhcyB8fCAhaXNWYWxpZChjYW52YXMpIHx8ICFpc1ZhbGlkKHRoaXMucm9vdCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5nbG93Tm9kZSAmJiBpc1ZhbGlkKHRoaXMuZ2xvd05vZGUpKSB7XG4gICAgICAgICAgICB0aGlzLmdsb3dOb2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgICAgICB0aGlzLmdsb3dOb2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5nbG93Tm9kZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJvb3Quc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgdGhpcy5yb290LnNjYWxlID0gMTtcbiAgICAgICAgdGhpcy5yb290Lm9wYWNpdHkgPSAyNTU7XG4gICAgICAgIGlmICh0aGlzLnJvb3QucGFyZW50ICE9PSBjYW52YXMpIHtcbiAgICAgICAgICAgIHRoaXMucm9vdC5yZW1vdmVGcm9tUGFyZW50KGZhbHNlKTtcbiAgICAgICAgICAgIGNhbnZhcy5hZGRDaGlsZCh0aGlzLnJvb3QpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucm9vdC56SW5kZXggPSBaX09SREVSLlNDT1JFX0hVRDtcbiAgICAgICAgY29uc3Qgd2lkZ2V0ID0gdGhpcy5yb290LmdldENvbXBvbmVudChjYy5XaWRnZXQpO1xuICAgICAgICBpZiAod2lkZ2V0KSB7XG4gICAgICAgICAgICB3aWRnZXQuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICB3aWRnZXQuaXNBbGlnblRvcCA9IHRydWU7XG4gICAgICAgICAgICB3aWRnZXQuaXNBbGlnbkhvcml6b250YWxDZW50ZXIgPSB0cnVlO1xuICAgICAgICAgICAgd2lkZ2V0Lmhvcml6b250YWxDZW50ZXIgPSAwO1xuICAgICAgICAgICAgd2lkZ2V0LmlzQWJzb2x1dGVUb3AgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0VG9wTWFyZ2luKHRvcE1hcmdpbik7XG4gICAgfVxuXG4gICAgLyoqIOmAmuWFs+e7k+eul++8muayv+eUqOmhtumDqOWUr+S4gOS9jeWbviBMYWJlbO+8jOmBv+WFjeWGjeW7uiBMYWJlbCDlr7zoh7TkuLvliIbmlbDmtojlpLEgKi9cbiAgICBwbGF5U2V0dGxlUmV2ZWFsKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5nbG93Tm9kZSAmJiBpc1ZhbGlkKHRoaXMuZ2xvd05vZGUpKSB7XG4gICAgICAgICAgICB0aGlzLmdsb3dOb2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgICAgICB0aGlzLmdsb3dOb2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucm9vdC56SW5kZXggPSBaX09SREVSX0VORF9DSElMRC5TQ09SRTtcbiAgICAgICAgdGhpcy5sYWJlbC5zdHJpbmcgPSBTdHJpbmcodGhpcy52YWx1ZSk7XG4gICAgICAgIHRoaXMucm9vdC5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICB0aGlzLnJvb3Quc2NhbGUgPSAwLjM7XG4gICAgICAgIHRoaXMucm9vdC5vcGFjaXR5ID0gMDtcbiAgICAgICAgdGhpcy5yb290LnJ1bkFjdGlvbihjYy5zcGF3bihcbiAgICAgICAgICAgIGNjLnNjYWxlVG8oU0VUVExFX1BPUF9JTl9EVVJBVElPTiwgU0VUVExFX1BPUF9TQ0FMRSkuZWFzaW5nKGNjLmVhc2VCYWNrT3V0KCkpLFxuICAgICAgICAgICAgY2MuZmFkZUluKFNFVFRMRV9QT1BfSU5fRFVSQVRJT04gKiAwLjcpXG4gICAgICAgICkpO1xuICAgICAgICB0aGlzLnJvb3QucnVuQWN0aW9uKGNjLnNlcXVlbmNlKFxuICAgICAgICAgICAgY2MuZGVsYXlUaW1lKFNFVFRMRV9QT1BfSU5fRFVSQVRJT04pLFxuICAgICAgICAgICAgY2Muc2NhbGVUbygwLjA4LCAxKS5lYXNpbmcoY2MuZWFzZVNpbmVPdXQoKSlcbiAgICAgICAgKSk7XG4gICAgfVxufVxuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/main.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'e216aWcAc5LWZ+JKFI6x6JN', 'main');
// script/main.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var is_valid_1 = require("./is-valid");
var MatchRule_1 = require("./core/MatchRule");
var BoardManager_1 = require("./core/BoardManager");
var HintSolver_1 = require("./core/HintSolver");
var ArtScoreDisplay_1 = require("./ui/ArtScoreDisplay");
var GamePreloader_1 = require("./ui/GamePreloader");
var LoadingScreen_1 = require("./ui/LoadingScreen");
var GamePreloadConfig_1 = require("./ui/GamePreloadConfig");
var GameImgAtlas_1 = require("./ui/GameImgAtlas");
var ShowAllLayout_1 = require("./ui/ShowAllLayout");
var VictoryEndPanel_1 = require("./ui/VictoryEndPanel");
var super_html_playable_1 = require("./super_html_playable");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var LEVEL_PATH = 'data/level_01';
var CHECK_SOUND_PATH = 'check';
/** 无操作多少秒后自动高亮可消的一对 */
var IDLE_GUIDE_SECONDS = 2;
/** 提示跑马灯/晃动固定展示时长（秒内点击不提前关掉） */
var HINT_DISPLAY_SECONDS = 3;
/** 点击不可消牌：Canvas 上 hit 节点闪烁 */
var HIT_BLINK_STEP = 0.1;
var HIT_BLINK_COUNT = 3;
var HIT_BLINK_PEAK = 220;
var HIT_BLINK_LOW = 50;
/** 消除：先外弹 → 对齐 Y 中心 → 横向靠拢碰撞 → 消失 */
var MATCH_OUTWARD_DURATION = 0.14;
var MATCH_OUTWARD_DIST = 44;
var MATCH_ALIGN_Y_DURATION = 0.2;
var MATCH_MOVE_X_DURATION = 0.16;
var MATCH_TOUCH_DURATION = 0.08;
/** 两牌贴边相碰后停留再淡出 */
var MATCH_TOUCH_HOLD_DURATION = 0.18;
var MATCH_FADE_DURATION = 0.2;
/** 贴边后向中线轻顶一下（像素），不越过对侧 */
var MATCH_TOUCH_NUDGE = 5;
/** 结算前剩余牌快速自动消除 */
var AUTO_CLEAR_PAIR_FADE = 0.16;
var AUTO_CLEAR_MOVE_DURATION = 0.12;
var AUTO_CLEAR_STAGGER_MAX = 0.09;
/** 连消评级：情绪由弱到强，每多消 RATE_MATCH_STEP 对才升一级 */
var RATE_MATCH_STEP = 2;
var RATE_POP_IN_DURATION = 0.22;
var RATE_HOLD_DURATION = 0.55;
var RATE_POP_OUT_DURATION = 0.2;
/** 各档位基准缩放，越往后情绪越强、字越大 */
var RATE_TIER_SCALES = [0.68, 0.76, 0.84, 0.92, 1.02];
/** 评级图最大占屏宽比例，避免 unbelievable 等长图超出 */
var RATE_MAX_WIDTH_RATIO = 0.88;
/** 积分：基础 + 连击 + 评级阶段额外叠加 */
var SCORE_BASE = 200;
var SCORE_COMBO_ADD = 40;
var SCORE_RATE_BONUS = [100, 200, 350, 500, 800];
var SCORE_TOP_MARGIN = 64;
var GameController = /** @class */ (function (_super) {
    __extends(GameController, _super);
    function GameController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tilePrefab = null;
        _this.boardNode = null;
        _this.board = new BoardManager_1.BoardManager();
        _this.selected = null;
        _this.guideHighlight = null;
        /** 当前提示是否在固定展示窗口内（3 秒内不因点击取消） */
        _this.hintDisplayLocked = false;
        _this.gameReady = false;
        _this.isRemoving = false;
        _this.checkClip = null;
        _this.hitNode = null;
        _this.endNode = null;
        _this.comboNum = 0;
        /** 本局已成功消除的对数（达 SETTLEMENT_MATCH_PAIRS 即结算） */
        _this.matchPairCount = 0;
        _this.rateFrames = [];
        _this.ratePopupNode = null;
        _this.scoreNum = 0;
        _this.scoreDisplay = null;
        _this.scoreFont = null;
        _this.cachedLevelAsset = null;
        _this.loadingScreen = null;
        _this.isGameOver = false;
        /** 达结算条件后正在快速扫尾消除剩余牌 */
        _this.isAutoClearing = false;
        /** 本局是否已因点击收起引导小手 */
        _this.guideHandDismissedThisLevel = false;
        _this.onHintDisplayEnd = function () {
            if (!_this.isGuideHintActive()) {
                return;
            }
            _this.hintDisplayLocked = false;
            _this.clearGuideHighlight();
            _this.resetIdleGuideTimer();
        };
        _this.showFirstGuideHandDeferred = function () {
            if (!_this.guideHighlight || _this.guideHandDismissedThisLevel) {
                return;
            }
            _this.tryShowFirstGuideHand(_this.guideHighlight);
        };
        _this.finishAutoClearThenVictory = function () {
            if (!_this.isAutoClearing) {
                return;
            }
            _this.isAutoClearing = false;
            _this.fadeOutUnpairedRemainders();
            _this.board.refreshVisuals();
            _this.showVictory();
        };
        return _this;
    }
    GameController.prototype.onLoad = function () {
        var _this = this;
        if (GamePreloadConfig_1.TARGET_FRAME_RATE > 0) {
            cc.game.setFrameRate(GamePreloadConfig_1.TARGET_FRAME_RATE);
        }
        cc.view.setResizeCallback(function () {
            _this.layoutBackground();
            _this.layoutHit();
            _this.layoutScoreTop();
            _this.layoutEndDimBackdrop();
            if (_this.loadingScreen) {
                _this.loadingScreen.layout();
            }
        }, this);
    };
    GameController.prototype.onDestroy = function () {
        cc.view.setResizeCallback(null, null);
        this.unschedule(this.onIdleGuide);
    };
    GameController.prototype.start = function () {
        if (!this.tilePrefab) {
            cc.error('[GameController] 请在 Canvas 上绑定 mj 预制体');
            return;
        }
        this.boardNode = new cc.Node('Board');
        this.node.addChild(this.boardNode);
        this.hitNode = this.node.getChildByName('hit');
        if (this.hitNode && is_valid_1.isValid(this.hitNode)) {
            this.hitNode.active = false;
            this.hitNode.opacity = 0;
        }
        this.endNode = this.node.getChildByName('end');
        this.hideEndPanel();
        this.layoutBackground();
        this.layoutHit();
        this.layoutScoreTop();
        this.boardNode.active = false;
        this.startWithLoading();
        var google_play = "https://apps.apple.com/us/app/mahjong-royal-tiles/id6747492600";
        var appstore = "https://play.google.com/store/apps/details?id=com.nebula.mahjongtile";
        super_html_playable_1.default.set_google_play_url(google_play);
        super_html_playable_1.default.set_app_store_url(appstore);
    };
    /** 显示加载界面，预加载资源后进入关卡 */
    GameController.prototype.startWithLoading = function () {
        var _this = this;
        var loadT0 = GamePreloadConfig_1.LOADING_LOG_TIMING ? Date.now() : 0;
        this.loadingScreen = new LoadingScreen_1.LoadingScreen(this.node);
        this.loadingScreen.show(this.node);
        GamePreloader_1.GamePreloader.run(function () { }, function (result, err) {
            if (err || !result) {
                if (_this.loadingScreen) {
                    _this.loadingScreen.hide();
                }
                cc.warn('[GameController]', err || '加载失败');
                return;
            }
            _this.cachedLevelAsset = result.levelAsset;
            _this.applyPreloadResult(result);
            GamePreloader_1.GamePreloader.preloadGameplayAssets(function () { return _this.refreshLazyAssets(); });
            var levelT0 = GamePreloadConfig_1.LOADING_LOG_TIMING ? Date.now() : 0;
            _this.loadLevel(result.levelAsset, function () {
                _this.boardNode.active = true;
                if (_this.loadingScreen) {
                    _this.loadingScreen.hide(function () {
                        if (GamePreloadConfig_1.LOADING_LOG_TIMING) {
                            cc.log("[GameController] \u81F3\u5173\u52A0\u8F7D\u5C4F\u5173\u95ED " + (Date.now() - loadT0) + "ms" +
                                ("\uFF08\u5EFA\u5173 " + (Date.now() - levelT0) + "ms\uFF09"));
                        }
                    });
                }
            });
        });
    };
    GameController.prototype.applyPreloadResult = function (result) {
        if (result.checkClip) {
            this.checkClip = result.checkClip;
        }
        if (result.scoreFont) {
            this.scoreFont = result.scoreFont;
            this.scoreDisplay = ArtScoreDisplay_1.ArtScoreDisplay.fromFont(result.scoreFont);
            this.scoreDisplay.mount(this.node, SCORE_TOP_MARGIN);
            this.scoreDisplay.setValue(0, false);
        }
        if (result.guideHandSf) {
            this.board.setGuideHandSprite(result.guideHandSf);
        }
    };
    /** 后台资源进缓存后刷新引用 */
    GameController.prototype.refreshLazyAssets = function () {
        var _this = this;
        var frames = new Array(GamePreloadConfig_1.RATE_RES_KEYS.length);
        var pending = GamePreloadConfig_1.RATE_RES_KEYS.length;
        GamePreloadConfig_1.RATE_RES_KEYS.forEach(function (key, idx) {
            GameImgAtlas_1.loadGameSpriteFrame(GamePreloadConfig_1.rateResPath(key), function (frame) {
                pending--;
                if (frame) {
                    frames[idx] = frame;
                }
                if (pending === 0) {
                    _this.rateFrames = frames;
                }
            });
        });
        GameImgAtlas_1.loadGameSpriteFrame(GamePreloadConfig_1.GUIDE_HAND_PATH, function (sf) {
            if (sf) {
                _this.board.setGuideHandSprite(sf);
            }
        });
    };
    /** 引导小手：指向提示对子中靠左的一张 */
    GameController.prototype.tryShowFirstGuideHand = function (hint) {
        if (this.guideHandDismissedThisLevel) {
            return;
        }
        this.board.showHintGuideHand(this.pickLeftGuideHandTile(hint));
    };
    GameController.prototype.pickLeftGuideHandTile = function (hint) {
        if (hint.a.x !== hint.b.x) {
            return hint.a.x < hint.b.x ? hint.a : hint.b;
        }
        return hint.a.y <= hint.b.y ? hint.a : hint.b;
    };
    /** 顶部居中：Widget 对齐（位图字体 Label） */
    GameController.prototype.layoutScoreTop = function () {
        if (!this.scoreDisplay || !is_valid_1.isValid(this.scoreDisplay.root)) {
            return;
        }
        this.scoreDisplay.setTopMargin(SCORE_TOP_MARGIN);
    };
    /** SHOW_ALL 下背景 cover 铺满可视区域（不含屏外黑边） */
    GameController.prototype.layoutBackground = function () {
        var bg = this.node.getChildByName('bg');
        if (!bg || !is_valid_1.isValid(bg)) {
            return;
        }
        ShowAllLayout_1.layoutShowAllCover(bg, this.node);
        this.layoutEndDimBackdrop();
    };
    /** 结算 end 黑底与 bg 同步缩放 */
    GameController.prototype.layoutEndDimBackdrop = function () {
        if (!this.endNode || !is_valid_1.isValid(this.endNode) || !this.endNode.active) {
            return;
        }
        VictoryEndPanel_1.layoutVictoryEndDimBackdrop(this.endNode, this.node);
    };
    /** 与 bg 相同：hit 按 SHOW_ALL 铺满可视区域 */
    GameController.prototype.layoutHit = function () {
        var hit = this.hitNode;
        if (!hit || !is_valid_1.isValid(hit)) {
            return;
        }
        ShowAllLayout_1.layoutShowAllCover(hit, this.node);
        hit.setPosition(0, 0);
    };
    /** 全屏 hit 遮罩闪烁（点击不可消牌） */
    GameController.prototype.playHitBlink = function () {
        if (!this.hitNode || !is_valid_1.isValid(this.hitNode)) {
            return;
        }
        var hit = this.hitNode;
        this.layoutHit();
        hit.stopAllActions();
        hit.zIndex = GamePreloadConfig_1.Z_ORDER.HIT;
        hit.active = true;
        hit.opacity = 0;
        var steps = [];
        for (var i = 0; i < HIT_BLINK_COUNT; i++) {
            steps.push(cc.fadeTo(HIT_BLINK_STEP, HIT_BLINK_PEAK));
            steps.push(cc.fadeTo(HIT_BLINK_STEP, HIT_BLINK_LOW));
        }
        steps.push(cc.fadeTo(HIT_BLINK_STEP, 0));
        steps.push(cc.callFunc(function () {
            if (hit && is_valid_1.isValid(hit)) {
                hit.active = false;
                hit.opacity = 0;
            }
        }, this));
        hit.runAction(cc.sequence(steps));
    };
    GameController.prototype.loadLevel = function (cachedLevel, onReady) {
        var _this = this;
        this.gameReady = false;
        this.isGameOver = false;
        this.isAutoClearing = false;
        this.unschedule(this.finishAutoClearThenVictory);
        this.hideEndPanel();
        this.comboNum = 0;
        this.matchPairCount = 0;
        this.scoreNum = 0;
        if (this.scoreDisplay) {
            this.scoreDisplay.setValue(0, false);
        }
        this.board.hideHintGuideHand();
        this.guideHandDismissedThisLevel = false;
        this.clearGuideHighlight();
        this.unschedule(this.onIdleGuide);
        this.board.loadLevel(LEVEL_PATH, function (err) {
            if (err) {
                cc.warn('[GameController]', err);
                if (onReady) {
                    onReady();
                }
                return;
            }
            _this.board.spawn(_this.tilePrefab, _this.boardNode, function () {
                _this.board.bindBoardClick(_this.node, function (tile) { return _this.onTileTap(tile); });
                _this.gameReady = true;
                _this.resetIdleGuideTimer();
                if (GamePreloadConfig_1.LOADING_HIDE_BEFORE_ENTRANCE && onReady) {
                    onReady();
                }
            }, function () {
                _this.showGuideHighlight();
                if (!GamePreloadConfig_1.LOADING_HIDE_BEFORE_ENTRANCE && onReady) {
                    onReady();
                }
            });
        }, cachedLevel);
    };
    /** 当前是否正在展示提示（跑马灯/晃动窗口内不再重复触发） */
    GameController.prototype.isGuideHintActive = function () {
        return this.hintDisplayLocked && this.guideHighlight != null;
    };
    /** 高亮一对可消除的牌（入场完成 / 长时间无操作）：外缘跑马灯，固定展示 3 秒 */
    GameController.prototype.showGuideHighlight = function () {
        if (!this.gameReady || this.isRemoving || this.board.entrancePlaying)
            return;
        if (this.isGuideHintActive()) {
            return;
        }
        var hint = HintSolver_1.findHint(this.board.tiles);
        if (!hint) {
            this.clearGuideHighlight();
            return;
        }
        this.clearGuideHighlight();
        this.guideHighlight = hint;
        this.guideHandDismissedThisLevel = false;
        this.hintDisplayLocked = true;
        this.unschedule(this.onHintDisplayEnd);
        this.scheduleOnce(this.onHintDisplayEnd, HINT_DISPLAY_SECONDS);
        this.board.showGuideHintPair(hint.a, hint.b);
        this.unschedule(this.showFirstGuideHandDeferred);
        this.scheduleOnce(this.showFirstGuideHandDeferred, 0.12);
    };
    GameController.prototype.clearGuideHighlight = function () {
        this.unschedule(this.onHintDisplayEnd);
        this.unschedule(this.showFirstGuideHandDeferred);
        this.hintDisplayLocked = false;
        this.board.hideHintGuideHand();
        this.board.clearAllGuideMarquees();
        this.guideHighlight = null;
    };
    /** 点击选中牌时：取消全部跑马灯 / 晃动 / 小手提示 */
    GameController.prototype.cancelHintsOnSelect = function () {
        this.guideHandDismissedThisLevel = true;
        this.clearGuideHighlight();
        this.resetIdleGuideTimer();
    };
    GameController.prototype.resetIdleGuideTimer = function () {
        this.unschedule(this.onIdleGuide);
        if (!this.gameReady || this.isRemoving || this.board.entrancePlaying)
            return;
        this.scheduleOnce(this.onIdleGuide, IDLE_GUIDE_SECONDS);
    };
    GameController.prototype.onIdleGuide = function () {
        if (!this.gameReady || this.isAutoClearing || this.selected || this.isRemoving || this.board.entrancePlaying) {
            return;
        }
        if (this.isGuideHintActive()) {
            this.unschedule(this.onIdleGuide);
            this.scheduleOnce(this.onIdleGuide, IDLE_GUIDE_SECONDS);
            return;
        }
        this.showGuideHighlight();
    };
    GameController.prototype.onTileTap = function (tile) {
        if (this.isGameOver || this.isAutoClearing || tile.removed || this.isRemoving || this.board.entrancePlaying) {
            return;
        }
        if (!tile.free) {
            if (this.selected && this.selected.id !== tile.id) {
                this.deselectTile(this.selected);
            }
            this.comboNum = 0;
            this.board.playBlockedFeedback(tile);
            this.playHitBlink();
            return;
        }
        if (!this.selected) {
            this.cancelHintsOnSelect();
            this.selectTile(tile);
            return;
        }
        if (this.selected.id === tile.id) {
            this.deselectTile(this.selected);
            this.resetIdleGuideTimer();
            return;
        }
        if (!this.selected.free) {
            this.cancelHintsOnSelect();
            this.deselectTile(this.selected);
            this.selectTile(tile);
            return;
        }
        if (MatchRule_1.canMatch(this.selected, tile)) {
            var first = this.selected;
            this.selected = null;
            this.removePair(first, tile);
            return;
        }
        this.cancelHintsOnSelect();
        this.switchSelection(tile);
    };
    GameController.prototype.switchSelection = function (tile) {
        var prev = this.selected;
        if (prev && prev.id !== tile.id) {
            this.deselectTile(prev);
        }
        this.selectTile(tile);
    };
    GameController.prototype.selectTile = function (tile) {
        if (!tile.node || !is_valid_1.isValid(tile.node)) {
            return;
        }
        if (this.selected && this.selected.id !== tile.id) {
            this.deselectTile(this.selected);
        }
        this.selected = tile;
        this.board.bringTilesToFront([tile]);
        this.board.highlightTileSelect(tile);
    };
    GameController.prototype.deselectTile = function (tile, restoreZ) {
        if (restoreZ === void 0) { restoreZ = true; }
        if (this.selected && this.selected.id === tile.id) {
            this.selected = null;
        }
        if (!tile.removed && tile.node && is_valid_1.isValid(tile.node)) {
            this.board.restoreTileSelect(tile);
            if (restoreZ)
                this.board.restoreTileZIndex(tile);
            this.board.applyVisual(tile);
        }
        this.resetIdleGuideTimer();
    };
    GameController.prototype.removePair = function (a, b) {
        var _this = this;
        if (!a.node || !b.node || !is_valid_1.isValid(a.node) || !is_valid_1.isValid(b.node))
            return;
        this.unschedule(this.onIdleGuide);
        this.clearGuideHighlight();
        this.selected = null;
        this.board.clearTileSelectForMatch(a);
        this.board.clearTileSelectForMatch(b);
        var leftTile = a.x <= b.x ? a : b;
        var rightTile = a.x <= b.x ? b : a;
        this.board.bringMatchPairToFront(leftTile, rightTile);
        a.removed = true;
        b.removed = true;
        this.isRemoving = true;
        var midY = (a.y + b.y) * 0.5;
        var midX = (a.x + b.x) * 0.5;
        var pairDist = Math.abs(leftTile.x - rightTile.x);
        var meetGap = Math.max(this.board.getMatchMeetCenterGap(leftTile, true), this.board.getMatchMeetCenterGap(rightTile, true));
        var halfGap = meetGap * 0.5;
        var leftStopX = midX - halfGap;
        var rightStopX = midX + halfGap;
        var outwardDist = Math.max(MATCH_OUTWARD_DIST, pairDist * 0.2 + 28);
        this.playMatchCollideAnim(leftTile, midX, midY, 'left', leftStopX, outwardDist);
        this.playMatchCollideAnim(rightTile, midX, midY, 'right', rightStopX, outwardDist);
        var meetMoment = MATCH_OUTWARD_DURATION + MATCH_ALIGN_Y_DURATION + MATCH_MOVE_X_DURATION + MATCH_TOUCH_DURATION;
        this.scheduleOnce(function () {
            _this.board.bringMatchPairToFront(leftTile, rightTile);
            _this.board.playMatchEliminationEffect(midX, midY);
        }, meetMoment);
        var bumpDelay = MATCH_OUTWARD_DURATION +
            MATCH_ALIGN_Y_DURATION +
            MATCH_MOVE_X_DURATION +
            MATCH_TOUCH_DURATION +
            MATCH_TOUCH_HOLD_DURATION;
        this.comboNum++;
        this.matchPairCount++;
        var rateTier = this.getRateTierIndex(this.comboNum);
        var scoreGain = this.calcMatchScoreGain(this.comboNum, rateTier);
        this.scheduleOnce(function () {
            _this.playCheckSound();
            if (rateTier !== null) {
                _this.playRatePopup(rateTier);
            }
            _this.addScore(scoreGain);
        }, bumpDelay);
        var total = MATCH_OUTWARD_DURATION +
            MATCH_ALIGN_Y_DURATION +
            MATCH_MOVE_X_DURATION +
            MATCH_TOUCH_DURATION +
            MATCH_TOUCH_HOLD_DURATION +
            MATCH_FADE_DURATION;
        this.scheduleOnce(function () {
            _this.isRemoving = false;
            _this.board.refreshVisuals();
            _this.checkWin();
        }, total + 0.05);
    };
    /**
     * 1. 沿左右先往外弹开（保持当前 Y）
     * 2. 移到两牌 Y 中心高度
     * 3. 横向靠拢到中线两侧（中心距 = 牌宽，贴边不叠）
     * 4. 轻顶相碰 → 停留片刻 → 淡出销毁
     */
    GameController.prototype.playMatchCollideAnim = function (tile, midX, midY, side, stopX, outwardDist) {
        var node = tile.node;
        this.board.clearTileSelectForMatch(tile);
        var startX = tile.x;
        var startY = tile.y;
        node.setPosition(startX, startY);
        var outX = side === 'left' ? startX - outwardDist : startX + outwardDist;
        var baseScale = this.board.getBaseScale(tile);
        var touchX = side === 'left'
            ? Math.min(stopX + MATCH_TOUCH_NUDGE, midX - 1)
            : Math.max(stopX - MATCH_TOUCH_NUDGE, midX + 1);
        node.stopAllActions();
        node.runAction(cc.sequence(cc.moveTo(MATCH_OUTWARD_DURATION, outX, startY).easing(cc.easeBackOut()), cc.moveTo(MATCH_ALIGN_Y_DURATION, outX, midY).easing(cc.easeSineOut()), cc.moveTo(MATCH_MOVE_X_DURATION, stopX, midY).easing(cc.easeCubicActionIn()), 
        // cc.moveTo(MATCH_TOUCH_DURATION, touchX, midY).easing(cc.easeSineIn()),
        // cc.delayTime(MATCH_TOUCH_HOLD_DURATION),
        cc.spawn(cc.sequence(cc.scaleTo(MATCH_FADE_DURATION * 0.35, baseScale * 1.06), cc.scaleTo(MATCH_FADE_DURATION, 0).easing(cc.easeBackIn())), cc.fadeOut(MATCH_FADE_DURATION)), cc.callFunc(function () {
            if (node && is_valid_1.isValid(node))
                node.destroy();
        })));
    };
    /** 本局消除得分：基础分 + 连击加成 + 评级阶段奖励 */
    GameController.prototype.calcMatchScoreGain = function (combo, rateTier) {
        var gain = SCORE_BASE + SCORE_COMBO_ADD * combo;
        if (rateTier !== null) {
            gain += SCORE_RATE_BONUS[rateTier] || 0;
        }
        return gain;
    };
    GameController.prototype.addScore = function (delta) {
        this.scoreNum += delta;
        if (this.scoreDisplay) {
            this.scoreDisplay.addValue(delta);
        }
    };
    /**
     * 连消 2 对 → good，4 对 → great … 10+ → unbelievable。
     * 未到下一档间隔时不弹字。
     */
    GameController.prototype.getRateTierIndex = function (combo) {
        if (combo <= 0 || combo % RATE_MATCH_STEP !== 0) {
            return null;
        }
        var idx = Math.floor(combo / RATE_MATCH_STEP) - 1;
        if (idx < 0) {
            return null;
        }
        return Math.min(idx, GamePreloadConfig_1.RATE_RES_KEYS.length - 1);
    };
    /** 评级图在屏宽内的最大缩放（设计坐标） */
    GameController.prototype.getRatePopupFitCap = function (frame) {
        var spriteW = frame ? frame.getRect().width : 0;
        if (spriteW <= 0 || !this.node || !is_valid_1.isValid(this.node)) {
            return Number.POSITIVE_INFINITY;
        }
        return (this.node.width * RATE_MAX_WIDTH_RATIO) / spriteW;
    };
    GameController.prototype.getRatePopupTargetScale = function (tierIndex, frame) {
        var tierScale = RATE_TIER_SCALES[tierIndex] || RATE_TIER_SCALES[0];
        return Math.min(tierScale, this.getRatePopupFitCap(frame));
    };
    /** 屏幕正中弹出评级字，带弹出与收回动画 */
    GameController.prototype.playRatePopup = function (tierIndex) {
        var _this = this;
        if (!this.node || !is_valid_1.isValid(this.node)) {
            return;
        }
        var frame = this.rateFrames[tierIndex];
        if (!frame) {
            return;
        }
        if (this.ratePopupNode && is_valid_1.isValid(this.ratePopupNode)) {
            this.ratePopupNode.stopAllActions();
            this.ratePopupNode.destroy();
            this.ratePopupNode = null;
        }
        var node = new cc.Node('RatePopup');
        node.setPosition(0, 0);
        node.zIndex = GamePreloadConfig_1.Z_ORDER.RATE_POPUP;
        node.scale = 0;
        node.opacity = 0;
        this.node.addChild(node);
        this.ratePopupNode = node;
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = frame;
        sprite.sizeMode = cc.Sprite.SizeMode.TRIMMED;
        var targetScale = this.getRatePopupTargetScale(tierIndex, frame);
        var fitCap = this.getRatePopupFitCap(frame);
        var popPeak = Math.min(targetScale * 1.14, fitCap);
        var popOutScale = Math.min(targetScale * 1.22, fitCap);
        node.stopAllActions();
        node.runAction(cc.sequence(cc.spawn(cc.scaleTo(RATE_POP_IN_DURATION, popPeak).easing(cc.easeBackOut()), cc.fadeIn(RATE_POP_IN_DURATION * 0.65)), cc.scaleTo(0.06, targetScale).easing(cc.easeSineOut()), cc.delayTime(RATE_HOLD_DURATION), cc.spawn(cc.scaleTo(RATE_POP_OUT_DURATION, popOutScale).easing(cc.easeBackIn()), cc.fadeOut(RATE_POP_OUT_DURATION)), cc.callFunc(function () {
            if (_this.ratePopupNode === node) {
                _this.ratePopupNode = null;
            }
            if (node && is_valid_1.isValid(node)) {
                node.destroy();
            }
        }, this)));
    };
    GameController.prototype.playCheckSound = function () {
        var _this = this;
        if (!super_html_playable_1.default.is_audio()) {
            return;
        }
        if (this.checkClip) {
            cc.audioEngine.playEffect(this.checkClip, false);
            return;
        }
        cc.resources.load(CHECK_SOUND_PATH, cc.AudioClip, function (err, clip) {
            if (!err && clip) {
                _this.checkClip = clip;
                cc.audioEngine.playEffect(clip, false);
            }
        });
    };
    GameController.prototype.checkWin = function () {
        if (this.isAutoClearing) {
            return;
        }
        if (this.matchPairCount >= GamePreloadConfig_1.SETTLEMENT_MATCH_PAIRS) {
            this.beginVictoryWithAutoClear();
            return;
        }
        var left = this.board.getActiveCount();
        if (left === 0) {
            this.showVictory();
            return;
        }
        this.resetIdleGuideTimer();
    };
    /** 剩余牌在 AUTO_CLEAR_BEFORE_SETTLEMENT_SEC 内快速配对消除，再出结算 */
    GameController.prototype.beginVictoryWithAutoClear = function () {
        var _this = this;
        if (this.isGameOver || this.isAutoClearing) {
            return;
        }
        var pairs = HintSolver_1.collectRemainingMatchPairs(this.board.tiles);
        if (pairs.length === 0) {
            this.showVictory();
            return;
        }
        this.isAutoClearing = true;
        this.gameReady = false;
        this.unschedule(this.onIdleGuide);
        this.board.hideHintGuideHand();
        this.clearGuideHighlight();
        if (this.selected) {
            this.deselectTile(this.selected);
            this.selected = null;
        }
        var budget = GamePreloadConfig_1.AUTO_CLEAR_BEFORE_SETTLEMENT_SEC;
        var pairAnim = AUTO_CLEAR_MOVE_DURATION + AUTO_CLEAR_PAIR_FADE;
        var n = pairs.length;
        var stagger = n <= 1
            ? 0
            : Math.min(AUTO_CLEAR_STAGGER_MAX, (budget - pairAnim) / (n - 1));
        var _loop_1 = function (i) {
            var pair = pairs[i];
            this_1.scheduleOnce(function () {
                _this.removePairAuto(pair.a, pair.b);
            }, i * stagger);
        };
        var this_1 = this;
        for (var i = 0; i < n; i++) {
            _loop_1(i);
        }
        this.unschedule(this.finishAutoClearThenVictory);
        this.scheduleOnce(this.finishAutoClearThenVictory, budget);
    };
    /** 无法配对的零星剩余牌直接淡出 */
    GameController.prototype.fadeOutUnpairedRemainders = function () {
        var _loop_2 = function (i) {
            var tile = this_2.board.tiles[i];
            if (tile.removed || !tile.node || !is_valid_1.isValid(tile.node)) {
                return "continue";
            }
            tile.removed = true;
            var node = tile.node;
            node.stopAllActions();
            node.runAction(cc.sequence(cc.fadeOut(AUTO_CLEAR_PAIR_FADE), cc.callFunc(function () {
                if (node && is_valid_1.isValid(node)) {
                    node.destroy();
                }
            })));
        };
        var this_2 = this;
        for (var i = 0; i < this.board.tiles.length; i++) {
            _loop_2(i);
        }
    };
    /** 结算扫尾：短移动 + 淡出，可并行多对 */
    GameController.prototype.removePairAuto = function (a, b) {
        if (!a.node || !b.node || !is_valid_1.isValid(a.node) || !is_valid_1.isValid(b.node) || a.removed || b.removed) {
            return;
        }
        this.board.clearTileSelectForMatch(a);
        this.board.clearTileSelectForMatch(b);
        var leftTile = a.x <= b.x ? a : b;
        var rightTile = a.x <= b.x ? b : a;
        this.board.bringMatchPairToFront(leftTile, rightTile);
        a.removed = true;
        b.removed = true;
        var midX = (leftTile.x + rightTile.x) * 0.5;
        var midY = (leftTile.y + rightTile.y) * 0.5;
        this.board.playMatchEliminationEffect(midX, midY);
        this.comboNum++;
        this.addScore(this.calcMatchScoreGain(this.comboNum, null));
        this.playAutoClearTileAnim(leftTile, midX, midY, 'left');
        this.playAutoClearTileAnim(rightTile, midX, midY, 'right');
    };
    GameController.prototype.playAutoClearTileAnim = function (tile, midX, midY, side) {
        var node = tile.node;
        if (!node || !is_valid_1.isValid(node)) {
            return;
        }
        var startX = tile.x;
        var startY = tile.y;
        var targetX = side === 'left' ? midX - 8 : midX + 8;
        var baseScale = this.board.getBaseScale(tile);
        node.stopAllActions();
        node.setScale(baseScale);
        node.runAction(cc.sequence(cc.spawn(cc.moveTo(AUTO_CLEAR_MOVE_DURATION, targetX, midY).easing(cc.easeSineOut()), cc.fadeTo(AUTO_CLEAR_MOVE_DURATION, 230), cc.scaleTo(AUTO_CLEAR_MOVE_DURATION, baseScale * 1.04)), cc.spawn(cc.scaleTo(AUTO_CLEAR_PAIR_FADE, 0).easing(cc.easeBackIn()), cc.fadeOut(AUTO_CLEAR_PAIR_FADE)), cc.callFunc(function () {
            if (node && is_valid_1.isValid(node)) {
                node.destroy();
            }
        })));
    };
    GameController.prototype.hideEndPanel = function () {
        if (!this.endNode || !is_valid_1.isValid(this.endNode)) {
            return;
        }
        this.unschedule(this.bindEndDownloadButton);
        var download = this.endNode.getChildByName('download');
        if (download && is_valid_1.isValid(download)) {
            download.targetOff(this);
        }
        VictoryEndPanel_1.resetVictoryEndUnlock(this.endNode);
        this.endNode.stopAllActions();
        this.endNode.active = false;
        this.endNode.scale = 1;
        this.endNode.opacity = 255;
        if (this.scoreDisplay) {
            this.scoreDisplay.remountToGameHud(this.node, SCORE_TOP_MARGIN);
            this.scoreDisplay.setVisible(true);
        }
    };
    /** 显示 Canvas 上配置的 end 节点：分步播放 icon / victory / 星星 / TaskLight / 下载按钮 */
    GameController.prototype.showEndPanel = function () {
        var _this = this;
        if (!this.endNode || !is_valid_1.isValid(this.endNode)) {
            cc.warn('[GameController] 未找到 Canvas/end 节点');
            return;
        }
        super_html_playable_1.default.game_end();
        this.endNode.zIndex = GamePreloadConfig_1.Z_ORDER.END_PANEL;
        this.endNode.active = true;
        this.endNode.stopAllActions();
        this.endNode.scale = 1;
        this.endNode.opacity = 255;
        this.endNode.color = cc.Color.WHITE;
        VictoryEndPanel_1.layoutVictoryEndDimBackdrop(this.endNode, this.node);
        VictoryEndPanel_1.playVictoryEndSequence(this.endNode, this.scoreNum, this.scoreFont, this.scoreDisplay);
        this.bindEndDownloadButton();
        this.scheduleOnce(function () { return _this.bindEndDownloadButton(); }, 2);
    };
    /** 绑定 end/download（有 Button 用 clickEvents，否则 TOUCH_END） */
    GameController.prototype.bindEndDownloadButton = function () {
        if (!this.endNode || !is_valid_1.isValid(this.endNode)) {
            return;
        }
        var btn = this.endNode.getChildByName('download');
        if (!btn || !is_valid_1.isValid(btn)) {
            cc.warn('[GameController] end/download 节点不存在');
            return;
        }
        btn.active = true;
        btn.opacity = 255;
        btn.zIndex = GamePreloadConfig_1.Z_ORDER_END_CHILD.DOWNLOAD;
        btn.targetOff(this);
        var button = btn.getComponent(cc.Button);
        if (button) {
            button.interactable = true;
            button.clickEvents = [];
            var ev = new cc.Component.EventHandler();
            ev.target = this.node;
            ev.component = 'GameController';
            ev.handler = 'onEndDownloadClick';
            button.clickEvents.push(ev);
            return;
        }
        btn.on(cc.Node.EventType.TOUCH_END, this.onEndDownloadClick, this);
    };
    /** 结算 download（public：供 Button.clickEvents 调用） */
    GameController.prototype.onEndDownloadClick = function () {
        super_html_playable_1.default.download();
    };
    GameController.prototype.showVictory = function () {
        var _this = this;
        if (this.isGameOver) {
            return;
        }
        this.isGameOver = true;
        this.gameReady = false;
        if (this.scoreDisplay) {
            this.scoreDisplay.setVisible(false);
        }
        this.unschedule(this.onIdleGuide);
        this.board.hideHintGuideHand();
        this.clearGuideHighlight();
        if (this.selected) {
            this.deselectTile(this.selected);
            this.selected = null;
        }
        this.scheduleOnce(function () {
            if (_this.scoreDisplay) {
                _this.scoreDisplay.setValue(_this.scoreNum, false);
            }
            _this.showEndPanel();
        }, 0.2);
    };
    __decorate([
        property(cc.Prefab)
    ], GameController.prototype, "tilePrefab", void 0);
    GameController = __decorate([
        ccclass('GameController')
    ], GameController);
    return GameController;
}(cc.Component));
exports.default = GameController;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QztRQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN2QixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdkM7UUFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDM0IsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2YsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7U0FDeEI7UUFFRCxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQ2QsSUFBSSxLQUFJLENBQUMsWUFBWSxFQUFFO2dCQUNuQixLQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ3BEO1lBQ0QsS0FBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3hCLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNaLENBQUM7SUF4NEJEO1FBREMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUM7c0RBQ1M7SUFIWixjQUFjO1FBRGxDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztPQUNMLGNBQWMsQ0E0NEJsQztJQUFELHFCQUFDO0NBNTRCRCxBQTQ0QkMsQ0E1NEIyQyxFQUFFLENBQUMsU0FBUyxHQTQ0QnZEO2tCQTU0Qm9CLGNBQWMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc1ZhbGlkIH0gZnJvbSAnLi9pcy12YWxpZCc7XG5pbXBvcnQgeyBUaWxlTW9kZWwgfSBmcm9tICcuL21vZGVsL1RpbGVNb2RlbCc7XG5pbXBvcnQgeyBjYW5NYXRjaCB9IGZyb20gJy4vY29yZS9NYXRjaFJ1bGUnO1xuaW1wb3J0IHsgQm9hcmRNYW5hZ2VyIH0gZnJvbSAnLi9jb3JlL0JvYXJkTWFuYWdlcic7XG5pbXBvcnQgeyBjb2xsZWN0UmVtYWluaW5nTWF0Y2hQYWlycywgZmluZEhpbnQsIEhpbnRQYWlyIH0gZnJvbSAnLi9jb3JlL0hpbnRTb2x2ZXInO1xuaW1wb3J0IHsgQXJ0U2NvcmVEaXNwbGF5IH0gZnJvbSAnLi91aS9BcnRTY29yZURpc3BsYXknO1xuaW1wb3J0IHsgR2FtZVByZWxvYWRlciwgUHJlbG9hZFJlc3VsdCB9IGZyb20gJy4vdWkvR2FtZVByZWxvYWRlcic7XG5pbXBvcnQgeyBMb2FkaW5nU2NyZWVuIH0gZnJvbSAnLi91aS9Mb2FkaW5nU2NyZWVuJztcbmltcG9ydCB7XG4gICAgQVVUT19DTEVBUl9CRUZPUkVfU0VUVExFTUVOVF9TRUMsXG4gICAgUkFURV9SRVNfS0VZUyxcbiAgICByYXRlUmVzUGF0aCxcbiAgICBMT0FESU5HX0hJREVfQkVGT1JFX0VOVFJBTkNFLFxuICAgIExPQURJTkdfTE9HX1RJTUlORyxcbiAgICBUQVJHRVRfRlJBTUVfUkFURSxcbiAgICBTRVRUTEVNRU5UX01BVENIX1BBSVJTLFxuICAgIEdVSURFX0hBTkRfUEFUSCxcbiAgICBaX09SREVSLFxuICAgIFpfT1JERVJfRU5EX0NISUxELFxufSBmcm9tICcuL3VpL0dhbWVQcmVsb2FkQ29uZmlnJztcbmltcG9ydCB7IGxvYWRHYW1lU3ByaXRlRnJhbWUgfSBmcm9tICcuL3VpL0dhbWVJbWdBdGxhcyc7XG5pbXBvcnQgeyBsYXlvdXRTaG93QWxsQ292ZXIgfSBmcm9tICcuL3VpL1Nob3dBbGxMYXlvdXQnO1xuaW1wb3J0IHtcbiAgICBsYXlvdXRWaWN0b3J5RW5kRGltQmFja2Ryb3AsXG4gICAgcGxheVZpY3RvcnlFbmRTZXF1ZW5jZSxcbiAgICByZXNldFZpY3RvcnlFbmRVbmxvY2ssXG59IGZyb20gJy4vdWkvVmljdG9yeUVuZFBhbmVsJztcbmltcG9ydCBzdXBlcl9odG1sX3BsYXlhYmxlIGZyb20gJy4vc3VwZXJfaHRtbF9wbGF5YWJsZSc7XG5cbmNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XG5cbmNvbnN0IExFVkVMX1BBVEggPSAnZGF0YS9sZXZlbF8wMSc7XG5jb25zdCBDSEVDS19TT1VORF9QQVRIID0gJ2NoZWNrJztcbi8qKiDml6Dmk43kvZzlpJrlsJHnp5LlkI7oh6rliqjpq5jkuq7lj6/mtojnmoTkuIDlr7kgKi9cbmNvbnN0IElETEVfR1VJREVfU0VDT05EUyA9IDI7XG4vKiog5o+Q56S66LeR6ams54GvL+aZg+WKqOWbuuWumuWxleekuuaXtumVv++8iOenkuWGheeCueWHu+S4jeaPkOWJjeWFs+aOie+8iSAqL1xuY29uc3QgSElOVF9ESVNQTEFZX1NFQ09ORFMgPSAzO1xuLyoqIOeCueWHu+S4jeWPr+a2iOeJjO+8mkNhbnZhcyDkuIogaGl0IOiKgueCuemXqueDgSAqL1xuY29uc3QgSElUX0JMSU5LX1NURVAgPSAwLjE7XG5jb25zdCBISVRfQkxJTktfQ09VTlQgPSAzO1xuY29uc3QgSElUX0JMSU5LX1BFQUsgPSAyMjA7XG5jb25zdCBISVRfQkxJTktfTE9XID0gNTA7XG5cbi8qKiDmtojpmaTvvJrlhYjlpJblvLkg4oaSIOWvuem9kCBZIOS4reW/gyDihpIg5qiq5ZCR6Z2g5oui56Kw5pKeIOKGkiDmtojlpLEgKi9cbmNvbnN0IE1BVENIX09VVFdBUkRfRFVSQVRJT04gPSAwLjE0O1xuY29uc3QgTUFUQ0hfT1VUV0FSRF9ESVNUID0gNDQ7XG5jb25zdCBNQVRDSF9BTElHTl9ZX0RVUkFUSU9OID0gMC4yO1xuY29uc3QgTUFUQ0hfTU9WRV9YX0RVUkFUSU9OID0gMC4xNjtcbmNvbnN0IE1BVENIX1RPVUNIX0RVUkFUSU9OID0gMC4wODtcbi8qKiDkuKTniYzotLTovrnnm7jnorDlkI7lgZznlZnlho3mt6Hlh7ogKi9cbmNvbnN0IE1BVENIX1RPVUNIX0hPTERfRFVSQVRJT04gPSAwLjE4O1xuY29uc3QgTUFUQ0hfRkFERV9EVVJBVElPTiA9IDAuMjtcbi8qKiDotLTovrnlkI7lkJHkuK3nur/ovbvpobbkuIDkuIvvvIjlg4/ntKDvvInvvIzkuI3otorov4flr7nkvqcgKi9cbmNvbnN0IE1BVENIX1RPVUNIX05VREdFID0gNTtcblxuLyoqIOe7k+eul+WJjeWJqeS9meeJjOW/q+mAn+iHquWKqOa2iOmZpCAqL1xuY29uc3QgQVVUT19DTEVBUl9QQUlSX0ZBREUgPSAwLjE2O1xuY29uc3QgQVVUT19DTEVBUl9NT1ZFX0RVUkFUSU9OID0gMC4xMjtcbmNvbnN0IEFVVE9fQ0xFQVJfU1RBR0dFUl9NQVggPSAwLjA5O1xuXG4vKiog6L+e5raI6K+E57qn77ya5oOF57uq55Sx5byx5Yiw5by677yM5q+P5aSa5raIIFJBVEVfTUFUQ0hfU1RFUCDlr7nmiY3ljYfkuIDnuqcgKi9cbmNvbnN0IFJBVEVfTUFUQ0hfU1RFUCA9IDI7XG5jb25zdCBSQVRFX1BPUF9JTl9EVVJBVElPTiA9IDAuMjI7XG5jb25zdCBSQVRFX0hPTERfRFVSQVRJT04gPSAwLjU1O1xuY29uc3QgUkFURV9QT1BfT1VUX0RVUkFUSU9OID0gMC4yO1xuLyoqIOWQhOaho+S9jeWfuuWHhue8qeaUvu+8jOi2iuW+gOWQjuaDhee7qui2iuW8uuOAgeWtl+i2iuWkpyAqL1xuY29uc3QgUkFURV9USUVSX1NDQUxFUyA9IFswLjY4LCAwLjc2LCAwLjg0LCAwLjkyLCAxLjAyXTtcbi8qKiDor4Tnuqflm77mnIDlpKfljaDlsY/lrr3mr5TkvovvvIzpgb/lhY0gdW5iZWxpZXZhYmxlIOetiemVv+Wbvui2heWHuiAqL1xuY29uc3QgUkFURV9NQVhfV0lEVEhfUkFUSU8gPSAwLjg4O1xuXG4vKiog56ev5YiG77ya5Z+656GAICsg6L+e5Ye7ICsg6K+E57qn6Zi25q616aKd5aSW5Y+g5YqgICovXG5jb25zdCBTQ09SRV9CQVNFID0gMjAwO1xuY29uc3QgU0NPUkVfQ09NQk9fQUREID0gNDA7XG5jb25zdCBTQ09SRV9SQVRFX0JPTlVTID0gWzEwMCwgMjAwLCAzNTAsIDUwMCwgODAwXTtcbmNvbnN0IFNDT1JFX1RPUF9NQVJHSU4gPSA2NDtcblxuXG5AY2NjbGFzcygnR2FtZUNvbnRyb2xsZXInKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUNvbnRyb2xsZXIgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xuXG4gICAgQHByb3BlcnR5KGNjLlByZWZhYilcbiAgICB0aWxlUHJlZmFiOiBjYy5QcmVmYWIgPSBudWxsO1xuXG4gICAgcHJpdmF0ZSBib2FyZE5vZGU6IGNjLk5vZGUgPSBudWxsO1xuICAgIHByaXZhdGUgYm9hcmQgPSBuZXcgQm9hcmRNYW5hZ2VyKCk7XG4gICAgcHJpdmF0ZSBzZWxlY3RlZDogVGlsZU1vZGVsID0gbnVsbDtcbiAgICBwcml2YXRlIGd1aWRlSGlnaGxpZ2h0OiBIaW50UGFpciA9IG51bGw7XG4gICAgLyoqIOW9k+WJjeaPkOekuuaYr+WQpuWcqOWbuuWumuWxleekuueql+WPo+WGhe+8iDMg56eS5YaF5LiN5Zug54K55Ye75Y+W5raI77yJICovXG4gICAgcHJpdmF0ZSBoaW50RGlzcGxheUxvY2tlZCA9IGZhbHNlO1xuICAgIHByaXZhdGUgZ2FtZVJlYWR5ID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBpc1JlbW92aW5nID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBjaGVja0NsaXA6IGNjLkF1ZGlvQ2xpcCA9IG51bGw7XG4gICAgcHJpdmF0ZSBoaXROb2RlOiBjYy5Ob2RlID0gbnVsbDtcbiAgICBwcml2YXRlIGVuZE5vZGU6IGNjLk5vZGUgPSBudWxsO1xuICAgIHByaXZhdGUgY29tYm9OdW0gPSAwO1xuICAgIC8qKiDmnKzlsYDlt7LmiJDlip/mtojpmaTnmoTlr7nmlbDvvIjovr4gU0VUVExFTUVOVF9NQVRDSF9QQUlSUyDljbPnu5PnrpfvvIkgKi9cbiAgICBwcml2YXRlIG1hdGNoUGFpckNvdW50ID0gMDtcbiAgICBwcml2YXRlIHJhdGVGcmFtZXM6IGNjLlNwcml0ZUZyYW1lW10gPSBbXTtcbiAgICBwcml2YXRlIHJhdGVQb3B1cE5vZGU6IGNjLk5vZGUgPSBudWxsO1xuICAgIHByaXZhdGUgc2NvcmVOdW0gPSAwO1xuICAgIHByaXZhdGUgc2NvcmVEaXNwbGF5OiBBcnRTY29yZURpc3BsYXkgPSBudWxsO1xuICAgIHByaXZhdGUgc2NvcmVGb250OiBjYy5CaXRtYXBGb250ID0gbnVsbDtcbiAgICBwcml2YXRlIGNhY2hlZExldmVsQXNzZXQ6IGNjLkpzb25Bc3NldCA9IG51bGw7XG4gICAgcHJpdmF0ZSBsb2FkaW5nU2NyZWVuOiBMb2FkaW5nU2NyZWVuID0gbnVsbDtcbiAgICBwcml2YXRlIGlzR2FtZU92ZXIgPSBmYWxzZTtcbiAgICAvKiog6L6+57uT566X5p2h5Lu25ZCO5q2j5Zyo5b+r6YCf5omr5bC+5raI6Zmk5Ymp5L2Z54mMICovXG4gICAgcHJpdmF0ZSBpc0F1dG9DbGVhcmluZyA9IGZhbHNlO1xuXG4gICAgb25Mb2FkKCkge1xuICAgICAgICBpZiAoVEFSR0VUX0ZSQU1FX1JBVEUgPiAwKSB7XG4gICAgICAgICAgICBjYy5nYW1lLnNldEZyYW1lUmF0ZShUQVJHRVRfRlJBTUVfUkFURSk7XG4gICAgICAgIH1cbiAgICAgICAgY2Mudmlldy5zZXRSZXNpemVDYWxsYmFjaygoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxheW91dEJhY2tncm91bmQoKTtcbiAgICAgICAgICAgIHRoaXMubGF5b3V0SGl0KCk7XG4gICAgICAgICAgICB0aGlzLmxheW91dFNjb3JlVG9wKCk7XG4gICAgICAgICAgICB0aGlzLmxheW91dEVuZERpbUJhY2tkcm9wKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5sb2FkaW5nU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nU2NyZWVuLmxheW91dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbiAgICBvbkRlc3Ryb3koKSB7XG4gICAgICAgIGNjLnZpZXcuc2V0UmVzaXplQ2FsbGJhY2sobnVsbCwgbnVsbCk7XG4gICAgICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLm9uSWRsZUd1aWRlKTtcbiAgICB9XG5cbiAgICBzdGFydCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRpbGVQcmVmYWIpIHtcbiAgICAgICAgICAgIGNjLmVycm9yKCdbR2FtZUNvbnRyb2xsZXJdIOivt+WcqCBDYW52YXMg5LiK57uR5a6aIG1qIOmihOWItuS9kycpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYm9hcmROb2RlID0gbmV3IGNjLk5vZGUoJ0JvYXJkJyk7XG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZCh0aGlzLmJvYXJkTm9kZSk7XG4gICAgICAgIHRoaXMuaGl0Tm9kZSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZSgnaGl0Jyk7XG4gICAgICAgIGlmICh0aGlzLmhpdE5vZGUgJiYgaXNWYWxpZCh0aGlzLmhpdE5vZGUpKSB7XG4gICAgICAgICAgICB0aGlzLmhpdE5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmhpdE5vZGUub3BhY2l0eSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbmROb2RlID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdlbmQnKTtcbiAgICAgICAgdGhpcy5oaWRlRW5kUGFuZWwoKTtcbiAgICAgICAgdGhpcy5sYXlvdXRCYWNrZ3JvdW5kKCk7XG4gICAgICAgIHRoaXMubGF5b3V0SGl0KCk7XG4gICAgICAgIHRoaXMubGF5b3V0U2NvcmVUb3AoKTtcbiAgICAgICAgdGhpcy5ib2FyZE5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3RhcnRXaXRoTG9hZGluZygpO1xuXG4gICAgICAgIGNvbnN0IGdvb2dsZV9wbGF5ID0gXCJodHRwczovL2FwcHMuYXBwbGUuY29tL3VzL2FwcC9tYWhqb25nLXJveWFsLXRpbGVzL2lkNjc0NzQ5MjYwMFwiO1xuICAgICAgICBjb25zdCBhcHBzdG9yZSA9IFwiaHR0cHM6Ly9wbGF5Lmdvb2dsZS5jb20vc3RvcmUvYXBwcy9kZXRhaWxzP2lkPWNvbS5uZWJ1bGEubWFoam9uZ3RpbGVcIjtcblxuICAgICAgICBzdXBlcl9odG1sX3BsYXlhYmxlLnNldF9nb29nbGVfcGxheV91cmwoZ29vZ2xlX3BsYXkpO1xuICAgICAgICBzdXBlcl9odG1sX3BsYXlhYmxlLnNldF9hcHBfc3RvcmVfdXJsKGFwcHN0b3JlKTtcbiAgICB9XG5cbiAgICAvKiog5pi+56S65Yqg6L2955WM6Z2i77yM6aKE5Yqg6L296LWE5rqQ5ZCO6L+b5YWl5YWz5Y2hICovXG4gICAgcHJpdmF0ZSBzdGFydFdpdGhMb2FkaW5nKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBsb2FkVDAgPSBMT0FESU5HX0xPR19USU1JTkcgPyBEYXRlLm5vdygpIDogMDtcbiAgICAgICAgdGhpcy5sb2FkaW5nU2NyZWVuID0gbmV3IExvYWRpbmdTY3JlZW4odGhpcy5ub2RlKTtcbiAgICAgICAgdGhpcy5sb2FkaW5nU2NyZWVuLnNob3codGhpcy5ub2RlKTtcblxuICAgICAgICBHYW1lUHJlbG9hZGVyLnJ1bigoKSA9PiB7fSwgKHJlc3VsdCwgZXJyKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyIHx8ICFyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sb2FkaW5nU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZ1NjcmVlbi5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNjLndhcm4oJ1tHYW1lQ29udHJvbGxlcl0nLCBlcnIgfHwgJ+WKoOi9veWksei0pScpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2FjaGVkTGV2ZWxBc3NldCA9IHJlc3VsdC5sZXZlbEFzc2V0O1xuICAgICAgICAgICAgdGhpcy5hcHBseVByZWxvYWRSZXN1bHQocmVzdWx0KTtcbiAgICAgICAgICAgIEdhbWVQcmVsb2FkZXIucHJlbG9hZEdhbWVwbGF5QXNzZXRzKCgpID0+IHRoaXMucmVmcmVzaExhenlBc3NldHMoKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGxldmVsVDAgPSBMT0FESU5HX0xPR19USU1JTkcgPyBEYXRlLm5vdygpIDogMDtcbiAgICAgICAgICAgIHRoaXMubG9hZExldmVsKHJlc3VsdC5sZXZlbEFzc2V0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZE5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sb2FkaW5nU2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZ1NjcmVlbi5oaWRlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChMT0FESU5HX0xPR19USU1JTkcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy5sb2coXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBbR2FtZUNvbnRyb2xsZXJdIOiHs+WFs+WKoOi9veWxj+WFs+mXrSAke0RhdGUubm93KCkgLSBsb2FkVDB9bXNgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYO+8iOW7uuWFsyAke0RhdGUubm93KCkgLSBsZXZlbFQwfW1z77yJYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFwcGx5UHJlbG9hZFJlc3VsdChyZXN1bHQ6IFByZWxvYWRSZXN1bHQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHJlc3VsdC5jaGVja0NsaXApIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tDbGlwID0gcmVzdWx0LmNoZWNrQ2xpcDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0LnNjb3JlRm9udCkge1xuICAgICAgICAgICAgdGhpcy5zY29yZUZvbnQgPSByZXN1bHQuc2NvcmVGb250O1xuICAgICAgICAgICAgdGhpcy5zY29yZURpc3BsYXkgPSBBcnRTY29yZURpc3BsYXkuZnJvbUZvbnQocmVzdWx0LnNjb3JlRm9udCk7XG4gICAgICAgICAgICB0aGlzLnNjb3JlRGlzcGxheS5tb3VudCh0aGlzLm5vZGUsIFNDT1JFX1RPUF9NQVJHSU4pO1xuICAgICAgICAgICAgdGhpcy5zY29yZURpc3BsYXkuc2V0VmFsdWUoMCwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQuZ3VpZGVIYW5kU2YpIHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuc2V0R3VpZGVIYW5kU3ByaXRlKHJlc3VsdC5ndWlkZUhhbmRTZik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiog5ZCO5Y+w6LWE5rqQ6L+b57yT5a2Y5ZCO5Yi35paw5byV55SoICovXG4gICAgcHJpdmF0ZSByZWZyZXNoTGF6eUFzc2V0cygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZnJhbWVzOiBjYy5TcHJpdGVGcmFtZVtdID0gbmV3IEFycmF5KFJBVEVfUkVTX0tFWVMubGVuZ3RoKTtcbiAgICAgICAgbGV0IHBlbmRpbmcgPSBSQVRFX1JFU19LRVlTLmxlbmd0aDtcbiAgICAgICAgUkFURV9SRVNfS0VZUy5mb3JFYWNoKChrZXksIGlkeCkgPT4ge1xuICAgICAgICAgICAgbG9hZEdhbWVTcHJpdGVGcmFtZShyYXRlUmVzUGF0aChrZXkpLCAoZnJhbWUpID0+IHtcbiAgICAgICAgICAgICAgICBwZW5kaW5nLS07XG4gICAgICAgICAgICAgICAgaWYgKGZyYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyYW1lc1tpZHhdID0gZnJhbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwZW5kaW5nID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmF0ZUZyYW1lcyA9IGZyYW1lcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGxvYWRHYW1lU3ByaXRlRnJhbWUoR1VJREVfSEFORF9QQVRILCAoc2YpID0+IHtcbiAgICAgICAgICAgIGlmIChzZikge1xuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQuc2V0R3VpZGVIYW5kU3ByaXRlKHNmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqIOacrOWxgOaYr+WQpuW3suWboOeCueWHu+aUtui1t+W8leWvvOWwj+aJiyAqL1xuICAgIHByaXZhdGUgZ3VpZGVIYW5kRGlzbWlzc2VkVGhpc0xldmVsID0gZmFsc2U7XG5cbiAgICAvKiog5byV5a+85bCP5omL77ya5oyH5ZCR5o+Q56S65a+55a2Q5Lit6Z2g5bem55qE5LiA5bygICovXG4gICAgcHJpdmF0ZSB0cnlTaG93Rmlyc3RHdWlkZUhhbmQoaGludDogSGludFBhaXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZ3VpZGVIYW5kRGlzbWlzc2VkVGhpc0xldmVsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ib2FyZC5zaG93SGludEd1aWRlSGFuZCh0aGlzLnBpY2tMZWZ0R3VpZGVIYW5kVGlsZShoaW50KSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwaWNrTGVmdEd1aWRlSGFuZFRpbGUoaGludDogSGludFBhaXIpOiBUaWxlTW9kZWwge1xuICAgICAgICBpZiAoaGludC5hLnggIT09IGhpbnQuYi54KSB7XG4gICAgICAgICAgICByZXR1cm4gaGludC5hLnggPCBoaW50LmIueCA/IGhpbnQuYSA6IGhpbnQuYjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGludC5hLnkgPD0gaGludC5iLnkgPyBoaW50LmEgOiBoaW50LmI7XG4gICAgfVxuXG4gICAgLyoqIOmhtumDqOWxheS4re+8mldpZGdldCDlr7npvZDvvIjkvY3lm77lrZfkvZMgTGFiZWzvvIkgKi9cbiAgICBwcml2YXRlIGxheW91dFNjb3JlVG9wKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuc2NvcmVEaXNwbGF5IHx8ICFpc1ZhbGlkKHRoaXMuc2NvcmVEaXNwbGF5LnJvb3QpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zY29yZURpc3BsYXkuc2V0VG9wTWFyZ2luKFNDT1JFX1RPUF9NQVJHSU4pO1xuICAgIH1cblxuICAgIC8qKiBTSE9XX0FMTCDkuIvog4zmma8gY292ZXIg6ZO65ruh5Y+v6KeG5Yy65Z+f77yI5LiN5ZCr5bGP5aSW6buR6L6577yJICovXG4gICAgcHJpdmF0ZSBsYXlvdXRCYWNrZ3JvdW5kKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBiZyA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZSgnYmcnKTtcbiAgICAgICAgaWYgKCFiZyB8fCAhaXNWYWxpZChiZykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsYXlvdXRTaG93QWxsQ292ZXIoYmcsIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubGF5b3V0RW5kRGltQmFja2Ryb3AoKTtcbiAgICB9XG5cbiAgICAvKiog57uT566XIGVuZCDpu5HlupXkuI4gYmcg5ZCM5q2l57yp5pS+ICovXG4gICAgcHJpdmF0ZSBsYXlvdXRFbmREaW1CYWNrZHJvcCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmVuZE5vZGUgfHwgIWlzVmFsaWQodGhpcy5lbmROb2RlKSB8fCAhdGhpcy5lbmROb2RlLmFjdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxheW91dFZpY3RvcnlFbmREaW1CYWNrZHJvcCh0aGlzLmVuZE5vZGUsIHRoaXMubm9kZSk7XG4gICAgfVxuXG4gICAgLyoqIOS4jiBiZyDnm7jlkIzvvJpoaXQg5oyJIFNIT1dfQUxMIOmTuua7oeWPr+inhuWMuuWfnyAqL1xuICAgIHByaXZhdGUgbGF5b3V0SGl0KCk6IHZvaWQge1xuICAgICAgICBjb25zdCBoaXQgPSB0aGlzLmhpdE5vZGU7XG4gICAgICAgIGlmICghaGl0IHx8ICFpc1ZhbGlkKGhpdCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxheW91dFNob3dBbGxDb3ZlcihoaXQsIHRoaXMubm9kZSk7XG4gICAgICAgIGhpdC5zZXRQb3NpdGlvbigwLCAwKTtcbiAgICB9XG5cbiAgICAvKiog5YWo5bGPIGhpdCDpga7nvanpl6rng4HvvIjngrnlh7vkuI3lj6/mtojniYzvvIkgKi9cbiAgICBwcml2YXRlIHBsYXlIaXRCbGluaygpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmhpdE5vZGUgfHwgIWlzVmFsaWQodGhpcy5oaXROb2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGhpdCA9IHRoaXMuaGl0Tm9kZTtcbiAgICAgICAgdGhpcy5sYXlvdXRIaXQoKTtcbiAgICAgICAgaGl0LnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIGhpdC56SW5kZXggPSBaX09SREVSLkhJVDtcbiAgICAgICAgaGl0LmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIGhpdC5vcGFjaXR5ID0gMDtcblxuICAgICAgICBjb25zdCBzdGVwczogY2MuRmluaXRlVGltZUFjdGlvbltdID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgSElUX0JMSU5LX0NPVU5UOyBpKyspIHtcbiAgICAgICAgICAgIHN0ZXBzLnB1c2goY2MuZmFkZVRvKEhJVF9CTElOS19TVEVQLCBISVRfQkxJTktfUEVBSykpO1xuICAgICAgICAgICAgc3RlcHMucHVzaChjYy5mYWRlVG8oSElUX0JMSU5LX1NURVAsIEhJVF9CTElOS19MT1cpKTtcbiAgICAgICAgfVxuICAgICAgICBzdGVwcy5wdXNoKGNjLmZhZGVUbyhISVRfQkxJTktfU1RFUCwgMCkpO1xuICAgICAgICBzdGVwcy5wdXNoKGNjLmNhbGxGdW5jKCgpID0+IHtcbiAgICAgICAgICAgIGlmIChoaXQgJiYgaXNWYWxpZChoaXQpKSB7XG4gICAgICAgICAgICAgICAgaGl0LmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGhpdC5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcykpO1xuICAgICAgICBoaXQucnVuQWN0aW9uKGNjLnNlcXVlbmNlKHN0ZXBzKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkTGV2ZWwoY2FjaGVkTGV2ZWw/OiBjYy5Kc29uQXNzZXQsIG9uUmVhZHk/OiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuZ2FtZVJlYWR5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNHYW1lT3ZlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzQXV0b0NsZWFyaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLmZpbmlzaEF1dG9DbGVhclRoZW5WaWN0b3J5KTtcbiAgICAgICAgdGhpcy5oaWRlRW5kUGFuZWwoKTtcbiAgICAgICAgdGhpcy5jb21ib051bSA9IDA7XG4gICAgICAgIHRoaXMubWF0Y2hQYWlyQ291bnQgPSAwO1xuICAgICAgICB0aGlzLnNjb3JlTnVtID0gMDtcbiAgICAgICAgaWYgKHRoaXMuc2NvcmVEaXNwbGF5KSB7XG4gICAgICAgICAgICB0aGlzLnNjb3JlRGlzcGxheS5zZXRWYWx1ZSgwLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ib2FyZC5oaWRlSGludEd1aWRlSGFuZCgpO1xuICAgICAgICB0aGlzLmd1aWRlSGFuZERpc21pc3NlZFRoaXNMZXZlbCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsZWFyR3VpZGVIaWdobGlnaHQoKTtcbiAgICAgICAgdGhpcy51bnNjaGVkdWxlKHRoaXMub25JZGxlR3VpZGUpO1xuICAgICAgICB0aGlzLmJvYXJkLmxvYWRMZXZlbChMRVZFTF9QQVRILCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybignW0dhbWVDb250cm9sbGVyXScsIGVycik7XG4gICAgICAgICAgICAgICAgaWYgKG9uUmVhZHkpIHtcbiAgICAgICAgICAgICAgICAgICAgb25SZWFkeSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmJvYXJkLnNwYXduKFxuICAgICAgICAgICAgICAgIHRoaXMudGlsZVByZWZhYixcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkTm9kZSxcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQuYmluZEJvYXJkQ2xpY2sodGhpcy5ub2RlLCAodGlsZSkgPT4gdGhpcy5vblRpbGVUYXAodGlsZSkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVSZWFkeSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXRJZGxlR3VpZGVUaW1lcigpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTE9BRElOR19ISURFX0JFRk9SRV9FTlRSQU5DRSAmJiBvblJlYWR5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvblJlYWR5KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93R3VpZGVIaWdobGlnaHQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFMT0FESU5HX0hJREVfQkVGT1JFX0VOVFJBTkNFICYmIG9uUmVhZHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uUmVhZHkoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0sIGNhY2hlZExldmVsKTtcbiAgICB9XG5cbiAgICAvKiog5b2T5YmN5piv5ZCm5q2j5Zyo5bGV56S65o+Q56S677yI6LeR6ams54GvL+aZg+WKqOeql+WPo+WGheS4jeWGjemHjeWkjeinpuWPke+8iSAqL1xuICAgIHByaXZhdGUgaXNHdWlkZUhpbnRBY3RpdmUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpbnREaXNwbGF5TG9ja2VkICYmIHRoaXMuZ3VpZGVIaWdobGlnaHQgIT0gbnVsbDtcbiAgICB9XG5cbiAgICAvKiog6auY5Lqu5LiA5a+55Y+v5raI6Zmk55qE54mM77yI5YWl5Zy65a6M5oiQIC8g6ZW/5pe26Ze05peg5pON5L2c77yJ77ya5aSW57yY6LeR6ams54Gv77yM5Zu65a6a5bGV56S6IDMg56eSICovXG4gICAgcHJpdmF0ZSBzaG93R3VpZGVIaWdobGlnaHQoKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5nYW1lUmVhZHkgfHwgdGhpcy5pc1JlbW92aW5nIHx8IHRoaXMuYm9hcmQuZW50cmFuY2VQbGF5aW5nKSByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLmlzR3VpZGVIaW50QWN0aXZlKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBoaW50ID0gZmluZEhpbnQodGhpcy5ib2FyZC50aWxlcyk7XG4gICAgICAgIGlmICghaGludCkge1xuICAgICAgICAgICAgdGhpcy5jbGVhckd1aWRlSGlnaGxpZ2h0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbGVhckd1aWRlSGlnaGxpZ2h0KCk7XG4gICAgICAgIHRoaXMuZ3VpZGVIaWdobGlnaHQgPSBoaW50O1xuICAgICAgICB0aGlzLmd1aWRlSGFuZERpc21pc3NlZFRoaXNMZXZlbCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmhpbnREaXNwbGF5TG9ja2VkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51bnNjaGVkdWxlKHRoaXMub25IaW50RGlzcGxheUVuZCk7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKHRoaXMub25IaW50RGlzcGxheUVuZCwgSElOVF9ESVNQTEFZX1NFQ09ORFMpO1xuICAgICAgICB0aGlzLmJvYXJkLnNob3dHdWlkZUhpbnRQYWlyKGhpbnQuYSwgaGludC5iKTtcbiAgICAgICAgdGhpcy51bnNjaGVkdWxlKHRoaXMuc2hvd0ZpcnN0R3VpZGVIYW5kRGVmZXJyZWQpO1xuICAgICAgICB0aGlzLnNjaGVkdWxlT25jZSh0aGlzLnNob3dGaXJzdEd1aWRlSGFuZERlZmVycmVkLCAwLjEyKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uSGludERpc3BsYXlFbmQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICghdGhpcy5pc0d1aWRlSGludEFjdGl2ZSgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oaW50RGlzcGxheUxvY2tlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsZWFyR3VpZGVIaWdobGlnaHQoKTtcbiAgICAgICAgdGhpcy5yZXNldElkbGVHdWlkZVRpbWVyKCk7XG4gICAgfTtcblxuICAgIHByaXZhdGUgc2hvd0ZpcnN0R3VpZGVIYW5kRGVmZXJyZWQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICghdGhpcy5ndWlkZUhpZ2hsaWdodCB8fCB0aGlzLmd1aWRlSGFuZERpc21pc3NlZFRoaXNMZXZlbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudHJ5U2hvd0ZpcnN0R3VpZGVIYW5kKHRoaXMuZ3VpZGVIaWdobGlnaHQpO1xuICAgIH07XG5cbiAgICBwcml2YXRlIGNsZWFyR3VpZGVIaWdobGlnaHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLm9uSGludERpc3BsYXlFbmQpO1xuICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5zaG93Rmlyc3RHdWlkZUhhbmREZWZlcnJlZCk7XG4gICAgICAgIHRoaXMuaGludERpc3BsYXlMb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ib2FyZC5oaWRlSGludEd1aWRlSGFuZCgpO1xuICAgICAgICB0aGlzLmJvYXJkLmNsZWFyQWxsR3VpZGVNYXJxdWVlcygpO1xuICAgICAgICB0aGlzLmd1aWRlSGlnaGxpZ2h0ID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKiog54K55Ye76YCJ5Lit54mM5pe277ya5Y+W5raI5YWo6YOo6LeR6ams54GvIC8g5pmD5YqoIC8g5bCP5omL5o+Q56S6ICovXG4gICAgcHJpdmF0ZSBjYW5jZWxIaW50c09uU2VsZWN0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmd1aWRlSGFuZERpc21pc3NlZFRoaXNMZXZlbCA9IHRydWU7XG4gICAgICAgIHRoaXMuY2xlYXJHdWlkZUhpZ2hsaWdodCgpO1xuICAgICAgICB0aGlzLnJlc2V0SWRsZUd1aWRlVGltZXIoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc2V0SWRsZUd1aWRlVGltZXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLm9uSWRsZUd1aWRlKTtcbiAgICAgICAgaWYgKCF0aGlzLmdhbWVSZWFkeSB8fCB0aGlzLmlzUmVtb3ZpbmcgfHwgdGhpcy5ib2FyZC5lbnRyYW5jZVBsYXlpbmcpIHJldHVybjtcbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UodGhpcy5vbklkbGVHdWlkZSwgSURMRV9HVUlERV9TRUNPTkRTKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uSWRsZUd1aWRlKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuZ2FtZVJlYWR5IHx8IHRoaXMuaXNBdXRvQ2xlYXJpbmcgfHwgdGhpcy5zZWxlY3RlZCB8fCB0aGlzLmlzUmVtb3ZpbmcgfHwgdGhpcy5ib2FyZC5lbnRyYW5jZVBsYXlpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pc0d1aWRlSGludEFjdGl2ZSgpKSB7XG4gICAgICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5vbklkbGVHdWlkZSk7XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZSh0aGlzLm9uSWRsZUd1aWRlLCBJRExFX0dVSURFX1NFQ09ORFMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2hvd0d1aWRlSGlnaGxpZ2h0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvblRpbGVUYXAodGlsZTogVGlsZU1vZGVsKSB7XG4gICAgICAgIGlmICh0aGlzLmlzR2FtZU92ZXIgfHwgdGhpcy5pc0F1dG9DbGVhcmluZyB8fCB0aWxlLnJlbW92ZWQgfHwgdGhpcy5pc1JlbW92aW5nIHx8IHRoaXMuYm9hcmQuZW50cmFuY2VQbGF5aW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aWxlLmZyZWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkICYmIHRoaXMuc2VsZWN0ZWQuaWQgIT09IHRpbGUuaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2VsZWN0VGlsZSh0aGlzLnNlbGVjdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY29tYm9OdW0gPSAwO1xuICAgICAgICAgICAgdGhpcy5ib2FyZC5wbGF5QmxvY2tlZEZlZWRiYWNrKHRpbGUpO1xuICAgICAgICAgICAgdGhpcy5wbGF5SGl0QmxpbmsoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5zZWxlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5jYW5jZWxIaW50c09uU2VsZWN0KCk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdFRpbGUodGlsZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZC5pZCA9PT0gdGlsZS5pZCkge1xuICAgICAgICAgICAgdGhpcy5kZXNlbGVjdFRpbGUodGhpcy5zZWxlY3RlZCk7XG4gICAgICAgICAgICB0aGlzLnJlc2V0SWRsZUd1aWRlVGltZXIoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5zZWxlY3RlZC5mcmVlKSB7XG4gICAgICAgICAgICB0aGlzLmNhbmNlbEhpbnRzT25TZWxlY3QoKTtcbiAgICAgICAgICAgIHRoaXMuZGVzZWxlY3RUaWxlKHRoaXMuc2VsZWN0ZWQpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RUaWxlKHRpbGUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNhbk1hdGNoKHRoaXMuc2VsZWN0ZWQsIHRpbGUpKSB7XG4gICAgICAgICAgICBjb25zdCBmaXJzdCA9IHRoaXMuc2VsZWN0ZWQ7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlUGFpcihmaXJzdCwgdGlsZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbmNlbEhpbnRzT25TZWxlY3QoKTtcbiAgICAgICAgdGhpcy5zd2l0Y2hTZWxlY3Rpb24odGlsZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzd2l0Y2hTZWxlY3Rpb24odGlsZTogVGlsZU1vZGVsKSB7XG4gICAgICAgIGNvbnN0IHByZXYgPSB0aGlzLnNlbGVjdGVkO1xuICAgICAgICBpZiAocHJldiAmJiBwcmV2LmlkICE9PSB0aWxlLmlkKSB7XG4gICAgICAgICAgICB0aGlzLmRlc2VsZWN0VGlsZShwcmV2KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNlbGVjdFRpbGUodGlsZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZWxlY3RUaWxlKHRpbGU6IFRpbGVNb2RlbCkge1xuICAgICAgICBpZiAoIXRpbGUubm9kZSB8fCAhaXNWYWxpZCh0aWxlLm5vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQgJiYgdGhpcy5zZWxlY3RlZC5pZCAhPT0gdGlsZS5pZCkge1xuICAgICAgICAgICAgdGhpcy5kZXNlbGVjdFRpbGUodGhpcy5zZWxlY3RlZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHRpbGU7XG4gICAgICAgIHRoaXMuYm9hcmQuYnJpbmdUaWxlc1RvRnJvbnQoW3RpbGVdKTtcbiAgICAgICAgdGhpcy5ib2FyZC5oaWdobGlnaHRUaWxlU2VsZWN0KHRpbGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGVzZWxlY3RUaWxlKHRpbGU6IFRpbGVNb2RlbCwgcmVzdG9yZVo6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkICYmIHRoaXMuc2VsZWN0ZWQuaWQgPT09IHRpbGUuaWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGlsZS5yZW1vdmVkICYmIHRpbGUubm9kZSAmJiBpc1ZhbGlkKHRpbGUubm9kZSkpIHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucmVzdG9yZVRpbGVTZWxlY3QodGlsZSk7XG4gICAgICAgICAgICBpZiAocmVzdG9yZVopIHRoaXMuYm9hcmQucmVzdG9yZVRpbGVaSW5kZXgodGlsZSk7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLmFwcGx5VmlzdWFsKHRpbGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzZXRJZGxlR3VpZGVUaW1lcigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVtb3ZlUGFpcihhOiBUaWxlTW9kZWwsIGI6IFRpbGVNb2RlbCkge1xuICAgICAgICBpZiAoIWEubm9kZSB8fCAhYi5ub2RlIHx8ICFpc1ZhbGlkKGEubm9kZSkgfHwgIWlzVmFsaWQoYi5ub2RlKSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLm9uSWRsZUd1aWRlKTtcbiAgICAgICAgdGhpcy5jbGVhckd1aWRlSGlnaGxpZ2h0KCk7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBudWxsO1xuICAgICAgICB0aGlzLmJvYXJkLmNsZWFyVGlsZVNlbGVjdEZvck1hdGNoKGEpO1xuICAgICAgICB0aGlzLmJvYXJkLmNsZWFyVGlsZVNlbGVjdEZvck1hdGNoKGIpO1xuICAgICAgICBjb25zdCBsZWZ0VGlsZSA9IGEueCA8PSBiLnggPyBhIDogYjtcbiAgICAgICAgY29uc3QgcmlnaHRUaWxlID0gYS54IDw9IGIueCA/IGIgOiBhO1xuICAgICAgICB0aGlzLmJvYXJkLmJyaW5nTWF0Y2hQYWlyVG9Gcm9udChsZWZ0VGlsZSwgcmlnaHRUaWxlKTtcbiAgICAgICAgYS5yZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgYi5yZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pc1JlbW92aW5nID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCBtaWRZID0gKGEueSArIGIueSkgKiAwLjU7XG4gICAgICAgIGNvbnN0IG1pZFggPSAoYS54ICsgYi54KSAqIDAuNTtcbiAgICAgICAgY29uc3QgcGFpckRpc3QgPSBNYXRoLmFicyhsZWZ0VGlsZS54IC0gcmlnaHRUaWxlLngpO1xuICAgICAgICBjb25zdCBtZWV0R2FwID0gTWF0aC5tYXgoXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmdldE1hdGNoTWVldENlbnRlckdhcChsZWZ0VGlsZSwgdHJ1ZSksXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmdldE1hdGNoTWVldENlbnRlckdhcChyaWdodFRpbGUsIHRydWUpXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGhhbGZHYXAgPSBtZWV0R2FwICogMC41O1xuICAgICAgICBjb25zdCBsZWZ0U3RvcFggPSBtaWRYIC0gaGFsZkdhcDtcbiAgICAgICAgY29uc3QgcmlnaHRTdG9wWCA9IG1pZFggKyBoYWxmR2FwO1xuICAgICAgICBjb25zdCBvdXR3YXJkRGlzdCA9IE1hdGgubWF4KE1BVENIX09VVFdBUkRfRElTVCwgcGFpckRpc3QgKiAwLjIgKyAyOCk7XG5cbiAgICAgICAgdGhpcy5wbGF5TWF0Y2hDb2xsaWRlQW5pbShsZWZ0VGlsZSwgbWlkWCwgbWlkWSwgJ2xlZnQnLCBsZWZ0U3RvcFgsIG91dHdhcmREaXN0KTtcbiAgICAgICAgdGhpcy5wbGF5TWF0Y2hDb2xsaWRlQW5pbShyaWdodFRpbGUsIG1pZFgsIG1pZFksICdyaWdodCcsIHJpZ2h0U3RvcFgsIG91dHdhcmREaXN0KTtcblxuICAgICAgICBjb25zdCBtZWV0TW9tZW50ID1cbiAgICAgICAgICAgIE1BVENIX09VVFdBUkRfRFVSQVRJT04gKyBNQVRDSF9BTElHTl9ZX0RVUkFUSU9OICsgTUFUQ0hfTU9WRV9YX0RVUkFUSU9OICsgTUFUQ0hfVE9VQ0hfRFVSQVRJT047XG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuYnJpbmdNYXRjaFBhaXJUb0Zyb250KGxlZnRUaWxlLCByaWdodFRpbGUpO1xuICAgICAgICAgICAgdGhpcy5ib2FyZC5wbGF5TWF0Y2hFbGltaW5hdGlvbkVmZmVjdChtaWRYLCBtaWRZKTtcbiAgICAgICAgfSwgbWVldE1vbWVudCk7XG5cbiAgICAgICAgY29uc3QgYnVtcERlbGF5ID1cbiAgICAgICAgICAgIE1BVENIX09VVFdBUkRfRFVSQVRJT04gK1xuICAgICAgICAgICAgTUFUQ0hfQUxJR05fWV9EVVJBVElPTiArXG4gICAgICAgICAgICBNQVRDSF9NT1ZFX1hfRFVSQVRJT04gK1xuICAgICAgICAgICAgTUFUQ0hfVE9VQ0hfRFVSQVRJT04gK1xuICAgICAgICAgICAgTUFUQ0hfVE9VQ0hfSE9MRF9EVVJBVElPTjtcbiAgICAgICAgdGhpcy5jb21ib051bSsrO1xuICAgICAgICB0aGlzLm1hdGNoUGFpckNvdW50Kys7XG4gICAgICAgIGNvbnN0IHJhdGVUaWVyID0gdGhpcy5nZXRSYXRlVGllckluZGV4KHRoaXMuY29tYm9OdW0pO1xuICAgICAgICBjb25zdCBzY29yZUdhaW4gPSB0aGlzLmNhbGNNYXRjaFNjb3JlR2Fpbih0aGlzLmNvbWJvTnVtLCByYXRlVGllcik7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGxheUNoZWNrU291bmQoKTtcbiAgICAgICAgICAgIGlmIChyYXRlVGllciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGxheVJhdGVQb3B1cChyYXRlVGllcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFkZFNjb3JlKHNjb3JlR2Fpbik7XG4gICAgICAgIH0sIGJ1bXBEZWxheSk7XG5cbiAgICAgICAgY29uc3QgdG90YWwgPVxuICAgICAgICAgICAgTUFUQ0hfT1VUV0FSRF9EVVJBVElPTiArXG4gICAgICAgICAgICBNQVRDSF9BTElHTl9ZX0RVUkFUSU9OICtcbiAgICAgICAgICAgIE1BVENIX01PVkVfWF9EVVJBVElPTiArXG4gICAgICAgICAgICBNQVRDSF9UT1VDSF9EVVJBVElPTiArXG4gICAgICAgICAgICBNQVRDSF9UT1VDSF9IT0xEX0RVUkFUSU9OICtcbiAgICAgICAgICAgIE1BVENIX0ZBREVfRFVSQVRJT047XG5cbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pc1JlbW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLnJlZnJlc2hWaXN1YWxzKCk7XG4gICAgICAgICAgICB0aGlzLmNoZWNrV2luKCk7XG4gICAgICAgIH0sIHRvdGFsICsgMC4wNSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogMS4g5rK/5bem5Y+z5YWI5b6A5aSW5by55byA77yI5L+d5oyB5b2T5YmNIFnvvIlcbiAgICAgKiAyLiDnp7vliLDkuKTniYwgWSDkuK3lv4Ppq5jluqZcbiAgICAgKiAzLiDmqKrlkJHpnaDmi6LliLDkuK3nur/kuKTkvqfvvIjkuK3lv4Pot50gPSDniYzlrr3vvIzotLTovrnkuI3lj6DvvIlcbiAgICAgKiA0LiDovbvpobbnm7jnorAg4oaSIOWBnOeVmeeJh+WIuyDihpIg5reh5Ye66ZSA5q+BXG4gICAgICovXG4gICAgcHJpdmF0ZSBwbGF5TWF0Y2hDb2xsaWRlQW5pbShcbiAgICAgICAgdGlsZTogVGlsZU1vZGVsLFxuICAgICAgICBtaWRYOiBudW1iZXIsXG4gICAgICAgIG1pZFk6IG51bWJlcixcbiAgICAgICAgc2lkZTogJ2xlZnQnIHwgJ3JpZ2h0JyxcbiAgICAgICAgc3RvcFg6IG51bWJlcixcbiAgICAgICAgb3V0d2FyZERpc3Q6IG51bWJlclxuICAgICk6IHZvaWQge1xuICAgICAgICBjb25zdCBub2RlID0gdGlsZS5ub2RlO1xuICAgICAgICB0aGlzLmJvYXJkLmNsZWFyVGlsZVNlbGVjdEZvck1hdGNoKHRpbGUpO1xuICAgICAgICBjb25zdCBzdGFydFggPSB0aWxlLng7XG4gICAgICAgIGNvbnN0IHN0YXJ0WSA9IHRpbGUueTtcbiAgICAgICAgbm9kZS5zZXRQb3NpdGlvbihzdGFydFgsIHN0YXJ0WSk7XG4gICAgICAgIGNvbnN0IG91dFggPSBzaWRlID09PSAnbGVmdCcgPyBzdGFydFggLSBvdXR3YXJkRGlzdCA6IHN0YXJ0WCArIG91dHdhcmREaXN0O1xuICAgICAgICBjb25zdCBiYXNlU2NhbGUgPSB0aGlzLmJvYXJkLmdldEJhc2VTY2FsZSh0aWxlKTtcbiAgICAgICAgY29uc3QgdG91Y2hYID0gc2lkZSA9PT0gJ2xlZnQnXG4gICAgICAgICAgICA/IE1hdGgubWluKHN0b3BYICsgTUFUQ0hfVE9VQ0hfTlVER0UsIG1pZFggLSAxKVxuICAgICAgICAgICAgOiBNYXRoLm1heChzdG9wWCAtIE1BVENIX1RPVUNIX05VREdFLCBtaWRYICsgMSk7XG5cbiAgICAgICAgbm9kZS5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICBub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShcbiAgICAgICAgICAgIGNjLm1vdmVUbyhNQVRDSF9PVVRXQVJEX0RVUkFUSU9OLCBvdXRYLCBzdGFydFkpLmVhc2luZyhjYy5lYXNlQmFja091dCgpKSxcbiAgICAgICAgICAgIGNjLm1vdmVUbyhNQVRDSF9BTElHTl9ZX0RVUkFUSU9OLCBvdXRYLCBtaWRZKS5lYXNpbmcoY2MuZWFzZVNpbmVPdXQoKSksXG4gICAgICAgICAgICBjYy5tb3ZlVG8oTUFUQ0hfTU9WRV9YX0RVUkFUSU9OLCBzdG9wWCwgbWlkWSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbkluKCkpLFxuICAgICAgICAgICAgLy8gY2MubW92ZVRvKE1BVENIX1RPVUNIX0RVUkFUSU9OLCB0b3VjaFgsIG1pZFkpLmVhc2luZyhjYy5lYXNlU2luZUluKCkpLFxuICAgICAgICAgICAgLy8gY2MuZGVsYXlUaW1lKE1BVENIX1RPVUNIX0hPTERfRFVSQVRJT04pLFxuICAgICAgICAgICAgY2Muc3Bhd24oXG4gICAgICAgICAgICAgICAgY2Muc2VxdWVuY2UoXG4gICAgICAgICAgICAgICAgICAgIGNjLnNjYWxlVG8oTUFUQ0hfRkFERV9EVVJBVElPTiAqIDAuMzUsIGJhc2VTY2FsZSAqIDEuMDYpLFxuICAgICAgICAgICAgICAgICAgICBjYy5zY2FsZVRvKE1BVENIX0ZBREVfRFVSQVRJT04sIDApLmVhc2luZyhjYy5lYXNlQmFja0luKCkpXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBjYy5mYWRlT3V0KE1BVENIX0ZBREVfRFVSQVRJT04pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChub2RlICYmIGlzVmFsaWQobm9kZSkpIG5vZGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgKSk7XG4gICAgfVxuXG4gICAgLyoqIOacrOWxgOa2iOmZpOW+l+WIhu+8muWfuuehgOWIhiArIOi/nuWHu+WKoOaIkCArIOivhOe6p+mYtuauteWlluWKsSAqL1xuICAgIHByaXZhdGUgY2FsY01hdGNoU2NvcmVHYWluKGNvbWJvOiBudW1iZXIsIHJhdGVUaWVyOiBudW1iZXIgfCBudWxsKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGdhaW4gPSBTQ09SRV9CQVNFICsgU0NPUkVfQ09NQk9fQUREICogY29tYm87XG4gICAgICAgIGlmIChyYXRlVGllciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgZ2FpbiArPSBTQ09SRV9SQVRFX0JPTlVTW3JhdGVUaWVyXSB8fCAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnYWluO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWRkU2NvcmUoZGVsdGE6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnNjb3JlTnVtICs9IGRlbHRhO1xuICAgICAgICBpZiAodGhpcy5zY29yZURpc3BsYXkpIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcmVEaXNwbGF5LmFkZFZhbHVlKGRlbHRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOi/nua2iCAyIOWvuSDihpIgZ29vZO+8jDQg5a+5IOKGkiBncmVhdCDigKYgMTArIOKGkiB1bmJlbGlldmFibGXjgIJcbiAgICAgKiDmnKrliLDkuIvkuIDmoaPpl7TpmpTml7bkuI3lvLnlrZfjgIJcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldFJhdGVUaWVySW5kZXgoY29tYm86IG51bWJlcik6IG51bWJlciB8IG51bGwge1xuICAgICAgICBpZiAoY29tYm8gPD0gMCB8fCBjb21ibyAlIFJBVEVfTUFUQ0hfU1RFUCAhPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaWR4ID0gTWF0aC5mbG9vcihjb21ibyAvIFJBVEVfTUFUQ0hfU1RFUCkgLSAxO1xuICAgICAgICBpZiAoaWR4IDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGgubWluKGlkeCwgUkFURV9SRVNfS0VZUy5sZW5ndGggLSAxKTtcbiAgICB9XG5cbiAgICAvKiog6K+E57qn5Zu+5Zyo5bGP5a695YaF55qE5pyA5aSn57yp5pS+77yI6K6+6K6h5Z2Q5qCH77yJICovXG4gICAgcHJpdmF0ZSBnZXRSYXRlUG9wdXBGaXRDYXAoZnJhbWU6IGNjLlNwcml0ZUZyYW1lKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3Qgc3ByaXRlVyA9IGZyYW1lID8gZnJhbWUuZ2V0UmVjdCgpLndpZHRoIDogMDtcbiAgICAgICAgaWYgKHNwcml0ZVcgPD0gMCB8fCAhdGhpcy5ub2RlIHx8ICFpc1ZhbGlkKHRoaXMubm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICh0aGlzLm5vZGUud2lkdGggKiBSQVRFX01BWF9XSURUSF9SQVRJTykgLyBzcHJpdGVXO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0UmF0ZVBvcHVwVGFyZ2V0U2NhbGUodGllckluZGV4OiBudW1iZXIsIGZyYW1lOiBjYy5TcHJpdGVGcmFtZSk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IHRpZXJTY2FsZSA9IFJBVEVfVElFUl9TQ0FMRVNbdGllckluZGV4XSB8fCBSQVRFX1RJRVJfU0NBTEVTWzBdO1xuICAgICAgICByZXR1cm4gTWF0aC5taW4odGllclNjYWxlLCB0aGlzLmdldFJhdGVQb3B1cEZpdENhcChmcmFtZSkpO1xuICAgIH1cblxuICAgIC8qKiDlsY/luZXmraPkuK3lvLnlh7ror4TnuqflrZfvvIzluKblvLnlh7rkuI7mlLblm57liqjnlLsgKi9cbiAgICBwbGF5UmF0ZVBvcHVwKHRpZXJJbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5ub2RlIHx8ICFpc1ZhbGlkKHRoaXMubm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmcmFtZSA9IHRoaXMucmF0ZUZyYW1lc1t0aWVySW5kZXhdO1xuICAgICAgICBpZiAoIWZyYW1lKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5yYXRlUG9wdXBOb2RlICYmIGlzVmFsaWQodGhpcy5yYXRlUG9wdXBOb2RlKSkge1xuICAgICAgICAgICAgdGhpcy5yYXRlUG9wdXBOb2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgICAgICB0aGlzLnJhdGVQb3B1cE5vZGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5yYXRlUG9wdXBOb2RlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5vZGUgPSBuZXcgY2MuTm9kZSgnUmF0ZVBvcHVwJyk7XG4gICAgICAgIG5vZGUuc2V0UG9zaXRpb24oMCwgMCk7XG4gICAgICAgIG5vZGUuekluZGV4ID0gWl9PUkRFUi5SQVRFX1BPUFVQO1xuICAgICAgICBub2RlLnNjYWxlID0gMDtcbiAgICAgICAgbm9kZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKG5vZGUpO1xuICAgICAgICB0aGlzLnJhdGVQb3B1cE5vZGUgPSBub2RlO1xuXG4gICAgICAgIGNvbnN0IHNwcml0ZSA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgIHNwcml0ZS5zcHJpdGVGcmFtZSA9IGZyYW1lO1xuICAgICAgICBzcHJpdGUuc2l6ZU1vZGUgPSBjYy5TcHJpdGUuU2l6ZU1vZGUuVFJJTU1FRDtcblxuICAgICAgICBjb25zdCB0YXJnZXRTY2FsZSA9IHRoaXMuZ2V0UmF0ZVBvcHVwVGFyZ2V0U2NhbGUodGllckluZGV4LCBmcmFtZSk7XG4gICAgICAgIGNvbnN0IGZpdENhcCA9IHRoaXMuZ2V0UmF0ZVBvcHVwRml0Q2FwKGZyYW1lKTtcbiAgICAgICAgY29uc3QgcG9wUGVhayA9IE1hdGgubWluKHRhcmdldFNjYWxlICogMS4xNCwgZml0Q2FwKTtcbiAgICAgICAgY29uc3QgcG9wT3V0U2NhbGUgPSBNYXRoLm1pbih0YXJnZXRTY2FsZSAqIDEuMjIsIGZpdENhcCk7XG4gICAgICAgIG5vZGUuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgbm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoXG4gICAgICAgICAgICBjYy5zcGF3bihcbiAgICAgICAgICAgICAgICBjYy5zY2FsZVRvKFJBVEVfUE9QX0lOX0RVUkFUSU9OLCBwb3BQZWFrKS5lYXNpbmcoY2MuZWFzZUJhY2tPdXQoKSksXG4gICAgICAgICAgICAgICAgY2MuZmFkZUluKFJBVEVfUE9QX0lOX0RVUkFUSU9OICogMC42NSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBjYy5zY2FsZVRvKDAuMDYsIHRhcmdldFNjYWxlKS5lYXNpbmcoY2MuZWFzZVNpbmVPdXQoKSksXG4gICAgICAgICAgICBjYy5kZWxheVRpbWUoUkFURV9IT0xEX0RVUkFUSU9OKSxcbiAgICAgICAgICAgIGNjLnNwYXduKFxuICAgICAgICAgICAgICAgIGNjLnNjYWxlVG8oUkFURV9QT1BfT1VUX0RVUkFUSU9OLCBwb3BPdXRTY2FsZSkuZWFzaW5nKGNjLmVhc2VCYWNrSW4oKSksXG4gICAgICAgICAgICAgICAgY2MuZmFkZU91dChSQVRFX1BPUF9PVVRfRFVSQVRJT04pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJhdGVQb3B1cE5vZGUgPT09IG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yYXRlUG9wdXBOb2RlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUgJiYgaXNWYWxpZChub2RlKSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKVxuICAgICAgICApKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBsYXlDaGVja1NvdW5kKCk6IHZvaWQge1xuICAgICAgICBpZighc3VwZXJfaHRtbF9wbGF5YWJsZS5pc19hdWRpbygpKSB7IFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoZWNrQ2xpcCkge1xuICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmNoZWNrQ2xpcCwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNjLnJlc291cmNlcy5sb2FkKENIRUNLX1NPVU5EX1BBVEgsIGNjLkF1ZGlvQ2xpcCwgKGVyciwgY2xpcCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFlcnIgJiYgY2xpcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tDbGlwID0gY2xpcDtcbiAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KGNsaXAsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjaGVja1dpbigpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBdXRvQ2xlYXJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5tYXRjaFBhaXJDb3VudCA+PSBTRVRUTEVNRU5UX01BVENIX1BBSVJTKSB7XG4gICAgICAgICAgICB0aGlzLmJlZ2luVmljdG9yeVdpdGhBdXRvQ2xlYXIoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsZWZ0ID0gdGhpcy5ib2FyZC5nZXRBY3RpdmVDb3VudCgpO1xuICAgICAgICBpZiAobGVmdCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5zaG93VmljdG9yeSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzZXRJZGxlR3VpZGVUaW1lcigpO1xuICAgIH1cblxuICAgIC8qKiDliankvZnniYzlnKggQVVUT19DTEVBUl9CRUZPUkVfU0VUVExFTUVOVF9TRUMg5YaF5b+r6YCf6YWN5a+55raI6Zmk77yM5YaN5Ye657uT566XICovXG4gICAgcHJpdmF0ZSBiZWdpblZpY3RvcnlXaXRoQXV0b0NsZWFyKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0dhbWVPdmVyIHx8IHRoaXMuaXNBdXRvQ2xlYXJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwYWlycyA9IGNvbGxlY3RSZW1haW5pbmdNYXRjaFBhaXJzKHRoaXMuYm9hcmQudGlsZXMpO1xuICAgICAgICBpZiAocGFpcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dWaWN0b3J5KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlzQXV0b0NsZWFyaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5nYW1lUmVhZHkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51bnNjaGVkdWxlKHRoaXMub25JZGxlR3VpZGUpO1xuICAgICAgICB0aGlzLmJvYXJkLmhpZGVIaW50R3VpZGVIYW5kKCk7XG4gICAgICAgIHRoaXMuY2xlYXJHdWlkZUhpZ2hsaWdodCgpO1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5kZXNlbGVjdFRpbGUodGhpcy5zZWxlY3RlZCk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJ1ZGdldCA9IEFVVE9fQ0xFQVJfQkVGT1JFX1NFVFRMRU1FTlRfU0VDO1xuICAgICAgICBjb25zdCBwYWlyQW5pbSA9IEFVVE9fQ0xFQVJfTU9WRV9EVVJBVElPTiArIEFVVE9fQ0xFQVJfUEFJUl9GQURFO1xuICAgICAgICBjb25zdCBuID0gcGFpcnMubGVuZ3RoO1xuICAgICAgICBjb25zdCBzdGFnZ2VyID0gbiA8PSAxXG4gICAgICAgICAgICA/IDBcbiAgICAgICAgICAgIDogTWF0aC5taW4oQVVUT19DTEVBUl9TVEFHR0VSX01BWCwgKGJ1ZGdldCAtIHBhaXJBbmltKSAvIChuIC0gMSkpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwYWlyID0gcGFpcnNbaV07XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVQYWlyQXV0byhwYWlyLmEsIHBhaXIuYik7XG4gICAgICAgICAgICB9LCBpICogc3RhZ2dlcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5maW5pc2hBdXRvQ2xlYXJUaGVuVmljdG9yeSk7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKHRoaXMuZmluaXNoQXV0b0NsZWFyVGhlblZpY3RvcnksIGJ1ZGdldCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaW5pc2hBdXRvQ2xlYXJUaGVuVmljdG9yeSA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQXV0b0NsZWFyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc0F1dG9DbGVhcmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmZhZGVPdXRVbnBhaXJlZFJlbWFpbmRlcnMoKTtcbiAgICAgICAgdGhpcy5ib2FyZC5yZWZyZXNoVmlzdWFscygpO1xuICAgICAgICB0aGlzLnNob3dWaWN0b3J5KCk7XG4gICAgfTtcblxuICAgIC8qKiDml6Dms5XphY3lr7nnmoTpm7bmmJ/liankvZnniYznm7TmjqXmt6Hlh7ogKi9cbiAgICBwcml2YXRlIGZhZGVPdXRVbnBhaXJlZFJlbWFpbmRlcnMoKTogdm9pZCB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ib2FyZC50aWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdGlsZSA9IHRoaXMuYm9hcmQudGlsZXNbaV07XG4gICAgICAgICAgICBpZiAodGlsZS5yZW1vdmVkIHx8ICF0aWxlLm5vZGUgfHwgIWlzVmFsaWQodGlsZS5ub2RlKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGlsZS5yZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aWxlLm5vZGU7XG4gICAgICAgICAgICBub2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgICAgICBub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShcbiAgICAgICAgICAgICAgICBjYy5mYWRlT3V0KEFVVE9fQ0xFQVJfUEFJUl9GQURFKSxcbiAgICAgICAgICAgICAgICBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlICYmIGlzVmFsaWQobm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIOe7k+eul+aJq+Wwvu+8muefreenu+WKqCArIOa3oeWHuu+8jOWPr+W5tuihjOWkmuWvuSAqL1xuICAgIHByaXZhdGUgcmVtb3ZlUGFpckF1dG8oYTogVGlsZU1vZGVsLCBiOiBUaWxlTW9kZWwpOiB2b2lkIHtcbiAgICAgICAgaWYgKCFhLm5vZGUgfHwgIWIubm9kZSB8fCAhaXNWYWxpZChhLm5vZGUpIHx8ICFpc1ZhbGlkKGIubm9kZSkgfHwgYS5yZW1vdmVkIHx8IGIucmVtb3ZlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ib2FyZC5jbGVhclRpbGVTZWxlY3RGb3JNYXRjaChhKTtcbiAgICAgICAgdGhpcy5ib2FyZC5jbGVhclRpbGVTZWxlY3RGb3JNYXRjaChiKTtcbiAgICAgICAgY29uc3QgbGVmdFRpbGUgPSBhLnggPD0gYi54ID8gYSA6IGI7XG4gICAgICAgIGNvbnN0IHJpZ2h0VGlsZSA9IGEueCA8PSBiLnggPyBiIDogYTtcbiAgICAgICAgdGhpcy5ib2FyZC5icmluZ01hdGNoUGFpclRvRnJvbnQobGVmdFRpbGUsIHJpZ2h0VGlsZSk7XG5cbiAgICAgICAgYS5yZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgYi5yZW1vdmVkID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCBtaWRYID0gKGxlZnRUaWxlLnggKyByaWdodFRpbGUueCkgKiAwLjU7XG4gICAgICAgIGNvbnN0IG1pZFkgPSAobGVmdFRpbGUueSArIHJpZ2h0VGlsZS55KSAqIDAuNTtcbiAgICAgICAgdGhpcy5ib2FyZC5wbGF5TWF0Y2hFbGltaW5hdGlvbkVmZmVjdChtaWRYLCBtaWRZKTtcblxuICAgICAgICB0aGlzLmNvbWJvTnVtKys7XG4gICAgICAgIHRoaXMuYWRkU2NvcmUodGhpcy5jYWxjTWF0Y2hTY29yZUdhaW4odGhpcy5jb21ib051bSwgbnVsbCkpO1xuXG4gICAgICAgIHRoaXMucGxheUF1dG9DbGVhclRpbGVBbmltKGxlZnRUaWxlLCBtaWRYLCBtaWRZLCAnbGVmdCcpO1xuICAgICAgICB0aGlzLnBsYXlBdXRvQ2xlYXJUaWxlQW5pbShyaWdodFRpbGUsIG1pZFgsIG1pZFksICdyaWdodCcpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGxheUF1dG9DbGVhclRpbGVBbmltKFxuICAgICAgICB0aWxlOiBUaWxlTW9kZWwsXG4gICAgICAgIG1pZFg6IG51bWJlcixcbiAgICAgICAgbWlkWTogbnVtYmVyLFxuICAgICAgICBzaWRlOiAnbGVmdCcgfCAncmlnaHQnXG4gICAgKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aWxlLm5vZGU7XG4gICAgICAgIGlmICghbm9kZSB8fCAhaXNWYWxpZChub2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN0YXJ0WCA9IHRpbGUueDtcbiAgICAgICAgY29uc3Qgc3RhcnRZID0gdGlsZS55O1xuICAgICAgICBjb25zdCB0YXJnZXRYID0gc2lkZSA9PT0gJ2xlZnQnID8gbWlkWCAtIDggOiBtaWRYICsgODtcbiAgICAgICAgY29uc3QgYmFzZVNjYWxlID0gdGhpcy5ib2FyZC5nZXRCYXNlU2NhbGUodGlsZSk7XG4gICAgICAgIG5vZGUuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgbm9kZS5zZXRTY2FsZShiYXNlU2NhbGUpO1xuICAgICAgICBub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShcbiAgICAgICAgICAgIGNjLnNwYXduKFxuICAgICAgICAgICAgICAgIGNjLm1vdmVUbyhBVVRPX0NMRUFSX01PVkVfRFVSQVRJT04sIHRhcmdldFgsIG1pZFkpLmVhc2luZyhjYy5lYXNlU2luZU91dCgpKSxcbiAgICAgICAgICAgICAgICBjYy5mYWRlVG8oQVVUT19DTEVBUl9NT1ZFX0RVUkFUSU9OLCAyMzApLFxuICAgICAgICAgICAgICAgIGNjLnNjYWxlVG8oQVVUT19DTEVBUl9NT1ZFX0RVUkFUSU9OLCBiYXNlU2NhbGUgKiAxLjA0KVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGNjLnNwYXduKFxuICAgICAgICAgICAgICAgIGNjLnNjYWxlVG8oQVVUT19DTEVBUl9QQUlSX0ZBREUsIDApLmVhc2luZyhjYy5lYXNlQmFja0luKCkpLFxuICAgICAgICAgICAgICAgIGNjLmZhZGVPdXQoQVVUT19DTEVBUl9QQUlSX0ZBREUpXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChub2RlICYmIGlzVmFsaWQobm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoaWRlRW5kUGFuZWwoKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5lbmROb2RlIHx8ICFpc1ZhbGlkKHRoaXMuZW5kTm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5iaW5kRW5kRG93bmxvYWRCdXR0b24pO1xuICAgICAgICBjb25zdCBkb3dubG9hZCA9IHRoaXMuZW5kTm9kZS5nZXRDaGlsZEJ5TmFtZSgnZG93bmxvYWQnKTtcbiAgICAgICAgaWYgKGRvd25sb2FkICYmIGlzVmFsaWQoZG93bmxvYWQpKSB7XG4gICAgICAgICAgICBkb3dubG9hZC50YXJnZXRPZmYodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzZXRWaWN0b3J5RW5kVW5sb2NrKHRoaXMuZW5kTm9kZSk7XG4gICAgICAgIHRoaXMuZW5kTm9kZS5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICB0aGlzLmVuZE5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZW5kTm9kZS5zY2FsZSA9IDE7XG4gICAgICAgIHRoaXMuZW5kTm9kZS5vcGFjaXR5ID0gMjU1O1xuICAgICAgICBpZiAodGhpcy5zY29yZURpc3BsYXkpIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcmVEaXNwbGF5LnJlbW91bnRUb0dhbWVIdWQodGhpcy5ub2RlLCBTQ09SRV9UT1BfTUFSR0lOKTtcbiAgICAgICAgICAgIHRoaXMuc2NvcmVEaXNwbGF5LnNldFZpc2libGUodHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiog5pi+56S6IENhbnZhcyDkuIrphY3nva7nmoQgZW5kIOiKgueCue+8muWIhuatpeaSreaUviBpY29uIC8gdmljdG9yeSAvIOaYn+aYnyAvIFRhc2tMaWdodCAvIOS4i+i9veaMiemSriAqL1xuICAgIHByaXZhdGUgc2hvd0VuZFBhbmVsKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuZW5kTm9kZSB8fCAhaXNWYWxpZCh0aGlzLmVuZE5vZGUpKSB7XG4gICAgICAgICAgICBjYy53YXJuKCdbR2FtZUNvbnRyb2xsZXJdIOacquaJvuWIsCBDYW52YXMvZW5kIOiKgueCuScpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyX2h0bWxfcGxheWFibGUuZ2FtZV9lbmQoKTtcbiAgICAgICAgdGhpcy5lbmROb2RlLnpJbmRleCA9IFpfT1JERVIuRU5EX1BBTkVMO1xuICAgICAgICB0aGlzLmVuZE5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lbmROb2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIHRoaXMuZW5kTm9kZS5zY2FsZSA9IDE7XG4gICAgICAgIHRoaXMuZW5kTm9kZS5vcGFjaXR5ID0gMjU1O1xuICAgICAgICB0aGlzLmVuZE5vZGUuY29sb3IgPSBjYy5Db2xvci5XSElURTtcbiAgICAgICAgbGF5b3V0VmljdG9yeUVuZERpbUJhY2tkcm9wKHRoaXMuZW5kTm9kZSwgdGhpcy5ub2RlKTtcbiAgICAgICAgcGxheVZpY3RvcnlFbmRTZXF1ZW5jZShcbiAgICAgICAgICAgIHRoaXMuZW5kTm9kZSxcbiAgICAgICAgICAgIHRoaXMuc2NvcmVOdW0sXG4gICAgICAgICAgICB0aGlzLnNjb3JlRm9udCxcbiAgICAgICAgICAgIHRoaXMuc2NvcmVEaXNwbGF5XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuYmluZEVuZERvd25sb2FkQnV0dG9uKCk7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKCgpID0+IHRoaXMuYmluZEVuZERvd25sb2FkQnV0dG9uKCksIDIpO1xuICAgIH1cblxuICAgIC8qKiDnu5HlrpogZW5kL2Rvd25sb2Fk77yI5pyJIEJ1dHRvbiDnlKggY2xpY2tFdmVudHPvvIzlkKbliJkgVE9VQ0hfRU5E77yJICovXG4gICAgcHJpdmF0ZSBiaW5kRW5kRG93bmxvYWRCdXR0b24oKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5lbmROb2RlIHx8ICFpc1ZhbGlkKHRoaXMuZW5kTm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBidG4gPSB0aGlzLmVuZE5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ2Rvd25sb2FkJyk7XG4gICAgICAgIGlmICghYnRuIHx8ICFpc1ZhbGlkKGJ0bikpIHtcbiAgICAgICAgICAgIGNjLndhcm4oJ1tHYW1lQ29udHJvbGxlcl0gZW5kL2Rvd25sb2FkIOiKgueCueS4jeWtmOWcqCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGJ0bi5hY3RpdmUgPSB0cnVlO1xuICAgICAgICBidG4ub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgYnRuLnpJbmRleCA9IFpfT1JERVJfRU5EX0NISUxELkRPV05MT0FEO1xuXG4gICAgICAgIGJ0bi50YXJnZXRPZmYodGhpcyk7XG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IGJ0bi5nZXRDb21wb25lbnQoY2MuQnV0dG9uKTtcbiAgICAgICAgaWYgKGJ1dHRvbikge1xuICAgICAgICAgICAgYnV0dG9uLmludGVyYWN0YWJsZSA9IHRydWU7XG4gICAgICAgICAgICBidXR0b24uY2xpY2tFdmVudHMgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IGV2ID0gbmV3IGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIoKTtcbiAgICAgICAgICAgIGV2LnRhcmdldCA9IHRoaXMubm9kZTtcbiAgICAgICAgICAgIGV2LmNvbXBvbmVudCA9ICdHYW1lQ29udHJvbGxlcic7XG4gICAgICAgICAgICBldi5oYW5kbGVyID0gJ29uRW5kRG93bmxvYWRDbGljayc7XG4gICAgICAgICAgICBidXR0b24uY2xpY2tFdmVudHMucHVzaChldik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgYnRuLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5vbkVuZERvd25sb2FkQ2xpY2ssIHRoaXMpO1xuICAgIH1cblxuICAgIC8qKiDnu5PnrpcgZG93bmxvYWTvvIhwdWJsaWPvvJrkvpsgQnV0dG9uLmNsaWNrRXZlbnRzIOiwg+eUqO+8iSAqL1xuICAgIHB1YmxpYyBvbkVuZERvd25sb2FkQ2xpY2soKTogdm9pZCB7XG4gICAgICAgIHN1cGVyX2h0bWxfcGxheWFibGUuZG93bmxvYWQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3dWaWN0b3J5KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0dhbWVPdmVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc0dhbWVPdmVyID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5nYW1lUmVhZHkgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuc2NvcmVEaXNwbGF5KSB7XG4gICAgICAgICAgICB0aGlzLnNjb3JlRGlzcGxheS5zZXRWaXNpYmxlKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5vbklkbGVHdWlkZSk7XG4gICAgICAgIHRoaXMuYm9hcmQuaGlkZUhpbnRHdWlkZUhhbmQoKTtcbiAgICAgICAgdGhpcy5jbGVhckd1aWRlSGlnaGxpZ2h0KCk7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmRlc2VsZWN0VGlsZSh0aGlzLnNlbGVjdGVkKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2NvcmVEaXNwbGF5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY29yZURpc3BsYXkuc2V0VmFsdWUodGhpcy5zY29yZU51bSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zaG93RW5kUGFuZWwoKTtcbiAgICAgICAgfSwgMC4yKTtcbiAgICB9XG59XG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/super_html_playable.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '17ccdQaChlP5oMMyYbnrZ5N', 'super_html_playable');
// script/super_html_playable.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.super_html_playable = void 0;
/**
 * super-html playable adapter
 * @help https://store.cocos.com/app/detail/3657
 * @home https://github.com/magician-f/cocos-playable-demo
 * @author https://github.com/magician-f
 */
var super_html_playable = /** @class */ (function () {
    function super_html_playable() {
    }
    super_html_playable.prototype.download = function () {
        console.log("download");
        //@ts-ignore
        if (window.super_html && typeof super_html.download === 'function') {
            super_html.download();
        }
    };
    super_html_playable.prototype.game_end = function () {
        console.log("game end");
        //@ts-ignore
        if (window.super_html && typeof super_html.game_end === 'function') {
            super_html.game_end();
        }
    };
    /**
     * 是否隐藏下载按钮，意味着使用平台注入的下载按钮
     * channel : google
     */
    super_html_playable.prototype.is_hide_download = function () {
        //@ts-ignore
        if (window.super_html && super_html.is_hide_download) {
            //@ts-ignore
            return super_html.is_hide_download();
        }
        return false;
    };
    /**
     * 设置商店地址
     * channel : unity
     * @param url https://play.google.com/store/apps/details?id=com.unity3d.auicreativetestapp
     */
    super_html_playable.prototype.set_google_play_url = function (url) {
        //@ts-ignore
        window.super_html && (super_html.google_play_url = url);
    };
    /**
    * 设置商店地址
    * channel : unity
    * @param url https://apps.apple.com/us/app/ad-testing/id1463016906
    */
    super_html_playable.prototype.set_app_store_url = function (url) {
        //@ts-ignore
        window.super_html && (super_html.appstore_url = url);
    };
    /**
    * 是否开启声音
    * channel : ironsource
    */
    super_html_playable.prototype.is_audio = function () {
        //@ts-ignore
        if (window.super_html && typeof super_html.is_audio === 'function') {
            //@ts-ignore
            return super_html.is_audio();
        }
        return true;
    };
    return super_html_playable;
}());
exports.super_html_playable = super_html_playable;
exports.default = new super_html_playable();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvc3VwZXJfaHRtbF9wbGF5YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7R0FLRztBQUNIO0lBQUE7SUFpRUEsQ0FBQztJQS9ERyxzQ0FBUSxHQUFSO1FBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4QixZQUFZO1FBQ1osSUFBSSxNQUFNLENBQUMsVUFBVSxJQUFJLE9BQU8sVUFBVSxDQUFDLFFBQVEsS0FBSyxVQUFVLEVBQUU7WUFDaEUsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3pCO0lBQ0wsQ0FBQztJQUVELHNDQUFRLEdBQVI7UUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hCLFlBQVk7UUFDWixJQUFJLE1BQU0sQ0FBQyxVQUFVLElBQUksT0FBTyxVQUFVLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRTtZQUNoRSxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDekI7SUFDTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsOENBQWdCLEdBQWhCO1FBQ0ksWUFBWTtRQUNaLElBQUksTUFBTSxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsZ0JBQWdCLEVBQUU7WUFDbEQsWUFBWTtZQUNaLE9BQU8sVUFBVSxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDeEM7UUFDRCxPQUFPLEtBQUssQ0FBQTtJQUNoQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGlEQUFtQixHQUFuQixVQUFvQixHQUFXO1FBQzNCLFlBQVk7UUFDWixNQUFNLENBQUMsVUFBVSxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQ7Ozs7TUFJRTtJQUNGLCtDQUFpQixHQUFqQixVQUFrQixHQUFXO1FBQ3pCLFlBQVk7UUFDWixNQUFNLENBQUMsVUFBVSxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQ7OztNQUdFO0lBQ0Ysc0NBQVEsR0FBUjtRQUNJLFlBQVk7UUFDWixJQUFJLE1BQU0sQ0FBQyxVQUFVLElBQUksT0FBTyxVQUFVLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRTtZQUNoRSxZQUFZO1lBQ1osT0FBTyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDaEM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBR0wsMEJBQUM7QUFBRCxDQWpFQSxBQWlFQyxJQUFBO0FBakVZLGtEQUFtQjtBQWtFaEMsa0JBQWUsSUFBSSxtQkFBbUIsRUFBRSxDQUFDIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBzdXBlci1odG1sIHBsYXlhYmxlIGFkYXB0ZXJcbiAqIEBoZWxwIGh0dHBzOi8vc3RvcmUuY29jb3MuY29tL2FwcC9kZXRhaWwvMzY1N1xuICogQGhvbWUgaHR0cHM6Ly9naXRodWIuY29tL21hZ2ljaWFuLWYvY29jb3MtcGxheWFibGUtZGVtb1xuICogQGF1dGhvciBodHRwczovL2dpdGh1Yi5jb20vbWFnaWNpYW4tZlxuICovXG5leHBvcnQgY2xhc3Mgc3VwZXJfaHRtbF9wbGF5YWJsZSB7XG5cbiAgICBkb3dubG9hZCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJkb3dubG9hZFwiKTtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGlmICh3aW5kb3cuc3VwZXJfaHRtbCAmJiB0eXBlb2Ygc3VwZXJfaHRtbC5kb3dubG9hZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgc3VwZXJfaHRtbC5kb3dubG9hZCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2FtZV9lbmQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZ2FtZSBlbmRcIik7XG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICBpZiAod2luZG93LnN1cGVyX2h0bWwgJiYgdHlwZW9mIHN1cGVyX2h0bWwuZ2FtZV9lbmQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHN1cGVyX2h0bWwuZ2FtZV9lbmQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOaYr+WQpumakOiXj+S4i+i9veaMiemSru+8jOaEj+WRs+edgOS9v+eUqOW5s+WPsOazqOWFpeeahOS4i+i9veaMiemSrlxuICAgICAqIGNoYW5uZWwgOiBnb29nbGVcbiAgICAgKi9cbiAgICBpc19oaWRlX2Rvd25sb2FkKCkge1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgaWYgKHdpbmRvdy5zdXBlcl9odG1sICYmIHN1cGVyX2h0bWwuaXNfaGlkZV9kb3dubG9hZCkge1xuICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICByZXR1cm4gc3VwZXJfaHRtbC5pc19oaWRlX2Rvd25sb2FkKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6K6+572u5ZWG5bqX5Zyw5Z2AXG4gICAgICogY2hhbm5lbCA6IHVuaXR5XG4gICAgICogQHBhcmFtIHVybCBodHRwczovL3BsYXkuZ29vZ2xlLmNvbS9zdG9yZS9hcHBzL2RldGFpbHM/aWQ9Y29tLnVuaXR5M2QuYXVpY3JlYXRpdmV0ZXN0YXBwXG4gICAgICovXG4gICAgc2V0X2dvb2dsZV9wbGF5X3VybCh1cmw6IHN0cmluZykge1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgd2luZG93LnN1cGVyX2h0bWwgJiYgKHN1cGVyX2h0bWwuZ29vZ2xlX3BsYXlfdXJsID0gdXJsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIOiuvue9ruWVhuW6l+WcsOWdgFxuICAgICogY2hhbm5lbCA6IHVuaXR5XG4gICAgKiBAcGFyYW0gdXJsIGh0dHBzOi8vYXBwcy5hcHBsZS5jb20vdXMvYXBwL2FkLXRlc3RpbmcvaWQxNDYzMDE2OTA2XG4gICAgKi9cbiAgICBzZXRfYXBwX3N0b3JlX3VybCh1cmw6IHN0cmluZykge1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgd2luZG93LnN1cGVyX2h0bWwgJiYgKHN1cGVyX2h0bWwuYXBwc3RvcmVfdXJsID0gdXJsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIOaYr+WQpuW8gOWQr+WjsOmfs1xuICAgICogY2hhbm5lbCA6IGlyb25zb3VyY2VcbiAgICAqL1xuICAgIGlzX2F1ZGlvKCkge1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgaWYgKHdpbmRvdy5zdXBlcl9odG1sICYmIHR5cGVvZiBzdXBlcl9odG1sLmlzX2F1ZGlvID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgIHJldHVybiBzdXBlcl9odG1sLmlzX2F1ZGlvKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG5cbn1cbmV4cG9ydCBkZWZhdWx0IG5ldyBzdXBlcl9odG1sX3BsYXlhYmxlKCk7Il19
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/ui/TileHintMarquee.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'a649ehPextClLQG7sQF8lUa', 'TileHintMarquee');
// script/ui/TileHintMarquee.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HINT_MARQUEE_STYLE = exports.tileFaceBoundsFromTrim = exports.MJ_TILE_FACE_TRIM = void 0;
var is_valid_1 = require("../is-valid");
var ccclass = cc._decorator.ccclass;
exports.MJ_TILE_FACE_TRIM = {
    left: 5,
    right: 10,
    top: 5,
    bottom: 15,
};
/** 由牌面尺寸与四边裁切算出跑马灯边界（中心锚点坐标系） */
function tileFaceBoundsFromTrim(faceWidth, faceHeight, scaleX, scaleY, trim) {
    if (trim === void 0) { trim = exports.MJ_TILE_FACE_TRIM; }
    var halfW = faceWidth * scaleX * 0.5;
    var halfH = faceHeight * scaleY * 0.5;
    return {
        left: -halfW + trim.left * scaleX,
        right: halfW - trim.right * scaleX,
        bottom: -halfH + trim.bottom * scaleY,
        top: halfH - trim.top * scaleY,
    };
}
exports.tileFaceBoundsFromTrim = tileFaceBoundsFromTrim;
/** 跑马灯颜色与线宽（按需调整） */
exports.HINT_MARQUEE_STYLE = {
    trackColor: { r: 255, g: 180, b: 0, a: 255 },
    glowColor: { r: 255, g: 90, b: 0, a: 220 },
    brightOuterColor: { r: 255, g: 255, b: 255, a: 255 },
    brightCoreColor: { r: 0, g: 255, b: 220, a: 255 },
    trackLineWidth: 5,
    glowLineWidth: 12,
    brightOuterLineWidth: 14,
    brightCoreLineWidth: 7,
    speed: 1.05,
    segmentFrac: 0.34,
};
/** 沿圆角麻将牌面可见区域外缘的跑马灯描边（空闲提示） */
var TileHintMarquee = /** @class */ (function (_super) {
    __extends(TileHintMarquee, _super);
    function TileHintMarquee() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.graphics = null;
        _this.left = -80;
        _this.right = 80;
        _this.bottom = -100;
        _this.top = 100;
        _this.cornerR = 18;
        _this.phase = 0;
        _this.pulse = 0;
        _this.speed = exports.HINT_MARQUEE_STYLE.speed;
        _this.segmentFrac = exports.HINT_MARQUEE_STYLE.segmentFrac;
        _this.trackColor = cc.color(exports.HINT_MARQUEE_STYLE.trackColor.r, exports.HINT_MARQUEE_STYLE.trackColor.g, exports.HINT_MARQUEE_STYLE.trackColor.b, exports.HINT_MARQUEE_STYLE.trackColor.a);
        _this.brightOuterColor = cc.color(exports.HINT_MARQUEE_STYLE.brightOuterColor.r, exports.HINT_MARQUEE_STYLE.brightOuterColor.g, exports.HINT_MARQUEE_STYLE.brightOuterColor.b, exports.HINT_MARQUEE_STYLE.brightOuterColor.a);
        _this.brightCoreColor = cc.color(exports.HINT_MARQUEE_STYLE.brightCoreColor.r, exports.HINT_MARQUEE_STYLE.brightCoreColor.g, exports.HINT_MARQUEE_STYLE.brightCoreColor.b, exports.HINT_MARQUEE_STYLE.brightCoreColor.a);
        _this.glowColor = cc.color(exports.HINT_MARQUEE_STYLE.glowColor.r, exports.HINT_MARQUEE_STYLE.glowColor.g, exports.HINT_MARQUEE_STYLE.glowColor.b, exports.HINT_MARQUEE_STYLE.glowColor.a);
        _this.trackLineWidth = exports.HINT_MARQUEE_STYLE.trackLineWidth;
        _this.brightOuterLineWidth = exports.HINT_MARQUEE_STYLE.brightOuterLineWidth;
        _this.brightCoreLineWidth = exports.HINT_MARQUEE_STYLE.brightCoreLineWidth;
        _this.glowLineWidth = exports.HINT_MARQUEE_STYLE.glowLineWidth;
        return _this;
    }
    /**
     * 按牌面可见矩形设置（中心锚点坐标系）。
     * @param left right bottom top 相对牌面节点中心的边界
     */
    TileHintMarquee.prototype.setupRect = function (left, right, bottom, top, inset, cornerRadius) {
        if (inset === void 0) { inset = 2; }
        this.left = left + inset;
        this.right = right - inset;
        this.bottom = bottom + inset;
        this.top = top - inset;
        var w = Math.max(8, (this.right - this.left) * 0.5);
        var h = Math.max(8, (this.top - this.bottom) * 0.5);
        this.cornerR = cornerRadius !== undefined
            ? cornerRadius
            : Math.min(w, h) * 0.22;
        this.cornerR = Math.min(this.cornerR, w * 0.45, h * 0.45);
        this.graphics = this.getComponent(cc.Graphics) || this.addComponent(cc.Graphics);
        this.phase = 0;
        this.pulse = 0;
        this.redraw();
    };
    TileHintMarquee.prototype.update = function (dt) {
        if (!this.graphics || !is_valid_1.isValid(this.graphics)) {
            return;
        }
        this.phase = (this.phase + dt * this.speed) % 1;
        this.pulse = (this.pulse + dt * 4.5) % (Math.PI * 2);
        this.redraw();
    };
    TileHintMarquee.prototype.redraw = function () {
        var g = this.graphics;
        var r = this.cornerR;
        g.clear();
        var pulseA = 0.82 + 0.18 * Math.sin(this.pulse);
        g.lineWidth = this.glowLineWidth;
        g.strokeColor = cc.color(this.glowColor.r, this.glowColor.g, this.glowColor.b, Math.min(255, Math.floor(this.glowColor.a * pulseA)));
        this.strokeRoundRect(g, r + 3);
        g.lineWidth = this.trackLineWidth;
        g.strokeColor = this.trackColor;
        this.strokeRoundRect(g, r);
        g.lineWidth = this.brightOuterLineWidth;
        g.strokeColor = this.brightOuterColor;
        this.strokeSegment(g, r, this.phase, this.segmentFrac);
        g.lineWidth = this.brightCoreLineWidth;
        g.strokeColor = this.brightCoreColor;
        this.strokeSegment(g, r, this.phase, this.segmentFrac);
    };
    TileHintMarquee.prototype.clampRadius = function (r) {
        var w = this.right - this.left;
        var h = this.top - this.bottom;
        return Math.min(Math.max(4, r), w * 0.45, h * 0.45);
    };
    TileHintMarquee.prototype.strokeRoundRect = function (g, r) {
        var radius = this.clampRadius(r);
        var w = this.right - this.left;
        var h = this.top - this.bottom;
        g.roundRect(this.left, this.bottom, w, h, radius);
        g.stroke();
    };
    TileHintMarquee.prototype.perimeter = function (r) {
        var radius = this.clampRadius(r);
        var w = this.right - this.left;
        var h = this.top - this.bottom;
        var straight = 2 * (w - 2 * radius) + 2 * (h - 2 * radius);
        var arcs = Math.PI * 2 * radius;
        return straight + arcs;
    };
    /** 圆角矩形路径采样（顺时针，从顶边左端开始） */
    TileHintMarquee.prototype.pointOnRoundRect = function (t, r) {
        var radius = this.clampRadius(r);
        var L = this.left;
        var R = this.right;
        var B = this.bottom;
        var T = this.top;
        var topLen = (R - L) - 2 * radius;
        var sideLen = (T - B) - 2 * radius;
        var arcLen = Math.PI * 0.5 * radius;
        var total = this.perimeter(r);
        var d = (t % 1) * total;
        if (d < topLen) {
            return cc.v2(L + radius + d, T);
        }
        d -= topLen;
        if (d < arcLen) {
            var ang_1 = Math.PI * 0.5 - (d / arcLen) * (Math.PI * 0.5);
            return cc.v2((R - radius) + Math.cos(ang_1) * radius, (T - radius) + Math.sin(ang_1) * radius);
        }
        d -= arcLen;
        if (d < sideLen) {
            return cc.v2(R, T - radius - d);
        }
        d -= sideLen;
        if (d < arcLen) {
            var ang_2 = 0 - (d / arcLen) * (Math.PI * 0.5);
            return cc.v2((R - radius) + Math.cos(ang_2) * radius, (B + radius) + Math.sin(ang_2) * radius);
        }
        d -= arcLen;
        if (d < topLen) {
            return cc.v2(R - radius - d, B);
        }
        d -= topLen;
        if (d < arcLen) {
            var ang_3 = -Math.PI * 0.5 - (d / arcLen) * (Math.PI * 0.5);
            return cc.v2((L + radius) + Math.cos(ang_3) * radius, (B + radius) + Math.sin(ang_3) * radius);
        }
        d -= arcLen;
        if (d < sideLen) {
            return cc.v2(L, B + radius + d);
        }
        d -= sideLen;
        var ang = Math.PI - (d / arcLen) * (Math.PI * 0.5);
        return cc.v2((L + radius) + Math.cos(ang) * radius, (T - radius) + Math.sin(ang) * radius);
    };
    TileHintMarquee.prototype.strokeSegment = function (g, r, startT, lenFrac) {
        var steps = 36;
        for (var i = 0; i <= steps; i++) {
            var t = (startT + lenFrac * (i / steps)) % 1;
            var p = this.pointOnRoundRect(t, r);
            if (i === 0) {
                g.moveTo(p.x, p.y);
            }
            else {
                g.lineTo(p.x, p.y);
            }
        }
        g.stroke();
    };
    TileHintMarquee = __decorate([
        ccclass
    ], TileHintMarquee);
    return TileHintMarquee;
}(cc.Component));
exports.default = TileHintMarquee;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvdWkvVGlsZUhpbnRNYXJxdWVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx3Q0FBc0M7QUFFOUIsSUFBQSxPQUFPLEdBQUssRUFBRSxDQUFDLFVBQVUsUUFBbEIsQ0FBbUI7QUFVckIsUUFBQSxpQkFBaUIsR0FBbUI7SUFDN0MsSUFBSSxFQUFFLENBQUM7SUFDUCxLQUFLLEVBQUUsRUFBRTtJQUNULEdBQUcsRUFBRSxDQUFDO0lBQ04sTUFBTSxFQUFFLEVBQUU7Q0FDYixDQUFDO0FBRUYsaUNBQWlDO0FBQ2pDLFNBQWdCLHNCQUFzQixDQUNsQyxTQUFpQixFQUNqQixVQUFrQixFQUNsQixNQUFjLEVBQ2QsTUFBYyxFQUNkLElBQXdDO0lBQXhDLHFCQUFBLEVBQUEsT0FBdUIseUJBQWlCO0lBRXhDLElBQU0sS0FBSyxHQUFHLFNBQVMsR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDO0lBQ3ZDLElBQU0sS0FBSyxHQUFHLFVBQVUsR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDO0lBQ3hDLE9BQU87UUFDSCxJQUFJLEVBQUUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNO1FBQ2pDLEtBQUssRUFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNO1FBQ2xDLE1BQU0sRUFBRSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU07UUFDckMsR0FBRyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU07S0FDakMsQ0FBQztBQUNOLENBQUM7QUFmRCx3REFlQztBQUVELHFCQUFxQjtBQUNSLFFBQUEsa0JBQWtCLEdBQUc7SUFDOUIsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdB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SUFBSSxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUM3QixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUN0RCxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxPQUFPLEdBQUcsWUFBWSxLQUFLLFNBQVM7WUFDckMsQ0FBQyxDQUFDLFlBQVk7WUFDZCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakYsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBRUQsZ0NBQU0sR0FBTixVQUFPLEVBQVU7UUFD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LE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN0QjtpQkFBTTtnQkFDSCxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3RCO1NBQ0o7UUFDRCxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDZixDQUFDO0lBdE5nQixlQUFlO1FBRG5DLE9BQU87T0FDYSxlQUFlLENBdU5uQztJQUFELHNCQUFDO0NBdk5ELEFBdU5DLENBdk40QyxFQUFFLENBQUMsU0FBUyxHQXVOeEQ7a0JBdk5vQixlQUFlIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNWYWxpZCB9IGZyb20gJy4uL2lzLXZhbGlkJztcblxuY29uc3QgeyBjY2NsYXNzIH0gPSBjYy5fZGVjb3JhdG9yO1xuXG4vKiogZ2FtZXBsYXlfaW1nX21qX3VwIOe6ueeQhuWbm+i+uemAj+aYji/og4zmma/ovrnot53vvIjmupDlm77lg4/ntKDvvIzmjInpnIDmlLnmlbDlgLzvvIkgKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGlsZUZhY2VUcmltUHgge1xuICAgIGxlZnQ6IG51bWJlcjtcbiAgICByaWdodDogbnVtYmVyO1xuICAgIHRvcDogbnVtYmVyO1xuICAgIGJvdHRvbTogbnVtYmVyO1xufVxuXG5leHBvcnQgY29uc3QgTUpfVElMRV9GQUNFX1RSSU06IFRpbGVGYWNlVHJpbVB4ID0ge1xuICAgIGxlZnQ6IDUsXG4gICAgcmlnaHQ6IDEwLFxuICAgIHRvcDogNSxcbiAgICBib3R0b206IDE1LFxufTtcblxuLyoqIOeUseeJjOmdouWwuuWvuOS4juWbm+i+ueijgeWIh+eul+WHuui3kemprOeBr+i+ueeVjO+8iOS4reW/g+mUmueCueWdkOagh+ezu++8iSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbGVGYWNlQm91bmRzRnJvbVRyaW0oXG4gICAgZmFjZVdpZHRoOiBudW1iZXIsXG4gICAgZmFjZUhlaWdodDogbnVtYmVyLFxuICAgIHNjYWxlWDogbnVtYmVyLFxuICAgIHNjYWxlWTogbnVtYmVyLFxuICAgIHRyaW06IFRpbGVGYWNlVHJpbVB4ID0gTUpfVElMRV9GQUNFX1RSSU1cbik6IHsgbGVmdDogbnVtYmVyOyByaWdodDogbnVtYmVyOyBib3R0b206IG51bWJlcjsgdG9wOiBudW1iZXIgfSB7XG4gICAgY29uc3QgaGFsZlcgPSBmYWNlV2lkdGggKiBzY2FsZVggKiAwLjU7XG4gICAgY29uc3QgaGFsZkggPSBmYWNlSGVpZ2h0ICogc2NhbGVZICogMC41O1xuICAgIHJldHVybiB7XG4gICAgICAgIGxlZnQ6IC1oYWxmVyArIHRyaW0ubGVmdCAqIHNjYWxlWCxcbiAgICAgICAgcmlnaHQ6IGhhbGZXIC0gdHJpbS5yaWdodCAqIHNjYWxlWCxcbiAgICAgICAgYm90dG9tOiAtaGFsZkggKyB0cmltLmJvdHRvbSAqIHNjYWxlWSxcbiAgICAgICAgdG9wOiBoYWxmSCAtIHRyaW0udG9wICogc2NhbGVZLFxuICAgIH07XG59XG5cbi8qKiDot5Hpqaznga/popzoibLkuI7nur/lrr3vvIjmjInpnIDosIPmlbTvvIkgKi9cbmV4cG9ydCBjb25zdCBISU5UX01BUlFVRUVfU1RZTEUgPSB7XG4gICAgdHJhY2tDb2xvcjogeyByOiAyNTUsIGc6IDE4MCwgYjogMCwgYTogMjU1IH0sXG4gICAgZ2xvd0NvbG9yOiB7IHI6IDI1NSwgZzogOTAsIGI6IDAsIGE6IDIyMCB9LFxuICAgIGJyaWdodE91dGVyQ29sb3I6IHsgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSwgYTogMjU1IH0sXG4gICAgYnJpZ2h0Q29yZUNvbG9yOiB7IHI6IDAsIGc6IDI1NSwgYjogMjIwLCBhOiAyNTUgfSxcbiAgICB0cmFja0xpbmVXaWR0aDogNSxcbiAgICBnbG93TGluZVdpZHRoOiAxMixcbiAgICBicmlnaHRPdXRlckxpbmVXaWR0aDogMTQsXG4gICAgYnJpZ2h0Q29yZUxpbmVXaWR0aDogNyxcbiAgICBzcGVlZDogMS4wNSxcbiAgICBzZWdtZW50RnJhYzogMC4zNCxcbn07XG5cbi8qKiDmsr/lnIbop5LpurvlsIbniYzpnaLlj6/op4HljLrln5/lpJbnvJjnmoTot5Hpqaznga/mj4/ovrnvvIjnqbrpl7Lmj5DnpLrvvIkgKi9cbkBjY2NsYXNzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWxlSGludE1hcnF1ZWUgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xuICAgIHByaXZhdGUgZ3JhcGhpY3M6IGNjLkdyYXBoaWNzID0gbnVsbDtcbiAgICBwcml2YXRlIGxlZnQgPSAtODA7XG4gICAgcHJpdmF0ZSByaWdodCA9IDgwO1xuICAgIHByaXZhdGUgYm90dG9tID0gLTEwMDtcbiAgICBwcml2YXRlIHRvcCA9IDEwMDtcbiAgICBwcml2YXRlIGNvcm5lclIgPSAxODtcbiAgICBwcml2YXRlIHBoYXNlID0gMDtcbiAgICBwcml2YXRlIHB1bHNlID0gMDtcbiAgICBwcml2YXRlIHNwZWVkID0gSElOVF9NQVJRVUVFX1NUWUxFLnNwZWVkO1xuICAgIHByaXZhdGUgc2VnbWVudEZyYWMgPSBISU5UX01BUlFVRUVfU1RZTEUuc2VnbWVudEZyYWM7XG4gICAgcHJpdmF0ZSB0cmFja0NvbG9yID0gY2MuY29sb3IoXG4gICAgICAgIEhJTlRfTUFSUVVFRV9TVFlMRS50cmFja0NvbG9yLnIsXG4gICAgICAgIEhJTlRfTUFSUVVFRV9TVFlMRS50cmFja0NvbG9yLmcsXG4gICAgICAgIEhJTlRfTUFSUVVFRV9TVFlMRS50cmFja0NvbG9yLmIsXG4gICAgICAgIEhJTlRfTUFSUVVFRV9TVFlMRS50cmFja0NvbG9yLmFcbiAgICApO1xuICAgIHByaXZhdGUgYnJpZ2h0T3V0ZXJDb2xvciA9IGNjLmNvbG9yKFxuICAgICAgICBISU5UX01BUlFVRUVfU1RZTEUuYnJpZ2h0T3V0ZXJDb2xvci5yLFxuICAgICAgICBISU5UX01BUlFVRUVfU1RZTEUuYnJpZ2h0T3V0ZXJDb2xvci5nLFxuICAgICAgICBISU5UX01BUlFVRUVfU1RZTEUuYnJpZ2h0T3V0ZXJDb2xvci5iLFxuICAgICAgICBISU5UX01BUlFVRUVfU1RZTEUuYnJpZ2h0T3V0ZXJDb2xvci5hXG4gICAgKTtcbiAgICBwcml2YXRlIGJyaWdodENvcmVDb2xvciA9IGNjLmNvbG9yKFxuICAgICAgICBISU5UX01BUlFVRUVfU1RZTEUuYnJpZ2h0Q29yZUNvbG9yLnIsXG4gICAgICAgIEhJTlRfTUFSUVVFRV9TVFlMRS5icmlnaHRDb3JlQ29sb3IuZyxcbiAgICAgICAgSElOVF9NQVJRVUVFX1NUWUxFLmJyaWdodENvcmVDb2xvci5iLFxuICAgICAgICBISU5UX01BUlFVRUVfU1RZTEUuYnJpZ2h0Q29yZUNvbG9yLmFcbiAgICApO1xuICAgIHByaXZhdGUgZ2xvd0NvbG9yID0gY2MuY29sb3IoXG4gICAgICAgIEhJTlRfTUFSUVVFRV9TVFlMRS5nbG93Q29sb3IucixcbiAgICAgICAgSElOVF9NQVJRVUVFX1NUWUxFLmdsb3dDb2xvci5nLFxuICAgICAgICBISU5UX01BUlFVRUVfU1RZTEUuZ2xvd0NvbG9yLmIsXG4gICAgICAgIEhJTlRfTUFSUVVFRV9TVFlMRS5nbG93Q29sb3IuYVxuICAgICk7XG4gICAgcHJpdmF0ZSB0cmFja0xpbmVXaWR0aCA9IEhJTlRfTUFSUVVFRV9TVFlMRS50cmFja0xpbmVXaWR0aDtcbiAgICBwcml2YXRlIGJyaWdodE91dGVyTGluZVdpZHRoID0gSElOVF9NQVJRVUVFX1NUWUxFLmJyaWdodE91dGVyTGluZVdpZHRoO1xuICAgIHByaXZhdGUgYnJpZ2h0Q29yZUxpbmVXaWR0aCA9IEhJTlRfTUFSUVVFRV9TVFlMRS5icmlnaHRDb3JlTGluZVdpZHRoO1xuICAgIHByaXZhdGUgZ2xvd0xpbmVXaWR0aCA9IEhJTlRfTUFSUVVFRV9TVFlMRS5nbG93TGluZVdpZHRoO1xuXG4gICAgLyoqXG4gICAgICog5oyJ54mM6Z2i5Y+v6KeB55+p5b2i6K6+572u77yI5Lit5b+D6ZSa54K55Z2Q5qCH57O777yJ44CCXG4gICAgICogQHBhcmFtIGxlZnQgcmlnaHQgYm90dG9tIHRvcCDnm7jlr7nniYzpnaLoioLngrnkuK3lv4PnmoTovrnnlYxcbiAgICAgKi9cbiAgICBzZXR1cFJlY3QoXG4gICAgICAgIGxlZnQ6IG51bWJlcixcbiAgICAgICAgcmlnaHQ6IG51bWJlcixcbiAgICAgICAgYm90dG9tOiBudW1iZXIsXG4gICAgICAgIHRvcDogbnVtYmVyLFxuICAgICAgICBpbnNldDogbnVtYmVyID0gMixcbiAgICAgICAgY29ybmVyUmFkaXVzPzogbnVtYmVyXG4gICAgKTogdm9pZCB7XG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQgKyBpbnNldDtcbiAgICAgICAgdGhpcy5yaWdodCA9IHJpZ2h0IC0gaW5zZXQ7XG4gICAgICAgIHRoaXMuYm90dG9tID0gYm90dG9tICsgaW5zZXQ7XG4gICAgICAgIHRoaXMudG9wID0gdG9wIC0gaW5zZXQ7XG4gICAgICAgIGNvbnN0IHcgPSBNYXRoLm1heCg4LCAodGhpcy5yaWdodCAtIHRoaXMubGVmdCkgKiAwLjUpO1xuICAgICAgICBjb25zdCBoID0gTWF0aC5tYXgoOCwgKHRoaXMudG9wIC0gdGhpcy5ib3R0b20pICogMC41KTtcbiAgICAgICAgdGhpcy5jb3JuZXJSID0gY29ybmVyUmFkaXVzICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8gY29ybmVyUmFkaXVzXG4gICAgICAgICAgICA6IE1hdGgubWluKHcsIGgpICogMC4yMjtcbiAgICAgICAgdGhpcy5jb3JuZXJSID0gTWF0aC5taW4odGhpcy5jb3JuZXJSLCB3ICogMC40NSwgaCAqIDAuNDUpO1xuICAgICAgICB0aGlzLmdyYXBoaWNzID0gdGhpcy5nZXRDb21wb25lbnQoY2MuR3JhcGhpY3MpIHx8IHRoaXMuYWRkQ29tcG9uZW50KGNjLkdyYXBoaWNzKTtcbiAgICAgICAgdGhpcy5waGFzZSA9IDA7XG4gICAgICAgIHRoaXMucHVsc2UgPSAwO1xuICAgICAgICB0aGlzLnJlZHJhdygpO1xuICAgIH1cblxuICAgIHVwZGF0ZShkdDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5ncmFwaGljcyB8fCAhaXNWYWxpZCh0aGlzLmdyYXBoaWNzKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGhhc2UgPSAodGhpcy5waGFzZSArIGR0ICogdGhpcy5zcGVlZCkgJSAxO1xuICAgICAgICB0aGlzLnB1bHNlID0gKHRoaXMucHVsc2UgKyBkdCAqIDQuNSkgJSAoTWF0aC5QSSAqIDIpO1xuICAgICAgICB0aGlzLnJlZHJhdygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVkcmF3KCk6IHZvaWQge1xuICAgICAgICBjb25zdCBnID0gdGhpcy5ncmFwaGljcztcbiAgICAgICAgY29uc3QgciA9IHRoaXMuY29ybmVyUjtcbiAgICAgICAgZy5jbGVhcigpO1xuXG4gICAgICAgIGNvbnN0IHB1bHNlQSA9IDAuODIgKyAwLjE4ICogTWF0aC5zaW4odGhpcy5wdWxzZSk7XG5cbiAgICAgICAgZy5saW5lV2lkdGggPSB0aGlzLmdsb3dMaW5lV2lkdGg7XG4gICAgICAgIGcuc3Ryb2tlQ29sb3IgPSBjYy5jb2xvcihcbiAgICAgICAgICAgIHRoaXMuZ2xvd0NvbG9yLnIsXG4gICAgICAgICAgICB0aGlzLmdsb3dDb2xvci5nLFxuICAgICAgICAgICAgdGhpcy5nbG93Q29sb3IuYixcbiAgICAgICAgICAgIE1hdGgubWluKDI1NSwgTWF0aC5mbG9vcih0aGlzLmdsb3dDb2xvci5hICogcHVsc2VBKSlcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zdHJva2VSb3VuZFJlY3QoZywgciArIDMpO1xuXG4gICAgICAgIGcubGluZVdpZHRoID0gdGhpcy50cmFja0xpbmVXaWR0aDtcbiAgICAgICAgZy5zdHJva2VDb2xvciA9IHRoaXMudHJhY2tDb2xvcjtcbiAgICAgICAgdGhpcy5zdHJva2VSb3VuZFJlY3QoZywgcik7XG5cbiAgICAgICAgZy5saW5lV2lkdGggPSB0aGlzLmJyaWdodE91dGVyTGluZVdpZHRoO1xuICAgICAgICBnLnN0cm9rZUNvbG9yID0gdGhpcy5icmlnaHRPdXRlckNvbG9yO1xuICAgICAgICB0aGlzLnN0cm9rZVNlZ21lbnQoZywgciwgdGhpcy5waGFzZSwgdGhpcy5zZWdtZW50RnJhYyk7XG5cbiAgICAgICAgZy5saW5lV2lkdGggPSB0aGlzLmJyaWdodENvcmVMaW5lV2lkdGg7XG4gICAgICAgIGcuc3Ryb2tlQ29sb3IgPSB0aGlzLmJyaWdodENvcmVDb2xvcjtcbiAgICAgICAgdGhpcy5zdHJva2VTZWdtZW50KGcsIHIsIHRoaXMucGhhc2UsIHRoaXMuc2VnbWVudEZyYWMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2xhbXBSYWRpdXMocjogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgdyA9IHRoaXMucmlnaHQgLSB0aGlzLmxlZnQ7XG4gICAgICAgIGNvbnN0IGggPSB0aGlzLnRvcCAtIHRoaXMuYm90dG9tO1xuICAgICAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgoNCwgciksIHcgKiAwLjQ1LCBoICogMC40NSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdHJva2VSb3VuZFJlY3QoZzogY2MuR3JhcGhpY3MsIHI6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCByYWRpdXMgPSB0aGlzLmNsYW1wUmFkaXVzKHIpO1xuICAgICAgICBjb25zdCB3ID0gdGhpcy5yaWdodCAtIHRoaXMubGVmdDtcbiAgICAgICAgY29uc3QgaCA9IHRoaXMudG9wIC0gdGhpcy5ib3R0b207XG4gICAgICAgIGcucm91bmRSZWN0KHRoaXMubGVmdCwgdGhpcy5ib3R0b20sIHcsIGgsIHJhZGl1cyk7XG4gICAgICAgIGcuc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwZXJpbWV0ZXIocjogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgcmFkaXVzID0gdGhpcy5jbGFtcFJhZGl1cyhyKTtcbiAgICAgICAgY29uc3QgdyA9IHRoaXMucmlnaHQgLSB0aGlzLmxlZnQ7XG4gICAgICAgIGNvbnN0IGggPSB0aGlzLnRvcCAtIHRoaXMuYm90dG9tO1xuICAgICAgICBjb25zdCBzdHJhaWdodCA9IDIgKiAodyAtIDIgKiByYWRpdXMpICsgMiAqIChoIC0gMiAqIHJhZGl1cyk7XG4gICAgICAgIGNvbnN0IGFyY3MgPSBNYXRoLlBJICogMiAqIHJhZGl1cztcbiAgICAgICAgcmV0dXJuIHN0cmFpZ2h0ICsgYXJjcztcbiAgICB9XG5cbiAgICAvKiog5ZyG6KeS55+p5b2i6Lev5b6E6YeH5qC377yI6aG65pe26ZKI77yM5LuO6aG26L655bem56uv5byA5aeL77yJICovXG4gICAgcHJpdmF0ZSBwb2ludE9uUm91bmRSZWN0KHQ6IG51bWJlciwgcjogbnVtYmVyKTogY2MuVmVjMiB7XG4gICAgICAgIGNvbnN0IHJhZGl1cyA9IHRoaXMuY2xhbXBSYWRpdXMocik7XG4gICAgICAgIGNvbnN0IEwgPSB0aGlzLmxlZnQ7XG4gICAgICAgIGNvbnN0IFIgPSB0aGlzLnJpZ2h0O1xuICAgICAgICBjb25zdCBCID0gdGhpcy5ib3R0b207XG4gICAgICAgIGNvbnN0IFQgPSB0aGlzLnRvcDtcblxuICAgICAgICBjb25zdCB0b3BMZW4gPSAoUiAtIEwpIC0gMiAqIHJhZGl1cztcbiAgICAgICAgY29uc3Qgc2lkZUxlbiA9IChUIC0gQikgLSAyICogcmFkaXVzO1xuICAgICAgICBjb25zdCBhcmNMZW4gPSBNYXRoLlBJICogMC41ICogcmFkaXVzO1xuICAgICAgICBjb25zdCB0b3RhbCA9IHRoaXMucGVyaW1ldGVyKHIpO1xuICAgICAgICBsZXQgZCA9ICh0ICUgMSkgKiB0b3RhbDtcblxuICAgICAgICBpZiAoZCA8IHRvcExlbikge1xuICAgICAgICAgICAgcmV0dXJuIGNjLnYyKEwgKyByYWRpdXMgKyBkLCBUKTtcbiAgICAgICAgfVxuICAgICAgICBkIC09IHRvcExlbjtcblxuICAgICAgICBpZiAoZCA8IGFyY0xlbikge1xuICAgICAgICAgICAgY29uc3QgYW5nID0gTWF0aC5QSSAqIDAuNSAtIChkIC8gYXJjTGVuKSAqIChNYXRoLlBJICogMC41KTtcbiAgICAgICAgICAgIHJldHVybiBjYy52MihcbiAgICAgICAgICAgICAgICAoUiAtIHJhZGl1cykgKyBNYXRoLmNvcyhhbmcpICogcmFkaXVzLFxuICAgICAgICAgICAgICAgIChUIC0gcmFkaXVzKSArIE1hdGguc2luKGFuZykgKiByYWRpdXNcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgZCAtPSBhcmNMZW47XG5cbiAgICAgICAgaWYgKGQgPCBzaWRlTGVuKSB7XG4gICAgICAgICAgICByZXR1cm4gY2MudjIoUiwgVCAtIHJhZGl1cyAtIGQpO1xuICAgICAgICB9XG4gICAgICAgIGQgLT0gc2lkZUxlbjtcblxuICAgICAgICBpZiAoZCA8IGFyY0xlbikge1xuICAgICAgICAgICAgY29uc3QgYW5nID0gMCAtIChkIC8gYXJjTGVuKSAqIChNYXRoLlBJICogMC41KTtcbiAgICAgICAgICAgIHJldHVybiBjYy52MihcbiAgICAgICAgICAgICAgICAoUiAtIHJhZGl1cykgKyBNYXRoLmNvcyhhbmcpICogcmFkaXVzLFxuICAgICAgICAgICAgICAgIChCICsgcmFkaXVzKSArIE1hdGguc2luKGFuZykgKiByYWRpdXNcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgZCAtPSBhcmNMZW47XG5cbiAgICAgICAgaWYgKGQgPCB0b3BMZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBjYy52MihSIC0gcmFkaXVzIC0gZCwgQik7XG4gICAgICAgIH1cbiAgICAgICAgZCAtPSB0b3BMZW47XG5cbiAgICAgICAgaWYgKGQgPCBhcmNMZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IGFuZyA9IC1NYXRoLlBJICogMC41IC0gKGQgLyBhcmNMZW4pICogKE1hdGguUEkgKiAwLjUpO1xuICAgICAgICAgICAgcmV0dXJuIGNjLnYyKFxuICAgICAgICAgICAgICAgIChMICsgcmFkaXVzKSArIE1hdGguY29zKGFuZykgKiByYWRpdXMsXG4gICAgICAgICAgICAgICAgKEIgKyByYWRpdXMpICsgTWF0aC5zaW4oYW5nKSAqIHJhZGl1c1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBkIC09IGFyY0xlbjtcblxuICAgICAgICBpZiAoZCA8IHNpZGVMZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBjYy52MihMLCBCICsgcmFkaXVzICsgZCk7XG4gICAgICAgIH1cbiAgICAgICAgZCAtPSBzaWRlTGVuO1xuXG4gICAgICAgIGNvbnN0IGFuZyA9IE1hdGguUEkgLSAoZCAvIGFyY0xlbikgKiAoTWF0aC5QSSAqIDAuNSk7XG4gICAgICAgIHJldHVybiBjYy52MihcbiAgICAgICAgICAgIChMICsgcmFkaXVzKSArIE1hdGguY29zKGFuZykgKiByYWRpdXMsXG4gICAgICAgICAgICAoVCAtIHJhZGl1cykgKyBNYXRoLnNpbihhbmcpICogcmFkaXVzXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdHJva2VTZWdtZW50KFxuICAgICAgICBnOiBjYy5HcmFwaGljcyxcbiAgICAgICAgcjogbnVtYmVyLFxuICAgICAgICBzdGFydFQ6IG51bWJlcixcbiAgICAgICAgbGVuRnJhYzogbnVtYmVyXG4gICAgKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHN0ZXBzID0gMzY7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHN0ZXBzOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHQgPSAoc3RhcnRUICsgbGVuRnJhYyAqIChpIC8gc3RlcHMpKSAlIDE7XG4gICAgICAgICAgICBjb25zdCBwID0gdGhpcy5wb2ludE9uUm91bmRSZWN0KHQsIHIpO1xuICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBnLm1vdmVUbyhwLngsIHAueSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGcubGluZVRvKHAueCwgcC55KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBnLnN0cm9rZSgpO1xuICAgIH1cbn1cbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/ui/ShowAllLayout.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '7f38coz8rlDtJuaQr1qtR/i', 'ShowAllLayout');
// script/ui/ShowAllLayout.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.layoutShowAllCover = void 0;
var is_valid_1 = require("../is-valid");
/** 与 Canvas 上 bg 相同：按 SHOW_ALL 策略 cover 铺满可视区域 */
function layoutShowAllCover(node, canvas) {
    if (!node || !is_valid_1.isValid(node) || !canvas || !is_valid_1.isValid(canvas)) {
        return;
    }
    node.setPosition(0, 0);
    var scaleForShowAll = Math.min(cc.view.getCanvasSize().width / canvas.width, cc.view.getCanvasSize().height / canvas.height);
    var realWidth = node.width * scaleForShowAll;
    var realHeight = node.height * scaleForShowAll;
    node.scale = Math.max(cc.view.getCanvasSize().width / realWidth, cc.view.getCanvasSize().height / realHeight);
}
exports.layoutShowAllCover = layoutShowAllCover;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvdWkvU2hvd0FsbExheW91dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx3Q0FBc0M7QUFFdEMsa0RBQWtEO0FBQ2xELFNBQWdCLGtCQUFrQixDQUFDLElBQWEsRUFBRSxNQUFlO0lBQzdELElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxrQkFBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsa0JBQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUN4RCxPQUFPO0tBQ1Y7SUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN2QixJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUM1QixFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxFQUM1QyxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUNqRCxDQUFDO0lBQ0YsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxlQUFlLENBQUM7SUFDL0MsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUM7SUFDakQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUNqQixFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLEtBQUssR0FBRyxTQUFTLEVBQ3pDLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FDOUMsQ0FBQztBQUNOLENBQUM7QUFmRCxnREFlQyIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzVmFsaWQgfSBmcm9tICcuLi9pcy12YWxpZCc7XG5cbi8qKiDkuI4gQ2FudmFzIOS4iiBiZyDnm7jlkIzvvJrmjIkgU0hPV19BTEwg562W55WlIGNvdmVyIOmTuua7oeWPr+inhuWMuuWfnyAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxheW91dFNob3dBbGxDb3Zlcihub2RlOiBjYy5Ob2RlLCBjYW52YXM6IGNjLk5vZGUpOiB2b2lkIHtcbiAgICBpZiAoIW5vZGUgfHwgIWlzVmFsaWQobm9kZSkgfHwgIWNhbnZhcyB8fCAhaXNWYWxpZChjYW52YXMpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbm9kZS5zZXRQb3NpdGlvbigwLCAwKTtcbiAgICBjb25zdCBzY2FsZUZvclNob3dBbGwgPSBNYXRoLm1pbihcbiAgICAgICAgY2Mudmlldy5nZXRDYW52YXNTaXplKCkud2lkdGggLyBjYW52YXMud2lkdGgsXG4gICAgICAgIGNjLnZpZXcuZ2V0Q2FudmFzU2l6ZSgpLmhlaWdodCAvIGNhbnZhcy5oZWlnaHRcbiAgICApO1xuICAgIGNvbnN0IHJlYWxXaWR0aCA9IG5vZGUud2lkdGggKiBzY2FsZUZvclNob3dBbGw7XG4gICAgY29uc3QgcmVhbEhlaWdodCA9IG5vZGUuaGVpZ2h0ICogc2NhbGVGb3JTaG93QWxsO1xuICAgIG5vZGUuc2NhbGUgPSBNYXRoLm1heChcbiAgICAgICAgY2Mudmlldy5nZXRDYW52YXNTaXplKCkud2lkdGggLyByZWFsV2lkdGgsXG4gICAgICAgIGNjLnZpZXcuZ2V0Q2FudmFzU2l6ZSgpLmhlaWdodCAvIHJlYWxIZWlnaHRcbiAgICApO1xufVxuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/core/LevelSolver.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '1cf1dCqtX1Gq61Sm1smkd4s', 'LevelSolver');
// script/core/LevelSolver.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSolvableKeys = void 0;
var TileModel_1 = require("../model/TileModel");
var BoardRule_1 = require("./BoardRule");
function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
}
function shuffleIndices(arr) {
    var list = arr;
    for (var i = list.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = list[i];
        list[i] = list[j];
        list[j] = tmp;
    }
}
function makeTempTile(id, slot, key) {
    return {
        id: id,
        key: key,
        kind: TileModel_1.getTileKind(key),
        layer: slot.layer,
        x: slot.x,
        y: slot.y,
        removed: false,
        free: true,
        covered: false,
        node: null,
    };
}
function collectFreeIndices(cfg, keys, placed) {
    var list = [];
    for (var i = 0; i < cfg.slots.length; i++) {
        if (keys[i])
            continue;
        var probe = makeTempTile(i, cfg.slots[i], 'w1');
        if (BoardRule_1.isFree(probe, placed, cfg))
            list.push(i);
    }
    return list;
}
function sortFreeByLayerDesc(indices, cfg) {
    indices.sort(function (a, b) { return cfg.slots[b].layer - cfg.slots[a].layer; });
}
/** 反向构造：每步尝试所有可放对子，回溯保证能放满 */
function tryBuildKeys(cfg, keys, placed, pool, poolIndex, nodes, nodeLimit) {
    if (poolIndex >= pool.length)
        return true;
    if (nodes.n++ > nodeLimit)
        return false;
    var freeIndices = collectFreeIndices(cfg, keys, placed);
    if (freeIndices.length < 2)
        return false;
    sortFreeByLayerDesc(freeIndices, cfg);
    var pairs = [];
    for (var a = 0; a < freeIndices.length; a++) {
        for (var b = a + 1; b < freeIndices.length; b++) {
            pairs.push([freeIndices[a], freeIndices[b]]);
        }
    }
    shuffleIndices(pairs);
    var tryPairs = pairs.length > 48 ? pairs.slice(0, 48) : pairs;
    var key = pool[poolIndex];
    for (var pi = 0; pi < tryPairs.length; pi++) {
        var i1 = tryPairs[pi][0];
        var i2 = tryPairs[pi][1];
        keys[i1] = key;
        keys[i2] = key;
        placed.push(makeTempTile(i1, cfg.slots[i1], key));
        placed.push(makeTempTile(i2, cfg.slots[i2], key));
        if (tryBuildKeys(cfg, keys, placed, pool, poolIndex + 1, nodes, nodeLimit)) {
            return true;
        }
        keys[i1] = null;
        keys[i2] = null;
        placed.pop();
        placed.pop();
    }
    return false;
}
/**
 * 反向构造可解牌面（保证存在一条按自由牌顺序的消牌路径）
 */
function generateSolvableKeys(cfg) {
    var slotCount = cfg.slots.length;
    var pairCount = Math.floor(slotCount / 2);
    if (pairCount * 2 !== slotCount)
        return null;
    var nodeLimit = Math.max(500000, pairCount * pairCount * 8000);
    for (var attempt = 0; attempt < 80; attempt++) {
        var keys = new Array(slotCount);
        for (var i = 0; i < slotCount; i++)
            keys[i] = null;
        var placed = [];
        var pool = [];
        for (var i = 0; i < pairCount; i++) {
            pool.push(cfg.keyPool[i % cfg.keyPool.length]);
        }
        shuffleArray(pool);
        var nodes = { n: 0 };
        if (tryBuildKeys(cfg, keys, placed, pool, 0, nodes, nodeLimit)) {
            var result = new Array(slotCount);
            for (var i = 0; i < slotCount; i++)
                result[i] = keys[i];
            return result;
        }
    }
    return null;
}
exports.generateSolvableKeys = generateSolvableKeys;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvY29yZS9MZXZlbFNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBNEQ7QUFFNUQseUNBQXFDO0FBRXJDLFNBQVMsWUFBWSxDQUFDLEdBQWE7SUFDL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3JDLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUMsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25CLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztLQUNoQjtBQUNMLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxHQUEwQjtJQUM5QyxJQUFNLElBQUksR0FBRyxHQUFpQixDQUFDO0lBQy9CLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN0QyxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlDLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7S0FD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QUFLLEVBQUUsU0FBUyxDQUFDLEVBQUU7WUFDNUQsSUFBTSxNQUFNLEdBQWEsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDOUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLEVBQUU7Z0JBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQVcsQ0FBQztZQUNsRSxPQUFPLE1BQU0sQ0FBQztTQUNqQjtLQUNKO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQztBQTFCRCxvREEwQkMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUaWxlTW9kZWwsIGdldFRpbGVLaW5kIH0gZnJvbSAnLi4vbW9kZWwvVGlsZU1vZGVsJztcbmltcG9ydCB7IExldmVsQ29uZmlnLCBMZXZlbFNsb3QgfSBmcm9tICcuLi9tb2RlbC9MZXZlbENvbmZpZyc7XG5pbXBvcnQgeyBpc0ZyZWUgfSBmcm9tICcuL0JvYXJkUnVsZSc7XG5cbmZ1bmN0aW9uIHNodWZmbGVBcnJheShhcnI6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IGFyci5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgICAgY29uc3QgdG1wID0gYXJyW2ldO1xuICAgICAgICBhcnJbaV0gPSBhcnJbal07XG4gICAgICAgIGFycltqXSA9IHRtcDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNodWZmbGVJbmRpY2VzKGFycjogbnVtYmVyW11bXSB8IG51bWJlcltdKTogdm9pZCB7XG4gICAgY29uc3QgbGlzdCA9IGFyciBhcyBudW1iZXJbXVtdO1xuICAgIGZvciAobGV0IGkgPSBsaXN0Lmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgY29uc3QgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgICAgICBjb25zdCB0bXAgPSBsaXN0W2ldO1xuICAgICAgICBsaXN0W2ldID0gbGlzdFtqXTtcbiAgICAgICAgbGlzdFtqXSA9IHRtcDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1ha2VUZW1wVGlsZShpZDogbnVtYmVyLCBzbG90OiBMZXZlbFNsb3QsIGtleTogc3RyaW5nKTogVGlsZU1vZGVsIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBpZDogaWQsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBraW5kOiBnZXRUaWxlS2luZChrZXkpLFxuICAgICAgICBsYXllcjogc2xvdC5sYXllcixcbiAgICAgICAgeDogc2xvdC54LFxuICAgICAgICB5OiBzbG90LnksXG4gICAgICAgIHJlbW92ZWQ6IGZhbHNlLFxuICAgICAgICBmcmVlOiB0cnVlLFxuICAgICAgICBjb3ZlcmVkOiBmYWxzZSxcbiAgICAgICAgbm9kZTogbnVsbCxcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBjb2xsZWN0RnJlZUluZGljZXMoXG4gICAgY2ZnOiBMZXZlbENvbmZpZyxcbiAgICBrZXlzOiAoc3RyaW5nIHwgbnVsbClbXSxcbiAgICBwbGFjZWQ6IFRpbGVNb2RlbFtdXG4pOiBudW1iZXJbXSB7XG4gICAgY29uc3QgbGlzdDogbnVtYmVyW10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNmZy5zbG90cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoa2V5c1tpXSkgY29udGludWU7XG4gICAgICAgIGNvbnN0IHByb2JlID0gbWFrZVRlbXBUaWxlKGksIGNmZy5zbG90c1tpXSwgJ3cxJyk7XG4gICAgICAgIGlmIChpc0ZyZWUocHJvYmUsIHBsYWNlZCwgY2ZnKSkgbGlzdC5wdXNoKGkpO1xuICAgIH1cbiAgICByZXR1cm4gbGlzdDtcbn1cblxuZnVuY3Rpb24gc29ydEZyZWVCeUxheWVyRGVzYyhpbmRpY2VzOiBudW1iZXJbXSwgY2ZnOiBMZXZlbENvbmZpZyk6IHZvaWQge1xuICAgIGluZGljZXMuc29ydCgoYSwgYikgPT4gY2ZnLnNsb3RzW2JdLmxheWVyIC0gY2ZnLnNsb3RzW2FdLmxheWVyKTtcbn1cblxuLyoqIOWPjeWQkeaehOmAoO+8muavj+atpeWwneivleaJgOacieWPr+aUvuWvueWtkO+8jOWbnua6r+S/neivgeiDveaUvua7oSAqL1xuZnVuY3Rpb24gdHJ5QnVpbGRLZXlzKFxuICAgIGNmZzogTGV2ZWxDb25maWcsXG4gICAga2V5czogKHN0cmluZyB8IG51bGwpW10sXG4gICAgcGxhY2VkOiBUaWxlTW9kZWxbXSxcbiAgICBwb29sOiBzdHJpbmdbXSxcbiAgICBwb29sSW5kZXg6IG51bWJlcixcbiAgICBub2RlczogeyBuOiBudW1iZXIgfSxcbiAgICBub2RlTGltaXQ6IG51bWJlclxuKTogYm9vbGVhbiB7XG4gICAgaWYgKHBvb2xJbmRleCA+PSBwb29sLmxlbmd0aCkgcmV0dXJuIHRydWU7XG4gICAgaWYgKG5vZGVzLm4rKyA+IG5vZGVMaW1pdCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgY29uc3QgZnJlZUluZGljZXMgPSBjb2xsZWN0RnJlZUluZGljZXMoY2ZnLCBrZXlzLCBwbGFjZWQpO1xuICAgIGlmIChmcmVlSW5kaWNlcy5sZW5ndGggPCAyKSByZXR1cm4gZmFsc2U7XG4gICAgc29ydEZyZWVCeUxheWVyRGVzYyhmcmVlSW5kaWNlcywgY2ZnKTtcblxuICAgIGNvbnN0IHBhaXJzOiBudW1iZXJbXVtdID0gW107XG4gICAgZm9yIChsZXQgYSA9IDA7IGEgPCBmcmVlSW5kaWNlcy5sZW5ndGg7IGErKykge1xuICAgICAgICBmb3IgKGxldCBiID0gYSArIDE7IGIgPCBmcmVlSW5kaWNlcy5sZW5ndGg7IGIrKykge1xuICAgICAgICAgICAgcGFpcnMucHVzaChbZnJlZUluZGljZXNbYV0sIGZyZWVJbmRpY2VzW2JdXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2h1ZmZsZUluZGljZXMocGFpcnMpO1xuICAgIGNvbnN0IHRyeVBhaXJzID0gcGFpcnMubGVuZ3RoID4gNDggPyBwYWlycy5zbGljZSgwLCA0OCkgOiBwYWlycztcblxuICAgIGNvbnN0IGtleSA9IHBvb2xbcG9vbEluZGV4XTtcbiAgICBmb3IgKGxldCBwaSA9IDA7IHBpIDwgdHJ5UGFpcnMubGVuZ3RoOyBwaSsrKSB7XG4gICAgICAgIGNvbnN0IGkxID0gdHJ5UGFpcnNbcGldWzBdO1xuICAgICAgICBjb25zdCBpMiA9IHRyeVBhaXJzW3BpXVsxXTtcbiAgICAgICAga2V5c1tpMV0gPSBrZXk7XG4gICAgICAgIGtleXNbaTJdID0ga2V5O1xuICAgICAgICBwbGFjZWQucHVzaChtYWtlVGVtcFRpbGUoaTEsIGNmZy5zbG90c1tpMV0sIGtleSkpO1xuICAgICAgICBwbGFjZWQucHVzaChtYWtlVGVtcFRpbGUoaTIsIGNmZy5zbG90c1tpMl0sIGtleSkpO1xuXG4gICAgICAgIGlmICh0cnlCdWlsZEtleXMoY2ZnLCBrZXlzLCBwbGFjZWQsIHBvb2wsIHBvb2xJbmRleCArIDEsIG5vZGVzLCBub2RlTGltaXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGtleXNbaTFdID0gbnVsbDtcbiAgICAgICAga2V5c1tpMl0gPSBudWxsO1xuICAgICAgICBwbGFjZWQucG9wKCk7XG4gICAgICAgIHBsYWNlZC5wb3AoKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIOWPjeWQkeaehOmAoOWPr+ino+eJjOmdou+8iOS/neivgeWtmOWcqOS4gOadoeaMieiHqueUseeJjOmhuuW6j+eahOa2iOeJjOi3r+W+hO+8iVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVTb2x2YWJsZUtleXMoY2ZnOiBMZXZlbENvbmZpZyk6IHN0cmluZ1tdIHwgbnVsbCB7XG4gICAgY29uc3Qgc2xvdENvdW50ID0gY2ZnLnNsb3RzLmxlbmd0aDtcbiAgICBjb25zdCBwYWlyQ291bnQgPSBNYXRoLmZsb29yKHNsb3RDb3VudCAvIDIpO1xuICAgIGlmIChwYWlyQ291bnQgKiAyICE9PSBzbG90Q291bnQpIHJldHVybiBudWxsO1xuXG4gICAgY29uc3Qgbm9kZUxpbWl0ID0gTWF0aC5tYXgoNTAwMDAwLCBwYWlyQ291bnQgKiBwYWlyQ291bnQgKiA4MDAwKTtcblxuICAgIGZvciAobGV0IGF0dGVtcHQgPSAwOyBhdHRlbXB0IDwgODA7IGF0dGVtcHQrKykge1xuICAgICAgICBjb25zdCBrZXlzOiAoc3RyaW5nIHwgbnVsbClbXSA9IG5ldyBBcnJheShzbG90Q291bnQpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsb3RDb3VudDsgaSsrKSBrZXlzW2ldID0gbnVsbDtcbiAgICAgICAgY29uc3QgcGxhY2VkOiBUaWxlTW9kZWxbXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0IHBvb2w6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFpckNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIHBvb2wucHVzaChjZmcua2V5UG9vbFtpICUgY2ZnLmtleVBvb2wubGVuZ3RoXSk7XG4gICAgICAgIH1cbiAgICAgICAgc2h1ZmZsZUFycmF5KHBvb2wpO1xuXG4gICAgICAgIGNvbnN0IG5vZGVzID0geyBuOiAwIH07XG4gICAgICAgIGlmICh0cnlCdWlsZEtleXMoY2ZnLCBrZXlzLCBwbGFjZWQsIHBvb2wsIDAsIG5vZGVzLCBub2RlTGltaXQpKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQ6IHN0cmluZ1tdID0gbmV3IEFycmF5KHNsb3RDb3VudCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNsb3RDb3VudDsgaSsrKSByZXN1bHRbaV0gPSBrZXlzW2ldIGFzIHN0cmluZztcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/core/BoardRule.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '4d311k7/upBqramajkt9VxE', 'BoardRule');
// script/core/BoardRule.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTileStates = exports.isFullyExposed = exports.isFree = exports.getCoveringTiles = exports.isBothSidesBlocked = exports.getSideNeighbor = exports.hasSideBlock = exports.isCovered = exports.isCoveredByNodes = exports.isCoveredByPosition = exports.tilesOverlap = void 0;
var is_valid_1 = require("../is-valid");
function rectsOverlap(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
/** 仅不同层之间才算上下遮挡（同层绝不重叠） */
function tilesOverlap(a, b, cfg) {
    if (a.id === b.id || a.layer === b.layer)
        return false;
    var dx = Math.abs(a.x - b.x);
    var dy = Math.abs(a.y - b.y);
    var ox = cfg.overlapX > 0 ? cfg.overlapX : cfg.tileW * 0.5;
    var oy = cfg.overlapY > 0 ? cfg.overlapY : cfg.tileH * 0.5;
    return dx < ox && dy < oy;
}
exports.tilesOverlap = tilesOverlap;
/** 关卡求解等无节点时：按布局坐标判断上层是否重合 */
function isCoveredByPosition(tile, board, cfg) {
    for (var i = 0; i < board.length; i++) {
        var other = board[i];
        if (other.removed || other.id === tile.id)
            continue;
        if (other.layer <= tile.layer)
            continue;
        if (tilesOverlap(tile, other, cfg))
            return true;
    }
    return false;
}
exports.isCoveredByPosition = isCoveredByPosition;
/** 有节点时：按世界坐标包围盒判断上层是否与该牌有面积重叠 */
function isCoveredByNodes(tile, board) {
    if (!tile.node || !is_valid_1.isValid(tile.node))
        return false;
    var box = tile.node.getBoundingBoxToWorld();
    for (var i = 0; i < board.length; i++) {
        var other = board[i];
        if (other.removed || other.id === tile.id)
            continue;
        if (other.layer <= tile.layer)
            continue;
        if (!other.node || !is_valid_1.isValid(other.node))
            continue;
        var otherBox = other.node.getBoundingBoxToWorld();
        if (rectsOverlap(box, otherBox))
            return true;
    }
    return false;
}
exports.isCoveredByNodes = isCoveredByNodes;
/** 运行时用坐标判定遮挡，避免 48 张牌反复 getBoundingBoxToWorld 卡死 */
function isCovered(tile, board, cfg) {
    if (tile.removed)
        return false;
    return isCoveredByPosition(tile, board, cfg);
}
exports.isCovered = isCovered;
/** 同一行：纵向偏差小于半张牌高 */
function isSameRow(a, b, cfg) {
    return Math.abs(a.y - b.y) < cfg.tileH * 0.35;
}
function isHorizontalNeighbor(tile, other, cfg) {
    if (tile.layer !== other.layer)
        return false;
    if (!isSameRow(tile, other, cfg))
        return false;
    var dx = Math.abs(tile.x - other.x);
    var minGap = cfg.tileW * 0.85;
    var maxGap = cfg.tileW * 1.15;
    return dx >= minGap && dx <= maxGap;
}
function hasSideBlock(tile, board, side, cfg) {
    return getSideNeighbor(tile, board, side, cfg) !== null;
}
exports.hasSideBlock = hasSideBlock;
/** 同层左右紧邻挡牌（取距离最近的一张） */
function getSideNeighbor(tile, board, side, cfg) {
    var best = null;
    var bestDx = Infinity;
    for (var i = 0; i < board.length; i++) {
        var other = board[i];
        if (other.removed || other.id === tile.id)
            continue;
        if (!isHorizontalNeighbor(tile, other, cfg))
            continue;
        if (side === 'left' && other.x >= tile.x)
            continue;
        if (side === 'right' && other.x <= tile.x)
            continue;
        var dx = Math.abs(other.x - tile.x);
        if (dx < bestDx) {
            bestDx = dx;
            best = other;
        }
    }
    return best;
}
exports.getSideNeighbor = getSideNeighbor;
function isBothSidesBlocked(tile, board, cfg) {
    return (getSideNeighbor(tile, board, 'left', cfg) !== null &&
        getSideNeighbor(tile, board, 'right', cfg) !== null);
}
exports.isBothSidesBlocked = isBothSidesBlocked;
/** 压在该牌上的所有上层牌 */
function getCoveringTiles(tile, board, cfg) {
    var list = [];
    for (var i = 0; i < board.length; i++) {
        var other = board[i];
        if (other.removed || other.id === tile.id)
            continue;
        if (other.layer <= tile.layer)
            continue;
        if (tilesOverlap(tile, other, cfg))
            list.push(other);
    }
    return list;
}
exports.getCoveringTiles = getCoveringTiles;
function isFree(tile, board, cfg) {
    if (tile.removed)
        return false;
    if (isCovered(tile, board, cfg))
        return false;
    var leftBlocked = hasSideBlock(tile, board, 'left', cfg);
    var rightBlocked = hasSideBlock(tile, board, 'right', cfg);
    return !leftBlocked || !rightBlocked;
}
exports.isFree = isFree;
function isFullyExposed(tile, board, cfg) {
    if (tile.removed)
        return false;
    if (isCovered(tile, board, cfg))
        return false;
    if (hasSideBlock(tile, board, 'left', cfg))
        return false;
    if (hasSideBlock(tile, board, 'right', cfg))
        return false;
    return true;
}
exports.isFullyExposed = isFullyExposed;
function refreshTileStates(board, cfg) {
    for (var i = 0; i < board.length; i++) {
        var tile = board[i];
        if (tile.removed) {
            tile.covered = false;
            tile.free = false;
            continue;
        }
        tile.covered = isCovered(tile, board, cfg);
        tile.free = isFree(tile, board, cfg);
    }
}
exports.refreshTileStates = refreshTileStates;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvY29yZS9Cb2FyZFJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsd0NBQXNDO0FBSXRDLFNBQVMsWUFBWSxDQUFDLENBQVUsRUFBRSxDQUFVO0lBQ3hDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLO1FBQ3RCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNuQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU07UUFDcEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsQ0FBQztBQUVELDJCQUEyQjtBQUMzQixTQUFnQixZQUFZLENBQUMsQ0FBWSxFQUFFLENBQVksRUFBRSxHQUFnQjtJQUNyRSxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxLQUFLO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFDdkQsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CLElBQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztJQUM3RCxJQUFNLEVBQUUsR0FBRyxHQUFHLENB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Q0FBQztBQUNoQixDQUFDO0FBTkQsd0NBTUM7QUFFRCxTQUFnQixpQkFBaUIsQ0FBQyxLQUFrQixFQUFFLEdBQWdCO0lBQ2xFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ25DLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDZCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztZQUNsQixTQUFTO1NBQ1o7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDeEM7QUFDTCxDQUFDO0FBWEQsOENBV0MiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc1ZhbGlkIH0gZnJvbSAnLi4vaXMtdmFsaWQnO1xuaW1wb3J0IHsgVGlsZU1vZGVsIH0gZnJvbSAnLi4vbW9kZWwvVGlsZU1vZGVsJztcbmltcG9ydCB7IExldmVsQ29uZmlnIH0gZnJvbSAnLi4vbW9kZWwvTGV2ZWxDb25maWcnO1xuXG5mdW5jdGlvbiByZWN0c092ZXJsYXAoYTogY2MuUmVjdCwgYjogY2MuUmVjdCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBhLnggPCBiLnggKyBiLndpZHRoICYmXG4gICAgICAgIGEueCArIGEud2lkdGggPiBiLnggJiZcbiAgICAgICAgYS55IDwgYi55ICsgYi5oZWlnaHQgJiZcbiAgICAgICAgYS55ICsgYS5oZWlnaHQgPiBiLnk7XG59XG5cbi8qKiDku4XkuI3lkIzlsYLkuYvpl7TmiY3nrpfkuIrkuIvpga7mjKHvvIjlkIzlsYLnu53kuI3ph43lj6DvvIkgKi9cbmV4cG9ydCBmdW5jdGlvbiB0aWxlc092ZXJsYXAoYTogVGlsZU1vZGVsLCBiOiBUaWxlTW9kZWwsIGNmZzogTGV2ZWxDb25maWcpOiBib29sZWFuIHtcbiAgICBpZiAoYS5pZCA9PT0gYi5pZCB8fCBhLmxheWVyID09PSBiLmxheWVyKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgZHggPSBNYXRoLmFicyhhLnggLSBiLngpO1xuICAgIGNvbnN0IGR5ID0gTWF0aC5hYnMoYS55IC0gYi55KTtcbiAgICBjb25zdCBveCA9IGNmZy5vdmVybGFwWCA+IDAgPyBjZmcub3ZlcmxhcFggOiBjZmcudGlsZVcgKiAwLjU7XG4gICAgY29uc3Qgb3kgPSBjZmcub3ZlcmxhcFkgPiAwID8gY2ZnLm92ZXJsYXBZIDogY2ZnLnRpbGVIICogMC41O1xuICAgIHJldHVybiBkeCA8IG94ICYmIGR5IDwgb3k7XG59XG5cbi8qKiDlhbPljaHmsYLop6PnrYnml6DoioLngrnml7bvvJrmjInluIPlsYDlnZDmoIfliKTmlq3kuIrlsYLmmK/lkKbph43lkIggKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0NvdmVyZWRCeVBvc2l0aW9uKHRpbGU6IFRpbGVNb2RlbCwgYm9hcmQ6IFRpbGVNb2RlbFtdLCBjZmc6IExldmVsQ29uZmlnKTogYm9vbGVhbiB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBib2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBvdGhlciA9IGJvYXJkW2ldO1xuICAgICAgICBpZiAob3RoZXIucmVtb3ZlZCB8fCBvdGhlci5pZCA9PT0gdGlsZS5pZCkgY29udGludWU7XG4gICAgICAgIGlmIChvdGhlci5sYXllciA8PSB0aWxlLmxheWVyKSBjb250aW51ZTtcbiAgICAgICAgaWYgKHRpbGVzT3ZlcmxhcCh0aWxlLCBvdGhlciwgY2ZnKSkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqIOacieiKgueCueaXtu+8muaMieS4lueVjOWdkOagh+WMheWbtOebkuWIpOaWreS4iuWxguaYr+WQpuS4juivpeeJjOaciemdouenr+mHjeWPoCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQ292ZXJlZEJ5Tm9kZXModGlsZTogVGlsZU1vZGVsLCBib2FyZDogVGlsZU1vZGVsW10pOiBib29sZWFuIHtcbiAgICBpZiAoIXRpbGUubm9kZSB8fCAhaXNWYWxpZCh0aWxlLm5vZGUpKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgYm94ID0gdGlsZS5ub2RlLmdldEJvdW5kaW5nQm94VG9Xb3JsZCgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgb3RoZXIgPSBib2FyZFtpXTtcbiAgICAgICAgaWYgKG90aGVyLnJlbW92ZWQgfHwgb3RoZXIuaWQgPT09IHRpbGUuaWQpIGNvbnRpbnVlO1xuICAgICAgICBpZiAob3RoZXIubGF5ZXIgPD0gdGlsZS5sYXllcikgY29udGludWU7XG4gICAgICAgIGlmICghb3RoZXIubm9kZSB8fCAhaXNWYWxpZChvdGhlci5ub2RlKSkgY29udGludWU7XG4gICAgICAgIGNvbnN0IG90aGVyQm94ID0gb3RoZXIubm9kZS5nZXRCb3VuZGluZ0JveFRvV29ybGQoKTtcbiAgICAgICAgaWYgKHJlY3RzT3ZlcmxhcChib3gsIG90aGVyQm94KSkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqIOi/kOihjOaXtueUqOWdkOagh+WIpOWumumBruaMoe+8jOmBv+WFjSA0OCDlvKDniYzlj43lpI0gZ2V0Qm91bmRpbmdCb3hUb1dvcmxkIOWNoeatuyAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQ292ZXJlZCh0aWxlOiBUaWxlTW9kZWwsIGJvYXJkOiBUaWxlTW9kZWxbXSwgY2ZnOiBMZXZlbENvbmZpZyk6IGJvb2xlYW4ge1xuICAgIGlmICh0aWxlLnJlbW92ZWQpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gaXNDb3ZlcmVkQnlQb3NpdGlvbih0aWxlLCBib2FyZCwgY2ZnKTtcbn1cblxuLyoqIOWQjOS4gOihjO+8mue6teWQkeWBj+W3ruWwj+S6juWNiuW8oOeJjOmrmCAqL1xuZnVuY3Rpb24gaXNTYW1lUm93KGE6IFRpbGVNb2RlbCwgYjogVGlsZU1vZGVsLCBjZmc6IExldmVsQ29uZmlnKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIE1hdGguYWJzKGEueSAtIGIueSkgPCBjZmcudGlsZUggKiAwLjM1O1xufVxuXG5mdW5jdGlvbiBpc0hvcml6b250YWxOZWlnaGJvcih0aWxlOiBUaWxlTW9kZWwsIG90aGVyOiBUaWxlTW9kZWwsIGNmZzogTGV2ZWxDb25maWcpOiBib29sZWFuIHtcbiAgICBpZiAodGlsZS5sYXllciAhPT0gb3RoZXIubGF5ZXIpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoIWlzU2FtZVJvdyh0aWxlLCBvdGhlciwgY2ZnKSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGR4ID0gTWF0aC5hYnModGlsZS54IC0gb3RoZXIueCk7XG4gICAgY29uc3QgbWluR2FwID0gY2ZnLnRpbGVXICogMC44NTtcbiAgICBjb25zdCBtYXhHYXAgPSBjZmcudGlsZVcgKiAxLjE1O1xuICAgIHJldHVybiBkeCA+PSBtaW5HYXAgJiYgZHggPD0gbWF4R2FwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzU2lkZUJsb2NrKHRpbGU6IFRpbGVNb2RlbCwgYm9hcmQ6IFRpbGVNb2RlbFtdLCBzaWRlOiAnbGVmdCcgfCAncmlnaHQnLCBjZmc6IExldmVsQ29uZmlnKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGdldFNpZGVOZWlnaGJvcih0aWxlLCBib2FyZCwgc2lkZSwgY2ZnKSAhPT0gbnVsbDtcbn1cblxuLyoqIOWQjOWxguW3puWPs+e0p+mCu+aMoeeJjO+8iOWPlui3neemu+acgOi/keeahOS4gOW8oO+8iSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNpZGVOZWlnaGJvcihcbiAgICB0aWxlOiBUaWxlTW9kZWwsXG4gICAgYm9hcmQ6IFRpbGVNb2RlbFtdLFxuICAgIHNpZGU6ICdsZWZ0JyB8ICdyaWdodCcsXG4gICAgY2ZnOiBMZXZlbENvbmZpZ1xuKTogVGlsZU1vZGVsIHwgbnVsbCB7XG4gICAgbGV0IGJlc3Q6IFRpbGVNb2RlbCA9IG51bGw7XG4gICAgbGV0IGJlc3REeCA9IEluZmluaXR5O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgb3RoZXIgPSBib2FyZFtpXTtcbiAgICAgICAgaWYgKG90aGVyLnJlbW92ZWQgfHwgb3RoZXIuaWQgPT09IHRpbGUuaWQpIGNvbnRpbnVlO1xuICAgICAgICBpZiAoIWlzSG9yaXpvbnRhbE5laWdoYm9yKHRpbGUsIG90aGVyLCBjZmcpKSBjb250aW51ZTtcbiAgICAgICAgaWYgKHNpZGUgPT09ICdsZWZ0JyAmJiBvdGhlci54ID49IHRpbGUueCkgY29udGludWU7XG4gICAgICAgIGlmIChzaWRlID09PSAncmlnaHQnICYmIG90aGVyLnggPD0gdGlsZS54KSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgZHggPSBNYXRoLmFicyhvdGhlci54IC0gdGlsZS54KTtcbiAgICAgICAgaWYgKGR4IDwgYmVzdER4KSB7XG4gICAgICAgICAgICBiZXN0RHggPSBkeDtcbiAgICAgICAgICAgIGJlc3QgPSBvdGhlcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYmVzdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQm90aFNpZGVzQmxvY2tlZCh0aWxlOiBUaWxlTW9kZWwsIGJvYXJkOiBUaWxlTW9kZWxbXSwgY2ZnOiBMZXZlbENvbmZpZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIGdldFNpZGVOZWlnaGJvcih0aWxlLCBib2FyZCwgJ2xlZnQnLCBjZmcpICE9PSBudWxsICYmXG4gICAgICAgIGdldFNpZGVOZWlnaGJvcih0aWxlLCBib2FyZCwgJ3JpZ2h0JywgY2ZnKSAhPT0gbnVsbFxuICAgICk7XG59XG5cbi8qKiDljovlnKjor6XniYzkuIrnmoTmiYDmnInkuIrlsYLniYwgKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb3ZlcmluZ1RpbGVzKHRpbGU6IFRpbGVNb2RlbCwgYm9hcmQ6IFRpbGVNb2RlbFtdLCBjZmc6IExldmVsQ29uZmlnKTogVGlsZU1vZGVsW10ge1xuICAgIGNvbnN0IGxpc3Q6IFRpbGVNb2RlbFtdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBib2FyZC5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBvdGhlciA9IGJvYXJkW2ldO1xuICAgICAgICBpZiAob3RoZXIucmVtb3ZlZCB8fCBvdGhlci5pZCA9PT0gdGlsZS5pZCkgY29udGludWU7XG4gICAgICAgIGlmIChvdGhlci5sYXllciA8PSB0aWxlLmxheWVyKSBjb250aW51ZTtcbiAgICAgICAgaWYgKHRpbGVzT3ZlcmxhcCh0aWxlLCBvdGhlciwgY2ZnKSkgbGlzdC5wdXNoKG90aGVyKTtcbiAgICB9XG4gICAgcmV0dXJuIGxpc3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ZyZWUodGlsZTogVGlsZU1vZGVsLCBib2FyZDogVGlsZU1vZGVsW10sIGNmZzogTGV2ZWxDb25maWcpOiBib29sZWFuIHtcbiAgICBpZiAodGlsZS5yZW1vdmVkKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGlzQ292ZXJlZCh0aWxlLCBib2FyZCwgY2ZnKSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGxlZnRCbG9ja2VkID0gaGFzU2lkZUJsb2NrKHRpbGUsIGJvYXJkLCAnbGVmdCcsIGNmZyk7XG4gICAgY29uc3QgcmlnaHRCbG9ja2VkID0gaGFzU2lkZUJsb2NrKHRpbGUsIGJvYXJkLCAncmlnaHQnLCBjZmcpO1xuICAgIHJldHVybiAhbGVmdEJsb2NrZWQgfHwgIXJpZ2h0QmxvY2tlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRnVsbHlFeHBvc2VkKHRpbGU6IFRpbGVNb2RlbCwgYm9hcmQ6IFRpbGVNb2RlbFtdLCBjZmc6IExldmVsQ29uZmlnKTogYm9vbGVhbiB7XG4gICAgaWYgKHRpbGUucmVtb3ZlZCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChpc0NvdmVyZWQodGlsZSwgYm9hcmQsIGNmZykpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoaGFzU2lkZUJsb2NrKHRpbGUsIGJvYXJkLCAnbGVmdCcsIGNmZykpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoaGFzU2lkZUJsb2NrKHRpbGUsIGJvYXJkLCAncmlnaHQnLCBjZmcpKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWZyZXNoVGlsZVN0YXRlcyhib2FyZDogVGlsZU1vZGVsW10sIGNmZzogTGV2ZWxDb25maWcpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHRpbGUgPSBib2FyZFtpXTtcbiAgICAgICAgaWYgKHRpbGUucmVtb3ZlZCkge1xuICAgICAgICAgICAgdGlsZS5jb3ZlcmVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aWxlLmZyZWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRpbGUuY292ZXJlZCA9IGlzQ292ZXJlZCh0aWxlLCBib2FyZCwgY2ZnKTtcbiAgICAgICAgdGlsZS5mcmVlID0gaXNGcmVlKHRpbGUsIGJvYXJkLCBjZmcpO1xuICAgIH1cbn1cbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/model/TileModelKinds.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '9307bYSusZNQIAHcH5bMjlv', 'TileModelKinds');
// script/model/TileModelKinds.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TileKind = void 0;
var TileKind;
(function (TileKind) {
    TileKind["Suit"] = "suit";
    TileKind["Honor"] = "honor";
    TileKind["Flower"] = "flower";
    TileKind["Season"] = "season";
})(TileKind = exports.TileKind || (exports.TileKind = {}));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvbW9kZWwvVGlsZU1vZGVsS2luZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBWSxRQUtYO0FBTEQsV0FBWSxRQUFRO0lBQ2hCLHlCQUFhLENBQUE7SUFDYiwyQkFBZSxDQUFBO0lBQ2YsNkJBQWlCLENBQUE7SUFDakIsNkJBQWlCLENBQUE7QUFDckIsQ0FBQyxFQUxXLFFBQVEsR0FBUixnQkFBUSxLQUFSLGdCQUFRLFFBS25CIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGVudW0gVGlsZUtpbmQge1xuICAgIFN1aXQgPSAnc3VpdCcsXG4gICAgSG9ub3IgPSAnaG9ub3InLFxuICAgIEZsb3dlciA9ICdmbG93ZXInLFxuICAgIFNlYXNvbiA9ICdzZWFzb24nLFxufVxuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/model/LevelConfig.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'ee629QC9OBEn4KBUx2JDAlb', 'LevelConfig');
// script/model/LevelConfig.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvbW9kZWwvTGV2ZWxDb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgTGV2ZWxTbG90IHtcbiAgICBsYXllcjogbnVtYmVyO1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGV2ZWxDb25maWcge1xuICAgIHRpbGVXOiBudW1iZXI7XG4gICAgdGlsZUg6IG51bWJlcjtcbiAgICBvdmVybGFwWDogbnVtYmVyO1xuICAgIG92ZXJsYXBZOiBudW1iZXI7XG4gICAgLyoqIOmihOWItuS9k+agueiKgueCuee8qeaUvu+8jOS7heS9nOmFjee9ruWkh+azqO+8m+mAu+i+keWwuuWvuOeUqCB0aWxlVy90aWxlSO+8iD0g5Y6f5bC65a+4IMOXIHNjYWxl77yJICovXG4gICAgZGlzcGxheVNjYWxlPzogbnVtYmVyO1xuICAgIGtleVBvb2w6IHN0cmluZ1tdO1xuICAgIC8qKiDkuI4gc2xvdHMg5LiA5LiA5a+55bqU5pe25Y+v5L+d6K+B5Y+v6Kej77yb57y655yB5pe26Ieq5Yqo5rSX54mM55u05Yiw5Y+v6KejICovXG4gICAga2V5cz86IHN0cmluZ1tdO1xuICAgIHNsb3RzOiBMZXZlbFNsb3RbXTtcbn1cbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/ui/LoadingScreen.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '49626hq109HEbkBpp06YFH5', 'LoadingScreen');
// script/ui/LoadingScreen.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingScreen = void 0;
var is_valid_1 = require("../is-valid");
var ShowAllLayout_1 = require("./ShowAllLayout");
var GamePreloadConfig_1 = require("./GamePreloadConfig");
var LOADING_FADE_OUT = 0.18;
/**
 * 全屏加载：遮罩与 bg 同图同缩放，中央圆形转圈。
 */
var LoadingScreen = /** @class */ (function () {
    function LoadingScreen(canvas) {
        this.maskNode = null;
        this.shownAt = 0;
        this.canvas = canvas;
        this.root = new cc.Node('LoadingScreen');
        this.root.zIndex = GamePreloadConfig_1.Z_ORDER.LOADING;
        this.root.opacity = 255;
        var spin = new cc.Node('Spinner');
        var spinG = spin.addComponent(cc.Graphics);
        spinG.strokeColor = cc.color(255, 210, 90, 220);
        spinG.lineWidth = 5;
        spinG.arc(0, 0, 32, 0.15 * Math.PI, 1.65 * Math.PI);
        spinG.stroke();
        this.root.addChild(spin);
        spin.runAction(cc.repeatForever(cc.rotateBy(1.1, 360)));
    }
    LoadingScreen.prototype.show = function (parent) {
        if (!parent || !is_valid_1.isValid(parent)) {
            return;
        }
        this.shownAt = Date.now();
        this.ensureMask();
        this.layout();
        this.root.stopAllActions();
        this.root.opacity = 255;
        if (this.root.parent !== parent) {
            this.root.removeFromParent(false);
            parent.addChild(this.root);
        }
        this.root.active = true;
    };
    /** 窗口变化时与 bg 一起重新铺满 */
    LoadingScreen.prototype.layout = function () {
        if (this.maskNode && is_valid_1.isValid(this.maskNode)) {
            ShowAllLayout_1.layoutShowAllCover(this.maskNode, this.canvas);
        }
    };
    LoadingScreen.prototype.hide = function (onDone) {
        var _this = this;
        var elapsed = (Date.now() - this.shownAt) / 1000;
        var wait = Math.max(0, GamePreloadConfig_1.LOADING_MIN_VISIBLE_SEC - elapsed);
        this.root.stopAllActions();
        this.root.runAction(cc.sequence(cc.delayTime(wait), cc.fadeOut(LOADING_FADE_OUT), cc.callFunc(function () {
            if (_this.root && is_valid_1.isValid(_this.root)) {
                _this.root.active = false;
                _this.root.opacity = 255;
            }
            if (onDone) {
                onDone();
            }
        })));
    };
    LoadingScreen.prototype.ensureMask = function () {
        if (this.maskNode && is_valid_1.isValid(this.maskNode)) {
            return;
        }
        var bg = this.canvas.getChildByName('bg');
        if (!bg || !is_valid_1.isValid(bg)) {
            return;
        }
        var bgSprite = bg.getComponent(cc.Sprite);
        if (!bgSprite || !bgSprite.spriteFrame) {
            return;
        }
        this.maskNode = new cc.Node('LoadingMask');
        this.maskNode.setAnchorPoint(0.5, 0.5);
        var maskSprite = this.maskNode.addComponent(cc.Sprite);
        maskSprite.spriteFrame = bgSprite.spriteFrame;
        maskSprite.sizeMode = bgSprite.sizeMode;
        maskSprite.type = bgSprite.type;
        this.root.addChild(this.maskNode);
        this.maskNode.setSiblingIndex(0);
    };
    return LoadingScreen;
}());
exports.LoadingScreen = LoadingScreen;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvdWkvTG9hZGluZ1NjcmVlbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx3Q0FBc0M7QUFDdEMsaURBQXFEO0FBQ3JELHlEQUF1RTtBQUV2RSxJQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQztBQUU5Qjs7R0FFRztBQUNIO0lBTUksdUJBQVksTUFBZTtRQUhuQixhQUFRLEdBQVksSUFBSSxDQUFDO1FBQ3pCLFlBQU8sR0FBRyxDQUFDLENBQUM7UUFHaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsMkJBQU8sQ0FBQyxPQUFPLENBQUM7UUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBRXhCLElBQU0sSUFBSSxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNwQyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3QyxLQUFLLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDaEQsS0FBSyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDcEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BELEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxD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UUFBUSxDQUFDLFdBQVcsRUFBRTtZQUNwQyxPQUFPO1NBQ1Y7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdkMsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pELFVBQVUsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztRQUM5QyxVQUFVLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7UUFDeEMsVUFBVSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ0wsb0JBQUM7QUFBRCxDQXRGQSxBQXNGQyxJQUFBO0FBdEZZLHNDQUFhIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNWYWxpZCB9IGZyb20gJy4uL2lzLXZhbGlkJztcbmltcG9ydCB7IGxheW91dFNob3dBbGxDb3ZlciB9IGZyb20gJy4vU2hvd0FsbExheW91dCc7XG5pbXBvcnQgeyBMT0FESU5HX01JTl9WSVNJQkxFX1NFQywgWl9PUkRFUiB9IGZyb20gJy4vR2FtZVByZWxvYWRDb25maWcnO1xuXG5jb25zdCBMT0FESU5HX0ZBREVfT1VUID0gMC4xODtcblxuLyoqXG4gKiDlhajlsY/liqDovb3vvJrpga7nvankuI4gYmcg5ZCM5Zu+5ZCM57yp5pS+77yM5Lit5aSu5ZyG5b2i6L2s5ZyI44CCXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2FkaW5nU2NyZWVuIHtcbiAgICByZWFkb25seSByb290OiBjYy5Ob2RlO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgY2FudmFzOiBjYy5Ob2RlO1xuICAgIHByaXZhdGUgbWFza05vZGU6IGNjLk5vZGUgPSBudWxsO1xuICAgIHByaXZhdGUgc2hvd25BdCA9IDA7XG5cbiAgICBjb25zdHJ1Y3RvcihjYW52YXM6IGNjLk5vZGUpIHtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgICAgIHRoaXMucm9vdCA9IG5ldyBjYy5Ob2RlKCdMb2FkaW5nU2NyZWVuJyk7XG4gICAgICAgIHRoaXMucm9vdC56SW5kZXggPSBaX09SREVSLkxPQURJTkc7XG4gICAgICAgIHRoaXMucm9vdC5vcGFjaXR5ID0gMjU1O1xuXG4gICAgICAgIGNvbnN0IHNwaW4gPSBuZXcgY2MuTm9kZSgnU3Bpbm5lcicpO1xuICAgICAgICBjb25zdCBzcGluRyA9IHNwaW4uYWRkQ29tcG9uZW50KGNjLkdyYXBoaWNzKTtcbiAgICAgICAgc3Bpbkcuc3Ryb2tlQ29sb3IgPSBjYy5jb2xvcigyNTUsIDIxMCwgOTAsIDIyMCk7XG4gICAgICAgIHNwaW5HLmxpbmVXaWR0aCA9IDU7XG4gICAgICAgIHNwaW5HLmFyYygwLCAwLCAzMiwgMC4xNSAqIE1hdGguUEksIDEuNjUgKiBNYXRoLlBJKTtcbiAgICAgICAgc3Bpbkcuc3Ryb2tlKCk7XG4gICAgICAgIHRoaXMucm9vdC5hZGRDaGlsZChzcGluKTtcbiAgICAgICAgc3Bpbi5ydW5BY3Rpb24oY2MucmVwZWF0Rm9yZXZlcihjYy5yb3RhdGVCeSgxLjEsIDM2MCkpKTtcbiAgICB9XG5cbiAgICBzaG93KHBhcmVudDogY2MuTm9kZSk6IHZvaWQge1xuICAgICAgICBpZiAoIXBhcmVudCB8fCAhaXNWYWxpZChwYXJlbnQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaG93bkF0ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgdGhpcy5lbnN1cmVNYXNrKCk7XG4gICAgICAgIHRoaXMubGF5b3V0KCk7XG4gICAgICAgIHRoaXMucm9vdC5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICB0aGlzLnJvb3Qub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgaWYgKHRoaXMucm9vdC5wYXJlbnQgIT09IHBhcmVudCkge1xuICAgICAgICAgICAgdGhpcy5yb290LnJlbW92ZUZyb21QYXJlbnQoZmFsc2UpO1xuICAgICAgICAgICAgcGFyZW50LmFkZENoaWxkKHRoaXMucm9vdCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb290LmFjdGl2ZSA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqIOeql+WPo+WPmOWMluaXtuS4jiBiZyDkuIDotbfph43mlrDpk7rmu6EgKi9cbiAgICBsYXlvdXQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLm1hc2tOb2RlICYmIGlzVmFsaWQodGhpcy5tYXNrTm9kZSkpIHtcbiAgICAgICAgICAgIGxheW91dFNob3dBbGxDb3Zlcih0aGlzLm1hc2tOb2RlLCB0aGlzLmNhbnZhcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoaWRlKG9uRG9uZT86ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZWxhcHNlZCA9IChEYXRlLm5vdygpIC0gdGhpcy5zaG93bkF0KSAvIDEwMDA7XG4gICAgICAgIGNvbnN0IHdhaXQgPSBNYXRoLm1heCgwLCBMT0FESU5HX01JTl9WSVNJQkxFX1NFQyAtIGVsYXBzZWQpO1xuICAgICAgICB0aGlzLnJvb3Quc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgdGhpcy5yb290LnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShcbiAgICAgICAgICAgIGNjLmRlbGF5VGltZSh3YWl0KSxcbiAgICAgICAgICAgIGNjLmZhZGVPdXQoTE9BRElOR19GQURFX09VVCksXG4gICAgICAgICAgICBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucm9vdCAmJiBpc1ZhbGlkKHRoaXMucm9vdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290LmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3Qub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG9uRG9uZSkge1xuICAgICAgICAgICAgICAgICAgICBvbkRvbmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICApKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGVuc3VyZU1hc2soKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLm1hc2tOb2RlICYmIGlzVmFsaWQodGhpcy5tYXNrTm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBiZyA9IHRoaXMuY2FudmFzLmdldENoaWxkQnlOYW1lKCdiZycpO1xuICAgICAgICBpZiAoIWJnIHx8ICFpc1ZhbGlkKGJnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJnU3ByaXRlID0gYmcuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgIGlmICghYmdTcHJpdGUgfHwgIWJnU3ByaXRlLnNwcml0ZUZyYW1lKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1hc2tOb2RlID0gbmV3IGNjLk5vZGUoJ0xvYWRpbmdNYXNrJyk7XG4gICAgICAgIHRoaXMubWFza05vZGUuc2V0QW5jaG9yUG9pbnQoMC41LCAwLjUpO1xuICAgICAgICBjb25zdCBtYXNrU3ByaXRlID0gdGhpcy5tYXNrTm9kZS5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgbWFza1Nwcml0ZS5zcHJpdGVGcmFtZSA9IGJnU3ByaXRlLnNwcml0ZUZyYW1lO1xuICAgICAgICBtYXNrU3ByaXRlLnNpemVNb2RlID0gYmdTcHJpdGUuc2l6ZU1vZGU7XG4gICAgICAgIG1hc2tTcHJpdGUudHlwZSA9IGJnU3ByaXRlLnR5cGU7XG4gICAgICAgIHRoaXMucm9vdC5hZGRDaGlsZCh0aGlzLm1hc2tOb2RlKTtcbiAgICAgICAgdGhpcy5tYXNrTm9kZS5zZXRTaWJsaW5nSW5kZXgoMCk7XG4gICAgfVxufVxuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/core/BoardManager.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'b6562ZXu8pPJrkDtpPY/OOU', 'BoardManager');
// script/core/BoardManager.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardManager = void 0;
var is_valid_1 = require("../is-valid");
var TileModel_1 = require("../model/TileModel");
var BoardRule_1 = require("./BoardRule");
var LevelSolver_1 = require("./LevelSolver");
var GamePreloadConfig_1 = require("../ui/GamePreloadConfig");
var TileHintMarquee_1 = require("../ui/TileHintMarquee");
var GameImgAtlas_1 = require("../ui/GameImgAtlas");
var MatchEliminationSpine_1 = require("../ui/MatchEliminationSpine");
var ICON_PATH = GamePreloadConfig_1.TILE_ICON_PATH;
var Z_LAYER_STEP = 100;
/** 预制体遮黑 / 选中光效节点（mj.prefab → mask / selected） */
var TILE_MASK_NAME = 'mask';
var TILE_SELECTED_NAME = 'selected';
var TILE_ICON_NAME = 'icon';
var TILE_DI_NAME = 'di';
var TILE_FACE_NAME = 'up';
/** 同父节点下绘制顺序：selected 光效在下，icon 牌面在上，mask 最顶（压暗） */
var TILE_CHILD_Z = {
    di: 0,
    up: 1,
    selected: 2,
    icon: 3,
    mask: 4,
};
var TILE_SWEEP_NAME = 'select_sweep';
var TILE_SWEEP_CLIP_NAME = 'select_sweep_clip';
var TILE_HINT_MARQUEE_NAME = 'hint_marquee';
/** 提示跑马灯：挂在 hint_sway_pivot 上随牌晃动，z 高于 pivot 内子节点 */
var TILE_HINT_MARQUEE_Z = 100;
var TILE_HINT_SWAY_PIVOT_NAME = 'hint_sway_pivot';
var TILE_HINT_SWAY_TAG = 88031;
var GUIDE_HAND_NODE_NAME = 'hint_guide_hand';
var GUIDE_HAND_TAP_TAG = 88032;
var GUIDE_HAND_PRESS_Y = -16;
var GUIDE_HAND_PRESS_SCALE = 0.86;
var GUIDE_HAND_PRESS_IN = 0.12;
var GUIDE_HAND_PRESS_HOLD = 0.05;
var GUIDE_HAND_PRESS_OUT = 0.14;
var GUIDE_HAND_TAP_GAP = 0.42;
var TILE_MASK_OPACITY = 255;
/** 选中：外圈呼吸 + 扫光（扫光在牌面 up 矩形遮罩内） */
var SELECT_GLOW_PULSE = 0.52;
var SELECT_POP_IN = 0.14;
/** 选中：相对棋盘中线，左侧往左、右侧往右微移 */
var SELECT_SHIFT_X = 10;
var SELECT_SHIFT_DURATION = 0.1;
var SELECT_SHIFT_CENTER_EPS = 2;
var SELECT_OFFSET_ACTION_TAG = 88021;
/** 入场：屏外落下 → 按层瀑布落牌 → 每层落完即变暗 → 再落下一层 */
var ENTRANCE_DROP_ABOVE_MAX = 300;
var ENTRANCE_INTRA_STAGGER = 0.006;
var ENTRANCE_DROP_DURATION = 0.1;
var ENTRANCE_DIM_DURATION = 0.08;
var ENTRANCE_LAYER_GAP = 0.03;
/** 不可选时的晃动反馈 */
var BLOCK_SHAKE_X = 10;
var BLOCK_SHAKE_Y = 8;
var BLOCK_SHAKE_STEP = 0.045;
/** 左右夹住：中间闪黑 + 两侧禁止图标旋转回弹 */
var BLOCK_CENTER_FLASH_IN = 0.06;
var BLOCK_CENTER_FLASH_HOLD = 0.1;
var BLOCK_CENTER_FLASH_OUT = 0.12;
var BLOCK_FORBIDDEN_SIZE = 50;
var BLOCK_FORBIDDEN_SCALE = 0.8;
var BLOCK_FORBIDDEN_ROTATE = 32;
var BLOCK_FORBIDDEN_POP = 0.09;
var BLOCK_FORBIDDEN_SETTLE = 0.2;
var BLOCK_FORBIDDEN_WIGGLE = 0.09;
var BLOCK_FORBIDDEN_HOLD = 0.06;
var BLOCK_FORBIDDEN_FADE = 0.07;
/** 旋转弹簧：period 越小回弹越快 */
var BLOCK_FORBIDDEN_SPRING = 0.11;
var BoardManager = /** @class */ (function () {
    function BoardManager() {
        this.config = null;
        this.tiles = [];
        this.spriteCache = {};
        this.entrancePlaying = false;
        this.boardRoot = null;
        this.forbiddenIconSf = null;
        this.guideHandSf = null;
        this.guideHandNode = null;
        this.guideHandTargetTile = null;
        this.guideHandTapRunning = false;
        this.guideHandBaseX = 0;
        this.guideHandBaseY = 0;
        this.guideHandBaseScale = 1;
        this.hintGuideTiles = [];
    }
    BoardManager.prototype.resolveKeys = function () {
        var slotCount = this.config.slots.length;
        if (this.config.keys && this.config.keys.length === slotCount) {
            return this.config.keys;
        }
        return LevelSolver_1.generateSolvableKeys(this.config);
    };
    BoardManager.prototype.loadLevel = function (path, onReady, cachedLevel) {
        var _this = this;
        if (cachedLevel) {
            this.applyLevelAsset(cachedLevel, onReady);
            return;
        }
        cc.resources.load(path, cc.JsonAsset, function (err, asset) {
            if (err) {
                onReady('关卡加载失败');
                return;
            }
            _this.applyLevelAsset(asset, onReady);
        });
    };
    BoardManager.prototype.applyLevelAsset = function (asset, onReady) {
        var _this = this;
        this.config = asset.json;
        if (!this.config.slots || this.config.slots.length === 0) {
            onReady('关卡数据为空');
            return;
        }
        var keys = this.resolveKeys();
        if (!keys) {
            onReady('无法生成可解关卡，请检查布局');
            return;
        }
        var uniqueKeys = [];
        for (var i = 0; i < keys.length; i++) {
            if (uniqueKeys.indexOf(keys[i]) === -1) {
                uniqueKeys.push(keys[i]);
            }
        }
        this.loadSprites(uniqueKeys, function () {
            _this.buildTiles(keys);
            onReady();
        });
    };
    BoardManager.prototype.loadSprites = function (keys, done) {
        var _this = this;
        var loaded = 0;
        if (keys.length === 0) {
            done();
            return;
        }
        var finishOne = function () {
            loaded++;
            if (loaded === keys.length) {
                done();
            }
        };
        var _loop_1 = function (i) {
            var key = keys[i];
            var cached = GameImgAtlas_1.getCachedTileIcon(key);
            if (cached) {
                this_1.spriteCache[key] = cached;
                finishOne();
                return "continue";
            }
            GameImgAtlas_1.loadGameSpriteFrame(ICON_PATH + key, function (sf) {
                if (sf) {
                    _this.spriteCache[key] = sf;
                }
                finishOne();
            });
        };
        var this_1 = this;
        for (var i = 0; i < keys.length; i++) {
            _loop_1(i);
        }
    };
    BoardManager.prototype.buildTiles = function (keys) {
        this.tiles = [];
        for (var i = 0; i < this.config.slots.length; i++) {
            var slot = this.config.slots[i];
            var key = keys[i];
            this.tiles.push({
                id: i,
                key: key,
                kind: TileModel_1.getTileKind(key),
                layer: slot.layer,
                x: slot.x,
                y: slot.y,
                removed: false,
                free: true,
                covered: false,
                node: null,
            });
        }
        BoardRule_1.refreshTileStates(this.tiles, this.config);
    };
    /** 换牌面：TRIMMED 保持比例，由预制体 scale 控制整体大小 */
    BoardManager.prototype.applyTileIcon = function (icon, key) {
        var sf = this.spriteCache[key];
        if (!sf)
            return;
        var sprite = icon.getComponent(cc.Sprite);
        if (!sprite)
            return;
        sprite.sizeMode = cc.Sprite.SizeMode.TRIMMED;
        sprite.spriteFrame = sf;
    };
    BoardManager.prototype.spawn = function (tilePrefab, parent, onBoardReady, onEntranceDone) {
        this.boardRoot = parent;
        this.ensureForbiddenIcon(function () { });
        var dropY = this.getEntranceDropY();
        for (var i = 0; i < this.tiles.length; i++) {
            var tile = this.tiles[i];
            var node = cc.instantiate(tilePrefab);
            node.setPosition(tile.x, dropY);
            parent.addChild(node);
            tile.node = node;
            tile.baseScale = node.scaleX;
            var icon = node.getChildByName('icon');
            if (icon) {
                this.applyTileIcon(icon, tile.key);
            }
            this.initTileMask(node, false);
            this.stopTileSelectEffect(node);
            this.ensureTileChildLayerOrder(node);
            tile.dimMaskOn = false;
            this.setTileEntranceHidden(tile);
        }
        this.applySameLayerDepthOrder();
        BoardRule_1.refreshTileStates(this.tiles, this.config);
        if (onBoardReady) {
            onBoardReady();
        }
        this.playEntranceAnim(dropY, onEntranceDone);
    };
    /**
     * 同层立体感叠放：右下最前（y 小、x 大 z 最高），左上最后
     */
    BoardManager.prototype.applySameLayerDepthOrder = function () {
        var groups = {};
        for (var i = 0; i < this.tiles.length; i++) {
            var tile = this.tiles[i];
            if (tile.removed)
                continue;
            if (!groups[tile.layer]) {
                groups[tile.layer] = [];
            }
            groups[tile.layer].push(tile);
        }
        var layerIds = [];
        for (var key in groups) {
            if (groups.hasOwnProperty(key)) {
                layerIds.push(parseInt(key, 10));
            }
        }
        layerIds.sort(function (a, b) { return a - b; });
        for (var li = 0; li < layerIds.length; li++) {
            var layer = layerIds[li];
            var group = groups[layer];
            group.sort(function (a, b) {
                if (a.y !== b.y) {
                    return b.y - a.y;
                }
                return a.x - b.x;
            });
            for (var i = 0; i < group.length; i++) {
                var tile = group[i];
                var z = layer * Z_LAYER_STEP + i;
                tile.baseZIndex = z;
                if (tile.node && is_valid_1.isValid(tile.node)) {
                    tile.node.zIndex = z;
                }
            }
        }
    };
    /** 屏外起始高度：最高牌面之上再抬高一段 */
    BoardManager.prototype.getEntranceDropY = function () {
        var maxY = 0;
        for (var i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].y > maxY)
                maxY = this.tiles[i].y;
        }
        return maxY + ENTRANCE_DROP_ABOVE_MAX;
    };
    BoardManager.prototype.setTileEntranceHidden = function (tile) {
        if (!tile.node || !is_valid_1.isValid(tile.node))
            return;
        tile.node.opacity = 0;
    };
    /** 入场落下过程中保持高亮，不体现遮挡 */
    BoardManager.prototype.applyEntranceBright = function (tile) {
        if (!tile.node || !is_valid_1.isValid(tile.node))
            return;
        tile.node.opacity = 255;
        tile.node.color = cc.Color.WHITE;
        var icon = tile.node.getChildByName('icon');
        if (icon && is_valid_1.isValid(icon)) {
            icon.opacity = 255;
            icon.color = cc.Color.WHITE;
        }
        tile.dimMaskOn = false;
        this.initTileMask(tile.node, false);
        this.stopTileSelectEffect(tile.node);
    };
    /** 读取预制体顶层遮黑（不运行时创建） */
    BoardManager.prototype.getTileMaskNode = function (root) {
        if (!root || !is_valid_1.isValid(root))
            return null;
        var mask = root.getChildByName(TILE_MASK_NAME);
        return mask && is_valid_1.isValid(mask) ? mask : null;
    };
    BoardManager.prototype.getTileSelectedNode = function (root) {
        if (!root || !is_valid_1.isValid(root))
            return null;
        var selected = root.getChildByName(TILE_SELECTED_NAME);
        if (!selected || !is_valid_1.isValid(selected)) {
            var walk_1 = function (node) {
                if (node.name === TILE_SELECTED_NAME)
                    return node;
                for (var i = 0; i < node.childrenCount; i++) {
                    var hit = walk_1(node.children[i]);
                    if (hit)
                        return hit;
                }
                return null;
            };
            selected = walk_1(root);
        }
        return selected && is_valid_1.isValid(selected) ? selected : null;
    };
    BoardManager.prototype.getFaceTrimBounds = function (face) {
        var scaleX = Math.abs(face.scaleX);
        var scaleY = Math.abs(face.scaleY);
        return TileHintMarquee_1.tileFaceBoundsFromTrim(face.width, face.height, scaleX, scaleY);
    };
    /** 跑马灯父节点：优先 hint_sway_pivot，与牌面一起晃动 */
    BoardManager.prototype.getHintMarqueeParent = function (root) {
        var pivot = root.getChildByName(TILE_HINT_SWAY_PIVOT_NAME);
        return pivot && is_valid_1.isValid(pivot) ? pivot : root;
    };
    /** 跑马灯对齐牌面可见区域 */
    BoardManager.prototype.alignHintMarqueeToFace = function (marquee, face, _root) {
        var bounds = this.getFaceTrimBounds(face);
        var w = bounds.right - bounds.left;
        var h = bounds.top - bounds.bottom;
        var cx = (bounds.left + bounds.right) * 0.5;
        var cy = (bounds.bottom + bounds.top) * 0.5;
        var world = face.convertToWorldSpaceAR(cc.v2(cx, cy));
        var parent = marquee.parent;
        var local = parent.convertToNodeSpaceAR(world);
        marquee.setAnchorPoint(0.5, 0.5);
        marquee.setPosition(local.x, local.y);
        marquee.setContentSize(w, h);
        marquee.setScale(1);
        marquee.angle = face.angle;
    };
    BoardManager.prototype.findHintMarqueeNode = function (root) {
        if (!root || !is_valid_1.isValid(root)) {
            return null;
        }
        var pivot = root.getChildByName(TILE_HINT_SWAY_PIVOT_NAME);
        if (pivot && is_valid_1.isValid(pivot)) {
            var onPivot = pivot.getChildByName(TILE_HINT_MARQUEE_NAME);
            if (onPivot && is_valid_1.isValid(onPivot)) {
                return onPivot;
            }
        }
        var node = root.getChildByName(TILE_HINT_MARQUEE_NAME);
        if (node && is_valid_1.isValid(node)) {
            return node;
        }
        var face = this.getTileFaceNode(root);
        if (face) {
            node = face.getChildByName(TILE_HINT_MARQUEE_NAME);
            if (node && is_valid_1.isValid(node)) {
                return node;
            }
        }
        return null;
    };
    /** 清理棋盘层遗留的跑马灯节点（含挂在牌 pivot 下的） */
    BoardManager.prototype.destroyBoardHintMarquees = function () {
        for (var i = 0; i < this.tiles.length; i++) {
            var tile = this.tiles[i];
            if (!tile.removed && tile.node && is_valid_1.isValid(tile.node)) {
                this.stopTileHintMarquee(tile);
            }
        }
        if (!this.boardRoot || !is_valid_1.isValid(this.boardRoot)) {
            return;
        }
        var children = this.boardRoot.children.slice();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (!child || !is_valid_1.isValid(child)) {
                continue;
            }
            if (child.name.indexOf(TILE_HINT_MARQUEE_NAME) === 0) {
                child.destroy();
            }
        }
    };
    /** 取消棋盘上所有跑马灯 / 晃动提示 */
    BoardManager.prototype.clearAllGuideMarquees = function () {
        var guided = this.hintGuideTiles.slice();
        for (var i = 0; i < guided.length; i++) {
            this.restoreTileHint(guided[i]);
        }
        this.hintGuideTiles = [];
        for (var i = 0; i < this.tiles.length; i++) {
            var tile = this.tiles[i];
            if (tile.removed || !tile.node || !is_valid_1.isValid(tile.node)) {
                continue;
            }
            this.stopTileHintMarquee(tile);
            this.stopTileHintSway(tile);
        }
        this.destroyBoardHintMarquees();
    };
    BoardManager.prototype.isHintGuideTile = function (tile) {
        return this.hintGuideTiles.findIndex(function (t) { return t.id === tile.id; }) >= 0;
    };
    /** 保证跑马灯在 pivot 上、对齐牌面、层级最高 */
    BoardManager.prototype.syncHintMarquee = function (tile) {
        if (tile.removed || !tile.node || !is_valid_1.isValid(tile.node)) {
            return;
        }
        var root = tile.node;
        var face = this.getTileFaceNode(root);
        if (!face) {
            return;
        }
        var pivot = root.getChildByName(TILE_HINT_SWAY_PIVOT_NAME);
        if (!pivot || !is_valid_1.isValid(pivot)) {
            return;
        }
        var marquee = this.findHintMarqueeNode(root);
        if (!marquee || !is_valid_1.isValid(marquee)) {
            return;
        }
        var staleOnRoot = root.getChildByName(TILE_HINT_MARQUEE_NAME);
        if (staleOnRoot && is_valid_1.isValid(staleOnRoot) && staleOnRoot !== marquee) {
            staleOnRoot.destroy();
        }
        var staleOnFace = face.getChildByName(TILE_HINT_MARQUEE_NAME);
        if (staleOnFace && is_valid_1.isValid(staleOnFace) && staleOnFace !== marquee) {
            staleOnFace.destroy();
        }
        if (marquee.parent !== pivot) {
            this.reparentKeepWorld(marquee, pivot);
        }
        marquee.active = true;
        marquee.opacity = 255;
        this.alignHintMarqueeToFace(marquee, face, root);
        this.bringHintMarqueeToFront(root);
        var ctrl = marquee.getComponent(TileHintMarquee_1.default);
        if (ctrl) {
            var bounds = this.getFaceTrimBounds(face);
            var visHalfW = (bounds.right - bounds.left) * 0.5;
            var visHalfH = (bounds.top - bounds.bottom) * 0.5;
            var cornerR = Math.min(visHalfW, visHalfH) * 0.24;
            ctrl.setupRect(bounds.left, bounds.right, bounds.bottom, bounds.top, 2, cornerR);
        }
    };
    BoardManager.prototype.refreshAllHintMarquees = function () {
        for (var i = 0; i < this.hintGuideTiles.length; i++) {
            this.syncHintMarquee(this.hintGuideTiles[i]);
        }
    };
    BoardManager.prototype.refreshHintMarqueesOnRoot = function (root) {
        for (var i = 0; i < this.hintGuideTiles.length; i++) {
            var tile = this.hintGuideTiles[i];
            if (tile.node === root) {
                this.syncHintMarquee(tile);
            }
        }
    };
    BoardManager.prototype.bringHintMarqueeToFront = function (root) {
        var marquee = this.findHintMarqueeNode(root);
        if (!marquee || !is_valid_1.isValid(marquee)) {
            return;
        }
        var parent = marquee.parent;
        if (!parent || !is_valid_1.isValid(parent)) {
            return;
        }
        marquee.setSiblingIndex(parent.childrenCount - 1);
        marquee.zIndex = TILE_HINT_MARQUEE_Z;
    };
    /** 统一牌面子节点层级（含 hint_sway_pivot 内） */
    BoardManager.prototype.ensureTileChildLayerOrder = function (root) {
        if (!root || !is_valid_1.isValid(root)) {
            return;
        }
        var pivot = root.getChildByName(TILE_HINT_SWAY_PIVOT_NAME);
        var parents = [root];
        if (pivot && is_valid_1.isValid(pivot)) {
            parents.push(pivot);
        }
        for (var pi = 0; pi < parents.length; pi++) {
            var parent = parents[pi];
            var chain = [
                { name: TILE_DI_NAME, z: TILE_CHILD_Z.di },
                { name: TILE_FACE_NAME, z: TILE_CHILD_Z.up },
                { name: TILE_SELECTED_NAME, z: TILE_CHILD_Z.selected },
                { name: TILE_ICON_NAME, z: TILE_CHILD_Z.icon },
                { name: TILE_MASK_NAME, z: TILE_CHILD_Z.mask },
            ];
            var idx = 0;
            for (var ci = 0; ci < chain.length; ci++) {
                var item = chain[ci];
                var node = null;
                if (item.name === TILE_FACE_NAME && parent === root) {
                    node = this.findDescendantByName(root, TILE_FACE_NAME);
                }
                else if (parent === root && item.name !== TILE_FACE_NAME) {
                    node = parent.getChildByName(item.name);
                }
                else {
                    node = parent.getChildByName(item.name);
                }
                if (!node || !is_valid_1.isValid(node) || node.parent !== parent) {
                    continue;
                }
                node.setSiblingIndex(idx);
                node.zIndex = item.z;
                idx++;
            }
        }
        this.bringHintMarqueeToFront(root);
        this.refreshHintMarqueesOnRoot(root);
        var clip = root.getChildByName(TILE_SWEEP_CLIP_NAME);
        if (clip && is_valid_1.isValid(clip)) {
            clip.setSiblingIndex(root.childrenCount - 1);
            clip.zIndex = 1000;
            this.bringHintMarqueeToFront(root);
        }
    };
    BoardManager.prototype.stopTileSelectEffect = function (root) {
        if (!root || !is_valid_1.isValid(root))
            return;
        var selected = this.getTileSelectedNode(root);
        if (selected && is_valid_1.isValid(selected)) {
            selected.stopAllActions();
            selected.active = false;
            selected.opacity = 255;
            selected.setScale(1);
            this.ensureTileChildLayerOrder(root);
        }
        var clip = root.getChildByName(TILE_SWEEP_CLIP_NAME);
        if (clip && is_valid_1.isValid(clip)) {
            clip.stopAllActions();
            clip.destroy();
        }
        var sweep = root.getChildByName(TILE_SWEEP_NAME);
        if (sweep && is_valid_1.isValid(sweep)) {
            sweep.stopAllActions();
            sweep.destroy();
        }
    };
    /** 递归查找子节点（提示晃动后 up 可能在 hint_sway_pivot 下） */
    BoardManager.prototype.findDescendantByName = function (node, name) {
        if (!node || !is_valid_1.isValid(node)) {
            return null;
        }
        if (node.name === name) {
            return node;
        }
        for (var i = 0; i < node.children.length; i++) {
            var hit = this.findDescendantByName(node.children[i], name);
            if (hit) {
                return hit;
            }
        }
        return null;
    };
    /** 牌面图节点（扫光裁剪区域与之对齐） */
    BoardManager.prototype.getTileFaceNode = function (root) {
        return this.findDescendantByName(root, TILE_FACE_NAME);
    };
    BoardManager.prototype.setGuideHandSprite = function (sf) {
        if (sf) {
            this.guideHandSf = sf;
        }
    };
    /** 扫光遮罩对齐牌面可见区域（与跑马灯裁切一致，支持 up 在 pivot 下） */
    BoardManager.prototype.alignSweepClipToFace = function (clip, face, root) {
        var bounds = this.getFaceTrimBounds(face);
        var w = bounds.right - bounds.left;
        var h = bounds.top - bounds.bottom;
        var cx = (bounds.left + bounds.right) * 0.5;
        var cy = (bounds.bottom + bounds.top) * 0.5;
        var world = face.convertToWorldSpaceAR(cc.v2(cx, cy));
        var local = root.convertToNodeSpaceAR(world);
        clip.setAnchorPoint(0.5, 0.5);
        clip.setPosition(local.x, local.y);
        clip.setContentSize(w, h);
        clip.setScale(1);
        clip.angle = face.angle;
    };
    BoardManager.prototype.getOrCreateSweepClip = function (root) {
        var face = this.getTileFaceNode(root);
        if (!face)
            return null;
        var clip = root.getChildByName(TILE_SWEEP_CLIP_NAME);
        if (!clip || !is_valid_1.isValid(clip)) {
            clip = new cc.Node(TILE_SWEEP_CLIP_NAME);
            var mask = clip.addComponent(cc.Mask);
            mask.type = cc.Mask.Type.RECT;
            root.addChild(clip);
        }
        this.alignSweepClipToFace(clip, face, root);
        return clip;
    };
    BoardManager.prototype.buildSelectSweepBar = function (barW, barH) {
        var node = new cc.Node(TILE_SWEEP_NAME);
        var g = node.addComponent(cc.Graphics);
        var hw = barW * 0.5;
        var hh = barH * 0.5;
        g.clear();
        g.fillColor = cc.color(255, 248, 210, Math.floor(GamePreloadConfig_1.SELECT_SWEEP_STYLE.peakOpacity * 0.35));
        g.roundRect(-hw - 2, -hh, barW + 4, barH, 2);
        g.fill();
        g.fillColor = cc.color(255, 252, 230, GamePreloadConfig_1.SELECT_SWEEP_STYLE.peakOpacity);
        g.roundRect(-hw, -hh, barW, barH, 1);
        g.fill();
        node.setContentSize(barW, barH);
        node.setAnchorPoint(0.5, 0.5);
        node.angle = GamePreloadConfig_1.SELECT_SWEEP_STYLE.angle;
        return node;
    };
    /** 选中特效：外圈弹出 + 呼吸 + 横向扫光循环 */
    BoardManager.prototype.startTileSelectEffect = function (tile) {
        var _this = this;
        var root = tile.node;
        if (!root || !is_valid_1.isValid(root))
            return;
        this.stopTileSelectEffect(root);
        var selected = this.getTileSelectedNode(root);
        if (!selected)
            return;
        var sprite = selected.getComponent(cc.Sprite);
        if (sprite) {
            sprite.enabled = true;
            if (!sprite.spriteFrame) {
                cc.warn('[BoardManager] selected 节点缺少 SpriteFrame，请检查 mj 预制体');
            }
        }
        selected.active = true;
        selected.opacity = 160;
        this.ensureTileChildLayerOrder(root);
        selected.stopAllActions();
        selected.runAction(cc.sequence(cc.fadeTo(SELECT_POP_IN, 255).easing(cc.easeSineOut()), cc.callFunc(function () {
            if (!selected || !is_valid_1.isValid(selected))
                return;
            _this.playSelectGlowPulse(selected);
        }, this)));
        this.playSelectSweep(root);
    };
    BoardManager.prototype.playSelectGlowPulse = function (selected) {
        if (!selected || !is_valid_1.isValid(selected))
            return;
        selected.stopAllActions();
        selected.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(SELECT_GLOW_PULSE, 255).easing(cc.easeSineInOut()), cc.fadeTo(SELECT_GLOW_PULSE, 190).easing(cc.easeSineInOut()))));
    };
    /** 细条扫光：在牌面可见区域内完整从左扫到右 */
    BoardManager.prototype.playSelectSweep = function (root) {
        var clip = this.getOrCreateSweepClip(root);
        if (!clip)
            return;
        var face = this.getTileFaceNode(root);
        if (face) {
            this.alignSweepClipToFace(clip, face, root);
        }
        var clipW = clip.width;
        var clipH = clip.height;
        var inset = GamePreloadConfig_1.SELECT_SWEEP_STYLE.edgeInset;
        var fromX = -clipW * 0.5 + inset;
        var toX = clipW * 0.5 - inset;
        var barW = GamePreloadConfig_1.SELECT_SWEEP_STYLE.barWidth;
        var barH = clipH * GamePreloadConfig_1.SELECT_SWEEP_STYLE.barHeightRatio;
        var sweep = this.buildSelectSweepBar(barW, barH);
        clip.addChild(sweep);
        this.ensureTileChildLayerOrder(root);
        var duration = GamePreloadConfig_1.SELECT_SWEEP_STYLE.duration;
        var gap = GamePreloadConfig_1.SELECT_SWEEP_STYLE.gap;
        var peak = GamePreloadConfig_1.SELECT_SWEEP_STYLE.peakOpacity;
        var runOnce = function () {
            if (!sweep || !is_valid_1.isValid(sweep))
                return;
            sweep.setPosition(fromX, 0);
            sweep.opacity = 0;
        };
        runOnce();
        sweep.runAction(cc.repeatForever(cc.sequence(cc.spawn(cc.moveTo(duration, toX, 0).easing(cc.easeSineInOut()), cc.sequence(cc.fadeTo(duration * 0.2, peak), cc.fadeTo(duration * 0.5, peak), cc.fadeTo(duration * 0.3, 0))), cc.delayTime(gap), cc.callFunc(runOnce, this))));
    };
    BoardManager.prototype.setTileSelectGlow = function (tile, on) {
        if (tile.removed || !tile.node || !is_valid_1.isValid(tile.node))
            return;
        if (on) {
            this.startTileSelectEffect(tile);
        }
        else {
            this.stopTileSelectEffect(tile.node);
        }
    };
    BoardManager.prototype.getOrCreateHintMarquee = function (tile) {
        var root = tile.node;
        if (!root || !is_valid_1.isValid(root)) {
            return null;
        }
        var face = this.getTileFaceNode(root);
        if (!face) {
            return null;
        }
        this.getOrCreateHintSwayPivot(tile);
        var marqueeParent = this.getHintMarqueeParent(root);
        var marqueeNode = this.findHintMarqueeNode(root);
        var legacyOnFace = face.getChildByName(TILE_HINT_MARQUEE_NAME);
        if (legacyOnFace && is_valid_1.isValid(legacyOnFace) && legacyOnFace !== marqueeNode) {
            if (marqueeNode && is_valid_1.isValid(marqueeNode)) {
                legacyOnFace.destroy();
            }
            else {
                marqueeNode = legacyOnFace;
                this.reparentKeepWorld(marqueeNode, marqueeParent);
            }
        }
        if (marqueeNode && marqueeNode.parent !== marqueeParent) {
            this.reparentKeepWorld(marqueeNode, marqueeParent);
        }
        if (!marqueeNode || !is_valid_1.isValid(marqueeNode)) {
            marqueeNode = new cc.Node(TILE_HINT_MARQUEE_NAME);
            marqueeParent.addChild(marqueeNode);
            marqueeNode.addComponent(cc.Graphics);
            marqueeNode.addComponent(TileHintMarquee_1.default);
        }
        marqueeNode.active = true;
        this.alignHintMarqueeToFace(marqueeNode, face, root);
        this.bringHintMarqueeToFront(root);
        var ctrl = marqueeNode.getComponent(TileHintMarquee_1.default);
        if (!ctrl) {
            return null;
        }
        var bounds = this.getFaceTrimBounds(face);
        var visHalfW = (bounds.right - bounds.left) * 0.5;
        var visHalfH = (bounds.top - bounds.bottom) * 0.5;
        var cornerR = Math.min(visHalfW, visHalfH) * 0.24;
        ctrl.setupRect(bounds.left, bounds.right, bounds.bottom, bounds.top, 2, cornerR);
        return ctrl;
    };
    BoardManager.prototype.stopTileHintMarquee = function (tile) {
        if (!tile.node || !is_valid_1.isValid(tile.node)) {
            return;
        }
        var marqueeNode = this.findHintMarqueeNode(tile.node);
        if (marqueeNode && is_valid_1.isValid(marqueeNode)) {
            marqueeNode.active = false;
            marqueeNode.destroy();
        }
    };
    /** 同时只保留一对提示（跑马灯 + 底锚点晃动） */
    BoardManager.prototype.showGuideHintPair = function (a, b) {
        this.destroyBoardHintMarquees();
        this.clearHintTilesOnly();
        this.hintGuideTiles = [a, b];
        for (var i = 0; i < this.hintGuideTiles.length; i++) {
            var tile = this.hintGuideTiles[i];
            this.getOrCreateHintSwayPivot(tile);
            this.getOrCreateHintMarquee(tile);
            this.startTileHintSway(tile);
        }
        var left = a.x <= b.x ? a : b;
        var right = a.x <= b.x ? b : a;
        this.bringMatchPairToFront(left, right);
        this.refreshAllHintMarquees();
    };
    BoardManager.prototype.clearHintTilesOnly = function () {
        for (var i = 0; i < this.hintGuideTiles.length; i++) {
            this.restoreTileHint(this.hintGuideTiles[i]);
        }
        this.hintGuideTiles = [];
    };
    BoardManager.prototype.clearGuideHintEffects = function () {
        this.clearAllGuideMarquees();
    };
    /** 提示：牌面外缘跑马灯 + 底锚点左右晃几下后静止 */
    BoardManager.prototype.highlightTileHint = function (tile) {
        this.getOrCreateHintSwayPivot(tile);
        this.getOrCreateHintMarquee(tile);
        this.startTileHintSway(tile);
    };
    BoardManager.prototype.restoreTileHint = function (tile) {
        this.stopTileHintMarquee(tile);
        this.stopTileHintSway(tile);
        this.restoreTileZIndex(tile);
        var idx = this.hintGuideTiles.findIndex(function (t) { return t.id === tile.id; });
        if (idx >= 0) {
            this.hintGuideTiles.splice(idx, 1);
        }
    };
    /** 引导小手：挂棋盘层 + 世界坐标，offset 为棋盘像素，不受晃动 pivot 影响 */
    BoardManager.prototype.showHintGuideHand = function (tile) {
        var _this = this;
        if (!tile.node || !is_valid_1.isValid(tile.node) || tile.removed) {
            return;
        }
        if (!this.boardRoot || !is_valid_1.isValid(this.boardRoot)) {
            return;
        }
        this.guideHandTargetTile = tile;
        this.ensureGuideHandSprite(function () {
            if (!_this.guideHandSf) {
                cc.warn('[BoardManager] 引导小手图加载失败:', GamePreloadConfig_1.GUIDE_HAND_PATH);
                return;
            }
            _this.hideHintGuideHand();
            var hand = new cc.Node(GUIDE_HAND_NODE_NAME);
            var sprite = hand.addComponent(cc.Sprite);
            sprite.spriteFrame = _this.guideHandSf;
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            var rect = _this.guideHandSf.getRect();
            hand.setContentSize(rect.width, rect.height);
            hand.setAnchorPoint(0, 1);
            hand.setScale(GamePreloadConfig_1.GUIDE_HAND_STYLE.scale);
            _this.boardRoot.addChild(hand, GamePreloadConfig_1.Z_ORDER.GUIDE_HAND);
            hand.opacity = 255;
            _this.guideHandNode = hand;
            _this.applyGuideHandPosition(tile);
            _this.playGuideHandTap(hand, tile);
        });
    };
    BoardManager.prototype.hideHintGuideHand = function () {
        this.guideHandTargetTile = null;
        if (!this.guideHandNode || !is_valid_1.isValid(this.guideHandNode)) {
            this.guideHandNode = null;
            return;
        }
        this.stopGuideHandTap(this.guideHandNode);
        this.guideHandNode.destroy();
        this.guideHandNode = null;
    };
    /** 麻将根节点中心 → 棋盘坐标；节点锚点 (0,0) 落该点 */
    BoardManager.prototype.getGuideHandBoardPosition = function (tile) {
        if (!tile.node || !is_valid_1.isValid(tile.node) || !this.boardRoot || !is_valid_1.isValid(this.boardRoot)) {
            return null;
        }
        var world = tile.node.convertToWorldSpaceAR(cc.v2(0, 0));
        var local = this.boardRoot.convertToNodeSpaceAR(world);
        return cc.v2(local.x + GamePreloadConfig_1.GUIDE_HAND_STYLE.offsetX, local.y + GamePreloadConfig_1.GUIDE_HAND_STYLE.offsetY);
    };
    BoardManager.prototype.applyGuideHandPosition = function (tile) {
        if (!this.guideHandNode || !is_valid_1.isValid(this.guideHandNode)) {
            return;
        }
        var pos = this.getGuideHandBoardPosition(tile);
        if (!pos) {
            return;
        }
        this.guideHandNode.setPosition(pos.x, pos.y);
        this.guideHandBaseX = pos.x;
        this.guideHandBaseY = pos.y;
    };
    BoardManager.prototype.playGuideHandTap = function (hand, tile) {
        if (!hand || !is_valid_1.isValid(hand)) {
            return;
        }
        this.stopGuideHandTap(hand);
        this.applyGuideHandPosition(tile);
        this.guideHandTapRunning = true;
        this.guideHandBaseScale = hand.scale;
        this.runGuideHandTapCycle(hand, tile);
    };
    BoardManager.prototype.runGuideHandTapCycle = function (hand, tile) {
        var _this = this;
        if (!this.guideHandTapRunning || !hand || !is_valid_1.isValid(hand)) {
            return;
        }
        if (!tile.node || !is_valid_1.isValid(tile.node) || tile.removed) {
            return;
        }
        this.applyGuideHandPosition(tile);
        var bx = this.guideHandBaseX;
        var by = this.guideHandBaseY;
        var bs = this.guideHandBaseScale;
        var seq = cc.sequence(cc.spawn(cc.moveTo(GUIDE_HAND_PRESS_IN, bx, by + GUIDE_HAND_PRESS_Y).easing(cc.easeSineIn()), cc.scaleTo(GUIDE_HAND_PRESS_IN, bs * GUIDE_HAND_PRESS_SCALE).easing(cc.easeSineIn())), cc.delayTime(GUIDE_HAND_PRESS_HOLD), cc.spawn(cc.moveTo(GUIDE_HAND_PRESS_OUT, bx, by).easing(cc.easeSineOut()), cc.scaleTo(GUIDE_HAND_PRESS_OUT, bs).easing(cc.easeBackOut())), cc.delayTime(GUIDE_HAND_TAP_GAP), cc.callFunc(function () { return _this.runGuideHandTapCycle(hand, tile); }, this));
        seq.setTag(GUIDE_HAND_TAP_TAG);
        hand.runAction(seq);
    };
    BoardManager.prototype.stopGuideHandTap = function (hand) {
        this.guideHandTapRunning = false;
        if (!hand || !is_valid_1.isValid(hand)) {
            return;
        }
        hand.stopActionByTag(GUIDE_HAND_TAP_TAG);
        if (this.guideHandTargetTile) {
            this.applyGuideHandPosition(this.guideHandTargetTile);
        }
        hand.setScale(this.guideHandBaseScale);
    };
    BoardManager.prototype.ensureGuideHandSprite = function (done) {
        var _this = this;
        if (this.guideHandSf) {
            done();
            return;
        }
        GameImgAtlas_1.loadGameSpriteFrame(GamePreloadConfig_1.GUIDE_HAND_PATH, function (sf) {
            if (sf) {
                _this.guideHandSf = sf;
                done();
                return;
            }
            cc.resources.load(GamePreloadConfig_1.GUIDE_HAND_PATH, cc.Texture2D, function (errTex, tex) {
                if (!errTex && tex) {
                    _this.guideHandSf = new cc.SpriteFrame(tex);
                }
                done();
            });
        });
    };
    BoardManager.prototype.isHintSwaySkipNode = function (name) {
        return name === TILE_HINT_SWAY_PIVOT_NAME
            || name === GUIDE_HAND_NODE_NAME;
    };
    BoardManager.prototype.reparentKeepWorld = function (child, newParent) {
        if (!child.parent || !is_valid_1.isValid(child.parent)) {
            newParent.addChild(child);
            return;
        }
        var world = child.parent.convertToWorldSpaceAR(child.getPosition());
        child.removeFromParent(false);
        newParent.addChild(child);
        child.setPosition(newParent.convertToNodeSpaceAR(world));
    };
    /** 底边 (0.5,0) 晃动轴：子节点 pivot，不改牌根节点锚点/坐标 */
    BoardManager.prototype.getOrCreateHintSwayPivot = function (tile) {
        var root = tile.node;
        if (!root || !is_valid_1.isValid(root)) {
            return null;
        }
        var pivot = root.getChildByName(TILE_HINT_SWAY_PIVOT_NAME);
        if (pivot && is_valid_1.isValid(pivot)) {
            return pivot;
        }
        pivot = new cc.Node(TILE_HINT_SWAY_PIVOT_NAME);
        pivot.setAnchorPoint(0.5, 0);
        var halfH = root.height * Math.abs(root.scaleY) * 0.5;
        pivot.setPosition(0, -halfH);
        root.addChild(pivot, 0);
        var children = root.children.slice();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (!child || !is_valid_1.isValid(child) || child === pivot) {
                continue;
            }
            if (this.isHintSwaySkipNode(child.name)) {
                continue;
            }
            this.reparentKeepWorld(child, pivot);
        }
        this.ensureTileChildLayerOrder(root);
        return pivot;
    };
    BoardManager.prototype.dissolveHintSwayPivot = function (tile) {
        var root = tile.node;
        if (!root || !is_valid_1.isValid(root)) {
            return;
        }
        var pivot = root.getChildByName(TILE_HINT_SWAY_PIVOT_NAME);
        if (!pivot || !is_valid_1.isValid(pivot)) {
            return;
        }
        pivot.stopActionByTag(TILE_HINT_SWAY_TAG);
        pivot.angle = 0;
        var children = pivot.children.slice();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (!child || !is_valid_1.isValid(child)) {
                continue;
            }
            this.reparentKeepWorld(child, root);
        }
        pivot.destroy();
        this.ensureTileChildLayerOrder(root);
    };
    BoardManager.prototype.startTileHintSway = function (tile) {
        var _this = this;
        if (tile.removed || !tile.node || !is_valid_1.isValid(tile.node)) {
            return;
        }
        var pivot = this.getOrCreateHintSwayPivot(tile);
        if (!pivot) {
            return;
        }
        pivot.stopActionByTag(TILE_HINT_SWAY_TAG);
        pivot.angle = 0;
        var angle = GamePreloadConfig_1.HINT_SWAY_STYLE.angle;
        var step = GamePreloadConfig_1.HINT_SWAY_STYLE.step;
        var gap = GamePreloadConfig_1.HINT_SWAY_STYLE.gap;
        var wiggle = cc.sequence(cc.rotateBy(step, angle), cc.rotateBy(step * 2, -angle * 2), cc.rotateBy(step, angle), cc.rotateTo(step, 0), cc.delayTime(gap), cc.callFunc(function () { return _this.refreshAllHintMarquees(); }, this));
        var sway = cc.repeatForever(wiggle);
        sway.setTag(TILE_HINT_SWAY_TAG);
        pivot.runAction(sway);
        this.syncHintMarquee(tile);
    };
    BoardManager.prototype.stopTileHintSway = function (tile) {
        this.dissolveHintSwayPivot(tile);
    };
    /** 初始化/复位遮黑：亮牌隐藏，暗牌显示 */
    BoardManager.prototype.initTileMask = function (root, covered) {
        var mask = this.getTileMaskNode(root);
        if (!mask)
            return;
        mask.stopAllActions();
        mask.active = covered;
        mask.opacity = TILE_MASK_OPACITY;
    };
    BoardManager.prototype.setTileDimMask = function (tile, covered, fadeDuration) {
        if (!tile.node || !is_valid_1.isValid(tile.node))
            return;
        var mask = this.getTileMaskNode(tile.node);
        if (!mask)
            return;
        var shown = !!tile.dimMaskOn;
        if (shown === covered) {
            return;
        }
        tile.dimMaskOn = covered;
        mask.stopAllActions();
        if (covered) {
            mask.active = true;
            if (fadeDuration > 0) {
                mask.opacity = 0;
                mask.runAction(cc.fadeTo(fadeDuration, TILE_MASK_OPACITY));
            }
            else {
                mask.opacity = TILE_MASK_OPACITY;
            }
            return;
        }
        if (fadeDuration > 0) {
            mask.runAction(cc.sequence(cc.fadeTo(fadeDuration, 0), cc.callFunc(function () {
                if (!mask || !is_valid_1.isValid(mask))
                    return;
                mask.active = false;
                mask.opacity = TILE_MASK_OPACITY;
            }, this)));
        }
        else {
            mask.active = false;
            mask.opacity = TILE_MASK_OPACITY;
        }
    };
    BoardManager.prototype.getEntranceLayerIds = function () {
        var seen = {};
        var layers = [];
        for (var i = 0; i < this.tiles.length; i++) {
            var layer = this.tiles[i].layer;
            if (!seen[layer]) {
                seen[layer] = true;
                layers.push(layer);
            }
        }
        layers.sort(function (a, b) { return a - b; });
        return layers;
    };
    BoardManager.prototype.getTilesInLayer = function (layer) {
        var list = [];
        for (var i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].layer === layer)
                list.push(this.tiles[i]);
        }
        list.sort(function (a, b) {
            if (a.y !== b.y)
                return b.y - a.y;
            return a.x - b.x;
        });
        return list;
    };
    BoardManager.prototype.playEntranceAnim = function (dropY, onComplete) {
        var layers = this.getEntranceLayerIds();
        if (layers.length === 0) {
            this.entrancePlaying = false;
            this.refreshVisuals();
            if (onComplete)
                onComplete();
            return;
        }
        this.entrancePlaying = true;
        this.runEntranceLayer(dropY, layers, 0, onComplete);
    };
    BoardManager.prototype.runEntranceLayer = function (dropY, layers, layerIndex, onComplete) {
        var _this = this;
        if (layerIndex >= layers.length) {
            this.entrancePlaying = false;
            this.refreshVisuals();
            if (onComplete)
                onComplete();
            return;
        }
        var layerTiles = this.getTilesInLayer(layers[layerIndex]);
        var validTiles = [];
        for (var i = 0; i < layerTiles.length; i++) {
            var node = layerTiles[i].node;
            if (node && is_valid_1.isValid(node))
                validTiles.push(layerTiles[i]);
        }
        if (validTiles.length === 0) {
            this.runEntranceLayer(dropY, layers, layerIndex + 1, onComplete);
            return;
        }
        var lastIndex = validTiles.length - 1;
        var _loop_2 = function (i) {
            var tile = validTiles[i];
            var node = tile.node;
            var delay = i * ENTRANCE_INTRA_STAGGER;
            var reveal = cc.callFunc(function () {
                node.setPosition(tile.x, dropY);
                _this.applyEntranceBright(tile);
            }, this_2);
            var drop = cc.moveTo(ENTRANCE_DROP_DURATION, tile.x, tile.y)
                .easing(cc.easeQuadraticActionOut());
            if (i === lastIndex) {
                node.runAction(cc.sequence(cc.delayTime(delay), reveal, drop, cc.callFunc(function () {
                    _this.refreshVisualsSmooth(ENTRANCE_DIM_DURATION);
                }, this_2), cc.delayTime(ENTRANCE_DIM_DURATION + ENTRANCE_LAYER_GAP), cc.callFunc(function () {
                    _this.runEntranceLayer(dropY, layers, layerIndex + 1, onComplete);
                }, this_2)));
            }
            else {
                node.runAction(cc.sequence(cc.delayTime(delay), reveal, drop));
            }
        };
        var this_2 = this;
        for (var i = 0; i < validTiles.length; i++) {
            _loop_2(i);
        }
    };
    /** 仅对已显示的牌做渐变变暗（落一层暗一层） */
    BoardManager.prototype.refreshVisualsSmooth = function (fadeDuration) {
        BoardRule_1.refreshTileStates(this.tiles, this.config);
        for (var i = 0; i < this.tiles.length; i++) {
            var tile = this.tiles[i];
            if (tile.removed || !tile.node || !is_valid_1.isValid(tile.node))
                continue;
            if (tile.node.opacity <= 0)
                continue;
            this.applyVisualFade(tile, fadeDuration);
        }
    };
    BoardManager.prototype.applyVisualFade = function (tile, duration) {
        if (!tile.node || !is_valid_1.isValid(tile.node))
            return;
        tile.node.opacity = 255;
        tile.node.color = cc.Color.WHITE;
        var icon = tile.node.getChildByName('icon');
        if (icon && is_valid_1.isValid(icon)) {
            icon.opacity = 255;
            icon.color = cc.Color.WHITE;
        }
        this.setTileDimMask(tile, tile.covered, duration);
    };
    /** 全局点击：仅在高亮牌中，用 Board 坐标 + 锚点矩形做命中 */
    BoardManager.prototype.bindBoardClick = function (root, onTileTap) {
        var _this = this;
        if (!root || !is_valid_1.isValid(root))
            return;
        root.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (_this.entrancePlaying)
                return;
            var picked = _this.pickTileAtTouch(e);
            if (picked) {
                e.stopPropagation();
                onTileTap(picked);
            }
        }, this, true);
    };
    /** 触摸点 → Board 本地坐标（兼容 SHOW_ALL / Canvas 缩放） */
    BoardManager.prototype.touchToBoardLocal = function (e) {
        if (!this.boardRoot || !is_valid_1.isValid(this.boardRoot))
            return null;
        return this.boardRoot.convertToNodeSpaceAR(e.getLocation());
    };
    /** 高亮牌 = 未盖遮罩变暗（与画面一致） */
    BoardManager.prototype.isBrightTile = function (tile) {
        if (tile.removed || !tile.node || !is_valid_1.isValid(tile.node))
            return false;
        if (tile.node.opacity <= 0)
            return false;
        if (tile.covered)
            return false;
        var mask = this.getTileMaskNode(tile.node);
        if (mask && mask.active && mask.opacity > 20)
            return false;
        return true;
    };
    /** 牌在 Board 本地坐标下的矩形：tile 坐标 + 关卡宽高 + 锚点 */
    BoardManager.prototype.getTileRectInBoard = function (tile) {
        var cfg = this.config;
        var w = cfg ? cfg.tileW : 85;
        var h = cfg ? cfg.tileH : 106;
        var n = tile.node;
        var ax = n && is_valid_1.isValid(n) ? n.anchorX : 0.5;
        var ay = n && is_valid_1.isValid(n) ? n.anchorY : 0.5;
        var minX = tile.x - w * ax;
        var minY = tile.y - h * ay;
        return { minX: minX, maxX: minX + w, minY: minY, maxY: minY + h };
    };
    BoardManager.prototype.pointInTileRect = function (boardX, boardY, tile) {
        var r = this.getTileRectInBoard(tile);
        return boardX >= r.minX && boardX <= r.maxX && boardY >= r.minY && boardY <= r.maxY;
    };
    /** 点击点命中牌（含变暗牌，便于上层遮挡反馈）；重叠取 layer、zIndex 最高 */
    BoardManager.prototype.pickTileAtTouch = function (e) {
        var local = this.touchToBoardLocal(e);
        if (!local)
            return null;
        return this.pickTileAtBoardLocal(local);
    };
    BoardManager.prototype.pickBrightTileAtTouch = function (e) {
        var local = this.touchToBoardLocal(e);
        if (!local)
            return null;
        return this.pickBrightTileAtBoardLocal(local);
    };
    BoardManager.prototype.pickBrightTileAtScreen = function (screenPos) {
        if (!this.boardRoot || !is_valid_1.isValid(this.boardRoot))
            return null;
        var local = this.boardRoot.convertToNodeSpaceAR(screenPos);
        return this.pickBrightTileAtBoardLocal(local);
    };
    BoardManager.prototype.pickTileAtBoardLocal = function (local) {
        var best = null;
        for (var i = 0; i < this.tiles.length; i++) {
            var t = this.tiles[i];
            if (t.removed || !t.node || !is_valid_1.isValid(t.node))
                continue;
            if (t.node.opacity <= 0)
                continue;
            if (!this.pointInTileRect(local.x, local.y, t))
                continue;
            if (!best) {
                best = t;
                continue;
            }
            if (t.layer > best.layer) {
                best = t;
                continue;
            }
            if (t.layer === best.layer && t.node.zIndex > best.node.zIndex) {
                best = t;
            }
        }
        return best;
    };
    BoardManager.prototype.pickBrightTileAtBoardLocal = function (local) {
        var best = null;
        for (var i = 0; i < this.tiles.length; i++) {
            var t = this.tiles[i];
            if (!this.isBrightTile(t))
                continue;
            if (!this.pointInTileRect(local.x, local.y, t))
                continue;
            if (!best) {
                best = t;
                continue;
            }
            if (t.layer > best.layer) {
                best = t;
                continue;
            }
            if (t.layer === best.layer && t.node.zIndex > best.node.zIndex) {
                best = t;
            }
        }
        return best;
    };
    /** 点击不可选牌：两侧夹住则中间闪黑+禁止图标；上层遮挡则压牌竖晃 */
    BoardManager.prototype.playBlockedFeedback = function (tile) {
        if (!this.config || tile.removed || !tile.node || !is_valid_1.isValid(tile.node))
            return;
        var cfg = this.config;
        var board = this.tiles;
        if (BoardRule_1.isCovered(tile, board, cfg)) {
            var covers = BoardRule_1.getCoveringTiles(tile, board, cfg);
            if (covers.length > 0) {
                this.playTileNudge(covers, 0, BLOCK_SHAKE_Y);
                return;
            }
        }
        if (BoardRule_1.isBothSidesBlocked(tile, board, cfg)) {
            var left = BoardRule_1.getSideNeighbor(tile, board, 'left', cfg);
            var right = BoardRule_1.getSideNeighbor(tile, board, 'right', cfg);
            this.playBothSidesBlockedFeedback(tile, left, right);
        }
    };
    /** 左右都有牌：中间闪黑；左右牌横晃；禁止图标出现在中牌与左右牌之间 */
    BoardManager.prototype.playBothSidesBlockedFeedback = function (center, left, right) {
        var _this = this;
        if (!center.node || !is_valid_1.isValid(center.node))
            return;
        this.flashCenterBlocked(center);
        var shakeGroup = [center];
        if (left)
            shakeGroup.push(left);
        if (right)
            shakeGroup.push(right);
        this.playTileNudge(shakeGroup, BLOCK_SHAKE_X, 0);
        this.ensureForbiddenIcon(function () {
            if (left)
                _this.spawnForbiddenBadgeBetween(center, left);
            if (right)
                _this.spawnForbiddenBadgeBetween(center, right);
        });
    };
    BoardManager.prototype.ensureForbiddenIcon = function (done) {
        var _this = this;
        if (this.forbiddenIconSf) {
            done();
            return;
        }
        GameImgAtlas_1.loadGameSpriteFrame(GamePreloadConfig_1.FORBIDDEN_ICON_PATH, function (sf) {
            if (sf) {
                _this.forbiddenIconSf = sf;
            }
            done();
        });
    };
    /** 中间牌短暂变黑再恢复（用预制体 mask，不改变 covered 状态） */
    BoardManager.prototype.flashCenterBlocked = function (tile) {
        if (!tile.node || !is_valid_1.isValid(tile.node))
            return;
        var mask = this.getTileMaskNode(tile.node);
        if (!mask)
            return;
        var wasCovered = tile.covered;
        var wasDimOn = !!tile.dimMaskOn;
        mask.stopAllActions();
        mask.active = true;
        mask.opacity = 0;
        mask.runAction(cc.sequence(cc.fadeTo(BLOCK_CENTER_FLASH_IN, TILE_MASK_OPACITY), cc.delayTime(BLOCK_CENTER_FLASH_HOLD), cc.fadeTo(BLOCK_CENTER_FLASH_OUT, 0), cc.callFunc(function () {
            if (!mask || !is_valid_1.isValid(mask))
                return;
            if (wasCovered || wasDimOn) {
                mask.active = true;
                mask.opacity = TILE_MASK_OPACITY;
            }
            else {
                mask.active = false;
                mask.opacity = TILE_MASK_OPACITY;
            }
        }, this)));
    };
    /** 禁止图标落在中牌与邻牌之间的空隙（两牌中心连线的中点） */
    BoardManager.prototype.spawnForbiddenBadgeBetween = function (center, side) {
        if (!this.forbiddenIconSf)
            return;
        var parent = this.boardRoot && is_valid_1.isValid(this.boardRoot)
            ? this.boardRoot
            : (center.node && is_valid_1.isValid(center.node) ? center.node.parent : null);
        if (!parent || !is_valid_1.isValid(parent))
            return;
        var badge = new cc.Node('ForbiddenBadge');
        badge.setContentSize(BLOCK_FORBIDDEN_SIZE, BLOCK_FORBIDDEN_SIZE);
        var sprite = badge.addComponent(cc.Sprite);
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = this.forbiddenIconSf;
        parent.addChild(badge, 10000);
        badge.setPosition((center.x + side.x) * 0.5, (center.y + side.y) * 0.5);
        badge.opacity = 0;
        var onLeft = side.x < center.x;
        var startAngle = onLeft ? -BLOCK_FORBIDDEN_ROTATE : BLOCK_FORBIDDEN_ROTATE;
        var peakAngle = -startAngle;
        badge.angle = startAngle;
        var overshootScale = BLOCK_FORBIDDEN_SCALE * 1.08;
        badge.setScale(BLOCK_FORBIDDEN_SCALE * 0.5);
        var pop = cc.spawn(cc.fadeIn(BLOCK_FORBIDDEN_POP * 0.55), cc.rotateTo(BLOCK_FORBIDDEN_POP, peakAngle * 1.08).easing(cc.easeBackOut()), cc.scaleTo(BLOCK_FORBIDDEN_POP, overshootScale));
        var springSettle = cc.spawn(cc.rotateTo(BLOCK_FORBIDDEN_SETTLE, 0).easing(cc.easeElasticOut(BLOCK_FORBIDDEN_SPRING)), cc.scaleTo(BLOCK_FORBIDDEN_SETTLE * 0.85, BLOCK_FORBIDDEN_SCALE));
        var rotateSnap = cc.sequence(cc.rotateBy(BLOCK_FORBIDDEN_WIGGLE * 0.45, -7)
            .easing(cc.easeElasticOut(BLOCK_FORBIDDEN_SPRING * 0.9)), cc.rotateBy(BLOCK_FORBIDDEN_WIGGLE * 0.55, 7)
            .easing(cc.easeElasticOut(BLOCK_FORBIDDEN_SPRING * 0.85)));
        badge.runAction(cc.sequence(pop, springSettle, rotateSnap, cc.delayTime(BLOCK_FORBIDDEN_HOLD), cc.spawn(cc.fadeOut(BLOCK_FORBIDDEN_FADE), cc.scaleTo(BLOCK_FORBIDDEN_FADE, BLOCK_FORBIDDEN_SCALE * 0.7)), cc.callFunc(function () {
            if (badge && is_valid_1.isValid(badge))
                badge.destroy();
        }, this)));
    };
    BoardManager.prototype.playTileNudge = function (tiles, offsetX, offsetY) {
        var ox = offsetX;
        var oy = offsetY;
        if (ox === 0 && oy === 0)
            return;
        var step = BLOCK_SHAKE_STEP;
        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            if (tile.removed || !tile.node || !is_valid_1.isValid(tile.node))
                continue;
            var node = tile.node;
            node.stopAllActions();
            node.runAction(cc.sequence(cc.moveBy(step, ox, oy), cc.moveBy(step * 2, -ox * 2, -oy * 2), cc.moveBy(step, ox, oy)));
        }
    };
    BoardManager.prototype.setTileScale = function (tile, scale) {
        if (tile.removed || !tile.node || !is_valid_1.isValid(tile.node))
            return;
        tile.node.setScale(scale);
    };
    BoardManager.prototype.getBaseScale = function (tile) {
        return tile.baseScale !== undefined ? tile.baseScale : 1;
    };
    /** 消除碰撞时播放 Spine 特效（棋盘坐标） */
    BoardManager.prototype.playMatchEliminationEffect = function (x, y) {
        if (!this.boardRoot || !is_valid_1.isValid(this.boardRoot)) {
            return;
        }
        MatchEliminationSpine_1.playMatchEliminationSpine(this.boardRoot, x, y);
    };
    /** 消除靠拢时两牌中心间距（贴边相碰、不重叠） */
    BoardManager.prototype.getMatchMeetCenterGap = function (tile, tight) {
        var cfg = this.config;
        var scale = cfg && cfg.displayScale !== undefined ? cfg.displayScale : 0.5;
        var w = cfg ? cfg.tileW * scale : 85 * 0.5;
        var nodeW = w;
        if (tile && tile.node && is_valid_1.isValid(tile.node)) {
            var measured = tile.node.width * Math.abs(tile.node.scaleX);
            if (measured > 0) {
                nodeW = measured;
            }
        }
        if (tight) {
            return nodeW * 1.1;
        }
        return nodeW + 4;
    };
    BoardManager.prototype.restoreTileScale = function (tile) {
        this.setTileScale(tile, this.getBaseScale(tile));
        this.setTileSelectGlow(tile, false);
        this.setTileSelectOffset(tile, false);
    };
    BoardManager.prototype.highlightTileScale = function (tile, _multiplier) {
        this.setTileSelectGlow(tile, true);
    };
    /** 玩家选中：外圈光效 + 扫光 + 相对中线左右微移 */
    BoardManager.prototype.highlightTileSelect = function (tile, _multiplier) {
        this.setTileSelectGlow(tile, true);
        this.setTileSelectOffset(tile, true);
    };
    BoardManager.prototype.restoreTileSelect = function (tile) {
        this.restoreTileScale(tile);
    };
    /** 消除动画一开始就清掉选中（光效/扫光/偏移），避免与碰撞动画叠在一起 */
    BoardManager.prototype.clearTileSelectForMatch = function (tile) {
        if (!tile.node || !is_valid_1.isValid(tile.node)) {
            return;
        }
        var node = tile.node;
        this.stopTileSelectEffect(node);
        node.stopActionByTag(SELECT_OFFSET_ACTION_TAG);
        node.setPosition(tile.x, tile.y);
        this.setTileScale(tile, this.getBaseScale(tile));
        this.stopTileHintMarquee(tile);
        this.stopTileHintSway(tile);
    };
    /** 当前关卡牌面在 X 方向的中线（用于选中左右偏移） */
    BoardManager.prototype.getBoardCenterX = function () {
        var minX = Infinity;
        var maxX = -Infinity;
        for (var i = 0; i < this.tiles.length; i++) {
            var t = this.tiles[i];
            if (t.removed)
                continue;
            if (t.x < minX)
                minX = t.x;
            if (t.x > maxX)
                maxX = t.x;
        }
        if (!Number.isFinite(minX))
            return 0;
        return (minX + maxX) * 0.5;
    };
    BoardManager.prototype.getSelectShiftX = function (tile) {
        var dx = tile.x - this.getBoardCenterX();
        if (Math.abs(dx) <= SELECT_SHIFT_CENTER_EPS)
            return 0;
        return dx < 0 ? -SELECT_SHIFT_X : SELECT_SHIFT_X;
    };
    BoardManager.prototype.setTileSelectOffset = function (tile, on) {
        if (tile.removed || !tile.node || !is_valid_1.isValid(tile.node))
            return;
        var node = tile.node;
        node.stopActionByTag(SELECT_OFFSET_ACTION_TAG);
        var shift = on ? this.getSelectShiftX(tile) : 0;
        var move = cc.moveTo(SELECT_SHIFT_DURATION, tile.x + shift, tile.y)
            .easing(cc.easeSineOut());
        move.setTag(SELECT_OFFSET_ACTION_TAG);
        node.runAction(move);
    };
    /** 上面无牌且左右无挡牌时，选中可置顶 */
    BoardManager.prototype.shouldRaiseOnSelect = function (tile) {
        return BoardRule_1.isFullyExposed(tile, this.tiles, this.config);
    };
    BoardManager.prototype.applyVisual = function (tile) {
        if (tile.removed || !tile.node || !is_valid_1.isValid(tile.node))
            return;
        tile.node.opacity = 255;
        tile.node.color = cc.Color.WHITE;
        var icon = tile.node.getChildByName('icon');
        if (icon && is_valid_1.isValid(icon)) {
            icon.opacity = 255;
            icon.color = cc.Color.WHITE;
        }
        this.setTileDimMask(tile, tile.covered, 0);
        this.setTileSelectGlow(tile, false);
    };
    BoardManager.prototype.refreshVisuals = function () {
        BoardRule_1.refreshTileStates(this.tiles, this.config);
        for (var i = 0; i < this.tiles.length; i++) {
            var tile = this.tiles[i];
            if (tile.removed)
                continue;
            this.applyVisual(tile);
        }
    };
    BoardManager.prototype.getActiveCount = function () {
        var n = 0;
        for (var i = 0; i < this.tiles.length; i++) {
            if (!this.tiles[i].removed)
                n++;
        }
        return n;
    };
    BoardManager.prototype.getMaxZIndex = function () {
        var maxZ = 0;
        for (var i = 0; i < this.tiles.length; i++) {
            var tile = this.tiles[i];
            if (tile.removed || !tile.node || !is_valid_1.isValid(tile.node))
                continue;
            if (tile.node.zIndex > maxZ)
                maxZ = tile.node.zIndex;
        }
        return maxZ;
    };
    /** 选中 / 提示时置顶，避免放大后被其它牌挡住 */
    BoardManager.prototype.bringTilesToFront = function (tiles) {
        var top = this.getMaxZIndex();
        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            if (tile.removed || !tile.node || !is_valid_1.isValid(tile.node))
                continue;
            if (tile.baseZIndex === undefined) {
                tile.baseZIndex = tile.node.zIndex;
            }
            tile.node.zIndex = top + 1 + i;
        }
    };
    /** 消除过程中：左牌在下、右牌在上 */
    BoardManager.prototype.bringMatchPairToFront = function (left, right) {
        var top = this.getMaxZIndex();
        var lift = function (tile, z) {
            if (!tile.node || !is_valid_1.isValid(tile.node)) {
                return;
            }
            if (tile.baseZIndex === undefined) {
                tile.baseZIndex = tile.node.zIndex;
            }
            tile.node.zIndex = z;
        };
        lift(left, top + 1);
        lift(right, top + 2);
    };
    BoardManager.prototype.restoreTileZIndex = function (tile) {
        if (tile.removed || !tile.node || !is_valid_1.isValid(tile.node))
            return;
        if (tile.baseZIndex !== undefined) {
            tile.node.zIndex = tile.baseZIndex;
        }
    };
    BoardManager.prototype.restoreTilesZIndex = function (tiles) {
        for (var i = 0; i < tiles.length; i++) {
            this.restoreTileZIndex(tiles[i]);
        }
    };
    return BoardManager;
}());
exports.BoardManager = BoardManager;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvY29yZS9Cb2FyZE1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsd0NBQXNDO0FBQ3RDLGdEQUE0RDtBQUU1RCx5Q0FPcUI7QUFDckIsNkNBQXFEO0FBRXJELDZEQVFpQztBQUNqQyx5REFBZ0Y7QUFDaEYsbURBQTRFO0FBQzVFLHFFQUF3RTtBQUV4RSxJQUFNLFNBQVMsR0FBRyxrQ0FBYyxDQUFDO0FBQ2pDLElBQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQztBQUN6QixrREFBa0Q7QUFDbEQsSUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDO0FBQzlCLElBQU0sa0JBQWtCLEdBQUcsVUFBVSxDQUFDO0FBQ3RDLElBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQztBQUM5QixJQUFNLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDMUIsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBQzVCLG9EQUFvRDtBQUNwRCxJQUFNLFlBQVksR0FBRztJQUNqQixFQUFFLEVBQUUsQ0FBQztJQUNMLEVBQUUsRUFBRSxDQUFDO0lBQ0wsUUFBUSxFQUFFLENBQUM7SUFDWCxJQUFJLEVBQUUsQ0FBQztJQUNQLElBQUksRUFBRSxDQUFDO0NBQ1YsQ0FBQztBQUNGLElBQU0sZUFBZSxHQUFHLGNBQWMsQ0FBQztBQUN2QyxJQUFNLG9CQUFvQixHQUFHLG1CQUFtQixDQUFDO0FBQ2pELElBQU0sc0JBQXNCLEdBQUcsY0FBYyxDQUFDO0FBQzlDLHFEQUFxRDtBQUNyRCxJQUFNLG1CQUFtQixHQUFHLEdBQUcsQ0FBQztBQUNoQyxJQUFNLHlCQUF5QixHQUFHLGlCQUFpQixDQUFDO0FBQ3BELElBQU0sa0JBQWtCLEdBQUcsS0FBSyxDQUFDO0FBQ2pDLElBQU0sb0JBQW9CLEdBQUcsaUJBQWlCLENBQUM7QUFDL0MsSUFBTSxrQkFBa0IsR0FBRyxLQUFLLENBQUM7QUFDakMsSUFBTSxrQkFBa0IsR0FBRyxDQUFDLEVBQUUsQ0FB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QixVQUFrQixJQUFlO1FBQzdCLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxrQkFBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFBRSxPQUFPO1FBQzlELElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUU7WUFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztTQUN0QztJQUNMLENBQUM7SUFFRCx5Q0FBa0IsR0FBbEIsVUFBbUIsS0FBa0I7UUFDakMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3BDO0lBQ0wsQ0FBQztJQUNMLG1CQUFDO0FBQUQsQ0EzbERBLEFBMmxEQyxJQUFBO0FBM2xEWSxvQ0FBWSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzVmFsaWQgfSBmcm9tICcuLi9pcy12YWxpZCc7XG5pbXBvcnQgeyBUaWxlTW9kZWwsIGdldFRpbGVLaW5kIH0gZnJvbSAnLi4vbW9kZWwvVGlsZU1vZGVsJztcbmltcG9ydCB7IExldmVsQ29uZmlnIH0gZnJvbSAnLi4vbW9kZWwvTGV2ZWxDb25maWcnO1xuaW1wb3J0IHtcbiAgICByZWZyZXNoVGlsZVN0YXRlcyxcbiAgICBpc0Z1bGx5RXhwb3NlZCxcbiAgICBpc0NvdmVyZWQsXG4gICAgaXNCb3RoU2lkZXNCbG9ja2VkLFxuICAgIGdldFNpZGVOZWlnaGJvcixcbiAgICBnZXRDb3ZlcmluZ1RpbGVzLFxufSBmcm9tICcuL0JvYXJkUnVsZSc7XG5pbXBvcnQgeyBnZW5lcmF0ZVNvbHZhYmxlS2V5cyB9IGZyb20gJy4vTGV2ZWxTb2x2ZXInO1xuXG5pbXBvcnQge1xuICAgIEZPUkJJRERFTl9JQ09OX1BBVEgsXG4gICAgR1VJREVfSEFORF9QQVRILFxuICAgIEdVSURFX0hBTkRfU1RZTEUsXG4gICAgSElOVF9TV0FZX1NUWUxFLFxuICAgIFNFTEVDVF9TV0VFUF9TVFlMRSxcbiAgICBUSUxFX0lDT05fUEFUSCxcbiAgICBaX09SREVSLFxufSBmcm9tICcuLi91aS9HYW1lUHJlbG9hZENvbmZpZyc7XG5pbXBvcnQgVGlsZUhpbnRNYXJxdWVlLCB7IHRpbGVGYWNlQm91bmRzRnJvbVRyaW0gfSBmcm9tICcuLi91aS9UaWxlSGludE1hcnF1ZWUnO1xuaW1wb3J0IHsgZ2V0Q2FjaGVkVGlsZUljb24sIGxvYWRHYW1lU3ByaXRlRnJhbWUgfSBmcm9tICcuLi91aS9HYW1lSW1nQXRsYXMnO1xuaW1wb3J0IHsgcGxheU1hdGNoRWxpbWluYXRpb25TcGluZSB9IGZyb20gJy4uL3VpL01hdGNoRWxpbWluYXRpb25TcGluZSc7XG5cbmNvbnN0IElDT05fUEFUSCA9IFRJTEVfSUNPTl9QQVRIO1xuY29uc3QgWl9MQVlFUl9TVEVQID0gMTAwO1xuLyoqIOmihOWItuS9k+mBrum7kSAvIOmAieS4reWFieaViOiKgueCue+8iG1qLnByZWZhYiDihpIgbWFzayAvIHNlbGVjdGVk77yJICovXG5jb25zdCBUSUxFX01BU0tfTkFNRSA9ICdtYXNrJztcbmNvbnN0IFRJTEVfU0VMRUNURURfTkFNRSA9ICdzZWxlY3RlZCc7XG5jb25zdCBUSUxFX0lDT05fTkFNRSA9ICdpY29uJztcbmNvbnN0IFRJTEVfRElfTkFNRSA9ICdkaSc7XG5jb25zdCBUSUxFX0ZBQ0VfTkFNRSA9ICd1cCc7XG4vKiog5ZCM54i26IqC54K55LiL57uY5Yi26aG65bqP77yac2VsZWN0ZWQg5YWJ5pWI5Zyo5LiL77yMaWNvbiDniYzpnaLlnKjkuIrvvIxtYXNrIOacgOmhtu+8iOWOi+aal++8iSAqL1xuY29uc3QgVElMRV9DSElMRF9aID0ge1xuICAgIGRpOiAwLFxuICAgIHVwOiAxLFxuICAgIHNlbGVjdGVkOiAyLFxuICAgIGljb246IDMsXG4gICAgbWFzazogNCxcbn07XG5jb25zdCBUSUxFX1NXRUVQX05BTUUgPSAnc2VsZWN0X3N3ZWVwJztcbmNvbnN0IFRJTEVfU1dFRVBfQ0xJUF9OQU1FID0gJ3NlbGVjdF9zd2VlcF9jbGlwJztcbmNvbnN0IFRJTEVfSElOVF9NQVJRVUVFX05BTUUgPSAnaGludF9tYXJxdWVlJztcbi8qKiDmj5DnpLrot5Hpqaznga/vvJrmjILlnKggaGludF9zd2F5X3Bpdm90IOS4iumaj+eJjOaZg+WKqO+8jHog6auY5LqOIHBpdm90IOWGheWtkOiKgueCuSAqL1xuY29uc3QgVElMRV9ISU5UX01BUlFVRUVfWiA9IDEwMDtcbmNvbnN0IFRJTEVfSElOVF9TV0FZX1BJVk9UX05BTUUgPSAnaGludF9zd2F5X3Bpdm90JztcbmNvbnN0IFRJTEVfSElOVF9TV0FZX1RBRyA9IDg4MDMxO1xuY29uc3QgR1VJREVfSEFORF9OT0RFX05BTUUgPSAnaGludF9ndWlkZV9oYW5kJztcbmNvbnN0IEdVSURFX0hBTkRfVEFQX1RBRyA9IDg4MDMyO1xuY29uc3QgR1VJREVfSEFORF9QUkVTU19ZID0gLTE2O1xuY29uc3QgR1VJREVfSEFORF9QUkVTU19TQ0FMRSA9IDAuODY7XG5jb25zdCBHVUlERV9IQU5EX1BSRVNTX0lOID0gMC4xMjtcbmNvbnN0IEdVSURFX0hBTkRfUFJFU1NfSE9MRCA9IDAuMDU7XG5jb25zdCBHVUlERV9IQU5EX1BSRVNTX09VVCA9IDAuMTQ7XG5jb25zdCBHVUlERV9IQU5EX1RBUF9HQVAgPSAwLjQyO1xuY29uc3QgVElMRV9NQVNLX09QQUNJVFkgPSAyNTU7XG4vKiog6YCJ5Lit77ya5aSW5ZyI5ZG85ZC4ICsg5omr5YWJ77yI5omr5YWJ5Zyo54mM6Z2iIHVwIOefqeW9oumBrue9qeWGhe+8iSAqL1xuY29uc3QgU0VMRUNUX0dMT1dfUFVMU0UgPSAwLjUyO1xuY29uc3QgU0VMRUNUX1BPUF9JTiA9IDAuMTQ7XG4vKiog6YCJ5Lit77ya55u45a+55qOL55uY5Lit57q/77yM5bem5L6n5b6A5bem44CB5Y+z5L6n5b6A5Y+z5b6u56e7ICovXG5jb25zdCBTRUxFQ1RfU0hJRlRfWCA9IDEwO1xuY29uc3QgU0VMRUNUX1NISUZUX0RVUkFUSU9OID0gMC4xO1xuY29uc3QgU0VMRUNUX1NISUZUX0NFTlRFUl9FUFMgPSAyO1xuY29uc3QgU0VMRUNUX09GRlNFVF9BQ1RJT05fVEFHID0gODgwMjE7XG4vKiog5YWl5Zy677ya5bGP5aSW6JC95LiLIOKGkiDmjInlsYLngJHluIPokL3niYwg4oaSIOavj+WxguiQveWujOWNs+WPmOaalyDihpIg5YaN6JC95LiL5LiA5bGCICovXG5jb25zdCBFTlRSQU5DRV9EUk9QX0FCT1ZFX01BWCA9IDMwMDtcbmNvbnN0IEVOVFJBTkNFX0lOVFJBX1NUQUdHRVIgPSAwLjAwNjtcbmNvbnN0IEVOVFJBTkNFX0RST1BfRFVSQVRJT04gPSAwLjE7XG5jb25zdCBFTlRSQU5DRV9ESU1fRFVSQVRJT04gPSAwLjA4O1xuY29uc3QgRU5UUkFOQ0VfTEFZRVJfR0FQID0gMC4wMztcblxuLyoqIOS4jeWPr+mAieaXtueahOaZg+WKqOWPjemmiCAqL1xuY29uc3QgQkxPQ0tfU0hBS0VfWCA9IDEwO1xuY29uc3QgQkxPQ0tfU0hBS0VfWSA9IDg7XG5jb25zdCBCTE9DS19TSEFLRV9TVEVQID0gMC4wNDU7XG5cbi8qKiDlt6blj7PlpLnkvY/vvJrkuK3pl7Tpl6rpu5EgKyDkuKTkvqfnpoHmraLlm77moIfml4vovazlm57lvLkgKi9cbmNvbnN0IEJMT0NLX0NFTlRFUl9GTEFTSF9JTiA9IDAuMDY7XG5jb25zdCBCTE9DS19DRU5URVJfRkxBU0hfSE9MRCA9IDAuMTtcbmNvbnN0IEJMT0NLX0NFTlRFUl9GTEFTSF9PVVQgPSAwLjEyO1xuY29uc3QgQkxPQ0tfRk9SQklEREVOX1NJWkUgPSA1MDtcbmNvbnN0IEJMT0NLX0ZPUkJJRERFTl9TQ0FMRSA9IDAuODtcbmNvbnN0IEJMT0NLX0ZPUkJJRERFTl9ST1RBVEUgPSAzMjtcbmNvbnN0IEJMT0NLX0ZPUkJJRERFTl9QT1AgPSAwLjA5O1xuY29uc3QgQkxPQ0tfRk9SQklEREVOX1NFVFRMRSA9IDAuMjtcbmNvbnN0IEJMT0NLX0ZPUkJJRERFTl9XSUdHTEUgPSAwLjA5O1xuY29uc3QgQkxPQ0tfRk9SQklEREVOX0hPTEQgPSAwLjA2O1xuY29uc3QgQkxPQ0tfRk9SQklEREVOX0ZBREUgPSAwLjA3O1xuLyoqIOaXi+i9rOW8ueewp++8mnBlcmlvZCDotorlsI/lm57lvLnotorlv6sgKi9cbmNvbnN0IEJMT0NLX0ZPUkJJRERFTl9TUFJJTkcgPSAwLjExO1xuXG5leHBvcnQgY2xhc3MgQm9hcmRNYW5hZ2VyIHtcbiAgICBjb25maWc6IExldmVsQ29uZmlnID0gbnVsbDtcbiAgICB0aWxlczogVGlsZU1vZGVsW10gPSBbXTtcbiAgICBzcHJpdGVDYWNoZTogeyBba2V5OiBzdHJpbmddOiBjYy5TcHJpdGVGcmFtZSB9ID0ge307XG4gICAgZW50cmFuY2VQbGF5aW5nID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBib2FyZFJvb3Q6IGNjLk5vZGUgPSBudWxsO1xuICAgIHByaXZhdGUgZm9yYmlkZGVuSWNvblNmOiBjYy5TcHJpdGVGcmFtZSA9IG51bGw7XG4gICAgcHJpdmF0ZSBndWlkZUhhbmRTZjogY2MuU3ByaXRlRnJhbWUgPSBudWxsO1xuICAgIHByaXZhdGUgZ3VpZGVIYW5kTm9kZTogY2MuTm9kZSA9IG51bGw7XG4gICAgcHJpdmF0ZSBndWlkZUhhbmRUYXJnZXRUaWxlOiBUaWxlTW9kZWwgPSBudWxsO1xuICAgIHByaXZhdGUgZ3VpZGVIYW5kVGFwUnVubmluZyA9IGZhbHNlO1xuICAgIHByaXZhdGUgZ3VpZGVIYW5kQmFzZVggPSAwO1xuICAgIHByaXZhdGUgZ3VpZGVIYW5kQmFzZVkgPSAwO1xuICAgIHByaXZhdGUgZ3VpZGVIYW5kQmFzZVNjYWxlID0gMTtcbiAgICBwcml2YXRlIGhpbnRHdWlkZVRpbGVzOiBUaWxlTW9kZWxbXSA9IFtdO1xuXG4gICAgcHJpdmF0ZSByZXNvbHZlS2V5cygpOiBzdHJpbmdbXSB8IG51bGwge1xuICAgICAgICBjb25zdCBzbG90Q291bnQgPSB0aGlzLmNvbmZpZy5zbG90cy5sZW5ndGg7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5rZXlzICYmIHRoaXMuY29uZmlnLmtleXMubGVuZ3RoID09PSBzbG90Q291bnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5rZXlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnZW5lcmF0ZVNvbHZhYmxlS2V5cyh0aGlzLmNvbmZpZyk7XG4gICAgfVxuXG4gICAgbG9hZExldmVsKHBhdGg6IHN0cmluZywgb25SZWFkeTogKGVycj86IHN0cmluZykgPT4gdm9pZCwgY2FjaGVkTGV2ZWw/OiBjYy5Kc29uQXNzZXQpOiB2b2lkIHtcbiAgICAgICAgaWYgKGNhY2hlZExldmVsKSB7XG4gICAgICAgICAgICB0aGlzLmFwcGx5TGV2ZWxBc3NldChjYWNoZWRMZXZlbCwgb25SZWFkeSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY2MucmVzb3VyY2VzLmxvYWQocGF0aCwgY2MuSnNvbkFzc2V0LCAoZXJyLCBhc3NldDogY2MuSnNvbkFzc2V0KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgb25SZWFkeSgn5YWz5Y2h5Yqg6L295aSx6LSlJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hcHBseUxldmVsQXNzZXQoYXNzZXQsIG9uUmVhZHkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFwcGx5TGV2ZWxBc3NldChhc3NldDogY2MuSnNvbkFzc2V0LCBvblJlYWR5OiAoZXJyPzogc3RyaW5nKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gYXNzZXQuanNvbiBhcyBMZXZlbENvbmZpZztcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5zbG90cyB8fCB0aGlzLmNvbmZpZy5zbG90cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIG9uUmVhZHkoJ+WFs+WNoeaVsOaNruS4uuepuicpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGtleXMgPSB0aGlzLnJlc29sdmVLZXlzKCk7XG4gICAgICAgIGlmICgha2V5cykge1xuICAgICAgICAgICAgb25SZWFkeSgn5peg5rOV55Sf5oiQ5Y+v6Kej5YWz5Y2h77yM6K+35qOA5p+l5biD5bGAJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdW5pcXVlS2V5czogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodW5pcXVlS2V5cy5pbmRleE9mKGtleXNbaV0pID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHVuaXF1ZUtleXMucHVzaChrZXlzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvYWRTcHJpdGVzKHVuaXF1ZUtleXMsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYnVpbGRUaWxlcyhrZXlzKTtcbiAgICAgICAgICAgIG9uUmVhZHkoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkU3ByaXRlcyhrZXlzOiBzdHJpbmdbXSwgZG9uZTogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgICBsZXQgbG9hZGVkID0gMDtcbiAgICAgICAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmluaXNoT25lID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgbG9hZGVkKys7XG4gICAgICAgICAgICBpZiAobG9hZGVkID09PSBrZXlzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgICAgY29uc3QgY2FjaGVkID0gZ2V0Q2FjaGVkVGlsZUljb24oa2V5KTtcbiAgICAgICAgICAgIGlmIChjYWNoZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZUNhY2hlW2tleV0gPSBjYWNoZWQ7XG4gICAgICAgICAgICAgICAgZmluaXNoT25lKCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2FkR2FtZVNwcml0ZUZyYW1lKElDT05fUEFUSCArIGtleSwgKHNmKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHNmKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlQ2FjaGVba2V5XSA9IHNmO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaW5pc2hPbmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBidWlsZFRpbGVzKGtleXM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgICAgIHRoaXMudGlsZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvbmZpZy5zbG90cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgc2xvdCA9IHRoaXMuY29uZmlnLnNsb3RzW2ldO1xuICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICAgIHRoaXMudGlsZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgaWQ6IGksXG4gICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAga2luZDogZ2V0VGlsZUtpbmQoa2V5KSxcbiAgICAgICAgICAgICAgICBsYXllcjogc2xvdC5sYXllcixcbiAgICAgICAgICAgICAgICB4OiBzbG90LngsXG4gICAgICAgICAgICAgICAgeTogc2xvdC55LFxuICAgICAgICAgICAgICAgIHJlbW92ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGZyZWU6IHRydWUsXG4gICAgICAgICAgICAgICAgY292ZXJlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgbm9kZTogbnVsbCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJlZnJlc2hUaWxlU3RhdGVzKHRoaXMudGlsZXMsIHRoaXMuY29uZmlnKTtcbiAgICB9XG5cbiAgICAvKiog5o2i54mM6Z2i77yaVFJJTU1FRCDkv53mjIHmr5TkvovvvIznlLHpooTliLbkvZMgc2NhbGUg5o6n5Yi25pW05L2T5aSn5bCPICovXG4gICAgcHJpdmF0ZSBhcHBseVRpbGVJY29uKGljb246IGNjLk5vZGUsIGtleTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHNmID0gdGhpcy5zcHJpdGVDYWNoZVtrZXldO1xuICAgICAgICBpZiAoIXNmKSByZXR1cm47XG4gICAgICAgIGNvbnN0IHNwcml0ZSA9IGljb24uZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgIGlmICghc3ByaXRlKSByZXR1cm47XG4gICAgICAgIHNwcml0ZS5zaXplTW9kZSA9IGNjLlNwcml0ZS5TaXplTW9kZS5UUklNTUVEO1xuICAgICAgICBzcHJpdGUuc3ByaXRlRnJhbWUgPSBzZjtcbiAgICB9XG5cbiAgICBzcGF3bih0aWxlUHJlZmFiOiBjYy5QcmVmYWIsIHBhcmVudDogY2MuTm9kZSwgb25Cb2FyZFJlYWR5PzogKCkgPT4gdm9pZCwgb25FbnRyYW5jZURvbmU/OiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYm9hcmRSb290ID0gcGFyZW50O1xuICAgICAgICB0aGlzLmVuc3VyZUZvcmJpZGRlbkljb24oKCkgPT4ge30pO1xuICAgICAgICBjb25zdCBkcm9wWSA9IHRoaXMuZ2V0RW50cmFuY2VEcm9wWSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLnRpbGVzW2ldO1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGNjLmluc3RhbnRpYXRlKHRpbGVQcmVmYWIpO1xuICAgICAgICAgICAgbm9kZS5zZXRQb3NpdGlvbih0aWxlLngsIGRyb3BZKTtcbiAgICAgICAgICAgIHBhcmVudC5hZGRDaGlsZChub2RlKTtcbiAgICAgICAgICAgIHRpbGUubm9kZSA9IG5vZGU7XG4gICAgICAgICAgICB0aWxlLmJhc2VTY2FsZSA9IG5vZGUuc2NhbGVYO1xuXG4gICAgICAgICAgICBjb25zdCBpY29uID0gbm9kZS5nZXRDaGlsZEJ5TmFtZSgnaWNvbicpO1xuICAgICAgICAgICAgaWYgKGljb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5VGlsZUljb24oaWNvbiwgdGlsZS5rZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pbml0VGlsZU1hc2sobm9kZSwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5zdG9wVGlsZVNlbGVjdEVmZmVjdChub2RlKTtcbiAgICAgICAgICAgIHRoaXMuZW5zdXJlVGlsZUNoaWxkTGF5ZXJPcmRlcihub2RlKTtcbiAgICAgICAgICAgIHRpbGUuZGltTWFza09uID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnNldFRpbGVFbnRyYW5jZUhpZGRlbih0aWxlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFwcGx5U2FtZUxheWVyRGVwdGhPcmRlcigpO1xuICAgICAgICByZWZyZXNoVGlsZVN0YXRlcyh0aGlzLnRpbGVzLCB0aGlzLmNvbmZpZyk7XG4gICAgICAgIGlmIChvbkJvYXJkUmVhZHkpIHtcbiAgICAgICAgICAgIG9uQm9hcmRSZWFkeSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGxheUVudHJhbmNlQW5pbShkcm9wWSwgb25FbnRyYW5jZURvbmUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWQjOWxgueri+S9k+aEn+WPoOaUvu+8muWPs+S4i+acgOWJje+8iHkg5bCP44CBeCDlpKcgeiDmnIDpq5jvvInvvIzlt6bkuIrmnIDlkI5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFwcGx5U2FtZUxheWVyRGVwdGhPcmRlcigpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZ3JvdXBzOiB7IFtsYXllcjogbnVtYmVyXTogVGlsZU1vZGVsW10gfSA9IHt9O1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLnRpbGVzW2ldO1xuICAgICAgICAgICAgaWYgKHRpbGUucmVtb3ZlZCkgY29udGludWU7XG4gICAgICAgICAgICBpZiAoIWdyb3Vwc1t0aWxlLmxheWVyXSkge1xuICAgICAgICAgICAgICAgIGdyb3Vwc1t0aWxlLmxheWVyXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ3JvdXBzW3RpbGUubGF5ZXJdLnB1c2godGlsZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsYXllcklkczogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gZ3JvdXBzKSB7XG4gICAgICAgICAgICBpZiAoZ3JvdXBzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBsYXllcklkcy5wdXNoKHBhcnNlSW50KGtleSwgMTApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsYXllcklkcy5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG5cbiAgICAgICAgZm9yIChsZXQgbGkgPSAwOyBsaSA8IGxheWVySWRzLmxlbmd0aDsgbGkrKykge1xuICAgICAgICAgICAgY29uc3QgbGF5ZXIgPSBsYXllcklkc1tsaV07XG4gICAgICAgICAgICBjb25zdCBncm91cCA9IGdyb3Vwc1tsYXllcl07XG4gICAgICAgICAgICBncm91cC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGEueSAhPT0gYi55KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiLnkgLSBhLnk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBhLnggLSBiLng7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0aWxlID0gZ3JvdXBbaV07XG4gICAgICAgICAgICAgICAgY29uc3QgeiA9IGxheWVyICogWl9MQVlFUl9TVEVQICsgaTtcbiAgICAgICAgICAgICAgICB0aWxlLmJhc2VaSW5kZXggPSB6O1xuICAgICAgICAgICAgICAgIGlmICh0aWxlLm5vZGUgJiYgaXNWYWxpZCh0aWxlLm5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpbGUubm9kZS56SW5kZXggPSB6O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiDlsY/lpJbotbflp4vpq5jluqbvvJrmnIDpq5jniYzpnaLkuYvkuIrlho3miqzpq5jkuIDmrrUgKi9cbiAgICBwcml2YXRlIGdldEVudHJhbmNlRHJvcFkoKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IG1heFkgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRpbGVzW2ldLnkgPiBtYXhZKSBtYXhZID0gdGhpcy50aWxlc1tpXS55O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXhZICsgRU5UUkFOQ0VfRFJPUF9BQk9WRV9NQVg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRUaWxlRW50cmFuY2VIaWRkZW4odGlsZTogVGlsZU1vZGVsKTogdm9pZCB7XG4gICAgICAgIGlmICghdGlsZS5ub2RlIHx8ICFpc1ZhbGlkKHRpbGUubm9kZSkpIHJldHVybjtcbiAgICAgICAgdGlsZS5ub2RlLm9wYWNpdHkgPSAwO1xuICAgIH1cblxuICAgIC8qKiDlhaXlnLrokL3kuIvov4fnqIvkuK3kv53mjIHpq5jkuq7vvIzkuI3kvZPnjrDpga7mjKEgKi9cbiAgICBwcml2YXRlIGFwcGx5RW50cmFuY2VCcmlnaHQodGlsZTogVGlsZU1vZGVsKTogdm9pZCB7XG4gICAgICAgIGlmICghdGlsZS5ub2RlIHx8ICFpc1ZhbGlkKHRpbGUubm9kZSkpIHJldHVybjtcbiAgICAgICAgdGlsZS5ub2RlLm9wYWNpdHkgPSAyNTU7XG4gICAgICAgIHRpbGUubm9kZS5jb2xvciA9IGNjLkNvbG9yLldISVRFO1xuICAgICAgICBjb25zdCBpY29uID0gdGlsZS5ub2RlLmdldENoaWxkQnlOYW1lKCdpY29uJyk7XG4gICAgICAgIGlmIChpY29uICYmIGlzVmFsaWQoaWNvbikpIHtcbiAgICAgICAgICAgIGljb24ub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgICAgIGljb24uY29sb3IgPSBjYy5Db2xvci5XSElURTtcbiAgICAgICAgfVxuICAgICAgICB0aWxlLmRpbU1hc2tPbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLmluaXRUaWxlTWFzayh0aWxlLm5vZGUsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5zdG9wVGlsZVNlbGVjdEVmZmVjdCh0aWxlLm5vZGUpO1xuICAgIH1cblxuICAgIC8qKiDor7vlj5bpooTliLbkvZPpobblsYLpga7pu5HvvIjkuI3ov5DooYzml7bliJvlu7rvvIkgKi9cbiAgICBwcml2YXRlIGdldFRpbGVNYXNrTm9kZShyb290OiBjYy5Ob2RlKTogY2MuTm9kZSB8IG51bGwge1xuICAgICAgICBpZiAoIXJvb3QgfHwgIWlzVmFsaWQocm9vdCkpIHJldHVybiBudWxsO1xuICAgICAgICBjb25zdCBtYXNrID0gcm9vdC5nZXRDaGlsZEJ5TmFtZShUSUxFX01BU0tfTkFNRSk7XG4gICAgICAgIHJldHVybiBtYXNrICYmIGlzVmFsaWQobWFzaykgPyBtYXNrIDogbnVsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFRpbGVTZWxlY3RlZE5vZGUocm9vdDogY2MuTm9kZSk6IGNjLk5vZGUgfCBudWxsIHtcbiAgICAgICAgaWYgKCFyb290IHx8ICFpc1ZhbGlkKHJvb3QpKSByZXR1cm4gbnVsbDtcbiAgICAgICAgbGV0IHNlbGVjdGVkID0gcm9vdC5nZXRDaGlsZEJ5TmFtZShUSUxFX1NFTEVDVEVEX05BTUUpO1xuICAgICAgICBpZiAoIXNlbGVjdGVkIHx8ICFpc1ZhbGlkKHNlbGVjdGVkKSkge1xuICAgICAgICAgICAgY29uc3Qgd2FsayA9IChub2RlOiBjYy5Ob2RlKTogY2MuTm9kZSB8IG51bGwgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLm5hbWUgPT09IFRJTEVfU0VMRUNURURfTkFNRSkgcmV0dXJuIG5vZGU7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBoaXQgPSB3YWxrKG5vZGUuY2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaGl0KSByZXR1cm4gaGl0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzZWxlY3RlZCA9IHdhbGsocm9vdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNlbGVjdGVkICYmIGlzVmFsaWQoc2VsZWN0ZWQpID8gc2VsZWN0ZWQgOiBudWxsO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RmFjZVRyaW1Cb3VuZHMoZmFjZTogY2MuTm9kZSk6IHsgbGVmdDogbnVtYmVyOyByaWdodDogbnVtYmVyOyBib3R0b206IG51bWJlcjsgdG9wOiBudW1iZXIgfSB7XG4gICAgICAgIGNvbnN0IHNjYWxlWCA9IE1hdGguYWJzKGZhY2Uuc2NhbGVYKTtcbiAgICAgICAgY29uc3Qgc2NhbGVZID0gTWF0aC5hYnMoZmFjZS5zY2FsZVkpO1xuICAgICAgICByZXR1cm4gdGlsZUZhY2VCb3VuZHNGcm9tVHJpbShmYWNlLndpZHRoLCBmYWNlLmhlaWdodCwgc2NhbGVYLCBzY2FsZVkpO1xuICAgIH1cblxuICAgIC8qKiDot5Hpqaznga/niLboioLngrnvvJrkvJjlhYggaGludF9zd2F5X3Bpdm9077yM5LiO54mM6Z2i5LiA6LW35pmD5YqoICovXG4gICAgcHJpdmF0ZSBnZXRIaW50TWFycXVlZVBhcmVudChyb290OiBjYy5Ob2RlKTogY2MuTm9kZSB7XG4gICAgICAgIGNvbnN0IHBpdm90ID0gcm9vdC5nZXRDaGlsZEJ5TmFtZShUSUxFX0hJTlRfU1dBWV9QSVZPVF9OQU1FKTtcbiAgICAgICAgcmV0dXJuIHBpdm90ICYmIGlzVmFsaWQocGl2b3QpID8gcGl2b3QgOiByb290O1xuICAgIH1cblxuICAgIC8qKiDot5Hpqaznga/lr7npvZDniYzpnaLlj6/op4HljLrln58gKi9cbiAgICBwcml2YXRlIGFsaWduSGludE1hcnF1ZWVUb0ZhY2UobWFycXVlZTogY2MuTm9kZSwgZmFjZTogY2MuTm9kZSwgX3Jvb3Q6IGNjLk5vZGUpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgYm91bmRzID0gdGhpcy5nZXRGYWNlVHJpbUJvdW5kcyhmYWNlKTtcbiAgICAgICAgY29uc3QgdyA9IGJvdW5kcy5yaWdodCAtIGJvdW5kcy5sZWZ0O1xuICAgICAgICBjb25zdCBoID0gYm91bmRzLnRvcCAtIGJvdW5kcy5ib3R0b207XG4gICAgICAgIGNvbnN0IGN4ID0gKGJvdW5kcy5sZWZ0ICsgYm91bmRzLnJpZ2h0KSAqIDAuNTtcbiAgICAgICAgY29uc3QgY3kgPSAoYm91bmRzLmJvdHRvbSArIGJvdW5kcy50b3ApICogMC41O1xuICAgICAgICBjb25zdCB3b3JsZCA9IGZhY2UuY29udmVydFRvV29ybGRTcGFjZUFSKGNjLnYyKGN4LCBjeSkpO1xuICAgICAgICBjb25zdCBwYXJlbnQgPSBtYXJxdWVlLnBhcmVudDtcbiAgICAgICAgY29uc3QgbG9jYWwgPSBwYXJlbnQuY29udmVydFRvTm9kZVNwYWNlQVIod29ybGQpO1xuICAgICAgICBtYXJxdWVlLnNldEFuY2hvclBvaW50KDAuNSwgMC41KTtcbiAgICAgICAgbWFycXVlZS5zZXRQb3NpdGlvbihsb2NhbC54LCBsb2NhbC55KTtcbiAgICAgICAgbWFycXVlZS5zZXRDb250ZW50U2l6ZSh3LCBoKTtcbiAgICAgICAgbWFycXVlZS5zZXRTY2FsZSgxKTtcbiAgICAgICAgbWFycXVlZS5hbmdsZSA9IGZhY2UuYW5nbGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaW5kSGludE1hcnF1ZWVOb2RlKHJvb3Q6IGNjLk5vZGUpOiBjYy5Ob2RlIHwgbnVsbCB7XG4gICAgICAgIGlmICghcm9vdCB8fCAhaXNWYWxpZChyb290KSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGl2b3QgPSByb290LmdldENoaWxkQnlOYW1lKFRJTEVfSElOVF9TV0FZX1BJVk9UX05BTUUpO1xuICAgICAgICBpZiAocGl2b3QgJiYgaXNWYWxpZChwaXZvdCkpIHtcbiAgICAgICAgICAgIGNvbnN0IG9uUGl2b3QgPSBwaXZvdC5nZXRDaGlsZEJ5TmFtZShUSUxFX0hJTlRfTUFSUVVFRV9OQU1FKTtcbiAgICAgICAgICAgIGlmIChvblBpdm90ICYmIGlzVmFsaWQob25QaXZvdCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb25QaXZvdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgbm9kZSA9IHJvb3QuZ2V0Q2hpbGRCeU5hbWUoVElMRV9ISU5UX01BUlFVRUVfTkFNRSk7XG4gICAgICAgIGlmIChub2RlICYmIGlzVmFsaWQobm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZhY2UgPSB0aGlzLmdldFRpbGVGYWNlTm9kZShyb290KTtcbiAgICAgICAgaWYgKGZhY2UpIHtcbiAgICAgICAgICAgIG5vZGUgPSBmYWNlLmdldENoaWxkQnlOYW1lKFRJTEVfSElOVF9NQVJRVUVFX05BTUUpO1xuICAgICAgICAgICAgaWYgKG5vZGUgJiYgaXNWYWxpZChub2RlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKiDmuIXnkIbmo4vnm5jlsYLpgZfnlZnnmoTot5Hpqaznga/oioLngrnvvIjlkKvmjILlnKjniYwgcGl2b3Qg5LiL55qE77yJICovXG4gICAgcHJpdmF0ZSBkZXN0cm95Qm9hcmRIaW50TWFycXVlZXMoKTogdm9pZCB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50aWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdGlsZSA9IHRoaXMudGlsZXNbaV07XG4gICAgICAgICAgICBpZiAoIXRpbGUucmVtb3ZlZCAmJiB0aWxlLm5vZGUgJiYgaXNWYWxpZCh0aWxlLm5vZGUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wVGlsZUhpbnRNYXJxdWVlKHRpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5ib2FyZFJvb3QgfHwgIWlzVmFsaWQodGhpcy5ib2FyZFJvb3QpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLmJvYXJkUm9vdC5jaGlsZHJlbi5zbGljZSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKCFjaGlsZCB8fCAhaXNWYWxpZChjaGlsZCkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjaGlsZC5uYW1lLmluZGV4T2YoVElMRV9ISU5UX01BUlFVRUVfTkFNRSkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBjaGlsZC5kZXN0cm95KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiog5Y+W5raI5qOL55uY5LiK5omA5pyJ6LeR6ams54GvIC8g5pmD5Yqo5o+Q56S6ICovXG4gICAgY2xlYXJBbGxHdWlkZU1hcnF1ZWVzKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBndWlkZWQgPSB0aGlzLmhpbnRHdWlkZVRpbGVzLnNsaWNlKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3VpZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnJlc3RvcmVUaWxlSGludChndWlkZWRbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaGludEd1aWRlVGlsZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0aWxlID0gdGhpcy50aWxlc1tpXTtcbiAgICAgICAgICAgIGlmICh0aWxlLnJlbW92ZWQgfHwgIXRpbGUubm9kZSB8fCAhaXNWYWxpZCh0aWxlLm5vZGUpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0b3BUaWxlSGludE1hcnF1ZWUodGlsZSk7XG4gICAgICAgICAgICB0aGlzLnN0b3BUaWxlSGludFN3YXkodGlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZXN0cm95Qm9hcmRIaW50TWFycXVlZXMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzSGludEd1aWRlVGlsZSh0aWxlOiBUaWxlTW9kZWwpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGludEd1aWRlVGlsZXMuZmluZEluZGV4KCh0KSA9PiB0LmlkID09PSB0aWxlLmlkKSA+PSAwO1xuICAgIH1cblxuICAgIC8qKiDkv53or4Hot5Hpqaznga/lnKggcGl2b3Qg5LiK44CB5a+56b2Q54mM6Z2i44CB5bGC57qn5pyA6auYICovXG4gICAgcHJpdmF0ZSBzeW5jSGludE1hcnF1ZWUodGlsZTogVGlsZU1vZGVsKTogdm9pZCB7XG4gICAgICAgIGlmICh0aWxlLnJlbW92ZWQgfHwgIXRpbGUubm9kZSB8fCAhaXNWYWxpZCh0aWxlLm5vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgcm9vdCA9IHRpbGUubm9kZTtcbiAgICAgICAgY29uc3QgZmFjZSA9IHRoaXMuZ2V0VGlsZUZhY2VOb2RlKHJvb3QpO1xuICAgICAgICBpZiAoIWZhY2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwaXZvdCA9IHJvb3QuZ2V0Q2hpbGRCeU5hbWUoVElMRV9ISU5UX1NXQVlfUElWT1RfTkFNRSk7XG4gICAgICAgIGlmICghcGl2b3QgfHwgIWlzVmFsaWQocGl2b3QpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYXJxdWVlID0gdGhpcy5maW5kSGludE1hcnF1ZWVOb2RlKHJvb3QpO1xuICAgICAgICBpZiAoIW1hcnF1ZWUgfHwgIWlzVmFsaWQobWFycXVlZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0YWxlT25Sb290ID0gcm9vdC5nZXRDaGlsZEJ5TmFtZShUSUxFX0hJTlRfTUFSUVVFRV9OQU1FKTtcbiAgICAgICAgaWYgKHN0YWxlT25Sb290ICYmIGlzVmFsaWQoc3RhbGVPblJvb3QpICYmIHN0YWxlT25Sb290ICE9PSBtYXJxdWVlKSB7XG4gICAgICAgICAgICBzdGFsZU9uUm9vdC5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3RhbGVPbkZhY2UgPSBmYWNlLmdldENoaWxkQnlOYW1lKFRJTEVfSElOVF9NQVJRVUVFX05BTUUpO1xuICAgICAgICBpZiAoc3RhbGVPbkZhY2UgJiYgaXNWYWxpZChzdGFsZU9uRmFjZSkgJiYgc3RhbGVPbkZhY2UgIT09IG1hcnF1ZWUpIHtcbiAgICAgICAgICAgIHN0YWxlT25GYWNlLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYXJxdWVlLnBhcmVudCAhPT0gcGl2b3QpIHtcbiAgICAgICAgICAgIHRoaXMucmVwYXJlbnRLZWVwV29ybGQobWFycXVlZSwgcGl2b3QpO1xuICAgICAgICB9XG4gICAgICAgIG1hcnF1ZWUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgbWFycXVlZS5vcGFjaXR5ID0gMjU1O1xuICAgICAgICB0aGlzLmFsaWduSGludE1hcnF1ZWVUb0ZhY2UobWFycXVlZSwgZmFjZSwgcm9vdCk7XG4gICAgICAgIHRoaXMuYnJpbmdIaW50TWFycXVlZVRvRnJvbnQocm9vdCk7XG5cbiAgICAgICAgY29uc3QgY3RybCA9IG1hcnF1ZWUuZ2V0Q29tcG9uZW50KFRpbGVIaW50TWFycXVlZSk7XG4gICAgICAgIGlmIChjdHJsKSB7XG4gICAgICAgICAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldEZhY2VUcmltQm91bmRzKGZhY2UpO1xuICAgICAgICAgICAgY29uc3QgdmlzSGFsZlcgPSAoYm91bmRzLnJpZ2h0IC0gYm91bmRzLmxlZnQpICogMC41O1xuICAgICAgICAgICAgY29uc3QgdmlzSGFsZkggPSAoYm91bmRzLnRvcCAtIGJvdW5kcy5ib3R0b20pICogMC41O1xuICAgICAgICAgICAgY29uc3QgY29ybmVyUiA9IE1hdGgubWluKHZpc0hhbGZXLCB2aXNIYWxmSCkgKiAwLjI0O1xuICAgICAgICAgICAgY3RybC5zZXR1cFJlY3QoYm91bmRzLmxlZnQsIGJvdW5kcy5yaWdodCwgYm91bmRzLmJvdHRvbSwgYm91bmRzLnRvcCwgMiwgY29ybmVyUik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlZnJlc2hBbGxIaW50TWFycXVlZXMoKTogdm9pZCB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oaW50R3VpZGVUaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zeW5jSGludE1hcnF1ZWUodGhpcy5oaW50R3VpZGVUaWxlc1tpXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlZnJlc2hIaW50TWFycXVlZXNPblJvb3Qocm9vdDogY2MuTm9kZSk6IHZvaWQge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGludEd1aWRlVGlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLmhpbnRHdWlkZVRpbGVzW2ldO1xuICAgICAgICAgICAgaWYgKHRpbGUubm9kZSA9PT0gcm9vdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3luY0hpbnRNYXJxdWVlKHRpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBicmluZ0hpbnRNYXJxdWVlVG9Gcm9udChyb290OiBjYy5Ob2RlKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG1hcnF1ZWUgPSB0aGlzLmZpbmRIaW50TWFycXVlZU5vZGUocm9vdCk7XG4gICAgICAgIGlmICghbWFycXVlZSB8fCAhaXNWYWxpZChtYXJxdWVlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBhcmVudCA9IG1hcnF1ZWUucGFyZW50O1xuICAgICAgICBpZiAoIXBhcmVudCB8fCAhaXNWYWxpZChwYXJlbnQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbWFycXVlZS5zZXRTaWJsaW5nSW5kZXgocGFyZW50LmNoaWxkcmVuQ291bnQgLSAxKTtcbiAgICAgICAgbWFycXVlZS56SW5kZXggPSBUSUxFX0hJTlRfTUFSUVVFRV9aO1xuICAgIH1cblxuICAgIC8qKiDnu5/kuIDniYzpnaLlrZDoioLngrnlsYLnuqfvvIjlkKsgaGludF9zd2F5X3Bpdm90IOWGhe+8iSAqL1xuICAgIHByaXZhdGUgZW5zdXJlVGlsZUNoaWxkTGF5ZXJPcmRlcihyb290OiBjYy5Ob2RlKTogdm9pZCB7XG4gICAgICAgIGlmICghcm9vdCB8fCAhaXNWYWxpZChyb290KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBpdm90ID0gcm9vdC5nZXRDaGlsZEJ5TmFtZShUSUxFX0hJTlRfU1dBWV9QSVZPVF9OQU1FKTtcbiAgICAgICAgY29uc3QgcGFyZW50czogY2MuTm9kZVtdID0gW3Jvb3RdO1xuICAgICAgICBpZiAocGl2b3QgJiYgaXNWYWxpZChwaXZvdCkpIHtcbiAgICAgICAgICAgIHBhcmVudHMucHVzaChwaXZvdCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgcGkgPSAwOyBwaSA8IHBhcmVudHMubGVuZ3RoOyBwaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnQgPSBwYXJlbnRzW3BpXTtcbiAgICAgICAgICAgIGNvbnN0IGNoYWluOiB7IG5hbWU6IHN0cmluZzsgejogbnVtYmVyIH1bXSA9IFtcbiAgICAgICAgICAgICAgICB7IG5hbWU6IFRJTEVfRElfTkFNRSwgejogVElMRV9DSElMRF9aLmRpIH0sXG4gICAgICAgICAgICAgICAgeyBuYW1lOiBUSUxFX0ZBQ0VfTkFNRSwgejogVElMRV9DSElMRF9aLnVwIH0sXG4gICAgICAgICAgICAgICAgeyBuYW1lOiBUSUxFX1NFTEVDVEVEX05BTUUsIHo6IFRJTEVfQ0hJTERfWi5zZWxlY3RlZCB9LFxuICAgICAgICAgICAgICAgIHsgbmFtZTogVElMRV9JQ09OX05BTUUsIHo6IFRJTEVfQ0hJTERfWi5pY29uIH0sXG4gICAgICAgICAgICAgICAgeyBuYW1lOiBUSUxFX01BU0tfTkFNRSwgejogVElMRV9DSElMRF9aLm1hc2sgfSxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBsZXQgaWR4ID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGNpID0gMDsgY2kgPCBjaGFpbi5sZW5ndGg7IGNpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gY2hhaW5bY2ldO1xuICAgICAgICAgICAgICAgIGxldCBub2RlOiBjYy5Ob2RlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5uYW1lID09PSBUSUxFX0ZBQ0VfTkFNRSAmJiBwYXJlbnQgPT09IHJvb3QpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZSA9IHRoaXMuZmluZERlc2NlbmRhbnRCeU5hbWUocm9vdCwgVElMRV9GQUNFX05BTUUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGFyZW50ID09PSByb290ICYmIGl0ZW0ubmFtZSAhPT0gVElMRV9GQUNFX05BTUUpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZSA9IHBhcmVudC5nZXRDaGlsZEJ5TmFtZShpdGVtLm5hbWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUgPSBwYXJlbnQuZ2V0Q2hpbGRCeU5hbWUoaXRlbS5uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFub2RlIHx8ICFpc1ZhbGlkKG5vZGUpIHx8IG5vZGUucGFyZW50ICE9PSBwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG5vZGUuc2V0U2libGluZ0luZGV4KGlkeCk7XG4gICAgICAgICAgICAgICAgbm9kZS56SW5kZXggPSBpdGVtLno7XG4gICAgICAgICAgICAgICAgaWR4Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5icmluZ0hpbnRNYXJxdWVlVG9Gcm9udChyb290KTtcbiAgICAgICAgdGhpcy5yZWZyZXNoSGludE1hcnF1ZWVzT25Sb290KHJvb3QpO1xuICAgICAgICBjb25zdCBjbGlwID0gcm9vdC5nZXRDaGlsZEJ5TmFtZShUSUxFX1NXRUVQX0NMSVBfTkFNRSk7XG4gICAgICAgIGlmIChjbGlwICYmIGlzVmFsaWQoY2xpcCkpIHtcbiAgICAgICAgICAgIGNsaXAuc2V0U2libGluZ0luZGV4KHJvb3QuY2hpbGRyZW5Db3VudCAtIDEpO1xuICAgICAgICAgICAgY2xpcC56SW5kZXggPSAxMDAwO1xuICAgICAgICAgICAgdGhpcy5icmluZ0hpbnRNYXJxdWVlVG9Gcm9udChyb290KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc3RvcFRpbGVTZWxlY3RFZmZlY3Qocm9vdDogY2MuTm9kZSk6IHZvaWQge1xuICAgICAgICBpZiAoIXJvb3QgfHwgIWlzVmFsaWQocm9vdCkpIHJldHVybjtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLmdldFRpbGVTZWxlY3RlZE5vZGUocm9vdCk7XG4gICAgICAgIGlmIChzZWxlY3RlZCAmJiBpc1ZhbGlkKHNlbGVjdGVkKSkge1xuICAgICAgICAgICAgc2VsZWN0ZWQuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgICAgIHNlbGVjdGVkLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgc2VsZWN0ZWQub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgICAgIHNlbGVjdGVkLnNldFNjYWxlKDEpO1xuICAgICAgICAgICAgdGhpcy5lbnN1cmVUaWxlQ2hpbGRMYXllck9yZGVyKHJvb3QpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNsaXAgPSByb290LmdldENoaWxkQnlOYW1lKFRJTEVfU1dFRVBfQ0xJUF9OQU1FKTtcbiAgICAgICAgaWYgKGNsaXAgJiYgaXNWYWxpZChjbGlwKSkge1xuICAgICAgICAgICAgY2xpcC5zdG9wQWxsQWN0aW9ucygpO1xuICAgICAgICAgICAgY2xpcC5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3dlZXAgPSByb290LmdldENoaWxkQnlOYW1lKFRJTEVfU1dFRVBfTkFNRSk7XG4gICAgICAgIGlmIChzd2VlcCAmJiBpc1ZhbGlkKHN3ZWVwKSkge1xuICAgICAgICAgICAgc3dlZXAuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgICAgIHN3ZWVwLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiDpgJLlvZLmn6Xmib7lrZDoioLngrnvvIjmj5DnpLrmmYPliqjlkI4gdXAg5Y+v6IO95ZyoIGhpbnRfc3dheV9waXZvdCDkuIvvvIkgKi9cbiAgICBwcml2YXRlIGZpbmREZXNjZW5kYW50QnlOYW1lKG5vZGU6IGNjLk5vZGUsIG5hbWU6IHN0cmluZyk6IGNjLk5vZGUgfCBudWxsIHtcbiAgICAgICAgaWYgKCFub2RlIHx8ICFpc1ZhbGlkKG5vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS5uYW1lID09PSBuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGhpdCA9IHRoaXMuZmluZERlc2NlbmRhbnRCeU5hbWUobm9kZS5jaGlsZHJlbltpXSwgbmFtZSk7XG4gICAgICAgICAgICBpZiAoaGl0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhpdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKiog54mM6Z2i5Zu+6IqC54K577yI5omr5YWJ6KOB5Ymq5Yy65Z+f5LiO5LmL5a+56b2Q77yJICovXG4gICAgcHJpdmF0ZSBnZXRUaWxlRmFjZU5vZGUocm9vdDogY2MuTm9kZSk6IGNjLk5vZGUgfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZERlc2NlbmRhbnRCeU5hbWUocm9vdCwgVElMRV9GQUNFX05BTUUpO1xuICAgIH1cblxuICAgIHNldEd1aWRlSGFuZFNwcml0ZShzZjogY2MuU3ByaXRlRnJhbWUpOiB2b2lkIHtcbiAgICAgICAgaWYgKHNmKSB7XG4gICAgICAgICAgICB0aGlzLmd1aWRlSGFuZFNmID0gc2Y7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiog5omr5YWJ6YGu572p5a+56b2Q54mM6Z2i5Y+v6KeB5Yy65Z+f77yI5LiO6LeR6ams54Gv6KOB5YiH5LiA6Ie077yM5pSv5oyBIHVwIOWcqCBwaXZvdCDkuIvvvIkgKi9cbiAgICBwcml2YXRlIGFsaWduU3dlZXBDbGlwVG9GYWNlKGNsaXA6IGNjLk5vZGUsIGZhY2U6IGNjLk5vZGUsIHJvb3Q6IGNjLk5vZGUpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgYm91bmRzID0gdGhpcy5nZXRGYWNlVHJpbUJvdW5kcyhmYWNlKTtcbiAgICAgICAgY29uc3QgdyA9IGJvdW5kcy5yaWdodCAtIGJvdW5kcy5sZWZ0O1xuICAgICAgICBjb25zdCBoID0gYm91bmRzLnRvcCAtIGJvdW5kcy5ib3R0b207XG4gICAgICAgIGNvbnN0IGN4ID0gKGJvdW5kcy5sZWZ0ICsgYm91bmRzLnJpZ2h0KSAqIDAuNTtcbiAgICAgICAgY29uc3QgY3kgPSAoYm91bmRzLmJvdHRvbSArIGJvdW5kcy50b3ApICogMC41O1xuICAgICAgICBjb25zdCB3b3JsZCA9IGZhY2UuY29udmVydFRvV29ybGRTcGFjZUFSKGNjLnYyKGN4LCBjeSkpO1xuICAgICAgICBjb25zdCBsb2NhbCA9IHJvb3QuY29udmVydFRvTm9kZVNwYWNlQVIod29ybGQpO1xuICAgICAgICBjbGlwLnNldEFuY2hvclBvaW50KDAuNSwgMC41KTtcbiAgICAgICAgY2xpcC5zZXRQb3NpdGlvbihsb2NhbC54LCBsb2NhbC55KTtcbiAgICAgICAgY2xpcC5zZXRDb250ZW50U2l6ZSh3LCBoKTtcbiAgICAgICAgY2xpcC5zZXRTY2FsZSgxKTtcbiAgICAgICAgY2xpcC5hbmdsZSA9IGZhY2UuYW5nbGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRPckNyZWF0ZVN3ZWVwQ2xpcChyb290OiBjYy5Ob2RlKTogY2MuTm9kZSB8IG51bGwge1xuICAgICAgICBjb25zdCBmYWNlID0gdGhpcy5nZXRUaWxlRmFjZU5vZGUocm9vdCk7XG4gICAgICAgIGlmICghZmFjZSkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgbGV0IGNsaXAgPSByb290LmdldENoaWxkQnlOYW1lKFRJTEVfU1dFRVBfQ0xJUF9OQU1FKTtcbiAgICAgICAgaWYgKCFjbGlwIHx8ICFpc1ZhbGlkKGNsaXApKSB7XG4gICAgICAgICAgICBjbGlwID0gbmV3IGNjLk5vZGUoVElMRV9TV0VFUF9DTElQX05BTUUpO1xuICAgICAgICAgICAgY29uc3QgbWFzayA9IGNsaXAuYWRkQ29tcG9uZW50KGNjLk1hc2spO1xuICAgICAgICAgICAgbWFzay50eXBlID0gY2MuTWFzay5UeXBlLlJFQ1Q7XG4gICAgICAgICAgICByb290LmFkZENoaWxkKGNsaXApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWxpZ25Td2VlcENsaXBUb0ZhY2UoY2xpcCwgZmFjZSwgcm9vdCk7XG4gICAgICAgIHJldHVybiBjbGlwO1xuICAgIH1cblxuICAgIHByaXZhdGUgYnVpbGRTZWxlY3RTd2VlcEJhcihiYXJXOiBudW1iZXIsIGJhckg6IG51bWJlcik6IGNjLk5vZGUge1xuICAgICAgICBjb25zdCBub2RlID0gbmV3IGNjLk5vZGUoVElMRV9TV0VFUF9OQU1FKTtcbiAgICAgICAgY29uc3QgZyA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLkdyYXBoaWNzKTtcbiAgICAgICAgY29uc3QgaHcgPSBiYXJXICogMC41O1xuICAgICAgICBjb25zdCBoaCA9IGJhckggKiAwLjU7XG4gICAgICAgIGcuY2xlYXIoKTtcbiAgICAgICAgZy5maWxsQ29sb3IgPSBjYy5jb2xvcigyNTUsIDI0OCwgMjEwLCBNYXRoLmZsb29yKFNFTEVDVF9TV0VFUF9TVFlMRS5wZWFrT3BhY2l0eSAqIDAuMzUpKTtcbiAgICAgICAgZy5yb3VuZFJlY3QoLWh3IC0gMiwgLWhoLCBiYXJXICsgNCwgYmFySCwgMik7XG4gICAgICAgIGcuZmlsbCgpO1xuICAgICAgICBnLmZpbGxDb2xvciA9IGNjLmNvbG9yKDI1NSwgMjUyLCAyMzAsIFNFTEVDVF9TV0VFUF9TVFlMRS5wZWFrT3BhY2l0eSk7XG4gICAgICAgIGcucm91bmRSZWN0KC1odywgLWhoLCBiYXJXLCBiYXJILCAxKTtcbiAgICAgICAgZy5maWxsKCk7XG4gICAgICAgIG5vZGUuc2V0Q29udGVudFNpemUoYmFyVywgYmFySCk7XG4gICAgICAgIG5vZGUuc2V0QW5jaG9yUG9pbnQoMC41LCAwLjUpO1xuICAgICAgICBub2RlLmFuZ2xlID0gU0VMRUNUX1NXRUVQX1NUWUxFLmFuZ2xlO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICAvKiog6YCJ5Lit54m55pWI77ya5aSW5ZyI5by55Ye6ICsg5ZG85ZC4ICsg5qiq5ZCR5omr5YWJ5b6q546vICovXG4gICAgcHJpdmF0ZSBzdGFydFRpbGVTZWxlY3RFZmZlY3QodGlsZTogVGlsZU1vZGVsKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHJvb3QgPSB0aWxlLm5vZGU7XG4gICAgICAgIGlmICghcm9vdCB8fCAhaXNWYWxpZChyb290KSkgcmV0dXJuO1xuICAgICAgICB0aGlzLnN0b3BUaWxlU2VsZWN0RWZmZWN0KHJvb3QpO1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5nZXRUaWxlU2VsZWN0ZWROb2RlKHJvb3QpO1xuICAgICAgICBpZiAoIXNlbGVjdGVkKSByZXR1cm47XG5cbiAgICAgICAgY29uc3Qgc3ByaXRlID0gc2VsZWN0ZWQuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgIGlmIChzcHJpdGUpIHtcbiAgICAgICAgICAgIHNwcml0ZS5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICghc3ByaXRlLnNwcml0ZUZyYW1lKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybignW0JvYXJkTWFuYWdlcl0gc2VsZWN0ZWQg6IqC54K557y65bCRIFNwcml0ZUZyYW1l77yM6K+35qOA5p+lIG1qIOmihOWItuS9kycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2VsZWN0ZWQuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgc2VsZWN0ZWQub3BhY2l0eSA9IDE2MDtcbiAgICAgICAgdGhpcy5lbnN1cmVUaWxlQ2hpbGRMYXllck9yZGVyKHJvb3QpO1xuXG4gICAgICAgIHNlbGVjdGVkLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIHNlbGVjdGVkLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShcbiAgICAgICAgICAgIGNjLmZhZGVUbyhTRUxFQ1RfUE9QX0lOLCAyNTUpLmVhc2luZyhjYy5lYXNlU2luZU91dCgpKSxcbiAgICAgICAgICAgIGNjLmNhbGxGdW5jKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGVjdGVkIHx8ICFpc1ZhbGlkKHNlbGVjdGVkKSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHRoaXMucGxheVNlbGVjdEdsb3dQdWxzZShzZWxlY3RlZCk7XG4gICAgICAgICAgICB9LCB0aGlzKVxuICAgICAgICApKTtcblxuICAgICAgICB0aGlzLnBsYXlTZWxlY3RTd2VlcChyb290KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBsYXlTZWxlY3RHbG93UHVsc2Uoc2VsZWN0ZWQ6IGNjLk5vZGUpOiB2b2lkIHtcbiAgICAgICAgaWYgKCFzZWxlY3RlZCB8fCAhaXNWYWxpZChzZWxlY3RlZCkpIHJldHVybjtcbiAgICAgICAgc2VsZWN0ZWQuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgc2VsZWN0ZWQucnVuQWN0aW9uKGNjLnJlcGVhdEZvcmV2ZXIoY2Muc2VxdWVuY2UoXG4gICAgICAgICAgICBjYy5mYWRlVG8oU0VMRUNUX0dMT1dfUFVMU0UsIDI1NSkuZWFzaW5nKGNjLmVhc2VTaW5lSW5PdXQoKSksXG4gICAgICAgICAgICBjYy5mYWRlVG8oU0VMRUNUX0dMT1dfUFVMU0UsIDE5MCkuZWFzaW5nKGNjLmVhc2VTaW5lSW5PdXQoKSlcbiAgICAgICAgKSkpO1xuICAgIH1cblxuICAgIC8qKiDnu4bmnaHmiavlhYnvvJrlnKjniYzpnaLlj6/op4HljLrln5/lhoXlrozmlbTku47lt6bmiavliLDlj7MgKi9cbiAgICBwcml2YXRlIHBsYXlTZWxlY3RTd2VlcChyb290OiBjYy5Ob2RlKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGNsaXAgPSB0aGlzLmdldE9yQ3JlYXRlU3dlZXBDbGlwKHJvb3QpO1xuICAgICAgICBpZiAoIWNsaXApIHJldHVybjtcblxuICAgICAgICBjb25zdCBmYWNlID0gdGhpcy5nZXRUaWxlRmFjZU5vZGUocm9vdCk7XG4gICAgICAgIGlmIChmYWNlKSB7XG4gICAgICAgICAgICB0aGlzLmFsaWduU3dlZXBDbGlwVG9GYWNlKGNsaXAsIGZhY2UsIHJvb3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2xpcFcgPSBjbGlwLndpZHRoO1xuICAgICAgICBjb25zdCBjbGlwSCA9IGNsaXAuaGVpZ2h0O1xuICAgICAgICBjb25zdCBpbnNldCA9IFNFTEVDVF9TV0VFUF9TVFlMRS5lZGdlSW5zZXQ7XG4gICAgICAgIGNvbnN0IGZyb21YID0gLWNsaXBXICogMC41ICsgaW5zZXQ7XG4gICAgICAgIGNvbnN0IHRvWCA9IGNsaXBXICogMC41IC0gaW5zZXQ7XG4gICAgICAgIGNvbnN0IGJhclcgPSBTRUxFQ1RfU1dFRVBfU1RZTEUuYmFyV2lkdGg7XG4gICAgICAgIGNvbnN0IGJhckggPSBjbGlwSCAqIFNFTEVDVF9TV0VFUF9TVFlMRS5iYXJIZWlnaHRSYXRpbztcblxuICAgICAgICBjb25zdCBzd2VlcCA9IHRoaXMuYnVpbGRTZWxlY3RTd2VlcEJhcihiYXJXLCBiYXJIKTtcbiAgICAgICAgY2xpcC5hZGRDaGlsZChzd2VlcCk7XG5cbiAgICAgICAgdGhpcy5lbnN1cmVUaWxlQ2hpbGRMYXllck9yZGVyKHJvb3QpO1xuXG4gICAgICAgIGNvbnN0IGR1cmF0aW9uID0gU0VMRUNUX1NXRUVQX1NUWUxFLmR1cmF0aW9uO1xuICAgICAgICBjb25zdCBnYXAgPSBTRUxFQ1RfU1dFRVBfU1RZTEUuZ2FwO1xuICAgICAgICBjb25zdCBwZWFrID0gU0VMRUNUX1NXRUVQX1NUWUxFLnBlYWtPcGFjaXR5O1xuXG4gICAgICAgIGNvbnN0IHJ1bk9uY2UgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBpZiAoIXN3ZWVwIHx8ICFpc1ZhbGlkKHN3ZWVwKSkgcmV0dXJuO1xuICAgICAgICAgICAgc3dlZXAuc2V0UG9zaXRpb24oZnJvbVgsIDApO1xuICAgICAgICAgICAgc3dlZXAub3BhY2l0eSA9IDA7XG4gICAgICAgIH07XG5cbiAgICAgICAgcnVuT25jZSgpO1xuICAgICAgICBzd2VlcC5ydW5BY3Rpb24oY2MucmVwZWF0Rm9yZXZlcihjYy5zZXF1ZW5jZShcbiAgICAgICAgICAgIGNjLnNwYXduKFxuICAgICAgICAgICAgICAgIGNjLm1vdmVUbyhkdXJhdGlvbiwgdG9YLCAwKS5lYXNpbmcoY2MuZWFzZVNpbmVJbk91dCgpKSxcbiAgICAgICAgICAgICAgICBjYy5zZXF1ZW5jZShcbiAgICAgICAgICAgICAgICAgICAgY2MuZmFkZVRvKGR1cmF0aW9uICogMC4yLCBwZWFrKSxcbiAgICAgICAgICAgICAgICAgICAgY2MuZmFkZVRvKGR1cmF0aW9uICogMC41LCBwZWFrKSxcbiAgICAgICAgICAgICAgICAgICAgY2MuZmFkZVRvKGR1cmF0aW9uICogMC4zLCAwKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBjYy5kZWxheVRpbWUoZ2FwKSxcbiAgICAgICAgICAgIGNjLmNhbGxGdW5jKHJ1bk9uY2UsIHRoaXMpXG4gICAgICAgICkpKTtcbiAgICB9XG5cbiAgICBzZXRUaWxlU2VsZWN0R2xvdyh0aWxlOiBUaWxlTW9kZWwsIG9uOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIGlmICh0aWxlLnJlbW92ZWQgfHwgIXRpbGUubm9kZSB8fCAhaXNWYWxpZCh0aWxlLm5vZGUpKSByZXR1cm47XG4gICAgICAgIGlmIChvbikge1xuICAgICAgICAgICAgdGhpcy5zdGFydFRpbGVTZWxlY3RFZmZlY3QodGlsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BUaWxlU2VsZWN0RWZmZWN0KHRpbGUubm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE9yQ3JlYXRlSGludE1hcnF1ZWUodGlsZTogVGlsZU1vZGVsKTogVGlsZUhpbnRNYXJxdWVlIHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IHJvb3QgPSB0aWxlLm5vZGU7XG4gICAgICAgIGlmICghcm9vdCB8fCAhaXNWYWxpZChyb290KSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZmFjZSA9IHRoaXMuZ2V0VGlsZUZhY2VOb2RlKHJvb3QpO1xuICAgICAgICBpZiAoIWZhY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2V0T3JDcmVhdGVIaW50U3dheVBpdm90KHRpbGUpO1xuICAgICAgICBjb25zdCBtYXJxdWVlUGFyZW50ID0gdGhpcy5nZXRIaW50TWFycXVlZVBhcmVudChyb290KTtcblxuICAgICAgICBsZXQgbWFycXVlZU5vZGUgPSB0aGlzLmZpbmRIaW50TWFycXVlZU5vZGUocm9vdCk7XG4gICAgICAgIGNvbnN0IGxlZ2FjeU9uRmFjZSA9IGZhY2UuZ2V0Q2hpbGRCeU5hbWUoVElMRV9ISU5UX01BUlFVRUVfTkFNRSk7XG4gICAgICAgIGlmIChsZWdhY3lPbkZhY2UgJiYgaXNWYWxpZChsZWdhY3lPbkZhY2UpICYmIGxlZ2FjeU9uRmFjZSAhPT0gbWFycXVlZU5vZGUpIHtcbiAgICAgICAgICAgIGlmIChtYXJxdWVlTm9kZSAmJiBpc1ZhbGlkKG1hcnF1ZWVOb2RlKSkge1xuICAgICAgICAgICAgICAgIGxlZ2FjeU9uRmFjZS5kZXN0cm95KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1hcnF1ZWVOb2RlID0gbGVnYWN5T25GYWNlO1xuICAgICAgICAgICAgICAgIHRoaXMucmVwYXJlbnRLZWVwV29ybGQobWFycXVlZU5vZGUsIG1hcnF1ZWVQYXJlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtYXJxdWVlTm9kZSAmJiBtYXJxdWVlTm9kZS5wYXJlbnQgIT09IG1hcnF1ZWVQYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucmVwYXJlbnRLZWVwV29ybGQobWFycXVlZU5vZGUsIG1hcnF1ZWVQYXJlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghbWFycXVlZU5vZGUgfHwgIWlzVmFsaWQobWFycXVlZU5vZGUpKSB7XG4gICAgICAgICAgICBtYXJxdWVlTm9kZSA9IG5ldyBjYy5Ob2RlKFRJTEVfSElOVF9NQVJRVUVFX05BTUUpO1xuICAgICAgICAgICAgbWFycXVlZVBhcmVudC5hZGRDaGlsZChtYXJxdWVlTm9kZSk7XG4gICAgICAgICAgICBtYXJxdWVlTm9kZS5hZGRDb21wb25lbnQoY2MuR3JhcGhpY3MpO1xuICAgICAgICAgICAgbWFycXVlZU5vZGUuYWRkQ29tcG9uZW50KFRpbGVIaW50TWFycXVlZSk7XG4gICAgICAgIH1cblxuICAgICAgICBtYXJxdWVlTm9kZS5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLmFsaWduSGludE1hcnF1ZWVUb0ZhY2UobWFycXVlZU5vZGUsIGZhY2UsIHJvb3QpO1xuICAgICAgICB0aGlzLmJyaW5nSGludE1hcnF1ZWVUb0Zyb250KHJvb3QpO1xuXG4gICAgICAgIGNvbnN0IGN0cmwgPSBtYXJxdWVlTm9kZS5nZXRDb21wb25lbnQoVGlsZUhpbnRNYXJxdWVlKTtcbiAgICAgICAgaWYgKCFjdHJsKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldEZhY2VUcmltQm91bmRzKGZhY2UpO1xuICAgICAgICBjb25zdCB2aXNIYWxmVyA9IChib3VuZHMucmlnaHQgLSBib3VuZHMubGVmdCkgKiAwLjU7XG4gICAgICAgIGNvbnN0IHZpc0hhbGZIID0gKGJvdW5kcy50b3AgLSBib3VuZHMuYm90dG9tKSAqIDAuNTtcbiAgICAgICAgY29uc3QgY29ybmVyUiA9IE1hdGgubWluKHZpc0hhbGZXLCB2aXNIYWxmSCkgKiAwLjI0O1xuICAgICAgICBjdHJsLnNldHVwUmVjdChib3VuZHMubGVmdCwgYm91bmRzLnJpZ2h0LCBib3VuZHMuYm90dG9tLCBib3VuZHMudG9wLCAyLCBjb3JuZXJSKTtcbiAgICAgICAgcmV0dXJuIGN0cmw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdG9wVGlsZUhpbnRNYXJxdWVlKHRpbGU6IFRpbGVNb2RlbCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRpbGUubm9kZSB8fCAhaXNWYWxpZCh0aWxlLm5vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWFycXVlZU5vZGUgPSB0aGlzLmZpbmRIaW50TWFycXVlZU5vZGUodGlsZS5ub2RlKTtcbiAgICAgICAgaWYgKG1hcnF1ZWVOb2RlICYmIGlzVmFsaWQobWFycXVlZU5vZGUpKSB7XG4gICAgICAgICAgICBtYXJxdWVlTm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIG1hcnF1ZWVOb2RlLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiDlkIzml7blj6rkv53nlZnkuIDlr7nmj5DnpLrvvIjot5Hpqaznga8gKyDlupXplJrngrnmmYPliqjvvIkgKi9cbiAgICBzaG93R3VpZGVIaW50UGFpcihhOiBUaWxlTW9kZWwsIGI6IFRpbGVNb2RlbCk6IHZvaWQge1xuICAgICAgICB0aGlzLmRlc3Ryb3lCb2FyZEhpbnRNYXJxdWVlcygpO1xuICAgICAgICB0aGlzLmNsZWFySGludFRpbGVzT25seSgpO1xuICAgICAgICB0aGlzLmhpbnRHdWlkZVRpbGVzID0gW2EsIGJdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGludEd1aWRlVGlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLmhpbnRHdWlkZVRpbGVzW2ldO1xuICAgICAgICAgICAgdGhpcy5nZXRPckNyZWF0ZUhpbnRTd2F5UGl2b3QodGlsZSk7XG4gICAgICAgICAgICB0aGlzLmdldE9yQ3JlYXRlSGludE1hcnF1ZWUodGlsZSk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0VGlsZUhpbnRTd2F5KHRpbGUpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxlZnQgPSBhLnggPD0gYi54ID8gYSA6IGI7XG4gICAgICAgIGNvbnN0IHJpZ2h0ID0gYS54IDw9IGIueCA/IGIgOiBhO1xuICAgICAgICB0aGlzLmJyaW5nTWF0Y2hQYWlyVG9Gcm9udChsZWZ0LCByaWdodCk7XG4gICAgICAgIHRoaXMucmVmcmVzaEFsbEhpbnRNYXJxdWVlcygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2xlYXJIaW50VGlsZXNPbmx5KCk6IHZvaWQge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGludEd1aWRlVGlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucmVzdG9yZVRpbGVIaW50KHRoaXMuaGludEd1aWRlVGlsZXNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaGludEd1aWRlVGlsZXMgPSBbXTtcbiAgICB9XG5cbiAgICBjbGVhckd1aWRlSGludEVmZmVjdHMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2xlYXJBbGxHdWlkZU1hcnF1ZWVzKCk7XG4gICAgfVxuXG4gICAgLyoqIOaPkOekuu+8mueJjOmdouWklue8mOi3kemprOeBryArIOW6lemUmueCueW3puWPs+aZg+WHoOS4i+WQjumdmeatoiAqL1xuICAgIGhpZ2hsaWdodFRpbGVIaW50KHRpbGU6IFRpbGVNb2RlbCk6IHZvaWQge1xuICAgICAgICB0aGlzLmdldE9yQ3JlYXRlSGludFN3YXlQaXZvdCh0aWxlKTtcbiAgICAgICAgdGhpcy5nZXRPckNyZWF0ZUhpbnRNYXJxdWVlKHRpbGUpO1xuICAgICAgICB0aGlzLnN0YXJ0VGlsZUhpbnRTd2F5KHRpbGUpO1xuICAgIH1cblxuICAgIHJlc3RvcmVUaWxlSGludCh0aWxlOiBUaWxlTW9kZWwpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdG9wVGlsZUhpbnRNYXJxdWVlKHRpbGUpO1xuICAgICAgICB0aGlzLnN0b3BUaWxlSGludFN3YXkodGlsZSk7XG4gICAgICAgIHRoaXMucmVzdG9yZVRpbGVaSW5kZXgodGlsZSk7XG4gICAgICAgIGNvbnN0IGlkeCA9IHRoaXMuaGludEd1aWRlVGlsZXMuZmluZEluZGV4KCh0KSA9PiB0LmlkID09PSB0aWxlLmlkKTtcbiAgICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmhpbnRHdWlkZVRpbGVzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIOW8leWvvOWwj+aJi++8muaMguaji+ebmOWxgiArIOS4lueVjOWdkOagh++8jG9mZnNldCDkuLrmo4vnm5jlg4/ntKDvvIzkuI3lj5fmmYPliqggcGl2b3Qg5b2x5ZONICovXG4gICAgc2hvd0hpbnRHdWlkZUhhbmQodGlsZTogVGlsZU1vZGVsKTogdm9pZCB7XG4gICAgICAgIGlmICghdGlsZS5ub2RlIHx8ICFpc1ZhbGlkKHRpbGUubm9kZSkgfHwgdGlsZS5yZW1vdmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmJvYXJkUm9vdCB8fCAhaXNWYWxpZCh0aGlzLmJvYXJkUm9vdCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmd1aWRlSGFuZFRhcmdldFRpbGUgPSB0aWxlO1xuICAgICAgICB0aGlzLmVuc3VyZUd1aWRlSGFuZFNwcml0ZSgoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZ3VpZGVIYW5kU2YpIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuKCdbQm9hcmRNYW5hZ2VyXSDlvJXlr7zlsI/miYvlm77liqDovb3lpLHotKU6JywgR1VJREVfSEFORF9QQVRIKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmhpZGVIaW50R3VpZGVIYW5kKCk7XG4gICAgICAgICAgICBjb25zdCBoYW5kID0gbmV3IGNjLk5vZGUoR1VJREVfSEFORF9OT0RFX05BTUUpO1xuICAgICAgICAgICAgY29uc3Qgc3ByaXRlID0gaGFuZC5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgICAgIHNwcml0ZS5zcHJpdGVGcmFtZSA9IHRoaXMuZ3VpZGVIYW5kU2Y7XG4gICAgICAgICAgICBzcHJpdGUuc2l6ZU1vZGUgPSBjYy5TcHJpdGUuU2l6ZU1vZGUuQ1VTVE9NO1xuICAgICAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuZ3VpZGVIYW5kU2YuZ2V0UmVjdCgpO1xuICAgICAgICAgICAgaGFuZC5zZXRDb250ZW50U2l6ZShyZWN0LndpZHRoLCByZWN0LmhlaWdodCk7XG4gICAgICAgICAgICBoYW5kLnNldEFuY2hvclBvaW50KDAsIDEpO1xuICAgICAgICAgICAgaGFuZC5zZXRTY2FsZShHVUlERV9IQU5EX1NUWUxFLnNjYWxlKTtcbiAgICAgICAgICAgIHRoaXMuYm9hcmRSb290LmFkZENoaWxkKGhhbmQsIFpfT1JERVIuR1VJREVfSEFORCk7XG4gICAgICAgICAgICBoYW5kLm9wYWNpdHkgPSAyNTU7XG4gICAgICAgICAgICB0aGlzLmd1aWRlSGFuZE5vZGUgPSBoYW5kO1xuICAgICAgICAgICAgdGhpcy5hcHBseUd1aWRlSGFuZFBvc2l0aW9uKHRpbGUpO1xuICAgICAgICAgICAgdGhpcy5wbGF5R3VpZGVIYW5kVGFwKGhhbmQsIHRpbGUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBoaWRlSGludEd1aWRlSGFuZCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5ndWlkZUhhbmRUYXJnZXRUaWxlID0gbnVsbDtcbiAgICAgICAgaWYgKCF0aGlzLmd1aWRlSGFuZE5vZGUgfHwgIWlzVmFsaWQodGhpcy5ndWlkZUhhbmROb2RlKSkge1xuICAgICAgICAgICAgdGhpcy5ndWlkZUhhbmROb2RlID0gbnVsbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0b3BHdWlkZUhhbmRUYXAodGhpcy5ndWlkZUhhbmROb2RlKTtcbiAgICAgICAgdGhpcy5ndWlkZUhhbmROb2RlLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5ndWlkZUhhbmROb2RlID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKiog6bq75bCG5qC56IqC54K55Lit5b+DIOKGkiDmo4vnm5jlnZDmoIfvvJvoioLngrnplJrngrkgKDAsMCkg6JC96K+l54K5ICovXG4gICAgcHJpdmF0ZSBnZXRHdWlkZUhhbmRCb2FyZFBvc2l0aW9uKHRpbGU6IFRpbGVNb2RlbCk6IGNjLlZlYzIgfCBudWxsIHtcbiAgICAgICAgaWYgKCF0aWxlLm5vZGUgfHwgIWlzVmFsaWQodGlsZS5ub2RlKSB8fCAhdGhpcy5ib2FyZFJvb3QgfHwgIWlzVmFsaWQodGhpcy5ib2FyZFJvb3QpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB3b3JsZCA9IHRpbGUubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoY2MudjIoMCwgMCkpO1xuICAgICAgICBjb25zdCBsb2NhbCA9IHRoaXMuYm9hcmRSb290LmNvbnZlcnRUb05vZGVTcGFjZUFSKHdvcmxkKTtcbiAgICAgICAgcmV0dXJuIGNjLnYyKFxuICAgICAgICAgICAgbG9jYWwueCArIEdVSURFX0hBTkRfU1RZTEUub2Zmc2V0WCxcbiAgICAgICAgICAgIGxvY2FsLnkgKyBHVUlERV9IQU5EX1NUWUxFLm9mZnNldFlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFwcGx5R3VpZGVIYW5kUG9zaXRpb24odGlsZTogVGlsZU1vZGVsKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5ndWlkZUhhbmROb2RlIHx8ICFpc1ZhbGlkKHRoaXMuZ3VpZGVIYW5kTm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLmdldEd1aWRlSGFuZEJvYXJkUG9zaXRpb24odGlsZSk7XG4gICAgICAgIGlmICghcG9zKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ndWlkZUhhbmROb2RlLnNldFBvc2l0aW9uKHBvcy54LCBwb3MueSk7XG4gICAgICAgIHRoaXMuZ3VpZGVIYW5kQmFzZVggPSBwb3MueDtcbiAgICAgICAgdGhpcy5ndWlkZUhhbmRCYXNlWSA9IHBvcy55O1xuICAgIH1cblxuICAgIHByaXZhdGUgcGxheUd1aWRlSGFuZFRhcChoYW5kOiBjYy5Ob2RlLCB0aWxlOiBUaWxlTW9kZWwpOiB2b2lkIHtcbiAgICAgICAgaWYgKCFoYW5kIHx8ICFpc1ZhbGlkKGhhbmQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdG9wR3VpZGVIYW5kVGFwKGhhbmQpO1xuICAgICAgICB0aGlzLmFwcGx5R3VpZGVIYW5kUG9zaXRpb24odGlsZSk7XG4gICAgICAgIHRoaXMuZ3VpZGVIYW5kVGFwUnVubmluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuZ3VpZGVIYW5kQmFzZVNjYWxlID0gaGFuZC5zY2FsZTtcbiAgICAgICAgdGhpcy5ydW5HdWlkZUhhbmRUYXBDeWNsZShoYW5kLCB0aWxlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJ1bkd1aWRlSGFuZFRhcEN5Y2xlKGhhbmQ6IGNjLk5vZGUsIHRpbGU6IFRpbGVNb2RlbCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuZ3VpZGVIYW5kVGFwUnVubmluZyB8fCAhaGFuZCB8fCAhaXNWYWxpZChoYW5kKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGlsZS5ub2RlIHx8ICFpc1ZhbGlkKHRpbGUubm9kZSkgfHwgdGlsZS5yZW1vdmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hcHBseUd1aWRlSGFuZFBvc2l0aW9uKHRpbGUpO1xuICAgICAgICBjb25zdCBieCA9IHRoaXMuZ3VpZGVIYW5kQmFzZVg7XG4gICAgICAgIGNvbnN0IGJ5ID0gdGhpcy5ndWlkZUhhbmRCYXNlWTtcbiAgICAgICAgY29uc3QgYnMgPSB0aGlzLmd1aWRlSGFuZEJhc2VTY2FsZTtcbiAgICAgICAgY29uc3Qgc2VxID0gY2Muc2VxdWVuY2UoXG4gICAgICAgICAgICBjYy5zcGF3bihcbiAgICAgICAgICAgICAgICBjYy5tb3ZlVG8oR1VJREVfSEFORF9QUkVTU19JTiwgYngsIGJ5ICsgR1VJREVfSEFORF9QUkVTU19ZKS5lYXNpbmcoY2MuZWFzZVNpbmVJbigpKSxcbiAgICAgICAgICAgICAgICBjYy5zY2FsZVRvKEdVSURFX0hBTkRfUFJFU1NfSU4sIGJzICogR1VJREVfSEFORF9QUkVTU19TQ0FMRSkuZWFzaW5nKGNjLmVhc2VTaW5lSW4oKSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICBjYy5kZWxheVRpbWUoR1VJREVfSEFORF9QUkVTU19IT0xEKSxcbiAgICAgICAgICAgIGNjLnNwYXduKFxuICAgICAgICAgICAgICAgIGNjLm1vdmVUbyhHVUlERV9IQU5EX1BSRVNTX09VVCwgYngsIGJ5KS5lYXNpbmcoY2MuZWFzZVNpbmVPdXQoKSksXG4gICAgICAgICAgICAgICAgY2Muc2NhbGVUbyhHVUlERV9IQU5EX1BSRVNTX09VVCwgYnMpLmVhc2luZyhjYy5lYXNlQmFja091dCgpKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGNjLmRlbGF5VGltZShHVUlERV9IQU5EX1RBUF9HQVApLFxuICAgICAgICAgICAgY2MuY2FsbEZ1bmMoKCkgPT4gdGhpcy5ydW5HdWlkZUhhbmRUYXBDeWNsZShoYW5kLCB0aWxlKSwgdGhpcylcbiAgICAgICAgKTtcbiAgICAgICAgc2VxLnNldFRhZyhHVUlERV9IQU5EX1RBUF9UQUcpO1xuICAgICAgICBoYW5kLnJ1bkFjdGlvbihzZXEpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RvcEd1aWRlSGFuZFRhcChoYW5kOiBjYy5Ob2RlKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZ3VpZGVIYW5kVGFwUnVubmluZyA9IGZhbHNlO1xuICAgICAgICBpZiAoIWhhbmQgfHwgIWlzVmFsaWQoaGFuZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBoYW5kLnN0b3BBY3Rpb25CeVRhZyhHVUlERV9IQU5EX1RBUF9UQUcpO1xuICAgICAgICBpZiAodGhpcy5ndWlkZUhhbmRUYXJnZXRUaWxlKSB7XG4gICAgICAgICAgICB0aGlzLmFwcGx5R3VpZGVIYW5kUG9zaXRpb24odGhpcy5ndWlkZUhhbmRUYXJnZXRUaWxlKTtcbiAgICAgICAgfVxuICAgICAgICBoYW5kLnNldFNjYWxlKHRoaXMuZ3VpZGVIYW5kQmFzZVNjYWxlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGVuc3VyZUd1aWRlSGFuZFNwcml0ZShkb25lOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmd1aWRlSGFuZFNmKSB7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbG9hZEdhbWVTcHJpdGVGcmFtZShHVUlERV9IQU5EX1BBVEgsIChzZikgPT4ge1xuICAgICAgICAgICAgaWYgKHNmKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ndWlkZUhhbmRTZiA9IHNmO1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYy5yZXNvdXJjZXMubG9hZChHVUlERV9IQU5EX1BBVEgsIGNjLlRleHR1cmUyRCwgKGVyclRleCwgdGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFlcnJUZXggJiYgdGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3VpZGVIYW5kU2YgPSBuZXcgY2MuU3ByaXRlRnJhbWUodGV4IGFzIGNjLlRleHR1cmUyRCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzSGludFN3YXlTa2lwTm9kZShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIG5hbWUgPT09IFRJTEVfSElOVF9TV0FZX1BJVk9UX05BTUVcbiAgICAgICAgICAgIHx8IG5hbWUgPT09IEdVSURFX0hBTkRfTk9ERV9OQU1FO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVwYXJlbnRLZWVwV29ybGQoY2hpbGQ6IGNjLk5vZGUsIG5ld1BhcmVudDogY2MuTm9kZSk6IHZvaWQge1xuICAgICAgICBpZiAoIWNoaWxkLnBhcmVudCB8fCAhaXNWYWxpZChjaGlsZC5wYXJlbnQpKSB7XG4gICAgICAgICAgICBuZXdQYXJlbnQuYWRkQ2hpbGQoY2hpbGQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHdvcmxkID0gY2hpbGQucGFyZW50LmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjaGlsZC5nZXRQb3NpdGlvbigpKTtcbiAgICAgICAgY2hpbGQucmVtb3ZlRnJvbVBhcmVudChmYWxzZSk7XG4gICAgICAgIG5ld1BhcmVudC5hZGRDaGlsZChjaGlsZCk7XG4gICAgICAgIGNoaWxkLnNldFBvc2l0aW9uKG5ld1BhcmVudC5jb252ZXJ0VG9Ob2RlU3BhY2VBUih3b3JsZCkpO1xuICAgIH1cblxuICAgIC8qKiDlupXovrkgKDAuNSwwKSDmmYPliqjovbTvvJrlrZDoioLngrkgcGl2b3TvvIzkuI3mlLnniYzmoLnoioLngrnplJrngrkv5Z2Q5qCHICovXG4gICAgcHJpdmF0ZSBnZXRPckNyZWF0ZUhpbnRTd2F5UGl2b3QodGlsZTogVGlsZU1vZGVsKTogY2MuTm9kZSB8IG51bGwge1xuICAgICAgICBjb25zdCByb290ID0gdGlsZS5ub2RlO1xuICAgICAgICBpZiAoIXJvb3QgfHwgIWlzVmFsaWQocm9vdCkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwaXZvdCA9IHJvb3QuZ2V0Q2hpbGRCeU5hbWUoVElMRV9ISU5UX1NXQVlfUElWT1RfTkFNRSk7XG4gICAgICAgIGlmIChwaXZvdCAmJiBpc1ZhbGlkKHBpdm90KSkge1xuICAgICAgICAgICAgcmV0dXJuIHBpdm90O1xuICAgICAgICB9XG5cbiAgICAgICAgcGl2b3QgPSBuZXcgY2MuTm9kZShUSUxFX0hJTlRfU1dBWV9QSVZPVF9OQU1FKTtcbiAgICAgICAgcGl2b3Quc2V0QW5jaG9yUG9pbnQoMC41LCAwKTtcbiAgICAgICAgY29uc3QgaGFsZkggPSByb290LmhlaWdodCAqIE1hdGguYWJzKHJvb3Quc2NhbGVZKSAqIDAuNTtcbiAgICAgICAgcGl2b3Quc2V0UG9zaXRpb24oMCwgLWhhbGZIKTtcbiAgICAgICAgcm9vdC5hZGRDaGlsZChwaXZvdCwgMCk7XG5cbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSByb290LmNoaWxkcmVuLnNsaWNlKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAoIWNoaWxkIHx8ICFpc1ZhbGlkKGNoaWxkKSB8fCBjaGlsZCA9PT0gcGl2b3QpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlzSGludFN3YXlTa2lwTm9kZShjaGlsZC5uYW1lKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZXBhcmVudEtlZXBXb3JsZChjaGlsZCwgcGl2b3QpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW5zdXJlVGlsZUNoaWxkTGF5ZXJPcmRlcihyb290KTtcbiAgICAgICAgcmV0dXJuIHBpdm90O1xuICAgIH1cblxuICAgIHByaXZhdGUgZGlzc29sdmVIaW50U3dheVBpdm90KHRpbGU6IFRpbGVNb2RlbCk6IHZvaWQge1xuICAgICAgICBjb25zdCByb290ID0gdGlsZS5ub2RlO1xuICAgICAgICBpZiAoIXJvb3QgfHwgIWlzVmFsaWQocm9vdCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwaXZvdCA9IHJvb3QuZ2V0Q2hpbGRCeU5hbWUoVElMRV9ISU5UX1NXQVlfUElWT1RfTkFNRSk7XG4gICAgICAgIGlmICghcGl2b3QgfHwgIWlzVmFsaWQocGl2b3QpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcGl2b3Quc3RvcEFjdGlvbkJ5VGFnKFRJTEVfSElOVF9TV0FZX1RBRyk7XG4gICAgICAgIHBpdm90LmFuZ2xlID0gMDtcblxuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHBpdm90LmNoaWxkcmVuLnNsaWNlKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAoIWNoaWxkIHx8ICFpc1ZhbGlkKGNoaWxkKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZXBhcmVudEtlZXBXb3JsZChjaGlsZCwgcm9vdCk7XG4gICAgICAgIH1cbiAgICAgICAgcGl2b3QuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLmVuc3VyZVRpbGVDaGlsZExheWVyT3JkZXIocm9vdCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGFydFRpbGVIaW50U3dheSh0aWxlOiBUaWxlTW9kZWwpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRpbGUucmVtb3ZlZCB8fCAhdGlsZS5ub2RlIHx8ICFpc1ZhbGlkKHRpbGUubm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwaXZvdCA9IHRoaXMuZ2V0T3JDcmVhdGVIaW50U3dheVBpdm90KHRpbGUpO1xuICAgICAgICBpZiAoIXBpdm90KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcGl2b3Quc3RvcEFjdGlvbkJ5VGFnKFRJTEVfSElOVF9TV0FZX1RBRyk7XG4gICAgICAgIHBpdm90LmFuZ2xlID0gMDtcblxuICAgICAgICBjb25zdCBhbmdsZSA9IEhJTlRfU1dBWV9TVFlMRS5hbmdsZTtcbiAgICAgICAgY29uc3Qgc3RlcCA9IEhJTlRfU1dBWV9TVFlMRS5zdGVwO1xuICAgICAgICBjb25zdCBnYXAgPSBISU5UX1NXQVlfU1RZTEUuZ2FwO1xuICAgICAgICBjb25zdCB3aWdnbGUgPSBjYy5zZXF1ZW5jZShcbiAgICAgICAgICAgIGNjLnJvdGF0ZUJ5KHN0ZXAsIGFuZ2xlKSxcbiAgICAgICAgICAgIGNjLnJvdGF0ZUJ5KHN0ZXAgKiAyLCAtYW5nbGUgKiAyKSxcbiAgICAgICAgICAgIGNjLnJvdGF0ZUJ5KHN0ZXAsIGFuZ2xlKSxcbiAgICAgICAgICAgIGNjLnJvdGF0ZVRvKHN0ZXAsIDApLFxuICAgICAgICAgICAgY2MuZGVsYXlUaW1lKGdhcCksXG4gICAgICAgICAgICBjYy5jYWxsRnVuYygoKSA9PiB0aGlzLnJlZnJlc2hBbGxIaW50TWFycXVlZXMoKSwgdGhpcylcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3Qgc3dheSA9IGNjLnJlcGVhdEZvcmV2ZXIod2lnZ2xlKTtcbiAgICAgICAgc3dheS5zZXRUYWcoVElMRV9ISU5UX1NXQVlfVEFHKTtcbiAgICAgICAgcGl2b3QucnVuQWN0aW9uKHN3YXkpO1xuICAgICAgICB0aGlzLnN5bmNIaW50TWFycXVlZSh0aWxlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0b3BUaWxlSGludFN3YXkodGlsZTogVGlsZU1vZGVsKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlzc29sdmVIaW50U3dheVBpdm90KHRpbGUpO1xuICAgIH1cblxuICAgIC8qKiDliJ3lp4vljJYv5aSN5L2N6YGu6buR77ya5Lqu54mM6ZqQ6JeP77yM5pqX54mM5pi+56S6ICovXG4gICAgcHJpdmF0ZSBpbml0VGlsZU1hc2socm9vdDogY2MuTm9kZSwgY292ZXJlZDogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBjb25zdCBtYXNrID0gdGhpcy5nZXRUaWxlTWFza05vZGUocm9vdCk7XG4gICAgICAgIGlmICghbWFzaykgcmV0dXJuO1xuICAgICAgICBtYXNrLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgIG1hc2suYWN0aXZlID0gY292ZXJlZDtcbiAgICAgICAgbWFzay5vcGFjaXR5ID0gVElMRV9NQVNLX09QQUNJVFk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRUaWxlRGltTWFzayh0aWxlOiBUaWxlTW9kZWwsIGNvdmVyZWQ6IGJvb2xlYW4sIGZhZGVEdXJhdGlvbjogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmICghdGlsZS5ub2RlIHx8ICFpc1ZhbGlkKHRpbGUubm9kZSkpIHJldHVybjtcbiAgICAgICAgY29uc3QgbWFzayA9IHRoaXMuZ2V0VGlsZU1hc2tOb2RlKHRpbGUubm9kZSk7XG4gICAgICAgIGlmICghbWFzaykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHNob3duID0gISF0aWxlLmRpbU1hc2tPbjtcbiAgICAgICAgaWYgKHNob3duID09PSBjb3ZlcmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGlsZS5kaW1NYXNrT24gPSBjb3ZlcmVkO1xuXG4gICAgICAgIG1hc2suc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgaWYgKGNvdmVyZWQpIHtcbiAgICAgICAgICAgIG1hc2suYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChmYWRlRHVyYXRpb24gPiAwKSB7XG4gICAgICAgICAgICAgICAgbWFzay5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgICAgICBtYXNrLnJ1bkFjdGlvbihjYy5mYWRlVG8oZmFkZUR1cmF0aW9uLCBUSUxFX01BU0tfT1BBQ0lUWSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtYXNrLm9wYWNpdHkgPSBUSUxFX01BU0tfT1BBQ0lUWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmYWRlRHVyYXRpb24gPiAwKSB7XG4gICAgICAgICAgICBtYXNrLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShcbiAgICAgICAgICAgICAgICBjYy5mYWRlVG8oZmFkZUR1cmF0aW9uLCAwKSxcbiAgICAgICAgICAgICAgICBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghbWFzayB8fCAhaXNWYWxpZChtYXNrKSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICBtYXNrLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBtYXNrLm9wYWNpdHkgPSBUSUxFX01BU0tfT1BBQ0lUWTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzKVxuICAgICAgICAgICAgKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYXNrLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgbWFzay5vcGFjaXR5ID0gVElMRV9NQVNLX09QQUNJVFk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEVudHJhbmNlTGF5ZXJJZHMoKTogbnVtYmVyW10ge1xuICAgICAgICBjb25zdCBzZWVuOiB7IFtsYXllcjogbnVtYmVyXTogYm9vbGVhbiB9ID0ge307XG4gICAgICAgIGNvbnN0IGxheWVyczogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBsYXllciA9IHRoaXMudGlsZXNbaV0ubGF5ZXI7XG4gICAgICAgICAgICBpZiAoIXNlZW5bbGF5ZXJdKSB7XG4gICAgICAgICAgICAgICAgc2VlbltsYXllcl0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGxheWVycy5wdXNoKGxheWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsYXllcnMuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xuICAgICAgICByZXR1cm4gbGF5ZXJzO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0VGlsZXNJbkxheWVyKGxheWVyOiBudW1iZXIpOiBUaWxlTW9kZWxbXSB7XG4gICAgICAgIGNvbnN0IGxpc3Q6IFRpbGVNb2RlbFtdID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50aWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMudGlsZXNbaV0ubGF5ZXIgPT09IGxheWVyKSBsaXN0LnB1c2godGhpcy50aWxlc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgbGlzdC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICBpZiAoYS55ICE9PSBiLnkpIHJldHVybiBiLnkgLSBhLnk7XG4gICAgICAgICAgICByZXR1cm4gYS54IC0gYi54O1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwbGF5RW50cmFuY2VBbmltKGRyb3BZOiBudW1iZXIsIG9uQ29tcGxldGU/OiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGxheWVycyA9IHRoaXMuZ2V0RW50cmFuY2VMYXllcklkcygpO1xuICAgICAgICBpZiAobGF5ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5lbnRyYW5jZVBsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFZpc3VhbHMoKTtcbiAgICAgICAgICAgIGlmIChvbkNvbXBsZXRlKSBvbkNvbXBsZXRlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbnRyYW5jZVBsYXlpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLnJ1bkVudHJhbmNlTGF5ZXIoZHJvcFksIGxheWVycywgMCwgb25Db21wbGV0ZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBydW5FbnRyYW5jZUxheWVyKFxuICAgICAgICBkcm9wWTogbnVtYmVyLFxuICAgICAgICBsYXllcnM6IG51bWJlcltdLFxuICAgICAgICBsYXllckluZGV4OiBudW1iZXIsXG4gICAgICAgIG9uQ29tcGxldGU/OiAoKSA9PiB2b2lkXG4gICAgKTogdm9pZCB7XG4gICAgICAgIGlmIChsYXllckluZGV4ID49IGxheWVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuZW50cmFuY2VQbGF5aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hWaXN1YWxzKCk7XG4gICAgICAgICAgICBpZiAob25Db21wbGV0ZSkgb25Db21wbGV0ZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbGF5ZXJUaWxlcyA9IHRoaXMuZ2V0VGlsZXNJbkxheWVyKGxheWVyc1tsYXllckluZGV4XSk7XG4gICAgICAgIGNvbnN0IHZhbGlkVGlsZXM6IFRpbGVNb2RlbFtdID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGF5ZXJUaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGxheWVyVGlsZXNbaV0ubm9kZTtcbiAgICAgICAgICAgIGlmIChub2RlICYmIGlzVmFsaWQobm9kZSkpIHZhbGlkVGlsZXMucHVzaChsYXllclRpbGVzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YWxpZFRpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5ydW5FbnRyYW5jZUxheWVyKGRyb3BZLCBsYXllcnMsIGxheWVySW5kZXggKyAxLCBvbkNvbXBsZXRlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxhc3RJbmRleCA9IHZhbGlkVGlsZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWxpZFRpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0aWxlID0gdmFsaWRUaWxlc1tpXTtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aWxlLm5vZGU7XG4gICAgICAgICAgICBjb25zdCBkZWxheSA9IGkgKiBFTlRSQU5DRV9JTlRSQV9TVEFHR0VSO1xuICAgICAgICAgICAgY29uc3QgcmV2ZWFsID0gY2MuY2FsbEZ1bmMoKCkgPT4ge1xuICAgICAgICAgICAgICAgIG5vZGUuc2V0UG9zaXRpb24odGlsZS54LCBkcm9wWSk7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseUVudHJhbmNlQnJpZ2h0KHRpbGUpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICBjb25zdCBkcm9wID0gY2MubW92ZVRvKEVOVFJBTkNFX0RST1BfRFVSQVRJT04sIHRpbGUueCwgdGlsZS55KVxuICAgICAgICAgICAgICAgIC5lYXNpbmcoY2MuZWFzZVF1YWRyYXRpY0FjdGlvbk91dCgpKTtcblxuICAgICAgICAgICAgaWYgKGkgPT09IGxhc3RJbmRleCkge1xuICAgICAgICAgICAgICAgIG5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKFxuICAgICAgICAgICAgICAgICAgICBjYy5kZWxheVRpbWUoZGVsYXkpLFxuICAgICAgICAgICAgICAgICAgICByZXZlYWwsXG4gICAgICAgICAgICAgICAgICAgIGRyb3AsXG4gICAgICAgICAgICAgICAgICAgIGNjLmNhbGxGdW5jKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaFZpc3VhbHNTbW9vdGgoRU5UUkFOQ0VfRElNX0RVUkFUSU9OKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgdGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGNjLmRlbGF5VGltZShFTlRSQU5DRV9ESU1fRFVSQVRJT04gKyBFTlRSQU5DRV9MQVlFUl9HQVApLFxuICAgICAgICAgICAgICAgICAgICBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJ1bkVudHJhbmNlTGF5ZXIoZHJvcFksIGxheWVycywgbGF5ZXJJbmRleCArIDEsIG9uQ29tcGxldGUpO1xuICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKVxuICAgICAgICAgICAgICAgICkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShjYy5kZWxheVRpbWUoZGVsYXkpLCByZXZlYWwsIGRyb3ApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiDku4Xlr7nlt7LmmL7npLrnmoTniYzlgZrmuJDlj5jlj5jmmpfvvIjokL3kuIDlsYLmmpfkuIDlsYLvvIkgKi9cbiAgICBwcml2YXRlIHJlZnJlc2hWaXN1YWxzU21vb3RoKGZhZGVEdXJhdGlvbjogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHJlZnJlc2hUaWxlU3RhdGVzKHRoaXMudGlsZXMsIHRoaXMuY29uZmlnKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0aWxlID0gdGhpcy50aWxlc1tpXTtcbiAgICAgICAgICAgIGlmICh0aWxlLnJlbW92ZWQgfHwgIXRpbGUubm9kZSB8fCAhaXNWYWxpZCh0aWxlLm5vZGUpKSBjb250aW51ZTtcbiAgICAgICAgICAgIGlmICh0aWxlLm5vZGUub3BhY2l0eSA8PSAwKSBjb250aW51ZTtcbiAgICAgICAgICAgIHRoaXMuYXBwbHlWaXN1YWxGYWRlKHRpbGUsIGZhZGVEdXJhdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFwcGx5VmlzdWFsRmFkZSh0aWxlOiBUaWxlTW9kZWwsIGR1cmF0aW9uOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aWxlLm5vZGUgfHwgIWlzVmFsaWQodGlsZS5ub2RlKSkgcmV0dXJuO1xuICAgICAgICB0aWxlLm5vZGUub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgdGlsZS5ub2RlLmNvbG9yID0gY2MuQ29sb3IuV0hJVEU7XG4gICAgICAgIGNvbnN0IGljb24gPSB0aWxlLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ2ljb24nKTtcbiAgICAgICAgaWYgKGljb24gJiYgaXNWYWxpZChpY29uKSkge1xuICAgICAgICAgICAgaWNvbi5vcGFjaXR5ID0gMjU1O1xuICAgICAgICAgICAgaWNvbi5jb2xvciA9IGNjLkNvbG9yLldISVRFO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0VGlsZURpbU1hc2sodGlsZSwgdGlsZS5jb3ZlcmVkLCBkdXJhdGlvbik7XG4gICAgfVxuXG4gICAgLyoqIOWFqOWxgOeCueWHu++8muS7heWcqOmrmOS6rueJjOS4re+8jOeUqCBCb2FyZCDlnZDmoIcgKyDplJrngrnnn6nlvaLlgZrlkb3kuK0gKi9cbiAgICBiaW5kQm9hcmRDbGljayhyb290OiBjYy5Ob2RlLCBvblRpbGVUYXA6ICh0aWxlOiBUaWxlTW9kZWwpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgaWYgKCFyb290IHx8ICFpc1ZhbGlkKHJvb3QpKSByZXR1cm47XG4gICAgICAgIHJvb3Qub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCAoZTogY2MuRXZlbnQuRXZlbnRUb3VjaCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuZW50cmFuY2VQbGF5aW5nKSByZXR1cm47XG4gICAgICAgICAgICBjb25zdCBwaWNrZWQgPSB0aGlzLnBpY2tUaWxlQXRUb3VjaChlKTtcbiAgICAgICAgICAgIGlmIChwaWNrZWQpIHtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIG9uVGlsZVRhcChwaWNrZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzLCB0cnVlKTtcbiAgICB9XG5cbiAgICAvKiog6Kem5pG454K5IOKGkiBCb2FyZCDmnKzlnLDlnZDmoIfvvIjlhbzlrrkgU0hPV19BTEwgLyBDYW52YXMg57yp5pS+77yJICovXG4gICAgcHJpdmF0ZSB0b3VjaFRvQm9hcmRMb2NhbChlOiBjYy5FdmVudC5FdmVudFRvdWNoKTogY2MuVmVjMiB8IG51bGwge1xuICAgICAgICBpZiAoIXRoaXMuYm9hcmRSb290IHx8ICFpc1ZhbGlkKHRoaXMuYm9hcmRSb290KSkgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiB0aGlzLmJvYXJkUm9vdC5jb252ZXJ0VG9Ob2RlU3BhY2VBUihlLmdldExvY2F0aW9uKCkpO1xuICAgIH1cblxuICAgIC8qKiDpq5jkuq7niYwgPSDmnKrnm5bpga7nvanlj5jmmpfvvIjkuI7nlLvpnaLkuIDoh7TvvIkgKi9cbiAgICBwcml2YXRlIGlzQnJpZ2h0VGlsZSh0aWxlOiBUaWxlTW9kZWwpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRpbGUucmVtb3ZlZCB8fCAhdGlsZS5ub2RlIHx8ICFpc1ZhbGlkKHRpbGUubm9kZSkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHRpbGUubm9kZS5vcGFjaXR5IDw9IDApIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHRpbGUuY292ZXJlZCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBjb25zdCBtYXNrID0gdGhpcy5nZXRUaWxlTWFza05vZGUodGlsZS5ub2RlKTtcbiAgICAgICAgaWYgKG1hc2sgJiYgbWFzay5hY3RpdmUgJiYgbWFzay5vcGFjaXR5ID4gMjApIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLyoqIOeJjOWcqCBCb2FyZCDmnKzlnLDlnZDmoIfkuIvnmoTnn6nlvaLvvJp0aWxlIOWdkOaghyArIOWFs+WNoeWuvemrmCArIOmUmueCuSAqL1xuICAgIHByaXZhdGUgZ2V0VGlsZVJlY3RJbkJvYXJkKHRpbGU6IFRpbGVNb2RlbCk6IHsgbWluWDogbnVtYmVyOyBtYXhYOiBudW1iZXI7IG1pblk6IG51bWJlcjsgbWF4WTogbnVtYmVyIH0ge1xuICAgICAgICBjb25zdCBjZmcgPSB0aGlzLmNvbmZpZztcbiAgICAgICAgY29uc3QgdyA9IGNmZyA/IGNmZy50aWxlVyA6IDg1O1xuICAgICAgICBjb25zdCBoID0gY2ZnID8gY2ZnLnRpbGVIIDogMTA2O1xuICAgICAgICBjb25zdCBuID0gdGlsZS5ub2RlO1xuICAgICAgICBjb25zdCBheCA9IG4gJiYgaXNWYWxpZChuKSA/IG4uYW5jaG9yWCA6IDAuNTtcbiAgICAgICAgY29uc3QgYXkgPSBuICYmIGlzVmFsaWQobikgPyBuLmFuY2hvclkgOiAwLjU7XG4gICAgICAgIGNvbnN0IG1pblggPSB0aWxlLnggLSB3ICogYXg7XG4gICAgICAgIGNvbnN0IG1pblkgPSB0aWxlLnkgLSBoICogYXk7XG4gICAgICAgIHJldHVybiB7IG1pblgsIG1heFg6IG1pblggKyB3LCBtaW5ZLCBtYXhZOiBtaW5ZICsgaCB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgcG9pbnRJblRpbGVSZWN0KGJvYXJkWDogbnVtYmVyLCBib2FyZFk6IG51bWJlciwgdGlsZTogVGlsZU1vZGVsKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHIgPSB0aGlzLmdldFRpbGVSZWN0SW5Cb2FyZCh0aWxlKTtcbiAgICAgICAgcmV0dXJuIGJvYXJkWCA+PSByLm1pblggJiYgYm9hcmRYIDw9IHIubWF4WCAmJiBib2FyZFkgPj0gci5taW5ZICYmIGJvYXJkWSA8PSByLm1heFk7XG4gICAgfVxuXG4gICAgLyoqIOeCueWHu+eCueWRveS4reeJjO+8iOWQq+WPmOaal+eJjO+8jOS+v+S6juS4iuWxgumBruaMoeWPjemmiO+8ie+8m+mHjeWPoOWPliBsYXllcuOAgXpJbmRleCDmnIDpq5ggKi9cbiAgICBwaWNrVGlsZUF0VG91Y2goZTogY2MuRXZlbnQuRXZlbnRUb3VjaCk6IFRpbGVNb2RlbCB8IG51bGwge1xuICAgICAgICBjb25zdCBsb2NhbCA9IHRoaXMudG91Y2hUb0JvYXJkTG9jYWwoZSk7XG4gICAgICAgIGlmICghbG9jYWwpIHJldHVybiBudWxsO1xuICAgICAgICByZXR1cm4gdGhpcy5waWNrVGlsZUF0Qm9hcmRMb2NhbChsb2NhbCk7XG4gICAgfVxuXG4gICAgcGlja0JyaWdodFRpbGVBdFRvdWNoKGU6IGNjLkV2ZW50LkV2ZW50VG91Y2gpOiBUaWxlTW9kZWwgfCBudWxsIHtcbiAgICAgICAgY29uc3QgbG9jYWwgPSB0aGlzLnRvdWNoVG9Cb2FyZExvY2FsKGUpO1xuICAgICAgICBpZiAoIWxvY2FsKSByZXR1cm4gbnVsbDtcbiAgICAgICAgcmV0dXJuIHRoaXMucGlja0JyaWdodFRpbGVBdEJvYXJkTG9jYWwobG9jYWwpO1xuICAgIH1cblxuICAgIHBpY2tCcmlnaHRUaWxlQXRTY3JlZW4oc2NyZWVuUG9zOiBjYy5WZWMyKTogVGlsZU1vZGVsIHwgbnVsbCB7XG4gICAgICAgIGlmICghdGhpcy5ib2FyZFJvb3QgfHwgIWlzVmFsaWQodGhpcy5ib2FyZFJvb3QpKSByZXR1cm4gbnVsbDtcbiAgICAgICAgY29uc3QgbG9jYWwgPSB0aGlzLmJvYXJkUm9vdC5jb252ZXJ0VG9Ob2RlU3BhY2VBUihzY3JlZW5Qb3MpO1xuICAgICAgICByZXR1cm4gdGhpcy5waWNrQnJpZ2h0VGlsZUF0Qm9hcmRMb2NhbChsb2NhbCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwaWNrVGlsZUF0Qm9hcmRMb2NhbChsb2NhbDogY2MuVmVjMik6IFRpbGVNb2RlbCB8IG51bGwge1xuICAgICAgICBsZXQgYmVzdDogVGlsZU1vZGVsID0gbnVsbDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0ID0gdGhpcy50aWxlc1tpXTtcbiAgICAgICAgICAgIGlmICh0LnJlbW92ZWQgfHwgIXQubm9kZSB8fCAhaXNWYWxpZCh0Lm5vZGUpKSBjb250aW51ZTtcbiAgICAgICAgICAgIGlmICh0Lm5vZGUub3BhY2l0eSA8PSAwKSBjb250aW51ZTtcbiAgICAgICAgICAgIGlmICghdGhpcy5wb2ludEluVGlsZVJlY3QobG9jYWwueCwgbG9jYWwueSwgdCkpIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKCFiZXN0KSB7XG4gICAgICAgICAgICAgICAgYmVzdCA9IHQ7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodC5sYXllciA+IGJlc3QubGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBiZXN0ID0gdDtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0LmxheWVyID09PSBiZXN0LmxheWVyICYmIHQubm9kZS56SW5kZXggPiBiZXN0Lm5vZGUuekluZGV4KSB7XG4gICAgICAgICAgICAgICAgYmVzdCA9IHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJlc3Q7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwaWNrQnJpZ2h0VGlsZUF0Qm9hcmRMb2NhbChsb2NhbDogY2MuVmVjMik6IFRpbGVNb2RlbCB8IG51bGwge1xuICAgICAgICBsZXQgYmVzdDogVGlsZU1vZGVsID0gbnVsbDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0ID0gdGhpcy50aWxlc1tpXTtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0JyaWdodFRpbGUodCkpIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKCF0aGlzLnBvaW50SW5UaWxlUmVjdChsb2NhbC54LCBsb2NhbC55LCB0KSkgY29udGludWU7XG4gICAgICAgICAgICBpZiAoIWJlc3QpIHtcbiAgICAgICAgICAgICAgICBiZXN0ID0gdDtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0LmxheWVyID4gYmVzdC5sYXllcikge1xuICAgICAgICAgICAgICAgIGJlc3QgPSB0O1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHQubGF5ZXIgPT09IGJlc3QubGF5ZXIgJiYgdC5ub2RlLnpJbmRleCA+IGJlc3Qubm9kZS56SW5kZXgpIHtcbiAgICAgICAgICAgICAgICBiZXN0ID0gdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmVzdDtcbiAgICB9XG5cbiAgICAvKiog54K55Ye75LiN5Y+v6YCJ54mM77ya5Lik5L6n5aS55L2P5YiZ5Lit6Ze06Zeq6buRK+emgeatouWbvuagh++8m+S4iuWxgumBruaMoeWImeWOi+eJjOerluaZgyAqL1xuICAgIHBsYXlCbG9ja2VkRmVlZGJhY2sodGlsZTogVGlsZU1vZGVsKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5jb25maWcgfHwgdGlsZS5yZW1vdmVkIHx8ICF0aWxlLm5vZGUgfHwgIWlzVmFsaWQodGlsZS5ub2RlKSkgcmV0dXJuO1xuICAgICAgICBjb25zdCBjZmcgPSB0aGlzLmNvbmZpZztcbiAgICAgICAgY29uc3QgYm9hcmQgPSB0aGlzLnRpbGVzO1xuXG4gICAgICAgIGlmIChpc0NvdmVyZWQodGlsZSwgYm9hcmQsIGNmZykpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvdmVycyA9IGdldENvdmVyaW5nVGlsZXModGlsZSwgYm9hcmQsIGNmZyk7XG4gICAgICAgICAgICBpZiAoY292ZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlUaWxlTnVkZ2UoY292ZXJzLCAwLCBCTE9DS19TSEFLRV9ZKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNCb3RoU2lkZXNCbG9ja2VkKHRpbGUsIGJvYXJkLCBjZmcpKSB7XG4gICAgICAgICAgICBjb25zdCBsZWZ0ID0gZ2V0U2lkZU5laWdoYm9yKHRpbGUsIGJvYXJkLCAnbGVmdCcsIGNmZyk7XG4gICAgICAgICAgICBjb25zdCByaWdodCA9IGdldFNpZGVOZWlnaGJvcih0aWxlLCBib2FyZCwgJ3JpZ2h0JywgY2ZnKTtcbiAgICAgICAgICAgIHRoaXMucGxheUJvdGhTaWRlc0Jsb2NrZWRGZWVkYmFjayh0aWxlLCBsZWZ0LCByaWdodCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiog5bem5Y+z6YO95pyJ54mM77ya5Lit6Ze06Zeq6buR77yb5bem5Y+z54mM5qiq5pmD77yb56aB5q2i5Zu+5qCH5Ye6546w5Zyo5Lit54mM5LiO5bem5Y+z54mM5LmL6Ze0ICovXG4gICAgcHJpdmF0ZSBwbGF5Qm90aFNpZGVzQmxvY2tlZEZlZWRiYWNrKFxuICAgICAgICBjZW50ZXI6IFRpbGVNb2RlbCxcbiAgICAgICAgbGVmdDogVGlsZU1vZGVsIHwgbnVsbCxcbiAgICAgICAgcmlnaHQ6IFRpbGVNb2RlbCB8IG51bGxcbiAgICApOiB2b2lkIHtcbiAgICAgICAgaWYgKCFjZW50ZXIubm9kZSB8fCAhaXNWYWxpZChjZW50ZXIubm9kZSkpIHJldHVybjtcbiAgICAgICAgdGhpcy5mbGFzaENlbnRlckJsb2NrZWQoY2VudGVyKTtcblxuICAgICAgICBjb25zdCBzaGFrZUdyb3VwOiBUaWxlTW9kZWxbXSA9IFtjZW50ZXJdO1xuICAgICAgICBpZiAobGVmdCkgc2hha2VHcm91cC5wdXNoKGxlZnQpO1xuICAgICAgICBpZiAocmlnaHQpIHNoYWtlR3JvdXAucHVzaChyaWdodCk7XG4gICAgICAgIHRoaXMucGxheVRpbGVOdWRnZShzaGFrZUdyb3VwLCBCTE9DS19TSEFLRV9YLCAwKTtcblxuICAgICAgICB0aGlzLmVuc3VyZUZvcmJpZGRlbkljb24oKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGxlZnQpIHRoaXMuc3Bhd25Gb3JiaWRkZW5CYWRnZUJldHdlZW4oY2VudGVyLCBsZWZ0KTtcbiAgICAgICAgICAgIGlmIChyaWdodCkgdGhpcy5zcGF3bkZvcmJpZGRlbkJhZGdlQmV0d2VlbihjZW50ZXIsIHJpZ2h0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlbnN1cmVGb3JiaWRkZW5JY29uKGRvbmU6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZm9yYmlkZGVuSWNvblNmKSB7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbG9hZEdhbWVTcHJpdGVGcmFtZShGT1JCSURERU5fSUNPTl9QQVRILCAoc2YpID0+IHtcbiAgICAgICAgICAgIGlmIChzZikge1xuICAgICAgICAgICAgICAgIHRoaXMuZm9yYmlkZGVuSWNvblNmID0gc2Y7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKiDkuK3pl7TniYznn63mmoLlj5jpu5Hlho3mgaLlpI3vvIjnlKjpooTliLbkvZMgbWFza++8jOS4jeaUueWPmCBjb3ZlcmVkIOeKtuaAge+8iSAqL1xuICAgIHByaXZhdGUgZmxhc2hDZW50ZXJCbG9ja2VkKHRpbGU6IFRpbGVNb2RlbCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRpbGUubm9kZSB8fCAhaXNWYWxpZCh0aWxlLm5vZGUpKSByZXR1cm47XG4gICAgICAgIGNvbnN0IG1hc2sgPSB0aGlzLmdldFRpbGVNYXNrTm9kZSh0aWxlLm5vZGUpO1xuICAgICAgICBpZiAoIW1hc2spIHJldHVybjtcblxuICAgICAgICBjb25zdCB3YXNDb3ZlcmVkID0gdGlsZS5jb3ZlcmVkO1xuICAgICAgICBjb25zdCB3YXNEaW1PbiA9ICEhdGlsZS5kaW1NYXNrT247XG4gICAgICAgIG1hc2suc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgICAgbWFzay5hY3RpdmUgPSB0cnVlO1xuICAgICAgICBtYXNrLm9wYWNpdHkgPSAwO1xuICAgICAgICBtYXNrLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShcbiAgICAgICAgICAgIGNjLmZhZGVUbyhCTE9DS19DRU5URVJfRkxBU0hfSU4sIFRJTEVfTUFTS19PUEFDSVRZKSxcbiAgICAgICAgICAgIGNjLmRlbGF5VGltZShCTE9DS19DRU5URVJfRkxBU0hfSE9MRCksXG4gICAgICAgICAgICBjYy5mYWRlVG8oQkxPQ0tfQ0VOVEVSX0ZMQVNIX09VVCwgMCksXG4gICAgICAgICAgICBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFtYXNrIHx8ICFpc1ZhbGlkKG1hc2spKSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKHdhc0NvdmVyZWQgfHwgd2FzRGltT24pIHtcbiAgICAgICAgICAgICAgICAgICAgbWFzay5hY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBtYXNrLm9wYWNpdHkgPSBUSUxFX01BU0tfT1BBQ0lUWTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtYXNrLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBtYXNrLm9wYWNpdHkgPSBUSUxFX01BU0tfT1BBQ0lUWTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKVxuICAgICAgICApKTtcbiAgICB9XG5cbiAgICAvKiog56aB5q2i5Zu+5qCH6JC95Zyo5Lit54mM5LiO6YK754mM5LmL6Ze055qE56m66ZqZ77yI5Lik54mM5Lit5b+D6L+e57q/55qE5Lit54K577yJICovXG4gICAgcHJpdmF0ZSBzcGF3bkZvcmJpZGRlbkJhZGdlQmV0d2VlbihjZW50ZXI6IFRpbGVNb2RlbCwgc2lkZTogVGlsZU1vZGVsKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5mb3JiaWRkZW5JY29uU2YpIHJldHVybjtcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5ib2FyZFJvb3QgJiYgaXNWYWxpZCh0aGlzLmJvYXJkUm9vdClcbiAgICAgICAgICAgID8gdGhpcy5ib2FyZFJvb3RcbiAgICAgICAgICAgIDogKGNlbnRlci5ub2RlICYmIGlzVmFsaWQoY2VudGVyLm5vZGUpID8gY2VudGVyLm5vZGUucGFyZW50IDogbnVsbCk7XG4gICAgICAgIGlmICghcGFyZW50IHx8ICFpc1ZhbGlkKHBhcmVudCkpIHJldHVybjtcblxuICAgICAgICBjb25zdCBiYWRnZSA9IG5ldyBjYy5Ob2RlKCdGb3JiaWRkZW5CYWRnZScpO1xuICAgICAgICBiYWRnZS5zZXRDb250ZW50U2l6ZShCTE9DS19GT1JCSURERU5fU0laRSwgQkxPQ0tfRk9SQklEREVOX1NJWkUpO1xuICAgICAgICBjb25zdCBzcHJpdGUgPSBiYWRnZS5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgc3ByaXRlLnNpemVNb2RlID0gY2MuU3ByaXRlLlNpemVNb2RlLkNVU1RPTTtcbiAgICAgICAgc3ByaXRlLnNwcml0ZUZyYW1lID0gdGhpcy5mb3JiaWRkZW5JY29uU2Y7XG5cbiAgICAgICAgcGFyZW50LmFkZENoaWxkKGJhZGdlLCAxMDAwMCk7XG4gICAgICAgIGJhZGdlLnNldFBvc2l0aW9uKChjZW50ZXIueCArIHNpZGUueCkgKiAwLjUsIChjZW50ZXIueSArIHNpZGUueSkgKiAwLjUpO1xuICAgICAgICBiYWRnZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgY29uc3Qgb25MZWZ0ID0gc2lkZS54IDwgY2VudGVyLng7XG4gICAgICAgIGNvbnN0IHN0YXJ0QW5nbGUgPSBvbkxlZnQgPyAtQkxPQ0tfRk9SQklEREVOX1JPVEFURSA6IEJMT0NLX0ZPUkJJRERFTl9ST1RBVEU7XG4gICAgICAgIGNvbnN0IHBlYWtBbmdsZSA9IC1zdGFydEFuZ2xlO1xuICAgICAgICBiYWRnZS5hbmdsZSA9IHN0YXJ0QW5nbGU7XG4gICAgICAgIGNvbnN0IG92ZXJzaG9vdFNjYWxlID0gQkxPQ0tfRk9SQklEREVOX1NDQUxFICogMS4wODtcbiAgICAgICAgYmFkZ2Uuc2V0U2NhbGUoQkxPQ0tfRk9SQklEREVOX1NDQUxFICogMC41KTtcblxuICAgICAgICBjb25zdCBwb3AgPSBjYy5zcGF3bihcbiAgICAgICAgICAgIGNjLmZhZGVJbihCTE9DS19GT1JCSURERU5fUE9QICogMC41NSksXG4gICAgICAgICAgICBjYy5yb3RhdGVUbyhCTE9DS19GT1JCSURERU5fUE9QLCBwZWFrQW5nbGUgKiAxLjA4KS5lYXNpbmcoY2MuZWFzZUJhY2tPdXQoKSksXG4gICAgICAgICAgICBjYy5zY2FsZVRvKEJMT0NLX0ZPUkJJRERFTl9QT1AsIG92ZXJzaG9vdFNjYWxlKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBzcHJpbmdTZXR0bGUgPSBjYy5zcGF3bihcbiAgICAgICAgICAgIGNjLnJvdGF0ZVRvKEJMT0NLX0ZPUkJJRERFTl9TRVRUTEUsIDApLmVhc2luZyhjYy5lYXNlRWxhc3RpY091dChCTE9DS19GT1JCSURERU5fU1BSSU5HKSksXG4gICAgICAgICAgICBjYy5zY2FsZVRvKEJMT0NLX0ZPUkJJRERFTl9TRVRUTEUgKiAwLjg1LCBCTE9DS19GT1JCSURERU5fU0NBTEUpXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHJvdGF0ZVNuYXAgPSBjYy5zZXF1ZW5jZShcbiAgICAgICAgICAgIGNjLnJvdGF0ZUJ5KEJMT0NLX0ZPUkJJRERFTl9XSUdHTEUgKiAwLjQ1LCAtNylcbiAgICAgICAgICAgICAgICAuZWFzaW5nKGNjLmVhc2VFbGFzdGljT3V0KEJMT0NLX0ZPUkJJRERFTl9TUFJJTkcgKiAwLjkpKSxcbiAgICAgICAgICAgIGNjLnJvdGF0ZUJ5KEJMT0NLX0ZPUkJJRERFTl9XSUdHTEUgKiAwLjU1LCA3KVxuICAgICAgICAgICAgICAgIC5lYXNpbmcoY2MuZWFzZUVsYXN0aWNPdXQoQkxPQ0tfRk9SQklEREVOX1NQUklORyAqIDAuODUpKVxuICAgICAgICApO1xuXG4gICAgICAgIGJhZGdlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShcbiAgICAgICAgICAgIHBvcCxcbiAgICAgICAgICAgIHNwcmluZ1NldHRsZSxcbiAgICAgICAgICAgIHJvdGF0ZVNuYXAsXG4gICAgICAgICAgICBjYy5kZWxheVRpbWUoQkxPQ0tfRk9SQklEREVOX0hPTEQpLFxuICAgICAgICAgICAgY2Muc3Bhd24oXG4gICAgICAgICAgICAgICAgY2MuZmFkZU91dChCTE9DS19GT1JCSURERU5fRkFERSksXG4gICAgICAgICAgICAgICAgY2Muc2NhbGVUbyhCTE9DS19GT1JCSURERU5fRkFERSwgQkxPQ0tfRk9SQklEREVOX1NDQUxFICogMC43KVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGNjLmNhbGxGdW5jKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoYmFkZ2UgJiYgaXNWYWxpZChiYWRnZSkpIGJhZGdlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH0sIHRoaXMpXG4gICAgICAgICkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGxheVRpbGVOdWRnZSh0aWxlczogVGlsZU1vZGVsW10sIG9mZnNldFg6IG51bWJlciwgb2Zmc2V0WTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG94ID0gb2Zmc2V0WDtcbiAgICAgICAgY29uc3Qgb3kgPSBvZmZzZXRZO1xuICAgICAgICBpZiAob3ggPT09IDAgJiYgb3kgPT09IDApIHJldHVybjtcbiAgICAgICAgY29uc3Qgc3RlcCA9IEJMT0NLX1NIQUtFX1NURVA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHRpbGUgPSB0aWxlc1tpXTtcbiAgICAgICAgICAgIGlmICh0aWxlLnJlbW92ZWQgfHwgIXRpbGUubm9kZSB8fCAhaXNWYWxpZCh0aWxlLm5vZGUpKSBjb250aW51ZTtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aWxlLm5vZGU7XG4gICAgICAgICAgICBub2RlLnN0b3BBbGxBY3Rpb25zKCk7XG4gICAgICAgICAgICBub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShcbiAgICAgICAgICAgICAgICBjYy5tb3ZlQnkoc3RlcCwgb3gsIG95KSxcbiAgICAgICAgICAgICAgICBjYy5tb3ZlQnkoc3RlcCAqIDIsIC1veCAqIDIsIC1veSAqIDIpLFxuICAgICAgICAgICAgICAgIGNjLm1vdmVCeShzdGVwLCBveCwgb3kpXG4gICAgICAgICAgICApKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldFRpbGVTY2FsZSh0aWxlOiBUaWxlTW9kZWwsIHNjYWxlOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRpbGUucmVtb3ZlZCB8fCAhdGlsZS5ub2RlIHx8ICFpc1ZhbGlkKHRpbGUubm9kZSkpIHJldHVybjtcbiAgICAgICAgdGlsZS5ub2RlLnNldFNjYWxlKHNjYWxlKTtcbiAgICB9XG5cbiAgICBnZXRCYXNlU2NhbGUodGlsZTogVGlsZU1vZGVsKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRpbGUuYmFzZVNjYWxlICE9PSB1bmRlZmluZWQgPyB0aWxlLmJhc2VTY2FsZSA6IDE7XG4gICAgfVxuXG4gICAgLyoqIOa2iOmZpOeisOaSnuaXtuaSreaUviBTcGluZSDnibnmlYjvvIjmo4vnm5jlnZDmoIfvvIkgKi9cbiAgICBwbGF5TWF0Y2hFbGltaW5hdGlvbkVmZmVjdCh4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuYm9hcmRSb290IHx8ICFpc1ZhbGlkKHRoaXMuYm9hcmRSb290KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHBsYXlNYXRjaEVsaW1pbmF0aW9uU3BpbmUodGhpcy5ib2FyZFJvb3QsIHgsIHkpO1xuICAgIH1cblxuICAgIC8qKiDmtojpmaTpnaDmi6Lml7bkuKTniYzkuK3lv4Ppl7Tot53vvIjotLTovrnnm7jnorDjgIHkuI3ph43lj6DvvIkgKi9cbiAgICBnZXRNYXRjaE1lZXRDZW50ZXJHYXAodGlsZT86IFRpbGVNb2RlbCwgdGlnaHQ/OiBib29sZWFuKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgY2ZnID0gdGhpcy5jb25maWc7XG4gICAgICAgIGNvbnN0IHNjYWxlID0gY2ZnICYmIGNmZy5kaXNwbGF5U2NhbGUgIT09IHVuZGVmaW5lZCA/IGNmZy5kaXNwbGF5U2NhbGUgOiAwLjU7XG4gICAgICAgIGNvbnN0IHcgPSBjZmcgPyBjZmcudGlsZVcgKiBzY2FsZSA6IDg1ICogMC41O1xuICAgICAgICBsZXQgbm9kZVcgPSB3O1xuICAgICAgICBpZiAodGlsZSAmJiB0aWxlLm5vZGUgJiYgaXNWYWxpZCh0aWxlLm5vZGUpKSB7XG4gICAgICAgICAgICBjb25zdCBtZWFzdXJlZCA9IHRpbGUubm9kZS53aWR0aCAqIE1hdGguYWJzKHRpbGUubm9kZS5zY2FsZVgpO1xuICAgICAgICAgICAgaWYgKG1lYXN1cmVkID4gMCkge1xuICAgICAgICAgICAgICAgIG5vZGVXID0gbWVhc3VyZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZVcgKiAxLjE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGVXICsgNDtcbiAgICB9XG5cbiAgICByZXN0b3JlVGlsZVNjYWxlKHRpbGU6IFRpbGVNb2RlbCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNldFRpbGVTY2FsZSh0aWxlLCB0aGlzLmdldEJhc2VTY2FsZSh0aWxlKSk7XG4gICAgICAgIHRoaXMuc2V0VGlsZVNlbGVjdEdsb3codGlsZSwgZmFsc2UpO1xuICAgICAgICB0aGlzLnNldFRpbGVTZWxlY3RPZmZzZXQodGlsZSwgZmFsc2UpO1xuICAgIH1cblxuICAgIGhpZ2hsaWdodFRpbGVTY2FsZSh0aWxlOiBUaWxlTW9kZWwsIF9tdWx0aXBsaWVyPzogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2V0VGlsZVNlbGVjdEdsb3codGlsZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgLyoqIOeOqeWutumAieS4re+8muWkluWciOWFieaViCArIOaJq+WFiSArIOebuOWvueS4ree6v+W3puWPs+W+ruenuyAqL1xuICAgIGhpZ2hsaWdodFRpbGVTZWxlY3QodGlsZTogVGlsZU1vZGVsLCBfbXVsdGlwbGllcj86IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnNldFRpbGVTZWxlY3RHbG93KHRpbGUsIHRydWUpO1xuICAgICAgICB0aGlzLnNldFRpbGVTZWxlY3RPZmZzZXQodGlsZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgcmVzdG9yZVRpbGVTZWxlY3QodGlsZTogVGlsZU1vZGVsKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVzdG9yZVRpbGVTY2FsZSh0aWxlKTtcbiAgICB9XG5cbiAgICAvKiog5raI6Zmk5Yqo55S75LiA5byA5aeL5bCx5riF5o6J6YCJ5Lit77yI5YWJ5pWIL+aJq+WFiS/lgY/np7vvvInvvIzpgb/lhY3kuI7norDmkp7liqjnlLvlj6DlnKjkuIDotbcgKi9cbiAgICBjbGVhclRpbGVTZWxlY3RGb3JNYXRjaCh0aWxlOiBUaWxlTW9kZWwpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aWxlLm5vZGUgfHwgIWlzVmFsaWQodGlsZS5ub2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aWxlLm5vZGU7XG4gICAgICAgIHRoaXMuc3RvcFRpbGVTZWxlY3RFZmZlY3Qobm9kZSk7XG4gICAgICAgIG5vZGUuc3RvcEFjdGlvbkJ5VGFnKFNFTEVDVF9PRkZTRVRfQUNUSU9OX1RBRyk7XG4gICAgICAgIG5vZGUuc2V0UG9zaXRpb24odGlsZS54LCB0aWxlLnkpO1xuICAgICAgICB0aGlzLnNldFRpbGVTY2FsZSh0aWxlLCB0aGlzLmdldEJhc2VTY2FsZSh0aWxlKSk7XG4gICAgICAgIHRoaXMuc3RvcFRpbGVIaW50TWFycXVlZSh0aWxlKTtcbiAgICAgICAgdGhpcy5zdG9wVGlsZUhpbnRTd2F5KHRpbGUpO1xuICAgIH1cblxuICAgIC8qKiDlvZPliY3lhbPljaHniYzpnaLlnKggWCDmlrnlkJHnmoTkuK3nur/vvIjnlKjkuo7pgInkuK3lt6blj7PlgY/np7vvvIkgKi9cbiAgICBwcml2YXRlIGdldEJvYXJkQ2VudGVyWCgpOiBudW1iZXIge1xuICAgICAgICBsZXQgbWluWCA9IEluZmluaXR5O1xuICAgICAgICBsZXQgbWF4WCA9IC1JbmZpbml0eTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0ID0gdGhpcy50aWxlc1tpXTtcbiAgICAgICAgICAgIGlmICh0LnJlbW92ZWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKHQueCA8IG1pblgpIG1pblggPSB0Lng7XG4gICAgICAgICAgICBpZiAodC54ID4gbWF4WCkgbWF4WCA9IHQueDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShtaW5YKSkgcmV0dXJuIDA7XG4gICAgICAgIHJldHVybiAobWluWCArIG1heFgpICogMC41O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U2VsZWN0U2hpZnRYKHRpbGU6IFRpbGVNb2RlbCk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IGR4ID0gdGlsZS54IC0gdGhpcy5nZXRCb2FyZENlbnRlclgoKTtcbiAgICAgICAgaWYgKE1hdGguYWJzKGR4KSA8PSBTRUxFQ1RfU0hJRlRfQ0VOVEVSX0VQUykgcmV0dXJuIDA7XG4gICAgICAgIHJldHVybiBkeCA8IDAgPyAtU0VMRUNUX1NISUZUX1ggOiBTRUxFQ1RfU0hJRlRfWDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFRpbGVTZWxlY3RPZmZzZXQodGlsZTogVGlsZU1vZGVsLCBvbjogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBpZiAodGlsZS5yZW1vdmVkIHx8ICF0aWxlLm5vZGUgfHwgIWlzVmFsaWQodGlsZS5ub2RlKSkgcmV0dXJuO1xuICAgICAgICBjb25zdCBub2RlID0gdGlsZS5ub2RlO1xuICAgICAgICBub2RlLnN0b3BBY3Rpb25CeVRhZyhTRUxFQ1RfT0ZGU0VUX0FDVElPTl9UQUcpO1xuICAgICAgICBjb25zdCBzaGlmdCA9IG9uID8gdGhpcy5nZXRTZWxlY3RTaGlmdFgodGlsZSkgOiAwO1xuICAgICAgICBjb25zdCBtb3ZlID0gY2MubW92ZVRvKFNFTEVDVF9TSElGVF9EVVJBVElPTiwgdGlsZS54ICsgc2hpZnQsIHRpbGUueSlcbiAgICAgICAgICAgIC5lYXNpbmcoY2MuZWFzZVNpbmVPdXQoKSk7XG4gICAgICAgIG1vdmUuc2V0VGFnKFNFTEVDVF9PRkZTRVRfQUNUSU9OX1RBRyk7XG4gICAgICAgIG5vZGUucnVuQWN0aW9uKG1vdmUpO1xuICAgIH1cblxuICAgIC8qKiDkuIrpnaLml6DniYzkuJTlt6blj7Pml6DmjKHniYzml7bvvIzpgInkuK3lj6/nva7pobYgKi9cbiAgICBzaG91bGRSYWlzZU9uU2VsZWN0KHRpbGU6IFRpbGVNb2RlbCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gaXNGdWxseUV4cG9zZWQodGlsZSwgdGhpcy50aWxlcywgdGhpcy5jb25maWcpO1xuICAgIH1cblxuICAgIGFwcGx5VmlzdWFsKHRpbGU6IFRpbGVNb2RlbCk6IHZvaWQge1xuICAgICAgICBpZiAodGlsZS5yZW1vdmVkIHx8ICF0aWxlLm5vZGUgfHwgIWlzVmFsaWQodGlsZS5ub2RlKSkgcmV0dXJuO1xuICAgICAgICB0aWxlLm5vZGUub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgdGlsZS5ub2RlLmNvbG9yID0gY2MuQ29sb3IuV0hJVEU7XG4gICAgICAgIGNvbnN0IGljb24gPSB0aWxlLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ2ljb24nKTtcbiAgICAgICAgaWYgKGljb24gJiYgaXNWYWxpZChpY29uKSkge1xuICAgICAgICAgICAgaWNvbi5vcGFjaXR5ID0gMjU1O1xuICAgICAgICAgICAgaWNvbi5jb2xvciA9IGNjLkNvbG9yLldISVRFO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0VGlsZURpbU1hc2sodGlsZSwgdGlsZS5jb3ZlcmVkLCAwKTtcbiAgICAgICAgdGhpcy5zZXRUaWxlU2VsZWN0R2xvdyh0aWxlLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgcmVmcmVzaFZpc3VhbHMoKTogdm9pZCB7XG4gICAgICAgIHJlZnJlc2hUaWxlU3RhdGVzKHRoaXMudGlsZXMsIHRoaXMuY29uZmlnKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0aWxlID0gdGhpcy50aWxlc1tpXTtcbiAgICAgICAgICAgIGlmICh0aWxlLnJlbW92ZWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgdGhpcy5hcHBseVZpc3VhbCh0aWxlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEFjdGl2ZUNvdW50KCk6IG51bWJlciB7XG4gICAgICAgIGxldCBuID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMudGlsZXNbaV0ucmVtb3ZlZCkgbisrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0TWF4WkluZGV4KCk6IG51bWJlciB7XG4gICAgICAgIGxldCBtYXhaID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0aWxlID0gdGhpcy50aWxlc1tpXTtcbiAgICAgICAgICAgIGlmICh0aWxlLnJlbW92ZWQgfHwgIXRpbGUubm9kZSB8fCAhaXNWYWxpZCh0aWxlLm5vZGUpKSBjb250aW51ZTtcbiAgICAgICAgICAgIGlmICh0aWxlLm5vZGUuekluZGV4ID4gbWF4WikgbWF4WiA9IHRpbGUubm9kZS56SW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1heFo7XG4gICAgfVxuXG4gICAgLyoqIOmAieS4rSAvIOaPkOekuuaXtue9rumhtu+8jOmBv+WFjeaUvuWkp+WQjuiiq+WFtuWug+eJjOaMoeS9jyAqL1xuICAgIGJyaW5nVGlsZXNUb0Zyb250KHRpbGVzOiBUaWxlTW9kZWxbXSk6IHZvaWQge1xuICAgICAgICBsZXQgdG9wID0gdGhpcy5nZXRNYXhaSW5kZXgoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdGlsZSA9IHRpbGVzW2ldO1xuICAgICAgICAgICAgaWYgKHRpbGUucmVtb3ZlZCB8fCAhdGlsZS5ub2RlIHx8ICFpc1ZhbGlkKHRpbGUubm9kZSkpIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKHRpbGUuYmFzZVpJbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGlsZS5iYXNlWkluZGV4ID0gdGlsZS5ub2RlLnpJbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRpbGUubm9kZS56SW5kZXggPSB0b3AgKyAxICsgaTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiDmtojpmaTov4fnqIvkuK3vvJrlt6bniYzlnKjkuIvjgIHlj7PniYzlnKjkuIogKi9cbiAgICBicmluZ01hdGNoUGFpclRvRnJvbnQobGVmdDogVGlsZU1vZGVsLCByaWdodDogVGlsZU1vZGVsKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHRvcCA9IHRoaXMuZ2V0TWF4WkluZGV4KCk7XG4gICAgICAgIGNvbnN0IGxpZnQgPSAodGlsZTogVGlsZU1vZGVsLCB6OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIGlmICghdGlsZS5ub2RlIHx8ICFpc1ZhbGlkKHRpbGUubm9kZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGlsZS5iYXNlWkluZGV4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aWxlLmJhc2VaSW5kZXggPSB0aWxlLm5vZGUuekluZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGlsZS5ub2RlLnpJbmRleCA9IHo7XG4gICAgICAgIH07XG4gICAgICAgIGxpZnQobGVmdCwgdG9wICsgMSk7XG4gICAgICAgIGxpZnQocmlnaHQsIHRvcCArIDIpO1xuICAgIH1cblxuICAgIHJlc3RvcmVUaWxlWkluZGV4KHRpbGU6IFRpbGVNb2RlbCk6IHZvaWQge1xuICAgICAgICBpZiAodGlsZS5yZW1vdmVkIHx8ICF0aWxlLm5vZGUgfHwgIWlzVmFsaWQodGlsZS5ub2RlKSkgcmV0dXJuO1xuICAgICAgICBpZiAodGlsZS5iYXNlWkluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRpbGUubm9kZS56SW5kZXggPSB0aWxlLmJhc2VaSW5kZXg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXN0b3JlVGlsZXNaSW5kZXgodGlsZXM6IFRpbGVNb2RlbFtdKTogdm9pZCB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucmVzdG9yZVRpbGVaSW5kZXgodGlsZXNbaV0pO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/ui/GamePreloader.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '08d41lw+D5Aybz3bs2TwNYZ', 'GamePreloader');
// script/ui/GamePreloader.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamePreloader = void 0;
var GamePreloadConfig_1 = require("./GamePreloadConfig");
var GameImgAtlas_1 = require("./GameImgAtlas");
var MatchEliminationSpine_1 = require("./MatchEliminationSpine");
var LEVEL_PATH = 'data/level_01';
var CHECK_SOUND_PATH = 'check';
var SCORE_FONT_PATH = 'font/score_digits';
/**
 * 阻塞预加载：关卡 JSON → 并行加载音效/字体/图集牌面/小手。
 * 评级图、消除 Spine 进局后后台加载。
 */
var GamePreloader = /** @class */ (function () {
    function GamePreloader() {
    }
    GamePreloader.run = function (onProgress, onComplete) {
        var t0 = GamePreloadConfig_1.LOADING_LOG_TIMING ? Date.now() : 0;
        onProgress(0);
        cc.resources.load(LEVEL_PATH, cc.JsonAsset, function (err, asset) {
            if (err || !asset) {
                onComplete(null, '关卡数据加载失败');
                return;
            }
            var level = asset.json;
            var iconKeys = level && level.keyPool ? level.keyPool : [];
            var done = 0;
            var total = 4;
            var result = { levelAsset: asset };
            var tick = function () {
                done++;
                onProgress(Math.min(1, done / total));
                if (done < total) {
                    return;
                }
                if (GamePreloadConfig_1.LOADING_LOG_TIMING) {
                    cc.log("[GamePreloader] \u963B\u585E\u9884\u52A0\u8F7D " + (Date.now() - t0) + "ms\uFF08\u542B " + iconKeys.length + " \u79CD\u724C\u9762\uFF09");
                }
                onComplete(result);
            };
            cc.resources.load(CHECK_SOUND_PATH, cc.AudioClip, function (e1, clip) {
                if (!e1 && clip) {
                    result.checkClip = clip;
                }
                tick();
            });
            cc.resources.load(SCORE_FONT_PATH, cc.BitmapFont, function (e2, font) {
                if (!e2 && font) {
                    result.scoreFont = font;
                }
                tick();
            });
            GameImgAtlas_1.loadGameSpriteFrame(GamePreloadConfig_1.GUIDE_HAND_PATH, function (sf) {
                if (sf) {
                    result.guideHandSf = sf;
                }
                tick();
            });
            GameImgAtlas_1.preloadTileIconKeys(iconKeys, tick);
        });
    };
    /** 进局后在后台加载，不阻塞首屏 */
    GamePreloader.preloadGameplayAssets = function (onDone) {
        var t0 = GamePreloadConfig_1.LOADING_LOG_TIMING ? Date.now() : 0;
        var pending = 1 + GamePreloadConfig_1.RATE_RES_KEYS.length;
        var finish = function () {
            pending--;
            if (pending <= 0) {
                if (GamePreloadConfig_1.LOADING_LOG_TIMING) {
                    cc.log("[GamePreloader] \u540E\u53F0\u9884\u52A0\u8F7D " + (Date.now() - t0) + "ms");
                }
                if (onDone) {
                    onDone();
                }
            }
        };
        MatchEliminationSpine_1.preloadMatchEliminationSpine(finish);
        for (var i = 0; i < GamePreloadConfig_1.RATE_RES_KEYS.length; i++) {
            GameImgAtlas_1.loadGameSpriteFrame(GamePreloadConfig_1.rateResPath(GamePreloadConfig_1.RATE_RES_KEYS[i]), function () { return finish(); });
        }
    };
    return GamePreloader;
}());
exports.GamePreloader = GamePreloader;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvdWkvR2FtZVByZWxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSx5REFBc0c7QUFDdEcsK0NBQStGO0FBQy9GLGlFQUF1RTtBQUV2RSxJQUFNLFVBQVUsR0FBRyxlQUFlLENBQUM7QUFDbkMsSUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUM7QUFDakMsSUFBTSxlQUFlLEdBQUcsbUJBQW1CLENBQUM7QUFXNUM7OztHQUdHO0FBQ0g7SUFBQTtJQXdFQSxDQUFDO0lBdkVVLGlCQUFHLEdBQVYsVUFBVyxVQUFzQixFQUFFLFVBQWdFO1FBQy9GLElBQU0sRUFBRSxHQUFHLHNDQUFrQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFZCxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFNBQVMsRUFBRSxVQUFDLEdBQUcsRUFBRSxLQUFLO1lBQ25ELElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNmLFVBQVUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQzdCLE9BQU87YUFDVjtZQUVELElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFtQixDQUFDO1lBQ3hDLElBQU0sUUFBUSxHQUFHLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDN0QsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsSUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLElBQU0sTUFBTSxHQUEyQixFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQztZQUU3RCxJQUFNLElBQUksR0FBRztnQkFDVCxJQUFJLEVBQUUsQ0FBQztnQkFDUCxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLElBQUksSUFBSSxHQUFHLEtBQUssRUFBRTtvQkFDZCxPQUFPO2lCQUNWO2dCQUNELElBQUksc0NBQWtCLEVBQUU7b0JBQ3BCLEVBQUUsQ0FBQyxHQUFHLENBQUMscURBQXlCLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLHdCQUFRLFFBQVEsQ0FBQyxNQUFNLDhCQUFPLENBQUMsQ0FBQztpQkFDbEY7Z0JBQ0QsVUFBVSxDQUFDLE1BQXVCLENBQUMsQ0FBQztZQUN4QyxDQUFDLENBQUM7WUFFRixFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsU0FBUyxFQUFFLFVBQUMsRUFBRSxFQUFFLElBQUk7Z0JBQ3ZELElBQUksQ0FBQyxFQUFFLElBQUksSUFBSSxFQUFFO29CQUNiLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2lCQUMzQjtnQkFDRCxJQUFJLEVBQUUsQ0FBQztZQUNYLENBQUMsQ0FBQyxDQUFDO1lBQ0gsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBQyxFQUFFLEVBQUUsSUFBSTtnQkFDdkQsSUFBSSxDQUFDLEVBQUUsSUFBSSxJQUFJLEVBQUU7b0JBQ2IsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7aUJBQzNCO2dCQUNELElBQUksRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUM7WUFDSCxrQ0FBbUIsQ0FBQyxtQ0FBZSxFQUFFLFVBQUMsRUFBRTtnQkFDcEMsSUFBSSxFQUFFLEVBQUU7b0JBQ0osTUFBTSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7aUJBQzNCO2dCQUNELElBQUksRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUM7WUFDSCxrQ0FBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQscUJBQXFCO0lBQ2QsbUNBQXFCLEdBQTVCLFVBQTZCLE1BQW1CO1FBQzVDLElBQU0sRUFBRSxHQUFHLHNDQUFrQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQyxJQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsaUNBQWEsQ0FBQyxNQUFNLENBQUM7UUFDdkMsSUFBTSxNQUFNLEdBQUc7WUFDWCxPQUFPLEVBQUUsQ0FBQztZQUNWLElBQUksT0FBTyxJQUFJLENBQUMsRUFBRTtnQkFDZCxJQUFJLHNDQUFrQixFQUFFO29CQUNwQixFQUFFLENBQUMsR0FBRyxDQUFDLHFEQUF5QixJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxRQUFJLENBQUMsQ0FBQztpQkFDeEQ7Z0JBQ0QsSUFBSSxNQUFNLEVBQUU7b0JBQ1IsTUFBTSxFQUFFLENBQUM7aUJBQ1o7YUFDSjtRQUNMLENBQUMsQ0FBQztRQUVGLG9EQUE0QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxpQ0FBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQyxrQ0FBbUIsQ0FBQywrQkFBVyxDQUFDLGlDQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxjQUFNLE9BQUEsTUFBTSxFQUFFLEVBQVIsQ0FBUSxDQUFDLENBQUM7U0FDdEU7SUFDTCxDQUFDO0lBQ0wsb0JBQUM7QUFBRCxDQXhFQSxBQXdFQyxJQUFBO0FBeEVZLHNDQUFhIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTGV2ZWxDb25maWcgfSBmcm9tICcuLi9tb2RlbC9MZXZlbENvbmZpZyc7XG5pbXBvcnQgeyBHVUlERV9IQU5EX1BBVEgsIExPQURJTkdfTE9HX1RJTUlORywgUkFURV9SRVNfS0VZUywgcmF0ZVJlc1BhdGggfSBmcm9tICcuL0dhbWVQcmVsb2FkQ29uZmlnJztcbmltcG9ydCB7IGxvYWRHYW1lU3ByaXRlRnJhbWUsIHByZWxvYWRHYW1lSW1nQXRsYXMsIHByZWxvYWRUaWxlSWNvbktleXMgfSBmcm9tICcuL0dhbWVJbWdBdGxhcyc7XG5pbXBvcnQgeyBwcmVsb2FkTWF0Y2hFbGltaW5hdGlvblNwaW5lIH0gZnJvbSAnLi9NYXRjaEVsaW1pbmF0aW9uU3BpbmUnO1xuXG5jb25zdCBMRVZFTF9QQVRIID0gJ2RhdGEvbGV2ZWxfMDEnO1xuY29uc3QgQ0hFQ0tfU09VTkRfUEFUSCA9ICdjaGVjayc7XG5jb25zdCBTQ09SRV9GT05UX1BBVEggPSAnZm9udC9zY29yZV9kaWdpdHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFByZWxvYWRSZXN1bHQge1xuICAgIGxldmVsQXNzZXQ6IGNjLkpzb25Bc3NldDtcbiAgICBjaGVja0NsaXA/OiBjYy5BdWRpb0NsaXA7XG4gICAgc2NvcmVGb250PzogY2MuQml0bWFwRm9udDtcbiAgICBndWlkZUhhbmRTZj86IGNjLlNwcml0ZUZyYW1lO1xufVxuXG50eXBlIFByb2dyZXNzRm4gPSAocmF0aW86IG51bWJlcikgPT4gdm9pZDtcblxuLyoqXG4gKiDpmLvloZ7pooTliqDovb3vvJrlhbPljaEgSlNPTiDihpIg5bm26KGM5Yqg6L296Z+z5pWIL+Wtl+S9ky/lm77pm4bniYzpnaIv5bCP5omL44CCXG4gKiDor4Tnuqflm77jgIHmtojpmaQgU3BpbmUg6L+b5bGA5ZCO5ZCO5Y+w5Yqg6L2944CCXG4gKi9cbmV4cG9ydCBjbGFzcyBHYW1lUHJlbG9hZGVyIHtcbiAgICBzdGF0aWMgcnVuKG9uUHJvZ3Jlc3M6IFByb2dyZXNzRm4sIG9uQ29tcGxldGU6IChyZXN1bHQ6IFByZWxvYWRSZXN1bHQgfCBudWxsLCBlcnI/OiBzdHJpbmcpID0+IHZvaWQpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgdDAgPSBMT0FESU5HX0xPR19USU1JTkcgPyBEYXRlLm5vdygpIDogMDtcbiAgICAgICAgb25Qcm9ncmVzcygwKTtcblxuICAgICAgICBjYy5yZXNvdXJjZXMubG9hZChMRVZFTF9QQVRILCBjYy5Kc29uQXNzZXQsIChlcnIsIGFzc2V0KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyIHx8ICFhc3NldCkge1xuICAgICAgICAgICAgICAgIG9uQ29tcGxldGUobnVsbCwgJ+WFs+WNoeaVsOaNruWKoOi9veWksei0pScpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbGV2ZWwgPSBhc3NldC5qc29uIGFzIExldmVsQ29uZmlnO1xuICAgICAgICAgICAgY29uc3QgaWNvbktleXMgPSBsZXZlbCAmJiBsZXZlbC5rZXlQb29sID8gbGV2ZWwua2V5UG9vbCA6IFtdO1xuICAgICAgICAgICAgbGV0IGRvbmUgPSAwO1xuICAgICAgICAgICAgY29uc3QgdG90YWwgPSA0O1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0OiBQYXJ0aWFsPFByZWxvYWRSZXN1bHQ+ID0geyBsZXZlbEFzc2V0OiBhc3NldCB9O1xuXG4gICAgICAgICAgICBjb25zdCB0aWNrID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIGRvbmUrKztcbiAgICAgICAgICAgICAgICBvblByb2dyZXNzKE1hdGgubWluKDEsIGRvbmUgLyB0b3RhbCkpO1xuICAgICAgICAgICAgICAgIGlmIChkb25lIDwgdG90YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoTE9BRElOR19MT0dfVElNSU5HKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZyhgW0dhbWVQcmVsb2FkZXJdIOmYu+WhnumihOWKoOi9vSAke0RhdGUubm93KCkgLSB0MH1tc++8iOWQqyAke2ljb25LZXlzLmxlbmd0aH0g56eN54mM6Z2i77yJYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGUocmVzdWx0IGFzIFByZWxvYWRSZXN1bHQpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY2MucmVzb3VyY2VzLmxvYWQoQ0hFQ0tfU09VTkRfUEFUSCwgY2MuQXVkaW9DbGlwLCAoZTEsIGNsaXApID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWUxICYmIGNsaXApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmNoZWNrQ2xpcCA9IGNsaXA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRpY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2MucmVzb3VyY2VzLmxvYWQoU0NPUkVfRk9OVF9QQVRILCBjYy5CaXRtYXBGb250LCAoZTIsIGZvbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWUyICYmIGZvbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnNjb3JlRm9udCA9IGZvbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRpY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbG9hZEdhbWVTcHJpdGVGcmFtZShHVUlERV9IQU5EX1BBVEgsIChzZikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzZikge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuZ3VpZGVIYW5kU2YgPSBzZjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGljaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwcmVsb2FkVGlsZUljb25LZXlzKGljb25LZXlzLCB0aWNrKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqIOi/m+WxgOWQjuWcqOWQjuWPsOWKoOi9ve+8jOS4jemYu+WhnummluWxjyAqL1xuICAgIHN0YXRpYyBwcmVsb2FkR2FtZXBsYXlBc3NldHMob25Eb25lPzogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgICBjb25zdCB0MCA9IExPQURJTkdfTE9HX1RJTUlORyA/IERhdGUubm93KCkgOiAwO1xuICAgICAgICBsZXQgcGVuZGluZyA9IDEgKyBSQVRFX1JFU19LRVlTLmxlbmd0aDtcbiAgICAgICAgY29uc3QgZmluaXNoID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgcGVuZGluZy0tO1xuICAgICAgICAgICAgaWYgKHBlbmRpbmcgPD0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChMT0FESU5HX0xPR19USU1JTkcpIHtcbiAgICAgICAgICAgICAgICAgICAgY2MubG9nKGBbR2FtZVByZWxvYWRlcl0g5ZCO5Y+w6aKE5Yqg6L29ICR7RGF0ZS5ub3coKSAtIHQwfW1zYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvbkRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgb25Eb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHByZWxvYWRNYXRjaEVsaW1pbmF0aW9uU3BpbmUoZmluaXNoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBSQVRFX1JFU19LRVlTLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsb2FkR2FtZVNwcml0ZUZyYW1lKHJhdGVSZXNQYXRoKFJBVEVfUkVTX0tFWVNbaV0pLCAoKSA9PiBmaW5pc2goKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/core/HintSolver.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '2046atHSuRB64A5K6o/ylze', 'HintSolver');
// script/core/HintSolver.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectRemainingMatchPairs = exports.findHint = void 0;
var is_valid_1 = require("../is-valid");
var MatchRule_1 = require("./MatchRule");
function findHint(board) {
    var freeTiles = [];
    for (var i = 0; i < board.length; i++) {
        if (!board[i].removed && board[i].free)
            freeTiles.push(board[i]);
    }
    for (var i = 0; i < freeTiles.length; i++) {
        for (var j = i + 1; j < freeTiles.length; j++) {
            if (MatchRule_1.canMatch(freeTiles[i], freeTiles[j])) {
                return { a: freeTiles[i], b: freeTiles[j] };
            }
        }
    }
    return null;
}
exports.findHint = findHint;
/** 结算前扫尾：在剩余牌中贪心配对（不要求 free，用于快速自动消除） */
function collectRemainingMatchPairs(board) {
    var active = [];
    for (var i = 0; i < board.length; i++) {
        var t = board[i];
        if (!t.removed && t.node && is_valid_1.isValid(t.node)) {
            active.push(t);
        }
    }
    var used = new Set();
    var pairs = [];
    for (var i = 0; i < active.length; i++) {
        var a = active[i];
        if (used.has(a.id)) {
            continue;
        }
        for (var j = i + 1; j < active.length; j++) {
            var b = active[j];
            if (used.has(b.id)) {
                continue;
            }
            if (MatchRule_1.canMatch(a, b)) {
                pairs.push({ a: a, b: b });
                used.add(a.id);
                used.add(b.id);
                break;
            }
        }
    }
    return pairs;
}
exports.collectRemainingMatchPairs = collectRemainingMatchPairs;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvY29yZS9IaW50U29sdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHdDQUFzQztBQUV0Qyx5Q0FBdUM7QUFPdkMsU0FBZ0IsUUFBUSxDQUFDLEtBQWtCO0lBQ3ZDLElBQU0sU0FBUyxHQUFnQixFQUFFLENBQUM7SUFDbEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDbkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7WUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3BFO0lBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNDLElBQUksb0JBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3RDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQzthQUMvQztTQUNKO0tBQ0o7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDO0FBYkQsNEJBYUM7QUFFRCx5Q0FBeUM7QUFDekMsU0FBZ0IsMEJBQTBCLENBQUMsS0FBa0I7SUFDekQsSUFBTSxNQUFNLEdBQWdCLEVBQUUsQ0FBQztJQUMvQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNuQyxJQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxrQkFBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN6QyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xCO0tBQ0o7SUFDRCxJQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO0lBQy9CLElBQU0sS0FBSyxHQUFlLEVBQUUsQ0FBQztJQUM3QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNwQyxJQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNoQixTQUFTO1NBQ1o7UUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDeEMsSUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQ2hCLFNBQVM7YUFDWjtZQUNELElBQUksb0JBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2hCLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUEsRUFBRSxDQUFDLEdBQUEsRUFBRSxDQUFDLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNmLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNmLE1BQU07YUFDVDtTQUNKO0tBQ0o7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBN0JELGdFQTZCQyIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzVmFsaWQgfSBmcm9tICcuLi9pcy12YWxpZCc7XG5pbXBvcnQgeyBUaWxlTW9kZWwgfSBmcm9tICcuLi9tb2RlbC9UaWxlTW9kZWwnO1xuaW1wb3J0IHsgY2FuTWF0Y2ggfSBmcm9tICcuL01hdGNoUnVsZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSGludFBhaXIge1xuICAgIGE6IFRpbGVNb2RlbDtcbiAgICBiOiBUaWxlTW9kZWw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kSGludChib2FyZDogVGlsZU1vZGVsW10pOiBIaW50UGFpciB8IG51bGwge1xuICAgIGNvbnN0IGZyZWVUaWxlczogVGlsZU1vZGVsW10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghYm9hcmRbaV0ucmVtb3ZlZCAmJiBib2FyZFtpXS5mcmVlKSBmcmVlVGlsZXMucHVzaChib2FyZFtpXSk7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJlZVRpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IGZyZWVUaWxlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKGNhbk1hdGNoKGZyZWVUaWxlc1tpXSwgZnJlZVRpbGVzW2pdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGE6IGZyZWVUaWxlc1tpXSwgYjogZnJlZVRpbGVzW2pdIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbi8qKiDnu5PnrpfliY3miavlsL7vvJrlnKjliankvZnniYzkuK3otKrlv4PphY3lr7nvvIjkuI3opoHmsYIgZnJlZe+8jOeUqOS6juW/q+mAn+iHquWKqOa2iOmZpO+8iSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbGxlY3RSZW1haW5pbmdNYXRjaFBhaXJzKGJvYXJkOiBUaWxlTW9kZWxbXSk6IEhpbnRQYWlyW10ge1xuICAgIGNvbnN0IGFjdGl2ZTogVGlsZU1vZGVsW10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHQgPSBib2FyZFtpXTtcbiAgICAgICAgaWYgKCF0LnJlbW92ZWQgJiYgdC5ub2RlICYmIGlzVmFsaWQodC5ub2RlKSkge1xuICAgICAgICAgICAgYWN0aXZlLnB1c2godCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgdXNlZCA9IG5ldyBTZXQ8bnVtYmVyPigpO1xuICAgIGNvbnN0IHBhaXJzOiBIaW50UGFpcltdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhY3RpdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgYSA9IGFjdGl2ZVtpXTtcbiAgICAgICAgaWYgKHVzZWQuaGFzKGEuaWQpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCBhY3RpdmUubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGIgPSBhY3RpdmVbal07XG4gICAgICAgICAgICBpZiAodXNlZC5oYXMoYi5pZCkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjYW5NYXRjaChhLCBiKSkge1xuICAgICAgICAgICAgICAgIHBhaXJzLnB1c2goeyBhLCBiIH0pO1xuICAgICAgICAgICAgICAgIHVzZWQuYWRkKGEuaWQpO1xuICAgICAgICAgICAgICAgIHVzZWQuYWRkKGIuaWQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYWlycztcbn1cbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/ui/GuideHandTap.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'b8f3cIaTl1KiZwSfW6PChss', 'GuideHandTap');
// script/ui/GuideHandTap.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 已废弃：引导小手点击动画在 BoardManager 内实现。
 * 保留空组件仅为避免旧编译缓存 require 报错。
 */
var ccclass = cc._decorator.ccclass;
var GuideHandTap = /** @class */ (function (_super) {
    __extends(GuideHandTap, _super);
    function GuideHandTap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GuideHandTap = __decorate([
        ccclass
    ], GuideHandTap);
    return GuideHandTap;
}(cc.Component));
exports.default = GuideHandTap;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvdWkvR3VpZGVIYW5kVGFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7R0FHRztBQUNLLElBQUEsT0FBTyxHQUFLLEVBQUUsQ0FBQyxVQUFVLFFBQWxCLENBQW1CO0FBR2xDO0lBQTBDLGdDQUFZO0lBQXREOztJQUF3RCxDQUFDO0lBQXBDLFlBQVk7UUFEaEMsT0FBTztPQUNhLFlBQVksQ0FBd0I7SUFBRCxtQkFBQztDQUF6RCxBQUF5RCxDQUFmLEVBQUUsQ0FBQyxTQUFTLEdBQUc7a0JBQXBDLFlBQVkiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIOW3suW6n+W8g++8muW8leWvvOWwj+aJi+eCueWHu+WKqOeUu+WcqCBCb2FyZE1hbmFnZXIg5YaF5a6e546w44CCXG4gKiDkv53nlZnnqbrnu4Tku7bku4XkuLrpgb/lhY3ml6fnvJbor5HnvJPlrZggcmVxdWlyZSDmiqXplJnjgIJcbiAqL1xuY29uc3QgeyBjY2NsYXNzIH0gPSBjYy5fZGVjb3JhdG9yO1xuXG5AY2NjbGFzc1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3VpZGVIYW5kVGFwIGV4dGVuZHMgY2MuQ29tcG9uZW50IHt9XG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/ui/GameImgAtlas.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'af5f7mZBYBFpo6Q4cJl8sRl', 'GameImgAtlas');
// script/ui/GameImgAtlas.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearGameImgAtlasCache = exports.getCachedTileIcon = exports.preloadTileIconKeys = exports.loadGameSpriteFrame = exports.preloadGameImgAtlas = void 0;
var GamePreloadConfig_1 = require("./GamePreloadConfig");
var cachedAtlas = null;
var atlasLoadPending = [];
var tileIconCache = {};
/**
 * 预加载自动图集（构建后由 ui.pac 生成 SpriteAtlas；编辑器内仍可按子路径 load SpriteFrame）。
 */
function preloadGameImgAtlas(onDone) {
    if (cachedAtlas) {
        if (onDone) {
            onDone(cachedAtlas);
        }
        return;
    }
    if (onDone) {
        atlasLoadPending.push(onDone);
    }
    cc.resources.load(GamePreloadConfig_1.IMG_AUTO_ATLAS_PAC, cc.SpriteAtlas, function (err, atlas) {
        if (!err && atlas) {
            cachedAtlas = atlas;
        }
        var pending = atlasLoadPending.slice();
        atlasLoadPending.length = 0;
        for (var i = 0; i < pending.length; i++) {
            pending[i](cachedAtlas);
        }
    });
}
exports.preloadGameImgAtlas = preloadGameImgAtlas;
/** 从图集或 resources 子路径加载 SpriteFrame（路径相对 resources，无扩展名） */
function loadGameSpriteFrame(resPath, onReady) {
    var tryAtlas = function () {
        if (!cachedAtlas) {
            finishDirect();
            return;
        }
        var base = resPath.indexOf(GamePreloadConfig_1.IMG_DIR) === 0
            ? resPath.slice(GamePreloadConfig_1.IMG_DIR.length + 1)
            : resPath;
        var names = [base, base.split('/').pop() || base];
        for (var i = 0; i < names.length; i++) {
            var sf = cachedAtlas.getSpriteFrame(names[i]);
            if (sf) {
                onReady(sf);
                return;
            }
        }
        finishDirect();
    };
    var finishDirect = function () {
        cc.resources.load(resPath, cc.SpriteFrame, function (err, sf) {
            onReady(!err && sf ? sf : null);
        });
    };
    if (cachedAtlas) {
        tryAtlas();
        return;
    }
    preloadGameImgAtlas(function () { return tryAtlas(); });
}
exports.loadGameSpriteFrame = loadGameSpriteFrame;
/** 进局前批量预加载本关会用到的牌面图（写入缓存，开局不再逐个 load） */
function preloadTileIconKeys(keys, onDone) {
    var unique = [];
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (k && unique.indexOf(k) === -1) {
            unique.push(k);
        }
    }
    if (unique.length === 0) {
        onDone();
        return;
    }
    var pending = unique.length;
    var finishOne = function () {
        pending--;
        if (pending <= 0) {
            onDone();
        }
    };
    preloadGameImgAtlas(function () {
        var _loop_1 = function (i) {
            var key = unique[i];
            if (tileIconCache[key]) {
                finishOne();
                return "continue";
            }
            var path = GamePreloadConfig_1.TILE_ICON_PATH + key;
            loadGameSpriteFrame(path, function (sf) {
                if (sf) {
                    tileIconCache[key] = sf;
                }
                finishOne();
            });
        };
        for (var i = 0; i < unique.length; i++) {
            _loop_1(i);
        }
    });
}
exports.preloadTileIconKeys = preloadTileIconKeys;
function getCachedTileIcon(key) {
    return tileIconCache[key] || null;
}
exports.getCachedTileIcon = getCachedTileIcon;
function clearGameImgAtlasCache() {
    cachedAtlas = null;
    atlasLoadPending.length = 0;
    for (var k in tileIconCache) {
        if (tileIconCache.hasOwnProperty(k)) {
            delete tileIconCache[k];
        }
    }
}
exports.clearGameImgAtlasCache = clearGameImgAtlasCache;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvdWkvR2FtZUltZ0F0bGFzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlEQUFrRjtBQUVsRixJQUFJLFdBQVcsR0FBbUIsSUFBSSxDQUFDO0FBQ3ZDLElBQUksZ0JBQWdCLEdBQWtELEVBQUUsQ0FBQztBQUN6RSxJQUFNLGFBQWEsR0FBc0MsRUFBRSxDQUFDO0FBRTVEOztHQUVHO0FBQ0gsU0FBZ0IsbUJBQW1CLENBQUMsTUFBK0M7SUFDL0UsSUFBSSxXQUFXLEVBQUU7UUFDYixJQUFJLE1BQU0sRUFBRTtZQUNSLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUN2QjtRQUNELE9BQU87S0FDVjtJQUNELElBQUksTUFBTSxFQUFFO1FBQ1IsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2pDO0lBQ0QsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsc0NBQWtCLEVBQUUsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFDLEdBQUcsRUFBRSxLQUFLO1FBQzdELElBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxFQUFFO1lBQ2YsV0FBVyxHQUFHLEtBQUssQ0FBQztTQUN2QjtRQUNELElBQU0sT0FBTyxHQUFHLGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3pDLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDNUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQzNCO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBcEJELGtEQW9CQztBQUVELDREQUE0RDtBQUM1RCxTQUFnQixtQkFBbUIsQ0FDL0IsT0FBZSxFQUNmLE9BQStDO0lBRS9DLElBQU0sUUFBUSxHQUFH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RSxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxDQUFDOztRQVpQLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtvQkFBN0IsQ0FBQztTQWFUO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBckNELGtEQXFDQztBQUVELFNBQWdCLGlCQUFpQixDQUFDLEdBQVc7SUFDekMsT0FBTyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDO0FBQ3RDLENBQUM7QUFGRCw4Q0FFQztBQUVELFNBQWdCLHNCQUFzQjtJQUNsQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQ25CLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDNUIsS0FBSyxJQUFNLENBQUMsSUFBSSxhQUFhLEVBQUU7UUFDM0IsSUFBSSxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2pDLE9BQU8sYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzNCO0tBQ0o7QUFDTCxDQUFDO0FBUkQsd0RBUUMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJTUdfQVVUT19BVExBU19QQUMsIElNR19ESVIsIFRJTEVfSUNPTl9QQVRIIH0gZnJvbSAnLi9HYW1lUHJlbG9hZENvbmZpZyc7XG5cbmxldCBjYWNoZWRBdGxhczogY2MuU3ByaXRlQXRsYXMgPSBudWxsO1xubGV0IGF0bGFzTG9hZFBlbmRpbmc6IEFycmF5PChhdGxhczogY2MuU3ByaXRlQXRsYXMgfCBudWxsKSA9PiB2b2lkPiA9IFtdO1xuY29uc3QgdGlsZUljb25DYWNoZTogeyBba2V5OiBzdHJpbmddOiBjYy5TcHJpdGVGcmFtZSB9ID0ge307XG5cbi8qKlxuICog6aKE5Yqg6L296Ieq5Yqo5Zu+6ZuG77yI5p6E5bu65ZCO55SxIHVpLnBhYyDnlJ/miJAgU3ByaXRlQXRsYXPvvJvnvJbovpHlmajlhoXku43lj6/mjInlrZDot6/lvoQgbG9hZCBTcHJpdGVGcmFtZe+8ieOAglxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJlbG9hZEdhbWVJbWdBdGxhcyhvbkRvbmU/OiAoYXRsYXM6IGNjLlNwcml0ZUF0bGFzIHwgbnVsbCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIGlmIChjYWNoZWRBdGxhcykge1xuICAgICAgICBpZiAob25Eb25lKSB7XG4gICAgICAgICAgICBvbkRvbmUoY2FjaGVkQXRsYXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG9uRG9uZSkge1xuICAgICAgICBhdGxhc0xvYWRQZW5kaW5nLnB1c2gob25Eb25lKTtcbiAgICB9XG4gICAgY2MucmVzb3VyY2VzLmxvYWQoSU1HX0FVVE9fQVRMQVNfUEFDLCBjYy5TcHJpdGVBdGxhcywgKGVyciwgYXRsYXMpID0+IHtcbiAgICAgICAgaWYgKCFlcnIgJiYgYXRsYXMpIHtcbiAgICAgICAgICAgIGNhY2hlZEF0bGFzID0gYXRsYXM7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGVuZGluZyA9IGF0bGFzTG9hZFBlbmRpbmcuc2xpY2UoKTtcbiAgICAgICAgYXRsYXNMb2FkUGVuZGluZy5sZW5ndGggPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBlbmRpbmcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHBlbmRpbmdbaV0oY2FjaGVkQXRsYXMpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKiDku47lm77pm4bmiJYgcmVzb3VyY2VzIOWtkOi3r+W+hOWKoOi9vSBTcHJpdGVGcmFtZe+8iOi3r+W+hOebuOWvuSByZXNvdXJjZXPvvIzml6DmianlsZXlkI3vvIkgKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkR2FtZVNwcml0ZUZyYW1lKFxuICAgIHJlc1BhdGg6IHN0cmluZyxcbiAgICBvblJlYWR5OiAoZnJhbWU6IGNjLlNwcml0ZUZyYW1lIHwgbnVsbCkgPT4gdm9pZFxuKTogdm9pZCB7XG4gICAgY29uc3QgdHJ5QXRsYXMgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICghY2FjaGVkQXRsYXMpIHtcbiAgICAgICAgICAgIGZpbmlzaERpcmVjdCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJhc2UgPSByZXNQYXRoLmluZGV4T2YoSU1HX0RJUikgPT09IDBcbiAgICAgICAgICAgID8gcmVzUGF0aC5zbGljZShJTUdfRElSLmxlbmd0aCArIDEpXG4gICAgICAgICAgICA6IHJlc1BhdGg7XG4gICAgICAgIGNvbnN0IG5hbWVzID0gW2Jhc2UsIGJhc2Uuc3BsaXQoJy8nKS5wb3AoKSB8fCBiYXNlXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgc2YgPSBjYWNoZWRBdGxhcy5nZXRTcHJpdGVGcmFtZShuYW1lc1tpXSk7XG4gICAgICAgICAgICBpZiAoc2YpIHtcbiAgICAgICAgICAgICAgICBvblJlYWR5KHNmKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZmluaXNoRGlyZWN0KCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGZpbmlzaERpcmVjdCA9ICgpOiB2b2lkID0+IHtcbiAgICAgICAgY2MucmVzb3VyY2VzLmxvYWQocmVzUGF0aCwgY2MuU3ByaXRlRnJhbWUsIChlcnIsIHNmKSA9PiB7XG4gICAgICAgICAgICBvblJlYWR5KCFlcnIgJiYgc2YgPyBzZiA6IG51bGwpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgaWYgKGNhY2hlZEF0bGFzKSB7XG4gICAgICAgIHRyeUF0bGFzKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcHJlbG9hZEdhbWVJbWdBdGxhcygoKSA9PiB0cnlBdGxhcygpKTtcbn1cblxuLyoqIOi/m+WxgOWJjeaJuemHj+mihOWKoOi9veacrOWFs+S8mueUqOWIsOeahOeJjOmdouWbvu+8iOWGmeWFpee8k+WtmO+8jOW8gOWxgOS4jeWGjemAkOS4qiBsb2Fk77yJICovXG5leHBvcnQgZnVuY3Rpb24gcHJlbG9hZFRpbGVJY29uS2V5cyhrZXlzOiBzdHJpbmdbXSwgb25Eb25lOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgY29uc3QgdW5pcXVlOiBzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBrID0ga2V5c1tpXTtcbiAgICAgICAgaWYgKGsgJiYgdW5pcXVlLmluZGV4T2YoaykgPT09IC0xKSB7XG4gICAgICAgICAgICB1bmlxdWUucHVzaChrKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAodW5pcXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBvbkRvbmUoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBwZW5kaW5nID0gdW5pcXVlLmxlbmd0aDtcbiAgICBjb25zdCBmaW5pc2hPbmUgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHBlbmRpbmctLTtcbiAgICAgICAgaWYgKHBlbmRpbmcgPD0gMCkge1xuICAgICAgICAgICAgb25Eb25lKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcHJlbG9hZEdhbWVJbWdBdGxhcygoKSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdW5pcXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSB1bmlxdWVbaV07XG4gICAgICAgICAgICBpZiAodGlsZUljb25DYWNoZVtrZXldKSB7XG4gICAgICAgICAgICAgICAgZmluaXNoT25lKCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwYXRoID0gVElMRV9JQ09OX1BBVEggKyBrZXk7XG4gICAgICAgICAgICBsb2FkR2FtZVNwcml0ZUZyYW1lKHBhdGgsIChzZikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzZikge1xuICAgICAgICAgICAgICAgICAgICB0aWxlSWNvbkNhY2hlW2tleV0gPSBzZjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmluaXNoT25lKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FjaGVkVGlsZUljb24oa2V5OiBzdHJpbmcpOiBjYy5TcHJpdGVGcmFtZSB8IG51bGwge1xuICAgIHJldHVybiB0aWxlSWNvbkNhY2hlW2tleV0gfHwgbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyR2FtZUltZ0F0bGFzQ2FjaGUoKTogdm9pZCB7XG4gICAgY2FjaGVkQXRsYXMgPSBudWxsO1xuICAgIGF0bGFzTG9hZFBlbmRpbmcubGVuZ3RoID0gMDtcbiAgICBmb3IgKGNvbnN0IGsgaW4gdGlsZUljb25DYWNoZSkge1xuICAgICAgICBpZiAodGlsZUljb25DYWNoZS5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgZGVsZXRlIHRpbGVJY29uQ2FjaGVba107XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/script/ui/GamePreloadConfig.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'ef326Z8EtBIVLoOIdA7qltl', 'GamePreloadConfig');
// script/ui/GamePreloadConfig.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SELECT_SWEEP_STYLE = exports.MATCH_ELIMINATION_SPINE = exports.HINT_SWAY_STYLE = exports.GUIDE_HAND_SEEN_STORAGE_KEY = exports.GUIDE_HAND_STYLE = exports.GUIDE_HAND_PATH = exports.FORBIDDEN_ICON_PATH = exports.SCORE_GLOW_PATH = exports.TILE_ICON_PATH = exports.rateResPath = exports.RATE_RES_KEYS = exports.TARGET_FRAME_RATE = exports.LOADING_LOG_TIMING = exports.LOADING_HIDE_BEFORE_ENTRANCE = exports.LOADING_MIN_VISIBLE_SEC = exports.AUTO_CLEAR_BEFORE_SETTLEMENT_SEC = exports.SETTLEMENT_MATCH_PAIRS = exports.IMG_AUTO_ATLAS_PAC = exports.IMG_DIR = exports.IMG_BG_DIR = exports.Z_ORDER_END_CHILD = exports.Z_ORDER = void 0;
/**
 * UI 层级（Cocos 2.4 的 cc.macro.MAX_ZINDEX 为 32767，禁止更大）
 * 数值越大越靠前。
 */
exports.Z_ORDER = {
    MATCH_SPINE: 2000,
    SCORE_HUD: 3000,
    HIT: 4000,
    RATE_POPUP: 5000,
    GUIDE_HAND: 6000,
    END_PANEL: 7000,
    LOADING: 8000,
};
/** 结算 end 节点内子节点相对层级 */
exports.Z_ORDER_END_CHILD = {
    DIM_BACKDROP: 0,
    STAR: 20,
    SCORE: 55,
    DOWNLOAD: 65,
};
/** 背景图（不合图，单独保留） */
exports.IMG_BG_DIR = 'img';
/** 碎图自动图集目录（ui.pac，构建时合成一张/多张图集） */
exports.IMG_DIR = 'img/atlas';
/** 自动图集配置资源名（与 atlas/ui.pac 对应） */
exports.IMG_AUTO_ATLAS_PAC = exports.IMG_DIR + "/ui";
/** 消除多少「对」后进入结算界面（改此值即可，不必清完整盘） */
exports.SETTLEMENT_MATCH_PAIRS = 4;
/** 达结算条件后，剩余牌自动配对消除的总时长（秒），结束后再弹出结算 */
exports.AUTO_CLEAR_BEFORE_SETTLEMENT_SEC = 2;
/** 加载屏最短展示（秒） */
exports.LOADING_MIN_VISIBLE_SEC = 0.08;
/** 资源就绪即关加载屏，入场落牌动画与可玩状态并行 */
exports.LOADING_HIDE_BEFORE_ENTRANCE = true;
/** 控制台输出各阶段耗时（调试加载速度） */
exports.LOADING_LOG_TIMING = true;
/** 游戏目标帧率（0 表示不限制；高刷屏预览建议 60） */
exports.TARGET_FRAME_RATE = 60;
/** 连消评级档位名（与贴图文件名一致） */
exports.RATE_RES_KEYS = ['good', 'great', 'excellent', 'amazing', 'unbelievable'];
/** cc.resources.load 用的评级图路径（图集内子图） */
function rateResPath(name) {
    return exports.IMG_DIR + "/" + name;
}
exports.rateResPath = rateResPath;
/** 麻将牌面图目录（图集内 牌面/ 子目录） */
exports.TILE_ICON_PATH = exports.IMG_DIR + "/\u724C\u9762/";
/** 分数变化时牌面后的背光 */
exports.SCORE_GLOW_PATH = exports.IMG_DIR + "/\u80CC\u5149";
/** 不可消提示图标 */
exports.FORBIDDEN_ICON_PATH = exports.IMG_DIR + "/icon_forbidden_50";
/** 引导小手 */
exports.GUIDE_HAND_PATH = exports.IMG_DIR + "/\u624B\u6307\u5934";
/**
 * 小手显示（棋盘坐标系像素）
 * - 锚点 (0,0) 对齐「靠左提示牌」根节点中心的世界坐标
 * - offsetX / offsetY：在棋盘上的微调（改这里会生效）
 */
exports.GUIDE_HAND_STYLE = {
    scale: 0.38,
    offsetX: 0,
    offsetY: 0,
};
/** localStorage：是否已展示过首次点击引导小手 */
exports.GUIDE_HAND_SEEN_STORAGE_KEY = 'mj_guide_hand_seen';
/** 提示麻将左右晃动（循环播放，每轮间隔 gap 秒） */
exports.HINT_SWAY_STYLE = {
    angle: 7,
    step: 0.1,
    gap: 1.5,
};
/** 消除 Spine：resources/spine/gameplay_elimination，动画名 in */
exports.MATCH_ELIMINATION_SPINE = {
    path: 'spine/gameplay_elimination',
    anim: 'in',
    scale: 0.45,
    zIndex: exports.Z_ORDER.MATCH_SPINE,
};
/** 选中扫光（牌面遮罩内细条扫过） */
exports.SELECT_SWEEP_STYLE = {
    duration: 0.55,
    gap: 0.4,
    edgeInset: 3,
    barWidth: 14,
    barHeightRatio: 0.98,
    angle: -14,
    peakOpacity: 140,
};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvdWkvR2FtZVByZWxvYWRDb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztHQUdHO0FBQ1UsUUFBQSxPQUFPLEdBQUc7SUFDbkIsV0FBVyxFQUFFLElBQUk7SUFDakIsU0FBUyxFQUFFLElBQUk7SUFDZixHQUFHLEVBQUUsSUFBSTtJQUNULFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFNBQVMsRUFBRSxJQUFJO0lBQ2YsT0FBTyxFQUFFLElBQUk7Q0FDUCxDQUFDO0FBRVgsd0JBQXdCO0FBQ1gsUUFBQSxpQkFBaUIsR0FBRztJQUM3QixZQUFZLEVBQUUsQ0FBQztJQUNmLElBQUksRUFBRSxFQUFFO0lBQ1IsS0FBSyxFQUFFLEVBQUU7SUFDVCxRQUFRLEVBQUUsRUFBRTtDQUNOLENBQUM7QUFFWCxvQkFBb0I7QUFDUCxRQUFBLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFFaEMsb0NBQW9DO0FBQ3ZCLFFBQUEsT0FBTyxHQUFHLFdBQVcsQ0FBQztBQUVuQyxtQ0FBbUM7QUFDdEIsUUFBQSxrQkFBa0IsR0FBTSxlQUFPLFFBQUssQ0FBQztBQUVsRCxtQ0FBbUM7QUFDdEIsUUFBQSxzQkFBc0IsR0FBRyxDQUFDLENBQUM7QUFFeEMsdUNBQXVDO0FBQzFCLFFBQUEsZ0NBQWdDLEdBQUcsQ0FBQyxDQUFDO0FBRWxELGlCQUFpQjtBQUNKLFFBQUEsdUJBQXVCLEdBQUcsSUFBSSxDQUFDO0FBRTVDLDhCQUE4QjtBQUNqQixRQUFBLDRCQUE0QixHQUFHLElBQUksQ0FBQztBQUVqRCx5QkFBeUI7QUFDWixRQUFBLGtCQUFrQixHQUFHLElBQUksQ0FBQztBQUV2QyxpQ0FBaUM7QUFDcEIsUUFBQSxpQkFBaUIsR0FBRyxFQUFFLENBQUM7QUFFcEMsd0JBQXdCO0FBQ1gsUUFBQSxhQUFhLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsY0FBYyxDQUFVLENBQUM7QUFFaEcsdUNBQXVDO0FBQ3ZDLFNBQWdCLFdBQVcsQ0FBQyxJQUFrQztJQUMxRCxPQUFVLGVBQU8sU0FBSSxJQUFNLENBQUM7QUFDaEMsQ0FBQztBQUZELGtDQUVDO0FBRUQsMkJBQTJCO0FBQ2QsUUFBQSxjQUFjLEdBQU0sZUFBTyxtQkFBTSxDQUFDO0FBRS9DLGtCQUFrQjtBQUNMLFFBQUEsZUFBZSxHQUFNLGVBQU8sa0JBQUssQ0FBQztBQUUvQyxjQUFjO0FBQ0QsUUFBQSxtQkFBbUIsR0FBTSxlQUFPLHVCQUFvQixDQUFDO0FBRWxFLFdBQVc7QUFDRSxRQUFBLGVBQWUsR0FBTSxlQUFPLHdCQUFNLENBQUM7QUFFaEQ7Ozs7R0FJRztBQUNVLFFBQUEsZ0JBQWdCLEdBQUc7SUFDNUIsS0FBSyxFQUFFLElBQUk7SUFDWCxPQUFPLEVBQUUsQ0FBQztJQUNWLE9BQU8sRUFBRSxDQUFDO0NBQ2IsQ0FBQztBQUVGLGtDQUFrQztBQUNyQixRQUFBLDJCQUEyQixHQUFHLG9CQUFvQixDQUFDO0FBRWhFLGdDQUFnQztBQUNuQixRQUFBLGVBQWUsR0FBRztJQUMzQixLQUFLLEVBQUUsQ0FBQztJQUNSLElBQUksRUFBRSxHQUFHO0lBQ1QsR0FBRyxFQUFFLEdBQUc7Q0FDWCxDQUFDO0FBRUYsMkRBQTJEO0FBQzlDLFFBQUEsdUJBQXVCLEdBQUc7SUFDbkMsSUFBSSxFQUFFLDRCQUE0QjtJQUNsQyxJQUFJLEVBQUUsSUFBSTtJQUNWLEtBQUssRUFBRSxJQUFJO0lBQ1gsTUFBTSxFQUFFLGVBQU8sQ0FBQyxXQUFXO0NBQzlCLENBQUM7QUFFRixzQkFBc0I7QUFDVCxRQUFBLGtCQUFrQixHQUFHO0lBQzlCLFFBQVEsRUFBRSxJQUFJO0lBQ2QsR0FBRyxFQUFFLEdBQUc7SUFDUixTQUFTLEVBQUUsQ0FBQztJQUNaLFFBQVEsRUFBRSxFQUFFO0lBQ1osY0FBYyxFQUFFLElBQUk7SUFDcEIsS0FBSyxFQUFFLENBQUMsRUFBRTtJQUNWLFdBQVcsRUFBRSxHQUFHO0NBQ25CLENBQUMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFVJIOWxgue6p++8iENvY29zIDIuNCDnmoQgY2MubWFjcm8uTUFYX1pJTkRFWCDkuLogMzI3NjfvvIznpoHmraLmm7TlpKfvvIlcbiAqIOaVsOWAvOi2iuWkp+i2iumdoOWJjeOAglxuICovXG5leHBvcnQgY29uc3QgWl9PUkRFUiA9IHtcbiAgICBNQVRDSF9TUElORTogMjAwMCxcbiAgICBTQ09SRV9IVUQ6IDMwMDAsXG4gICAgSElUOiA0MDAwLFxuICAgIFJBVEVfUE9QVVA6IDUwMDAsXG4gICAgR1VJREVfSEFORDogNjAwMCxcbiAgICBFTkRfUEFORUw6IDcwMDAsXG4gICAgTE9BRElORzogODAwMCxcbn0gYXMgY29uc3Q7XG5cbi8qKiDnu5PnrpcgZW5kIOiKgueCueWGheWtkOiKgueCueebuOWvueWxgue6pyAqL1xuZXhwb3J0IGNvbnN0IFpfT1JERVJfRU5EX0NISUxEID0ge1xuICAgIERJTV9CQUNLRFJPUDogMCxcbiAgICBTVEFSOiAyMCxcbiAgICBTQ09SRTogNTUsXG4gICAgRE9XTkxPQUQ6IDY1LFxufSBhcyBjb25zdDtcblxuLyoqIOiDjOaZr+Wbvu+8iOS4jeWQiOWbvu+8jOWNleeLrOS/neeVme+8iSAqL1xuZXhwb3J0IGNvbnN0IElNR19CR19ESVIgPSAnaW1nJztcblxuLyoqIOeijuWbvuiHquWKqOWbvumbhuebruW9le+8iHVpLnBhY++8jOaehOW7uuaXtuWQiOaIkOS4gOW8oC/lpJrlvKDlm77pm4bvvIkgKi9cbmV4cG9ydCBjb25zdCBJTUdfRElSID0gJ2ltZy9hdGxhcyc7XG5cbi8qKiDoh6rliqjlm77pm4bphY3nva7otYTmupDlkI3vvIjkuI4gYXRsYXMvdWkucGFjIOWvueW6lO+8iSAqL1xuZXhwb3J0IGNvbnN0IElNR19BVVRPX0FUTEFTX1BBQyA9IGAke0lNR19ESVJ9L3VpYDtcblxuLyoqIOa2iOmZpOWkmuWwkeOAjOWvueOAjeWQjui/m+WFpee7k+eul+eVjOmdou+8iOaUueatpOWAvOWNs+WPr++8jOS4jeW/hea4heWujOaVtOebmO+8iSAqL1xuZXhwb3J0IGNvbnN0IFNFVFRMRU1FTlRfTUFUQ0hfUEFJUlMgPSA0O1xuXG4vKiog6L6+57uT566X5p2h5Lu25ZCO77yM5Ymp5L2Z54mM6Ieq5Yqo6YWN5a+55raI6Zmk55qE5oC75pe26ZW/77yI56eS77yJ77yM57uT5p2f5ZCO5YaN5by55Ye657uT566XICovXG5leHBvcnQgY29uc3QgQVVUT19DTEVBUl9CRUZPUkVfU0VUVExFTUVOVF9TRUMgPSAyO1xuXG4vKiog5Yqg6L295bGP5pyA55+t5bGV56S677yI56eS77yJICovXG5leHBvcnQgY29uc3QgTE9BRElOR19NSU5fVklTSUJMRV9TRUMgPSAwLjA4O1xuXG4vKiog6LWE5rqQ5bCx57uq5Y2z5YWz5Yqg6L295bGP77yM5YWl5Zy66JC954mM5Yqo55S75LiO5Y+v546p54q25oCB5bm26KGMICovXG5leHBvcnQgY29uc3QgTE9BRElOR19ISURFX0JFRk9SRV9FTlRSQU5DRSA9IHRydWU7XG5cbi8qKiDmjqfliLblj7DovpPlh7rlkITpmLbmrrXogJfml7bvvIjosIPor5XliqDovb3pgJ/luqbvvIkgKi9cbmV4cG9ydCBjb25zdCBMT0FESU5HX0xPR19USU1JTkcgPSB0cnVlO1xuXG4vKiog5ri45oiP55uu5qCH5bin546H77yIMCDooajnpLrkuI3pmZDliLbvvJvpq5jliLflsY/pooTop4jlu7rorq4gNjDvvIkgKi9cbmV4cG9ydCBjb25zdCBUQVJHRVRfRlJBTUVfUkFURSA9IDYwO1xuXG4vKiog6L+e5raI6K+E57qn5qGj5L2N5ZCN77yI5LiO6LS05Zu+5paH5Lu25ZCN5LiA6Ie077yJICovXG5leHBvcnQgY29uc3QgUkFURV9SRVNfS0VZUyA9IFsnZ29vZCcsICdncmVhdCcsICdleGNlbGxlbnQnLCAnYW1hemluZycsICd1bmJlbGlldmFibGUnXSBhcyBjb25zdDtcblxuLyoqIGNjLnJlc291cmNlcy5sb2FkIOeUqOeahOivhOe6p+Wbvui3r+W+hO+8iOWbvumbhuWGheWtkOWbvu+8iSAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhdGVSZXNQYXRoKG5hbWU6IHR5cGVvZiBSQVRFX1JFU19LRVlTW251bWJlcl0pOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHtJTUdfRElSfS8ke25hbWV9YDtcbn1cblxuLyoqIOm6u+WwhueJjOmdouWbvuebruW9le+8iOWbvumbhuWGhSDniYzpnaIvIOWtkOebruW9le+8iSAqL1xuZXhwb3J0IGNvbnN0IFRJTEVfSUNPTl9QQVRIID0gYCR7SU1HX0RJUn0v54mM6Z2iL2A7XG5cbi8qKiDliIbmlbDlj5jljJbml7bniYzpnaLlkI7nmoTog4zlhYkgKi9cbmV4cG9ydCBjb25zdCBTQ09SRV9HTE9XX1BBVEggPSBgJHtJTUdfRElSfS/og4zlhYlgO1xuXG4vKiog5LiN5Y+v5raI5o+Q56S65Zu+5qCHICovXG5leHBvcnQgY29uc3QgRk9SQklEREVOX0lDT05fUEFUSCA9IGAke0lNR19ESVJ9L2ljb25fZm9yYmlkZGVuXzUwYDtcblxuLyoqIOW8leWvvOWwj+aJiyAqL1xuZXhwb3J0IGNvbnN0IEdVSURFX0hBTkRfUEFUSCA9IGAke0lNR19ESVJ9L+aJi+aMh+WktGA7XG5cbi8qKlxuICog5bCP5omL5pi+56S677yI5qOL55uY5Z2Q5qCH57O75YOP57Sg77yJXG4gKiAtIOmUmueCuSAoMCwwKSDlr7npvZDjgIzpnaDlt6bmj5DnpLrniYzjgI3moLnoioLngrnkuK3lv4PnmoTkuJbnlYzlnZDmoIdcbiAqIC0gb2Zmc2V0WCAvIG9mZnNldFnvvJrlnKjmo4vnm5jkuIrnmoTlvq7osIPvvIjmlLnov5nph4zkvJrnlJ/mlYjvvIlcbiAqL1xuZXhwb3J0IGNvbnN0IEdVSURFX0hBTkRfU1RZTEUgPSB7XG4gICAgc2NhbGU6IDAuMzgsXG4gICAgb2Zmc2V0WDogMCxcbiAgICBvZmZzZXRZOiAwLFxufTtcblxuLyoqIGxvY2FsU3RvcmFnZe+8muaYr+WQpuW3suWxleekuui/h+mmluasoeeCueWHu+W8leWvvOWwj+aJiyAqL1xuZXhwb3J0IGNvbnN0IEdVSURFX0hBTkRfU0VFTl9TVE9SQUdFX0tFWSA9ICdtal9ndWlkZV9oYW5kX3NlZW4nO1xuXG4vKiog5o+Q56S66bq75bCG5bem5Y+z5pmD5Yqo77yI5b6q546v5pKt5pS+77yM5q+P6L2u6Ze06ZqUIGdhcCDnp5LvvIkgKi9cbmV4cG9ydCBjb25zdCBISU5UX1NXQVlfU1RZTEUgPSB7XG4gICAgYW5nbGU6IDcsXG4gICAgc3RlcDogMC4xLFxuICAgIGdhcDogMS41LFxufTtcblxuLyoqIOa2iOmZpCBTcGluZe+8mnJlc291cmNlcy9zcGluZS9nYW1lcGxheV9lbGltaW5hdGlvbu+8jOWKqOeUu+WQjSBpbiAqL1xuZXhwb3J0IGNvbnN0IE1BVENIX0VMSU1JTkFUSU9OX1NQSU5FID0ge1xuICAgIHBhdGg6ICdzcGluZS9nYW1lcGxheV9lbGltaW5hdGlvbicsXG4gICAgYW5pbTogJ2luJyxcbiAgICBzY2FsZTogMC40NSxcbiAgICB6SW5kZXg6IFpfT1JERVIuTUFUQ0hfU1BJTkUsXG59O1xuXG4vKiog6YCJ5Lit5omr5YWJ77yI54mM6Z2i6YGu572p5YaF57uG5p2h5omr6L+H77yJICovXG5leHBvcnQgY29uc3QgU0VMRUNUX1NXRUVQX1NUWUxFID0ge1xuICAgIGR1cmF0aW9uOiAwLjU1LFxuICAgIGdhcDogMC40LFxuICAgIGVkZ2VJbnNldDogMyxcbiAgICBiYXJXaWR0aDogMTQsXG4gICAgYmFySGVpZ2h0UmF0aW86IDAuOTgsXG4gICAgYW5nbGU6IC0xNCxcbiAgICBwZWFrT3BhY2l0eTogMTQwLFxufTtcbiJdfQ==
//------QC-SOURCE-SPLIT------
