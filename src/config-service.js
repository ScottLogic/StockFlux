(function() {

    const RESIZE_NO_LIMIT = 50000;
    const BITFLUX_STOCK_AMOUNT = 1200;
    const BITFLUX_INITIAL_PROPORTION = 16 * 7 / BITFLUX_STOCK_AMOUNT; // ~4 months
    const TEAROUT_WINDOW_OFFSET = [268, 65];
    const TEAROUT_WINDOW_OFFSET_COMPACT = [218, 47];

    // Be very careful changing the line below. It is replaced with a string.replace in the grunt build
    // to disable the right click menu in release.
    const allowContextMenu = true;

    /**
     * Stores common configuration for the application.
     */
    class ConfigService {
        createName() {
            return 'window' + Math.floor(Math.random() * 1000) + Math.ceil(Math.random() * 999);
        }

        getWindowConfig(name) {
            return {
                name: name || this.createName(),
                contextMenu: allowContextMenu,
                autoShow: false,
                frame: false,
                showTaskbarIcon: true,
                saveWindowState: true,
                url: 'index.html',
                resizable: true,
                maximizable: true,
                minWidth: 918,
                minHeight: 510,
                maxWidth: RESIZE_NO_LIMIT,
                maxHeight: RESIZE_NO_LIMIT,
                defaultWidth: 1280,
                defaultHeight: 720,
                shadow: true,
                resizeRegion: {
                    size: 7,
                    topLeftCorner: 14,
                    topRightCorner: 14,
                    bottomRightCorner: 14,
                    bottomLeftCorner: 14
                }
            };
        }

        getCompactConfig(name) {
            return {
                name: name || this.createName(),
                contextMenu: allowContextMenu,
                autoShow: false,
                frame: false,
                showTaskbarIcon: true,
                saveWindowState: true,
                url: 'index.html',
                resizable: false,
                maximizable: false,
                minWidth: 230,
                minHeight: 500,
                maxWidth: 230,
                maxHeight: 500,
                defaultWidth: 230,
                defaultHeight: 500,
                shadow: true
            };
        }

        getTearoutConfig(name) {
            return {
                name: name || this.createName(),
                contextMenu: allowContextMenu,
                autoShow: false,
                frame: false,
                maximizable: false,
                resizable: false,
                showTaskbarIcon: false,
                saveWindowState: false,
                maxWidth: 230,
                maxHeight: 100,
                url: 'tearout.html',
                shadow: true
            };
        }

        getTopCardOffset(compact) {
            return compact ? TEAROUT_WINDOW_OFFSET_COMPACT : TEAROUT_WINDOW_OFFSET;
        }

        getInitialBitfluxProportion() {
            return BITFLUX_INITIAL_PROPORTION;
        }

        getBitfluxStockAmount() {
            return BITFLUX_STOCK_AMOUNT;
        }
    }
    ConfigService.$inject = [];

    angular.module('stockflux.config')
        .service('configService', ConfigService);

}());
