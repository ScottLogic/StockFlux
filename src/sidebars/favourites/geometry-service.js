(function() {
    'use strict';

    angular.module('openfin.geometry', [])
        .factory('geometryService', [function() {

            var Point = function(aX, aY) {
                this.x = aX || 0;
                this.y = aY || 0;
            };
            Point.constructor = Point;

            var Rectangle = function(rect) {
                this.origin = new Point(rect.left, rect.top);
                this.extent = new Point(rect.width, rect.height);
            };
            Rectangle.constructor = Rectangle;

            Rectangle.prototype = {
                top: function() {
                    return this.origin.y;
                },
                left: function() {
                    return this.origin.x;
                },
                bottom: function() {
                    return this.top() + this.extent.y;
                },
                right: function() {
                    return this.left() + this.extent.x;
                },
                corner: function() {
                    return new Point(this.right(), this.bottom());
                },
                intersects: function(otherRectangle) {
                    //return true if we overlap, false otherwise

                    var otherOrigin = otherRectangle.origin,
                        otherCorner = otherRectangle.corner();

                    return otherCorner.x > this.origin.x &&
                        otherCorner.y > this.origin.y &&
                        otherOrigin.x < this.corner().x &&
                        otherOrigin.y < this.corner().y;
                }
            };

            //  argument rect is an object with this shape:
            //  {
            //      top: <number>,
            //      left: <number>,
            //      width: <number>,
            //      height: <number>
            //  }
            function rectangle(rect) {
                return new Rectangle(rect);
            }

            return {
                rectangle: rectangle
            };
        }]);
})();
