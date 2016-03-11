(function() {
    'use strict';

    angular.module('StockFluxParent', [
        'stockflux.parent'
    ]);

    angular.module('stockflux.parent', ['stockflux.store', 'stockflux.window']);
    angular.module('stockflux.store', ['stockflux.version']);
    angular.module('stockflux.version', []);
    angular.module('stockflux.currentWindow', []);
    angular.module('stockflux.window', ['stockflux.store', 'stockflux.geometry', 'stockflux.config']);
    angular.module('stockflux.config', []);
}());
