(function() {
    'use strict';

    angular.module('OpenFinD3FCParent', [
        'openfin.parent'
    ]);

    angular.module('openfin.parent', ['openfin.window']);
    angular.module('openfin.window', []);
    angular.module('openfin.store', []);
    angular.module('openfin.currentWindow', []);
}());
