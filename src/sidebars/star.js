(function() {
    'use strict';

    angular.module('openfin.star', ['openfin.store'])
        .controller('StarCtrl', ['$scope', 'storeService', function($scope, storeService) {
            var self = this;
            self.check = false;

            var favouriteColours = {
                on: '#42D8BD',
                off: '#1A1F26',
                offhover: "#263337"
            };

            self.style = function(stock) {
                if (stock.favourite) {
                    return favouriteColours.on;
                } else if (stock.isHovered) {
                    return favouriteColours.offhover;
                } else {
                    return favouriteColours.off;
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

        }])
        .directive('star', [function() {
            return {
                restrict: 'E',
                templateUrl: 'sidebars/star.html',
                scope: {
                    starStyle: '&',
                    starClick: '&',
                    check: '='
                }
            };
        }]);
}());
