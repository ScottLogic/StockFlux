(function(window) {
    'use strict';

    angular.module('stockflux.tearout')
        .directive('tearable', ['geometryService', 'hoverService', 'currentWindowService', 'configService', '$rootScope',
            (geometryService, hoverService, currentWindowService, configService, $rootScope) => {
                return {
                    restrict: 'C',
                    link: (scope, element, attrs) => {
                        // Finding the tear element is tightly coupled to the HTML layout.
                        var dragElement = element[0],
                            tearElement = dragElement.parentNode.parentNode,
                            tileWidth = tearElement.clientWidth || 230,
                            tileHeight = tearElement.clientHeight || 100,
                            store;

                        var windowService = window.windowService;
                        var tearoutWindow = windowService.createTearoutWindow(window.name);

                        var myDropTarget = tearElement.parentNode,
                            parent = myDropTarget.parentNode,
                            myHoverArea = parent.getElementsByClassName('hover-area')[0],
                            offset = { x: 0, y: 0 },
                            currentlyDragging = false,
                            dragService;

                        hoverService.add(myHoverArea, scope.stock.code);

                        function insideFavouritesPane() {
                            // Check if you are over a drop target by seeing if the tearout rectangle intersects the drop target
                            return geometryService.elementIntersect(
                                tearoutWindow, window, document.getElementsByClassName('favourites')[0]);
                        }

                        function setOffset(x, y) {
                            offset.x = x;
                            offset.y = y;
                        }

                        function moveTearoutWindow(x, y) {
                            var tileTopPadding = 5,
                                tileRightPadding = 5,
                                tearElementWidth = 16;

                            tearoutWindow.moveTo(
                                x - tileWidth + (tearElementWidth - offset.x + tileRightPadding),
                                y - (tileTopPadding + offset.y));
                        }

                        function displayTearoutWindow() {
                            tearoutWindow.show();
                            tearoutWindow.setAsForeground();
                        }

                        function appendToOpenfinWindow(injection, openfinWindow) {
                            openfinWindow.contentWindow.document.body.appendChild(injection);
                        }

                        function returnFromTearout() {
                            myDropTarget.appendChild(tearElement);
                            tearoutWindow.hide();
                        }

                        function clearIncomingTearoutWindow() {
                            var document = tearoutWindow.getNativeWindow().document;
                            document.body = document.createElement('body');
                        }

                        function handleMouseDown(e) {
                            if (e.button !== 0) {
                                // Only process left clicks
                                return false;
                            }

                            if (dragElement.classList.contains('single')) {
                                // There is only one favourite card so don't allow tearing out
                                return false;
                            }

                            $rootScope.$broadcast('tearoutStart');
                            dragService = windowService.registerDrag(tearoutWindow, currentWindowService.getCurrentWindow());

                            currentlyDragging = true;
                            setOffset(e.offsetX, e.offsetY);
                            moveTearoutWindow(e.screenX, e.screenY);
                            clearIncomingTearoutWindow();
                            appendToOpenfinWindow(tearElement, tearoutWindow);
                            displayTearoutWindow();
                        }

                        function handleMouseMove(e) {
                            if (currentlyDragging) {
                                moveTearoutWindow(e.screenX, e.screenY);
                            }
                        }

                        function handleMouseUp(e) {
                            if (e.button !== 0) {
                                // Only process left clicks
                                return false;
                            }
                            $rootScope.$broadcast('tearoutEnd');

                            if (currentlyDragging) {
                                currentlyDragging = false;
                                if (insideFavouritesPane()) {
                                    returnFromTearout();
                                } else {
                                    if (!store) {
                                        store = window.storeService.open(window.name);
                                    }

                                    dragService.overAnotherInstance((overAnotherInstance) => {
                                        if (overAnotherInstance) {
                                            dragService.moveToOtherInstance(scope.stock);
                                            dragService.clearOtherInstance();
                                            store.remove(scope.stock);
                                            dragService = null;
                                        } else {
                                            // Create new window instance
                                            var compact = store.isCompact();
                                            windowService.createMainWindow(null, compact, (newWindow) => {
                                                newWindow.resizeTo(window.outerWidth, window.outerHeight, 'top-left');
                                                var newCardOffset = configService.getTopCardOffset(compact);
                                                newWindow.moveTo(e.screenX - newCardOffset[0], e.screenY - newCardOffset[1]);
                                                var newStore = window.storeService.open(newWindow.name);
                                                newStore.add(scope.stock);
                                                store.remove(scope.stock);
                                                newStore.toggleCompact(compact);
                                            });
                                        }

                                        // Remove drop-target from original instance
                                        parent.removeChild(myHoverArea);
                                        parent.removeChild(myDropTarget);
                                        dispose();

                                        // Destroy myself.
                                        tearoutWindow.close();
                                    });
                                }
                            }
                        }

                        function reorderFavourites() {
                            var hoverTargets = hoverService.get();

                            for (var i = 0, max = hoverTargets.length; i < max; i++) {
                                var overDropTarget = geometryService.elementIntersect(
                                    tearoutWindow, window, hoverTargets[i].hoverArea);

                                if (overDropTarget) {
                                    if (!store) {
                                        store = window.storeService.open(window.name);
                                    }

                                    store.reorder(scope.stock.code, hoverTargets[i].code);
                                    break;
                                }
                            }
                        }

                        function boundsChangingEvent() {
                            if (insideFavouritesPane()) {
                                reorderFavourites();
                                dragService.clearOtherInstance();
                            } else {
                                // Check intersections to set the tear in indicator states.
                                dragService.overAnotherInstance();
                            }
                        }

                        tearoutWindow.addEventListener('bounds-changing', boundsChangingEvent);

                        dragElement.addEventListener('mousedown', handleMouseDown);
                        document.addEventListener('mousemove', handleMouseMove, true);
                        document.addEventListener('mouseup', handleMouseUp, true);

                        function dispose() {
                            hoverService.remove(scope.stock.code);
                            tearoutWindow.removeEventListener('bounds-changing', boundsChangingEvent);
                            dragElement.removeEventListener('mousedown', handleMouseDown);
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                        }

                        scope.$on('$destroy', () => {
                            dispose();
                        });
                    }
                };
            }]);
}(window));
