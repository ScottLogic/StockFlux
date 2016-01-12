(function() {
    'use strict';

    angular.module('openfin.star', ['openfin.store'])
        .controller('StarCtrl', ['$scope', 'storeService', function($scope, storeService) {
            var self = this;
            self.check = false;

            self.classes = function(stock) {
                if (stock.favourite) {
                    return 'light';
                } else {
                    return '';
                }
            };

            self.click = function(stock) {
                if (!self.check || confirm('Are you sure you wish to remove this stock (' + stock.code + ') from your favourites?')) {
                    if (stock.favourite) {
                        stock.favourite = false;
                        storeService.remove(stock);
                    } else {
                        stock.favourite = true;
                        storeService.add(stock);
                    }

                    $scope.$emit('favouriteChanged', stock);
                }
            };

        }]);
}());
