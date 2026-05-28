import super_html_playable from './super_html_playable';

const { ccclass } = cc._decorator;

/** 随机牌面 key 集合 */
const MJ_FACE_KEYS = ['w1', 't1', 'b1', 'w5', 't5', 'b5', 'Z_bei','b9', 'Z_zhong', 't8'];
/** 无消除后再次引导的间隔秒数 */
const GUIDE_IDLE_SECONDS = 3;
/** 托盘内交换相邻麻将的时长（秒） */
const TRAY_SWAP_DURATION = 0.3;
/** 达到该累计消除对数时触发下载 */
const DOWNLOAD_TRIGGER_PAIR_COUNT = 3;
/** 对撞前左右外拉距离（像素） */
const TRAY_ELIM_SPREAD = 50;
/** 对撞前外拉阶段时长（秒） */
const TRAY_ELIM_OUT_DURATION = 0.2;
/** 对撞回中阶段时长（秒，使用加速 easing） */
const TRAY_ELIM_IN_DURATION = 0.1;
/** 交换完成后到开始对撞的间隔（秒） */
const TRAY_COLLISION_DELAY_AFTER_SWAP = 0.2;
/** 激励词首轮触发步长（累计消除数：2/4/6/...） */
const WORD_VFX_FIRST_TRIGGER_STEP = 2;
/** 激励词首轮全部播完后，最终词触发间隔 */
const WORD_VFX_REPEAT_INTERVAL = 4;
/** 激励词动画顺序（按累计消除阈值递进） */
const WORD_VFX_ANIMS = ['in_good', 'in_great', 'in_excellent', 'in_amazing', 'in_unbelievable'];
/** 一局清盘目标总分基准（约 2W，每局在此附近小幅浮动） */
const TARGET_FINAL_SCORE = 20000;
/** 清盘总分相对基准的最大浮动（±，结果为 10 的倍数） */
const TARGET_FINAL_SCORE_JITTER = 400;
/** 每次加分的最小步进 */
const SCORE_DELTA_STEP = 10;
/** 各激励档位得分权重（与 WORD_VFX_ANIMS 递进对应） */
const SCORE_TIER_WEIGHTS = [1, 1.85, 2.7, 3.8, 5.2, 7.5];
/** unbelievable 每叠一层额外权重 */
const SCORE_UNBELIEVABLE_WEIGHT_STEP = 1.15;
/** 连消音效资源路径（按递进顺序，使用 resources 相对路径且不带扩展名） */
const COMBO_SOUND_PATHS = [
    'sound/s_combo_1',
    'sound/s_combo_2',
    'sound/s_combo_3',
    'sound/s_combo_4',
    'sound/s_combo_5',
    'sound/s_combo_6',
];
/** 分数变化时播放的 spine 动画名 */
const SCORE_VFX_ANIM = 'in1';
/** 高亮圈按麻将尺寸适配的基准系数 */
const GUIDE_HINT_TILE_FIT_MARGIN = 1.08;
/** 高亮圈最终放大倍率（可调） */
const GUIDE_HINT_SCALE_MULTIPLIER = 1.9;
/** 启动加载：棋盘准备完成 key */
const LOADING_KEY_BOARD = 'board';
/** 启动加载：消除特效准备完成 key */
const LOADING_KEY_ELIMINATION = 'elimination';
/** 启动加载：高亮引导准备完成 key */
const LOADING_KEY_GUIDE_HINT = 'guide_hint';
/** 启动加载：手指引导准备完成 key */
const LOADING_KEY_GUIDE_FINGER = 'guide_finger';
/** 阴影 X 偏移（像素） */
const SHADOW_OFFSET_X = 0;
/** 阴影 Y 偏移（像素） */
const SHADOW_OFFSET_Y = 0;
/** 阴影 X 缩放 */
const SHADOW_SCALE_X = 1.05;
/** 阴影 Y 缩放 */
const SHADOW_SCALE_Y = 1.05;
/** 阴影透明度（0-255） */
const SHADOW_OPACITY = 185;
/** 麻将水平间距系数（1=刚好相接） */
const TILE_PAD_X = 0.94;
/** 麻将垂直间距系数（1=刚好相接） */
const TILE_PAD_Y = 0.94;

interface GridUnit {
    x: number;
    y: number;
}

interface TileState {
    node: cc.Node;
    shadowNode: cc.Node | null;
    faceKey: string;
    layerOrder: number;
    gridX: number;
    gridY: number;
    inTray: boolean;
    removed: boolean;
    isAnimating: boolean;
}

function isValid(node: cc.Node): boolean {
    return node && cc.isValid(node);
}

/** 取 tween 缓动（playable 打包后部分 cc.easing 字符串会解析失败） */
function getTweenEase(name: string): ((t: number) => number) | string {
    const easing = cc.easing as { [key: string]: (t: number) => number } | undefined;
    if (easing && typeof easing[name] === 'function') {
        return easing[name];
    }
    if (easing && typeof easing.quadIn === 'function') {
        return easing.quadIn;
    }
    return 'linear';
}

/** SHOW_ALL 下背景 cover 铺满可视区域（不含屏外黑边） */
function layoutShowAllCover(node: cc.Node, canvas: cc.Node): void {
    if (!node || !isValid(node) || !canvas || !isValid(canvas)) {
        return;
    }
    node.setPosition(0, 0);
    const scaleForShowAll = Math.min(
        cc.view.getCanvasSize().width / canvas.width,
        cc.view.getCanvasSize().height / canvas.height
    );
    const realWidth = node.width * scaleForShowAll;
    const realHeight = node.height * scaleForShowAll;
    node.scale = Math.max(
        cc.view.getCanvasSize().width / realWidth,
        cc.view.getCanvasSize().height / realHeight
    );
}

@ccclass
export default class GameController extends cc.Component {

    private boardRoot: cc.Node = null;
    private faceFrames: { [key: string]: cc.SpriteFrame } = {};
    private shadowFrame: cc.SpriteFrame = null;
    private banFrame: cc.SpriteFrame = null;
    private tileScale = 1;
    private layer1CenterY = -90;
    private boardOffsetY = 0;
    private boardPadding = 10;
    private boardBottomGap = 20;
    private hasBoardBounds = false;
    private boardMinX = 0;
    private boardMinY = 0;
    private boardMaxX = 0;
    private boardMaxY = 0;
    private boardStepX = 0;
    private boardStepY = 0;
    private allTiles: TileState[] = [];
    private slotNodes: cc.Node[] = [];
    private tray: Array<TileState | null> = [null, null, null, null];
    private trayBusy = false;
    private eliminationVfxNode: cc.Node = null;
    private eliminationVfx: sp.Skeleton = null;
    private banHintNodes: cc.Node[] = [];
    private guideHintSpineData: sp.SkeletonData = null;
    private guideFingerSpineData: sp.SkeletonData = null;
    private guideHintNodes: cc.Node[] = [];
    private guideFingerNode: cc.Node = null;
    private guideLastEliminationAt = 0;
    private guideNeedsFirstShow = true;
    private loadingMaskNode: cc.Node = null;
    private loadingSpinnerNode: cc.Node = null;
    private startupPending: Set<string> = new Set<string>();
    private scoreCount = 0;
    /** 本局已消除对数（用于激励词/音效/下载，与显示分数分离） */
    private eliminationPairCount = 0;
    /** 按消除序号预分配的加分（总和约 TARGET_FINAL_SCORE） */
    private scoreDeltaByPairIndex: number[] = [];
    private countLabel: cc.Label = null;
    private scoreVfxNode: cc.Node = null;
    private scoreVfx: sp.Skeleton = null;
    private wordVfxNode: cc.Node = null;
    private wordVfx: sp.Skeleton = null;
    private wordTierIndex = 0;
    private wordLastFinalTriggerCount = 0;
    private comboSounds: Array<cc.AudioClip | null> = [];
    private settlementShown = false;
    private settlementVictoryNode: cc.Node = null;
    private settlementVictorySk: sp.Skeleton = null;
    private settlementTaskLightSk: sp.Skeleton = null;
    private settlementCountLabel: cc.Label = null;
    private settlementDownloadNode: cc.Node = null;
    private settlementStarNodes: cc.Node[] = [];
    private settlementStarTargets: cc.Vec2[] = [];
    private downloadTriggered = false;
    /** 本局棋盘发牌序列（每种牌面数量为偶数） */
    private boardFaceKeys: string[] = [];
    private boardFaceKeyIndex = 0;

    /** 组件加载时初始化所有运行时数据与资源 */
    onLoad() {
        this.showLoadingScreen();
        this.startupPending = new Set<string>([
            LOADING_KEY_BOARD,
            LOADING_KEY_ELIMINATION,
            LOADING_KEY_GUIDE_HINT,
            LOADING_KEY_GUIDE_FINGER,
        ]);
        cc.view.setResizeCallback(() => {
            this.layoutBackground();
            this.fitBoardToScreen();
            this.layoutLoadingScreen();
        }, this);
        this.ensureBoardRoot();
        this.initScoreUI();
        this.collectSlotNodes();
        this.initEliminationVfx();
        this.initWordVfx();
        this.initComboSounds();
        this.initGuideAssets();
        this.schedule(this.tickGuideHint, GUIDE_IDLE_SECONDS);
        this.loadFacesAndBuild();
    }

    /** 组件销毁时清理定时器与回调 */
    onDestroy() {
        cc.view.setResizeCallback(null, null);
        this.unschedule(this.tickGuideHint);
    }

    /** 首帧启动入口，设置背景与跳转链接 */
    start() {
        this.layoutBackground();

        super_html_playable.set_google_play_url(
            'https://apps.apple.com/us/app/mahjong-blast/id6754014472'
        );
        super_html_playable.set_app_store_url(
            'https://play.google.com/store/apps/details?id=com.hungrystudio.mahjong'
        );
    }

