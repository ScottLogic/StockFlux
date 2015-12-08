(function() {
    'use strict';

    angular.module('openfin.search', [])
        .controller('SearchCtrl', ['$scope', '$routeParams', '$location',
            function($scope, $routeParams, $location) {
                var self = this;
                self.query = $routeParams.query;

                self.message = function() {
                    return 'Searching Quandl for "' + self.query + '"';
                }

                self.submit = function() {
                    $location.path('/search/' + self.query);

                    // Change after 1 seconds to simulate delay when searching.
                    setTimeout(function() {
                        $location.path('/stock/' + self.query);
                        $scope.$apply();
                    }, 1000);
                };
            }
        ]);
}());
