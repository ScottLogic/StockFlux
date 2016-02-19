(function(fin) {
    'use strict';
    const poolSize = 3;

    class FreeWindowPool {
        constructor($q, configService) {
            this.pool = [];
            this.$q = $q;
            this.configService = configService;

            for (var i = 0; i < poolSize; i++) {
                this._fillPool();
            }
        }

        _fillPool() {
            var deferred = this.$q.defer();
            this.pool.push({ promise: deferred.promise, window: new fin.desktop.Window(
                    this.configService.getWindowConfig(),
                    () => { deferred.resolve(); }
                )
            });
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
                parent.forEach((child) => child.close());
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

    class DragService {
        constructor(storeService, geometryService, windowTracker, tearoutWindow, $q) {
            this.storeService = storeService;
            this.geometryService = geometryService;
            this.windowTracker = windowTracker;
            this.tearoutWindow = tearoutWindow;
            this.$q = $q;
            this.otherInstance = null;
        }

        overAnotherInstance(cb) {
            var mainWindows = this.windowTracker.getMainWindows(),
                result = false,
                promises = [];

            mainWindows.forEach((mainWindow) => {
                var deferred = this.$q.defer();
                promises.push(deferred.promise);
                mainWindow.getState((state) => {
                    if (state !== 'minimized' && this.geometryService.windowsIntersect(this.tearoutWindow, mainWindow.getNativeWindow())) {
                        this.otherInstance = mainWindow;
                        result = true;
                    }

                    deferred.resolve();
                });
            });

            this.$q.all(promises).then(() => cb(result));
        }

        moveToOtherInstance(stock) {
            this.storeService.open(this.otherInstance.name).add(stock);
            this.otherInstance.bringToFront();
        }
    }

    class WindowCreationService {
        constructor(storeService, geometryService, $q, configService) {
            this.storeService = storeService;
            this.geometryService = geometryService;
            this.$q = $q;
            this.configService = configService;
            this.windowTracker = new WindowTracker();
            this.firstName = true;
            this.pool = null;

            this.ready(() => { this.pool = new FreeWindowPool($q, configService); });
        }

        createMainWindow(name, isCompact, successCb) {
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
                newWindow.bringToFront();
            };

            var mainWindow;
            if (name) {
                var config;
                if (isCompact) {
                    config = this.configService.getCompactConfig(name);
                } else {
                    config = this.configService.getWindowConfig(name);
                }
                mainWindow = new fin.desktop.Window(config, () => {
                    windowCreatedCb(mainWindow);
                });
            } else {
                var poolWindow = this.pool.fetch();
                mainWindow = poolWindow.window;
                if (isCompact) {
                    this.updateOptions(poolWindow.window, true);
                    this.window.resizeTo(230, 500, 'top-right');
                }

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

        createTearoutWindow(parentName) {
            var tearoutWindow = new fin.desktop.Window(this.configService.getTearoutConfig());

            this.windowTracker.addTearout(parentName, tearoutWindow);

            return tearoutWindow;
        }

        updateOptions(_window, isCompact) {
            if (isCompact) {
                _window.updateOptions({
                    resizable: false,
                    minHeight: 500,
                    minWidth: 230,
                    maximizable: false
                });
            } else {
                _window.updateOptions({
                    resizable: true,
                    minHeight: 510,
                    minWidth: 918,
                    maximizable: true
                });
            }
        }

        updateOptions(_window, isCompact) {
            if (isCompact) {
                _window.updateOptions({
                    resizable: false,
                    minHeight: 500,
                    minWidth: 230,
                    maximizable: false
                });
            } else {
                _window.updateOptions({
                    resizable: true,
                    minHeight: 510,
                    minWidth: 918,
                    maximizable: true
                });
            }
        }

        ready(cb) {
            fin.desktop.main(cb);
        }

        getWindows() {
            return this.windowTracker.getMainWindows();
        }

        registerDrag(tearoutWindow) {
            return new DragService(this.storeService, this.geometryService, this.windowTracker, tearoutWindow, this.$q);
        }
    }
    WindowCreationService.$inject = ['storeService', 'geometryService', '$q', 'configService'];

    angular.module('openfin.window')
        .service('windowCreationService', WindowCreationService);
}(fin));