    /** 下载 */
    public  downLoad() {
        super_html_playable.game_end();
        super_html_playable.download();
    }
    
    /** 游戏结束 */
    public gameEnd() {
    }

    /** 适配并铺满背景图 */
    private layoutBackground(): void {
        const bg = this.node.getChildByName('bg');
        if (!bg || !isValid(bg)) {
            return;
        }
        layoutShowAllCover(bg, this.node);

        const end = this.node.getChildByName('end');
        let mask = end.getChildByName('mask');  
        if (mask && mask != null) {
            layoutShowAllCover(mask, this.node);
        }
    }

    /** 创建并显示启动加载遮罩 */
    private showLoadingScreen(): void {
        if (this.loadingMaskNode && cc.isValid(this.loadingMaskNode)) {
            this.loadingMaskNode.active = true;
            return;
        }
        const mask = new cc.Node('loading_mask');
        mask.parent = this.node;
        mask.zIndex = 20000;
        mask.opacity = 220;
        mask.color = new cc.Color(0, 0, 0, 255);
        mask.addComponent(cc.BlockInputEvents);
        const bg = mask.addComponent(cc.Sprite);
        bg.sizeMode = cc.Sprite.SizeMode.CUSTOM;

        const spinner = new cc.Node('loading_spinner');
        spinner.parent = mask;
        spinner.setPosition(0, 0);
        const g = spinner.addComponent(cc.Graphics);
        g.lineWidth = 9;
        g.strokeColor = new cc.Color(255, 255, 255, 255);
        g.circle(0, 0, 34);
        g.stroke();
        this.playLoadingSpinnerLoop(spinner);

        this.loadingMaskNode = mask;
        this.loadingSpinnerNode = spinner;
        this.layoutLoadingScreen();
    }

    /** 根据画布尺寸更新加载遮罩布局 */
    private layoutLoadingScreen(): void {
        if (!this.loadingMaskNode || !cc.isValid(this.loadingMaskNode)) {
            return;
        }
        this.loadingMaskNode.setContentSize(this.node.width, this.node.height);
        this.loadingMaskNode.setPosition(0, 0);
        if (this.loadingSpinnerNode && cc.isValid(this.loadingSpinnerNode)) {
            this.loadingSpinnerNode.setPosition(0, 0);
        }
    }

    /** 标记单项启动资源完成，全部完成后关闭加载页 */
    private markStartupReady(key: string): void {
        if (!this.startupPending.has(key)) {
            return;
        }
        this.startupPending.delete(key);
        if (this.startupPending.size === 0) {
            this.hideLoadingScreen();
        }
    }

    /** 隐藏并销毁加载遮罩 */
    private hideLoadingScreen(): void {
        if (!this.loadingMaskNode || !cc.isValid(this.loadingMaskNode)) {
            return;
        }
        if (this.loadingSpinnerNode && cc.isValid(this.loadingSpinnerNode)) {
            this.loadingSpinnerNode.stopAllActions();
            this.loadingSpinnerNode.destroy();
            this.loadingSpinnerNode = null;
        }
        this.loadingMaskNode.destroy();
        this.loadingMaskNode = null;
    }

    /** 递归播放加载圆环旋转动画 */
    private playLoadingSpinnerLoop(spinner: cc.Node): void {
        if (!spinner || !cc.isValid(spinner) || !spinner.activeInHierarchy) {
            return;
        }
        cc.tween(spinner)
            .by(0.8, { angle: -360 })
            .call(() => this.playLoadingSpinnerLoop(spinner))
            .start();
    }

    /** 缓存结算页相关节点与组件引用 */
    private cacheSettlementNodes(): void {
        const endNode = this.node.getChildByName('end');
        if (!endNode || !cc.isValid(endNode)) {
            return;
        }
        this.settlementVictoryNode = endNode.getChildByName('victory');
        this.settlementVictorySk = this.settlementVictoryNode ? this.settlementVictoryNode.getComponent(sp.Skeleton) : null;
        const taskLightNode = endNode.getChildByName('TaskLight');
        this.settlementTaskLightSk = taskLightNode ? taskLightNode.getComponent(sp.Skeleton) : null;
        const endCountNode = taskLightNode ? taskLightNode.getChildByName('endCount') : null;
        this.settlementCountLabel = endCountNode ? endCountNode.getComponent(cc.Label) : null;
        this.settlementDownloadNode = endNode.getChildByName('download');

        this.settlementStarNodes = ['star1', 'star2', 'star3']
            .map((n) => endNode.getChildByName(n))
            .filter((n): n is cc.Node => !!n && cc.isValid(n));
        this.settlementStarTargets = this.settlementStarNodes.map((n) => cc.v2(n.x, n.y));
    }

    /** 重置结算页所有可动画元素到初始状态 */
    private resetSettlementPresentation(): void {
        this.cacheSettlementNodes();
        if (this.settlementDownloadNode && cc.isValid(this.settlementDownloadNode)) {
            this.settlementDownloadNode.stopAllActions();
            this.settlementDownloadNode.scale = 1;
            this.settlementDownloadNode.active = false;
        }
        this.settlementStarNodes.forEach((n, idx) => {
            if (!n || !cc.isValid(n)) {
                return;
            }
            n.stopAllActions();
            const target = this.settlementStarTargets[idx];
            if (target) {
                n.setPosition(target);
            }
            n.setScale(1);
            n.opacity = 255;
        });
        if (this.settlementCountLabel && cc.isValid(this.settlementCountLabel.node)) {
            this.settlementCountLabel.node.stopAllActions();
            this.settlementCountLabel.node.setScale(1);
        }
        if (this.settlementTaskLightSk) {
            this.settlementTaskLightSk.clearTracks();
        }
        if (this.settlementVictorySk) {
            this.settlementVictorySk.clearTracks();
            this.settlementVictorySk.setCompleteListener(null);
        }
    }

    /** 播放结算页整套演出动画 */
    private playSettlementSequence(): void {
        this.cacheSettlementNodes();
        if (this.settlementDownloadNode && cc.isValid(this.settlementDownloadNode)) {
            this.settlementDownloadNode.stopAllActions();
            this.settlementDownloadNode.scale = 1;
            this.settlementDownloadNode.active = false;
        }

        if (this.settlementVictorySk && this.settlementVictorySk.skeletonData) {
            const enterAnim = this.getSpineAnimName(this.settlementVictorySk.skeletonData, '合体_enter');
            const loopAnim = this.getSpineAnimName(this.settlementVictorySk.skeletonData, '合体_Loop')
                || this.getSpineAnimName(this.settlementVictorySk.skeletonData, '合体_loop');
            if (!enterAnim || !loopAnim) {
                cc.warn('[GameController] victory 缺少合体_enter/合体_loop 动画');
            } else {
                this.settlementVictorySk.loop = false;
                this.settlementVictorySk.clearTracks();
                this.settlementVictorySk.setToSetupPose();
                this.settlementVictorySk.setAnimation(0, enterAnim, false);
                this.settlementVictorySk.setCompleteListener(() => {
                    if (!this.settlementVictorySk) {
                        return;
                    }
                    this.settlementVictorySk.setCompleteListener(null);
                    this.settlementVictorySk.setAnimation(0, loopAnim, true);
                });
            }
        }

        this.settlementStarNodes.forEach((n, idx) => {
            if (!n || !cc.isValid(n)) {
                return;
            }
            const target = this.settlementStarTargets[idx] || cc.v2(n.x, n.y);
            n.stopAllActions();
            n.setPosition(0, 0);
            n.setScale(0.2);
            n.opacity = 0;
            cc.tween(n)
                .to(0.45, { position: target, scale: 1, opacity: 255 }, { easing: 'backOut' })
                .start();
        });

        if (this.settlementTaskLightSk && this.settlementTaskLightSk.skeletonData) {
            const taskAnim = this.getSpineAnimName(this.settlementTaskLightSk.skeletonData, 'Appear1');
            if (!taskAnim) {
                cc.warn('[GameController] TaskLight 缺少 Appear1 动画');
            } else {
                this.settlementTaskLightSk.loop = true;
                this.settlementTaskLightSk.clearTracks();
                this.settlementTaskLightSk.setToSetupPose();
                this.settlementTaskLightSk.setAnimation(0, taskAnim, true);
            }
        }

        if (this.settlementCountLabel && cc.isValid(this.settlementCountLabel.node)) {
            this.settlementCountLabel.string = this.formatScore(this.scoreCount);
            const n = this.settlementCountLabel.node;
            n.stopAllActions();
            n.setScale(1);
            cc.tween(n)
                .to(0.12, { scale: 1.16 }, { easing: 'quadOut' })
                .to(0.14, { scale: 1 }, { easing: 'quadIn' })
                .to(0.1, { scale: 1.1 }, { easing: 'quadOut' })
                .to(0.12, { scale: 1 }, { easing: 'quadIn' })
                .start();
        }

        if (this.settlementDownloadNode && cc.isValid(this.settlementDownloadNode)) {
            this.scheduleOnce(() => {
                if (!this.settlementDownloadNode || !cc.isValid(this.settlementDownloadNode)) {
                    return;
                }
                this.settlementDownloadNode.active = true;
                this.settlementDownloadNode.stopAllActions();
                this.settlementDownloadNode.setScale(1);
                this.playSettlementDownloadPulse();
            }, 0.65);
        }
    }

    /** 递归播放结算下载按钮呼吸动画 */
    private playSettlementDownloadPulse(): void {
        if (!this.settlementDownloadNode || !cc.isValid(this.settlementDownloadNode) || !this.settlementDownloadNode.activeInHierarchy) {
            return;
        }
        cc.tween(this.settlementDownloadNode)
            .to(0.55, { scale: 1.08 }, { easing: 'sineInOut' })
            .to(0.55, { scale: 1.0 }, { easing: 'sineInOut' })
            .call(() => this.playSettlementDownloadPulse())
            .start();
    }

