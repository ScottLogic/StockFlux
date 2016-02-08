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
        constructor() {

        }

        rectangle(arg) {
            return new Rectangle(arg);
        }
    }

    angular.module('openfin.geometry', [])
        .service('geometryService', GeometryService);
})();
