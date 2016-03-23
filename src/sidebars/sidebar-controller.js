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
                //Reporting to GA
                reportAction('showSearch');
            }
            this._showSearches = true;
        }

        favouritesClick() {
            if (this._showSearches) {
                //Reporting to GA
                reportAction('showFavourites');
            }
            this._showSearches = false;
        }
    }
    SidebarCtrl.$inject = [];

    angular.module('stockflux.sidebar')
        .controller('SidebarCtrl', SidebarCtrl);
}());
