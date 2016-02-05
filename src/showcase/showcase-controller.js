(function() {
    'use strict';

    angular.module('openfin.showcase')
        .controller('ShowcaseCtrl', ['selectionService', function(selectionService) {
            var self = this;

            self.selectionCode = function() {
                return selectionService.selectedStock().code;
            };

            self.selectionName = function() {
                return selectionService.selectedStock().name;
            };
        }]);
}());
