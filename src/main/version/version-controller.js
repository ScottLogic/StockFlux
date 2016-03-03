(function() {
    'use strict';

    const VERSION = { version: '9.0.0' };

    class VersionCtrl {
        constructor(currentWindowService) {
            this.currentWindowService = currentWindowService;
        }

        version() {
            return VERSION.version;
        }

        openGithub() {
            this.currentWindowService.openUrlWithBrowser('https://github.com/ScottLogic/stockflux');
        }
    }
    VersionCtrl.$inject = ['currentWindowService'];

    angular.module('openfin.version')
        .controller('VersionCtrl', VersionCtrl);
}());
