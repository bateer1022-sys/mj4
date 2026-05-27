
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