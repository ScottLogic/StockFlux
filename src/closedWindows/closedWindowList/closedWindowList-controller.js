(function() {
    'use strict';

    class ClosedWindowListCtrl {
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
    ClosedWindowListCtrl.$inject = [];

    angular.module('openfin.closedWindows')
        .controller('ClosedWindowListCtrl', ClosedWindowListCtrl);
}());
