'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    'use strict';

    angular.module('StockFluxParent', ['stockflux.parent']);

    angular.module('stockflux.parent', ['stockflux.store', 'stockflux.window']);
    angular.module('stockflux.store', ['stockflux.version']);
    angular.module('stockflux.version', []);
    angular.module('stockflux.currentWindow', []);
    angular.module('stockflux.window', ['stockflux.store', 'stockflux.geometry', 'stockflux.config']);
    angular.module('stockflux.config', []);
})();

(function () {
    'use strict';

    /**
     * Responsible for starting the application, and sending events to the child windows.
     */

    var ParentCtrl = function ParentCtrl($scope, storeService, windowCreationService) {
        _classCallCheck(this, ParentCtrl);

        if (storeService.shouldUpgrade()) {
            storeService.upgrade();
            // .. Can put other upgrade code here ..
            storeService.saveVersion();
        }

        windowCreationService.ready(function () {
            var previousWindows = storeService.getPreviousOpenWindowNames(),
                length = previousWindows.length,
                i,
                max;

            if (length !== 0) {
                // Restoring previously open windows
                for (i = 0; i < length; i++) {
                    var name = previousWindows[i];
                    windowCreationService.createMainWindow(name, storeService.open(name).isCompact());
                }
            } else {
                // Creating new window
                windowCreationService.createMainWindow();
            }

            $scope.$on('updateFavourites', function (event, stock, windowName) {
                var e = new Event('updateFavourites');
                e.stock = stock;
                var openWindow = windowCreationService.getWindow(windowName);
                openWindow.getNativeWindow().dispatchEvent(e);
            });
        });
    };

    ParentCtrl.$inject = ['$scope', 'storeService', 'windowCreationService'];

    angular.module('stockflux.parent').controller('ParentCtrl', ParentCtrl);
})();

