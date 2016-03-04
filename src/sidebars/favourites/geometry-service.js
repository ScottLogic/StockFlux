(function() {
    'use strict';

    class Point {
        constructor(x, y) {
            this.x = x || 0;
            this.y = y || 0;
        }
    }

    class Rectangle {
        constructor(rect) {
            this.origin = new Point(rect.left, rect.top);
            this.extent = new Point(rect.width, rect.height);
        }

        top() {
            return this.origin.y;
        }

        left() {
            return this.origin.x;
        }

        bottom() {
            return this.top() + this.extent.y;
        }

        right() {
            return this.left() + this.extent.x;
        }

        corner() {
            return new Point(this.right(), this.bottom());
        }

        intersects(otherRectangle) {
            //return true if we overlap, false otherwise

            var otherOrigin = otherRectangle.origin,
                otherCorner = otherRectangle.corner();

            return otherCorner.x > this.origin.x &&
                otherCorner.y > this.origin.y &&
                otherOrigin.x < this.corner().x &&
                otherOrigin.y < this.corner().y;
        }
    }

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

    function intersectHelper(bounds1, bounds2) {
        var rectangle1 = new Rectangle(bounds1),
            rectangle2 = new Rectangle(bounds2);

        return rectangle1.intersects(rectangle2);
    }

    class GeometryService {
        windowsIntersect(openFinWindow, _window) {
            var nativeWindow = openFinWindow.getNativeWindow();

            return intersectHelper(getWindowPosition(nativeWindow), getWindowPosition(_window));
        }

        elementIntersect(openFinWindow, _window, element) {
            var nativeWindow = openFinWindow.getNativeWindow();

            return intersectHelper(
                getWindowPosition(nativeWindow),
                elementScreenPosition(getWindowPosition(_window), element));
        }
    }

    angular.module('stockflux.geometry', [])
        .service('geometryService', GeometryService);
})();
