(function() {
    'use strict';

    class DesktopService {

        createWindow(config) {
            return new fin.desktop.Window(config);
        }

        ready(callback) {
            fin.desktop.main(callback);
        }

        getCurrentWindow() {
            return fin.desktop.Window.getCurrent();
        }

    }
    DesktopService.$inject = [];
    angular.module('openfin.desktop', [])
        .service('desktopService', DesktopService);
}());
