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

            delete this.openWindows[_window.name];
            var index = this.mainWindowsCache.indexOf(_window);
            this.mainWindowsCache.splice(index, 1);

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

        overThisInstance(selector) {
            var nativeWindow = this.openFinWindow.getNativeWindow();
            var element = nativeWindow.document.querySelector(selector || 'body');
            var over = this.geometryService.elementIntersect(this.tearoutWindow, nativeWindow, element);

            if (over) {
                this.clearOtherInstance();
            }
            return over;
        }

        overAnotherInstance(selector, cb) {
            var mainWindows = this.windowTracker.getMainWindows(),
                result = false,
                promises = [];

            var filteredWindows = mainWindows.filter((mw) => mw.name !== this.openFinWindow.name);
            filteredWindows.forEach((mainWindow) => {
                var deferred = this.$q.defer();
                promises.push(deferred.promise);
                mainWindow.getState((state) => {
                    var nativeWindow = mainWindow.getNativeWindow();
                    var element = nativeWindow.document.querySelector(selector || 'body');

                    if (!result && state !== 'minimized' && this.geometryService.elementIntersect(this.tearoutWindow, nativeWindow, element)) {
                        this.setOtherInstance(mainWindow);
                        result = true;
                    }

                    deferred.resolve();
                });
            });

            this.$q.all(promises).then(() => {
                if (cb) {
                    cb(result);
                }

                if (!result) {
                    this.clearOtherInstance();
                }
            });
        }

        setOtherInstance(newInstance) {
            if (this.otherInstance !== newInstance) {
                this.messageOtherInstance('dragout');
                this.otherInstance = newInstance;
                this.messageOtherInstance('dragin');
            }
        }

        clearOtherInstance() {
            this.setOtherInstance(null);
        }

        destroy() {
            this.clearOtherInstance();
        }

        messageOtherInstance(message) {
            if (this.otherInstance) {
                var event = new Event(message);
                this.otherInstance.getNativeWindow().dispatchEvent(event);
            }
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
        constructor($rootScope, storeService, geometryService, $q, configService) {
            this.storeService = storeService;
            this.geometryService = geometryService;
            this.$q = $q;
            this.configService = configService;
            this.windowTracker = new WindowTracker();
            this.firstName = true;
            this.pool = null;
            this.closedWindowsListeners = [];

            $rootScope.$on('closedWindowChange', () => this.notifyClosedWindowListeners());

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

        addClosedWindowListener(listener) {
            this.closedWindowsListeners.push(listener);
        }

        removeClosedWindowListener(listener) {
            this.closedWindowsListeners.splice(this.closedWindowsListeners.indexOf(listener), 1);
        }

        notifyClosedWindowListeners() {
            this.closedWindowsListeners.forEach((listener) => listener());
        }

        getTargetMonitor(x, y, callback) {
            fin.desktop.System.getMonitorInfo((info) => {
                var monitors = info.nonPrimaryMonitors.concat(info.primaryMonitor);
                let closestMonitor = monitors[0];
                let closestDistance = Number.MAX_VALUE;

                for (var monitor of monitors) {

                    let monitorRect = monitor.monitorRect;

                    // If the window's top-left is within the monitor's bounds, use that + stop
                    if (x >= monitorRect.left && x <= monitorRect.right &&
                            y >= monitorRect.top && y <= monitorRect.bottom) {

                        callback(monitor);
                        return;

                    } else {

                        // Otherwise, keep track of the closest, and if the window is not
                        // within any monitor bounds, use the closest.
                        var midX = monitorRect.left + monitorRect.right / 2;
                        var midY = monitorRect.top + monitorRect.bottom / 2;
                        var distance = Math.pow(midX - x, 2) + Math.pow(midY - y, 2);
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestMonitor = monitor;
                        }

                    }
                }
                callback(closestMonitor);
            });
        }

        snapToScreenBounds(targetWindow) {
            targetWindow.getBounds((bounds) => {
                this.getTargetMonitor(bounds.left, bounds.top, (monitor) => {

                    let availableRect = monitor.availableRect;

                    if (bounds.top < availableRect.top) {
                        bounds.top = availableRect.top;
                    } else if (bounds.top + bounds.height > availableRect.bottom) {
                        bounds.top = availableRect.bottom - bounds.height;
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
    WindowCreationService.$inject = ['$rootScope', 'storeService', 'geometryService', '$q', 'configService'];

    angular.module('stockflux.window')
        .service('windowCreationService', WindowCreationService);
}(fin));
