(function() {
    'use strict';

    class ToolbarCtrl {
        constructor($timeout, currentWindowService) {
            this.$timeout = $timeout;
            this.currentWindowService = currentWindowService;
            this.store = null;
            this.window = null;
            this.maximised = false;
            this.oldSize = null;
            currentWindowService.ready(this.onReady.bind(this));

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
            this.window.resizeTo(1280, 720, 'top-right');
        }

        compactClick() {
            if (!this.store) {
                this.store = window.storeService.open(window.name);
            }

            this.store.toggleCompact();
            var compact = this.isCompact();
            if (compact) {
                this.window.getBounds(bounds => {
                    this.oldSize = [bounds.width, bounds.height];
                });
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

        closeClick() {
            this.window.removeEventListener('maximized', this.maximisedEvent);
            this.window.removeEventListener('restored', this.restoredEvent);
            this.window.close();
        }
    }
    ToolbarCtrl.$inject = ['$timeout', 'currentWindowService'];

    angular.module('openfin.toolbar')
        .controller('ToolbarCtrl', ToolbarCtrl);
}());