    /** 确保牌盘根节点存在并放到正确层级 */
    private ensureBoardRoot(): void {
        let root = this.node.getChildByName('tiles_board');
        if (!root) {
            root = new cc.Node('tiles_board');
            root.parent = this.node;
            root.setPosition(0, 0);
        }
        const beforeOverlay = this.node.getChildByName('hit') || this.node.getChildByName('end');
        if (beforeOverlay) {
            root.setSiblingIndex(beforeOverlay.getSiblingIndex());
        } else {
            root.setSiblingIndex(this.node.childrenCount - 1);
        }
        root.setPosition(0, this.boardOffsetY);
        this.boardRoot = root;
    }

    /** 初始化主界面分数显示与结算相关状态 */
    private initScoreUI(): void {
        const countNode = this.node.getChildByName('count');
        this.countLabel = countNode ? countNode.getComponent(cc.Label) : null;
        this.initScoreVfx();
        this.scoreCount = 0;
        this.eliminationPairCount = 0;
        this.scoreDeltaByPairIndex = [];
        this.downloadTriggered = false;
        this.refreshScoreLabel(false);
        this.resetWordVfxProgress();
        this.settlementShown = false;
        const endNode = this.node.getChildByName('end');
        if (endNode && cc.isValid(endNode)) {
            endNode.active = false;
        }
        this.cacheSettlementNodes();
        this.resetSettlementPresentation();
    }

    /** 刷新主界面分数字符串，可选触发分数特效 */
    private refreshScoreLabel(playVfx = true): void {
        if (!this.countLabel || !cc.isValid(this.countLabel.node)) {
            return;
        }
        this.countLabel.string = this.formatScore(this.scoreCount);
        if (playVfx) {
            this.playScoreVfx();
        }
    }

    /** 初始化分数变化特效 spine */
    private initScoreVfx(): void {
        this.scoreVfxNode = this.node.getChildByName('gameplay_score');
        this.scoreVfx = this.scoreVfxNode ? this.scoreVfxNode.getComponent(sp.Skeleton) : null;
        if (!this.scoreVfxNode || !this.scoreVfx) {
            return;
        }
        this.scoreVfx.loop = false;
        this.scoreVfx.clearTracks();
        this.scoreVfxNode.active = false;
    }

    /** 播放一次分数变化特效 */
    private playScoreVfx(): void {
        if (!this.scoreVfx || !this.scoreVfxNode || !cc.isValid(this.scoreVfxNode) || !this.scoreVfx.skeletonData) {
            return;
        }
        const anim = this.getSpineAnimName(this.scoreVfx.skeletonData, SCORE_VFX_ANIM);
        if (!anim) {
            return;
        }
        this.scoreVfxNode.active = true;
        this.scoreVfx.clearTracks();
        this.scoreVfx.setToSetupPose();
        this.scoreVfx.setAnimation(0, anim, false);
        this.scoreVfx.setCompleteListener(() => {
            if (this.scoreVfxNode && cc.isValid(this.scoreVfxNode)) {
                this.scoreVfxNode.active = false;
            }
            if (this.scoreVfx) {
                this.scoreVfx.setCompleteListener(null);
            }
        });
    }

    /** 加载牌面与相关资源，完成后构建牌盘 */
    private loadFacesAndBuild(): void {
        let pending = MJ_FACE_KEYS.length + 2;
        MJ_FACE_KEYS.forEach((key) => {
            cc.resources.load(`img/atlas/牌面/${key}`, cc.SpriteFrame, (err, sf) => {
                if (!err && sf) {
                    this.faceFrames[key] = sf;
                }
                pending -= 1;
                if (pending <= 0) {
                    this.buildMahjongBoard();
                }
            });
        });
        cc.resources.load('img/atlas/shadow', cc.SpriteFrame, (err, sf) => {
            if (!err && sf) {
                this.shadowFrame = sf;
            } else {
                cc.warn('[GameController] 阴影图加载失败，回退到 prefab di', err);
            }
            pending -= 1;
            if (pending <= 0) {
                this.buildMahjongBoard();
            }
        });
        cc.resources.load('img/atlas/gameplay_ban', cc.SpriteFrame, (err, sf) => {
            if (!err && sf) {
                this.banFrame = sf;
            } else {
                cc.warn('[GameController] 锁提示图加载失败', err);
            }
            pending -= 1;
            if (pending <= 0) {
                this.buildMahjongBoard();
            }
        });
    }

    /** 重建整局麻将（层、牌、状态） */
    private buildMahjongBoard(): void {
        if (!this.boardRoot || !cc.isValid(this.boardRoot)) {
            this.markStartupReady(LOADING_KEY_BOARD);
            return;
        }
        this.boardRoot.removeAllChildren();
        this.boardRoot.setScale(1);
        this.boardRoot.setPosition(0, this.boardOffsetY);
        this.hasBoardBounds = false;
        this.allTiles = [];
        this.tray = [null, null, null, null];
        this.trayBusy = false;
        this.scoreCount = 0;
        this.eliminationPairCount = 0;
        this.downloadTriggered = false;
        this.refreshScoreLabel(false);
        this.resetWordVfxProgress();
        this.settlementShown = false;
        const endNode = this.node.getChildByName('end');
        if (endNode && cc.isValid(endNode)) {
            endNode.active = false;
        }
        this.resetSettlementPresentation();
        this.clearGuideHintNow();
        this.guideNeedsFirstShow = true;
        this.guideLastEliminationAt = Date.now() / 1000;
        this.collectSlotNodes();

        cc.resources.load('mj', cc.Prefab, (err, prefab) => {
            if (err || !prefab) {
                cc.error('[GameController] 加载 mj 预制体失败', err);
                this.markStartupReady(LOADING_KEY_BOARD);
                return;
            }

            const { stepX, stepY } = this.measureTileStep(prefab);
            this.boardStepX = stepX;
            this.boardStepY = stepY;
            const layout = this.getReferenceLayoutUnits();
            this.prepareBoardFaceKeys(layout);

            const layer1Shadow = this.createLayer('layer_1_shadow', 0);
            const layer1 = this.createLayer('layer_1', 1);
            this.spawnByUnits(layer1, layer1Shadow, prefab, layout.layer1, stepX, stepY, 0, 1);

            const layer2Shadow = this.createLayer('layer_2_shadow', 100);
            const layer2 = this.createLayer('layer_2', 101);
            this.spawnByUnits(layer2, layer2Shadow, prefab, layout.layer2, stepX, stepY, 100, 2, 0, 0.38);

            const layer3Shadow = this.createLayer('layer_3_shadow', 200);
            const layer3 = this.createLayer('layer_3', 201);
            this.spawnByUnits(layer3, layer3Shadow, prefab, layout.layer3, stepX, stepY, 200, 3, 0, 0.72);

            cc.log('[GameController] 麻将已生成', layout.layer1.length, layout.layer2.length, layout.layer3.length);
            this.cacheBoardBounds();
            this.fitBoardToScreen();
            this.tryShowGuideHint(true);
            this.markStartupReady(LOADING_KEY_BOARD);
        });
    }

    /** 只按牌本体尺寸算步长（不含阴影），让牌与牌自然挨着 */
    /** 测量麻将步长用于网格排布 */
    private measureTileStep(prefab: cc.Prefab): { stepX: number; stepY: number } {
        const sample = cc.instantiate(prefab);
        sample.setScale(this.tileScale);
        const w = sample.width * this.tileScale;
        const h = sample.height * this.tileScale;
        sample.destroy();
        return {
            stepX: w * TILE_PAD_X,
            stepY: h * TILE_PAD_Y,
        };
    }

    /** 创建牌层/阴影层节点 */
    private createLayer(name: string, zIndex: number): cc.Node {
        const layer = new cc.Node(name);
        layer.parent = this.boardRoot;
        layer.zIndex = zIndex;
        return layer;
    }

    /** 参照示意图的上中下堆叠 + 中空结构 */
    /** 返回三层麻将参考布局坐标 */
    private getReferenceLayoutUnits(): { layer1: GridUnit[]; layer2: GridUnit[]; layer3: GridUnit[] } {
        const make = (source: number[][]): GridUnit[] => {
            const seen: Record<string, boolean> = {};
            const out: GridUnit[] = [];
            source.forEach(([x, y]) => {
                const key = `${x}_${y}`;
                if (!seen[key]) {
                    seen[key] = true;
                    out.push({ x, y });
                }
            });
            return out;
        };

        const layer1: number[][] = [];
        const layer2: number[][] = [];
        const layer3: number[][] = [];

        const addRect = (arr: number[][], x0: number, x1: number, y0: number, y1: number): void => {
            for (let y = y0; y <= y1; y++) {
                for (let x = x0; x <= x1; x++) {
                    arr.push([x, y]);
                }
            }
        };
        const cutRect = (arr: number[][], x0: number, x1: number, y0: number, y1: number): void => {
            for (let i = arr.length - 1; i >= 0; i--) {
                const [x, y] = arr[i];
                if (x >= x0 && x <= x1 && y >= y0 && y <= y1) {
                    arr.splice(i, 1);
                }
            }
        };

        // 底层：减列（x: -3..3），总行数控制为 8 行（y: -4..3）
        // 上块（窄）
        addRect(layer1, -2, 2, 2, 3);
        addRect(layer1, -3, -3, 1, 3);
        addRect(layer1, 3, 3, 1, 3);
        addRect(layer1, -1, 1, 2, 2);

        // 过渡连接
        addRect(layer1, -3, -3, 1, 1);
        addRect(layer1, 3, 3, 1, 1);
        addRect(layer1, -2, 2, 0, 0);

        // 下块（高）
        addRect(layer1, -3, 3, -4, -2);
        addRect(layer1, -3, 3, -1, -1);
        addRect(layer1, -3, -3, 0, 0);
        addRect(layer1, 3, 3, 0, 0);
        addRect(layer1, -2, 2, 0, 0);
        // 底部中间局部镂空
        cutRect(layer1, -1, 1, -3, -2);

        // 第二层：纵向过渡（8 行范围）
        addRect(layer2, -2, 2, 2, 2);
        addRect(layer2, -1, 1, 2, 2);
        addRect(layer2, -1, 1, 1, 1);
        addRect(layer2, -1, 1, 0, 0);
        addRect(layer2, -1, 1, -1, -1);
        addRect(layer2, -2, 2, -2, -2);
        addRect(layer2, -1, 1, -3, -3);

        // 第三层：中心竖向小堆（8 行范围）
        addRect(layer3, -1, 1, 2, 2);
        addRect(layer3, 0, 0, 2, 2);
        addRect(layer3, -1, 1, 0, 0);
        addRect(layer3, 0, 0, -1, -1);
        addRect(layer3, -1, 1, -2, -2);
        // 补 1 格使总牌数为偶数，保证可全部成对消除
        addRect(layer3, 0, 0, -3, -3);

        return {
            layer1: make(layer1),
            layer2: make(layer2),
            layer3: make(layer3),
        };
    }

