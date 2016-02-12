(function() {
    'use strict';

    class MainCtrl {
      constructor($timeout, currentWindowService) {
          this.$timeout = $timeout;
          this.currentWindowService = currentWindowService;
      }

      isCompact() {
          return this.currentWindowService.compact;
      }
    }
    MainCtrl.$inject = ['$timeout', 'currentWindowService'];

    angular.module('openfin.main')
        .controller('MainCtrl', MainCtrl);
}());
