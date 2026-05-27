"use strict";
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