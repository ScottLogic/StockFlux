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
                searchBarOpacity = 0,
                previewsOpacity = 1,
                searchSmall = true;

            self.searchWidth = function() {
                return searchWidth + 'px';
            };

            self.favouritesWidth = function() {
                return favouritesWidth + 'px';
            };

            self.searchBarOpacity = function() {
                return searchBarOpacity;
            };

            self.previewsOpacity = function() {
                return previewsOpacity;
            };

            self.searchClick = function() {
                if (searchSmall) {
                    searchSmall = false;
                    previewsOpacity = 0;
                    searchWidth = largeBarWidth;
                    favouritesWidth = smallBarWidth;
                    searchBarOpacity = 1;
                }
            };

            self.favouritesClick = function() {
                if (!searchSmall) {
                    searchSmall = true;
                    searchWidth = smallBarWidth;
                    favouritesWidth = largeBarWidth;
                    searchBarOpacity = 0;
                    previewsOpacity = 1;
                }
            };
        }]);
}());
