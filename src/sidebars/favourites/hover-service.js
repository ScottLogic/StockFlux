(function() {
    'use strict';

    class HoverService {
        constructor(storeService, $rootScope) {
            this.storeService = storeService;
            this.$rootScope = $rootScope;

            this.hoverTargets = [];
            this.bindEvents();
        }

        bindEvents() {
            this.$rootScope.$on('updateFavourites', () => { this.sort(); });
        }

        get() {
            return this.hoverTargets;
        }

        add(hoverArea, stockCode) {
            var newHoverTarget = { hoverArea: hoverArea, code: stockCode };
            if (this.hoverTargets.indexOf(newHoverTarget) === -1) {
                // This target is new
                this.hoverTargets.push(newHoverTarget);
            }
            this.sort();
        }

        remove(stockCode) {
            for (var i = 0, max = this.hoverTargets.length; i < max; i++) {
                if (this.hoverTargets[i].code === stockCode) {
                    this.hoverTargets.splice(i, 1);
                    break;
                }
            }
        }
    }
    HoverService.$inject = ['storeService', '$rootScope'];
    angular.module('openfin.hover', [])
        .service('hoverService', HoverService);
}());
