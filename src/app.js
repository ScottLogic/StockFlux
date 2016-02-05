(function() {
    'use strict';

    angular.module('OpenFinD3FC', [
        'ngAnimate',
        'openfin.showcase',
        'openfin.toolbar',
        'openfin.search',
        'openfin.favourites',
        'openfin.sidebar',
        'openfin.filters',
        'openfin.star',
        'openfin.tearout',
        'openfin.minichart'
    ]);

    angular.module('openfin.showcase', ['openfin.selection', 'openfin.quandl']);
    angular.module('openfin.toolbar', ['openfin.desktop']);
    angular.module('openfin.search', ['openfin.quandl', 'openfin.store', 'openfin.selection', 'openfin.desktop']);
    angular.module('openfin.favourites', ['openfin.store', 'openfin.quandl', 'openfin.selection', 'openfin.desktop']);
    angular.module('openfin.sidebar', []);
    angular.module('openfin.filters', []);
    angular.module('openfin.star', ['openfin.store', 'openfin.selection']);
    angular.module('openfin.tearout', ['openfin.geometry', 'openfin.hover', 'openfin.store', 'openfin.desktop']);
    angular.module('openfin.minichart', ['openfin.quandl']);
}());
