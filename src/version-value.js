(function() {
    'use strict';

    const VERSION = { version: '9.2.0' };

    angular.module('stockflux.version')
        .value('Version', VERSION.version);
}());
