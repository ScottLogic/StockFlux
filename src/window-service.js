(function(fin) {
    'use strict';

    function getName() {
        // TODO: Should probably change this...
        return 'window' + Math.floor(Math.random() * 1000) + Math.ceil(Math.random() * 999);
    }

    function createConfig(name) {
        var config = {};

        config.name = name || getName();
        config.autoShow = false;
        config.frame = false;
        config.showTaskbarIcon = true;
        config.saveWindowState = true;
        config.url = 'index.html';
        config.resizable = true;
        config.maximizable = true;
        config.minWidth = 918;
        config.minHeight = 510;
        config.maxWidth = 50000;
        config.maxHeight = 50000;
        config.defaultWidth = 1280;
        config.defaultHeight = 720;

        return config;
    }

    function createTearoutConfig() {
        return {
            'name': getName(),
            'autoShow': false,
            'frame': false,
            'maximizable': false,
            'resizable': false,
            'showTaskbarIcon': false,
            'saveWindowState': false,
            'maxWidth': 230,
            'maxHeight': 100,
            'url': 'tearout.html'
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

            mainWindows.forEach(mainWindow => {
                var deferred = this.$q.defer();
                promises.push(deferred.promise);
                mainWindow.getState(state => {
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
        constructor(storeService, geometryService, $q) {
            this.storeService = storeService;
            this.geometryService = geometryService;
            this.$q = $q;
            this.windowTracker = new WindowTracker();
            this.firstName = true;
            this.pool = null;

            this.ready(() => { this.pool = new FreeWindowPool($q); });
        }

        createMainWindow(name, successCb) {
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
                mainWindow = new fin.desktop.Window(createConfig(name), () => {
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

        createTearoutWindow(parentName) {
            var tearoutWindow = new fin.desktop.Window(createTearoutConfig());

            this.windowTracker.addTearout(parentName, tearoutWindow);

            return tearoutWindow;
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
    WindowCreationService.$inject = ['storeService', 'geometryService', '$q'];

    angular.module('openfin.window')
        .service('windowCreationService', WindowCreationService);
}(fin));
