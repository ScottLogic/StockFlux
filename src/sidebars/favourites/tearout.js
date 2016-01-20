(function(window) {
    'use strict';

    angular.module('openfin.tearout', ['openfin.geometry', 'openfin.hover', 'openfin.store'])
        .directive('tearable', ['geometryService', 'hoverService', 'storeService', function(geometryService, hoverService, storeService) {
            return {
                restrict: 'C',
                link: function(scope, element, attrs) {
                    // TODO: Improve this. Search for first class element upwards?
                    var dragElement = element[0],
                        tearElement = dragElement.parentNode.parentNode,
                        tileWidth = tearElement.clientWidth,
                        tileHeight = tearElement.clientHeight;

                    function createConfig() {
                        return {
                            'name': scope.stock.code + ' window',
                            'maxWidth': tileWidth,
                            'minHeight': tileHeight,
                            'defaultWidth': tileWidth,
                            'defaultHeight': tileHeight,
                            'width': tileWidth,
                            'height': tileHeight,
                            'autoShow': false,
                            'url': 'sidebars/favourites/tearout.html',
                            'frame': false,
                            'resizable': false,
                            'maximizable': false,
                            'showTaskbarIcon': false,
                            'saveWindowState': false
                        };
                    }

                    var tearoutWindow = new fin.desktop.Window(createConfig());

                    fin.desktop.main(function() {
                        function initialiseTearout() {
                            var myDropTarget = tearElement.parentNode,
                                offset = { x: 0, y: 0 },
                                currentlyDragging = false;

                            var me = {};

                            hoverService.add(myDropTarget.parentNode.getElementsByClassName('hover-area')[0], scope.stock.code);

                            // The distance from where the mouse click occurred from the origin of the element that will be torn out.
                            // This is to place the tearout window exactly over the tornout element
                            me.setOffset = function(x, y) {
                                offset.x = x;
                                offset.y = y;

                                return me;
                            };

                            // Sets whether the tearout window is being dragged.
                            // Used to determine whether `mousemove` events should programmatically move the tearout window
                            me.setCurrentlyDragging = function(dragging) {
                                currentlyDragging = dragging;

                                return me;
                            };

                            // A call to the OpenFin API to move the tearout window
                            me.moveTearoutWindow = function(x, y) {
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
                            me.displayTearoutWindow = function() {
                                tearoutWindow.show();
                                tearoutWindow.setAsForeground();

                                return me;
                            };

                            // Inject the element being tornout into the new, tearout, window
                            me.appendToOpenfinWindow = function(injection, openfinWindow) {
                                openfinWindow
                                    .contentWindow
                                    .document
                                    .body
                                    .appendChild(injection);
                                console.log(injection);
                                return me;
                            };

                            // Grab the DOM element back from the tearout window and append the given container
                            me.returnFromTearout = function() {
                                myDropTarget.appendChild(tearElement);
                                tearoutWindow.hide();
                            };

                            // Clear out all the elements but keep the js context ;)
                            me.clearIncomingTearoutWindow = function() {
                                tearoutWindow
                                    .getNativeWindow()
                                    .document
                                    .body = tearoutWindow
                                    .getNativeWindow()
                                    .document.createElement('body');

                                return me;
                            };

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
                            function elementScreenPosition(windowElement, element1) {
                                var relativeElementPosition = element1.getBoundingClientRect();

                                return {
                                    height: relativeElementPosition.height,
                                    width: relativeElementPosition.width,
                                    top: windowElement.top + relativeElementPosition.top,
                                    left: windowElement.left + relativeElementPosition.left
                                };
                            }

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
                            me.handleMouseDown = function(e) {
                                if (e.button !== 0) {
                                    // Only process left clicks
                                    return false;
                                }

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
                            me.handleMouseMove = function(e) {
                                if (currentlyDragging) {
                                    me.moveTearoutWindow(e.screenX, e.screenY);
                                }
                            };

                            // On a mouseup event we reset the internal state to be ready for the next dragging event
                            //
                            // `handleMouseUp` is the function assigned to the `mouseup` event on the `document`.
                            me.handleMouseUp = function(e) {
                                if (e.button !== 0) {
                                    // Only process left clicks
                                    return false;
                                }

                                if (currentlyDragging) {
                                    me.setCurrentlyDragging(false)
                                        .returnFromTearout();
                                }
                            };

                            // On the `bounds-changing` event check to see if you are over a potential drop target.
                            // If so update the drop target.
                            tearoutWindow.addEventListener('bounds-changing', function() {
                                // Check if you are over a drop target by seeing if the tearout rectangle intersects the drop target
                                var hoverTargets = hoverService.get();
                                var nativeWindow = tearoutWindow.getNativeWindow();
                                for (var i = 0, max = hoverTargets.length; i < max; i++) {
                                    var dropTargetRectangle = geometryService.rectangle(
                                        elementScreenPosition(getWindowPosition(window), hoverTargets[i].hoverArea));
                                    var overDropTarget = geometryService.rectangle(getWindowPosition(nativeWindow))
                                            .intersects(dropTargetRectangle);

                                    if (overDropTarget) {
                                        // TODO: This is where the pause will go, and the highlighting.
                                        storeService.reorder(scope.stock.code, hoverTargets[i].code);
                                        break;
                                    }
                                }
                            });

                            dragElement.addEventListener('mousedown', me.handleMouseDown);
                            document.addEventListener('mousemove', me.handleMouseMove, true);
                            document.addEventListener('mouseup', me.handleMouseUp, true);
                        }

                        scope.$on('$destroy', function(e) {
                            hoverService.remove(scope.stock.code);
                        });

                        initialiseTearout();
                    });
                }
            };
        }]);
}(window));
