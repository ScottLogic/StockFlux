(function() {
    'use strict';

    const classes = {
        expanded: 'expanded',
        contracted: 'contracted'
    };

    class SidebarCtrl {
        constructor($scope) {
            this._favouritesClass = classes.expanded;
            this._searchClass = classes.contracted;

            this._showSearches = false;
            this._showFavourites = true;
            this._searchSmall = true;
            this.$scope = $scope;

            this._watch();
        }

        searchClass() {
            return this._searchClass;
        }

        favouritesClass() {
            return this._favouritesClass;
        }

        showSearches() {
            return this._showSearches;
        }

        showFavourites() {
            return this._showFavourites;
        }

        searchClick() {
            if (this._searchSmall) {
                this._searchSmall = false;
                this._showFavourites = false;
                this._searchClass = classes.expanded;
                this._favouritesClass = classes.contracted;
                this._showSearches = true;
            }
        }

        favouritesClick() {
            if (!this._searchSmall) {
                this._searchSmall = true;
                this._searchClass = classes.contracted;
                this._favouritesClass = classes.expanded;
                this._showSearches = false;
                this._showFavourites = true;
            }
        }

        _showSearchesChanged() {
            var showSearches = this.showSearches();
            if (showSearches) {
                //Couldn't get it to work reliable in a synchronous/promise fashion
                setTimeout(function() {
                    document.getElementById('searchInput').focus();
                }, 100);
            }

        }

        _watch() {
            this.$scope.$watch(
                () => this.showSearches(),
                () => this._showSearchesChanged());
        }
    }
    SidebarCtrl.$inject = ['$scope'];

    angular.module('openfin.sidebar')
        .controller('SidebarCtrl', SidebarCtrl);
}());
