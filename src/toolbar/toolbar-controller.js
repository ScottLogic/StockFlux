(function() {
    'use strict';

    class ToolbarCtrl {
        constructor($scope, $timeout, currentWindowService) {
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.currentWindowService = currentWindowService;
            this.store = null;
            this.window = null;
            this.maximised = false;
            this.oldSize = null;
            currentWindowService.ready(this.onReady.bind(this));
            this._watch();
        }

        isCompact() {
            if (!this.store && window.storeService) {
                this.store = window.storeService.open(window.name);
            }

            return this.store && this.store.isCompact();
        }

        onReady() {
            this.window = this.currentWindowService.getCurrentWindow();
            this.window.addEventListener('maximized', () => {
                this.$timeout(() => {
                    this.maximised = true;
                });
            });

            this.window.addEventListener('restored', () => {
                this.$timeout(() => {
                    this.maximised = false;
                });
            });
        }

        minimiseClick() {
            this.window.minimize();
        }

        maximiseClick() {
            this.window.maximize();
        }

        normalSizeClick() {
            this.window.restore();
            this.window.resizeTo(1280, 720, 'top-right');
        }

        _compactChanged() {
            var compact = this.isCompact();
            if (compact) {
                this.oldSize = [window.outerWidth, window.outerHeight];
            }

            window.windowService.updateOptions(this.window, compact);

            if (compact) {
                this.window.resizeTo(230, 500, 'top-right');
            }
            else if (this.maximised) {
                this.window.maximize();
            }
            else {
                var width = 1280,
                    height = 720;
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