    /** 生成成对牌面序列并打乱，保证整盘可两两消除 */
    private prepareBoardFaceKeys(layout: { layer1: GridUnit[]; layer2: GridUnit[]; layer3: GridUnit[] }): void {
        const total = layout.layer1.length + layout.layer2.length + layout.layer3.length;
        this.boardFaceKeys = this.buildPairedFaceKeys(total);
        this.boardFaceKeyIndex = 0;
        this.prepareScoreCurve(Math.floor(total / 2));
    }

    /** 将加分取整为 SCORE_DELTA_STEP 的倍数（至少一步） */
    private roundScoreDelta(value: number): number {
        const step = SCORE_DELTA_STEP;
        return Math.max(step, Math.round(value / step) * step);
    }

    /** 本局清盘目标分：约 2W，每局在基准附近随机浮动且为 10 的倍数 */
    private pickSessionTargetScore(): number {
        const jitterSteps = Math.floor(TARGET_FINAL_SCORE_JITTER / SCORE_DELTA_STEP);
        const offset = (Math.floor(Math.random() * (jitterSteps * 2 + 1)) - jitterSteps) * SCORE_DELTA_STEP;
        return TARGET_FINAL_SCORE + offset;
    }

    /** 按激励档位权重预分配每对消除加分（每项为 10 的倍数，总和约 2W 但不凑整） */
    private prepareScoreCurve(totalPairs: number): void {
        if (totalPairs <= 0) {
            this.scoreDeltaByPairIndex = [];
            return;
        }
        const sessionTarget = this.pickSessionTargetScore();
        const weights: number[] = [];
        for (let pair = 1; pair <= totalPairs; pair += 1) {
            const tier = this.getElimWordTier(pair);
            const capped = Math.min(tier, SCORE_TIER_WEIGHTS.length - 1);
            const base = SCORE_TIER_WEIGHTS[capped];
            const w = tier <= 5
                ? base
                : SCORE_TIER_WEIGHTS[5] + (tier - 5) * SCORE_UNBELIEVABLE_WEIGHT_STEP;
            weights.push(w);
        }
        const weightSum = weights.reduce((sum, w) => sum + w, 0);
        this.scoreDeltaByPairIndex = weights.map((w) => this.roundScoreDelta((sessionTarget * w) / weightSum));
    }

    /** 与激励词 spine 阈值一致的消除档位（0=未触发 good） */
    private getElimWordTier(pairCount: number): number {
        if (pairCount < 2) {
            return 0;
        }
        if (pairCount < 4) {
            return 1;
        }
        if (pairCount < 6) {
            return 2;
        }
        if (pairCount < 8) {
            return 3;
        }
        if (pairCount < 10) {
            return 4;
        }
        return 5 + Math.floor((pairCount - 10) / WORD_VFX_REPEAT_INTERVAL);
    }

    /** 消除一对后按档位叠加分数 */
    private addScoreOnElimination(): void {
        this.eliminationPairCount += 1;
        const idx = this.eliminationPairCount - 1;
        let delta = SCORE_DELTA_STEP;
        if (idx >= 0 && idx < this.scoreDeltaByPairIndex.length) {
            delta = this.scoreDeltaByPairIndex[idx];
        } else {
            const tier = this.getElimWordTier(this.eliminationPairCount);
            const capped = Math.min(tier, SCORE_TIER_WEIGHTS.length - 1);
            const base = SCORE_TIER_WEIGHTS[capped];
            const w = tier <= 5
                ? base
                : SCORE_TIER_WEIGHTS[5] + (tier - 5) * SCORE_UNBELIEVABLE_WEIGHT_STEP;
            const weightSum = SCORE_TIER_WEIGHTS.reduce((s, v) => s + v, 0);
            delta = this.roundScoreDelta((TARGET_FINAL_SCORE * w) / weightSum);
        }
        this.scoreCount += delta;
        this.refreshScoreLabel();
    }

    /** 分数展示格式化 */
    private formatScore(value: number): string {
        return `${Math.max(0, Math.floor(value))}`;
    }

    /** 构建偶数张牌面 key 列表（每种 key 成对出现） */
    private buildPairedFaceKeys(tileCount: number): string[] {
        if (tileCount % 2 !== 0) {
            cc.warn('[GameController] 牌数为奇数，无法保证全部成对，请检查布局');
        }
        const count = tileCount - (tileCount % 2);
        const keys: string[] = [];
        const source = MJ_FACE_KEYS;
        const pairCount = Math.max(0, Math.floor(count / 2));
        for (let i = 0; i < pairCount; i += 1) {
            const key = source[Math.floor(Math.random() * source.length)];
            keys.push(key, key);
        }
        for (let i = keys.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = keys[i];
            keys[i] = keys[j];
            keys[j] = tmp;
        }
        return keys;
    }

    /** 取下一张待发牌面 key；用尽时返回 null（不再发牌） */
    private takeBoardFaceKey(): string | null {
        if (this.boardFaceKeyIndex >= this.boardFaceKeys.length) {
            return null;
        }
        const key = this.boardFaceKeys[this.boardFaceKeyIndex];
        this.boardFaceKeyIndex += 1;
        return key;
    }

    /** 按坐标批量生成一层麻将 */
    private spawnByUnits(
        parent: cc.Node,
        shadowParent: cc.Node,
        prefab: cc.Prefab,
        units: GridUnit[],
        stepX: number,
        stepY: number,
        zBase: number,
        layerOrder: number,
        offsetXUnits = 0,
        offsetYUnits = 0
    ): void {
        // 同一层渲染顺序：按右下方向递增，确保右下角 zIndex 最高
        const ordered = units.slice().sort((a, b) => {
            const ax = a.x + offsetXUnits;
            const ay = a.y + offsetYUnits;
            const bx = b.x + offsetXUnits;
            const by = b.y + offsetYUnits;
            const aKey = ax - ay;
            const bKey = bx - by;
            if (Math.abs(aKey - bKey) > 0.0001) {
                return aKey - bKey;
            }
            if (Math.abs(ay - by) > 0.0001) {
                return by - ay;
            }
            return ax - bx;
        });
        ordered.forEach((u, idx) => {
            const gridX = u.x + offsetXUnits;
            const gridY = u.y + offsetYUnits;
            const x = gridX * stepX;
            const y = gridY * stepY + this.layer1CenterY;
            const faceKey = this.takeBoardFaceKey();
            if (faceKey === null) {
                return;
            }
            this.spawnTile(parent, shadowParent, prefab, x, y, zBase + idx, layerOrder, gridX, gridY, faceKey);
        });
    }

    /** 自动适配到屏幕安全区域，避免超出边界 */
    /** 将牌盘缩放并对齐到安全区域 */
    private fitBoardToScreen(): void {
        if (!this.boardRoot || !cc.isValid(this.boardRoot) || !this.hasBoardBounds) {
            return;
        }

        const boundsW = Math.max(1, this.boardMaxX - this.boardMinX);
        const boundsH = Math.max(1, this.boardMaxY - this.boardMinY);
        const safeW = this.node.width - this.boardPadding * 2;
        const safeH = this.node.height - this.boardPadding * 2;
        const fitScale = Math.min(1, safeW / boundsW, safeH / boundsH);

        this.boardRoot.setScale(fitScale);

        const boundsCX = (this.boardMinX + this.boardMaxX) * 0.5;
        const targetCX = 0;
        const targetMinY = -this.node.height * 0.5 + this.boardBottomGap;
        this.boardRoot.setPosition(
            targetCX - boundsCX * fitScale,
            targetMinY - this.boardMinY * fitScale
        );
    }

    /** 仅在重建布局后计算一次包围盒，避免重复遍历 */
    /** 缓存牌盘包围盒供适配使用 */
    private cacheBoardBounds(): void {
        if (!this.boardRoot || !cc.isValid(this.boardRoot) || this.boardRoot.childrenCount <= 0) {
            this.hasBoardBounds = false;
            return;
        }
        let minX = Number.POSITIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;
        let hasRect = false;

        this.boardRoot.children.forEach((layer) => {
            layer.children.forEach((n) => {
                const r = n.getBoundingBox();
                if (!r) {
                    return;
                }
                hasRect = true;
                minX = Math.min(minX, r.xMin);
                minY = Math.min(minY, r.yMin);
                maxX = Math.max(maxX, r.xMax);
                maxY = Math.max(maxY, r.yMax);
            });
        });

        if (!hasRect) {
            this.hasBoardBounds = false;
            return;
        }
        this.boardMinX = minX;
        this.boardMinY = minY;
        this.boardMaxX = maxX;
        this.boardMaxY = maxY;
        this.hasBoardBounds = true;
    }

