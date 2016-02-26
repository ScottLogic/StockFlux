(function() {
    'use strict';

    angular.module('OpenFinD3FC', [
        'ngAnimate',
        'openfin.main',
        'openfin.showcase',
        'openfin.toolbar',
        'openfin.icon',
        'openfin.search',
        'openfin.favourites',
        'openfin.sidebar',
        'openfin.filters',
        'openfin.star',
        'openfin.tearout',
        'openfin.minichart',
        'openfin.scroll',
        'openfin.closedWindows',
        'openfin.closedCard',
        'openfin.version'
    ]);

    angular.module('openfin.main', []);
    angular.module('openfin.showcase', ['openfin.selection', 'openfin.quandl']);
    angular.module('openfin.toolbar', ['openfin.currentWindow']);
    angular.module('openfin.icon', []);
    angular.module('openfin.search', ['openfin.quandl', 'openfin.selection', 'openfin.currentWindow']);
    angular.module('openfin.favourites', ['openfin.quandl', 'openfin.selection', 'openfin.currentWindow']);
    angular.module('openfin.sidebar', []);
    angular.module('openfin.filters', []);
    angular.module('openfin.star', ['openfin.selection']);
    angular.module('openfin.tearout', ['openfin.geometry', 'openfin.hover', 'openfin.currentWindow']);
    angular.module('openfin.minichart', ['openfin.quandl']);
    angular.module('openfin.store', []);
    angular.module('openfin.currentWindow', []);
    angular.module('openfin.scroll', []);
    angular.module('openfin.closedWindows', []);
    angular.module('openfin.closedCard', []);
    angular.module('openfin.version', []);
}());
