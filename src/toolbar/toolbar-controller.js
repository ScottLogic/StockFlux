(function() {
    'use strict';

    class ToolbarCtrl {
        constructor($timeout, currentWindowService) {
            this.$timeout = $timeout;
            this.currentWindowService = currentWindowService;
            this.maximised = false;
            this.summarised = false;
            currentWindowService.ready(this.onReady.bind(this));
        }

        onReady() {
            this.window = this.currentWindowService.getCurrentWindow();
            this.window.getBounds(function(bounds) {
                if (bounds.width === 230) {
                    this.summarised = true;
                    this.window.summarised = true;
                }
                else {
                    this.window.summarised = false;
                }
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
                this.window.getBounds(function(bounds) {
                    if (bounds.width === 230) {
                        this.window.summarised = true;
                    }
                    else {
                        this.window.summarised = false;
                    }
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

        summariseClick() {
            this.summarised = !this.summarised;
            this.window.summarised = this.summarised;
            if (this.summarised) {
                this.window.resizeTo(230, 500, 'top-right');
            }
            else if (this.maximised) {
                this.window.maximize();
            }
            else {
                this.window.resizeTo(1280, 720, 'top-right');
            }
        }

        summariseClick() {
            this.summarised = !this.summarised;
            this.window.summarised = this.summarised;
            if (this.summarised) {
                this.window.resizeTo(280, 500, 'top-right');
            }
            else if (this.maximised) {
                this.window.maximize();
            }
            else {
                this.window.resizeTo(1280, 720, 'top-right');
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
