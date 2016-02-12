(function() {
    'use strict';

    class HoverService {
        constructor($rootScope) {
            this.$rootScope = $rootScope;

            this.hoverTargets = [];
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
    HoverService.$inject = ['$rootScope'];
    angular.module('openfin.hover', [])
        .service('hoverService', HoverService);
}());
