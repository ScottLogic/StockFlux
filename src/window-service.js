(function(fin) {
    'use strict';
    const poolSize = 3;

    /**
     * Manages a pool of OpenFin windows. The pool is used for performance improvements,
     * as there is an overhead to creating new windows.
     * When a window is taken from the pool a new one is created and added.
     */
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

    /**
     * Keeps an internal count and cache of the number of main application windows open.
     * The count is used to know when the last window has been closed, to close the application.
     */
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

    /**
     * Class to determine whether a stored tearout window is overlapping
     * a different main window, and allow moving stocks between windows.
     */
    class DragService {
        constructor(storeService, geometryService, windowTracker, tearoutWindow, $q, openFinWindow) {
            this.storeService = storeService;
            this.geometryService = geometryService;
            this.windowTracker = windowTracker;
            this.tearoutWindow = tearoutWindow;
            this.$q = $q;
            this.openFinWindow = openFinWindow;
            this.otherInstance = null;
        }

        overAnotherInstance(cb) {
            var mainWindows = this.windowTracker.getMainWindows(),
                result = false,
                promises = [];

            var filteredWindows = mainWindows.filter((mw) => mw.name !== this.openFinWindow.name);
            filteredWindows.forEach((mainWindow) => {
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

    /**
     * Class that creates and governs OpenFin windows.
     */
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
                newWindow.getNativeWindow().windowService = this;
                newWindow.getNativeWindow().storeService = this.storeService;

                this.windowTracker.add(newWindow);

                if (successCb) {
                    successCb(newWindow);
                }

                this.storeService.open(newWindow.name).openWindow();

                newWindow.show();
                newWindow.bringToFront();
                this.snapToScreenBounds(newWindow);
            };

            var mainWindow;
            if (name) {
                mainWindow = new fin.desktop.Window(
                    isCompact ?
                        this.configService.getCompactConfig(name) :
                        this.configService.getWindowConfig(name),
                    () => {
                        windowCreatedCb(mainWindow);
                    }
                );
            } else {
                var poolWindow = this.pool.fetch();
                mainWindow = poolWindow.window;
                if (isCompact) {
                    this.updateOptions(poolWindow.window, true);
                    poolWindow.window.resizeTo(230, 500, 'top-right');
                }

                poolWindow.promise.then(() => {
                    windowCreatedCb(mainWindow);
                });
            }

            var closedEvent = (e) => {
                this.windowTracker.dispose(mainWindow, () => {
                    this.storeService.open(mainWindow.name).closeWindow();
                    mainWindow.removeEventListener('closed', closedEvent);
                });
            };

            mainWindow.addEventListener('closed', closedEvent);
        }

        snapToScreenBounds(targetWindow) {
            fin.desktop.System.getMonitorInfo((info) => {
                targetWindow.getBounds((bounds) => {

                    if (bounds.left < info.virtualScreen.left) {
                        bounds.left = info.virtualScreen.left;
                    } else if (bounds.left + bounds.width > info.virtualScreen.right) {
                        bounds.left = info.virtualScreen.right - bounds.width;
                    }

                    if (bounds.top < info.virtualScreen.top) {
                        bounds.top = info.virtualScreen.top;
                    } else if (bounds.top + bounds.height > info.virtualScreen.bottom) {
                        bounds.top = info.virtualScreen.bottom - bounds.height;
                    }

                    targetWindow.setBounds(bounds.left, bounds.top, bounds.width, bounds.height);
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

        ready(cb) {
            fin.desktop.main(cb);
        }

        getWindow(name) {
            return this.windowTracker.getMainWindows().filter((w) => w.name === name)[0];
        }

        registerDrag(tearoutWindow, openFinWindow) {
            return new DragService(
                this.storeService,
                this.geometryService,
                this.windowTracker,
                tearoutWindow,
                this.$q,
                openFinWindow);
        }
    }
    WindowCreationService.$inject = ['storeService', 'geometryService', '$q', 'configService'];

    angular.module('openfin.window')
        .service('windowCreationService', WindowCreationService);
}(fin));