    /** 初始化消除特效 spine */
    private initEliminationVfx(): void {
        const scene = cc.director.getScene();
        const root = scene || this.node;
        const name = 'gameplay_elimination_a';
        let node = root.getChildByName(name);
        if (!node) {
            node = cc.find(name);
        }
        if (!node) {
            node = new cc.Node(name);
        }
        if (node.parent !== this.node) {
            // 统一挂到 Canvas 下，避免在场景根节点导致被 UI 层遮挡
            node.parent = this.node;
        }
        this.eliminationVfxNode = node;
        this.eliminationVfx = node.getComponent(sp.Skeleton) || node.addComponent(sp.Skeleton);
        if (!this.eliminationVfx) {
            cc.warn('[GameController] 无法创建消除特效 sp.Skeleton 组件');
            this.markStartupReady(LOADING_KEY_ELIMINATION);
            return;
        }
        this.eliminationVfx.loop = false;
        this.eliminationVfxNode.zIndex = 9998;
        node.active = false;
        cc.resources.load('spine/gameplay_elimination_a', sp.SkeletonData, (err, data) => {
            if (err || !data || !this.eliminationVfx || !cc.isValid(this.eliminationVfx.node)) {
                cc.warn('[GameController] 消除特效资源加载失败', err);
                this.markStartupReady(LOADING_KEY_ELIMINATION);
                return;
            }
            this.eliminationVfx.skeletonData = data;
            this.eliminationVfx.clearTracks();
            this.eliminationVfx.setToSetupPose();
            this.markStartupReady(LOADING_KEY_ELIMINATION);
        });
    }

    /** 获取消除特效实际可播放动画名 */
    private getEliminationAnimName(): string | null {
        return this.getSpineAnimName(this.eliminationVfx ? this.eliminationVfx.skeletonData : null, 'in');
    }

    /** 初始化激励词特效 spine */
    private initWordVfx(): void {
        const node = this.node.getChildByName('gameplay_word') || cc.find('Canvas/gameplay_word');
        if (!node) {
            cc.warn('[GameController] 未找到激励词节点 gameplay_word');
            return;
        }
        this.wordVfxNode = node;
        this.wordVfx = node.getComponent(sp.Skeleton);
        if (!this.wordVfx) {
            cc.warn('[GameController] gameplay_word 缺少 sp.Skeleton 组件');
            return;
        }
        this.wordVfx.loop = false;
        node.active = false;
    }

    /** 重置激励词触发进度 */
    private resetWordVfxProgress(): void {
        this.wordTierIndex = 0;
        this.wordLastFinalTriggerCount = 0;
        if (this.wordVfx) {
            this.wordVfx.clearTracks();
            this.wordVfx.setCompleteListener(null);
        }
        if (this.wordVfxNode && cc.isValid(this.wordVfxNode)) {
            this.wordVfxNode.active = false;
        }
    }

    /** 按累计消除数判断并播放激励词 */
    private tryPlayWordVfxByCount(): void {
        if (!this.wordVfx || !this.wordVfxNode || !cc.isValid(this.wordVfxNode) || !this.wordVfx.skeletonData) {
            return;
        }
        const total = this.eliminationPairCount;
        if (this.wordTierIndex < WORD_VFX_ANIMS.length) {
            const need = (this.wordTierIndex + 1) * WORD_VFX_FIRST_TRIGGER_STEP;
            if (total < need) {
                return;
            }
            const anim = WORD_VFX_ANIMS[this.wordTierIndex];
            this.wordTierIndex += 1;
            if (this.wordTierIndex >= WORD_VFX_ANIMS.length) {
                this.wordLastFinalTriggerCount = total;
            }
            this.playWordVfx(anim);
            return;
        }
        if (total - this.wordLastFinalTriggerCount < WORD_VFX_REPEAT_INTERVAL) {
            return;
        }
        this.wordLastFinalTriggerCount = total;
        this.playWordVfx(WORD_VFX_ANIMS[WORD_VFX_ANIMS.length - 1]);
    }

    /** 播放指定激励词动画 */
    private playWordVfx(animName: string): void {
        if (!this.wordVfx || !this.wordVfxNode || !cc.isValid(this.wordVfxNode)) {
            return;
        }
        this.wordVfxNode.active = true;
        this.wordVfxNode.setSiblingIndex(this.node.childrenCount - 1);
        this.wordVfx.clearTracks();
        this.wordVfx.setToSetupPose();
        this.wordVfx.setAnimation(0, animName, false);
        this.wordVfx.setCompleteListener(() => {
            if (this.wordVfxNode && cc.isValid(this.wordVfxNode)) {
                this.wordVfxNode.active = false;
            }
            if (this.wordVfx) {
                this.wordVfx.setCompleteListener(null);
            }
        });
    }

    /** 预加载连消音效资源 */
    private initComboSounds(): void {
        this.comboSounds = new Array(COMBO_SOUND_PATHS.length).fill(null);
        COMBO_SOUND_PATHS.forEach((path, idx) => {
            cc.resources.load(path, cc.AudioClip, (err, clip) => {
                if (err || !clip) {
                    cc.warn('[GameController] 连消音效加载失败', path, err);
                    return;
                }
                this.comboSounds[idx] = clip;
            });
        });
    }

    /** 按当前累计消除数播放递进音效 */
    private playComboSoundByCount(): void {
        if (this.comboSounds.length === 0) {
            return;
        }
        const index = Math.max(0, Math.min(this.eliminationPairCount - 1, this.comboSounds.length - 1));
        const clip = this.comboSounds[index];
        if (!clip) {
            return;
        }
        cc.audioEngine.playEffect(clip, false);
    }

    /** 达到指定消除对数后触发一次下载 */
    private checkAndTriggerDownloadByScore(): void {
        if (this.downloadTriggered) {
            return;
        }
        if (this.eliminationPairCount < DOWNLOAD_TRIGGER_PAIR_COUNT) {
            return;
        }
        this.downloadTriggered = true;
        this.downLoad();
    }

    /** 在两张牌中点播放消除特效 */
    private playEliminationVfx(tileA: cc.Node, tileB: cc.Node): void {
        if (!this.eliminationVfx || !this.eliminationVfxNode || !cc.isValid(this.eliminationVfxNode) || !this.eliminationVfx.skeletonData) {
            return;
        }
        const wA = tileA.convertToWorldSpaceAR(cc.v2(0, 0));
        const wB = tileB.convertToWorldSpaceAR(cc.v2(0, 0));
        const world = cc.v2((wA.x + wB.x) * 0.5, (wA.y + wB.y) * 0.5);
        const parent = this.eliminationVfxNode.parent;
        const local = parent ? parent.convertToNodeSpaceAR(world) : world;
        this.eliminationVfxNode.setPosition(local);
        this.eliminationVfxNode.active = true;
        this.eliminationVfxNode.setSiblingIndex(parent ? parent.childrenCount - 1 : 0);
        this.eliminationVfx.clearTracks();
        const animName = this.getEliminationAnimName();
        if (!animName) {
            this.eliminationVfxNode.active = false;
            return;
        }
        this.eliminationVfx.setAnimation(0, animName, false);
        this.eliminationVfx.setCompleteListener(() => {
            if (cc.isValid(this.eliminationVfxNode)) {
                this.eliminationVfxNode.active = false;
            }
            if (this.eliminationVfx) {
                this.eliminationVfx.setCompleteListener(null);
            }
        });
    }

    /** 搜索并缓存4个托盘格子节点 */
    private collectSlotNodes(): void {
        const found: cc.Node[] = [];
        const visit = (node: cc.Node): void => {
            if (node.name === 'slot_frame') {
                found.push(node);
            }
            node.children.forEach((ch) => visit(ch));
        };
        visit(this.node);
        found.sort((a, b) => {
            if (Math.abs(a.y - b.y) > 1) {
                return b.y - a.y;
            }
            return a.x - b.x;
        });
        this.slotNodes = found.slice(0, 4);
    }

    /** 处理麻将点击逻辑（可点校验与入托盘） */
    private onTileTap(state: TileState): void {
        if (this.settlementShown || this.trayBusy || state.removed || state.inTray || state.isAnimating || !cc.isValid(state.node)) {
            return;
        }
        this.clearGuideHintNow();
        const above = this.getBlockingAbove(state);
        if (above.length > 0) {
            this.shakeNodes([state, ...above]);
            cc.log('不能点击：上层有麻将');
            return;
        }

        const side = this.getSideNeighbors(state);
        if (side.left && side.right) {
            this.shakeNodes([state, side.left, side.right]);
            this.showBanHints(state.node);
            cc.log('不能点击：左右都被挡住');
            return;
        }
        this.moveToTray(state);
    }

    /** 预加载引导相关 spine 资源 */
    private initGuideAssets(): void {
        cc.resources.load('spine/gameplay_hint', sp.SkeletonData, (err, data) => {
            if (err || !data) {
                cc.warn('[GameController] 引导光圈资源加载失败', err);
                this.markStartupReady(LOADING_KEY_GUIDE_HINT);
                return;
            }
            this.guideHintSpineData = data;
            this.tryShowGuideHint(true);
            this.markStartupReady(LOADING_KEY_GUIDE_HINT);
        });
        cc.resources.load('spine/gameplay_guide_finger', sp.SkeletonData, (err, data) => {
            if (err || !data) {
                cc.warn('[GameController] 引导手指资源加载失败', err);
                this.markStartupReady(LOADING_KEY_GUIDE_FINGER);
                return;
            }
            this.guideFingerSpineData = data;
            this.tryShowGuideHint(true);
            this.markStartupReady(LOADING_KEY_GUIDE_FINGER);
        });
    }

