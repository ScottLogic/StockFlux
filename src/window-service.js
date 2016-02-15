(function(fin) {
    'use strict';

    function getName() {
        // TODO: Should probably change this...
        return 'window' + Math.floor(Math.random() * 1000) + Math.ceil(Math.random() * 999);
    }

    function createConfig() {
        return {
            'name': getName(),
            'autoShow': false,
            'frame': false,
            'resizable': true,
            'maximizable': true,
            'showTaskbarIcon': true,
            'saveWindowState': true,
            'minWidth': 918,
            'minHeight': 510,
            'url': 'index.html'
        };
    }

    const poolSize = 3;

    class FreeWindowPool {
        constructor($q) {
            this.pool = [];
            this.$q = $q;

            for (var i = 0; i < poolSize; i++) {
                this._fillPool();
            }
        }

        _fillPool() {
            var deferred = this.$q.defer();
            this.pool.push({ promise: deferred.promise, window: new fin.desktop.Window(createConfig(), () => { deferred.resolve(); }) });
        }

        fetch() {
            var pooledWindow = this.pool.shift();
            this._fillPool();

            return pooledWindow;
        }
    }

    class WindowTracker {
        constructor() {
            this.openWindows = {};
            this.mainWindowsCache = [];
            this.windowsOpen = 0;
        }

        add(_window) {
            this.mainWindowsCache.push(_window);
            this.windowsOpen++;
        }

        addTearout(name, _window) {
            if (!this.openWindows[name]) {
                this.openWindows[name] = [].concat(_window);
            } else {
                this.openWindows[name].push(_window);
            }
        }

        dispose(_window, closedCb) {
            var parent = this.openWindows[_window.name];
            if (parent) {
                // Close all the OpenFin tearout windows associated with the closing parent.
                for (var i = 0, max = parent.length; i < max; i++) {
                    parent[i].close();
                }
            }

            if (this.windowsOpen !== 1) {
                closedCb();
            }

            var index = this.mainWindowsCache.indexOf(_window);
            this.mainWindowsCache.slice(index, 1);

            this.windowsOpen--;

            if (this.windowsOpen === 0) {
                // This was the last open window; close the application.
                window.close();
            }
        }

        getMainWindows() {
            return this.mainWindowsCache;
        }
    }

    class WindowCreationService {
        constructor(storeService, geometryService, $q) {
            this.storeService = storeService;
            this.geometryService = geometryService;
            this.windowTracker = new WindowTracker();
            this.firstName = true;
            this.pool = null;

            this.ready(() => { this.pool = new FreeWindowPool($q); });
        }

        createMainWindow(config, successCb) {
            var windowCreatedCb = (newWindow) => {
                // TODO
                // Begin super hack
                newWindow.getNativeWindow().windowService = this;
                newWindow.getNativeWindow().storeService = this.storeService;
                // End super hack

                this.windowTracker.add(newWindow);

                if (successCb) {
                    successCb(newWindow);
                }

                newWindow.show();
            };

            var mainWindow;
            if (config.name) {
                mainWindow = new fin.desktop.Window(config, () => {
                    windowCreatedCb(mainWindow);
                });
            } else {
                var poolWindow = this.pool.fetch();
                mainWindow = poolWindow.window;
                poolWindow.promise.then(() => {
                    windowCreatedCb(mainWindow);
                });
            }

            mainWindow.addEventListener('closed', (e) => {
                this.windowTracker.dispose(mainWindow, () => {
                    this.storeService.open(mainWindow.name).closeWindow();
                });
            });
        }

        createTearoutWindow(config, parentName) {
            if (!config.name) {
                config.name = getName();
            }

            var tearoutWindow = new fin.desktop.Window(config);

            this.windowTracker.addTearout(parentName, tearoutWindow);

            return tearoutWindow;
        }

        ready(cb) {
            fin.desktop.main(cb);
        }

        getWindows() {
            return this.windowTracker.getMainWindows();
        }
    }
    WindowCreationService.$inject = ['storeService', 'geometryService', '$q'];

    angular.module('openfin.window')
        .service('windowCreationService', WindowCreationService);
}(fin));
