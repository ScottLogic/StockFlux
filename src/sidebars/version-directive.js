(function() {
    'use strict';
    const VERSION = {version: '8.0.0'};

    angular.module('openfin.version')
        .value('version', VERSION)
        .directive('insertVersion', ['version', (version) => {
            return {
                restrict: 'A',
                template: version.version
            };
        }]);
}());
