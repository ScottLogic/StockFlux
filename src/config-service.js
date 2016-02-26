(function() {

    const RESIZE_NO_LIMIT = 50000;

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
                defaultHeight: 720
            };
        }

        getCompactConfig(name) {
            return {
                name: name || this.createName(),
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
                defaultHeight: 500
            };
        }

        getTearoutConfig(name) {
            return {
                name: name || this.createName(),
                autoShow: false,
                frame: false,
                maximizable: false,
                resizable: false,
                showTaskbarIcon: false,
                saveWindowState: false,
                maxWidth: 230,
                maxHeight: 100,
                url: 'tearout.html'
            };
        }

        getTopCardOffset() {
            return [268, 65];
        }
    }
    ConfigService.$inject = [];

    angular.module('openfin.config')
        .service('configService', ConfigService);

}());