(function () {
    'use strict';

    var WINDOW_KEY = 'windows',
        VERSION_KEY = 'version',
        defaultStocks = ['AAPL', 'MSFT', 'TITN', 'SNDK', 'TSLA'],
        defaultIndicators = ['rsi', 'movingAverage'],
        closedCacheSize = 5;

    var storage;

    /**
     * Class for editing the contents of local storage.
     */

    var StoreWrapper = function () {
        function StoreWrapper($rootScope, store, windowName) {
            _classCallCheck(this, StoreWrapper);

            this.$rootScope = $rootScope;
            this.store = store;
            this.windowName = windowName;
        }

        _createClass(StoreWrapper, [{
            key: 'save',
            value: function save() {
                localStorage.setItem(WINDOW_KEY, angular.toJson(storage));
            }
        }, {
            key: 'update',
            value: function update(stock) {
                this.save();
                this.$rootScope.$broadcast('updateFavourites', stock, this.windowName);
            }
        }, {
            key: 'get',
            value: function get() {
                return this.store.stocks;
            }
        }, {
            key: 'indicators',
            value: function indicators(newIndicators) {
                if (!arguments.length) {
                    return this.store.indicators;
                }
                this.store.indicators = newIndicators;
                this.save();
            }

            // Move given item in an array to directly after the to-item

        }, {
            key: 'reorder',
            value: function reorder(fromItem, toItem) {
                if (fromItem === toItem) {
                    return;
                }

                var oldArray = this.store.stocks;
                var fromIndex = oldArray.indexOf(fromItem);
                var toIndex = oldArray.indexOf(toItem);
                oldArray.splice(toIndex, 0, oldArray.splice(fromIndex, 1)[0]);

                this.update();
            }
        }, {
            key: 'add',
            value: function add(stock) {
                var stockName = stock.code;

                if (this.store.stocks.indexOf(stockName) === -1) {
                    this.store.stocks.push(stockName);
                    this.update(stock);
                }
            }
        }, {
            key: 'remove',
            value: function remove(stock) {
                var stockName = stock.code;
                var index = this.store.stocks.indexOf(stockName);
                if (index > -1) {
                    this.store.stocks.splice(index, 1);
                }

                this.update(stock);
            }
        }, {
            key: 'toggleCompact',
            value: function toggleCompact(isCompact) {
                this.store.compact = arguments.length ? isCompact : !this.store.compact;

                this.save();
            }
        }, {
            key: 'isCompact',
            value: function isCompact() {
                return this.store.compact;
            }
        }, {
            key: 'openWindow',
            value: function openWindow() {
                this.store.closed = 0;
                this.save();
                this.$rootScope.$broadcast('openWindow');
            }
        }, {
            key: 'closeWindow',
            value: function closeWindow() {
                this.store.closed = Date.now();
                this.save();

                if (this.store.stocks.length > 0) {
                    this.$rootScope.$broadcast('closeWindow');
                }

                var restorableWindows = [],
                    cleanableWindows = [];

                storage.filter(function (store) {
                    return store.closed !== 0;
                }).forEach(function (store) {
                    if (store.stocks.length > 0) {
                        restorableWindows.push(store);
                    } else {
                        cleanableWindows.push(store);
                    }
                });

                // Trim any stores without stocks
                cleanableWindows.forEach(function (cleanableWindow) {
                    var index = storage.indexOf(cleanableWindow);
                    storage.splice(index, 1);
                });

                // Trim the oldest closed store
                if (restorableWindows.length > closedCacheSize) {
                    restorableWindows.sort(function (a, b) {
                        return b.closed - a.closed;
                    });

                    for (var i = closedCacheSize, max = restorableWindows.length; i < max; i++) {
                        var storageIndex = storage.indexOf(restorableWindows[i]);
                        storage.splice(storageIndex, 1);
                    }
                }

                this.save();
            }
        }]);

        return StoreWrapper;
    }();

    /**
     * Class for querying and managing the local storage.
     */


    var StoreService = function () {
        function StoreService($rootScope, version) {
            _classCallCheck(this, StoreService);

            this.$rootScope = $rootScope;
            this.version = version;

            storage = JSON.parse(localStorage.getItem(WINDOW_KEY));
        }

        _createClass(StoreService, [{
            key: 'shouldUpgrade',
            value: function shouldUpgrade() {
                if (localStorage.getItem(VERSION_KEY) == null) {
                    return true;
                }
                var parseVersion = function parseVersion(version) {
                    return version.split('.').map(function (v) {
                        return Number(v);
                    });
                };
                var thisVersion = parseVersion(this.version);
                var storedVersion = parseVersion(localStorage.getItem(VERSION_KEY));

                return thisVersion[0] !== storedVersion[0];
            }
        }, {
            key: 'upgrade',
            value: function upgrade() {
                localStorage.removeItem(WINDOW_KEY);
                storage = null;
            }
        }, {
            key: 'saveVersion',
            value: function saveVersion() {
                localStorage.setItem(VERSION_KEY, this.version);
            }
        }, {
            key: 'getPreviousOpenWindowNames',
            value: function getPreviousOpenWindowNames() {
                return (storage || []).filter(function (store) {
                    return store.closed === 0;
                }).map(function (store) {
                    return store.id;
                });
            }
        }, {
            key: 'getPreviousClosedWindows',
            value: function getPreviousClosedWindows() {
                return (storage || []).filter(function (store) {
                    return store.closed > 0;
                });
            }
        }, {
            key: 'open',
            value: function open(windowName) {
                var windowIndex = (storage || []).map(function (window) {
                    return window.id;
                }).indexOf(windowName),
                    store;

                if (windowIndex > -1) {
                    store = storage[windowIndex];
                } else {
                    var stocks = [];
                    // Shallow copy the default indicators
                    var indicators = defaultIndicators.slice();
                    if (!storage) {
                        stocks = defaultStocks;
                        storage = [];
                    }

                    var newStore = {
                        id: windowName,
                        stocks: stocks,
                        indicators: indicators,
                        closed: 0,
                        compact: false
                    };

                    storage.push(newStore);

                    store = newStore;
                }

                return new StoreWrapper(this.$rootScope, store, windowName);
            }
        }]);

        return StoreService;
    }();

    StoreService.$inject = ['$rootScope', 'Version'];

    angular.module('stockflux.store').service('storeService', StoreService);
})();

