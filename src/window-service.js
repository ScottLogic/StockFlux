(function(fin) {
    'use strict';

    angular.module('openfin.window')
        .factory('windowCreationService', ['storeService', function(storeService) {
            var self = this;
            var openWindows = {},
                windowsCache = [],
                firstName = true;

            function appManager() {
                var windowsOpen = 0;

                function increment() {
                    windowsOpen++;
                }

                function decrement() {
                    windowsOpen--;

                    if (windowsOpen === 0) {
                        window.close();
                    }
                }

                return {
                    increment: increment,
                    decrement: decrement
                };
            }

            var apps = appManager();

            function getName() {
                if (firstName) {
                    firstName = false;
                    return 'main';
                }

                return 'window' + Math.floor(Math.random() * 1000) + Math.ceil(Math.random() * 999);
            }

            self.createWindow = function(config, successCb) {
                config.name = getName();
                var newWindow = new fin.desktop.Window(config, function() {
                    windowsCache.push(newWindow);

                    // TODO
                    // Begin super hack
                    newWindow.getNativeWindow().windowService = self;
                    newWindow.getNativeWindow().storeService = storeService;
                    // End super hack

                    if (successCb) {
                        successCb(newWindow);
                    }
                });

                apps.increment();

                newWindow.addEventListener('closed', function(e) {
                    var parent = openWindows[newWindow.name];
                    if (parent) {
                        for (var i = 0, max = parent.length; i < max; i++) {
                            parent[i].close();
                        }
                    }

                    apps.decrement();

                    var index = windowsCache.indexOf(newWindow);
                    windowsCache.slice(index, 1);

                    // TODO: Need to set window's closed state to true in the store.
                });

                return newWindow;
            };

            self.createTearoutWindow = function(config, parentName) {
                var tearoutWindow = self.createWindow(config);

                if (!openWindows[parentName]) {
                    openWindows[parentName] = [].concat(tearoutWindow);
                } else {
                    openWindows[parentName].push(tearoutWindow);
                }

                return tearoutWindow;
            };

            function ready(cb) {
                fin.desktop.main(cb);
            }

            function getWindows() {
                return windowsCache;
            }

            return {
                createWindow: self.createWindow,
                createTearoutWindow: self.createTearoutWindow,
                ready: ready,
                getWindows: getWindows
            };
        }]);
}(fin));
