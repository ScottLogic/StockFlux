(function() {
    'use strict';

    class ClosedCardCtrl {
        openClosedWindow(name) {
            window.windowService.createMainWindow(name, false);
        }
    }
    ClosedCardCtrl.$inject = [];

    angular.module('openfin.closedCard')
        .controller('ClosedCardCtrl', ClosedCardCtrl);
}());
