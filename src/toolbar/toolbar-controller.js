(function() {
    'use strict';

    class ToolbarCtrl {

        constructor($timeout, desktopService) {
            this.$timeout = $timeout;
            this.desktopService = desktopService;
            this.maximised = false;
            desktopService.ready(this.onReady.bind(this));
        }

        onReady() {
            this.window = this.desktopService.getCurrentWindow();
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
        }

        closeClick() {
            this.window.close();
        }
    }
    ToolbarCtrl.$inject = ['$timeout', 'desktopService'];

    angular.module('openfin.toolbar')
        .controller('ToolbarCtrl', ToolbarCtrl);
}());
