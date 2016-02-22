(function() {
    'use strict';

    class ClosedWindowsCtrl {
        constructor(storeService) {
            this.storeService = storeService;
            this.refreshClosedWindows();
        }
        refreshClosedWindows() {
            this.storeService.refreshStore();
            this.closedWindows = this.storeService.getPreviousClosedWindows();
        }
    }
    ClosedWindowsCtrl.$inject = ['storeService'];

    angular.module('openfin.closedWindows')
        .controller('ClosedWindowsCtrl', ClosedWindowsCtrl);
}());
