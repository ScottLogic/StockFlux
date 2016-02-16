(function() {
    'use strict';

    class ToolbarCtrl {
        constructor($timeout, currentWindowService) {
            this.$timeout = $timeout;
            this.currentWindowService = currentWindowService;
            this.maximised = false;
            this.compact = false;
            currentWindowService.ready(this.onReady.bind(this));
        }

        onReady() {
            this.window = this.currentWindowService.getCurrentWindow();
            this.window.getBounds((bounds) => {
                this.compact = this.currentWindowService.compact = bounds.width === 230;
            });
            this.window.addEventListener('maximized', () => {
                this.$timeout(() => {
                    this.maximised = true;
                });

                this.window.addEventListener('restored', function(e) {
                    this.$timeout(function() {
                        this.maximised = false;
                    });
                });
            });
            this.window.addEventListener('bounds-changed', (e) => {
                this.window.getBounds((bounds) => {
                    this.currentWindowService.compact = bounds.width === 230;
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

        compactClick() {
            this.compact = !this.compact;
            this.currentWindowService.compact = this.compact;
            if (this.compact) {
                this.window.resizeTo(230, 500, 'top-right');
                this.window.updateOptions({
                    resizable: false
                });
            }
            else if (this.maximised) {
                this.window.maximize();
                this.window.updateOptions({
                    resizable: true
                });
            }
            else {
                this.window.resizeTo(1280, 720, 'top-right');
                this.window.updateOptions({
                    resizable: true
                });
            }
        }

        closeClick() {
            this.window.close();
        }
    }
    ToolbarCtrl.$inject = ['$timeout', 'currentWindowService'];

    angular.module('openfin.toolbar')
        .controller('ToolbarCtrl', ToolbarCtrl);
}());