    /** 引导定时检查入口 */
    private tickGuideHint(): void {
        if (this.trayBusy) {
            return;
        }
        // 每隔 3 秒检查一次；若当前已有引导在播，直接返回
        if (this.isGuideHintShowing()) {
            return;
        }
        this.tryShowGuideHint(false);
    }

    /** 根据时机判断是否显示引导 */
    private tryShowGuideHint(forceFirst: boolean): void {
        if (!this.guideHintSpineData || !this.guideFingerSpineData || this.allTiles.length === 0) {
            return;
        }
        if (this.isGuideHintShowing()) {
            return;
        }
        const now = Date.now() / 1000;
        const shouldShowFirst = this.guideNeedsFirstShow && forceFirst;
        const shouldShowByIdle = !this.guideNeedsFirstShow
            && now - this.guideLastEliminationAt >= GUIDE_IDLE_SECONDS;
        if (!shouldShowFirst && !shouldShowByIdle) {
            return;
        }
        const pair = this.findHintPair();
        if (!pair) {
            return;
        }
        this.showGuideHintPair(pair[0], pair[1]);
        this.guideNeedsFirstShow = false;
    }

    /** 挑选当前应引导的一对目标牌 */
    private findHintPair(): [TileState, TileState] | null {
        const clickableBoardTiles = this.getClickableBoardTiles();
        const trayTiles = this.tray.filter((s): s is TileState => {
            return !!s && !s.removed && s.inTray && cc.isValid(s.node);
        });

        // 格子里有麻将时，优先引导「格子里的牌 + 下面可点同牌」
        if (trayTiles.length > 0) {
            for (let i = 0; i < trayTiles.length; i += 1) {
                const trayState = trayTiles[i];
                const matched = clickableBoardTiles.find((b) => b.faceKey === trayState.faceKey);
                if (matched) {
                    return [trayState, matched];
                }
            }
        }

        // 4 个格子为空（或无可匹配）时，从下面可点麻将里找一对
        const groups: Record<string, TileState[]> = {};
        clickableBoardTiles.forEach((s) => {
            groups[s.faceKey] = groups[s.faceKey] || [];
            groups[s.faceKey].push(s);
        });
        const keys = Object.keys(groups);
        for (let i = 0; i < keys.length; i += 1) {
            const list = groups[keys[i]];
            if (list.length >= 2) {
                return [list[0], list[1]];
            }
        }
        return null;
    }

    /** 获取当前底牌中可点击集合 */
    private getClickableBoardTiles(): TileState[] {
        return this.allTiles.filter((s) => {
            if (s.removed || s.inTray || s.isAnimating || !cc.isValid(s.node)) {
                return false;
            }
            if (this.getBlockingAbove(s).length > 0) {
                return false;
            }
            const side = this.getSideNeighbors(s);
            return !(side.left && side.right);
        });
    }

    /** 确保引导高亮节点数量充足 */
    private ensureGuideHintNodes(count: number): void {
        const parent = this.boardRoot || this.node;
        for (let i = 0; i < count; i += 1) {
            const oldNode = this.guideHintNodes[i];
            if (oldNode && cc.isValid(oldNode)) {
                continue;
            }
            const node = new cc.Node(`guide_hint_${i}`);
            const skeleton = node.addComponent(sp.Skeleton);
            skeleton.loop = true;
            node.active = false;
            node.parent = parent;
            node.zIndex = 9997;
            this.guideHintNodes[i] = node;
        }
    }

    /** 确保引导手指节点存在 */
    private ensureGuideFingerNode(): cc.Node {
        if (this.guideFingerNode && cc.isValid(this.guideFingerNode)) {
            return this.guideFingerNode;
        }
        const node = new cc.Node('guide_finger');
        node.parent = this.node;
        node.zIndex = 9998;
        node.active = false;
        this.guideFingerNode = node;
        node.addComponent(sp.Skeleton);
        return node;
    }

    /** 从 skeletonData 中选取可播放动画名 */
    private getSpineAnimName(data: sp.SkeletonData | null, preferred: string): string | null {
        if (!data) {
            return null;
        }
        const json: any = (data as any).skeletonJson;
        const animations = json && json.animations ? Object.keys(json.animations) : [];
        if (animations.length === 0) {
            return null;
        }
        return animations.indexOf(preferred) >= 0 ? preferred : animations[0];
    }

    /** 读取 spine 资源的原始尺寸 */
    private getSkeletonSize(data: sp.SkeletonData): { width: number; height: number } {
        const json: any = data ? (data as any).skeletonJson : null;
        const sk = json && json.skeleton ? json.skeleton : null;
        return {
            width: Math.max(1, sk && sk.width ? sk.width : 1),
            height: Math.max(1, sk && sk.height ? sk.height : 1),
        };
    }

    /** 显示一对麻将的引导（光圈+手指） */
    private showGuideHintPair(a: TileState, b: TileState): void {
        if (!cc.isValid(a.node) || !cc.isValid(b.node)) {
            return;
        }
        this.clearGuideHintNow();
        const pair = [a, b];
        this.ensureGuideHintNodes(pair.length);
        const hintAnim = this.getSpineAnimName(this.guideHintSpineData, 'in');
        if (!hintAnim) {
            return;
        }
        const skSize = this.getSkeletonSize(this.guideHintSpineData);
        pair.forEach((state, idx) => {
            const hintNode = this.guideHintNodes[idx];
            if (!hintNode || !cc.isValid(hintNode) || !cc.isValid(state.node)) {
                return;
            }
            const sk = hintNode.getComponent(sp.Skeleton);
            if (!sk) {
                return;
            }
            // 提示 spine 直接挂到麻将节点下
            hintNode.parent = state.node;
            hintNode.setSiblingIndex(Math.max(0, state.node.childrenCount - 1));
            hintNode.setPosition(0, 0);
            hintNode.active = true;
            sk.skeletonData = this.guideHintSpineData;
            sk.loop = true;
            sk.clearTracks();
            sk.setToSetupPose();
            sk.setAnimation(0, hintAnim, true);
            const fitScale = Math.min(
                (state.node.width * GUIDE_HINT_TILE_FIT_MARGIN) / skSize.width,
                (state.node.height * GUIDE_HINT_TILE_FIT_MARGIN) / skSize.height
            );
            hintNode.setScale(Math.max(0.1, fitScale * GUIDE_HINT_SCALE_MULTIPLIER));
            this.shakeGuideTile(state.node);
        });

        const finger = this.ensureGuideFingerNode();
        const fingerSk = finger.getComponent(sp.Skeleton);
        const fingerAnim = this.getSpineAnimName(this.guideFingerSpineData, 'in');
        if (fingerSk && fingerAnim) {
            const fingerTarget = a.inTray && !b.inTray ? b : a;
            finger.active = true;
            fingerSk.skeletonData = this.guideFingerSpineData;
            fingerSk.loop = true;
            fingerSk.clearTracks();
            fingerSk.setToSetupPose();
            fingerSk.setAnimation(0, fingerAnim, true);
            const anchorWorld = fingerTarget.node.convertToWorldSpaceAR(
                cc.v2(fingerTarget.node.width * 0.16, fingerTarget.node.height * 0.18)
            );
            finger.setPosition(this.node.convertToNodeSpaceAR(anchorWorld));
            const fingerSize = this.getSkeletonSize(this.guideFingerSpineData);
            const fingerScale = Math.max(0.2, (fingerTarget.node.height * 0.55) / fingerSize.height);
            finger.setScale(fingerScale);
        }
    }

    /** 判断当前是否已有引导正在显示 */
    private isGuideHintShowing(): boolean {
        const hasHint = this.guideHintNodes.some((node) => node && cc.isValid(node) && node.active);
        const hasFinger = !!(this.guideFingerNode && cc.isValid(this.guideFingerNode) && this.guideFingerNode.active);
        return hasHint || hasFinger;
    }

    /** 引导目标麻将的轻微晃动动画 */
    private shakeGuideTile(tileNode: cc.Node): void {
        if (!cc.isValid(tileNode)) {
            return;
        }
        const p = tileNode.getPosition();
        cc.tween(tileNode)
            .to(0.05, { position: cc.v2(p.x - 7, p.y) })
            .to(0.05, { position: cc.v2(p.x + 7, p.y) })
            .to(0.05, { position: cc.v2(p.x - 5, p.y) })
            .to(0.05, { position: cc.v2(p.x + 5, p.y) })
            .to(0.05, { position: p })
            .start();
    }

    /** 立即清除当前所有引导表现 */
    private clearGuideHintNow(): void {
        this.guideHintNodes.forEach((node) => {
            if (!node || !cc.isValid(node)) {
                return;
            }
            const sk = node.getComponent(sp.Skeleton);
            if (sk) {
                sk.clearTracks();
            }
            node.active = false;
        });
        if (this.guideFingerNode && cc.isValid(this.guideFingerNode)) {
            const fingerSk = this.guideFingerNode.getComponent(sp.Skeleton);
            if (fingerSk) {
                fingerSk.clearTracks();
            }
            this.guideFingerNode.active = false;
        }
    }

    /** 确保左右锁提示节点存在 */
    private ensureBanHintNodes(): void {
        if (this.banHintNodes.length === 2 && this.banHintNodes.every((n) => cc.isValid(n))) {
            return;
        }
        this.banHintNodes = [];
        const parent = this.boardRoot || this.node;
        for (let i = 0; i < 2; i++) {
            const node = new cc.Node(`ban_hint_${i}`);
            const sprite = node.addComponent(cc.Sprite);
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            node.active = false;
            node.opacity = 0;
            node.zIndex = 9999;
            node.parent = parent;
            this.banHintNodes.push(node);
        }
    }

