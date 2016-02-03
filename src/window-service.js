(function(fin) {
    'use strict';

    angular.module('openfin.window', [])
        .factory('windowCreationService', [function() {
            var openWindows = {};

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

            function createTearoutWindow(config, parentName) {
                var tearoutWindow = createWindow(config);

                if (!openWindows[parentName]) {
                    openWindows[parentName] = [].concat(tearoutWindow);
                } else {
                    openWindows[parentName].push(tearoutWindow);
                }

                return tearoutWindow;
            }

            function createWindow(config, successCb) {
                var newWindow = new fin.desktop.Window(config, function() {
                    if (successCb) {
                        successCb();
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
                });

                return newWindow;
            }

            function ready(cb) {
                fin.desktop.main(cb);
            }

            return {
                createWindow: createWindow,
                createTearoutWindow: createTearoutWindow,
                ready: ready
            };
        }]);
}(fin));
