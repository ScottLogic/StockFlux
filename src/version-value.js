(function() {
    'use strict';

    const VERSION = { version: '10.0.1' };

    angular.module('stockflux.version')
        .value('Version', VERSION.version);
}());
