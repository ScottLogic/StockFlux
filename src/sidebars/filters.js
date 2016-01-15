(function() {
    'use strict';

    angular.module('openfin.filters', [])
        .filter('truncate', function() {
            return function(input) {
                var openBracketIndex = input.indexOf('(');
                return input.slice(0, openBracketIndex - 1); // Also trim the space before the bracket
            };
        });
}());
