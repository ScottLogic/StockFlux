(function() {
    'use strict';

    class ClosedWindowsCtrl {
        constructor(storeService) {
            this.storeService = storeService;
            this.numbers = [1, 2, 3];
            this.refreshClosedWindows();
        }
        refreshClosedWindows() {
            this.storeService.refreshStore();
            this.closedWindows = this.storeService.getPreviousClosedWindows().sort((a, b) => b.closed - a.closed);
        }
    }
    ClosedWindowsCtrl.$inject = ['storeService'];

    angular.module('openfin.closedwindows', [])
        .controller('ClosedWindowsCtrl', ClosedWindowsCtrl);
}());