    /** 显示被左右卡住时的锁提示 */
    private showBanHints(targetNode: cc.Node): void {
        if (!this.banFrame || !isValid(targetNode)) {
            return;
        }
        this.ensureBanHintNodes();
        if (this.banHintNodes.length !== 2 || !this.banHintNodes.every((n) => cc.isValid(n))) {
            return;
        }

        const worldRect = targetNode.getBoundingBoxToWorld();
        const edgeOffset = 0;
        const centerY = worldRect.center.y;
        const worldLeft = cc.v2(worldRect.xMin - edgeOffset, centerY);
        const worldRight = cc.v2(worldRect.xMax + edgeOffset, centerY);
        const positions = [worldLeft, worldRight];

        this.banHintNodes.forEach((hintNode, idx) => {
            const sprite = hintNode.getComponent(cc.Sprite);
            if (!sprite) {
                return;
            }
            sprite.spriteFrame = this.banFrame;
            hintNode.width = this.banFrame.getRect().width;
            hintNode.height = this.banFrame.getRect().height;
            const parent = hintNode.parent;
            const localPos = parent ? parent.convertToNodeSpaceAR(positions[idx]) : positions[idx];
            hintNode.setPosition(localPos);
            hintNode.stopAllActions();
            hintNode.active = true;
            hintNode.opacity = 0;
            hintNode.setScale(1);
            cc.tween(hintNode)
                .to(0.08, { opacity: 255, scale: 1.02 })
                .to(0.1, { scale: 0.98 })
                .delay(0.08)
                .to(0.12, { opacity: 0, scale: 0.9 })
                .call(() => {
                    if (cc.isValid(hintNode)) {
                        hintNode.active = false;
                    }
                })
                .start();
        });
    }

    /** 获取覆盖在当前牌上方的阻挡牌 */
    private getBlockingAbove(state: TileState): TileState[] {
        const baseRect = state.node.getBoundingBoxToWorld();
        return this.allTiles.filter((t) => {
            return !t.removed
                && !t.inTray
                && t.layerOrder > state.layerOrder
                && this.rectOverlapRatio(baseRect, t.node.getBoundingBoxToWorld()) > 0.08;
        });
    }

    /** 获取同层左右相邻牌 */
    private getSideNeighbors(state: TileState): { left: TileState | null; right: TileState | null } {
        let left: TileState | null = null;
        let right: TileState | null = null;
        this.allTiles.forEach((t) => {
            if (t === state || t.removed || t.inTray || t.layerOrder !== state.layerOrder) {
                return;
            }
            const dy = Math.abs(t.gridY - state.gridY);
            if (dy > 0.2) {
                return;
            }
            const dx = t.gridX - state.gridX;
            if (dx < -0.75 && dx > -1.25) {
                left = t;
            } else if (dx > 0.75 && dx < 1.25) {
                right = t;
            }
        });
        return { left, right };
    }

    /** 计算两个矩形重叠比例 */
    private rectOverlapRatio(a: cc.Rect, b: cc.Rect): number {
        const left = Math.max(a.xMin, b.xMin);
        const right = Math.min(a.xMax, b.xMax);
        const low = Math.max(a.yMin, b.yMin);
        const high = Math.min(a.yMax, b.yMax);
        if (right <= left || high <= low) {
            return 0;
        }
        const overlap = (right - left) * (high - low);
        const area = Math.max(1, a.width * a.height);
        return overlap / area;
    }

    /** 批量播放节点抖动反馈 */
    private shakeNodes(states: TileState[]): void {
        const handled = new Set<cc.Node>();
        states.forEach((s) => {
            const n = s.node;
            if (!n || !cc.isValid(n) || handled.has(n)) {
                return;
            }
            handled.add(n);
            const p = n.getPosition();
            n.stopAllActions();
            cc.tween(n)
                .to(0.04, { position: cc.v2(p.x - 8, p.y) })
                .to(0.04, { position: cc.v2(p.x + 8, p.y) })
                .to(0.04, { position: cc.v2(p.x - 5, p.y) })
                .to(0.04, { position: cc.v2(p.x + 5, p.y) })
                .to(0.04, { position: p })
                .start();
        });
    }

    /** 将可点击麻将移动到托盘 */
    private moveToTray(state: TileState): void {
        if (this.slotNodes.length < 4) {
            this.collectSlotNodes();
        }
        const slotIdx = this.tray.findIndex((s) => s === null);
        if (slotIdx < 0 || !this.slotNodes[slotIdx]) {
            cc.log('上方格子已满');
            return;
        }
        const slot = this.slotNodes[slotIdx];
        const targetScale = this.getScaleForSlot(state.node, slot);
        state.inTray = true;
        state.isAnimating = true;
        const node = state.node;
        if (state.shadowNode && cc.isValid(state.shadowNode)) {
            state.shadowNode.destroy();
            state.shadowNode = null;
        }
        const targetWorld = slot.convertToWorldSpaceAR(cc.v2(0, 0));
        const targetLocal = node.parent.convertToNodeSpaceAR(targetWorld);
        node.stopAllActions();
        cc.tween(node)
            .to(0.2, { position: targetLocal, scale: targetScale })
            .call(() => {
                if (!cc.isValid(node)) {
                    return;
                }
                node.parent = slot;
                node.setPosition(0, 0);
                node.setScale(targetScale);
                state.isAnimating = false;
                this.tray[slotIdx] = state;
                this.resolveTrayPairs();
            })
            .start();
    }

    /** 扫描并处理托盘可消除配对 */
    private resolveTrayPairs(): void {
        if (this.settlementShown || this.trayBusy) {
            return;
        }
        const pair = this.findFirstTrayPair();
        if (!pair) {
            if (this.isAllTilesCleared()) {
                this.showSettlementPage();
            } else if (this.isTrayFull()) {
                this.showSettlementPage();
            }
            return;
        }

        this.clearGuideHintNow();
        this.guideLastEliminationAt = Date.now() / 1000;
        this.trayBusy = true;
        this.eliminateTrayPair(pair[0], pair[1], () => {
            this.compactTray();
            this.trayBusy = false;
            this.resolveTrayPairs();
        });
    }

    /** 判断托盘4格是否已满 */
    private isTrayFull(): boolean {
        return this.tray.every((s) => !!s);
    }

    /** 棋盘与托盘均已无剩余牌（全部消除完成） */
    private isAllTilesCleared(): boolean {
        if (this.allTiles.length <= 0) {
            return false;
        }
        const boardEmpty = this.allTiles.every((t) => t.removed);
        const trayEmpty = this.tray.every((s) => !s);
        return boardEmpty && trayEmpty;
    }

    /** 显示结算页并播放结算演出 */
    private showSettlementPage(): void {
        if (this.settlementShown) {
            return;
        }
        this.settlementShown = true;
        this.trayBusy = true;
        this.clearGuideHintNow();
        const endNode = this.node.getChildByName('end');
        if (!endNode || !cc.isValid(endNode)) {
            return;
        }
        this.slotNodes.forEach((slot) => {
            if (slot && cc.isValid(slot)) {
                slot.active = false;
            }
        });
        if (this.boardRoot && cc.isValid(this.boardRoot)) {
            this.boardRoot.active = false;
        }
        this.countLabel?.node.active = false;
        endNode.active = true;
        endNode.setSiblingIndex(this.node.childrenCount - 1);
        this.resetSettlementPresentation();
        this.playSettlementSequence();
    }

    /** 查找托盘中的第一组可配对下标 */
    private findFirstTrayPair(): [number, number] | null {
        const groups: Record<string, number[]> = {};
        this.tray.forEach((s, i) => {
            if (!s) {
                return;
            }
            groups[s.faceKey] = groups[s.faceKey] || [];
            groups[s.faceKey].push(i);
        });
        const keys = Object.keys(groups);
        for (let i = 0; i < keys.length; i += 1) {
            const idxs = groups[keys[i]];
            if (idxs.length >= 2) {
                return [idxs[0], idxs[1]];
            }
        }
        return null;
    }

    /** 执行托盘一对麻将的消除流程 */
    private eliminateTrayPair(idxA: number, idxB: number, onDone: () => void): void {
        this.makePairAdjacent(idxA, idxB, (leftIdx, rightIdx) => {
            const leftState = this.tray[leftIdx];
            const rightState = this.tray[rightIdx];
            if (!leftState || !rightState || !cc.isValid(leftState.node) || !cc.isValid(rightState.node)) {
                this.markTrayTileRemoved(leftIdx);
                this.markTrayTileRemoved(rightIdx);
                onDone();
                return;
            }
            const delaySec = TRAY_COLLISION_DELAY_AFTER_SWAP;
            if (typeof this.scheduleOnce === 'function') {
                this.scheduleOnce(() => {
                    this.animateTrayPairCollision(leftIdx, rightIdx, onDone);
                }, delaySec);
            } else {
                setTimeout(() => {
                    if (!cc.isValid(this.node)) {
                        return;
                    }
                    this.animateTrayPairCollision(leftIdx, rightIdx, onDone);
                }, delaySec * 1000);
            }
        });
    }

    /** 将托盘中一对牌交换成相邻位置 */
    private makePairAdjacent(idxA: number, idxB: number, onDone: (leftIdx: number, rightIdx: number) => void): void {
        let left = Math.min(idxA, idxB);
        let right = Math.max(idxA, idxB);
        const step = () => {
            if (right - left <= 1) {
                onDone(left, right);
                return;
            }
            this.swapTraySlots(right - 1, right, () => {
                right -= 1;
                step();
            });
        };
        step();
    }

