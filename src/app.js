(function() {
    'use strict';

    angular.module('StockFlux', [
        'ngAnimate',
        'stockflux.main',
        'stockflux.showcase',
        'stockflux.toolbar',
        'stockflux.icon',
        'stockflux.search',
        'stockflux.favourites',
        'stockflux.sidebar',
        'stockflux.filters',
        'stockflux.star',
        'stockflux.tearout',
        'stockflux.minichart',
        'stockflux.scroll',
        'stockflux.closedWindows',
        'stockflux.closedCard',
        'stockflux.config',
        'stockflux.version'
    ]);

    angular.module('stockflux.main', []);
    angular.module('stockflux.showcase', ['stockflux.selection', 'stockflux.quandl', 'stockflux.config']);
    angular.module('stockflux.toolbar', ['stockflux.currentWindow', 'stockflux.closedWindows', 'stockflux.config']);
    angular.module('stockflux.icon', []);
    angular.module('stockflux.search', ['stockflux.quandl', 'stockflux.selection', 'stockflux.currentWindow']);
    angular.module('stockflux.favourites', ['stockflux.quandl', 'stockflux.selection', 'stockflux.currentWindow']);
    angular.module('stockflux.sidebar', []);
    angular.module('stockflux.filters', []);
    angular.module('stockflux.star', ['stockflux.selection']);
    angular.module('stockflux.tearout', ['stockflux.geometry', 'stockflux.hover', 'stockflux.currentWindow', 'stockflux.config']);
    angular.module('stockflux.minichart', ['stockflux.quandl']);
    angular.module('stockflux.store', []);
    angular.module('stockflux.currentWindow', []);
    angular.module('stockflux.scroll', []);
    angular.module('stockflux.closedWindows', ['stockflux.closedCard']);
    angular.module('stockflux.closedCard', []);
    angular.module('stockflux.config', []);
    angular.module('stockflux.version', ['stockflux.currentWindow']);
}());
