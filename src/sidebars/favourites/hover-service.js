(function() {
    'use strict';

    angular.module('openfin.hover', [])
        .factory('hoverService', [function() {
            var self = this;
            var hoverTargets = [];

            function get() {
                return hoverTargets;
            }

            function add(hoverArea, dropTarget, stockCode) {
                var newHoverTarget = { hoverArea: hoverArea, dropTarget: dropTarget, code: stockCode };
                if (hoverTargets.indexOf(newHoverTarget) === -1) {
                    // This target is new
                    hoverTargets.push(newHoverTarget);
                }
            }

            return {
                get: get,
                add: add
            };
        }]);
}());
