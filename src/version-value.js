(function() {
    'use strict';

    const VERSION = { version: '10.1.0' };

    angular.module('stockflux.version')
        .value('Version', VERSION.version);
}());
