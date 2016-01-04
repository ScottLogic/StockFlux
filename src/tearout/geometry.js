var geometry = geometry || {};
(function() {
    'use strict';

    var Point = function(anX, aY) {
        this.x = anX || 0;
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
            var aResult = new Point(this.right(), this.bottom());
            return aResult;
        },
        intersects: function(aRectangle) {
            //return true if we overlap, false otherwise

            var rOrigin = aRectangle.origin,
                rCorner = aRectangle.corner();

            return rCorner.x > this.origin.x &&
                rCorner.y > this.origin.y &&
                rOrigin.x < this.corner().x &&
                rOrigin.y < this.corner().y;
        }
    };

    /*
        argument rect is an object with this shape:
        {
            top: <number>,
            left: <number>,
            width: <number>,
            height: <number>
        }
    */
    geometry.rectangle = function(rect) {
        return new Rectangle(rect);
    };
    geometry.point = function(anX, aY) {
        return new Point(anX, aY);
    };
})();
