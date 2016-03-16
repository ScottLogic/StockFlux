(function() {
    'use strict';

    class SearchCtrl {
        constructor($scope, $timeout, quandlService, selectionService, currentWindowService) {
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.quandlService = quandlService;
            this.selectionService = selectionService;
            this.currentWindowService = currentWindowService;

            this.store = null;
            this.query = '';
            this.noResults = false;
            this.stocks = [];
            this.errors = [];
            this.isLoading = false;

            this._watch();
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
            else if (event.keyCode === 13) {
                // Enter
                this.changePointer(0);
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
                    this.isLoading = true;
                    this.errors = [];
                    this.quandlService.search(this.query, (stock) => {
                        this.isLoading = false;
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
                    () => {this.noResults = true;},
                    (error) => {
                        this.isLoading = false;
                        this._addError({
                            code: (error && error.code) || 'No code received',
                            message: (error && error.message) || 'No message'
                        });
                    });
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

        _addError(newError) {
            var errors = this.errors, max = errors.length;
            var newCode = newError.code;

            for (var i = 0; i < max; i++) {
                if (errors[i] && errors[i].code === newCode) {
                    errors[i].occurences++;
                    return;
                }
            }
            newError.occurences = 1;
            this.errors.push(newError);
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
                this.$timeout(() => {
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
                    // if there's no search results.
                    } else if (data.favourite && !this.query) {
                        this.stocks.push(data);
                    }
                });
            });
        }

        darkenClass(stock) {
            return (this.selection() === stock.code || stock.isHovered);
        }

        selectedClass(stock) {
            return this.selection() === stock.code;
        }
    }
    SearchCtrl.$inject = ['$scope', '$timeout', 'quandlService', 'selectionService', 'currentWindowService'];

    angular.module('stockflux.search')
        .controller('SearchCtrl', SearchCtrl);
}());
