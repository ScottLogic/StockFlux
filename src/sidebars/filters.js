(function() {
    'use strict';

    angular.module('openfin.filters', [])
        .filter('truncate', function() {
            return function(input) {
                var closeBracketIndex = input.indexOf('(');
                return input.slice(0, closeBracketIndex - 1); // Also trim the space before the bracket
            };
        });
}());
