(function() {
    'use strict';

    angular.module('openfin.sidebar')
        .controller('SidebarCtrl', ['$scope', function($scope) {
            var self = this,
                showSearches = false,
                showFavourites = true,
                searchSmall = true;

            var classes = {
                expanded: 'expanded',
                contracted: 'contracted'
            };

            var favouritesClass = classes.expanded,
                searchClass = classes.contracted;

            self.searchClass = function() {
                return searchClass;
            };

            self.favouritesClass = function() {
                return favouritesClass;
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
                    searchClass = classes.expanded;
                    favouritesClass = classes.contracted;
                    showSearches = true;
                }
            };

            self.favouritesClick = function() {
                if (!searchSmall) {
                    searchSmall = true;
                    searchClass = classes.contracted;
                    favouritesClass = classes.expanded;
                    showSearches = false;
                    showFavourites = true;
                }
            };
        }]);
}());
