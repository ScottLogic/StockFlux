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
            this.store = null;
            this.selectionService = selectionService;

            this.starHovered = false;

            this.stock = $scope.stock;
            this.check = this.stock.favourite;
            this.confirmationShow = false;
            this.confirmationMessage = 'Are you sure you wish to remove this stock (' + this.stock.code + ') from your favourites?';
        }

        favouriteUrl() {
            if (this.stock.favourite) {
                return starUrls.on;
            } else if (this.starHovered) {
                return starUrls.onHover;
            } else if (this.stock.isHovered || this.selectionService.selectedStock() === this.stock) {
                return starUrls.offHover;
            } else {
                return starUrls.off;
            }
        }

        click() {
            if (this.check) {
                this.confirmationShow = true;
            }
            else {
                if (!this.store) {
                    this.store = window.storeService.open(window.name);
                }

                if (this.stock.favourite) {
                    this.deselect();
                } else {
                    this.stock.favourite = true;
                    this.store.add(this.stock);
                }
            }
        }

        deselect() {
            if (!this.store) {
                this.store = window.storeService.open(window.name);
            }
            this.stock.favourite = false;
            this.store.remove(this.stock);
            this.hideModal();
        }

        hideModal() {
            this.confirmationShow = false;
        }


        mouseEnter() {
            this.starHovered = true;
        }

        mouseLeave() {
            this.starHovered = false;
        }
    }
    StarCtrl.$inject = ['$scope', 'selectionService'];

    angular.module('stockflux.star')
        .controller('StarCtrl', StarCtrl);
}());
