(function() {
    'use strict';

    const classes = {
        expanded: 'expanded',
        contracted: 'contracted'
    };

    class SidebarCtrl {
        constructor($scope) {
            this.$scope = $scope;
            this._favouritesClass = classes.expanded;
            this._searchClass = classes.contracted;

            this._showSearches = false;
            this._showFavourites = true;
            this._searchSmall = true;
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
    }

    angular.module('openfin.sidebar', [])
        .controller('SidebarCtrl', SidebarCtrl);
}());
