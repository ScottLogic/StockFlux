(function() {
    'use strict';

    class MainCtrl {
      constructor($timeout, currentWindowService) {
          this.$timeout = $timeout;
          this.currentWindowService = currentWindowService;
          currentWindowService.ready(this.onReady.bind(this));
      }
      onReady() {
          this.window = this.currentWindowService.getCurrentWindow();
      }

      isSummarised() {
          return this.window.summarised;
      }
    }
    MainCtrl.$inject = ['$timeout', 'currentWindowService'];

    angular.module('openfin.main')
        .controller('MainCtrl', MainCtrl);
}());
