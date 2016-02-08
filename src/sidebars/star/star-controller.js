(function() {
    'use strict';

    const starUrls = {
        off: 'favourite_OFF',
        on: 'favourite_ON',
        offHover: 'favourite_OFF_hover',
        onHover: 'favourite_hover'
    };

    class StarCtrl {
        constructor($scope, storeService, selectionService) {
            this.$scope = $scope;
            this.storeService = storeService;
            this.selectionService = selectionService;

            this.starHovered = false;
            this.check = false;
        }

        favouriteUrl(stock) {
            if (stock.favourite) {
                return starUrls.on;
            } else if (this.starHovered) {
                return starUrls.onHover;
            } else if (stock.isHovered || this.selectionService.selectedStock() === stock) {
                return starUrls.offHover;
            } else {
                return starUrls.off;
            }
        }

        click(stock) {
            if (!this.check || confirm('Are you sure you wish to remove this stock (' + stock.code + ') from your favourites?')) {
                if (stock.favourite) {
                    stock.favourite = false;
                    this.storeService.remove(stock);
                } else {
                    stock.favourite = true;
                    this.storeService.add(stock);
                }
            }
        }

        mouseEnter() {
            this.starHovered = true;
        }

        mouseLeave() {
            this.starHovered = false;
        }
    }
    StarCtrl.$inject = ['$scope', 'storeService', 'selectionService'];

    angular.module('openfin.star', ['openfin.store', 'openfin.selection'])
        .controller('StarCtrl', StarCtrl);
}());
