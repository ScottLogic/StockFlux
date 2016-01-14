(function() {
    'use strict';

    angular.module('openfin.selection', [])
        .factory('selectionService', [function() {
            var selected = '';

            function select(stock) {
                selected = stock.code;
            }

            function getSelection() {
                return selected;
            }

            return {
                select: select,
                getSelection: getSelection
            };
        }]);
}());
