(function() {
    'use strict';

    class ClosedWindowListCtrl {
        constructor($scope, $timeout) {
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.closedWindows = [];
            this.closedTabsShow = false;
            this.overriddenIcon = '';

            this._watch();
        }

        override() {
            return this.overriddenIcon;
        }

        refreshClosedWindows() {
            this.closedWindows = window.storeService.getPreviousClosedWindows();
            this.updateSeen();
        }

        updateSeen() {
            var seen = window.windowService.getClosedWindowSeen();
            this.overriddenIcon = seen ? '' : (this.$scope.icon + '_active');

            if (!seen && this.closedTabsShow && document.hasFocus()) {
                window.windowService.seenClosedWindows();
            }
        }

        click() {
            this.overriddenIcon = '';
            this.refreshClosedWindows();
            this.closedTabsShow = this.closedWindows.length > 0;

            if (window.windowService) {
                window.windowService.seenClosedWindows();
            }
        }

        _watch() {
            var listener = () => this.$timeout(() => this.refreshClosedWindows());
            var addListener = () => {
                if (window.windowService) {
                    window.windowService.addClosedWindowListener(listener);
                    this.refreshClosedWindows();
                }
            };

            // Can't guarantee that windowService exists, so if it doesn't, watch.
            if (window.windowService) {
                addListener();
            } else {
                this.$scope.$watch(() => window.windowService, () => {
                    addListener();
                });
            }

            this.$scope.$on('$destroy', () => {
                window.windowService.removeClosedWindowListener(listener);
            });
        }
    }
    ClosedWindowListCtrl.$inject = ['$scope', '$timeout'];

    angular.module('stockflux.closedWindows')
        .controller('ClosedWindowListCtrl', ClosedWindowListCtrl);
}());
