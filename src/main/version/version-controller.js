(function() {
    'use strict';

    class VersionCtrl {
        constructor(currentWindowService, version) {
            this.currentWindowService = currentWindowService;
            this.version = version;
        }

        openGithub() {
            this.currentWindowService.openUrlWithBrowser('https://github.com/ScottLogic/stockflux');
        }
    }
    VersionCtrl.$inject = ['currentWindowService', 'Version'];

    angular.module('stockflux.version')
        .controller('VersionCtrl', VersionCtrl);
}());
