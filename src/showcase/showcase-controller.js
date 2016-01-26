(function() {
    'use strict';

    // The quandl service is used in the directive.
    angular.module('openfin.showcase', ['openfin.selection', 'openfin.quandl'])
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
