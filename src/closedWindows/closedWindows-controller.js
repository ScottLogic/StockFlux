(function() {
    'use strict';

    class ClosedWindowsCtrl {
        constructor() {
            this.closedWindows = [];
            this.closedTabsShow = false;
        }

        refreshClosedWindows() {
            this.closedWindows = window.storeService.getPreviousClosedWindows();
        }

        click() {
            this.refreshClosedWindows();
            this.closedTabsShow = this.closedWindows.length > 0;
        }
    }
    ClosedWindowsCtrl.$inject = [];

    angular.module('openfin.closedWindows')
        .controller('ClosedWindowsCtrl', ClosedWindowsCtrl);
}());
