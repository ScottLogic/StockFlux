(function() {
    'use strict';

    const classes = {
        expanded: 'expanded',
        contracted: 'contracted'
    };

    class SidebarCtrl {
        constructor() {
            this._showSearches = false;
        }

        searchClass() {
            return this.showSearches() ? classes.expanded : classes.contracted;
        }

        favouritesClass() {
            return this.showFavourites() ? classes.expanded : classes.contracted;
        }

        showSearches() {
            return this._showSearches;
        }

        showFavourites() {
            return !this._showSearches;
        }

        searchClick() {
            this._showSearches = true;
        }

        favouritesClick() {
            this._showSearches = false;
        }
    }
    SidebarCtrl.$inject = [];

    angular.module('stockflux.sidebar')
        .controller('SidebarCtrl', SidebarCtrl);
}());
