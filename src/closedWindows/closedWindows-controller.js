(function() {
    'use strict';

    class ClosedWindowsCtrl {
        refreshClosedWindows() {
            this.closedWindows = window.storeService.getPreviousClosedWindows();
        }
    }
    ClosedWindowsCtrl.$inject = [];

    angular.module('openfin.closedWindows')
        .controller('ClosedWindowsCtrl', ClosedWindowsCtrl);
}());
