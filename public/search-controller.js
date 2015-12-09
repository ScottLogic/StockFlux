(function() {
    'use strict';

    angular.module('openfin.search', ['openfin.quandl'])
        .controller('SearchCtrl', ['$routeParams', '$location', 'quandlService',
            function($routeParams, $location, quandlService) {
                var self = this;
                self.query = $routeParams.query;

                self.message = function() {
                    return 'Searching Quandl for "' + self.query + '"...';
                };

                self.submit = function() {
                    $location.path('/search/' + self.query);

                    quandlService.get({ query: self.query }, function(result) {
                        // When the result has been fetched it will have been cached.
                        $location.path('/stock/' + self.query);
                    });
                };

                self.clear = function() {
                    self.query = '';
                };
            }
        ]);
}());
