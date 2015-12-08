(function() {
    'use strict';

    angular.module('openfin.quandl', ['ngResource'])
        .factory('quandlService', ['$resource', function($resource) {
            return $resource('https://www.quandl.com/api/v3/datasets.json?query=:query&database_code=WIKI', {}, {
                get: { method: 'GET', cache: true }
            });
        }]);
}());
