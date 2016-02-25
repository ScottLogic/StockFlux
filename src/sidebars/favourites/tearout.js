(function(window) {
    'use strict';

    angular.module('openfin.tearout')
        .directive('tearable', ['geometryService', 'hoverService', 'currentWindowService',
            (geometryService, hoverService, currentWindowService) => {
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
                        var me = {};

                        function initialiseTearout() {
                            var myDropTarget = tearElement.parentNode,
                                parent = myDropTarget.parentNode,
                                myHoverArea = parent.getElementsByClassName('hover-area')[0],
                                offset = { x: 0, y: 0 },
                                currentlyDragging = false,
                                insideFavouritesPane = true,
                                dragService;

                            hoverService.add(myHoverArea, scope.stock.code);

                            // The distance from where the mouse click occurred from the origin of the element that will be torn out.
                            // This is to place the tearout window exactly over the tornout element
                            me.setOffset = (x, y) => {
                                offset.x = x;
                                offset.y = y;

                                return me;
                            };

                            // Sets whether the tearout window is being dragged.
                            // Used to determine whether `mousemove` events should programmatically move the tearout window
                            me.setCurrentlyDragging = (dragging) => {
                                currentlyDragging = dragging;

                                return me;
                            };

                            // A call to the OpenFin API to move the tearout window
                            me.moveTearoutWindow = (x, y) => {
                                var tileTopPadding = 5,
                                    tileRightPadding = 5,
                                    tearElementWidth = 16;

                                tearoutWindow.moveTo(
                                    x - tileWidth + (tearElementWidth - offset.x + tileRightPadding),
                                    y - (tileTopPadding + offset.y));

                                return me;
                            };

                            // A call to the OpenFin API to both show the tearout window and ensure that
                            // it is displayed in the foreground
                            me.displayTearoutWindow = () => {
                                tearoutWindow.show();
                                tearoutWindow.setAsForeground();

                                return me;
                            };

                            // Inject the element being tornout into the new, tearout, window
                            me.appendToOpenfinWindow = (injection, openfinWindow) => {
                                openfinWindow
                                    .contentWindow
                                    .document
                                    .body
                                    .appendChild(injection);

                                return me;
                            };

                            // Grab the DOM element back from the tearout window and append the given container
                            me.returnFromTearout = () => {
                                myDropTarget.appendChild(tearElement);
                                tearoutWindow.hide();
                            };

                            // Clear out all the elements but keep the js context ;)
                            me.clearIncomingTearoutWindow = () => {
                                tearoutWindow
                                    .getNativeWindow()
                                    .document
                                    .body = tearoutWindow
                                    .getNativeWindow()
                                    .document.createElement('body');

                                return me;
                            };

                            // On a mousedown event, we grab our destination tearout window and inject
                            // the DOM element to be torn out.
                            //
                            // `handleMouseDown` is the function assigned to the native `mousedown`
                            // event on the element to be torn out. The param `e` is the native event
                            // passed in by the event listener. The steps taken are as follows:
                            // * Set the X and Y offsets to better position the tearout window
                            // * Move the tearout window into position
                            // * Clear out any DOM elements that may already be in the tearout window
                            // * Move the DOM element to be torn out into the tearout
                            // * Display the tearout window in the foreground
                            me.handleMouseDown = (e) => {
                                if (e.button !== 0) {
                                    // Only process left clicks
                                    return false;
                                }

                                if (dragElement.classList.contains('single')) {
                                    // There is only one favourite card so don't allow tearing out
                                    return false;
                                }

                                dragService = windowService.registerDrag(tearoutWindow, currentWindowService.getCurrentWindow());

                                me.setCurrentlyDragging(true)
                                    .setOffset(e.offsetX, e.offsetY)
                                    .moveTearoutWindow(e.screenX, e.screenY)
                                    .clearIncomingTearoutWindow()
                                    .appendToOpenfinWindow(tearElement, tearoutWindow)
                                    .displayTearoutWindow();
                            };

                            // On a mousemove event, if we are in a dragging state, move the torn out window programmatically.
                            //
                            // `handleMouseMove` is the function assigned to the `mousemove` event on the `document`.
                            // The param `e` is the native event passed in by the event listener.
                            // If the `currentlyDragging` flag is true move the tearout window.
                            me.handleMouseMove = (e) => {
                                if (currentlyDragging) {
                                    me.moveTearoutWindow(e.screenX, e.screenY);
                                }
                            };

                            // On a mouseup event we reset the internal state to be ready for the next dragging event
                            //
                            // `handleMouseUp` is the function assigned to the `mouseup` event on the `document`.
                            me.handleMouseUp = (e) => {
                                if (e.button !== 0) {
                                    // Only process left clicks
                                    return false;
                                }

                                if (currentlyDragging) {
                                    me.setCurrentlyDragging(false);
                                    if (insideFavouritesPane) {
                                        me.returnFromTearout();
                                    } else {
                                        if (!store) {
                                            store = window.storeService.open(window.name);
                                        }

                                        // Remove the stock from the old window
                                        store.remove(scope.stock);

                                        dragService.overAnotherInstance((overAnotherInstance) => {
                                            if (overAnotherInstance) {
                                                dragService.moveToOtherInstance(scope.stock);
                                                dragService = null;
                                            } else {
                                                // Create new window instance
                                                var compact = store.isCompact();
                                                windowService.createMainWindow(null, compact, (newWindow) => {
                                                    newWindow.resizeTo(window.outerWidth, window.outerHeight, 'top-left');
                                                    newWindow.moveTo(e.screenX, e.screenY);
                                                    var newStore = window.storeService.open(newWindow.name);
                                                    newStore.add(scope.stock);
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
                            };

                            function reorderFavourites() {
                                var hoverTargets = hoverService.get();

                                for (var i = 0, max = hoverTargets.length; i < max; i++) {
                                    var overDropTarget = geometryService.elementIntersect(tearoutWindow, window, hoverTargets[i].hoverArea);

                                    if (overDropTarget) {
                                        if (!store) {
                                            store = window.storeService.open(window.name);
                                        }

                                        store.reorder(scope.stock.code, hoverTargets[i].code);
                                        break;
                                    }
                                }
                            }

                            me.boundsChangingEvent = () => {
                                // Check if you are over a drop target by seeing if the tearout rectangle intersects the drop target
                                insideFavouritesPane = geometryService.elementIntersect(tearoutWindow, window, document.getElementsByClassName('favourites')[0]);

                                if (insideFavouritesPane) {
                                    reorderFavourites();
                                }
                            };

                            // On the `bounds-changing` event check to see if you are over a potential drop target.
                            // If so update the drop target.
                            tearoutWindow.addEventListener('bounds-changing', me.boundsChangingEvent);

                            dragElement.addEventListener('mousedown', me.handleMouseDown);
                            document.addEventListener('mousemove', me.handleMouseMove, true);
                            document.addEventListener('mouseup', me.handleMouseUp, true);
                        }

                        function dispose() {
                            hoverService.remove(scope.stock.code);
                            tearoutWindow.removeEventListener('bounds-changing', me.boundsChangingEvent);
                            dragElement.removeEventListener('mousedown', me.handleMouseDown);
                            document.removeEventListener('mousemove', me.handleMouseMove);
                            document.removeEventListener('mouseup', me.handleMouseUp);
                        }

                        scope.$on('$destroy', () => {
                            dispose();
                        });

                        initialiseTearout();
                    }
                };
            }]);
}(window));
