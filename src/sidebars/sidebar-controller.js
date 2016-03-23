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
            if (!this._showSearches) {
                reportAction('Show', 'Search');
            }
            this._showSearches = true;
        }

        favouritesClick() {
            if (this._showSearches) {
                reportAction('Show', 'Favourites');
            }
            this._showSearches = false;
        }

        toggleClick() {
            this._showSearches = !this._showSearches;
        }
    }
    SidebarCtrl.$inject = [];

    angular.module('stockflux.sidebar')
        .controller('SidebarCtrl', SidebarCtrl);
}());
