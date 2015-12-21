(function() {
    'use strict';

    angular.module('openfin.search', ['openfin.quandl'])
        .controller('SearchCtrl', ['$scope', '$routeParams', '$location',
            function($scope, $routeParams, $location) {
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

                $scope.$watch(
                    // Can't watch `self.query` as the subscribers to this controller
                    // may alias it (e.g. `searchCtrl.query`), so instead define a
                    // function to decouple scoping.
                    function watchQuery() {
                        return self.query;
                    },
                    function() {
                        self.submit();
                    });
            }
        ]);
}());
