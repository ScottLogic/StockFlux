(function() {

    const RESIZE_NO_LIMIT = 50000;
    const BITFLUX_INITIAL_PROPORTION = 0.6;
    const BITFLUX_STOCK_AMOUNT = 1200;

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
                shadow: true
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

        getTopCardOffset() {
            return [268, 65];
        }

        getInitialBitfluxProportion() {
            return BITFLUX_INITIAL_PROPORTION;
        }

        getBitfluxStockAmount() {
            return BITFLUX_STOCK_AMOUNT;
        }
    }
    ConfigService.$inject = [];

    angular.module('openfin.config')
        .service('configService', ConfigService);

}());
