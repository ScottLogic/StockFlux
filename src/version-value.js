(function() {
    'use strict';

    const VERSION = { version: '10.0.0-rc.2' };

    angular.module('stockflux.version')
        .value('Version', VERSION.version);
}());