    /** 交换两个托盘槽位中的麻将 */
    private swapTraySlots(i: number, j: number, onDone: () => void): void {
        if (i === j || i < 0 || j < 0 || i >= this.tray.length || j >= this.tray.length) {
            onDone();
            return;
        }
        const slotI = this.slotNodes[i];
        const slotJ = this.slotNodes[j];
        if (!slotI || !slotJ) {
            onDone();
            return;
        }
        const stateI = this.tray[i];
        const stateJ = this.tray[j];
        this.tray[i] = stateJ;
        this.tray[j] = stateI;

        let pending = 0;
        const doneOne = () => {
            pending -= 1;
            if (pending <= 0) {
                onDone();
            }
        };
        if (stateI) {
            pending += 1;
            this.moveTrayStateToSlot(stateI, slotJ, TRAY_SWAP_DURATION, doneOne);
        }
        if (stateJ) {
            pending += 1;
            this.moveTrayStateToSlot(stateJ, slotI, TRAY_SWAP_DURATION, doneOne);
        }
        if (pending === 0) {
            onDone();
        }
    }

    /** 将托盘麻将状态移动到目标槽位 */
    private moveTrayStateToSlot(
        state: TileState,
        slot: cc.Node,
        duration: number,
        onDone: () => void
    ): void {
        if (!state || !cc.isValid(state.node) || !slot || !cc.isValid(slot)) {
            onDone();
            return;
        }
        const n = state.node;
        const world = n.parent.convertToWorldSpaceAR(n.getPosition());
        n.parent = this.node;
        n.setPosition(this.node.convertToNodeSpaceAR(world));
        const targetWorld = slot.convertToWorldSpaceAR(cc.v2(0, 0));
        const targetLocal = this.node.convertToNodeSpaceAR(targetWorld);
        const targetScale = this.getScaleForSlot(n, slot);
        n.stopAllActions();
        cc.tween(n)
            .to(duration, { position: targetLocal, scale: targetScale }, { easing: getTweenEase('quadIn') })
            .call(() => {
                if (!cc.isValid(n)) {
                    onDone();
                    return;
                }
                n.parent = slot;
                n.setPosition(0, 0);
                n.setScale(targetScale);
                onDone();
            })
            .start();
    }

    /** 播放托盘两张牌对撞消除动画 */
    private animateTrayPairCollision(leftIdx: number, rightIdx: number, onDone: () => void): void {
        const left = this.tray[leftIdx];
        const right = this.tray[rightIdx];
        if (!left || !right || !cc.isValid(left.node) || !cc.isValid(right.node)) {
            this.markTrayTileRemoved(leftIdx);
            this.markTrayTileRemoved(rightIdx);
            onDone();
            return;
        }
        const leftNode = left.node;
        const rightNode = right.node;
        const leftWorld = leftNode.parent.convertToWorldSpaceAR(leftNode.getPosition());
        const rightWorld = rightNode.parent.convertToWorldSpaceAR(rightNode.getPosition());
        leftNode.parent = this.node;
        rightNode.parent = this.node;
        leftNode.setPosition(this.node.convertToNodeSpaceAR(leftWorld));
        rightNode.setPosition(this.node.convertToNodeSpaceAR(rightWorld));

        const pLeft = leftNode.getPosition();
        const pRight = rightNode.getPosition();
        const center = cc.v2((pLeft.x + pRight.x) * 0.5, (pLeft.y + pRight.y) * 0.5);
        const spread = Math.max(TRAY_ELIM_SPREAD, Math.abs(pRight.x - pLeft.x) * 0.18);
        const outLeft = cc.v2(pLeft.x - spread, pLeft.y);
        const outRight = cc.v2(pRight.x + spread, pRight.y);

        let meetDone = 0;
        const onMeet = () => {
            meetDone += 1;
            if (meetDone < 2) {
                return;
            }
            this.playEliminationVfx(leftNode, rightNode);
            this.addScoreOnElimination();
            this.playComboSoundByCount();
            this.tryPlayWordVfxByCount();
            this.checkAndTriggerDownloadByScore();
            this.markTrayTileRemoved(leftIdx);
            this.markTrayTileRemoved(rightIdx);
            let destroyDone = 0;
            const onDestroyed = () => {
                destroyDone += 1;
                if (destroyDone >= 2) {
                    onDone();
                }
            };
            [leftNode, rightNode].forEach((n) => {
                n.stopAllActions();
                cc.tween(n)
                    .to(0.09, { scale: 0 }, { easing: getTweenEase('quartIn') })
                    .call(() => {
                        if (cc.isValid(n)) {
                            n.destroy();
                        }
                        onDestroyed();
                    })
                    .start();
            });
        };

        leftNode.stopAllActions();
        rightNode.stopAllActions();
        cc.tween(leftNode)
            .to(TRAY_ELIM_OUT_DURATION, { position: outLeft }, { easing: getTweenEase('quadIn') })
            .to(TRAY_ELIM_IN_DURATION, { position: center }, { easing: getTweenEase('quartIn') })
            .call(onMeet)
            .start();
        cc.tween(rightNode)
            .to(TRAY_ELIM_OUT_DURATION, { position: outRight }, { easing: getTweenEase('quadIn') })
            .to(TRAY_ELIM_IN_DURATION, { position: center }, { easing: getTweenEase('quartIn') })
            .call(onMeet)
            .start();
    }

    /** 标记并清理托盘中已消除牌状态 */
    private markTrayTileRemoved(idx: number): void {
        if (idx < 0 || idx >= this.tray.length) {
            return;
        }
        const s = this.tray[idx];
        if (!s) {
            return;
        }
        s.removed = true;
        s.inTray = false;
        if (s.shadowNode && cc.isValid(s.shadowNode)) {
            s.shadowNode.destroy();
            s.shadowNode = null;
        }
        this.tray[idx] = null;
    }

    /** 消除后压缩托盘空位 */
    private compactTray(): void {
        if (this.slotNodes.length < 4) {
            return;
        }
        const kept: TileState[] = this.tray.filter((s): s is TileState => !!s && !s.removed);
        this.tray = [null, null, null, null];
        kept.forEach((s, i) => {
            const targetSlot = this.slotNodes[i];
            const targetScale = this.getScaleForSlot(s.node, targetSlot);
            this.tray[i] = s;
            const n = s.node;
            if (!cc.isValid(n) || !targetSlot) {
                return;
            }
            const world = n.parent.convertToWorldSpaceAR(n.getPosition());
            n.parent = this.node;
            n.setPosition(this.node.convertToNodeSpaceAR(world));
            const targetWorld = targetSlot.convertToWorldSpaceAR(cc.v2(0, 0));
            const targetLocal = this.node.convertToNodeSpaceAR(targetWorld);
            cc.tween(n)
                .to(0.12, { position: targetLocal, scale: targetScale })
                .call(() => {
                    if (!cc.isValid(n)) {
                        return;
                    }
                    n.parent = targetSlot;
                    n.setPosition(0, 0);
                    n.setScale(targetScale);
                })
                .start();
        });
    }

    /** 计算麻将适配托盘槽位的缩放 */
    private getScaleForSlot(tileNode: cc.Node, slot: cc.Node): number {
        const margin = 0.82;
        const sx = (slot.width * margin) / Math.max(1, tileNode.width);
        const sy = (slot.height * margin) / Math.max(1, tileNode.height);
        return Math.max(0.2, Math.min(sx, sy));
    }

    /** 生成单张麻将并绑定交互状态 */
    private spawnTile(
        parent: cc.Node,
        shadowParent: cc.Node,
        prefab: cc.Prefab,
        x: number,
        y: number,
        zIndex: number,
        layerOrder: number,
        gridX: number,
        gridY: number,
        assignedFaceKey: string
    ): void {
        const node = cc.instantiate(prefab);
        node.parent = parent;
        node.setPosition(x, y);
        node.setScale(this.tileScale);
        node.zIndex = zIndex;
        const shadowNode = this.spawnTileShadow(node, shadowParent, x, y, zIndex);
        const faceKey = this.applyFace(node, assignedFaceKey);
        const state: TileState = {
            node,
            shadowNode,
            faceKey,
            layerOrder,
            gridX,
            gridY,
            inTray: false,
            removed: false,
            isAnimating: false,
        };
        (node as any).__tileState = state;
        this.allTiles.push(state);
        node.on(cc.Node.EventType.TOUCH_END, () => this.onTileTap(state), this);
    }

    /** 生成独立阴影节点 */
    private spawnTileShadow(tileNode: cc.Node, shadowParent: cc.Node, x: number, y: number, zIndex: number): cc.Node | null {
        if (!this.shadowFrame) {
            return null;
        }

        const shadowNode = new cc.Node('mj_shadow');
        shadowNode.parent = shadowParent;
        shadowNode.zIndex = zIndex;
        shadowNode.setAnchorPoint(0.5, 0.5);
        const baseW = tileNode.width;
        const baseH = tileNode.height;
        shadowNode.setContentSize(baseW, baseH);
        shadowNode.opacity = SHADOW_OPACITY;
        shadowNode.color = new cc.Color(0, 0, 0, 255);
        shadowNode.setPosition(x + SHADOW_OFFSET_X, y + SHADOW_OFFSET_Y);
        shadowNode.setScale(
            this.tileScale * SHADOW_SCALE_X,
            this.tileScale * SHADOW_SCALE_Y
        );

        const spr = shadowNode.addComponent(cc.Sprite);
        spr.spriteFrame = this.shadowFrame;
        spr.type = cc.Sprite.Type.SIMPLE;
        spr.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        return shadowNode;
    }

    /** 将指定牌面贴图应用到麻将 */
    private applyFace(node: cc.Node, faceKey: string): string {
        const key = faceKey || MJ_FACE_KEYS[0];
        const sf = this.faceFrames[key];
        const icon = node.getChildByName('icon');
        if (!icon) {
            return key;
        }
        icon.active = true;
        if (sf) {
            const spr = icon.getComponent(cc.Sprite);
            if (spr) {
                spr.spriteFrame = sf;
                spr.sizeMode = cc.Sprite.SizeMode.TRIMMED;
            }
        }
        return key;
    }
}
