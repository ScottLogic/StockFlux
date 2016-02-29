(function() {
    'use strict';

    const VERSION = { version: '8.0.0' };

    class VersionCtrl {
        constructor(currentWindowService) {
            this.currentWindowService = currentWindowService;
        }

        version() {
            return VERSION.version;
        }

        openGithub() {
            this.currentWindowService.openUrlWithBrowser('https://github.com/ScottLogic/bitflux-openfin');
        }
    }
    VersionCtrl.$inject = ['currentWindowService'];

    angular.module('openfin.version')
        .controller('VersionCtrl', VersionCtrl);
}());
