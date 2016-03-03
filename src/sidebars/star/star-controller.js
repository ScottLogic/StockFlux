(function() {
    'use strict';

    const starUrls = {
        off: 'favourite_off',
        on: 'favourite_on',
        offHover: 'favourite_off_hover',
        onHover: 'favourite_hover'
    };

    class StarCtrl {
        constructor($scope, selectionService) {
            this.$scope = $scope;
            this.store = null;
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
                if (!this.store) {
                    this.store = window.storeService.open(window.name);
                }

                if (stock.favourite) {
                    stock.favourite = false;
                    this.store.remove(stock);
                } else {
                    stock.favourite = true;
                    this.store.add(stock);
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
    StarCtrl.$inject = ['$scope', 'selectionService'];

    angular.module('openfin.star')
        .controller('StarCtrl', StarCtrl);
}());
