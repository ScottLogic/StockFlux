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
            this.maximised = false;
            this.oldSize = null;

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
        }

        minimiseClick() {
            //Reporting to GA
            reportAction('Window change', 'Minimised');
            this.window.minimize();
        }

        maximiseClick() {
            //Reporting to GA
            reportAction('Window change', 'Maximised');
            this.window.maximize();
        }

        normalSizeClick() {
            var defaultWindowDimensions = this.configService.getDefaultWindowDimensions();

            this.window.restore();
            this.window.resizeTo(defaultWindowDimensions[0], defaultWindowDimensions[1], 'top-right');
        }

        _compactChanged() {
            var becomingCompact = this.isCompact(),
                compactWindowDimensions = this.configService.getCompactWindowDimensions();
            if (window.outerWidth !== compactWindowDimensions[0]) {
                this.oldSize = [window.outerWidth, window.outerHeight];
            }

            if (window.windowService) {
                window.windowService.updateOptions(this.window, becomingCompact);
            }

            if (becomingCompact) {
                reportAction('Window change', 'Compact');
                this.window.resizeTo(compactWindowDimensions[0], compactWindowDimensions[1], 'top-right');
            }
            else if (this.maximised) {
                //Reporting to GA
                reportAction('becomingMaximised');
                this.window.maximize();
            }
            else {
                reportAction('Window change', 'Standard');
                var defaultWindowDimensions = this.configService.getDefaultWindowDimensions(),
                    width = defaultWindowDimensions[0],
                    height = defaultWindowDimensions[1];
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
