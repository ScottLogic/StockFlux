(function() {
    'use strict';

    const defaultWidth = 1280,
        defaultHeight = 720,
        compactWidth = 230,
        compactHeight = 500;

    class ToolbarCtrl {
        constructor($scope, $timeout, currentWindowService) {
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.currentWindowService = currentWindowService;
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
            this.window.minimize();
        }

        maximiseClick() {
            this.window.maximize();
        }

        normalSizeClick() {
            this.window.restore();
            this.window.resizeTo(defaultWidth, defaultHeight, 'top-right');
        }

        _compactChanged() {
            var becomingCompact = this.isCompact();
            if (becomingCompact && window.outerWidth !== compactWidth) {
                this.oldSize = [window.outerWidth, window.outerHeight];
            }

            window.windowService.updateOptions(this.window, becomingCompact);

            if (becomingCompact) {
                this.window.resizeTo(compactWidth, compactHeight, 'top-right');
            }
            else if (this.maximised) {
                this.window.maximize();
            }
            else {
                var width = defaultWidth,
                    height = defaultHeight;
                if (this.oldSize) {
                    width = this.oldSize[0];
                    height = this.oldSize[1];
                }

                this.window.resizeTo(width, height, 'top-right');
            }
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
    ToolbarCtrl.$inject = ['$scope', '$timeout', 'currentWindowService'];

    angular.module('openfin.toolbar')
        .controller('ToolbarCtrl', ToolbarCtrl);
}());
