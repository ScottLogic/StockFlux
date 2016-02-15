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
        constructor(storeService, $q) {
            this.storeService = storeService;
            this.openWindows = {};
            this.windowsCache = [];
            this.firstName = true;
            this.apps = new AppManager();
            this.pool = null;

            this.ready(() => { this.pool = new FreeWindowPool($q); });
        }

        _addWindowClosedListener(_window, closedCb) {
            _window.addEventListener('closed', (e) => {
                var parent = this.openWindows[_window.name];
                if (parent) {
                    for (var i = 0, max = parent.length; i < max; i++) {
                        parent[i].close();
                    }
                }

                var index = this.windowsCache.indexOf(_window);
                this.windowsCache.slice(index, 1);

                if (closedCb) {
                    closedCb();
                }

                this.apps.decrement();
            });
        }

        _createWindow(config, successCb, closedCb) {
            var newWindow = new fin.desktop.Window(config, () => {
                this.windowsCache.push(newWindow);

                if (successCb) {
                    successCb(newWindow);
                }
            });

            this.apps.increment();

            this._addWindowClosedListener(newWindow, closedCb);

            return newWindow;
        }

        createMainWindow(config, successCb) {
            var windowCreatedCb = (newWindow) => {
                // TODO
                // Begin super hack
                newWindow.getNativeWindow().windowService = this;
                newWindow.getNativeWindow().storeService = this.storeService;
                // End super hack

                if (successCb) {
                    successCb(newWindow);
                }

                newWindow.show();
            };

            var windowClosedCb = () => {
                if (this.apps.count() !== 1) {
                    this.storeService.open(config.name).closeWindow();
                }
            };

            if (config.name) {
                this._createWindow(config, windowCreatedCb, windowClosedCb);
            } else {
                this.ready(() => {
                    var poolWindow = this.pool.fetch();
                    this.windowsCache.push(poolWindow.window);
                    poolWindow.promise.then(() => {
                        windowCreatedCb(poolWindow.window);
                    });

                    this.apps.increment();

                    this._addWindowClosedListener(poolWindow.window, windowClosedCb);
                });
            }
        }

        createTearoutWindow(config, parentName) {
            if (!config.name) {
                config.name = getName();
            }

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
    WindowCreationService.$inject = ['storeService', '$q'];

    angular.module('openfin.window')
        .service('windowCreationService', WindowCreationService);
}(fin));
