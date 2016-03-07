(function() {
    'use strict';

    const VERSION = { version: '9.2.0' };

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

    angular.module('stockflux.version')
        .controller('VersionCtrl', VersionCtrl);
}());
