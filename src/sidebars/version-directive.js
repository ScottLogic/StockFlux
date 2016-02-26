(function() {
    'use strict';

    angular.module('openfin.version')
        .value('version', '0.1.0')
        .directive('insertVersion', ['version', (version) => {
            return {
                restrict: 'A',
                template: version
            };
        }]);
}());
