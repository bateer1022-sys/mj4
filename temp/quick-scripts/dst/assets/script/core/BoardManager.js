
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