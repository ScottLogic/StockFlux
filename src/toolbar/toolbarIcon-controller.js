(function() {
    'use strict';

    angular.module('openfin.toolbar')
        .controller('ToolbarIconCtrl', ['$scope', function($scope) {
            var self = this;
            var icon,
                urls;

            (function() {
                var name = $scope.name;

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

                urls = {
                    inactive: name,
                    hover: name + '_hover',
                    active: name + '_active'
                };

                icon = {
                    active: active,
                    hovered: hovered
                };
            }());

            self.enter = function() {
                icon.hovered(true);
            };

            self.leave = function() {
                icon.hovered(false);
                icon.active(false);
            };

            self.url = function() {
                if (icon.active()) {
                    return urls.active;
                } else if (icon.hovered()) {
                    return urls.hover;
                } else {
                    return urls.inactive;
                }
            };

            self.mouseDown = function(e, name) {
                if (e.button !== 0) {
                    return;
                }

                icon.active(true);
            };

            self.click = function(e, name) {
                if (e.button !== 0) {
                    return;
                }

                icon.active(true);
                $scope.iconClick();
                icon.active(false);
                icon.hovered(false);
            };
        }]);
}());
