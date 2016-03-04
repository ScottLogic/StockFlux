(function() {
    'use strict';

    class MainCtrl {
        constructor() {
            this.store = null;
        }

        isCompact() {
            if (!this.store && window.storeService) {
                this.store = window.storeService.open(window.name);
            }

            return this.store && this.store.isCompact();
        }
    }
    MainCtrl.$inject = [];

    angular.module('stockflux.main')
        .controller('MainCtrl', MainCtrl);
}());
