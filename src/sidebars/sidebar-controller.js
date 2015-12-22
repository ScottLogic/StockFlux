(function() {
    'use strict';

    angular.module('openfin.sidebar', [])
        .controller('SidebarCtrl', [function() {
            var self = this,
                totalWidth = 271,
                smallBarWidth = 40,
                largeBarWidth = totalWidth - smallBarWidth - 1, // The 1 is for the gap
                searchWidth = smallBarWidth,
                favouritesWidth = largeBarWidth,
                showSearches = false,
                showFavourites = true,
                searchSmall = true;

            self.searchWidth = function() {
                return searchWidth + 'px';
            };

            self.favouritesWidth = function() {
                return favouritesWidth + 'px';
            };

            self.showSearches = function() {
                return showSearches;
            };

            self.showFavourites = function() {
                return showFavourites;
            };

            self.searchClick = function() {
                if (searchSmall) {
                    searchSmall = false;
                    showFavourites = false;
                    searchWidth = largeBarWidth;
                    favouritesWidth = smallBarWidth;
                    showSearches = true;
                }
            };

            self.favouritesClick = function() {
                if (!searchSmall) {
                    searchSmall = true;
                    searchWidth = smallBarWidth;
                    favouritesWidth = largeBarWidth;
                    showSearches = false;
                    showFavourites = true;
                }
            };
        }]);
}());
