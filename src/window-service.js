(function(fin) {
    'use strict';
    var firstName = true;

    function getName() {
        if (firstName) {
            firstName = false;
            return 'main';
        }

        // TODO: Should probably change this...
        return 'window' + Math.floor(Math.random() * 1000) + Math.ceil(Math.random() * 999);
    }

    class AppManager {
        constructor() {
            this.windowsOpen = 0;
        }

        increment() {
            this.windowsOpen++;
        }

        decrement() {
            this.windowsOpen--;

            if (this.windowsOpen === 0) {
                window.close();
            }
        }

        count() {
            return this.windowsOpen;
        }
    }

    class WindowCreationService {
        constructor(storeService) {
            this.storeService = storeService;
            this.openWindows = {};
            this.windowsCache = [];
            this.firstName = true;
            this.apps = new AppManager();
        }

        _createWindow(config, successCb, closedCb) {
            config.name = getName();
            var newWindow = new fin.desktop.Window(config, () => {
                this.windowsCache.push(newWindow);

                if (successCb) {
                    successCb(newWindow);
                }
            });

            this.apps.increment();

            newWindow.addEventListener('closed', (e) => {
                var parent = this.openWindows[newWindow.name];
                if (parent) {
                    for (var i = 0, max = parent.length; i < max; i++) {
                        parent[i].close();
                    }
                }

                var index = this.windowsCache.indexOf(newWindow);
                this.windowsCache.slice(index, 1);

                if (closedCb) {
                    closedCb();
                }

                this.apps.decrement();
            });

            return newWindow;
        }

        createMainWindow(config, successCb) {
            this._createWindow(
                config,
                (newWindow) => {
                    // TODO
                    // Begin super hack
                    newWindow.getNativeWindow().windowService = this;
                    newWindow.getNativeWindow().storeService = this.storeService;
                    // End super hack

                    if (successCb) {
                        successCb(newWindow);
                    }

                    newWindow.show();
                },
                () => {
                    if (this.apps.count() !== 1) {
                        this.storeService.open(config.name).closeWindow();
                    }
                }
            );
        }

        createTearoutWindow(config, parentName) {
            var tearoutWindow = this._createWindow(config);

            if (!this.openWindows[parentName]) {
                this.openWindows[parentName] = [].concat(tearoutWindow);
            } else {
                this.openWindows[parentName].push(tearoutWindow);
            }

            return tearoutWindow;
        }

        ready(cb) {
            fin.desktop.main(cb);
        }

        getWindows() {
            return this.windowsCache;
        }
    }
    WindowCreationService.$inject = ['storeService'];

    angular.module('openfin.window')
        .service('windowCreationService', WindowCreationService);
}(fin));
