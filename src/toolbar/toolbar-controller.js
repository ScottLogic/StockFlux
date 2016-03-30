(function() {
    'use strict';

    class ToolbarCtrl {
        constructor($scope, $timeout, currentWindowService, configService) {
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.currentWindowService = currentWindowService;
            this.configService = configService;
            this.store = null;
            this.window = null;
            this.compactWindowDimensions = null;
            this.maximised = false;
            this.defaultWindowDimensions = this.configService.getDefaultWindowDimensions();
            this.oldSize = null;
            this.oldBounds = {
                width: this.defaultWindowDimensions[0],
                height: this.defaultWindowDimensions[1],
                top: 100,
                left: 100
            };

            this.maximisedEvent = () => {
                this.$timeout(() => {
                    this.maximised = true;
                });
            };

            this.restoredEvent = () => {
                this.$timeout(() => {
                    this.maximised = false;
                });
            };

            currentWindowService.ready(() => {
                var boundReady = this.onReady.bind(this);
                boundReady();
                this._watch();
            });
        }

        isCompact() {
            if (!this.store && window.storeService) {
                this.store = window.storeService.open(window.name);
            }

            return this.store && this.store.isCompact();
        }

        onReady() {
            this.window = this.currentWindowService.getCurrentWindow();
            this.window.addEventListener('maximized', this.maximisedEvent);
            this.window.addEventListener('restored', this.restoredEvent);
            this.compactWindowDimensions = this.configService.getCompactWindowDimensions();
        }

        minimiseClick() {
            reportAction('Window change', 'Minimised');
            this.window.minimize();
        }

        maximiseClick() {
            if (window.outerWidth !== this.compactWindowDimensions[0]) {
                this.oldBounds = {
                    height: window.outerHeight,
                    left: window.screenLeft,
                    top: window.screenTop,
                    width: window.outerWidth
                };
            }
            reportAction('Window change', 'Maximised');
            this.window.maximize();
        }

        normalSizeClick() {
            this.window.restore();
            this.window.setBounds(this.oldBounds.left, this.oldBounds.top, this.oldBounds.width, this.oldBounds.height);
        }

        _compactChanged() {
            var becomingCompact = this.isCompact();
            if (window.outerWidth !== this.compactWindowDimensions[0]) {
                this.oldSize = [window.outerWidth, window.outerHeight];
                this.wasMaximised = this.maximised;
            }

            if (window.windowService) {
                window.windowService.updateOptions(this.window, becomingCompact);
            }

            if (becomingCompact) {
                reportAction('Window change', 'Compact');
                this.window.resizeTo(this.compactWindowDimensions[0], this.compactWindowDimensions[1], 'top-right');
            }
            else if (this.wasMaximised) {
                reportAction('Window change', 'Maximised');
                this.window.maximize();
            }
            else {
                reportAction('Window change', 'Standard');
                var width = this.defaultWindowDimensions[0],
                    height = this.defaultWindowDimensions[1];
                if (this.oldSize) {
                    width = this.oldSize[0];
                    height = this.oldSize[1];
                }

                this.window.resizeTo(width, height, 'top-right');
            }
            this.$scope.$broadcast('compactChanging');
        }

        compactClick() {
            if (!this.store) {
                this.store = window.storeService.open(window.name);
            }

            this.store.toggleCompact();
        }

        closeClick() {
            this.window.removeEventListener('maximized', this.maximisedEvent);
            this.window.removeEventListener('restored', this.restoredEvent);
            this.window.close();
        }

        _watch() {
            this.$scope.$watch(
                () => this.isCompact(),
                () => this._compactChanged());
        }
    }
    ToolbarCtrl.$inject = ['$scope', '$timeout', 'currentWindowService', 'configService'];

    angular.module('stockflux.toolbar')
        .controller('ToolbarCtrl', ToolbarCtrl);
}());
