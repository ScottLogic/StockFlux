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

            this.stock = $scope.stock;
            this.check = $scope.confirm;
            this.confirmationShow = false;
            this.mouseY = 0;
            this.viewHeight = 720;
        }

        favouriteUrl() {
            if (this.starHovered) {
                return starUrls.onHover;
            } else if (this.stock.favourite) {
                return starUrls.on;
            } else if (this.stock.isHovered || this.selectionService.selectedStock() === this.stock) {
                return starUrls.offHover;
            } else {
                return starUrls.off;
            }
        }

        tooltip() {
            return this.stock.favourite ? 'Unfavourite Stock' : 'Favourite Stock';
        }

        modalFlip() {
            var modalHeight = 84;
            var modalTop = this.mouseY + 25;
            return this.viewHeight < modalTop + modalHeight;
        }

        modalTop() {
            var modalTop = this.mouseY + 25;
            if (this.modalFlip()) {
                modalTop = this.mouseY - 95;
            }
            return modalTop;
        }

        modalBubbleTop() {
            var bubbleTop = this.modalTop() - 5;
            if (this.modalFlip()) {
                bubbleTop = this.modalTop() + 79;
            }
            return bubbleTop;
        }

        click(event) {
            if (event.button !== 0) {
                // Only process left clicks
                return false;
            }

            this.mouseY = event.currentTarget.y;
            this.viewHeight = event.view.innerHeight;
            if (this.check) {
                this.confirmationShow = true;
                this.$scope.$emit('disableScrolling');
            }
            else {
                if (!this.store) {
                    this.store = window.storeService.open(window.name);
                }

                if (this.stock.favourite) {
                    this.deselect();
                } else {
                    reportAction('Add Favourite', this.stock.code);
                    this.stock.favourite = true;
                    this.store.add(this.stock);
                }
            }
        }

        deselect() {
            if (!this.store) {
                this.store = window.storeService.open(window.name);
            }
            reportAction('Remove Favourite', + this.stock.code);
            this.stock.favourite = false;
            this.store.remove(this.stock);
            this.hideModal();
        }

        hideModal() {
            this.confirmationShow = false;
            this.$scope.$emit('enableScrolling');
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
