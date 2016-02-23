(function() {
    'use strict';

    class ClosedCardCtrl {
        openClosedWindow(name) {
            window.windowService.createMainWindow(name, false);
            window.storeService.open(name).openWindow();
        }
    }
    ClosedCardCtrl.$inject = [];

    angular.module('openfin.closedCard')
        .controller('ClosedCardCtrl', ClosedCardCtrl);
}());
