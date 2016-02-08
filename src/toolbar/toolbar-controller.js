(function() {
    'use strict';

    class ToolbarCtrl {
        constructor($timeout, currentWindowService) {
            this.$timeout = $timeout;
            this.currentWindowService = currentWindowService;
            this.maximised = false;
            currentWindowService.ready(this.onReady.bind(this));
        }

        onReady() {
            this.window = this.currentWindowService.getCurrentWindow();
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
        }

        minimiseClick() {
            this.window.minimize();
        }

        maximiseClick() {
            this.window.maximize();
        }

        normalSizeClick() {
            this.window.restore();
        }

        closeClick() {
            this.window.close();
        }
    }
    ToolbarCtrl.$inject = ['$timeout', 'currentWindowService'];

    angular.module('openfin.toolbar')
        .controller('ToolbarCtrl', ToolbarCtrl);
}());