(function (fin) {
    'use strict';

    var poolSize = 3;

    /**
     * Manages a pool of OpenFin windows. The pool is used for performance improvements,
     * as there is an overhead to creating new windows.
     * When a window is taken from the pool a new one is created and added.
     */

    var FreeWindowPool = function () {
        function FreeWindowPool($q, configService) {
            _classCallCheck(this, FreeWindowPool);

            this.pool = [];
            this.$q = $q;
            this.configService = configService;

            for (var i = 0; i < poolSize; i++) {
                this._fillPool();
            }
        }

        _createClass(FreeWindowPool, [{
            key: '_fillPool',
            value: function _fillPool() {
                var deferred = this.$q.defer();
                this.pool.push({ promise: deferred.promise, window: new fin.desktop.Window(this.configService.getWindowConfig(), function () {
                        deferred.resolve();
                    })
                });
            }
        }, {
            key: 'fetch',
            value: function fetch() {
                var pooledWindow = this.pool.shift();
                this._fillPool();

                return pooledWindow;
            }
        }]);

        return FreeWindowPool;
    }();

    /**
     * Keeps an internal count and cache of the number of main application windows open.
     * The count is used to know when the last window has been closed, to close the application.
     */


    var WindowTracker = function () {
        function WindowTracker() {
            _classCallCheck(this, WindowTracker);

            this.openWindows = {};
            this.mainWindowsCache = [];
            this.windowsOpen = 0;
        }

        _createClass(WindowTracker, [{
            key: 'add',
            value: function add(_window) {
                this.mainWindowsCache.unshift(_window);
                this.addWindowStateWatchers(_window);
                this.windowsOpen++;
            }
        }, {
            key: 'addWindowStateWatchers',
            value: function addWindowStateWatchers(_window) {
                var focusEvent = this.onFocus(_window);
                var minimiseEvent = this.onMinimise(_window);
                _window.addEventListener('focused', focusEvent);
                _window.addEventListener('minimized', minimiseEvent);

                _window.addEventListener('closed', function () {
                    _window.removeEventListener('focused', focusEvent);
                    _window.removeEventListener('minimized', minimiseEvent);
                });
            }
        }, {
            key: 'spliceFromCache',
            value: function spliceFromCache(_window) {
                var indices = this.mainWindowsCache.map(function (win) {
                    return win.name === _window.name;
                });
                var indexOfWindow = indices.indexOf(true);
                if (indexOfWindow > -1) {
                    this.mainWindowsCache.splice(indexOfWindow, 1);
                }
            }
        }, {
            key: 'onFocus',
            value: function onFocus(_window) {
                var _this = this;

                return function () {
                    _this.spliceFromCache(_window);
                    _this.mainWindowsCache.unshift(_window);
                };
            }
        }, {
            key: 'onMinimise',
            value: function onMinimise(_window) {
                var _this2 = this;

                return function () {
                    _this2.spliceFromCache(_window);
                    _this2.mainWindowsCache.push(_window);
                };
            }
        }, {
            key: 'addTearout',
            value: function addTearout(name, _window) {
                if (!this.openWindows[name]) {
                    this.openWindows[name] = [].concat(_window);
                } else {
                    this.openWindows[name].push(_window);
                }
            }
        }, {
            key: 'dispose',
            value: function dispose(_window, closedCb) {
                var parent = this.openWindows[_window.name];
                if (parent) {
                    // Close all the OpenFin tearout windows associated with the closing parent.
                    parent.forEach(function (child) {
                        return child.close();
                    });
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
        }, {
            key: 'getMainWindows',
            value: function getMainWindows() {
                return this.mainWindowsCache;
            }
        }]);

        return WindowTracker;
    }();

    /**
     * Class to determine whether a stored tearout window is overlapping
     * a different main window, and allow moving stocks between windows.
     */


    var DragService = function () {
        function DragService(storeService, geometryService, windowTracker, tearoutWindow, $q, openFinWindow) {
            _classCallCheck(this, DragService);

            this.storeService = storeService;
            this.geometryService = geometryService;
            this.windowTracker = windowTracker;
            this.tearoutWindow = tearoutWindow;
            this.$q = $q;
            this.openFinWindow = openFinWindow;
            this.otherInstance = null;
        }

        _createClass(DragService, [{
            key: 'overThisInstance',
            value: function overThisInstance(selector) {
                var nativeWindow = this.openFinWindow.getNativeWindow();
                var element = nativeWindow.document.querySelector(selector || 'body');
                var over = this.geometryService.elementIntersect(this.tearoutWindow, nativeWindow, element);

                if (over) {
                    this.clearOtherInstance();
                }
                return over;
            }
        }, {
            key: 'updateIntersections',
            value: function updateIntersections(selector, cb) {
                var _this3 = this;

                var mainWindows = this.windowTracker.getMainWindows(),
                    result = false,
                    promises = [];

                var filteredWindows = mainWindows.filter(function (mw) {
                    return mw.name !== _this3.openFinWindow.name;
                });
                filteredWindows.forEach(function (mainWindow) {
                    var deferred = _this3.$q.defer();
                    promises.push(deferred.promise);
                    mainWindow.getState(function (state) {
                        var nativeWindow = mainWindow.getNativeWindow();
                        var element = nativeWindow.document.querySelector(selector || 'body');

                        if (!result && state !== 'minimized' && _this3.geometryService.elementIntersect(_this3.tearoutWindow, nativeWindow, element)) {
                            _this3.setOtherInstance(mainWindow);
                            result = true;
                        }

                        deferred.resolve();
                    });
                });

                this.$q.all(promises).then(function () {
                    if (cb) {
                        cb();
                    }

                    if (!result) {
                        _this3.clearOtherInstance();
                    }
                });
            }
        }, {
            key: 'overAnotherInstance',
            value: function overAnotherInstance(selector, cb) {
                var _this4 = this;

                this.updateIntersections(selector, function () {
                    if (cb) {
                        cb(_this4.otherInstance !== null);
                    }
                });
            }
        }, {
            key: 'setOtherInstance',
            value: function setOtherInstance(newInstance) {
                if (this.otherInstance !== newInstance) {
                    this.messageOtherInstance('dragout');
                    this.otherInstance = newInstance;
                    this.messageOtherInstance('dragin');
                }
            }
        }, {
            key: 'clearOtherInstance',
            value: function clearOtherInstance() {
                this.setOtherInstance(null);
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.clearOtherInstance();
            }
        }, {
            key: 'messageOtherInstance',
            value: function messageOtherInstance(message) {
                if (this.otherInstance) {
                    var event = new Event(message);
                    this.otherInstance.getNativeWindow().dispatchEvent(event);
                }
            }
        }, {
            key: 'moveToOtherInstance',
            value: function moveToOtherInstance(stock) {
                this.storeService.open(this.otherInstance.name).add(stock);
                this.otherInstance.bringToFront();
            }
        }]);

        return DragService;
    }();

    /**
     * Class that creates and governs OpenFin windows.
     */


    var WindowCreationService = function () {
        function WindowCreationService($rootScope, storeService, geometryService, $q, configService, $timeout) {
            var _this5 = this;

            _classCallCheck(this, WindowCreationService);

            this.$rootScope = $rootScope;
            this.storeService = storeService;
            this.geometryService = geometryService;
            this.$q = $q;
            this.configService = configService;
            this.windowTracker = new WindowTracker();
            this.firstName = true;
            this.pool = null;
            this.closedWindowsListeners = [];
            this.closedWindowSeen = true;
            this.$timeout = $timeout;

            $rootScope.$on('openWindow', function () {
                return _this5.notifyClosedWindowListeners();
            });
            $rootScope.$on('closeWindow', function () {
                _this5.closedWindowSeen = false;
                _this5.notifyClosedWindowListeners();
            });

            this.ready(function () {
                _this5.pool = new FreeWindowPool($q, configService);
            });
        }

        _createClass(WindowCreationService, [{
            key: 'createMainWindow',
            value: function createMainWindow(name, isCompact, successCb) {
                var _this6 = this;

                var windowCreatedCb = function windowCreatedCb(newWindow) {
                    newWindow.getNativeWindow().windowService = _this6;
                    newWindow.getNativeWindow().storeService = _this6.storeService;

                    _this6.windowTracker.add(newWindow);

                    var showFunction = function showFunction() {
                        _this6.$timeout(function () {
                            newWindow.show();
                            newWindow.bringToFront();
                        });
                    };

                    if (successCb) {
                        //Showing of the window happens after the callback is executed.
                        successCb(newWindow, showFunction);
                    } else {
                        showFunction();
                    }

                    _this6.snapToScreenBounds(newWindow);
                };

                var mainWindow;
                if (name) {
                    // Notify the store service that the window has opened.
                    this.storeService.open(name).openWindow();

                    mainWindow = new fin.desktop.Window(this.configService.getWindowConfig(name), function () {
                        if (isCompact) {
                            var compactSize = _this6.configService.getCompactWindowDimensions();
                            _this6.updateOptions(mainWindow, true);
                            mainWindow.resizeTo(compactSize[0], compactSize[1], 'top-left');
                        }
                        windowCreatedCb(mainWindow);
                    });
                } else {
                    var poolWindow = this.pool.fetch();
                    mainWindow = poolWindow.window;
                    if (isCompact) {
                        var compactWindowDimensions = this.configService.getCompactWindowDimensions();
                        this.updateOptions(poolWindow.window, true);
                        poolWindow.window.resizeTo(compactWindowDimensions[0], compactWindowDimensions[1], 'top-right');
                    }

                    poolWindow.promise.then(function () {
                        windowCreatedCb(mainWindow);
                    });
                }

                var closedEvent = function closedEvent(e) {
                    _this6.windowTracker.dispose(mainWindow, function () {
                        _this6.storeService.open(mainWindow.name).closeWindow();
                        mainWindow.removeEventListener('closed', closedEvent);
                    });
                };

                mainWindow.addEventListener('closed', closedEvent);
            }
        }, {
            key: 'addClosedWindowListener',
            value: function addClosedWindowListener(listener) {
                this.closedWindowsListeners.push(listener);
            }
        }, {
            key: 'removeClosedWindowListener',
            value: function removeClosedWindowListener(listener) {
                this.closedWindowsListeners.splice(this.closedWindowsListeners.indexOf(listener), 1);
            }
        }, {
            key: 'notifyClosedWindowListeners',
            value: function notifyClosedWindowListeners() {
                this.closedWindowsListeners.forEach(function (listener) {
                    return listener();
                });
            }
        }, {
            key: 'getClosedWindowSeen',
            value: function getClosedWindowSeen() {
                return this.closedWindowSeen;
            }
        }, {
            key: 'seenClosedWindows',
            value: function seenClosedWindows() {
                this.closedWindowSeen = true;
                this.notifyClosedWindowListeners();
            }
        }, {
            key: 'getTargetMonitor',
            value: function getTargetMonitor(x, y, callback) {
                fin.desktop.System.getMonitorInfo(function (info) {
                    var monitors = info.nonPrimaryMonitors.concat(info.primaryMonitor);
                    var closestMonitor = monitors[0];
                    var closestDistance = Number.MAX_VALUE;

                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = monitors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var monitor = _step.value;


                            var monitorRect = monitor.monitorRect;

                            // If the window's top-left is within the monitor's bounds, use that + stop
                            if (x >= monitorRect.left && x <= monitorRect.right && y >= monitorRect.top && y <= monitorRect.bottom) {

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
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    callback(closestMonitor);
                });
            }
        }, {
            key: 'snapToScreenBounds',
            value: function snapToScreenBounds(targetWindow) {
                var _this7 = this;

                targetWindow.getBounds(function (bounds) {
                    _this7.getTargetMonitor(bounds.left, bounds.top, function (monitor) {

                        var availableRect = monitor.availableRect;

                        if (bounds.top < availableRect.top) {
                            bounds.top = availableRect.top;
                        }

                        targetWindow.setBounds(bounds.left, bounds.top, bounds.width, bounds.height);
                    });
                });
            }
        }, {
            key: 'createTearoutWindow',
            value: function createTearoutWindow(parentName) {
                var tearoutWindow = new fin.desktop.Window(this.configService.getTearoutConfig());

                this.windowTracker.addTearout(parentName, tearoutWindow);

                return tearoutWindow;
            }
        }, {
            key: 'updateOptions',
            value: function updateOptions(_window, isCompact) {
                if (isCompact) {
                    var compactWindowDimensions = this.configService.getCompactWindowDimensions();
                    _window.updateOptions({
                        resizable: false,
                        minWidth: compactWindowDimensions[0],
                        minHeight: compactWindowDimensions[1],
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
        }, {
            key: 'ready',
            value: function ready(cb) {
                fin.desktop.main(cb);
            }
        }, {
            key: 'getMainWindows',
            value: function getMainWindows() {
                return this.windowTracker.getMainWindows();
            }
        }, {
            key: 'getWindow',
            value: function getWindow(name) {
                return this.getMainWindows().filter(function (w) {
                    return w.name === name;
                })[0];
            }
        }, {
            key: 'registerDrag',
            value: function registerDrag(tearoutWindow, openFinWindow) {
                return new DragService(this.storeService, this.geometryService, this.windowTracker, tearoutWindow, this.$q, openFinWindow);
            }
        }]);

        return WindowCreationService;
    }();

    WindowCreationService.$inject = ['$rootScope', 'storeService', 'geometryService', '$q', 'configService', '$timeout'];

    angular.module('stockflux.window').service('windowCreationService', WindowCreationService);
})(fin);

(function () {
    'use strict';

    var Point = function Point(x, y) {
        _classCallCheck(this, Point);

        this.x = x || 0;
        this.y = y || 0;
    };

    var Rectangle = function () {
        function Rectangle(rect) {
            _classCallCheck(this, Rectangle);

            this.origin = new Point(rect.left, rect.top);
            this.extent = new Point(rect.width, rect.height);
        }

        _createClass(Rectangle, [{
            key: 'top',
            value: function top() {
                return this.origin.y;
            }
        }, {
            key: 'left',
            value: function left() {
                return this.origin.x;
            }
        }, {
            key: 'bottom',
            value: function bottom() {
                return this.top() + this.extent.y;
            }
        }, {
            key: 'right',
            value: function right() {
                return this.left() + this.extent.x;
            }
        }, {
            key: 'corner',
            value: function corner() {
                return new Point(this.right(), this.bottom());
            }
        }, {
            key: 'intersects',
            value: function intersects(otherRectangle) {
                //return true if we overlap, false otherwise

                var otherOrigin = otherRectangle.origin,
                    otherCorner = otherRectangle.corner();

                return otherCorner.x > this.origin.x && otherCorner.y > this.origin.y && otherOrigin.x < this.corner().x && otherOrigin.y < this.corner().y;
            }
        }, {
            key: 'areaOfIntersection',
            value: function areaOfIntersection(otherRectangle) {
                if (this.intersects(otherRectangle)) {
                    var left = Math.max(this.left(), otherRectangle.left());
                    var right = Math.min(this.right(), otherRectangle.right());
                    var top = Math.max(this.top(), otherRectangle.top());
                    var bottom = Math.min(this.bottom(), otherRectangle.bottom());
                    return (right - left) * (bottom - top);
                } else {
                    return 0;
                }
            }
        }]);

        return Rectangle;
    }();

    // Helper function to retrieve the height, width, top, and left from a window object


    function getWindowPosition(windowElement) {
        return {
            height: windowElement.outerHeight,
            width: windowElement.outerWidth,
            top: windowElement.screenY,
            left: windowElement.screenX
        };
    }

    // Calculate the screen position of an element
    function elementScreenPosition(windowElement, element) {
        var relativeElementPosition = element.getBoundingClientRect();

        return {
            height: relativeElementPosition.height,
            width: relativeElementPosition.width,
            top: windowElement.top + relativeElementPosition.top,
            left: windowElement.left + relativeElementPosition.left
        };
    }

    function rectangles(bounds1, bounds2) {
        return [new Rectangle(bounds1), new Rectangle(bounds2)];
    }

    var GeometryService = function () {
        function GeometryService() {
            _classCallCheck(this, GeometryService);
        }

        _createClass(GeometryService, [{
            key: 'elementIntersect',
            value: function elementIntersect(openFinWindow, _window, element) {
                var nativeWindow = openFinWindow.getNativeWindow();
                var rects = rectangles(getWindowPosition(nativeWindow), elementScreenPosition(getWindowPosition(_window), element));

                return rects[0].intersects(rects[1]);
            }
        }, {
            key: 'elementIntersectArea',
            value: function elementIntersectArea(openFinWindow, _window, element) {
                var nativeWindow = openFinWindow.getNativeWindow();
                var rects = rectangles(getWindowPosition(nativeWindow), elementScreenPosition(getWindowPosition(_window), element));

                return rects[0].areaOfIntersection(rects[1]);
            }
        }]);

        return GeometryService;
    }();

    angular.module('stockflux.geometry', []).service('geometryService', GeometryService);
})();

(function () {

    var RESIZE_NO_LIMIT = 50000,
        BITFLUX_STOCK_AMOUNT = 1200,
        BITFLUX_INITIAL_PROPORTION = 16 * 7 / BITFLUX_STOCK_AMOUNT,
        // ~4 months
    CLOSED_SIDEBAR_WIDTH = 50,
        SIDETAB_TOP_HEIGHT = 50,
        TEAROUT_WINDOW_OFFSET = [CLOSED_SIDEBAR_WIDTH, SIDETAB_TOP_HEIGHT],
        TEAROUT_WINDOW_OFFSET_COMPACT = [0, 34],
        TEAROUT_CARD_WIDTH = 230,
        TEAROUT_CARD_DIMENSIONS = [TEAROUT_CARD_WIDTH, 110],
        COMPACT_WINDOW_DIMENSIONS = [TEAROUT_CARD_WIDTH, 500],
        DEFAULT_WINDOW_DIMENSIONS = [1280, 720];

    // Be very careful changing the line below. It is replaced with a string.replace in the grunt build
    // to disable the right click menu in release.
    var allowContextMenu = false;

    /**
     * Stores common configuration for the application.
     */

    var ConfigService = function () {
        function ConfigService() {
            _classCallCheck(this, ConfigService);
        }

        _createClass(ConfigService, [{
            key: 'createName',
            value: function createName() {
                return 'window' + Math.floor(Math.random() * 1000) + Math.ceil(Math.random() * 999);
            }
        }, {
            key: '_getConfig',
            value: function _getConfig(name, overrides) {
                var sharedConfig = {
                    name: name || this.createName(),
                    contextMenu: allowContextMenu,
                    autoShow: false,
                    frame: false,
                    shadow: false,
                    resizeRegion: {
                        size: 7,
                        topLeftCorner: 14,
                        topRightCorner: 14,
                        bottomRightCorner: 14,
                        bottomLeftCorner: 14
                    }
                };

                Object.keys(sharedConfig).forEach(function (key) {
                    if (overrides[key] === undefined) {
                        overrides[key] = sharedConfig[key];
                    }
                });

                return overrides;
            }
        }, {
            key: 'getWindowConfig',
            value: function getWindowConfig(name) {
                return this._getConfig(name, {
                    showTaskbarIcon: true,
                    saveWindowState: true,
                    url: 'index.html',
                    resizable: true,
                    maximizable: true,
                    minWidth: 918,
                    minHeight: 510,
                    maxWidth: RESIZE_NO_LIMIT,
                    maxHeight: RESIZE_NO_LIMIT,
                    defaultWidth: DEFAULT_WINDOW_DIMENSIONS[0],
                    defaultHeight: DEFAULT_WINDOW_DIMENSIONS[1]
                });
            }
        }, {
            key: 'getTearoutConfig',
            value: function getTearoutConfig(name) {
                return this._getConfig(name, {
                    maximizable: false,
                    resizable: false,
                    showTaskbarIcon: false,
                    saveWindowState: false,
                    maxWidth: TEAROUT_CARD_DIMENSIONS[0],
                    maxHeight: TEAROUT_CARD_DIMENSIONS[1],
                    url: 'tearout.html'
                });
            }
        }, {
            key: 'getTearoutCardDimensions',
            value: function getTearoutCardDimensions() {
                return TEAROUT_CARD_DIMENSIONS;
            }
        }, {
            key: 'getCompactWindowDimensions',
            value: function getCompactWindowDimensions() {
                return COMPACT_WINDOW_DIMENSIONS;
            }
        }, {
            key: 'getDefaultWindowDimensions',
            value: function getDefaultWindowDimensions() {
                return DEFAULT_WINDOW_DIMENSIONS;
            }
        }, {
            key: 'getTopCardOffset',
            value: function getTopCardOffset(compact) {
                return compact ? TEAROUT_WINDOW_OFFSET_COMPACT : TEAROUT_WINDOW_OFFSET;
            }
        }, {
            key: 'getInitialBitfluxProportion',
            value: function getInitialBitfluxProportion() {
                return BITFLUX_INITIAL_PROPORTION;
            }
        }, {
            key: 'getBitfluxStockAmount',
            value: function getBitfluxStockAmount() {
                return BITFLUX_STOCK_AMOUNT;
            }
        }]);

        return ConfigService;
    }();

    ConfigService.$inject = [];

    angular.module('stockflux.config').service('configService', ConfigService);
})();

(function () {
    'use strict';

    var VERSION = { version: '10.1.0-rc.0' };

    angular.module('stockflux.version').value('Version', VERSION.version);
})();
