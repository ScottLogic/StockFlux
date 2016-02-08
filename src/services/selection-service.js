(function() {
    'use strict';

    class SelectionService {
        constructor() {
            this._stock = '';
        }

        select(stock) {
            this._stock = stock;
        }

        selectedStock() {
            return this._stock;
        }
    }
    SelectionService.$inject = [];

    angular.module('openfin.selection', [])
        .service('selectionService', SelectionService);
}());
