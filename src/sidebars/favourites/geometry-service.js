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

    class GeometryService {
        rectangle(arg) {
            return new Rectangle(arg);
        }

        // Helper function to retrieve the height, width, top, and left from a window object
        getWindowPosition(windowElement) {
            return {
                height: windowElement.outerHeight,
                width: windowElement.outerWidth,
                top: windowElement.screenY,
                left: windowElement.screenX
            };
        }

        // Calculate the screen position of an element
        elementScreenPosition(windowElement, element) {
            var relativeElementPosition = element.getBoundingClientRect();

            return {
                height: relativeElementPosition.height,
                width: relativeElementPosition.width,
                top: windowElement.top + relativeElementPosition.top,
                left: windowElement.left + relativeElementPosition.left
            };
        }

        windowsIntersect(openFinWindow, _window) {
            var nativeWindow1 = openFinWindow.getNativeWindow(),
                rectangle1 = this.rectangle(this.getWindowPosition(nativeWindow1)),
                rectangle2 = this.rectangle(this.getWindowPosition(_window));

            return rectangle1.intersects(rectangle2);
        }
    }

    angular.module('openfin.geometry', [])
        .service('geometryService', GeometryService);
})();
