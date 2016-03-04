(function() {
    'use strict';

    const DESELECTION_OBJECT = { code: '', name: '' };

    /**
     * Holds the currently selected stock.
     */
    class SelectionService {
        constructor() {
            this._stock = DESELECTION_OBJECT;
        }

        select(stock) {
            this._stock = stock;
        }

        selectedStock() {
            return this._stock;
        }

        deselect() {
            this._stock = DESELECTION_OBJECT;
        }

        hasSelection() {
            return this._stock !== DESELECTION_OBJECT;
        }
    }
    SelectionService.$inject = [];

    angular.module('stockflux.selection', [])
        .service('selectionService', SelectionService);
}());
