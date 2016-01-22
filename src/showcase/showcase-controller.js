(function() {
    'use strict';

    // The quandl service is used in the directive.
    angular.module('openfin.showcase', ['openfin.selection', 'openfin.quandl'])
        .controller('ShowcaseCtrl', ['selectionService', function(selectionService) {
            var self = this;

            self.selection = function() {
                return selectionService.getSelection();
            };
        }]);
}());
