(function() {
    'use strict';

    class MainCtrl {
        constructor($scope, $timeout) {
            this.store = null;
            this.$scope = $scope;
            this.$timeout = $timeout;

            this.tearingOut = false;
            this.watch();
        }

        watch() {
            this.$scope.$on('tearoutStart', () => {
                this.$timeout(() => {
                    this.tearingOut = true;
                });
            });
            this.$scope.$on('tearoutEnd', () => {
                this.$timeout(() => {
                    this.tearingOut = false;
                });
            });
        }

        disablePointer() {
            return this.tearingOut;
        }

        isCompact() {
            if (!this.store && window.storeService) {
                this.store = window.storeService.open(window.name);
            }

            return this.store && this.store.isCompact();
        }
    }
    MainCtrl.$inject = ['$scope', '$timeout'];

    angular.module('stockflux.main')
        .controller('MainCtrl', MainCtrl);
}());
