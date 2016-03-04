(function() {
    'use strict';

    class IconCtrl {

        constructor($scope) {
            this.$scope = $scope;

            this.setup();
        }

        setup() {
            var name = this.$scope.name;

            var dict = {},
                _active = '_active',
                _hovered = '_hovered';

            dict[name + _active] = false;
            dict[name + _hovered] = false;

            function active(value) {
                if (!arguments.length) {
                    return dict[name + _active];
                }

                dict[name + _active] = value;
            }

            function hovered(value) {
                if (!arguments.length) {
                    return dict[name + _hovered];
                }

                dict[name + _hovered] = value;
            }

            this.urls = {
                inactive: name,
                hover: name + '_hover',
                active: name + '_active'
            };

            this.icon = {
                active: active,
                hovered: hovered
            };
        }

        enter() {
            this.icon.hovered(true);
        }

        leave() {
            this.icon.hovered(false);
            this.icon.active(false);
        }

        url() {
            if (this.icon.active()) {
                return this.urls.active;
            } else if (this.icon.hovered()) {
                return this.urls.hover;
            } else {
                return this.urls.inactive;
            }
        }

        mouseDown(e, name) {
            if (e.button !== 0) {
                return;
            }

            this.icon.active(true);
        }

        click(e, name) {
            if (e.button !== 0) {
                return;
            }

            this.icon.active(true);
            this.$scope.iconClick();
            this.icon.active(false);
            this.icon.hovered(false);
        }
    }
    IconCtrl.$inject = ['$scope'];

    angular.module('stockflux.icon')
        .controller('IconCtrl', IconCtrl);
}());
