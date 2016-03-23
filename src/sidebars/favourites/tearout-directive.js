(function(window) {
    'use strict';

    const TEAR_IN_SELECTOR = '.favourites';
    angular.module('stockflux.tearout')
        .directive('tearable', ['geometryService', 'hoverService', 'currentWindowService', 'configService', '$rootScope', '$timeout', '$interval',
            (geometryService, hoverService, currentWindowService, configService, $rootScope, $timeout, $interval) => {
                return {
                    restrict: 'C',
                    link: (scope, element, attrs) => {
                        const ANIMATION_TIME = 400;
                        var tearoutCardDimensions = configService.getTearoutCardDimensions();

                        // Finding the tear element is tightly coupled to the HTML layout.
                        var tearElement = element[0],
                            tileWidth = tearElement.clientWidth || tearoutCardDimensions[0],
                            tileHeight = tearElement.clientHeight || tearoutCardDimensions[1],
                            store,
                            mouseDown = false,
                            emptyWindow = false,
                            dimmed = false,
                            timer = 0,
                            incrementPromise,
                            dimPromise,
                            currentMousePosition = {},
                            windowService = window.windowService,
                            tearoutWindow = windowService.createTearoutWindow(window.name),
                            myDropTarget = tearElement.parentNode,
                            parent = myDropTarget.parentNode,
                            myHoverArea = parent.getElementsByClassName('drop-target')[0],
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

                        function moveWindow(_window, x, y, showFunction) {
                            _window.moveTo(
                                x + mouseOffset.x + elementOffset.x,
                                y + mouseOffset.y + elementOffset.y,
                                showFunction);
                        }

                        function displayTearoutWindow() {
                            tearoutWindow.show();
                            tearoutWindow.setAsForeground();
                        }

                        function appendToOpenfinWindow(injection, openfinWindow) {
                            openfinWindow.contentWindow.document.body.appendChild(injection);
                        }

                        function returnFromTearout() {
                            reportAction('Tearout', 'Return to same');
                            myDropTarget.appendChild(tearElement);
                            tearoutWindow.hide();
                            dragService.destroy();
                        }

                        function clearIncomingTearoutWindow() {
                            var document = tearoutWindow.getNativeWindow().document;
                            document.body = document.createElement('body');
                        }

                        function tearout(mouseEvent) {
                            $rootScope.$broadcast('tearoutStart');
                            moveWindow(tearoutWindow, mouseEvent.screenX, mouseEvent.screenY);
                            clearIncomingTearoutWindow();
                            appendToOpenfinWindow(tearElement, tearoutWindow);
                            displayTearoutWindow();

                            tearoutWindow.addEventListener('blurred', onBlur);

                            if (tearElement.classList.contains('single')) {
                                // There is only one favourite card; flag the window for closing
                                emptyWindow = true;
                            }

                            currentlyDragging = true;
                        }

                        function startTimer() {
                            resetTimer();
                            if (!incrementPromise) {
                                incrementPromise = $interval(() => {
                                    timer++;
                                    if (timer > 100) {
                                        dragService.overAnotherInstance(TEAR_IN_SELECTOR, (overAnotherInstance) => {
                                            if (!overAnotherInstance) {
                                                stopTimer();
                                                undim();
                                            }
                                        });
                                    }
                                },
                                10);
                            }
                        }

                        function stopTimer() {
                            $interval.cancel(incrementPromise);
                            incrementPromise = null;
                            $timeout.cancel(dimPromise);
                            dimPromise = null;
                            resetTimer();
                        }

                        function resetTimer() {
                            timer = 0;
                        }

                        function dim() {
                            var _window = currentWindowService.getCurrentWindow();
                            dimmed = true;

                            dimPromise = $timeout(() => {
                                stopTimer();
                                _window.animate({
                                    opacity: {
                                        opacity: 0,
                                        duration: ANIMATION_TIME
                                    }
                                });
                                _window.updateOptions({
                                    shadow: false
                                });
                                dimPromise = null;
                                startTimer();
                            },
                            400);
                        }

                        function undim() {
                            var _window = currentWindowService.getCurrentWindow();

                            var newCardOffset = configService.getTopCardOffset(store.isCompact());
                            moveWindow(
                                _window,
                                currentMousePosition.x - newCardOffset[0] - 2,
                                currentMousePosition.y - newCardOffset[1] - 1);

                            _window.animate({
                                opacity: {
                                    opacity: 1,
                                    duration: ANIMATION_TIME
                                }
                            },
                                {
                                    interrupt: true
                                });

                            dimmed = false;
                        }

                        function handleMouseDown(e) {
                            if (e.button !== 0) {
                                // Only process left clicks
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
                                moveWindow(tearoutWindow, e.screenX, e.screenY);
                                currentMousePosition.x = e.screenX;
                                currentMousePosition.y = e.screenY;
                                if (emptyWindow) {
                                    resetTimer();
                                    if (!insideFavouritesPane() && !dimmed) {
                                        dim();
                                        startTimer();
                                    }
                                }
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
                                            reportAction('Tearout', 'Moved ' + scope.stock.code);
                                            dragService.moveToOtherInstance(scope.stock);
                                            dragService.destroy();
                                            store.remove(scope.stock);

                                            if (emptyWindow) {
                                                tidy();
                                                currentWindowService.getCurrentWindow().close();
                                                return;
                                            }
                                        } else if (emptyWindow) {
                                            returnFromTearout();
                                            stopTimer();
                                            undim();
                                        } else {
                                            // Create new window instance
                                            var compact = store.isCompact();
                                            var indicators = store.indicators();

                                            windowService.createMainWindow(null, compact, (newWindow, showFunction) => {
                                                reportAction('Tearout', 'Created ' + scope.stock.code);
                                                newWindow.resizeTo(window.outerWidth, window.outerHeight, 'top-left');
                                                var newCardOffset = configService.getTopCardOffset(compact);
                                                moveWindow(newWindow, e.screenX - newCardOffset[0], e.screenY - newCardOffset[1], showFunction);
                                                var newStore = window.storeService.open(newWindow.name);
                                                newStore.indicators(indicators);
                                                newStore.add(scope.stock);
                                                store.remove(scope.stock);
                                                newStore.toggleCompact(compact);
                                            });
                                        }

                                        tidy();
                                    });
                                }
                            }
                        }

                        function tidy() {
                            // Remove drop-target from original instance
                            parent.removeChild(myDropTarget);
                            dispose();

                            // Destroy myself.
                            tearoutWindow.close();
                        }

                        function reorderFavourites() {
                            var hoverTargets = hoverService.get();
                            var largestIntersectionArea = -1;
                            var largestIntersector = hoverTargets[0];

                            for (var i = 0, max = hoverTargets.length; i < max; i++) {
                                var areaOfIntersection = geometryService.elementIntersectArea(
                                    tearoutWindow, window, hoverTargets[i].hoverArea);

                                if (areaOfIntersection > largestIntersectionArea) {
                                    largestIntersectionArea = areaOfIntersection;
                                    largestIntersector = hoverTargets[i];
                                }
                            }

                            if (largestIntersectionArea > 0 && largestIntersector) {
                                if (!store) {
                                    store = window.storeService.open(window.name);
                                }

                                store.reorder(scope.stock.code, largestIntersector.code);
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
