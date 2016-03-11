(function() {
    'use strict';

    class IconCtrl {

        constructor($scope) {
            this.$scope = $scope;
            this.active = false;

            this.urls = {
                inactive: $scope.name,
                active: $scope.name + '_active'
            };
        }

        enter() {
            this.active = true;
        }

        leave() {
            this.active = false;
        }

        url() {
            var override = this.$scope.override;
            if (override) {
                return override;
            } else {
                return this.active ? this.urls.active : this.urls.inactive;
            }
        }

        click(e) {
            if (e.button !== 0) {
                return;
            }

            this.$scope.iconClick();
            this.active = false;

            e.stopPropagation();
        }
    }
    IconCtrl.$inject = ['$scope'];

    angular.module('stockflux.icon')
        .controller('IconCtrl', IconCtrl);
}());
