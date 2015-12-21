(function() {
    'use strict';

    angular.module('openfin.search', ['openfin.quandl'])
        .controller('SearchCtrl', ['$routeParams', '$location',
            function($routeParams, $location) {
                var self = this;
                self.query = $routeParams.query;

                self.message = function() {
                    return 'Searching Quandl for "' + self.query + '"...';
                };

                self.submit = function() {
                    if (self.query) {
                        $location.path('/stock/' + self.query);
                    }
                };

                self.clear = function() {
                    self.query = '';
                };
            }
        ]);
}());
