(function() {
    'use strict';

    class ClosedCardCtrl {
        openClosedWindow(name) {
            var store = window.storeService.open(name);
            window.windowService.createMainWindow(name, store.isCompact());
        }
    }
    ClosedCardCtrl.$inject = [];

    angular.module('stockflux.closedCard')
        .controller('ClosedCardCtrl', ClosedCardCtrl);
}());
