(function(window) {
    'use strict';

    const TEAR_IN_SELECTOR = '.favourites';
    angular.module('stockflux.tearout')
        .directive('tearable', ['geometryService', 'hoverService', 'currentWindowService', 'configService', '$rootScope', '$timeout',
            (geometryService, hoverService, currentWindowService, configService, $rootScope, $timeout) => {
                return {
                    restrict: 'C',
                    link: (scope, element, attrs) => {
                        var tearoutCardDimensions = configService.getTearoutCardDimensions();

                        // Finding the tear element is tightly coupled to the HTML layout.
                        var tearElement = element[0],
                            tileWidth = tearElement.clientWidth || tearoutCardDimensions[0],
                            tileHeight = tearElement.clientHeight || tearoutCardDimensions[1],
                            store,
                            mouseDown = false;

                        var windowService = window.windowService;
                        var tearoutWindow = windowService.createTearoutWindow(window.name);

                        var myDropTarget = tearElement.parentNode,
                            parent = myDropTarget.parentNode,
                            myHoverArea = parent.getElementsByClassName('hover-area')[0],
                            mouseOffset = { x: 0, y: 0 },
                            elementOffset = { x: 0, y: 0 },
                            currentlyDragging = false,
                            dragService,
                            dragTimeout;

                        hoverService.add(myHoverArea, scope.stock.code);

                        function insideFavouritesPane() {
                            // Check if you are over a drop target by seeing if the tearout rectangle intersects the drop target
                            return geometryService.elementIntersect(
                                tearoutWindow, window, document.getElementsByClassName('favourites')[0]);
                        }

                        function setMouseOffset(e) {
                            mouseOffset.x = -e.pageX;
                            mouseOffset.y = -e.pageY;
                        }

                        function setElementOffset() {
                            var el = tearElement,
                                currentLeft = 0,
                                currentTop = 0;

                            if (el.offsetParent) {
                                do {
                                    currentLeft += el.offsetLeft;
                                    currentTop += el.offsetTop;
                                    el = el.offsetParent;
                                } while (el);
                            }

                            elementOffset.x = currentLeft;
                            elementOffset.y = currentTop;
                        }

                        function moveTearoutWindow(screenX, screenY) {
                            tearoutWindow.moveTo(
                                screenX + mouseOffset.x + elementOffset.x,
                                screenY + mouseOffset.y + elementOffset.y);
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

                        function tearout(mouseEvent) {
                            $rootScope.$broadcast('tearoutStart');
                            currentlyDragging = true;
                            moveTearoutWindow(mouseEvent.screenX, mouseEvent.screenY);
                            clearIncomingTearoutWindow();
                            appendToOpenfinWindow(tearElement, tearoutWindow);
                            displayTearoutWindow();

                            tearoutWindow.addEventListener('blurred', onBlur);
                        }

                        function handleMouseDown(e) {
                            if (e.button !== 0) {
                                // Only process left clicks
                                return false;
                            }

                            if (tearElement.classList.contains('single')) {
                                // There is only one favourite card so don't allow tearing out
                                return false;
                            }

                            mouseDown = true;
                            setMouseOffset(e);
                            setElementOffset();
                            dragService = windowService.registerDrag(tearoutWindow, currentWindowService.getCurrentWindow());

                            dragTimeout = $timeout(() => {
                                dragTimeout = null;
                                if (mouseDown) {
                                    tearout(e);
                                } else {
                                    return false;
                                }
                            },
                            250);
                        }

                        function handleMouseMove(e) {
                            if (mouseDown && dragTimeout) {
                                if (Math.abs(e.pageX + mouseOffset.x) > 50 || Math.abs(e.pageY + mouseOffset.y) > 50) {
                                    $timeout.cancel(dragTimeout);
                                    tearout(e);
                                }
                            }

                            if (currentlyDragging) {
                                moveTearoutWindow(e.screenX, e.screenY);
                            }
                        }

                        function handleMouseUp(e) {
                            if (e.button !== 0) {
                                // Only process left clicks
                                return false;
                            }

                            mouseDown = false;
                            $rootScope.$broadcast('tearoutEnd');
                            tearoutWindow.removeEventListener('blurred', onBlur);

                            if (currentlyDragging) {
                                currentlyDragging = false;
                                if (dragService.overThisInstance(TEAR_IN_SELECTOR)) {
                                    returnFromTearout();
                                } else {
                                    if (!store) {
                                        store = window.storeService.open(window.name);
                                    }

                                    dragService.overAnotherInstance(TEAR_IN_SELECTOR, (overAnotherInstance) => {
                                        if (overAnotherInstance) {
                                            dragService.moveToOtherInstance(scope.stock);
                                            dragService.destroy();
                                            store.remove(scope.stock);
                                        } else {
                                            // Create new window instance
                                            var compact = store.isCompact();
                                            var indicators = store.indicators();

                                            windowService.createMainWindow(null, compact, (newWindow, showFunction) => {
                                                newWindow.resizeTo(window.outerWidth, window.outerHeight, 'top-left');
                                                var newCardOffset = configService.getTopCardOffset(compact);
                                                newWindow.moveTo(e.screenX - newCardOffset[0], e.screenY - newCardOffset[1], showFunction);
                                                var newStore = window.storeService.open(newWindow.name);
                                                newStore.indicators(indicators);
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
                            if (dragService.overThisInstance(TEAR_IN_SELECTOR)) {
                                reorderFavourites();
                            } else {
                                // Check intersections to set the tear in indicator states.
                                dragService.updateIntersections(TEAR_IN_SELECTOR);
                            }
                        }

                        function onBlur() {
                            if (currentlyDragging) {
                                $rootScope.$broadcast('tearoutEnd');
                                returnFromTearout();
                                currentlyDragging = false;
                                dragService.destroy();
                                tearoutWindow.removeEventListener('blurred', onBlur);
                            }
                        }

                        tearoutWindow.addEventListener('bounds-changing', boundsChangingEvent);

                        tearElement.addEventListener('mousedown', handleMouseDown);
                        document.addEventListener('mousemove', handleMouseMove, true);
                        document.addEventListener('mouseup', handleMouseUp, true);

                        function dispose() {
                            hoverService.remove(scope.stock.code);
                            tearoutWindow.removeEventListener('bounds-changing', boundsChangingEvent);
                            tearoutWindow.removeEventListener('blurred', onBlur);
                            tearElement.removeEventListener('mousedown', handleMouseDown);
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
