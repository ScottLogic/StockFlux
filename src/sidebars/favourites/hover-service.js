(function() {
    'use strict';

    angular.module('openfin.hover', [])
        .factory('hoverService', [function() {
            var hoverTargets = [];

            function get() {
                return hoverTargets;
            }

            function add(hoverArea, stockCode) {
                var newHoverTarget = { hoverArea: hoverArea, code: stockCode };
                if (hoverTargets.indexOf(newHoverTarget) === -1) {
                    // This target is new
                    hoverTargets.push(newHoverTarget);
                }
            }

            function remove(stockCode) {
                for (var i = 0, max = hoverTargets.length; i < max; i++) {
                    if (hoverTargets[i].code === stockCode) {
                        hoverTargets.splice(i, 1);
                        break;
                    }
                }
            }

            return {
                get: get,
                add: add,
                remove: remove
            };
        }]);
}());
