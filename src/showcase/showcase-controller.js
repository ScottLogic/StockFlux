(function() {
    'use strict';

    class ShowcaseCtrl {
        constructor(selectionService) {
            this.selectionService = selectionService;
        }

        selectionCode() {
            return this.selectionService.selectedStock().code;
        }

        selectionName() {
            return this.selectionService.selectedStock().name;
        }

        hasSelection() {
            return this.selectionService.hasSelection();
        }
    }
    ShowcaseCtrl.$inject = ['selectionService'];

    // The quandl service is used in the directive.
    angular.module('openfin.showcase', ['openfin.selection', 'openfin.quandl'])
        .controller('ShowcaseCtrl', ShowcaseCtrl);
}());
