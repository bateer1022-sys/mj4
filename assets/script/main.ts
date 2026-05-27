import super_html_playable from './super_html_playable';

const { ccclass } = cc._decorator;

function isValid(node: cc.Node): boolean {
    return node && cc.isValid(node);
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

@ccclass('GameController')
export default class GameController extends cc.Component {

    onLoad() {
        cc.view.setResizeCallback(() => {
            this.layoutBackground();
        }, this);
    }

    onDestroy() {
        cc.view.setResizeCallback(null, null);
    }

    start() {
        this.layoutBackground();

        super_html_playable.set_google_play_url(
            'https://apps.apple.com/us/app/mahjong-royal-tiles/id6747492600'
        );
        super_html_playable.set_app_store_url(
            'https://play.google.com/store/apps/details?id=com.nebula.mahjongtile'
        );
    }

    private layoutBackground(): void {
        const bg = this.node.getChildByName('bg');
        if (!bg || !isValid(bg)) {
            return;
        }
        layoutShowAllCover(bg, this.node);
    }
}
