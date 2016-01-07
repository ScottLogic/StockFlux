(function() {
    'use strict';

    angular.module('openfin.star', ['openfin.store'])
        .controller('StarCtrl', ['$scope', 'storeService', function($scope, storeService) {
            var self = this;

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

            self.click = function(stock, check) {
                if (!check || check(stock)) {
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
                    starClick: '&'
                }
            };
        }]);
}());
