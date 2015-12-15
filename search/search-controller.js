(function() {
    'use strict';

    angular.module('openfin.search', ['openfin.quandl'])
        .controller('SearchCtrl', ['$routeParams', '$location',
            function($routeParams, $location) {
                var self = this;
                self.query = $routeParams.query;
                self.searchDisabled = true;

                self.validation = function() {
                    if (self.query === '' || self.query === undefined) {
                        self.searchDisabled = true;
                        return 'has-error';
                    } else {
                        self.searchDisabled = false;
                        return 'has-success';
                    }
                };

                self.message = function() {
                    return 'Searching Quandl for "' + self.query + '"...';
                };

                self.submit = function() {
                    $location.path('/stock/' + self.query);
                };

                self.clear = function() {
                    self.query = '';
                };
            }
        ]);
}());
