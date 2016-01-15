(function() {
    'use strict';

    angular.module('openfin.showcase', ['openfin.selection'])
        .controller('ShowcaseCtrl', ['selectionService', function(selectionService) {
            var self = this;

            self.selection = function() {
                return selectionService.getSelection();
            };
        }]);
}());
