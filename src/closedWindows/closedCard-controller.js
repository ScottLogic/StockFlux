(function() {
    'use strict';

    class ClosedCardCtrl {
        openClosedWindow(name) {
            var store = window.storeService.open(name);
            window.windowService.createMainWindow(name, store.isCompact());
            store.openWindow();
        }
    }
    ClosedCardCtrl.$inject = [];

    angular.module('openfin.closedCard')
        .controller('ClosedCardCtrl', ClosedCardCtrl);
}());
