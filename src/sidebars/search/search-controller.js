(function() {
    'use strict';

    class SearchCtrl {
        constructor($scope, quandlService, selectionService, currentWindowService) {
            this.$scope = $scope;
            this.quandlService = quandlService;
            this.selectionService = selectionService;
            this.currentWindowService = currentWindowService;

            this.quandlService.on('CONNECTION_STATUS_CHAGED', this._setConnectionStatus, this);
            this.isConnected = true;

            this.store = null;
            this.query = '';
            this.noResults = false;
            this.stocks = [];

            this._watch();
        }

        _setConnectionStatus(status) {
            this.isConnected = status;
        }

        isConnected() {
            return this.isConnected;
        }

        selection() {
            return this.selectionService.selectedStock().code;
        }

        select(stock) {
            if (!this.store) {
                this.store = window.storeService.open(window.name);
            }
            if (!this.store.isCompact()) {
                this.selectionService.select(stock);
            }
        }

        onSearchKeyDown(event) {
            if (event.keyCode === 38) {
                // Up
                this.changePointer(-1);
            } else if (event.keyCode === 40) {
                // Down
                this.changePointer(1);
            }
            else if (event.keyCode === 27) {
                // Escape
                this.$scope.sidebarCtrl.favouritesClick();
            }
        }

        changePointer(delta) {
            // Change the selection pointer to be the selected stock, if it exists in the list
            // (otherwise, set to -1, which is acceptable as there is no selection yet)
            var currentSelectionPointer = this.stocks.map((stockItem) => {
                return stockItem.code;
            }).indexOf(this.selection());

            var newPointer = currentSelectionPointer + delta;

            newPointer = Math.max(
                0,
                Math.min(
                    newPointer,
                    this.stocks.length - 1
                )
            );

            if (this.stocks.length > 0) {
                this.select(this.stocks[newPointer]);
            }
        }


        submit() {
            this.stocks = [];
            this.noResults = false;

            this.currentWindowService.ready(() => {
                if (!this.store) {
                    this.store = window.storeService.open(window.name);
                }

                var favourites = this.store.get();
                if (this.query) {
                    var length = favourites.length;
                    this.quandlService.search(this.query, (stock) => {
                        var i;

                        // removing stocks found with old query
                        this.stocks = this.stocks.filter((result, j) => {
                            return result.query === this.query;
                        });

                        // not adding old stocks
                        if (stock.query !== this.query) {
                            return;
                        }

                        // Due to the asynchronicity of the search, if multiple searches
                        // are fired off in a small amount of time, with an intermediate one
                        // returning no results it's possible to have both the noResults flag
                        // set to true, while some stocks have been retrieved by a later search.
                        //
                        // Here we re-set the flag to keep it up-to-date.
                        this.noResults = false;

                        var stockAdded = false;
                        for (i = 0; i < length; i++) {
                            if (stock.code === favourites[i]) {
                                stock.favourite = true;
                                this.stocks.unshift(stock);
                                stockAdded = true;
                            }
                        }

                        if (!stockAdded) {
                            this.stocks.push(stock);
                        }
                    },
                    () => this.noResults = true);
                } else {
                    favourites.map((favourite) => {
                        this.quandlService.getMeta(favourite, (stock) => {
                            stock.favourite = true;
                            this.stocks.push(stock);
                        });
                    });
                }
            });
        }

        _watch() {
            this.$scope.$watch(
                // Can't watch `this.query` as the subscribers to this controller
                // may alias it (e.g. `searchCtrl.query`), so instead define a
                // function to decouple scoping.
                () => this.query,
                () => {
                    this.submit();
                });

            this.$scope.$on('updateFavourites', (event, data) => {
                if (!data) {
                    return;
                }

                var index = this.stocks.map((stock) => { return stock.code; }).indexOf(data.code);
                if (index > -1) {
                    if (!this.query) {
                        // There are no search results, so remove the favourite.
                        this.stocks.splice(index, 1);
                    } else {
                        // Update the stock's favourite
                        this.stocks[index].favourite = data.favourite;
                    }
                // The stock doesn't exist, push it on if it's a favourite.
                } else if (data.favourite) {
                    this.stocks.push(data);
                }
            });
        }

        darkenClass(stock) {
            return (this.selection() === stock.code || stock.isHovered) ? 'dark' : '';
        }
    }
    SearchCtrl.$inject = ['$scope', 'quandlService', 'selectionService', 'currentWindowService'];

    angular.module('stockflux.search')
        .controller('SearchCtrl', SearchCtrl);
}());
