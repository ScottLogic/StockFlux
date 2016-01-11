(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('d3')) :
  typeof define === 'function' && define.amd ? define(['d3'], factory) :
  (factory(global.d3));
}(this, function (d3) { 'use strict';

  d3 = 'default' in d3 ? d3['default'] : d3;

  /**
   * An overload of the d3.rebind method which allows the source methods
   * to be rebound to the target with a different name. In the mappings object
   * keys represent the target method names and values represent the source
   * object names.
   */
  function rebind(target, source, mappings) {
      if (typeof(mappings) !== 'object') {
          return d3.rebind.apply(d3, arguments);
      }
      Object.keys(mappings)
          .forEach(function(targetName) {
              var method = source[mappings[targetName]];
              if (typeof method !== 'function') {
                  throw new Error('The method ' + mappings[targetName] + ' does not exist on the source object');
              }
              target[targetName] = function() {
                  var value = method.apply(source, arguments);
                  return value === source ? target : value;
              };
          });
      return target;
  }

  function capitalizeFirstLetter(str) {
      return str[0].toUpperCase() + str.slice(1);
  }

  /**
   * Rebinds all the methods from the source component, adding the given prefix. An
   * optional exclusions parameter can be used to specify methods which should not
   * be rebound.
   */
  function rebindAll(target, source, prefix, exclusions) {
      prefix = typeof prefix !== 'undefined' ? prefix : '';

      // if exclusions isn't an array, construct it
      if (!(arguments.length === 4 && Array.isArray(exclusions))) {
          exclusions = Array.prototype.slice.call(arguments, 3);
      }

      exclusions = exclusions.map(function(exclusion) {
          if (typeof(exclusion) === 'string') {
              if (!source.hasOwnProperty(exclusion)) {
                  throw new Error('The method ' + exclusion + ' does not exist on the source object');
              }
              exclusion = new RegExp('^' + exclusion + '$');
          }
          return exclusion;
      });

      function exclude(testedProperty) {
          return exclusions.some(function(exclusion) {
              return testedProperty.match(exclusion);
          });
      }

      function reboundPropertyName(inputProperty) {
          return prefix !== '' ? prefix + capitalizeFirstLetter(inputProperty) : inputProperty;
      }

      var bindings = {};
      for (var property in source) {
          if (source.hasOwnProperty(property) && !exclude(property)) {
              bindings[reboundPropertyName(property)] = property;
          }
      }

      rebind(target, source, bindings);
  }

  function minimum(data, accessor) {
      return data.map(function(dataPoint) {
          return [accessor(dataPoint), dataPoint];
      }).reduce(function(accumulator, dataPoint) {
          return accumulator[0] > dataPoint[0] ? dataPoint : accumulator;
      }, [Number.MAX_VALUE, null])[1];
  }

  function isIntersecting(a, b) {
      return !(a.x >= (b.x + b.width) ||
         (a.x + a.width) <= b.x ||
         a.y >= (b.y + b.height) ||
         (a.y + a.height) <= b.y);
  }

  function areaOfIntersection(a, b) {
      var left = Math.max(a.x, b.x);
      var right = Math.min(a.x + a.width, b.x + b.width);
      var top = Math.max(a.y, b.y);
      var bottom = Math.min(a.y + a.height, b.y + b.height);
      return (right - left) * (bottom - top);
  }

  function collidingWith(rectangles, index) {
      var rectangle = rectangles[index];

      // Filter all rectangles that aren't the selected rectangle
      // and the filter if they intersect.
      return rectangles.filter(function(_, i) {
          return index !== i;
      }).filter(function(d) {
          return isIntersecting(d, rectangle);
      });
  }

  function collisionArea(rectangles, index) {
      var rectangle = rectangles[index];
      var collisions = collidingWith(rectangles, index);

      return d3.sum(collisions.map(function(d) {
          return areaOfIntersection(rectangle, d);
      }));
  }

  function totalCollisionArea(rectangles) {
      return d3.sum(rectangles.map(function(_, i) {
          return collisionArea(rectangles, i);
      }));
  }

  function containerUtils() {
      var containerWidth = 0,
          containerHeight = 0;

      var container = function(point) {
          return !(point.x < 0 || point.y < 0 ||
              point.x > containerWidth || point.y > containerHeight ||
              (point.x + point.width) > containerWidth ||
              (point.y + point.height) > containerHeight);
      };

      container.containerWidth = function(value) {
          if (!arguments.length) {
              return containerWidth;
          }
          containerWidth = value;
          return container;
      };

      container.containerHeight = function(value) {
          if (!arguments.length) {
              return containerHeight;
          }
          containerHeight = value;
          return container;
      };

      return container;
  }

  function getAllPlacements(label) {
      var x = label.x;
      var y = label.y;
      var width = label.width;
      var height = label.height;
      return [
          getPlacement(x, y, width, height), // Same location
          getPlacement(x - width, y, width, height), // Left
          getPlacement(x - width, y - height, width, height), // Up, left
          getPlacement(x, y - height, width, height), // Up
          getPlacement(x, y - height / 2, width, height), // Half up
          getPlacement(x - width / 2, y, width, height), // Half left
          getPlacement(x - width, y - height / 2, width, height), // Full left, half up
          getPlacement(x - width / 2, y - height, width, height) // Full up, half left
      ];
  }

  function getPlacement(x, y, width, height) {
      return {
          x: x,
          y: y,
          width: width,
          height: height
      };
  }

  function randomItem(array) {
      return array[randomIndex(array)];
  }

  function randomIndex(array) {
      return Math.floor(Math.random() * array.length);
  }

  function cloneAndReplace(array, index, replacement) {
      var clone = array.slice();
      clone[index] = replacement;
      return clone;
  }


  var array = Object.freeze({
      randomItem: randomItem,
      randomIndex: randomIndex,
      cloneAndReplace: cloneAndReplace
  });

  function annealing() {

      var container = containerUtils();
      var temperature = 1000;
      var cooling = 1;

      var strategy = function(data) {

          var originalData = data;
          var iteratedData = data;

          var lastScore = Infinity;
          var currentTemperature = temperature;
          while (currentTemperature > 0) {

              var potentialReplacement = getPotentialState(originalData, iteratedData);

              var potentialScore = scorer(potentialReplacement);

              // Accept the state if it's a better state
              // or at random based off of the difference between scores.
              // This random % helps the algorithm break out of local minima
              var probablityOfChoosing = Math.exp((lastScore - potentialScore) / currentTemperature);
              if (potentialScore < lastScore || probablityOfChoosing > Math.random()) {
                  iteratedData = potentialReplacement;
                  lastScore = potentialScore;
              }

              currentTemperature -= cooling;
          }
          return iteratedData;
      };

      strategy.temperature = function(i) {
          if (!arguments.length) {
              return temperature;
          }

          temperature = i;
          return strategy;
      };

      strategy.cooling = function(i) {
          if (!arguments.length) {
              return cooling;
          }

          cooling = i;
          return strategy;
      };

      function getPotentialState(originalData, iteratedData) {
          // For one point choose a random other placement.

          var victimLabelIndex = randomIndex(originalData);
          var label = originalData[victimLabelIndex];

          var replacements = getAllPlacements(label);
          var replacement = randomItem(replacements);

          return cloneAndReplace(iteratedData, victimLabelIndex, replacement);
      }

      d3.rebind(strategy, container, 'containerWidth');
      d3.rebind(strategy, container, 'containerHeight');

      function scorer(placement) {
          var collisionArea = totalCollisionArea(placement);
          var pointsOnScreen = 1;
          for (var i = 0; i < placement.length; i++) {
              var point = placement[i];
              pointsOnScreen += container(point) ? 0 : 100;
          }
          return collisionArea * pointsOnScreen;
      }

      return strategy;
  }

  function local() {

      var container = containerUtils();
      var iterations = 1;

      var strategy = function(data) {

          var originalData = data;
          var iteratedData = data;

          var thisIterationScore = Number.MAX_VALUE;
          var lastIterationScore = Infinity;
          var iteration = 0;

          // Keep going until there's no more iterations to do or
          // the solution is a local minimum
          while (iteration < iterations && thisIterationScore < lastIterationScore) {
              lastIterationScore = thisIterationScore;

              iteratedData = iterate(originalData, iteratedData);

              thisIterationScore = totalCollisionArea(iteratedData);
              iteration++;
          }
          return iteratedData;
      };

      strategy.iterations = function(i) {
          if (!arguments.length) {
              return iterations;
          }

          iterations = i;
          return strategy;
      };

      function iterate(originalData, iteratedData) {

          // Find rectangles with collisions or are outside of the bounds of the container
          iteratedData.map(function(d, i) {
              return [d, i];
          }).filter(function(d, i) {
              return collidingWith(iteratedData, d[1]).length || !container(d[0]);
          }).forEach(function(d) {

              // Use original data to stop wandering rectangles with each iteration
              var placements = getAllPlacements(originalData[d[1]]);

              // Create different states the algorithm could transition to
              var candidateReplacements = placements.map(function(placement) {
                  return cloneAndReplace(iteratedData, d[1], placement);
              });

              // Choose the best state.
              var bestPlacement = minimum(candidateReplacements, function(placement) {
                  var areaOfCollisions = collisionArea(placement, d[1]);
                  var isOnScreen = container(placement[d[1]]);
                  return areaOfCollisions + (isOnScreen ? 0 : Number.MAX_VALUE);
              });

              iteratedData = bestPlacement;
          });
          return iteratedData;
      }

      d3.rebind(strategy, container, 'containerWidth');
      d3.rebind(strategy, container, 'containerHeight');

      return strategy;
  }

  function greedy() {

      var container = containerUtils();

      var strategy = function(data) {
          var builtPoints = [];

          data.forEach(function(point) {
              var allPointPlacements = getAllPlacements(point);
              var candidateReplacements = allPointPlacements.map(function(placement) {
                  return getCandidateReplacement(builtPoints, placement);
              });

              builtPoints = minimum(candidateReplacements, scorer);
          });

          return builtPoints;
      };

      d3.rebind(strategy, container, 'containerWidth');
      d3.rebind(strategy, container, 'containerHeight');

      function getCandidateReplacement(allPoints, point) {
          var allPointsCopy = allPoints.slice();
          allPointsCopy.push(point);

          return allPointsCopy;
      }

      function scorer(placement) {
          var areaOfCollisions = totalCollisionArea(placement);
          var isOnScreen = true;
          for (var i = 0; i < placement.length && isOnScreen; i++) {
              var point = placement[i];
              isOnScreen = container(point);
          }
          return areaOfCollisions + (isOnScreen ? 0 : Infinity);
      }

      return strategy;
  }

  function boundingBox() {

      var containerWidth = 1,
          containerHeight = 1;

      var strategy = function(data) {
          return data.map(function(d, i) {

              var tx = d.x, ty = d.y;
              if (tx + d.width > containerWidth) {
                  tx -= d.width;
              }

              if (ty + d.height > containerHeight) {
                  ty -= d.height;
              }
              return {x: tx, y: ty};
          });
      };

      strategy.containerWidth = function(value) {
          if (!arguments.length) {
              return containerWidth;
          }
          containerWidth = value;
          return strategy;
      };

      strategy.containerHeight = function(value) {
          if (!arguments.length) {
              return containerHeight;
          }
          containerHeight = value;
          return strategy;
      };

      return strategy;
  }

  var strategy = {
      boundingBox: boundingBox,
      greedy: greedy,
      local: local,
      annealing: annealing
  };

  function context() {
      return this;
  }

  function identity(d) {
      return d;
  }

  function index(d, i) {
      return i;
  }

  function noop(d) {}


  var fn = Object.freeze({
      context: context,
      identity: identity,
      index: index,
      noop: noop
  });

  // "Caution: avoid interpolating to or from the number zero when the interpolator is used to generate
  // a string (such as with attr).
  // Very small values, when stringified, may be converted to scientific notation and
  // cause a temporarily invalid attribute or style property value.
  // For example, the number 0.0000001 is converted to the string "1e-7".
  // This is particularly noticeable when interpolating opacity values.
  // To avoid scientific notation, start or end the transition at 1e-6,
  // which is the smallest value that is not stringified in exponential notation."
  // - https://github.com/mbostock/d3/wiki/Transitions#d3_interpolateNumber
  var effectivelyZero = 1e-6;

  // Wrapper around d3's selectAll/data data-join, which allows decoration of the result.
  // This is achieved by appending the element to the enter selection before exposing it.
  // A default transition of fade in/out is also implicitly added but can be modified.

  function _dataJoin() {
      var selector = 'g',
          children = false,
          element = 'g',
          attr = {},
          key = index;

      var dataJoin = function(container, data) {

          var joinedData = data || identity;

          // Can't use instanceof d3.selection (see #458)
          if (!(container.selectAll && container.node)) {
              container = d3.select(container);
          }

          // update
          var selection = container.selectAll(selector);
          if (children) {
              // in order to support nested selections, they can be filtered
              // to only return immediate children of the container
              selection = selection.filter(function() {
                  return this.parentNode === container.node();
              });
          }
          var updateSelection = selection.data(joinedData, key);

          // enter
          // when container is a transition, entering elements fade in (from transparent to opaque)
          // N.B. insert() is used to create new elements, rather than append(). insert() behaves in a special manner
          // on enter selections - entering elements will be inserted immediately before the next following sibling
          // in the update selection, if any.
          // This helps order the elements in an order consistent with the data, but doesn't guarantee the ordering;
          // if the updating elements change order then selection.order() would be required to update the order.
          // (#528)
          var enterSelection = updateSelection.enter()
              .insert(element) // <<<--- this is the secret sauce of this whole file
              .attr(attr)
              .style('opacity', effectivelyZero);

          // exit
          // when container is a transition, exiting elements fade out (from opaque to transparent)
          var exitSelection = d3.transition(updateSelection.exit())
              .style('opacity', effectivelyZero)
              .remove();

          // when container is a transition, all properties of the transition (which can be interpolated)
          // will transition
          updateSelection = d3.transition(updateSelection)
              .style('opacity', 1);

          updateSelection.enter = d3.functor(enterSelection);
          updateSelection.exit = d3.functor(exitSelection);
          return updateSelection;
      };

      dataJoin.selector = function(x) {
          if (!arguments.length) {
              return selector;
          }
          selector = x;
          return dataJoin;
      };
      dataJoin.children = function(x) {
          if (!arguments.length) {
              return children;
          }
          children = x;
          return dataJoin;
      };
      dataJoin.element = function(x) {
          if (!arguments.length) {
              return element;
          }
          element = x;
          return dataJoin;
      };
      dataJoin.attr = function(x) {
          if (!arguments.length) {
              return attr;
          }

          if (arguments.length === 1) {
              attr = arguments[0];
          } else if (arguments.length === 2) {
              var dataKey = arguments[0];
              var value = arguments[1];

              attr[dataKey] = value;
          }

          return dataJoin;
      };
      dataJoin.key = function(x) {
          if (!arguments.length) {
              return key;
          }
          key = x;
          return dataJoin;
      };

      return dataJoin;
  }

  function isOrdinal(scale) {
      return scale.rangeExtent;
  }

  // ordinal axes have a rangeExtent function, this adds any padding that
  // was applied to the range. This functions returns the rangeExtent
  // if present, or range otherwise
  ///
  // NOTE: d3 uses very similar logic here:
  // https://github.com/mbostock/d3/blob/5b981a18db32938206b3579248c47205ecc94123/src/scale/scale.js#L8
  function range(scale) {
      // for non ordinal, simply return the range
      if (!isOrdinal(scale)) {
          return scale.range();
      }

      // For ordinal, use the rangeExtent. However, rangeExtent always provides
      // a non inverted range (i.e. extent[0] < extent[1]) regardless of the
      // range set on the scale. The logic below detects the inverted case.
      //
      // The d3 code that tackles the same issue doesn't have to deal with the inverted case.
      var scaleRange = scale.range();
      var extent = scale.rangeExtent();
      if (scaleRange.length <= 1) {
          // we cannot detect the inverted case if the range (and domain) has
          // a single item in it.
          return extent;
      }

      var inverted = scaleRange[0] > scaleRange[1];
      return inverted ? [extent[1], extent[0]] : extent;
  }

  // Ordinal and quantitative scales have different methods for setting the range. This
  // function detects the scale type and sets the range accordingly.
  function setRange(scale, scaleRange) {
      if (isOrdinal(scale)) {
          scale.rangePoints(scaleRange, 1);
      } else {
          scale.range(scaleRange);
      }
  }


  var scale$1 = Object.freeze({
      isOrdinal: isOrdinal,
      range: range,
      setRange: setRange
  });

  // applies the d3.functor to each element of an array, allowing a mixed
  // of functions and constants, e.g.
  // [0, function(d) { return d.foo; }]
  function functoredArray(x) {
      var functoredItems = x.map(function(item) {
          return d3.functor(item);
      });
      return function(d, i) {
          return functoredItems.map(function(j) {
              return j(d, i);
          });
      };
  }

  function rectangles(layoutStrategy) {

      var size = d3.functor([0, 0]),
          position = function(d, i) { return [d.x, d.y]; };

      var xScale = d3.scale.identity(),
          yScale = d3.scale.identity(),
          anchor = noop,
          strategy = layoutStrategy || identity,
          component = noop;

      var dataJoin = _dataJoin()
          .selector('g.rectangle')
          .element('g')
          .attr('class', 'rectangle');

      var rectangles = function(selection) {

          var xRange = range(xScale),
              yRange = range(yScale);

          if (strategy.containerWidth) {
              strategy.containerWidth(Math.max(xRange[0], xRange[1]));
          }
          if (strategy.containerHeight) {
              strategy.containerHeight(Math.max(yRange[0], yRange[1]));
          }

          selection.each(function(data, index) {
              var g = dataJoin(this, data);

              // obtain the rectangular bounding boxes for each child
              var childRects = data.map(function(d, i) {
                  var childPos = position(d, i);
                  var childSize = size(d, i);
                  return {
                      x: childPos[0],
                      y: childPos[1],
                      width: childSize[0],
                      height: childSize[1]
                  };
              });

              // apply the strategy to derive the layout
              var layout = strategy(childRects);

              // offset each rectangle accordingly
              g.attr('transform', function(d, i) {
                  var offset = layout[i];
                  return 'translate(' + offset.x + ', ' + offset.y + ')';
              });

              // set the anchor-point for each rectangle
              data.forEach(function(d, i) {
                  var pos = position(d, i);
                  var relativeAnchorPosition = [pos[0] - layout[i].x, pos[1] - layout[i].y];
                  anchor(d, i, relativeAnchorPosition);
              });

              // set the layout width / height so that children can use SVG layout if required
              g.attr({
                  'layout-width': function(d, i) { return childRects[i].width; },
                  'layout-height': function(d, i) { return childRects[i].height; }
              });

              g.call(component);
          });
      };

      rebindAll(rectangles, strategy);

      rectangles.size = function(x) {
          if (!arguments.length) {
              return size;
          }
          size = functoredArray(x);
          return rectangles;
      };

      rectangles.position = function(x) {
          if (!arguments.length) {
              return position;
          }
          position = functoredArray(x);
          return rectangles;
      };

      rectangles.anchor = function(x) {
          if (!arguments.length) {
              return anchor;
          }
          anchor = x;
          return rectangles;
      };

      rectangles.xScale = function(value) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = value;
          return rectangles;
      };

      rectangles.yScale = function(value) {
          if (!arguments.length) {
              return yScale;
          }
          yScale = value;
          return rectangles;
      };

      rectangles.component = function(value) {
          if (!arguments.length) {
              return component;
          }
          component = value;
          return rectangles;
      };

      return rectangles;
  }

  var layout$2 = {
      rectangles: rectangles,
      strategy: strategy
  };

  /* global requestAnimationFrame:false */

  // Debounce render to only occur once per frame
  function render(renderInternal) {
      var rafId = null;
      return function() {
          if (rafId == null) {
              rafId = requestAnimationFrame(function() {
                  rafId = null;
                  renderInternal();
              });
          }
      };
  }

  function noSnap(xScale, yScale) {
      return function(xPixel, yPixel) {
          return {
              x: xPixel,
              y: yPixel
          };
      };
  }

  function pointSnap(xScale, yScale, xValue, yValue, data, objectiveFunction) {
      // a default function that computes the distance between two points
      objectiveFunction = objectiveFunction || function(x, y, cx, cy) {
          var dx = x - cx,
              dy = y - cy;
          return dx * dx + dy * dy;
      };

      return function(xPixel, yPixel) {
          var nearest = data.map(function(d) {
              var diff = objectiveFunction(xPixel, yPixel, xScale(xValue(d)), yScale(yValue(d)));
              return [diff, d];
          })
          .reduce(function(accumulator, value) {
              return accumulator[0] > value[0] ? value : accumulator;
          }, [Number.MAX_VALUE, null])[1];

          return {
              datum: nearest,
              x: nearest ? xScale(xValue(nearest)) : xPixel,
              y: nearest ? yScale(yValue(nearest)) : yPixel
          };
      };
  }

  function seriesPointSnap(series, data, objectiveFunction) {
      return function(xPixel, yPixel) {
          var xScale = series.xScale(),
              yScale = series.yScale(),
              xValue = series.xValue(),
              yValue = (series.yValue || series.yCloseValue).call(series);
          return pointSnap(xScale, yScale, xValue, yValue, data, objectiveFunction)(xPixel, yPixel);
      };
  }

  function seriesPointSnapXOnly(series, data) {
      function objectiveFunction(x, y, cx, cy) {
          var dx = x - cx;
          return Math.abs(dx);
      }
      return seriesPointSnap(series, data, objectiveFunction);
  }

  function seriesPointSnapYOnly(series, data) {
      function objectiveFunction(x, y, cx, cy) {
          var dy = y - cy;
          return Math.abs(dy);
      }
      return seriesPointSnap(series, data, objectiveFunction);
  }

  // returns the width and height of the given element minus the padding.
  function innerDimensions(element) {
      var style = element.ownerDocument.defaultView.getComputedStyle(element);
      return {
          width: parseFloat(style.width) - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
          height: parseFloat(style.height) - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
      };
  }

  // the barWidth property of the various series takes a function which, when given an
  // array of x values, returns a suitable width. This function creates a width which is
  // equal to the smallest distance between neighbouring datapoints multiplied
  // by the given factor
  function fractionalBarWidth(fraction) {

      return function(pixelValues) {
          // return some default value if there are not enough datapoints to compute the width
          if (pixelValues.length <= 1) {
              return 10;
          }

          pixelValues.sort();

          // compute the distance between neighbouring items
          var neighbourDistances = d3.pairs(pixelValues)
              .map(function(tuple) {
                  return Math.abs(tuple[0] - tuple[1]);
              });

          var minDistance = d3.min(neighbourDistances);
          return fraction * minDistance;
      };
  }

  /**
   * The extent function enhances the functionality of the equivalent D3 extent function, allowing
   * you to pass an array of fields, or accessors, which will be used to derive the extent of the supplied array. For
   * example, if you have an array of items with properties of 'high' and 'low', you
   * can use <code>fc.util.extent().fields(['high', 'low'])(data)</code> to compute the extent of your data.
   *
   * @memberof fc.util
   */
  function extent() {

      var fields = [],
          extraPoint = null,
          padUnit = 'percent',
          pad = 0,
          symmetricalAbout = null;

      /**
      * @param {array} data an array of data points, or an array of arrays of data points
      */
      var extents = function(data) {

          // we need an array of arrays if we don't have one already
          if (!Array.isArray(data[0])) {
              data = [data];
          }

          // the fields can be a mixed array of property names or accessor functions
          fields = fields.map(function(field) {
              if (typeof field !== 'string') {
                  return field;
              }
              return function(d) {
                  return d[field];
              };
          });

          var dataMin = d3.min(data, function(d0) {
              return d3.min(d0, function(d1) {
                  return d3.min(fields.map(function(f) {
                      return f(d1);
                  }));
              });
          });

          var dataMax = d3.max(data, function(d0) {
              return d3.max(d0, function(d1) {
                  return d3.max(fields.map(function(f) {
                      return f(d1);
                  }));
              });
          });

          var dateExtent = Object.prototype.toString.call(dataMin) === '[object Date]';

          var min = dateExtent ? dataMin.getTime() : dataMin;
          var max = dateExtent ? dataMax.getTime() : dataMax;

          // apply symmetry rules
          if (symmetricalAbout != null) {
              var symmetrical = dateExtent ? symmetricalAbout.getTime() : symmetricalAbout;
              var distanceFromMax = Math.abs(max - symmetrical),
                  distanceFromMin = Math.abs(min - symmetrical),
                  halfRange = Math.max(distanceFromMax, distanceFromMin);

              min = symmetrical - halfRange;
              max = symmetrical + halfRange;
          }

          if (padUnit === 'domain') {
              // pad absolutely
              if (Array.isArray(pad)) {
                  min -= pad[0];
                  max += pad[1];
              } else {
                  min -= pad;
                  max += pad;
              }
          } else if (padUnit === 'percent') {
              // pad percentagely
              if (Array.isArray(pad)) {
                  var deltaArray = [pad[0] * (max - min), pad[1] * (max - min)];
                  min -= deltaArray[0];
                  max += deltaArray[1];
              } else {
                  var delta = pad * (max - min) / 2;
                  min -= delta;
                  max += delta;
              }
          }

          // Include the specified point in the range
          if (extraPoint !== null) {
              if (extraPoint < min) {
                  min = extraPoint;
              } else if (extraPoint > max) {
                  max = extraPoint;
              }
          }

          if (dateExtent) {
              min = new Date(min);
              max = new Date(max);
          }

          // Return the smallest and largest
          return [min, max];
      };

      /*
      * @param {array} fields the names of object properties that represent field values, or accessor functions.
      */
      extents.fields = function(x) {
          if (!arguments.length) {
              return fields;
          }

          // the fields parameter must be an array of field names,
          // but we can pass non-array types in
          if (!Array.isArray(x)) {
              x = [x];
          }

          fields = x;
          return extents;
      };

      extents.include = function(x) {
          if (!arguments.length) {
              return extraPoint;
          }
          extraPoint = x;
          return extents;
      };

      extents.padUnit = function(x) {
          if (!arguments.length) {
              return padUnit;
          }
          padUnit = x;
          return extents;
      };

      extents.pad = function(x) {
          if (!arguments.length) {
              return pad;
          }
          pad = x;
          return extents;
      };

      extents.symmetricalAbout = function(x) {
          if (!arguments.length) {
              return symmetricalAbout;
          }
          symmetricalAbout = x;
          return extents;
      };

      return extents;
  }

  // A rectangle is an object with top, left, bottom and right properties. Component
  // margin or padding properties can accept an integer, which is converted to a rectangle where each
  // property equals the given value. Also, a margin / padding may have properties missing, in
  // which case they default to zero.
  // This function expand an integer to a rectangle and fills missing properties.
  function expandRect(margin) {
      var expandedRect = margin;
      if (typeof(expandedRect) === 'number') {
          expandedRect = {
              top: margin,
              bottom: margin,
              left: margin,
              right: margin
          };
      }
      ['top', 'bottom', 'left', 'right'].forEach(function(direction) {
          if (!expandedRect[direction]) {
              expandedRect[direction] = 0;
          }
      });
      return expandedRect;
  }

  var util$1 = {
      dataJoin: _dataJoin,
      expandRect: expandRect,
      extent: extent,
      fn: fn,
      minimum: minimum,
      fractionalBarWidth: fractionalBarWidth,
      innerDimensions: innerDimensions,
      rebind: rebind,
      rebindAll: rebindAll,
      scale: scale$1,
      noSnap: noSnap,
      pointSnap: pointSnap,
      seriesPointSnap: seriesPointSnap,
      seriesPointSnapXOnly: seriesPointSnapXOnly,
      seriesPointSnapYOnly: seriesPointSnapYOnly,
      render: render,
      arrayFunctor: functoredArray,
      array: array
  };

  function measure() {

      var event = d3.dispatch('measuresource', 'measuretarget', 'measureclear'),
          xScale = d3.time.scale(),
          yScale = d3.scale.linear(),
          snap = function(_x, _y) {
              return noSnap(xScale, yScale)(_x, _y);
          },
          decorate = noop,
          xLabel = d3.functor(''),
          yLabel = d3.functor(''),
          padding = d3.functor(2);

      var x = function(d) { return d.x; },
          y = function(d) { return d.y; };

      var dataJoin = _dataJoin()
          .selector('g.measure')
          .element('g')
          .attr('class', 'measure');

      var measure = function(selection) {

          selection.each(function(data, index) {

              var container = d3.select(this)
                  .style('pointer-events', 'all')
                  .on('mouseenter.measure', mouseenter);

              var overlay = container.selectAll('rect')
                  .data([data]);

              overlay.enter()
                  .append('rect')
                  .style('visibility', 'hidden');

              container.select('rect')
                  .attr('x', xScale.range()[0])
                  .attr('y', yScale.range()[1])
                  .attr('width', xScale.range()[1])
                  .attr('height', yScale.range()[0]);

              var g = dataJoin(container, data);

              var enter = g.enter();
              enter.append('line')
                  .attr('class', 'tangent');
              enter.append('line')
                  .attr('class', 'horizontal');
              enter.append('line')
                  .attr('class', 'vertical');
              enter.append('text')
                  .attr('class', 'horizontal');
              enter.append('text')
                  .attr('class', 'vertical');

              g.select('line.tangent')
                  .attr('x1', function(d) { return x(d.source); })
                  .attr('y1', function(d) { return y(d.source); })
                  .attr('x2', function(d) { return x(d.target); })
                  .attr('y2', function(d) { return y(d.target); });

              g.select('line.horizontal')
                  .attr('x1', function(d) { return x(d.source); })
                  .attr('y1', function(d) { return y(d.source); })
                  .attr('x2', function(d) { return x(d.target); })
                  .attr('y2', function(d) { return y(d.source); })
                  .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

              g.select('line.vertical')
                  .attr('x1', function(d) { return x(d.target); })
                  .attr('y1', function(d) { return y(d.target); })
                  .attr('x2', function(d) { return x(d.target); })
                  .attr('y2', function(d) { return y(d.source); })
                  .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

              var paddingValue = padding.apply(this, arguments);

              g.select('text.horizontal')
                  .attr('x', function(d) { return x(d.source) + (x(d.target) - x(d.source)) / 2; })
                  .attr('y', function(d) { return y(d.source) - paddingValue; })
                  .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; })
                  .text(xLabel);

              g.select('text.vertical')
                  .attr('x', function(d) { return x(d.target) + paddingValue; })
                  .attr('y', function(d) { return y(d.source) + (y(d.target) - y(d.source)) / 2; })
                  .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; })
                  .text(yLabel);

              decorate(g, data, index);
          });
      };

      function updatePositions() {
          var container = d3.select(this);
          var datum = container.datum()[0];
          if (datum.state !== 'DONE') {
              var mouse = d3.mouse(this);
              var snapped = snap.apply(this, mouse);
              if (datum.state === 'SELECT_SOURCE') {
                  datum.source = datum.target = snapped;
              } else if (datum.state === 'SELECT_TARGET') {
                  datum.target = snapped;
              } else {
                  throw new Error('Unknown state ' + datum.state);
              }
          }
      }

      function mouseenter() {
          var container = d3.select(this)
              .on('click.measure', mouseclick)
              .on('mousemove.measure', mousemove)
              .on('mouseleave.measure', mouseleave);
          var data = container.datum();
          if (data[0] == null) {
              data.push({
                  state: 'SELECT_SOURCE'
              });
          }
          updatePositions.call(this);
          container.call(measure);
      }

      function mousemove() {
          var container = d3.select(this);
          updatePositions.call(this);
          container.call(measure);
      }

      function mouseleave() {
          var container = d3.select(this);
          var data = container.datum();
          if (data[0] != null && data[0].state === 'SELECT_SOURCE') {
              data.pop();
          }
          container.on('click.measure', null)
              .on('mousemove.measure', null)
              .on('mouseleave.measure', null);
      }

      function mouseclick() {
          var container = d3.select(this);
          var datum = container.datum()[0];
          switch (datum.state) {
          case 'SELECT_SOURCE':
              updatePositions.call(this);
              event.measuresource.apply(this, arguments);
              datum.state = 'SELECT_TARGET';
              break;
          case 'SELECT_TARGET':
              updatePositions.call(this);
              event.measuretarget.apply(this, arguments);
              datum.state = 'DONE';
              break;
          case 'DONE':
              event.measureclear.apply(this, arguments);
              datum.state = 'SELECT_SOURCE';
              updatePositions.call(this);
              break;
          default:
              throw new Error('Unknown state ' + datum.state);
          }
          container.call(measure);
      }

      measure.xScale = function(_x) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = _x;
          return measure;
      };
      measure.yScale = function(_x) {
          if (!arguments.length) {
              return yScale;
          }
          yScale = _x;
          return measure;
      };
      measure.snap = function(_x) {
          if (!arguments.length) {
              return snap;
          }
          snap = _x;
          return measure;
      };
      measure.decorate = function(_x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = _x;
          return measure;
      };
      measure.xLabel = function(_x) {
          if (!arguments.length) {
              return xLabel;
          }
          xLabel = d3.functor(_x);
          return measure;
      };
      measure.yLabel = function(_x) {
          if (!arguments.length) {
              return yLabel;
          }
          yLabel = d3.functor(_x);
          return measure;
      };
      measure.padding = function(_x) {
          if (!arguments.length) {
              return padding;
          }
          padding = d3.functor(_x);
          return measure;
      };

      d3.rebind(measure, event, 'on');

      return measure;
  }

  function container() {

      var padding = 0,
          component = noop,
          decorate = noop;

      var dataJoin = _dataJoin()
          .selector('g.container')
          .element('g')
          .attr({
              'class': 'container',
              'layout-style': 'flex: 1'
          });

      var container = function(selection) {
          selection.each(function(data, index) {
              var expandedPadding = expandRect(padding);

              var g = dataJoin(this, [data]);

              g.enter()
                  .append('rect')
                  .layout('flex', 1);

              g.enter()
                  .append('g')
                  .layout({
                      position: 'absolute',
                      top: expandedPadding.top,
                      left: expandedPadding.left,
                      bottom: expandedPadding.bottom,
                      right: expandedPadding.right
                  });

              d3.select(this).layout();

              g.select('g').call(component);

              decorate(g, data, index);
          });
      };

      container.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return container;
      };

      container.padding = function(x) {
          if (!arguments.length) {
              return padding;
          }
          padding = x;
          return container;
      };

      container.component = function(x) {
          if (!arguments.length) {
              return component;
          }
          component = x;
          return container;
      };

      return container;
  }

  function fibonacciFan() {

      var event = d3.dispatch('fansource', 'fantarget', 'fanclear'),
          xScale = d3.time.scale(),
          yScale = d3.scale.linear(),
          snap = function(_x, _y) {
              return noSnap(xScale, yScale)(_x, _y);
          },
          decorate = noop;

      var x = function(d) { return d.x; },
          y = function(d) { return d.y; };

      var dataJoin = _dataJoin()
          .selector('g.fan')
          .element('g')
          .attr('class', 'fan');

      var fan = function(selection) {

          selection.each(function(data, index) {

              var container = d3.select(this)
                  .style('pointer-events', 'all')
                  .on('mouseenter.fan', mouseenter);

              var overlay = container.selectAll('rect')
                  .data([data]);

              overlay.enter()
                  .append('rect')
                  .style('visibility', 'hidden');

              container.select('rect')
                  .attr('x', xScale.range()[0])
                  .attr('y', yScale.range()[1])
                  .attr('width', xScale.range()[1])
                  .attr('height', yScale.range()[0]);

              var g = dataJoin(container, data);

              g.each(function(d) {
                  d.x = xScale.range()[1];
                  d.ay = d.by = d.cy = y(d.target);

                  if (x(d.source) !== x(d.target)) {

                      if (d.state === 'DONE' && x(d.source) > x(d.target)) {
                          var temp = d.source;
                          d.source = d.target;
                          d.target = temp;
                      }

                      var gradient = (y(d.target) - y(d.source)) /
                          (x(d.target) - x(d.source));
                      var deltaX = d.x - x(d.source);
                      var deltaY = gradient * deltaX;
                      d.ay = 0.618 * deltaY + y(d.source);
                      d.by = 0.500 * deltaY + y(d.source);
                      d.cy = 0.382 * deltaY + y(d.source);
                  }
              });

              var enter = g.enter();
              enter.append('line')
                  .attr('class', 'trend');
              enter.append('line')
                  .attr('class', 'a');
              enter.append('line')
                  .attr('class', 'b');
              enter.append('line')
                  .attr('class', 'c');
              enter.append('polygon')
                  .attr('class', 'area');

              g.select('line.trend')
                  .attr('x1', function(d) { return x(d.source); })
                  .attr('y1', function(d) { return y(d.source); })
                  .attr('x2', function(d) { return x(d.target); })
                  .attr('y2', function(d) { return y(d.target); });

              g.select('line.a')
                  .attr('x1', function(d) { return x(d.source); })
                  .attr('y1', function(d) { return y(d.source); })
                  .attr('x2', function(d) { return d.x; })
                  .attr('y2', function(d) { return d.ay; })
                  .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

              g.select('line.b')
                  .attr('x1', function(d) { return x(d.source); })
                  .attr('y1', function(d) { return y(d.source); })
                  .attr('x2', function(d) { return d.x; })
                  .attr('y2', function(d) { return d.by; })
                  .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

              g.select('line.c')
                  .attr('x1', function(d) { return x(d.source); })
                  .attr('y1', function(d) { return y(d.source); })
                  .attr('x2', function(d) { return d.x; })
                  .attr('y2', function(d) { return d.cy; })
                  .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

              g.select('polygon.area')
                  .attr('points', function(d) {
                      return x(d.source) + ',' + y(d.source) + ' ' +
                          d.x + ',' + d.ay + ' ' +
                          d.x + ',' + d.cy;
                  })
                  .style('visibility', function(d) { return d.state !== 'DONE' ? 'hidden' : 'visible'; });

              decorate(g, data, index);
          });
      };

      function updatePositions() {
          var container = d3.select(this);
          var datum = container.datum()[0];
          if (datum.state !== 'DONE') {
              var mouse = d3.mouse(this);
              var snapped = snap.apply(this, mouse);
              if (datum.state === 'SELECT_SOURCE') {
                  datum.source = datum.target = snapped;
              } else if (datum.state === 'SELECT_TARGET') {
                  datum.target = snapped;
              } else {
                  throw new Error('Unknown state ' + datum.state);
              }
          }
      }

      function mouseenter() {
          var container = d3.select(this)
              .on('click.fan', mouseclick)
              .on('mousemove.fan', mousemove)
              .on('mouseleave.fan', mouseleave);
          var data = container.datum();
          if (data[0] == null) {
              data.push({
                  state: 'SELECT_SOURCE'
              });
          }
          updatePositions.call(this);
          container.call(fan);
      }

      function mousemove() {
          var container = d3.select(this);
          updatePositions.call(this);
          container.call(fan);
      }

      function mouseleave() {
          var container = d3.select(this);
          var data = container.datum();
          if (data[0] != null && data[0].state === 'SELECT_SOURCE') {
              data.pop();
          }
          container.on('click.fan', null)
              .on('mousemove.fan', null)
              .on('mouseleave.fan', null);
      }

      function mouseclick() {
          var container = d3.select(this);
          var datum = container.datum()[0];
          switch (datum.state) {
          case 'SELECT_SOURCE':
              updatePositions.call(this);
              event.fansource.apply(this, arguments);
              datum.state = 'SELECT_TARGET';
              break;
          case 'SELECT_TARGET':
              updatePositions.call(this);
              event.fantarget.apply(this, arguments);
              datum.state = 'DONE';
              break;
          case 'DONE':
              event.fanclear.apply(this, arguments);
              datum.state = 'SELECT_SOURCE';
              updatePositions.call(this);
              break;
          default:
              throw new Error('Unknown state ' + datum.state);
          }
          container.call(fan);
      }

      fan.xScale = function(_x) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = _x;
          return fan;
      };
      fan.yScale = function(_x) {
          if (!arguments.length) {
              return yScale;
          }
          yScale = _x;
          return fan;
      };
      fan.snap = function(_x) {
          if (!arguments.length) {
              return snap;
          }
          snap = _x;
          return fan;
      };
      fan.decorate = function(_x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = _x;
          return fan;
      };

      d3.rebind(fan, event, 'on');

      return fan;
  }

  function annotationLine() {

      var xScale = d3.time.scale(),
          yScale = d3.scale.linear(),
          value = identity,
          keyValue = index,
          label = value,
          decorate = noop,
          orient = 'horizontal';

      var dataJoin = _dataJoin()
          .selector('g.annotation')
          .element('g');

      var line = function(selection) {
          selection.each(function(data, selectionIndex) {

              // the value scale which the annotation 'value' relates to, the crossScale
              // is the other. Which is which depends on the orienation!
              var valueScale, crossScale, translation, lineProperty,
                  handleOne, handleTwo,
                  textAttributes = {x: -5, y: -5};
              switch (orient) {
              case 'horizontal':
                  translation = function(a, b) { return 'translate(' + a + ', ' + b + ')'; };
                  lineProperty = 'x2';
                  crossScale = xScale;
                  valueScale = yScale;
                  handleOne = 'left-handle';
                  handleTwo = 'right-handle';
                  break;

              case 'vertical':
                  translation = function(a, b) { return 'translate(' + b + ', ' + a + ')'; };
                  lineProperty = 'y2';
                  crossScale = yScale;
                  valueScale = xScale;
                  textAttributes.transform = 'rotate(-90)';
                  handleOne = 'bottom-handle';
                  handleTwo = 'top-handle';
                  break;

              default:
                  throw new Error('Invalid orientation');
              }

              var scaleRange = range(crossScale),
                  // the transform that sets the 'origin' of the annotation
                  containerTransform = function(d) {
                      var transform = valueScale(value(d));
                      return translation(scaleRange[0], transform);
                  },
                  scaleWidth = scaleRange[1] - scaleRange[0];

              var container = d3.select(this);

              // Create a group for each line
              dataJoin.attr('class', 'annotation ' + orient);
              var g = dataJoin(container, data);

              // create the outer container and line
              var enter = g.enter()
                  .attr('transform', containerTransform);
              enter.append('line')
                  .attr(lineProperty, scaleWidth);

              // create containers at each end of the annotation
              enter.append('g')
                  .classed(handleOne, true);

              enter.append('g')
                  .classed(handleTwo, true)
                  .attr('transform', translation(scaleWidth, 0))
                  .append('text')
                  .attr(textAttributes);

              // Update

              // translate the parent container to the left hand edge of the annotation
              g.attr('transform', containerTransform);

              // update the elements that depend on scale width
              g.select('line')
                  .attr(lineProperty, scaleWidth);
              g.select('g.' + handleTwo)
                  .attr('transform', translation(scaleWidth, 0));

              // Update the text label
              g.select('text')
                  .text(label);

              decorate(g, data, selectionIndex);
          });
      };

      line.xScale = function(x) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = x;
          return line;
      };
      line.yScale = function(x) {
          if (!arguments.length) {
              return yScale;
          }
          yScale = x;
          return line;
      };
      line.value = function(x) {
          if (!arguments.length) {
              return value;
          }
          value = d3.functor(x);
          return line;
      };
      line.keyValue = function(x) {
          if (!arguments.length) {
              return keyValue;
          }
          keyValue = d3.functor(x);
          return line;
      };
      line.label = function(x) {
          if (!arguments.length) {
              return label;
          }
          label = d3.functor(x);
          return line;
      };
      line.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return line;
      };
      line.orient = function(x) {
          if (!arguments.length) {
              return orient;
          }
          orient = x;
          return line;
      };
      return line;
  }

  // The multi series does some data-join gymnastics to ensure we don't -
  // * Create unnecessary intermediate DOM nodes
  // * Manipulate the data specified by the user
  // This is achieved by data joining the series array to the container but
  // overriding where the series value is stored on the node (__series__) and
  // forcing the node datum (__data__) to be the user supplied data (via mapping).

  function multiSeries() {

      var xScale = d3.time.scale(),
          yScale = d3.scale.linear(),
          series = [],
          mapping = context,
          key = index,
          decorate = noop;

      var dataJoin = _dataJoin()
          .selector('g.multi')
          .children(true)
          .attr('class', 'multi')
          .element('g')
          .key(function(d, i) {
              // This function is invoked twice, the first pass is to pull the key
              // value from the DOM nodes and the second pass is to pull the key
              // value from the data values.
              // As we store the series as an additional property on the node, we
              // look for that first and if we find it assume we're being called
              // during the first pass. Otherwise we assume it's the second pass
              // and pull the series from the data value.
              var dataSeries = this.__series__ || d;
              return key.call(this, dataSeries, i);
          });

      var multi = function(selection) {

          selection.each(function(data) {

              var g = dataJoin(this, series);

              g.each(function(dataSeries, i) {
                  // We must always assign the series to the node, as the order
                  // may have changed. N.B. in such a case the output is most
                  // likely garbage (containers should not be re-used) but by
                  // doing this we at least make it debuggable garbage :)
                  this.__series__ = dataSeries;

                  (dataSeries.xScale || dataSeries.x).call(dataSeries, xScale);
                  (dataSeries.yScale || dataSeries.y).call(dataSeries, yScale);

                  d3.select(this)
                      .datum(mapping.call(data, dataSeries, i))
                      .call(dataSeries);
              });

              // order is not available on a transition selection
              d3.selection.prototype.order.call(g);

              decorate(g);
          });
      };

      multi.xScale = function(x) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = x;
          return multi;
      };
      multi.yScale = function(x) {
          if (!arguments.length) {
              return yScale;
          }
          yScale = x;
          return multi;
      };
      multi.series = function(x) {
          if (!arguments.length) {
              return series;
          }
          series = x;
          return multi;
      };
      multi.mapping = function(x) {
          if (!arguments.length) {
              return mapping;
          }
          mapping = x;
          return multi;
      };
      multi.key = function(x) {
          if (!arguments.length) {
              return key;
          }
          key = x;
          return multi;
      };
      multi.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return multi;
      };

      return multi;
  }

  function xyBase() {

      var xScale = d3.time.scale(),
          yScale = d3.scale.linear(),
          y0Value = d3.functor(0),
          x0Value = d3.functor(0),
          xValue = function(d, i) { return d.date; },
          yValue = function(d, i) { return d.close; };

      function base() { }

      base.x0 = function(d, i) {
          return xScale(x0Value(d, i));
      };
      base.y0 = function(d, i) {
          return yScale(y0Value(d, i));
      };
      base.x = base.x1 = function(d, i) {
          return xScale(xValue(d, i));
      };
      base.y = base.y1 = function(d, i) {
          return yScale(yValue(d, i));
      };
      base.defined = function(d, i) {
          return x0Value(d, i) != null && y0Value(d, i) != null &&
              xValue(d, i) != null && yValue(d, i) != null;
      };

      base.xScale = function(x) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = x;
          return base;
      };
      base.yScale = function(x) {
          if (!arguments.length) {
              return yScale;
          }
          yScale = x;
          return base;
      };
      base.x0Value = function(x) {
          if (!arguments.length) {
              return x0Value;
          }
          x0Value = d3.functor(x);
          return base;
      };
      base.y0Value = function(x) {
          if (!arguments.length) {
              return y0Value;
          }
          y0Value = d3.functor(x);
          return base;
      };
      base.xValue = base.x1Value = function(x) {
          if (!arguments.length) {
              return xValue;
          }
          xValue = d3.functor(x);
          return base;
      };
      base.yValue = base.y1Value = function(x) {
          if (!arguments.length) {
              return yValue;
          }
          yValue = d3.functor(x);
          return base;
      };

      return base;
  }

  function point() {

      var decorate = noop,
          symbol = d3.svg.symbol();

      var base = xyBase();

      var dataJoin = _dataJoin()
          .selector('g.point')
          .element('g')
          .attr('class', 'point');

      var containerTransform = function(d, i) {
          return 'translate(' + base.x(d, i) + ', ' + base.y(d, i) + ')';
      };

      var point = function(selection) {

          selection.each(function(data, index) {

              var filteredData = data.filter(base.defined);

              var g = dataJoin(this, filteredData);
              g.enter()
                  .attr('transform', containerTransform)
                  .append('path');

              g.attr('transform', containerTransform)
                  .select('path')
                  .attr('d', symbol);

              decorate(g, data, index);
          });
      };

      point.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return point;
      };

      d3.rebind(point, base, 'xScale', 'xValue', 'yScale', 'yValue');
      d3.rebind(point, dataJoin, 'key');
      d3.rebind(point, symbol, 'size', 'type');

      return point;
  }

  function crosshair() {

      var event = d3.dispatch('trackingstart', 'trackingmove', 'trackingend'),
          xScale = d3.time.scale(),
          yScale = d3.scale.linear(),
          snap = function(_x, _y) {
              return noSnap(xScale, yScale)(_x, _y);
          },
          decorate = noop;

      var x = function(d) { return d.x; },
          y = function(d) { return d.y; };

      var dataJoin = _dataJoin()
          .children(true)
          .selector('g.crosshair')
          .element('g')
          .attr('class', 'crosshair');

      var pointSeries = point()
          .xValue(x)
          .yValue(y);

      var horizontalLine = annotationLine()
          .value(y)
          .label(function(d) { return d.y; });

      var verticalLine = annotationLine()
          .orient('vertical')
          .value(x)
          .label(function(d) { return d.x; });

      // the line annotations used to render the crosshair are positioned using
      // screen coordinates. This function constructs a suitable scale for rendering
      // these annotations.
      function identityScale(scale) {
          return d3.scale.identity()
              .range(range(scale));
      }

      var crosshair = function(selection) {

          selection.each(function(data, index) {

              var container = d3.select(this)
                  .style('pointer-events', 'all')
                  .on('mouseenter.crosshair', mouseenter)
                  .on('mousemove.crosshair', mousemove)
                  .on('mouseleave.crosshair', mouseleave);

              var overlay = container.selectAll('rect')
                  .data([data]);

              overlay.enter()
                  .append('rect')
                  .style('visibility', 'hidden');

              container.select('rect')
                  .attr('x', range(xScale)[0])
                  .attr('y', range(yScale)[1])
                  .attr('width', range(xScale)[1])
                  .attr('height', range(yScale)[0]);

              var crosshairElement = dataJoin(container, data);

              crosshairElement.enter()
                  .style('pointer-events', 'none');

              var multi = multiSeries()
                  .series([horizontalLine, verticalLine, pointSeries])
                  .xScale(identityScale(xScale))
                  .yScale(identityScale(yScale))
                  .mapping(function() {
                      return [this];
                  });

              crosshairElement.call(multi);

              decorate(crosshairElement, data, index);
          });
      };

      function mouseenter() {
          var mouse = d3.mouse(this);
          var container = d3.select(this);
          var snapped = snap.apply(this, mouse);
          var data = container.datum();
          data.push(snapped);
          container.call(crosshair);
          event.trackingstart.apply(this, arguments);
      }

      function mousemove() {
          var mouse = d3.mouse(this);
          var container = d3.select(this);
          var snapped = snap.apply(this, mouse);
          var data = container.datum();
          data[data.length - 1] = snapped;
          container.call(crosshair);
          event.trackingmove.apply(this, arguments);
      }

      function mouseleave() {
          var container = d3.select(this);
          var data = container.datum();
          data.pop();
          container.call(crosshair);
          event.trackingend.apply(this, arguments);
      }

      crosshair.xScale = function(_x) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = _x;
          return crosshair;
      };
      crosshair.yScale = function(_x) {
          if (!arguments.length) {
              return yScale;
          }
          yScale = _x;
          return crosshair;
      };
      crosshair.snap = function(_x) {
          if (!arguments.length) {
              return snap;
          }
          snap = _x;
          return crosshair;
      };
      crosshair.decorate = function(_x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = _x;
          return crosshair;
      };

      d3.rebind(crosshair, event, 'on');

      rebind(crosshair, horizontalLine, {
          yLabel: 'label'
      });

      rebind(crosshair, verticalLine, {
          xLabel: 'label'
      });

      return crosshair;
  }

  var tool = {
      crosshair: crosshair,
      fibonacciFan: fibonacciFan,
      container: container,
      measure: measure
  };

  // Renders an error bar series as an SVG path based on the given array of datapoints.
  function svgErrorBar() {

      var x = function(d, i) { return d.x; },
          y = function(d, i) { return d.y; },
          errorHigh = function(d, i) { return d.errorHigh; },
          errorLow = function(d, i) { return d.errorLow; },
          orient = 'vertical',
          barWidth = d3.functor(5);

      var errorBar = function(data) {

          return data.map(function(d, i) {
              var halfWidth = barWidth(d, i) / 2,
                  errorTotal = errorHigh(d, i) - errorLow(d, i),
                  yBottom = y(d, i) - errorLow(d, i),
                  yTop = errorHigh(d, i) - y(d, i),
                  xBottom = x(d, i) - errorLow(d, i),
                  xTop = errorHigh(d, i) - x(d, i);

              var errorVertical = '';
              var errorHorizontal = '';

              if (orient === 'vertical') {
                  var horizontalBar = 'h' + (-halfWidth) + 'h' + (2 * halfWidth) + 'h' + (-halfWidth),
                      verticalToHigh = 'v' + (-errorTotal);
                  errorVertical = 'M0,' + yBottom + horizontalBar + verticalToHigh + horizontalBar + 'M0,' + yTop;
              } else {
                  var verticalBar = 'v' + (-halfWidth) + 'v' + (2 * halfWidth) + 'v' + (-halfWidth),
                      horizontalToHigh = 'h' + (-errorTotal);
                  errorHorizontal = 'M' + xBottom + ',0' + verticalBar + horizontalToHigh + verticalBar + 'M' + xTop + ',0';
              }

              return errorVertical + errorHorizontal;
          })
          .join('');
      };

      errorBar.x = function(_x) {
          if (!arguments.length) {
              return x;
          }
          x = d3.functor(_x);
          return errorBar;
      };
      errorBar.y = function(_x) {
          if (!arguments.length) {
              return y;
          }
          y = d3.functor(_x);
          return errorBar;
      };
      errorBar.errorHigh = function(_x) {
          if (!arguments.length) {
              return errorHigh;
          }
          errorHigh = d3.functor(_x);
          return errorBar;
      };
      errorBar.errorLow = function(_x) {
          if (!arguments.length) {
              return errorLow;
          }
          errorLow = d3.functor(_x);
          return errorBar;
      };
      errorBar.barWidth = function(_x) {
          if (!arguments.length) {
              return barWidth;
          }
          barWidth = d3.functor(_x);
          return errorBar;
      };
      errorBar.orient = function(_x) {
          if (!arguments.length) {
              return orient;
          }
          orient = _x;
          return errorBar;
      };

      return errorBar;

  }

  // Renders an OHLC as an SVG path based on the given array of datapoints. Each
  // OHLC has a fixed width, whilst the x, open, high, low and close positions are
  // obtained from each point via the supplied accessor functions.
  function svgOhlc() {

      var x = function(d, i) { return d.date; },
          open = function(d, i) { return d.open; },
          high = function(d, i) { return d.high; },
          low = function(d, i) { return d.low; },
          close = function(d, i) { return d.close; },
          width = d3.functor(3);

      var ohlc = function(data) {

          return data.map(function(d, i) {
              var xValue = x(d, i),
                  yOpen = open(d, i),
                  yHigh = high(d, i),
                  yLow = low(d, i),
                  yClose = close(d, i),
                  halfWidth = width(d, i) / 2;

              var moveToLow = 'M' + xValue + ',' + yLow,
                  verticalToHigh = 'V' + yHigh,
                  openTick = 'M' + xValue + ',' + yOpen + 'h' + (-halfWidth),
                  closeTick = 'M' + xValue + ',' + yClose + 'h' + halfWidth;
              return moveToLow + verticalToHigh + openTick + closeTick;
          })
          .join('');
      };

      ohlc.x = function(_x) {
          if (!arguments.length) {
              return x;
          }
          x = d3.functor(_x);
          return ohlc;
      };
      ohlc.open = function(_x) {
          if (!arguments.length) {
              return open;
          }
          open = d3.functor(_x);
          return ohlc;
      };
      ohlc.high = function(_x) {
          if (!arguments.length) {
              return high;
          }
          high = d3.functor(_x);
          return ohlc;
      };
      ohlc.low = function(_x) {
          if (!arguments.length) {
              return low;
          }
          low = d3.functor(_x);
          return ohlc;
      };
      ohlc.close = function(_x) {
          if (!arguments.length) {
              return close;
          }
          close = d3.functor(_x);
          return ohlc;
      };
      ohlc.width = function(_x) {
          if (!arguments.length) {
              return width;
          }
          width = d3.functor(_x);
          return ohlc;
      };

      return ohlc;

  }

  // Renders a candlestick as an SVG path based on the given array of datapoints. Each
  // candlestick has a fixed width, whilst the x, open, high, low and close positions are
  // obtained from each point via the supplied accessor functions.
  function candlestickSvg() {

      var x = function(d, i) { return d.date; },
          open = function(d, i) { return d.open; },
          high = function(d, i) { return d.high; },
          low = function(d, i) { return d.low; },
          close = function(d, i) { return d.close; },
          width = d3.functor(3);

      var candlestick = function(data) {

          return data.map(function(d, i) {
              var xValue = x(d, i),
                  yOpen = open(d, i),
                  yHigh = high(d, i),
                  yLow = low(d, i),
                  yClose = close(d, i),
                  barWidth = width(d, i);

              // Move to the opening price
              var body = 'M' + (xValue - barWidth / 2) + ',' + yOpen +
                  // Draw the width
                  'h' + barWidth +
                  // Draw to the closing price (vertically)
                  'V' + yClose +
                  // Draw the width
                  'h' + -barWidth +
                  // Move back to the opening price
                  'V' + yOpen +
                  // Close the path
                  'z';

              // Move to the max price of close or open; draw the high wick
              // N.B. Math.min() is used as we're dealing with pixel values,
              // the lower the pixel value, the higher the price!
              var highWick = 'M' + xValue + ',' + Math.min(yClose, yOpen) +
                  'V' + yHigh;

              // Move to the min price of close or open; draw the low wick
              // N.B. Math.max() is used as we're dealing with pixel values,
              // the higher the pixel value, the lower the price!
              var lowWick = 'M' + xValue + ',' + Math.max(yClose, yOpen) +
                  'V' + yLow;

              return body + highWick + lowWick;
          })
          .join('');
      };

      candlestick.x = function(_x) {
          if (!arguments.length) {
              return x;
          }
          x = d3.functor(_x);
          return candlestick;
      };
      candlestick.open = function(_x) {
          if (!arguments.length) {
              return open;
          }
          open = d3.functor(_x);
          return candlestick;
      };
      candlestick.high = function(_x) {
          if (!arguments.length) {
              return high;
          }
          high = d3.functor(_x);
          return candlestick;
      };
      candlestick.low = function(_x) {
          if (!arguments.length) {
              return low;
          }
          low = d3.functor(_x);
          return candlestick;
      };
      candlestick.close = function(_x) {
          if (!arguments.length) {
              return close;
          }
          close = d3.functor(_x);
          return candlestick;
      };
      candlestick.width = function(_x) {
          if (!arguments.length) {
              return width;
          }
          width = d3.functor(_x);
          return candlestick;
      };

      return candlestick;

  }

  // Renders a bar series as an SVG path based on the given array of datapoints. Each
  // bar has a fixed width, whilst the x, y and height are obtained from each data
  // point via the supplied accessor functions.
  function svgBar() {

      var x = function(d, i) { return d.x; },
          y = function(d, i) { return d.y; },
          horizontalAlign = 'center',
          verticalAlign = 'center',
          height = function(d, i) { return d.height; },
          width = d3.functor(3);

      var bar = function(data, index) {

          return data.map(function(d, i) {
              var xValue = x.call(this, d, index || i),
                  yValue = y.call(this, d, index || i),
                  barHeight = height.call(this, d, index || i),
                  barWidth = width.call(this, d, index || i);

              var horizontalOffset;
              switch (horizontalAlign) {
              case 'left':
                  horizontalOffset = barWidth;
                  break;
              case 'right':
                  horizontalOffset = 0;
                  break;
              case 'center':
                  horizontalOffset = barWidth / 2;
                  break;
              default:
                  throw new Error('Invalid horizontal alignment ' + horizontalAlign);
              }

              var verticalOffset;
              switch (verticalAlign) {
              case 'bottom':
                  verticalOffset = -barHeight;
                  break;
              case 'top':
                  verticalOffset = 0;
                  break;
              case 'center':
                  verticalOffset = barHeight / 2;
                  break;
              default:
                  throw new Error('Invalid vertical alignment ' + verticalAlign);
              }

              // Move to the start location
              var body = 'M' + (xValue - horizontalOffset) + ',' + (yValue - verticalOffset) +
                  // Draw the width
                  'h' + barWidth +
                  // Draw to the top
                  'v' + barHeight +
                  // Draw the width
                  'h' + -barWidth +
                  // Close the path
                  'z';
              return body;
          }, this)
          .join('');
      };

      bar.x = function(_x) {
          if (!arguments.length) {
              return x;
          }
          x = d3.functor(_x);
          return bar;
      };
      bar.y = function(_x) {
          if (!arguments.length) {
              return y;
          }
          y = d3.functor(_x);
          return bar;
      };
      bar.width = function(_x) {
          if (!arguments.length) {
              return width;
          }
          width = d3.functor(_x);
          return bar;
      };
      bar.horizontalAlign = function(_x) {
          if (!arguments.length) {
              return horizontalAlign;
          }
          horizontalAlign = _x;
          return bar;
      };
      bar.height = function(_x) {
          if (!arguments.length) {
              return height;
          }
          height = d3.functor(_x);
          return bar;
      };
      bar.verticalAlign = function(_x) {
          if (!arguments.length) {
              return verticalAlign;
          }
          verticalAlign = _x;
          return bar;
      };
      return bar;

  }

  // A drop-in replacement for the D3 axis, supporting the decorate pattern.
  function axisSvg() {

      var scale = d3.scale.identity(),
          decorate = noop,
          orient = 'bottom',
          tickArguments = [10],
          tickValues = null,
          tickFormat = null,
          outerTickSize = 6,
          innerTickSize = 6,
          tickPadding = 3,
          svgDomainLine = d3.svg.line();

      var dataJoin = _dataJoin()
          .selector('g.tick')
          .element('g')
          .key(identity)
          .attr('class', 'tick');

      var domainPathDataJoin = _dataJoin()
          .selector('path.domain')
          .element('path')
          .attr('class', 'domain');

      // returns a function that creates a translation based on
      // the bound data
      function containerTranslate(s, trans) {
          return function(d) {
              return trans(s(d), 0);
          };
      }

      function translate(x, y) {
          if (isVertical()) {
              return 'translate(' + y + ', ' + x + ')';
          } else {
              return 'translate(' + x + ', ' + y + ')';
          }
      }

      function pathTranspose(arr) {
          if (isVertical()) {
              return arr.map(function(d) {
                  return [d[1], d[0]];
              });
          } else {
              return arr;
          }
      }

      function isVertical() {
          return orient === 'left' || orient === 'right';
      }

      function tryApply(fn, defaultVal) {
          return scale[fn] ? scale[fn].apply(scale, tickArguments) : defaultVal;
      }

      var axis = function(selection) {

          selection.each(function(data, index) {

              // Stash a snapshot of the new scale, and retrieve the old snapshot.
              var scaleOld = this.__chart__ || scale;
              this.__chart__ = scale.copy();

              var ticksArray = tickValues == null ? tryApply('ticks', scale.domain()) : tickValues;
              var tickFormatter = tickFormat == null ? tryApply('tickFormat', identity) : tickFormat;
              var sign = orient === 'bottom' || orient === 'right' ? 1 : -1;
              var container = d3.select(this);

              // add the domain line
              var range$$ = range(scale);
              var domainPathData = pathTranspose([
                  [range$$[0], sign * outerTickSize],
                  [range$$[0], 0],
                  [range$$[1], 0],
                  [range$$[1], sign * outerTickSize]
              ]);

              var domainLine = domainPathDataJoin(container, [data]);
              domainLine
                  .attr('d', svgDomainLine(domainPathData));

              // datajoin and construct the ticks / label
              dataJoin.attr({
                  // set the initial tick position based on the previous scale
                  // in order to get the correct enter transition - however, for ordinal
                  // scales the tick will not exist on the old scale, so use the current position
                  'transform': containerTranslate(isOrdinal(scale) ? scale : scaleOld, translate)
              });

              var g = dataJoin(container, ticksArray);

              // enter
              g.enter().append('path');

              var labelOffset = sign * (innerTickSize + tickPadding);
              g.enter()
                  .append('text')
                  .attr('transform', translate(0, labelOffset));

              // update
              g.attr('class', 'tick orient-' + orient);

              g.attr('transform', containerTranslate(scale, translate));

              g.selectAll('path')
                  .attr('d', function(d) {
                      return svgDomainLine(pathTranspose([
                          [0, 0], [0, sign * innerTickSize]
                      ]));
                  });

              g.selectAll('text')
                 .attr('transform', translate(0, labelOffset))
                 .text(tickFormatter);

              // exit - for non ordinal scales, exit by animating the tick to its new location
              if (!isOrdinal(scale)) {
                  g.exit()
                      .attr('transform', containerTranslate(scale, translate));
              }

              decorate(g, data, index);
          });
      };

      axis.scale = function(x) {
          if (!arguments.length) {
              return scale;
          }
          scale = x;
          return axis;
      };

      axis.ticks = function(x) {
          if (!arguments.length) {
              return tickArguments;
          }
          tickArguments = arguments;
          return axis;
      };

      axis.tickValues = function(x) {
          if (!arguments.length) {
              return tickValues;
          }
          tickValues = x;
          return axis;
      };

      axis.tickFormat = function(x) {
          if (!arguments.length) {
              return tickFormat;
          }
          tickFormat = x;
          return axis;
      };

      axis.tickSize = function(x) {
          var n = arguments.length;
          if (!n) {
              return innerTickSize;
          }
          innerTickSize = Number(x);
          outerTickSize = Number(arguments[n - 1]);
          return axis;
      };

      axis.innerTickSize = function(x) {
          if (!arguments.length) {
              return innerTickSize;
          }
          innerTickSize = Number(x);
          return axis;
      };

      axis.outerTickSize = function(x) {
          if (!arguments.length) {
              return outerTickSize;
          }
          outerTickSize = Number(x);
          return axis;
      };

      axis.tickPadding = function(x) {
          if (!arguments.length) {
              return tickPadding;
          }
          tickPadding = x;
          return axis;
      };

      axis.orient = function(x) {
          if (!arguments.length) {
              return orient;
          }
          orient = x;
          return axis;
      };

      axis.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return axis;
      };

      return axis;
  }

  var svg = {
      axis: axisSvg,
      bar: svgBar,
      candlestick: candlestickSvg,
      ohlc: svgOhlc,
      errorBar: svgErrorBar
  };

  function waterfall$1() {

      var xValueKey = '',
          yValue = function(d) { return d.y; },
          startsWithTotal = false,
          totals = function(d, i, data) {
              if (i === data.length - 1) {
                  return 'Final';
              }
          },
          directions = {
              up: 'up',
              down: 'down',
              unchanged: 'unchanged'
          };

      var waterfall = function(data) {
          var length = data.length,
              i = 0,
              previousEnd = 0,
              start,
              end,
              total,
              result = [],
              finalIndex = length - 1;

          if (startsWithTotal) {
              // First value is a total
              previousEnd = yValue(data[0]);
              result.push({
                  x: data[0][xValueKey],
                  y0: 0,
                  y1: previousEnd,
                  direction: directions.unchanged
              });
              i = 1;
          }

          for (i; i < length; i += 1) {
              start = previousEnd;
              end = yValue(data[i]) + previousEnd;

              result.push({
                  x: data[i][xValueKey],
                  y0: start,
                  y1: end,
                  direction: end - start > 0 ? directions.up : directions.down
              });

              total = totals(data[i], i, data);
              if (total) {
                  // Insert a total value here
                  result.push({
                      x: total,
                      y0: 0,
                      y1: end,
                      direction: directions.unchanged
                  });
              }

              previousEnd = end;
          }

          return result;
      };

      waterfall.xValueKey = function(x) {
          if (!arguments.length) {
              return xValueKey;
          }
          xValueKey = x;
          return waterfall;
      };

      waterfall.yValue = function(x) {
          if (!arguments.length) {
              return yValue;
          }
          yValue = x;
          return waterfall;
      };

      waterfall.total = function(x) {
          if (!arguments.length) {
              return totals;
          }
          totals = x;
          return waterfall;
      };

      waterfall.startsWithTotal = function(x) {
          if (!arguments.length) {
              return startsWithTotal;
          }
          startsWithTotal = x;
          return waterfall;
      };

      return waterfall;
  }

  var algorithm$1 = {
      waterfall: waterfall$1
  };

  // The bar series renders a vertical (column) or horizontal (bar) series. In order
  // to provide a common implementation there are a number of functions that specialise
  // the rendering logic based on the 'orient' property.
  function _bar() {

      var decorate = noop,
          barWidth = fractionalBarWidth(0.75),
          orient = 'vertical',
          pathGenerator = svgBar();

      var base = xyBase()
        .xValue(function(d, i) { return orient === 'vertical' ? d.date : d.close; })
        .yValue(function(d, i) { return orient === 'vertical' ? d.close : d.date; });

      var dataJoin = _dataJoin()
          .selector('g.bar')
          .element('g');

      function containerTranslation(d, i) {
          if (orient === 'vertical') {
              return 'translate(' + base.x1(d, i) + ', ' + base.y0(d, i) + ')';
          } else {
              return 'translate(' + base.x0(d, i) + ', ' + base.y1(d, i) + ')';
          }
      }

      function barHeight(d, i) {
          if (orient === 'vertical') {
              return base.y1(d, i) - base.y0(d, i);
          } else {
              return base.x1(d, i) - base.x0(d, i);
          }
      }

      function valueAxisDimension(generator) {
          if (orient === 'vertical') {
              return generator.height;
          } else {
              return generator.width;
          }
      }

      function crossAxisDimension(generator) {
          if (orient === 'vertical') {
              return generator.width;
          } else {
              return generator.height;
          }
      }

      function crossAxisValueFunction() {
          return orient === 'vertical' ? base.x : base.y;
      }

      var bar = function(selection) {
          selection.each(function(data, index) {

              if (orient !== 'vertical' && orient !== 'horizontal') {
                  throw new Error('The bar series does not support an orientation of ' + orient);
              }

              dataJoin.attr('class', 'bar ' + orient);

              var filteredData = data.filter(base.defined);

              pathGenerator.x(0)
                  .y(0)
                  .width(0)
                  .height(0);

              if (orient === 'vertical') {
                  pathGenerator.verticalAlign('top');
              } else {
                  pathGenerator.horizontalAlign('right');
              }

              // set the width of the bars
              var width = barWidth(filteredData.map(crossAxisValueFunction()));
              crossAxisDimension(pathGenerator)(width);

              var g = dataJoin(this, filteredData);

              // within the enter selection the pathGenerator creates a zero
              // height bar. As a result, when used with a transition the bar grows
              // from y0 to y1 (y)
              g.enter()
                  .attr('transform', containerTranslation)
                  .append('path')
                  .attr('d', function(d) { return pathGenerator([d]); });

              // set the bar to its correct height
              valueAxisDimension(pathGenerator)(barHeight);

              g.attr('transform', containerTranslation)
                  .select('path')
                  .attr('d', function(d) { return pathGenerator([d]); });

              decorate(g, filteredData, index);
          });
      };

      bar.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return bar;
      };
      bar.barWidth = function(x) {
          if (!arguments.length) {
              return barWidth;
          }
          barWidth = d3.functor(x);
          return bar;
      };
      bar.orient = function(x) {
          if (!arguments.length) {
              return orient;
          }
          orient = x;
          return bar;
      };

      d3.rebind(bar, base, 'xScale', 'xValue', 'x1Value', 'x0Value', 'yScale', 'yValue', 'y1Value', 'y0Value');
      d3.rebind(bar, dataJoin, 'key');

      return bar;
  }

  function waterfall() {

      function isVertical() {
          return bar.orient() === 'vertical';
      }

      var bar = _bar();

      var waterfall = function(selection) {
          bar
              .xValue(function(d, i) { return isVertical() ? d.x : d.y1; })
              .yValue(function(d, i) { return isVertical() ? d.y1 : d.x; })
              .x0Value(function(d, i) { return isVertical() ? 0 : d.y0; })
              .y0Value(function(d, i) { return isVertical() ? d.y0 : 0; })
              .decorate(function(g, d1, i) {
                  g.enter()
                      .attr('class', 'waterfall ' + bar.orient())
                      .classed('up', function(d) { return d.direction === 'up'; })
                      .classed('down', function(d) { return d.direction === 'down'; });
              });

          bar(selection);
      };

      rebindAll(waterfall, bar);

      return waterfall;
  }

  function errorBase() {

      var xScale = d3.time.scale(),
          yScale = d3.scale.linear(),
          errorHigh = d3.functor(0),
          errorLow = d3.functor(0),
          xValue = function(d, i) { return d.date; },
          yValue = function(d, i) { return d.close; },
          orient = 'vertical',
          barWidth = d3.functor(5);

      function base() { }

      base.width = function(data, orientation) {
          if (orientation === 'vertical') {
              return barWidth(data.map(function(d, i) {
                  return xScale(xValue(d, i));
              }));
          } else {
              return barWidth(data.map(function(d, i) {
                  return yScale(yValue(d, i));
              }));
          }
      };

      base.values = function(d, i) {
          if (orient === 'vertical') {
              return {
                  x: xScale(xValue(d, i)),
                  y: yScale(yValue(d, i)),
                  errorHigh: yScale(errorHigh(d, i)),
                  errorLow: yScale(errorLow(d, i))
              };
          } else {
              return {
                  x: xScale(xValue(d, i)),
                  y: yScale(yValue(d, i)),
                  errorHigh: xScale(errorHigh(d, i)),
                  errorLow: xScale(errorLow(d, i))
              };
          }
      };
      base.defined = function(d, i) {
          return errorLow(d, i) != null && errorHigh(d, i) != null
              && xValue(d, i) != null && yValue(d, i) != null;
      };

      base.orient = function(x) {
          if (!arguments.length) {
              return orient;
          }
          orient = x;
          return base;
      };
      base.xScale = function(x) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = x;
          return base;
      };
      base.yScale = function(x) {
          if (!arguments.length) {
              return yScale;
          }
          yScale = x;
          return base;
      };
      base.errorLow = function(x) {
          if (!arguments.length) {
              return errorLow;
          }
          errorLow = d3.functor(x);
          return base;
      };
      base.errorHigh = function(x) {
          if (!arguments.length) {
              return errorHigh;
          }
          errorHigh = d3.functor(x);
          return base;
      };
      base.xValue = function(x) {
          if (!arguments.length) {
              return xValue;
          }
          xValue = d3.functor(x);
          return base;
      };
      base.yValue = function(x) {
          if (!arguments.length) {
              return yValue;
          }
          yValue = d3.functor(x);
          return base;
      };
      base.barWidth = function(x) {
          if (!arguments.length) {
              return barWidth;
          }
          barWidth = d3.functor(x);
          return base;
      };

      return base;
  }

  function errorBar() {

      var decorate = noop,
          barWidth = 5,
          orient = 'vertical',
          base = errorBase();

      var dataJoin = _dataJoin()
          .selector('g.errorBar')
          .element('g')
          .attr('class', 'errorBar');

      var errorBar = function(selection) {
          base.orient(errorBar.orient());
          selection.each(function(data, index) {

              var filteredData = data.filter(base.defined);

              var g = dataJoin(this, filteredData);

              g.enter()
                  .append('path');

              var pathGenerator = svgErrorBar()
                  .orient(errorBar.orient())
                  .barWidth(base.width(filteredData));

              g.each(function(d, i) {
                  var values = base.values(d, i);

                  var gErrorBar = d3.select(this)
                      .attr('transform', 'translate(' + values.x + ', ' + values.y + ')');

                  pathGenerator
                      .x(values.x)
                      .errorHigh(values.errorHigh)
                      .errorLow(values.errorLow)
                      .y(values.y);

                  gErrorBar.select('path')
                      .attr('d', pathGenerator([d]))
                      .attr('stroke', 'black');
              });

              decorate(g, data, index);
          });
      };

      errorBar.barWidth = function(x) {
          if (!arguments.length) {
              return barWidth;
          }
          barWidth = x;
          return errorBar;
      };

      errorBar.orient = function(x) {
          if (!arguments.length) {
              return orient;
          }
          orient = x;
          return errorBar;
      };

      errorBar.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return errorBar;
      };

      d3.rebind(errorBar, dataJoin, 'key');
      rebindAll(errorBar, base);

      return errorBar;
  }

  function ohlcBase() {

      var xScale = d3.time.scale(),
          yScale = d3.scale.linear(),
          xValue = function(d, i) { return d.date; },
          yOpenValue = function(d, i) { return d.open; },
          yHighValue = function(d, i) { return d.high; },
          yLowValue = function(d, i) { return d.low; },
          yCloseValue = function(d, i) { return d.close; },
          barWidth = fractionalBarWidth(0.75),
          xValueScaled = function(d, i) {
              return xScale(xValue(d, i));
          };

      function base() { }

      base.width = function(data) {
          return barWidth(data.map(xValueScaled));
      };

      base.defined = function(d, i) {
          return xValue(d, i) != null && yOpenValue(d, i) != null &&
              yLowValue(d, i) != null && yHighValue(d, i) != null &&
              yCloseValue(d, i) != null;
      };

      base.values = function(d, i) {
          var yCloseRaw = yCloseValue(d, i),
              yOpenRaw = yOpenValue(d, i);

          var direction = '';
          if (yCloseRaw > yOpenRaw) {
              direction = 'up';
          } else if (yCloseRaw < yOpenRaw) {
              direction = 'down';
          }

          return {
              x: xValueScaled(d, i),
              yOpen: yScale(yOpenRaw),
              yHigh: yScale(yHighValue(d, i)),
              yLow: yScale(yLowValue(d, i)),
              yClose: yScale(yCloseRaw),
              direction: direction
          };
      };

      base.xScale = function(x) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = x;
          return base;
      };
      base.yScale = function(x) {
          if (!arguments.length) {
              return yScale;
          }
          yScale = x;
          return base;
      };
      base.xValue = function(x) {
          if (!arguments.length) {
              return xValue;
          }
          xValue = x;
          return base;
      };
      base.yOpenValue = function(x) {
          if (!arguments.length) {
              return yOpenValue;
          }
          yOpenValue = x;
          return base;
      };
      base.yHighValue = function(x) {
          if (!arguments.length) {
              return yHighValue;
          }
          yHighValue = x;
          return base;
      };
      base.yLowValue = function(x) {
          if (!arguments.length) {
              return yLowValue;
          }
          yLowValue = x;
          return base;
      };
      base.yValue = base.yCloseValue = function(x) {
          if (!arguments.length) {
              return yCloseValue;
          }
          yCloseValue = x;
          return base;
      };
      base.barWidth = function(x) {
          if (!arguments.length) {
              return barWidth;
          }
          barWidth = d3.functor(x);
          return base;
      };

      return base;
  }

  function groupedBar() {

      var bar = _bar(),
          barWidth = fractionalBarWidth(0.75),
          decorate = noop,
          xScale = d3.scale.linear(),
          offsetScale = d3.scale.linear(),
          values = function(d) { return d.values; };

      var dataJoin = _dataJoin()
          .selector('g.stacked')
          .element('g')
          .attr('class', 'stacked');

      var x = function(d, i) { return xScale(bar.xValue()(d, i)); };

      var groupedBar = function(selection) {
          selection.each(function(data) {

              var width = barWidth(values(data[0]).map(x));
              var subBarWidth = width / (data.length - 1);
              bar.barWidth(subBarWidth);

              var halfWidth = width / 2;
              offsetScale.domain([0, data.length - 1])
                  .range([-halfWidth, halfWidth]);

              var g = dataJoin(this, data);

              g.enter().append('g');

              g.select('g')
                  .datum(values)
                  .each(function(series, index) {
                      var container = d3.select(this);

                      // create a composite scale that applies the required offset
                      var compositeScale = function(_x) {
                          return xScale(_x) + offsetScale(index);
                      };
                      bar.xScale(compositeScale);

                      // adapt the decorate function to give each series the correct index
                      bar.decorate(function(s, d) {
                          decorate(s, d, index);
                      });

                      container.call(bar);
                  });
          });
      };

      groupedBar.decorate = function(_x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = _x;
          return groupedBar;
      };
      groupedBar.xScale = function(_x) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = _x;
          return groupedBar;
      };
      groupedBar.values = function(_x) {
          if (!arguments.length) {
              return values;
          }
          values = _x;
          return groupedBar;
      };

      d3.rebind(groupedBar, bar, 'yValue', 'xValue', 'yScale');

      return groupedBar;
  }

  function _line() {

      var decorate = noop;

      var base = xyBase();

      var lineData = d3.svg.line()
          .defined(base.defined)
          .x(base.x)
          .y(base.y);

      var dataJoin = _dataJoin()
          .selector('path.line')
          .element('path')
          .attr('class', 'line');

      var line = function(selection) {

          selection.each(function(data, index) {

              var path = dataJoin(this, [data]);
              path.attr('d', lineData);

              decorate(path, data, index);
          });
      };

      line.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return line;
      };

      d3.rebind(line, base, 'xScale', 'xValue', 'yScale', 'yValue');
      d3.rebind(line, dataJoin, 'key');
      d3.rebind(line, lineData, 'interpolate', 'tension');

      return line;
  }

  function _stack() {

      var series = noop,
          values = function(d) { return d.values; };

      var stack = function(selection) {

          selection.each(function(data) {

              var container = d3.select(this);

              var dataJoin = _dataJoin()
                  .selector('g.stacked')
                  .element('g')
                  .attr('class', 'stacked');

              var g = dataJoin(container, data);

              g.enter().append('g');
              g.select('g')
                  .datum(values)
                  .call(series);
          });
      };

      stack.series = function(x) {
          if (!arguments.length) {
              return series;
          }
          series = x;
          return stack;
      };
      stack.values = function(x) {
          if (!arguments.length) {
              return values;
          }
          values = x;
          return stack;
      };

      return stack;
  }

  function line() {

      var line = _line()
          .yValue(function(d) { return d.y0 + d.y; });

      var stack = _stack()
          .series(line);

      var stackedLine = function(selection) {
          selection.call(stack);
      };

      rebindAll(stackedLine, line);

      return stackedLine;
  }

  function bar() {

      var bar = _bar()
          .yValue(function(d) { return d.y0 + d.y; })
          .y0Value(function(d) { return d.y0; });

      var stack = _stack()
          .series(bar);

      var stackedBar = function(selection) {
          selection.call(stack);
      };

      rebindAll(stackedBar, bar);

      return stackedBar;
  }

  function _area() {

      var decorate = noop;

      var base = xyBase();

      var areaData = d3.svg.area()
          .defined(base.defined)
          .x(base.x)
          .y0(base.y0)
          .y1(base.y1);

      var dataJoin = _dataJoin()
          .selector('path.area')
          .element('path')
          .attr('class', 'area');

      var area = function(selection) {

          selection.each(function(data, index) {

              var path = dataJoin(this, [data]);
              path.attr('d', areaData);

              decorate(path, data, index);
          });
      };

      area.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return area;
      };

      d3.rebind(area, base, 'xScale', 'xValue', 'yScale', 'yValue', 'y1Value', 'y0Value');
      d3.rebind(area, dataJoin, 'key');
      d3.rebind(area, areaData, 'interpolate', 'tension');

      return area;
  }

  function area() {

      var area = _area()
          .yValue(function(d) { return d.y0 + d.y; })
          .y0Value(function(d) { return d.y0; });

      var stack = _stack()
          .series(area);

      var stackedArea = function(selection) {
          selection.call(stack);
      };

      rebindAll(stackedArea, area);

      return stackedArea;
  }

  var stacked = {
      area: area,
      bar: bar,
      stack: _stack,
      line: line
  };

  function ohlc(drawMethod) {

      var decorate = noop,
          base = ohlcBase();

      var dataJoin = _dataJoin()
          .selector('g.ohlc')
          .element('g')
          .attr('class', 'ohlc');

      function containerTranslation(values) {
          return 'translate(' + values.x + ', ' + values.yHigh + ')';
      }

      var ohlc = function(selection) {
          selection.each(function(data, index) {

              var filteredData = data.filter(base.defined);

              var g = dataJoin(this, filteredData);

              g.enter()
                  .attr('transform', function(d, i) {
                      return containerTranslation(base.values(d, i)) + ' scale(1e-6, 1)';
                  })
                  .append('path');

              var pathGenerator = svgOhlc()
                      .width(base.width(filteredData));

              g.each(function(d, i) {
                  var values = base.values(d, i);

                  var graph = d3.transition(d3.select(this))
                      .attr({
                          'class': 'ohlc ' + values.direction,
                          'transform': function() { return containerTranslation(values) + ' scale(1)'; }
                      });

                  pathGenerator.x(d3.functor(0))
                      .open(function() { return values.yOpen - values.yHigh; })
                      .high(function() { return values.yHigh - values.yHigh; })
                      .low(function() { return values.yLow - values.yHigh; })
                      .close(function() { return values.yClose - values.yHigh; });

                  graph.select('path')
                      .attr('d', pathGenerator([d]));
              });

              decorate(g, data, index);
          });
      };

      ohlc.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return ohlc;
      };

      d3.rebind(ohlc, dataJoin, 'key');
      rebindAll(ohlc, base);

      return ohlc;
  }

  function cycle() {

      var decorate = noop,
          xScale = d3.scale.linear(),
          yScale = d3.scale.linear(),
          xValue = function(d, i) { return d.date.getDay(); },
          subScale = d3.scale.linear(),
          subSeries = _line(),
          barWidth = fractionalBarWidth(0.75);

      var dataJoin = _dataJoin()
          .selector('g.cycle')
          .element('g')
          .attr('class', 'cycle');

      var cycle = function(selection) {

          selection.each(function(data, index) {

              var dataByX = d3.nest()
                  .key(xValue)
                  .map(data);

              var xValues = Object.keys(dataByX);

              var width = barWidth(xValues.map(xScale)),
                  halfWidth = width / 2;

              var g = dataJoin(this, xValues);

              g.each(function(d, i) {

                  var graph = d3.select(this);

                  graph.attr('transform', 'translate(' + xScale(d) + ', 0)');

                  (subScale.rangeBands || subScale.range)([-halfWidth, halfWidth]);

                  subSeries.xScale(subScale)
                      .yScale(yScale);

                  d3.select(this)
                      .datum(dataByX[d])
                      .call(subSeries);

              });

              decorate(g, xValues, index);
          });
      };

      cycle.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return cycle;
      };
      cycle.xScale = function(x) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = x;
          return cycle;
      };
      cycle.yScale = function(x) {
          if (!arguments.length) {
              return yScale;
          }
          yScale = x;
          return cycle;
      };
      cycle.xValue = function(x) {
          if (!arguments.length) {
              return xValue;
          }
          xValue = x;
          return cycle;
      };
      cycle.subScale = function(x) {
          if (!arguments.length) {
              return subScale;
          }
          subScale = x;
          return cycle;
      };
      cycle.subSeries = function(x) {
          if (!arguments.length) {
              return subSeries;
          }
          subSeries = x;
          return cycle;
      };
      cycle.barWidth = function(x) {
          if (!arguments.length) {
              return barWidth;
          }
          barWidth = d3.functor(x);
          return cycle;
      };

      d3.rebind(cycle, dataJoin, 'key');

      return cycle;

  }

  function candlestick() {

      var decorate = noop,
          base = ohlcBase();

      var dataJoin = _dataJoin()
          .selector('g.candlestick')
          .element('g')
          .attr('class', 'candlestick');

      function containerTranslation(values) {
          return 'translate(' + values.x + ', ' + values.yHigh + ')';
      }

      var candlestick = function(selection) {

          selection.each(function(data, index) {

              var filteredData = data.filter(base.defined);

              var g = dataJoin(this, filteredData);

              g.enter()
                  .attr('transform', function(d, i) {
                      return containerTranslation(base.values(d, i)) + ' scale(1e-6, 1)';
                  })
                  .append('path');

              var pathGenerator = candlestickSvg()
                      .width(base.width(filteredData));

              g.each(function(d, i) {

                  var values = base.values(d, i);

                  var graph = d3.transition(d3.select(this))
                      .attr({
                          'class': 'candlestick ' + values.direction,
                          'transform': function() { return containerTranslation(values) + ' scale(1)'; }
                      });

                  pathGenerator.x(d3.functor(0))
                      .open(function() { return values.yOpen - values.yHigh; })
                      .high(function() { return values.yHigh - values.yHigh; })
                      .low(function() { return values.yLow - values.yHigh; })
                      .close(function() { return values.yClose - values.yHigh; });

                  graph.select('path')
                      .attr('d', pathGenerator([d]));
              });

              decorate(g, data, index);
          });
      };

      candlestick.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return candlestick;
      };

      d3.rebind(candlestick, dataJoin, 'key');
      rebindAll(candlestick, base);

      return candlestick;

  }

  // Adapts a fc.svg.axis for use as a series (i.e. accepts xScale/yScale). Only required when
  // you want an axis to appear in the middle of a chart e.g. as part of a cycle plot. Otherwise
  // prefer using the fc.svg.axis directly.
  function axis() {

      var axis = axisSvg(),
          baseline = d3.functor(0),
          decorate = noop,
          xScale = d3.time.scale(),
          yScale = d3.scale.linear();

      var dataJoin = _dataJoin()
          .selector('g.axis-adapter')
          .element('g')
          .attr({'class': 'axis axis-adapter'});

      var axisAdapter = function(selection) {

          selection.each(function(data, index) {

              var g = dataJoin(this, [data]);

              var translation;
              switch (axisAdapter.orient()) {
              case 'top':
              case 'bottom':
                  translation = 'translate(0,' + yScale(baseline(data)) + ')';
                  axis.scale(xScale);
                  break;

              case 'left':
              case 'right':
                  translation = 'translate(' + xScale(baseline(data)) + ',0)';
                  axis.scale(yScale);
                  break;

              default:
                  throw new Error('Invalid orientation');
              }

              g.enter().attr('transform', translation);
              g.attr('transform', translation);

              g.call(axis);

              decorate(g, data, index);
          });
      };

      axisAdapter.baseline = function(x) {
          if (!arguments.length) {
              return baseline;
          }
          baseline = d3.functor(x);
          return axisAdapter;
      };
      axisAdapter.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return axisAdapter;
      };
      axisAdapter.xScale = function(x) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = x;
          return axisAdapter;
      };
      axisAdapter.yScale = function(x) {
          if (!arguments.length) {
              return yScale;
          }
          yScale = x;
          return axisAdapter;
      };

      return d3.rebind(axisAdapter, axis, 'orient', 'ticks', 'tickValues', 'tickSize',
          'innerTickSize', 'outerTickSize', 'tickPadding', 'tickFormat');
  }

  var series = {
      area: _area,
      axis: axis,
      bar: _bar,
      candlestick: candlestick,
      cycle: cycle,
      line: _line,
      multi: multiSeries,
      ohlc: ohlc,
      point: point,
      stacked: stacked,
      groupedBar: groupedBar,
      xyBase: xyBase,
      ohlcBase: ohlcBase,
      errorBar: errorBar,
      waterfall: waterfall,
      algorithm: algorithm$1
  };

  function identity$1() {

      var identity$$ = {};

      identity$$.distance = function(startDate, endDate) {
          return endDate.getTime() - startDate.getTime();
      };

      identity$$.offset = function(startDate, ms) {
          return new Date(startDate.getTime() + ms);
      };

      identity$$.clampUp = identity;

      identity$$.clampDown = identity;

      identity$$.copy = function() { return identity$$; };

      return identity$$;
  }

  // obtains the ticks from the given scale, transforming the result to ensure
  // it does not include any discontinuities
  function tickTransformer(ticks, discontinuityProvider, domain) {
      var clampedTicks = ticks.map(function(tick, index) {
          if (index < ticks.length - 1) {
              return discontinuityProvider.clampUp(tick);
          } else {
              var clampedTick = discontinuityProvider.clampUp(tick);
              return clampedTick < domain[1] ?
                  clampedTick : discontinuityProvider.clampDown(tick);
          }
      });
      var uniqueTicks = clampedTicks.reduce(function(arr, tick) {
          if (arr.filter(function(f) { return f.getTime() === tick.getTime(); }).length === 0) {
              arr.push(tick);
          }
          return arr;
      }, []);
      return uniqueTicks;
  }

  /**
  * The `fc.scale.dateTime` scale renders a discontinuous date time scale, i.e. a time scale that incorporates gaps.
  * As an example, you can use this scale to render a chart where the weekends are skipped.
  *
  * @type {object}
  * @memberof fc.scale
  * @class fc.scale.dateTime
  */
  function dateTimeScale(adaptedScale, discontinuityProvider) {

      if (!arguments.length) {
          adaptedScale = d3.time.scale();
          discontinuityProvider = identity$1();
      }

      function scale(date) {
          var domain = adaptedScale.domain();
          var range = adaptedScale.range();

          // The discontinuityProvider is responsible for determine the distance between two points
          // along a scale that has discontinuities (i.e. sections that have been removed).
          // the scale for the given point 'x' is calculated as the ratio of the discontinuous distance
          // over the domain of this axis, versus the discontinuous distance to 'x'
          var totalDomainDistance = discontinuityProvider.distance(domain[0], domain[1]);
          var distanceToX = discontinuityProvider.distance(domain[0], date);
          var ratioToX = distanceToX / totalDomainDistance;
          var scaledByRange = ratioToX * (range[1] - range[0]) + range[0];
          return scaledByRange;
      }

      scale.invert = function(x) {
          var domain = adaptedScale.domain();
          var range = adaptedScale.range();

          var ratioToX = (x - range[0]) / (range[1] - range[0]);
          var totalDomainDistance = discontinuityProvider.distance(domain[0], domain[1]);
          var distanceToX = ratioToX * totalDomainDistance;
          return discontinuityProvider.offset(domain[0], distanceToX);
      };

      scale.domain = function(x) {
          if (!arguments.length) {
              return adaptedScale.domain();
          }
          // clamp the upper and lower domain values to ensure they
          // do not fall within a discontinuity
          var domainLower = discontinuityProvider.clampUp(x[0]);
          var domainUpper = discontinuityProvider.clampDown(x[1]);
          adaptedScale.domain([domainLower, domainUpper]);
          return scale;
      };

      scale.nice = function() {
          adaptedScale.nice();
          var domain = adaptedScale.domain();
          var domainLower = discontinuityProvider.clampUp(domain[0]);
          var domainUpper = discontinuityProvider.clampDown(domain[1]);
          adaptedScale.domain([domainLower, domainUpper]);
          return scale;
      };

      scale.ticks = function() {
          var ticks = adaptedScale.ticks.apply(this, arguments);
          return tickTransformer(ticks, discontinuityProvider, scale.domain());
      };

      scale.copy = function() {
          return dateTimeScale(adaptedScale.copy(), discontinuityProvider.copy());
      };

      scale.discontinuityProvider = function(x) {
          if (!arguments.length) {
              return discontinuityProvider;
          }
          discontinuityProvider = x;
          return scale;
      };

      return d3.rebind(scale, adaptedScale, 'range', 'rangeRound', 'interpolate', 'clamp',
          'tickFormat');
  }

  function exportedScale() {
      return dateTimeScale();
  }
  exportedScale.tickTransformer = tickTransformer;

  function skipWeekends() {
      var millisPerDay = 24 * 3600 * 1000;
      var millisPerWorkWeek = millisPerDay * 5;
      var millisPerWeek = millisPerDay * 7;

      var skipWeekends = {};

      function isWeekend(date) {
          return date.getDay() === 0 || date.getDay() === 6;
      }

      skipWeekends.clampDown = function(date) {
          if (date && isWeekend(date)) {
              var daysToSubtract = date.getDay() === 0 ? 2 : 1;
              // round the date up to midnight
              var newDate = d3.time.day.ceil(date);
              // then subtract the required number of days
              return d3.time.day.offset(newDate, -daysToSubtract);
          } else {
              return date;
          }
      };

      skipWeekends.clampUp = function(date) {
          if (date && isWeekend(date)) {
              var daysToAdd = date.getDay() === 0 ? 1 : 2;
              // round the date down to midnight
              var newDate = d3.time.day.floor(date);
              // then add the required number of days
              return d3.time.day.offset(newDate, daysToAdd);
          } else {
              return date;
          }
      };

      // returns the number of included milliseconds (i.e. those which do not fall)
      // within discontinuities, along this scale
      skipWeekends.distance = function(startDate, endDate) {
          startDate = skipWeekends.clampUp(startDate);
          endDate = skipWeekends.clampDown(endDate);

          // move the start date to the end of week boundary
          var offsetStart = d3.time.saturday.ceil(startDate);
          if (endDate < offsetStart) {
              return endDate.getTime() - startDate.getTime();
          }

          var msAdded = offsetStart.getTime() - startDate.getTime();

          // move the end date to the end of week boundary
          var offsetEnd = d3.time.saturday.ceil(endDate);
          var msRemoved = offsetEnd.getTime() - endDate.getTime();

          // determine how many weeks there are between these two dates
          var weeks = (offsetEnd.getTime() - offsetStart.getTime()) / millisPerWeek;

          return weeks * millisPerWorkWeek + msAdded - msRemoved;
      };

      skipWeekends.offset = function(startDate, ms) {
          var date = isWeekend(startDate) ? skipWeekends.clampUp(startDate) : startDate;
          var remainingms = ms;

          // move to the end of week boundary
          var endOfWeek = d3.time.saturday.ceil(date);
          remainingms -= (endOfWeek.getTime() - date.getTime());

          // if the distance to the boundary is greater than the number of ms
          // simply add the ms to the current date
          if (remainingms < 0) {
              return new Date(date.getTime() + ms);
          }

          // skip the weekend
          date = d3.time.day.offset(endOfWeek, 2);

          // add all of the complete weeks to the date
          var completeWeeks = Math.floor(remainingms / millisPerWorkWeek);
          date = d3.time.day.offset(date, completeWeeks * 7);
          remainingms -= completeWeeks * millisPerWorkWeek;

          // add the remaining time
          date = new Date(date.getTime() + remainingms);
          return date;
      };

      skipWeekends.copy = function() { return skipWeekends; };

      return skipWeekends;
  }

  var scale = {
      discontinuity: {
          identity: identity$1,
          skipWeekends: skipWeekends
      },
      dateTime: exportedScale
  };

  function elderRay$1() {

      var xScale = d3.time.scale(),
          yScale = d3.scale.linear(),
          xValue = function(d) { return d.date; },
          root = function(d) { return d.elderRay; },
          bullBar = _bar(),
          bearBar = _bar(),
          bullBarTop = _bar(),
          bearBarTop = _bar(),
          multi = multiSeries(),
          decorate = noop;

      var elderRay = function(selection) {

          function isTop(input, comparison) {
              // The values share parity and the input is smaller than the comparison
              return (input * comparison > 0 && Math.abs(input) < Math.abs(comparison));
          }

          bullBar
              .xValue(xValue)
              .yValue(function(d, i) {
                  return isTop(root(d).bullPower, root(d).bearPower) ? undefined : root(d).bullPower;
              });

          bearBar
              .xValue(xValue)
              .yValue(function(d, i) {
                  return isTop(root(d).bearPower, root(d).bullPower) ? undefined : root(d).bearPower;
              });

          bullBarTop
              .xValue(xValue)
              .yValue(function(d, i) {
                  return isTop(root(d).bullPower, root(d).bearPower) ? root(d).bullPower : undefined;
              });

          bearBarTop
              .xValue(xValue)
              .yValue(function(d, i) {
                  return isTop(root(d).bearPower, root(d).bullPower) ? root(d).bearPower : undefined;
              });

          multi
              .xScale(xScale)
              .yScale(yScale)
              .series([bullBar, bearBar, bullBarTop, bearBarTop])
              .decorate(function(g, data, index) {
                  g.enter()
                      .attr('class', function(d, i) {
                          return 'multi ' + ['bull', 'bear', 'bull top', 'bear top'][i];
                      });
                  decorate(g, data, index);
              });

          selection.call(multi);
      };

      elderRay.xScale = function(x) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = x;
          return elderRay;
      };
      elderRay.xValue = function(x) {
          if (!arguments.length) {
              return xValue;
          }
          xValue = x;
          return elderRay;
      };
      elderRay.yScale = function(x) {
          if (!arguments.length) {
              return yScale;
          }
          yScale = x;
          return elderRay;
      };
      elderRay.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return elderRay;
      };

      return elderRay;
  }

  function envelope$1() {

      var xScale = d3.time.scale(),
          yScale = d3.scale.linear(),
          yValue = function(d, i) { return d.close; },
          xValue = function(d, i) { return d.date; },
          root = function(d) { return d.envelope; },
          decorate = noop;

      var area = _area()
          .y0Value(function(d, i) {
              return root(d).upper;
          })
          .y1Value(function(d, i) {
              return root(d).lower;
          });

      var upperLine = _line()
          .yValue(function(d, i) {
              return root(d).upper;
          });

      var lowerLine = _line()
          .yValue(function(d, i) {
              return root(d).lower;
          });

      var envelope = function(selection) {

          var multi = multiSeries()
              .xScale(xScale)
              .yScale(yScale)
              .series([area, upperLine, lowerLine])
              .decorate(function(g, data, index) {
                  g.enter()
                      .attr('class', function(d, i) {
                          return 'multi envelope ' + ['area', 'upper', 'lower'][i];
                      });
                  decorate(g, data, index);
              });

          area.xValue(xValue);
          upperLine.xValue(xValue);
          lowerLine.xValue(xValue);

          selection.call(multi);
      };

      envelope.xScale = function(x) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = x;
          return envelope;
      };
      envelope.yScale = function(x) {
          if (!arguments.length) {
              return yScale;
          }
          yScale = x;
          return envelope;
      };
      envelope.xValue = function(x) {
          if (!arguments.length) {
              return xValue;
          }
          xValue = x;
          return envelope;
      };
      envelope.yValue = function(x) {
          if (!arguments.length) {
              return yValue;
          }
          yValue = x;
          return envelope;
      };
      envelope.root = function(x) {
          if (!arguments.length) {
              return root;
          }
          root = x;
          return envelope;
      };
      envelope.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return envelope;
      };

      return envelope;
  }

  function forceIndex$1() {

      var xScale = d3.time.scale(),
          yScale = d3.scale.linear(),
          multiSeries$$ = multiSeries(),
          decorate = noop;

      var annotations = annotationLine();

      var forceLine = _line()
          .yValue(function(d, i) {
              return d.force;
          });

      var force = function(selection) {

          multiSeries$$.xScale(xScale)
              .yScale(yScale)
              .series([annotations, forceLine])
              .mapping(function(series) {
                  if (series === annotations) {
                      return [
                          0
                      ];
                  }
                  return this;
              })
              .decorate(function(g, data, index) {
                  g.enter()
                      .attr('class', function(d, i) {
                          return 'multi ' + ['annotations', 'indicator'][i];
                      });
                  decorate(g, data, index);
              });

          selection.call(multiSeries$$);
      };

      force.xScale = function(x) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = x;
          annotations.xScale(x);
          return force;
      };
      force.yScale = function(x) {
          if (!arguments.length) {
              return yScale;
          }
          yScale = x;
          annotations.yScale(x);
          return force;
      };
      force.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return force;
      };

      d3.rebind(force, forceLine, 'yValue', 'xValue');

      return force;
  }

  function stochasticOscillator$1() {

      var xScale = d3.time.scale(),
          yScale = d3.scale.linear(),
          upperValue = 80,
          lowerValue = 20,
          multi = multiSeries(),
          decorate = noop;

      var annotations = annotationLine();
      var dLine = _line()
          .yValue(function(d, i) {
              return d.stochastic.d;
          });

      var kLine = _line()
          .yValue(function(d, i) {
              return d.stochastic.k;
          });

      var stochastic = function(selection) {

          multi.xScale(xScale)
              .yScale(yScale)
              .series([annotations, dLine, kLine])
              .mapping(function(series) {
                  if (series === annotations) {
                      return [
                          upperValue,
                          lowerValue
                      ];
                  }
                  return this;
              })
              .decorate(function(g, data, index) {
                  g.enter()
                      .attr('class', function(d, i) {
                          return 'multi stochastic ' + ['annotations', 'stochastic-d', 'stochastic-k'][i];
                      });
                  decorate(g, data, index);
              });

          selection.call(multi);
      };

      stochastic.xScale = function(x) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = x;
          return stochastic;
      };
      stochastic.yScale = function(x) {
          if (!arguments.length) {
              return yScale;
          }
          yScale = x;
          return stochastic;
      };
      stochastic.upperValue = function(x) {
          if (!arguments.length) {
              return upperValue;
          }
          upperValue = x;
          return stochastic;
      };
      stochastic.lowerValue = function(x) {
          if (!arguments.length) {
              return lowerValue;
          }
          lowerValue = x;
          return stochastic;
      };
      stochastic.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return stochastic;
      };

      d3.rebind(stochastic, dLine, 'yDValue', 'xDValue');

      d3.rebind(stochastic, kLine, 'yKValue', 'xKValue');

      return stochastic;
  }

  function relativeStrengthIndex$1() {

      var xScale = d3.time.scale(),
          yScale = d3.scale.linear(),
          upperValue = 70,
          lowerValue = 30,
          multiSeries$$ = multiSeries(),
          decorate = noop;

      var annotations = annotationLine();
      var rsiLine = _line()
          .yValue(function(d, i) { return d.rsi; });

      var rsi = function(selection) {

          multiSeries$$.xScale(xScale)
              .yScale(yScale)
              .series([rsiLine, annotations])
              .mapping(function(series) {
                  if (series === annotations) {
                      return [
                          upperValue,
                          50,
                          lowerValue
                      ];
                  }
                  return this;
              })
              .decorate(function(g, data, index) {
                  g.enter()
                      .attr('class', function(d, i) {
                          return 'multi rsi ' + ['indicator', 'annotations'][i];
                      });
                  decorate(g, data, index);
              });

          selection.call(multiSeries$$);
      };

      rsi.xScale = function(x) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = x;
          return rsi;
      };
      rsi.yScale = function(x) {
          if (!arguments.length) {
              return yScale;
          }
          yScale = x;
          return rsi;
      };
      rsi.upperValue = function(x) {
          if (!arguments.length) {
              return upperValue;
          }
          upperValue = x;
          return rsi;
      };
      rsi.lowerValue = function(x) {
          if (!arguments.length) {
              return lowerValue;
          }
          lowerValue = x;
          return rsi;
      };
      rsi.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return rsi;
      };

      d3.rebind(rsi, rsiLine, 'yValue', 'xValue');

      return rsi;
  }

  function macd$2() {

      var xScale = d3.time.scale(),
          yScale = d3.scale.linear(),
          xValue = function(d) { return d.date; },
          root = function(d) { return d.macd; },
          macdLine = _line(),
          signalLine = _line(),
          divergenceBar = _bar(),
          multiSeries$$ = multiSeries(),
          decorate = noop;

      var macd = function(selection) {

          macdLine.xValue(xValue)
              .yValue(function(d, i) { return root(d).macd; });

          signalLine.xValue(xValue)
              .yValue(function(d, i) { return root(d).signal; });

          divergenceBar.xValue(xValue)
              .yValue(function(d, i) { return root(d).divergence; });

          multiSeries$$.xScale(xScale)
              .yScale(yScale)
              .series([divergenceBar, macdLine, signalLine])
              .decorate(function(g, data, index) {
                  g.enter()
                      .attr('class', function(d, i) {
                          return 'multi ' + ['macd-divergence', 'macd', 'macd-signal'][i];
                      });
                  decorate(g, data, index);
              });

          selection.call(multiSeries$$);
      };

      macd.xScale = function(x) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = x;
          return macd;
      };
      macd.xValue = function(x) {
          if (!arguments.length) {
              return xValue;
          }
          xValue = x;
          return macd;
      };
      macd.yScale = function(x) {
          if (!arguments.length) {
              return yScale;
          }
          yScale = x;
          return macd;
      };
      macd.root = function(x) {
          if (!arguments.length) {
              return root;
          }
          root = x;
          return macd;
      };
      macd.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return macd;
      };

      return macd;
  }

  function bollingerBands$1() {

      var xScale = d3.time.scale(),
          yScale = d3.scale.linear(),
          yValue = function(d, i) { return d.close; },
          xValue = function(d, i) { return d.date; },
          root = function(d) { return d.bollingerBands; },
          decorate = noop;

      var area = _area()
          .y0Value(function(d, i) {
              return root(d).upper;
          })
          .y1Value(function(d, i) {
              return root(d).lower;
          });

      var upperLine = _line()
          .yValue(function(d, i) {
              return root(d).upper;
          });

      var averageLine = _line()
          .yValue(function(d, i) {
              return root(d).average;
          });

      var lowerLine = _line()
          .yValue(function(d, i) {
              return root(d).lower;
          });

      var bollingerBands = function(selection) {

          var multi = multiSeries()
              .xScale(xScale)
              .yScale(yScale)
              .series([area, upperLine, lowerLine, averageLine])
              .decorate(function(g, data, index) {
                  g.enter()
                      .attr('class', function(d, i) {
                          return 'multi bollinger ' + ['area', 'upper', 'lower', 'average'][i];
                      });
                  decorate(g, data, index);
              });

          area.xValue(xValue);
          upperLine.xValue(xValue);
          averageLine.xValue(xValue);
          lowerLine.xValue(xValue);

          selection.call(multi);
      };

      bollingerBands.xScale = function(x) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = x;
          return bollingerBands;
      };
      bollingerBands.yScale = function(x) {
          if (!arguments.length) {
              return yScale;
          }
          yScale = x;
          return bollingerBands;
      };
      bollingerBands.xValue = function(x) {
          if (!arguments.length) {
              return xValue;
          }
          xValue = x;
          return bollingerBands;
      };
      bollingerBands.yValue = function(x) {
          if (!arguments.length) {
              return yValue;
          }
          yValue = x;
          return bollingerBands;
      };
      bollingerBands.root = function(x) {
          if (!arguments.length) {
              return root;
          }
          root = x;
          return bollingerBands;
      };
      bollingerBands.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return bollingerBands;
      };

      return bollingerBands;
  }

  var renderer = {
      bollingerBands: bollingerBands$1,
      macd: macd$2,
      relativeStrengthIndex: relativeStrengthIndex$1,
      stochasticOscillator: stochasticOscillator$1,
      forceIndex: forceIndex$1,
      envelope: envelope$1,
      elderRay: elderRay$1
  };

  function exponentialMovingAverage$1() {

      var windowSize = 9,
          value = identity;

      var exponentialMovingAverage = function(data) {

          var alpha = 2 / (windowSize + 1);
          var previous;
          var initialAccumulator = 0;

          return data.map(function(d, i) {
              if (i < windowSize - 1) {
                  initialAccumulator += value(d, i);
                  return undefined;
              } else if (i === windowSize - 1) {
                  initialAccumulator += value(d, i);
                  var initialValue = initialAccumulator / windowSize;
                  previous = initialValue;
                  return initialValue;
              } else {
                  var nextValue = value(d, i) * alpha + (1 - alpha) * previous;
                  previous = nextValue;
                  return nextValue;
              }
          });
      };

      exponentialMovingAverage.windowSize = function(x) {
          if (!arguments.length) {
              return windowSize;
          }
          windowSize = x;
          return exponentialMovingAverage;
      };

      exponentialMovingAverage.value = function(x) {
          if (!arguments.length) {
              return value;
          }
          value = x;
          return exponentialMovingAverage;
      };

      return exponentialMovingAverage;
  }

  function elderRay$2() {

      var value = identity;

      var highValue = function(d, i) { return d.high; },
          lowValue = function(d, i) { return d.low; };

      var emaComputer = exponentialMovingAverage$1()
          .windowSize(13);

      var elderRay = function(data) {

          emaComputer.value(value);
          var ema = emaComputer(data);

          var indicator = d3.zip(data, ema)
              .map(function(d) {
                  return {
                      bullPower: d[1] ? highValue(d[0]) - d[1] : undefined,
                      bearPower: d[1] ? lowValue(d[0]) - d[1] : undefined
                  };
              });

          return indicator;
      };

      elderRay.value = function(x) {
          if (!arguments.length) {
              return value;
          }
          value = x;
          return elderRay;
      };

      elderRay.highValue = function(x) {
          if (!arguments.length) {
              return highValue;
          }
          highValue = x;
          return elderRay;
      };
      elderRay.lowValue = function(x) {
          if (!arguments.length) {
              return highValue;
          }
          lowValue = x;
          return elderRay;
      };

      rebind(elderRay, emaComputer, {
          period: 'windowSize'
      });

      return elderRay;
  }

  function slidingWindow() {

      var undefinedValue = d3.functor(undefined),
          windowSize = d3.functor(10),
          accumulator = noop,
          value = identity;

      var slidingWindow = function(data) {
          var size = windowSize.apply(this, arguments);
          var windowData = data.slice(0, size).map(value);
          return data.map(function(d, i) {
              if (i < size - 1) {
                  return undefinedValue(d, i);
              }
              if (i >= size) {
                  // Treat windowData as FIFO rolling buffer
                  windowData.shift();
                  windowData.push(value(d, i));
              }
              return accumulator(windowData);
          });
      };

      slidingWindow.undefinedValue = function(x) {
          if (!arguments.length) {
              return undefinedValue;
          }
          undefinedValue = d3.functor(x);
          return slidingWindow;
      };
      slidingWindow.windowSize = function(x) {
          if (!arguments.length) {
              return windowSize;
          }
          windowSize = d3.functor(x);
          return slidingWindow;
      };
      slidingWindow.accumulator = function(x) {
          if (!arguments.length) {
              return accumulator;
          }
          accumulator = x;
          return slidingWindow;
      };
      slidingWindow.value = function(x) {
          if (!arguments.length) {
              return value;
          }
          value = x;
          return slidingWindow;
      };

      return slidingWindow;
  }

  // applies an algorithm to an array, merging the result back into
  // the source array using the given merge function.
  function merge() {

      var merge = noop,
          algorithm = slidingWindow();

      var mergeCompute = function(data) {
          return d3.zip(data, algorithm(data))
              .forEach(function(tuple) {
                  merge(tuple[0], tuple[1]);
              });
      };

      mergeCompute.algorithm = function(x) {
          if (!arguments.length) {
              return algorithm;
          }
          algorithm = x;
          return mergeCompute;
      };

      mergeCompute.merge = function(x) {
          if (!arguments.length) {
              return merge;
          }
          merge = x;
          return mergeCompute;
      };

      return mergeCompute;
  }

  function elderRay() {

      var elderRayAlgorithm = elderRay$2()
          .value(function(d) { return d.close; });

      var mergedAlgorithm = merge()
              .algorithm(elderRayAlgorithm)
              .merge(function(datum, indicator) { datum.elderRay = indicator; });

      var elderRay = function(data) {
          return mergedAlgorithm(data);
      };

      d3.rebind(elderRay, mergedAlgorithm, 'merge');
      d3.rebind(elderRay, elderRayAlgorithm, 'highValue', 'lowValue', 'period', 'value');

      return elderRay;
  }

  function envelope$2() {

      var factor = 0.1,
          value = identity;

      var envelope = function(data) {
          return data.map(function(s) {
              return {
                  lower: value(s) * (1.0 - factor),
                  upper: value(s) * (1.0 + factor)
              };
          });
      };

      envelope.factor = function(x) {
          if (!arguments.length) {
              return factor;
          }
          factor = x;
          return envelope;
      };

      envelope.value = function(x) {
          if (!arguments.length) {
              return value;
          }
          value = d3.functor(x);
          return envelope;
      };

      return envelope;
  }

  // Indicator algorithms are not designed to accomodate leading 'undefined' value.
  // This adapter adds that functionality by adding a corresponding number
  // of 'undefined' values to the output.
  function undefinedInputAdapter() {

      var algorithm = slidingWindow()
          .accumulator(d3.mean);
      var undefinedValue = d3.functor(undefined),
          defined = function(value) {
              return algorithm.value()(value) == null;
          };

      function undefinedArrayOfLength(length) {
          return Array.apply(null, new Array(length)).map(undefinedValue);
      }

      var undefinedInputAdapter = function(data) {
          var undefinedCount = 0;
          while (defined(data[undefinedCount]) && undefinedCount < data.length) {
              undefinedCount ++;
          }

          var nonUndefinedData = data.slice(undefinedCount);

          return undefinedArrayOfLength(undefinedCount).concat(algorithm(nonUndefinedData));
      };

      undefinedInputAdapter.algorithm = function(x) {
          if (!arguments.length) {
              return algorithm;
          }
          algorithm = x;
          return undefinedInputAdapter;
      };
      undefinedInputAdapter.undefinedValue = function(x) {
          if (!arguments.length) {
              return undefinedValue;
          }
          undefinedValue = d3.functor(x);
          return undefinedInputAdapter;
      };
      undefinedInputAdapter.defined = function(x) {
          if (!arguments.length) {
              return defined;
          }
          defined = x;
          return undefinedInputAdapter;
      };

      return undefinedInputAdapter;
  }

  function envelope() {

      var envelopeAlgorithm = envelope$2();

      var adaptedEnvelope = undefinedInputAdapter()
          .undefinedValue({
              lower: undefined,
              upper: undefined
          })
          .algorithm(envelopeAlgorithm);

      var mergedAlgorithm = merge()
              .algorithm(adaptedEnvelope)
              .merge(function(datum, env) { datum.envelope = env; });

      var envelope = function(data) {
          return mergedAlgorithm(data);
      };

      envelope.root = function(d) {
          return d.envelope;
      };

      d3.rebind(envelope, mergedAlgorithm, 'merge');
      d3.rebind(envelope, envelopeAlgorithm, 'value', 'factor');

      return envelope;
  }

  function forceIndex$2() {

      var volumeValue = function(d, i) { return d.volume; },
          closeValue = function(d, i) { return d.close; };

      var slidingWindow$$ = slidingWindow()
          .windowSize(2)
          .accumulator(function(values) {
              return (closeValue(values[1]) - closeValue(values[0])) * volumeValue(values[1]);
          });

      var force = function(data) {
          return slidingWindow$$(data);
      };

      force.volumeValue = function(x) {
          if (!arguments.length) {
              return volumeValue;
          }
          volumeValue = x;
          return force;
      };
      force.closeValue = function(x) {
          if (!arguments.length) {
              return closeValue;
          }
          closeValue = x;
          return force;
      };

      d3.rebind(force, slidingWindow$$, 'windowSize');

      return force;
  }

  function forceIndex() {

      var force = forceIndex$2();

      var mergedAlgorithm = merge()
          .algorithm(force)
          .merge(function(datum, indicator) {
              datum.force = indicator;
          });

      var forceIndex = function(data) {
          return mergedAlgorithm(data);
      };

      d3.rebind(forceIndex, mergedAlgorithm, 'merge');
      d3.rebind(forceIndex, force, 'windowSize', 'volumeValue', 'closeValue');

      return forceIndex;
  }

  function stochasticOscillator$2() {

      var closeValue = function(d, i) { return d.close; },
          highValue = function(d, i) { return d.high; },
          lowValue = function(d, i) { return d.low; };

      var kWindow = slidingWindow()
          .windowSize(5)
          .accumulator(function(values) {
              var maxHigh = d3.max(values, highValue);
              var minLow = d3.min(values, lowValue);
              return 100 * (closeValue(values[values.length - 1]) - minLow) / (maxHigh - minLow);
          });

      var dWindow = slidingWindow()
          .windowSize(3)
          .accumulator(function(values) {
              if (values[0] === undefined) {
                  return undefined;
              }
              return d3.mean(values);
          });

      var stochastic = function(data) {
          var kValues = kWindow(data);
          var dValues = dWindow(kValues);
          return kValues.map(function(k, i) {
              var d = dValues[i];
              return { k: k, d: d };
          });
      };

      stochastic.closeValue = function(x) {
          if (!arguments.length) {
              return closeValue;
          }
          closeValue = x;
          return stochastic;
      };
      stochastic.highValue = function(x) {
          if (!arguments.length) {
              return highValue;
          }
          highValue = x;
          return stochastic;
      };
      stochastic.lowValue = function(x) {
          if (!arguments.length) {
              return highValue;
          }
          lowValue = x;
          return stochastic;
      };

      rebind(stochastic, kWindow, {
          kWindowSize: 'windowSize'
      });

      rebind(stochastic, dWindow, {
          dWindowSize: 'windowSize'
      });

      return stochastic;
  }

  function stochasticOscillator() {

      var stoc = stochasticOscillator$2();

      var mergedAlgorithm = merge()
              .algorithm(stoc)
              .merge(function(datum, indicator) { datum.stochastic = indicator; });

      var stochasticOscillator = function(data) {
          return mergedAlgorithm(data);
      };

      d3.rebind(stochasticOscillator, mergedAlgorithm, 'merge');
      d3.rebind(stochasticOscillator, stoc, 'kWindowSize', 'dWindowSize', 'lowValue', 'closeValue', 'highValue');

      return stochasticOscillator;
  }

  function relativeStrengthIndex$2() {

      var closeValue = function(d, i) { return d.close; },
          wildersSmoothing = function(values, prevAvg) {
              var result = prevAvg + ((values[values.length - 1] - prevAvg) / values.length);
              return result;
          },
          sum = function(a, b) { return a + b; },
          prevClose,
          prevDownChangesAvg,
          prevUpChangesAvg;

      var slidingWindow$$ = slidingWindow()
          .windowSize(14)
          .accumulator(function(values) {
              var closes = values.map(closeValue);

              if (!prevClose) {
                  prevClose = closes[0];
                  return undefined;
              }

              var downChanges = [];
              var upChanges = [];

              closes.forEach(function(close) {
                  var downChange = prevClose > close ? prevClose - close : 0;
                  var upChange = prevClose < close ? close - prevClose : 0;

                  downChanges.push(downChange);
                  upChanges.push(upChange);

                  prevClose = close;
              });

              var downChangesAvg = prevDownChangesAvg ? wildersSmoothing(downChanges, prevDownChangesAvg) :
                  downChanges.reduce(sum) / closes.length;

              var upChangesAvg = prevUpChangesAvg ? wildersSmoothing(upChanges, prevUpChangesAvg) :
                  upChanges.reduce(sum) / closes.length;

              prevDownChangesAvg = downChangesAvg;
              prevUpChangesAvg = upChangesAvg;

              var rs = upChangesAvg / downChangesAvg;
              return 100 - (100 / (1 + rs));
          });

      var rsi = function(data) {
          return slidingWindow$$(data);
      };

      rsi.closeValue = function(x) {
          if (!arguments.length) {
              return closeValue;
          }
          closeValue = x;
          return rsi;
      };

      d3.rebind(rsi, slidingWindow$$, 'windowSize');

      return rsi;
  }

  function relativeStrengthIndex() {

      var rsi = relativeStrengthIndex$2();

      var mergedAlgorithm = merge()
              .algorithm(rsi)
              .merge(function(datum, indicator) { datum.rsi = indicator; });

      var relativeStrengthIndex = function(data) {
          return mergedAlgorithm(data);
      };

      d3.rebind(relativeStrengthIndex, mergedAlgorithm, 'merge');
      d3.rebind(relativeStrengthIndex, rsi, 'windowSize', 'closeValue');

      return relativeStrengthIndex;
  }

  function movingAverage() {

      var ma = slidingWindow()
              .accumulator(d3.mean)
              .value(function(d) { return d.close; });

      var mergedAlgorithm = merge()
              .algorithm(ma)
              .merge(function(datum, indicator) { datum.movingAverage = indicator; });

      var movingAverage = function(data) {
          return mergedAlgorithm(data);
      };

      d3.rebind(movingAverage, mergedAlgorithm, 'merge');
      d3.rebind(movingAverage, ma, 'windowSize', 'undefinedValue', 'value');

      return movingAverage;
  }

  function macd$3() {

      var value = identity;

      var fastEMA = exponentialMovingAverage$1()
          .windowSize(12);
      var slowEMA = exponentialMovingAverage$1()
          .windowSize(29);
      var signalEMA = exponentialMovingAverage$1()
          .windowSize(9);
      var adaptedSignalEMA = undefinedInputAdapter()
          .algorithm(signalEMA);

      var macd = function(data) {

          fastEMA.value(value);
          slowEMA.value(value);

          var diff = d3.zip(fastEMA(data), slowEMA(data))
              .map(function(d) {
                  if (d[0] !== undefined && d[1] !== undefined) {
                      return d[0] - d[1];
                  } else {
                      return undefined;
                  }
              });

          var averageDiff = adaptedSignalEMA(diff);

          return d3.zip(diff, averageDiff)
              .map(function(d) {
                  return {
                      macd: d[0],
                      signal: d[1],
                      divergence: d[0] !== undefined && d[1] !== undefined ? d[0] - d[1] : undefined
                  };
              });
      };

      macd.value = function(x) {
          if (!arguments.length) {
              return value;
          }
          value = x;
          return macd;
      };

      rebind(macd, fastEMA, {
          fastPeriod: 'windowSize'
      });

      rebind(macd, slowEMA, {
          slowPeriod: 'windowSize'
      });

      rebind(macd, signalEMA, {
          signalPeriod: 'windowSize'
      });

      return macd;
  }

  function macd$1() {

      var macdAlgorithm = macd$3()
          .value(function(d) { return d.close; });

      var mergedAlgorithm = merge()
              .algorithm(macdAlgorithm)
              .merge(function(datum, indicator) { datum.macd = indicator; });

      var macd = function(data) {
          return mergedAlgorithm(data);
      };

      d3.rebind(macd, mergedAlgorithm, 'merge');
      d3.rebind(macd, macdAlgorithm, 'fastPeriod', 'slowPeriod', 'signalPeriod', 'value');

      return macd;
  }

  function exponentialMovingAverage() {

      var ema = exponentialMovingAverage$1()
              .value(function(d) { return d.close; });

      var mergedAlgorithm = merge()
              .algorithm(ema)
              .merge(function(datum, indicator) { datum.exponentialMovingAverage = indicator; });

      var exponentialMovingAverage = function(data) {
          return mergedAlgorithm(data);
      };

      d3.rebind(exponentialMovingAverage, mergedAlgorithm, 'merge');
      d3.rebind(exponentialMovingAverage, ema, 'windowSize', 'value');

      return exponentialMovingAverage;
  }

  function percentageChange() {

      var baseIndex = d3.functor(0),
          value = identity;

      var percentageChange = function(data) {

          if (data.length === 0) {
              return [];
          }

          var baseValue = value(data[baseIndex(data)]);

          return data.map(function(d, i) {
              return (value(d, i) - baseValue) / baseValue;
          });
      };

      percentageChange.baseIndex = function(x) {
          if (!arguments.length) {
              return baseIndex;
          }
          baseIndex = d3.functor(x);
          return percentageChange;
      };
      percentageChange.value = function(x) {
          if (!arguments.length) {
              return value;
          }
          value = x;
          return percentageChange;
      };

      return percentageChange;
  }

  function bollingerBands$3() {

      var multiplier = 2;

      var slidingWindow$$ = slidingWindow()
          .undefinedValue({
              upper: undefined,
              average: undefined,
              lower: undefined
          })
          .accumulator(function(values) {
              var avg = d3.mean(values);
              var stdDev = d3.deviation(values);
              return {
                  upper: avg + multiplier * stdDev,
                  average: avg,
                  lower: avg - multiplier * stdDev
              };
          });

      var bollingerBands = function(data) {
          return slidingWindow$$(data);
      };

      bollingerBands.multiplier = function(x) {
          if (!arguments.length) {
              return multiplier;
          }
          multiplier = x;
          return bollingerBands;
      };

      d3.rebind(bollingerBands, slidingWindow$$, 'windowSize', 'value');

      return bollingerBands;
  }

  var calculator = {
      bollingerBands: bollingerBands$3,
      exponentialMovingAverage: exponentialMovingAverage$1,
      macd: macd$3,
      percentageChange: percentageChange,
      relativeStrengthIndex: relativeStrengthIndex$2,
      stochasticOscillator: stochasticOscillator$2,
      slidingWindow: slidingWindow,
      undefinedInputAdapter: undefinedInputAdapter,
      forceIndex: forceIndex$2,
      envelope: envelope$2,
      elderRay: elderRay$2
  };

  function bollingerBands() {

      var bollingerAlgorithm = bollingerBands$3()
          .value(function(d) { return d.close; });

      var mergedAlgorithm = merge()
              .algorithm(bollingerAlgorithm)
              .merge(function(datum, indicator) { datum.bollingerBands = indicator; });

      var bollingerBands = function(data) {
          return mergedAlgorithm(data);
      };

      bollingerBands.root = function(d) {
          return d.bollingerBands;
      };

      d3.rebind(bollingerBands, mergedAlgorithm, 'merge');
      d3.rebind(bollingerBands, bollingerAlgorithm, 'windowSize', 'value', 'multiplier');

      return bollingerBands;
  }

  var algorithm = {
      bollingerBands: bollingerBands,
      calculator: calculator,
      exponentialMovingAverage: exponentialMovingAverage,
      macd: macd$1,
      merge: merge,
      movingAverage: movingAverage,
      relativeStrengthIndex: relativeStrengthIndex,
      stochasticOscillator: stochasticOscillator,
      forceIndex: forceIndex,
      envelope: envelope,
      elderRay: elderRay
  };

  var indicator = {
      algorithm: algorithm,
      renderer: renderer
  };

  function bucket() {

      var bucketSize = 10;

      var bucket = function(data) {
          var numberOfBuckets = Math.ceil(data.length / bucketSize);

          var buckets = [];
          for (var i = 0; i < numberOfBuckets; i++) {
              buckets.push(data.slice(i * bucketSize, (i + 1) * bucketSize));
          }
          return buckets;
      };

      bucket.bucketSize = function(x) {
          if (!arguments.length) {
              return bucketSize;
          }

          bucketSize = x;
          return bucket;
      };

      return bucket;
  }

  function largestTriangleOneBucket() {

      var dataBucketer = bucket(),
          x = identity,
          y = identity;

      var largestTriangleOneBucket = function(data) {

          if (dataBucketer.bucketSize() >= data.length) {
              return data;
          }

          var pointAreas = calculateAreaOfPoints(data);
          var pointAreaBuckets = dataBucketer(pointAreas);

          var buckets = dataBucketer(data.slice(1, data.length - 1));

          var subsampledData = buckets.map(function(thisBucket, i) {

              var pointAreaBucket = pointAreaBuckets[i];
              var maxArea = d3.max(pointAreaBucket);
              var currentMaxIndex = pointAreaBucket.indexOf(maxArea);

              return thisBucket[currentMaxIndex];
          });

          // First and last data points are their own buckets.
          return [].concat(data[0], subsampledData, data[data.length - 1]);
      };

      function calculateAreaOfPoints(data) {

          var xyData = data.map(function(point) {
              return [x(point), y(point)];
          });

          var pointAreas = [];

          for (var i = 1; i < xyData.length - 1; i++) {
              var lastPoint = xyData[i - 1];
              var thisPoint = xyData[i];
              var nextPoint = xyData[i + 1];

              var base = (lastPoint[0] - nextPoint[0]) * (thisPoint[1] - lastPoint[1]);
              var height = (lastPoint[0] - thisPoint[0]) * (nextPoint[1] - lastPoint[1]);

              var area = Math.abs(0.5 * base * height);

              pointAreas.push(area);
          }

          return pointAreas;
      }

      d3.rebind(largestTriangleOneBucket, dataBucketer, 'bucketSize');

      largestTriangleOneBucket.x = function(d) {
          if (!arguments.length) {
              return x;
          }

          x = d;

          return largestTriangleOneBucket;
      };

      largestTriangleOneBucket.y = function(d) {
          if (!arguments.length) {
              return y;
          }

          y = d;

          return largestTriangleOneBucket;
      };

      return largestTriangleOneBucket;
  }

  function largestTriangleThreeBucket() {

      var x = identity,
          y = identity,
          dataBucketer = bucket();

      var largestTriangleThreeBucket = function(data) {

          if (dataBucketer.bucketSize() >= data.length) {
              return data;
          }

          var buckets = dataBucketer(data.slice(1, data.length - 1));
          var firstBucket = data[0];
          var lastBucket = data[data.length - 1];

          // Keep track of the last selected bucket info and all buckets
          // (for the next bucket average)
          var allBuckets = [].concat(firstBucket, buckets, lastBucket);

          var lastSelectedX = x(firstBucket),
              lastSelectedY = y(firstBucket);

          var subsampledData = buckets.map(function(thisBucket, i) {

              var highestArea = -Infinity;
              var highestItem;
              var nextAvgX = d3.mean(allBuckets[i + 1], x);
              var nextAvgY = d3.mean(allBuckets[i + 1], y);

              for (var j = 0; j < thisBucket.length; j++) {
                  var thisX = x(thisBucket[j]),
                      thisY = y(thisBucket[j]);

                  var base = (lastSelectedX - nextAvgX) * (thisY - lastSelectedY);
                  var height = (lastSelectedX - thisX) * (nextAvgY - lastSelectedY);

                  var area = Math.abs(0.5 * base * height);

                  if (area > highestArea) {
                      highestArea = area;
                      highestItem = thisBucket[j];
                  }
              }

              lastSelectedX = x(highestItem);
              lastSelectedY = y(highestItem);

              return highestItem;
          });

          // First and last data points are their own buckets.
          return [].concat(data[0], subsampledData, data[data.length - 1]);
      };

      d3.rebind(largestTriangleThreeBucket, dataBucketer, 'bucketSize');

      largestTriangleThreeBucket.x = function(d) {
          if (!arguments.length) {
              return x;
          }

          x = d;

          return largestTriangleThreeBucket;
      };

      largestTriangleThreeBucket.y = function(d) {
          if (!arguments.length) {
              return y;
          }

          y = d;

          return largestTriangleThreeBucket;
      };

      return largestTriangleThreeBucket;
  }

  function modeMedian() {

      var dataBucketer = bucket(),
          value = identity;

      var modeMedian = function(data) {

          if (dataBucketer.bucketSize() > data.length) {
              return data;
          }

          var minMax = d3.extent(data);
          var buckets = dataBucketer(data.slice(1, data.length - 1));

          var subsampledData = buckets.map(function(thisBucket, i) {

              var frequencies = {};
              var mostFrequent;
              var mostFrequentIndex;
              var singleMostFrequent = true;

              for (var j = 0; j < thisBucket.length; j++) {
                  var item = value(thisBucket[j]);
                  if (item === minMax[0] || item === minMax[1]) {
                      return thisBucket[j];
                  }

                  if (frequencies[item] === undefined) {
                      frequencies[item] = 0;
                  }
                  frequencies[item]++;

                  if (frequencies[item] > frequencies[mostFrequent] || mostFrequent === undefined) {
                      mostFrequent = item;
                      mostFrequentIndex = j;
                      singleMostFrequent = true;
                  } else if (frequencies[item] === frequencies[mostFrequent]) {
                      singleMostFrequent = false;
                  }
              }

              if (singleMostFrequent) {
                  return thisBucket[mostFrequentIndex];
              } else {
                  return thisBucket[Math.floor(thisBucket.length / 2)];
              }
          });

          // First and last data points are their own buckets.
          return [].concat(data[0], subsampledData, data[data.length - 1]);
      };

      modeMedian.bucketSize = function() {
          dataBucketer.bucketSize.apply(this, arguments);
          return modeMedian;
      };

      modeMedian.value = function(x) {
          if (!arguments.length) {
              return value;
          }

          value = x;

          return modeMedian;
      };

      return modeMedian;
  }

  var sampler = {
      modeMedian: modeMedian,
      largestTriangleThreeBucket: largestTriangleThreeBucket,
      largestTriangleOneBucket: largestTriangleOneBucket,
      bucket: bucket
  };

  // the D3 CSV loader / parser converts each row into an object with property names
  // derived from the headings in the CSV. The spread component converts this into an
  // array of series; one per column (vertical spread), or one per row (horizontal spread).
  function spread() {

      var xValueKey = '',
          orient = 'vertical',
          yValue = function(row, key) {
              // D3 CSV returns all values as strings, this converts them to numbers
              // by default.
              return Number(row[key]);
          };

      function verticalSpread(data) {
          var series = Object.keys(data[0])
              .filter(function(key) {
                  return key !== xValueKey;
              })
              .map(function(key) {
                  var values = data.filter(function(row) {
                      return row[key];
                  }).map(function(row) {
                      return {
                          x: row[xValueKey],
                          y: yValue(row, key)
                      };
                  });
                  return {
                      key: key,
                      values: values
                  };
              });

          return series;
      }

      function horizontalSpread(data) {

          var series = data.map(function(row) {
              var keys = Object.keys(row).filter(function(d) {
                  return d !== xValueKey;
              });

              return {
                  key: row[xValueKey],
                  values: keys.map(function(key) {
                      return {
                          x: key,
                          y: yValue(row, key)
                      };
                  })
              };
          });

          return series;
      }

      var spread = function(data) {
          return orient === 'vertical' ? verticalSpread(data) : horizontalSpread(data);
      };

      spread.xValueKey = function(x) {
          if (!arguments.length) {
              return xValueKey;
          }
          xValueKey = x;
          return spread;
      };

      spread.yValue = function(x) {
          if (!arguments.length) {
              return yValue;
          }
          yValue = x;
          return spread;
      };

      spread.orient = function(x) {
          if (!arguments.length) {
              return orient;
          }
          orient = x;
          return spread;
      };

      return spread;
  }

  function walk() {
      var period = 1,
          steps = 20,
          mu = 0.1,
          sigma = 0.1;

      var walk = function(initial) {
          var randomNormal = d3.random.normal(),
              timeStep = period / steps,
              increments = new Array(steps + 1),
              increment,
              step;

          // Compute step increments for the discretized GBM model.
          for (step = 1; step < increments.length; step += 1) {
              increment = randomNormal();
              increment *= Math.sqrt(timeStep);
              increment *= sigma;
              increment += (mu - ((sigma * sigma) / 2)) * timeStep;
              increments[step] = Math.exp(increment);
          }
          // Return the cumulative product of increments from initial value.
          increments[0] = initial;
          for (step = 1; step < increments.length; step += 1) {
              increments[step] = increments[step - 1] * increments[step];
          }
          return increments;
      };

      walk.period = function(x) {
          if (!arguments.length) {
              return period;
          }
          period = x;
          return walk;
      };

      walk.steps = function(x) {
          if (!arguments.length) {
              return steps;
          }
          steps = x;
          return walk;
      };

      walk.mu = function(x) {
          if (!arguments.length) {
              return mu;
          }
          mu = x;
          return walk;
      };

      walk.sigma = function(x) {
          if (!arguments.length) {
              return sigma;
          }
          sigma = x;
          return walk;
      };

      return walk;
  }

  function financial() {

      var mu = 0.1,
          sigma = 0.1,
          startPrice = 100,
          startVolume = 100000,
          startDate = new Date(),
          stepsPerDay = 50,
          volumeNoiseFactor = 0.3,
          filter = function(d) { return true; };

      var calculateOHLC = function(days, prices, volumes) {

          var ohlcv = [],
              daySteps,
              currentStep = 0,
              currentIntraStep = 0;

          while (ohlcv.length < days) {
              daySteps = prices.slice(currentIntraStep, currentIntraStep + stepsPerDay);
              ohlcv.push({
                  date: new Date(startDate.getTime()),
                  open: daySteps[0],
                  high: Math.max.apply({}, daySteps),
                  low: Math.min.apply({}, daySteps),
                  close: daySteps[stepsPerDay - 1],
                  volume: volumes[currentStep]
              });
              currentIntraStep += stepsPerDay;
              currentStep += 1;
              startDate.setUTCDate(startDate.getUTCDate() + 1);
          }
          return ohlcv;
      };

      function calculateInterval(start, days) {
          var millisecondsPerYear = 3.15569e10;

          var toDate = new Date(start.getTime());
          toDate.setUTCDate(start.getUTCDate() + days);

          return {
              toDate: toDate,
              years: (toDate.getTime() - start.getTime()) / millisecondsPerYear
          };
      }

      function dataGenerator(days, years) {

          var prices = walk()
              .period(years)
              .steps(days * stepsPerDay)
              .mu(mu)
              .sigma(sigma)(startPrice);

          var volumes = walk()
              .period(years)
              .steps(days)
              .mu(0)
              .sigma(sigma)(startVolume);

          // Add random noise
          volumes = volumes.map(function(vol) {
              var boundedNoiseFactor = Math.min(0, Math.max(volumeNoiseFactor, 1));
              var multiplier = 1 + (boundedNoiseFactor * (1 - 2 * Math.random()));
              return Math.floor(vol * multiplier);
          });

          // Save the new start values
          startPrice = prices[prices.length - 1];
          startVolume = volumes[volumes.length - 1];

          return calculateOHLC(days, prices, volumes).filter(function(d) {
              return filter(d.date);
          });
      }

      var gen = function(days) {
          var date = startDate,
              remainingDays = days,
              result = [],
              interval;

          do {
              interval = calculateInterval(date, remainingDays);
              result = result.concat(dataGenerator(remainingDays, interval.years));
              date = interval.toDate;
              remainingDays = days - result.length;
          }
          while (result.length < days);

          return result;
      };

      gen.mu = function(x) {
          if (!arguments.length) {
              return mu;
          }
          mu = x;
          return gen;
      };
      gen.sigma = function(x) {
          if (!arguments.length) {
              return sigma;
          }
          sigma = x;
          return gen;
      };
      gen.startPrice = function(x) {
          if (!arguments.length) {
              return startPrice;
          }
          startPrice = x;
          return gen;
      };
      gen.startVolume = function(x) {
          if (!arguments.length) {
              return startVolume;
          }
          startVolume = x;
          return gen;
      };
      gen.startDate = function(x) {
          if (!arguments.length) {
              return startDate;
          }
          startDate = x;
          return gen;
      };
      gen.stepsPerDay = function(x) {
          if (!arguments.length) {
              return stepsPerDay;
          }
          stepsPerDay = x;
          return gen;
      };
      gen.volumeNoiseFactor = function(x) {
          if (!arguments.length) {
              return volumeNoiseFactor;
          }
          volumeNoiseFactor = x;
          return gen;
      };
      gen.filter = function(x) {
          if (!arguments.length) {
              return filter;
          }
          filter = x;
          return gen;
      };

      return gen;
  }

  function skipWeekends$1() {
      return function(date) {
          var day = date.getDay();
          return !(day === 0 || day === 6);
      };
  }

  var random = {
      filter: {
          skipWeekends: skipWeekends$1
      },
      financial: financial,
      walk: walk
  };

  //  https://www.quandl.com/docs/api#datasets
  function quandl() {

      function defaultColumnNameMap(colName) {
          return colName[0].toLowerCase() + colName.substr(1);
      }

      var database = 'YAHOO',
          dataset = 'GOOG',
          apiKey = null,
          start = null,
          end = null,
          rows = null,
          descending = false,
          collapse = null,
          columnNameMap = defaultColumnNameMap;

      var quandl = function(cb) {
          var params = [];
          if (apiKey != null) {
              params.push('api_key=' + apiKey);
          }
          if (start != null) {
              params.push('start_date=' + start.toISOString().substring(0, 10));
          }
          if (end != null) {
              params.push('end_date=' + end.toISOString().substring(0, 10));
          }
          if (rows != null) {
              params.push('rows=' + rows);
          }
          if (!descending) {
              params.push('order=asc');
          }
          if (collapse != null) {
              params.push('collapse=' + collapse);
          }

          var url = 'https://www.quandl.com/api/v3/datasets/' + database + '/' + dataset + '/data.json?' + params.join('&');

          d3.json(url, function(error, data) {
              if (error) {
                  cb(error);
                  return;
              }

              var datasetData = data.dataset_data;

              var nameMapping = columnNameMap || function(n) { return n; };
              var colNames = datasetData.column_names
                  .map(function(n, i) { return [i, nameMapping(n)]; })
                  .filter(function(v) { return v[1]; });

              var mappedData = datasetData.data.map(function(d) {
                  var output = {};
                  colNames.forEach(function(v) {
                      output[v[1]] = v[0] === 0 ? new Date(d[v[0]]) : d[v[0]];
                  });
                  return output;
              });

              cb(error, mappedData);
          });
      };

      // Unique Database Code (e.g. WIKI)
      quandl.database = function(x) {
          if (!arguments.length) {
              return database;
          }
          database = x;
          return quandl;
      };
      // Unique Dataset Code (e.g. AAPL)
      quandl.dataset = function(x) {
          if (!arguments.length) {
              return dataset;
          }
          dataset = x;
          return quandl;
      };
      // Set To Use API Key In Request (needed for premium set or high frequency requests)
      quandl.apiKey = function(x) {
          if (!arguments.length) {
              return apiKey;
          }
          apiKey = x;
          return quandl;
      };
      // Start Date of Data Series
      quandl.start = function(x) {
          if (!arguments.length) {
              return start;
          }
          start = x;
          return quandl;
      };
      // End Date of Data Series
      quandl.end = function(x) {
          if (!arguments.length) {
              return end;
          }
          end = x;
          return quandl;
      };
      // Limit Number of Rows
      quandl.rows = function(x) {
          if (!arguments.length) {
              return rows;
          }
          rows = x;
          return quandl;
      };
      // Return Results In Descending Order (true) or Ascending (false)
      quandl.descending = function(x) {
          if (!arguments.length) {
              return descending;
          }
          descending = x;
          return quandl;
      };
      // Periodicity of Data (daily | weekly | monthly | quarterly | annual)
      quandl.collapse = function(x) {
          if (!arguments.length) {
              return collapse;
          }
          collapse = x;
          return quandl;
      };
      // Function Used to Normalise the Quandl Column Name To Field Name, Return Null To Skip Field
      quandl.columnNameMap = function(x) {
          if (!arguments.length) {
              return columnNameMap;
          }
          columnNameMap = x;
          return quandl;
      };
      // Expose default column name map
      quandl.defaultColumnNameMap = defaultColumnNameMap;

      return quandl;
  }

  // https://docs.exchange.coinbase.com/#market-data
  function coinbase() {

      var product = 'BTC-USD',
          start = null,
          end = null,
          granularity = null;

      var coinbase = function(cb) {
          var params = [];
          if (start != null) {
              params.push('start=' + start.toISOString());
          }
          if (end != null) {
              params.push('end=' + end.toISOString());
          }
          if (granularity != null) {
              params.push('granularity=' + granularity);
          }
          var url = 'https://api.exchange.coinbase.com/products/' + product + '/candles?' + params.join('&');
          d3.json(url, function(error, data) {
              if (error) {
                  cb(error);
                  return;
              }
              data = data.map(function(d) {
                  return {
                      date: new Date(d[0] * 1000),
                      open: d[3],
                      high: d[2],
                      low: d[1],
                      close: d[4],
                      volume: d[5]
                  };
              });
              cb(error, data);
          });
      };

      coinbase.product = function(x) {
          if (!arguments.length) {
              return product;
          }
          product = x;
          return coinbase;
      };
      coinbase.start = function(x) {
          if (!arguments.length) {
              return start;
          }
          start = x;
          return coinbase;
      };
      coinbase.end = function(x) {
          if (!arguments.length) {
              return end;
          }
          end = x;
          return coinbase;
      };
      coinbase.granularity = function(x) {
          if (!arguments.length) {
              return granularity;
          }
          granularity = x;
          return coinbase;
      };

      return coinbase;
  }

  var feed = {
      coinbase: coinbase,
      quandl: quandl
  };

  var data$1 = {
      feed: feed,
      random: random,
      spread: spread,
      sampler: sampler
  };

  function smallMultiples(xScale, yScale) {

      xScale = xScale || d3.scale.linear();
      yScale = yScale || d3.scale.linear();

      var padding = 10,
          columns = 9,
          decorate = noop,
          plotArea = _line(),
          margin = {
              bottom: 30,
              right: 30
          },
          values = function(d) { return d.values; },
          key = function(d) { return d.key; };

      var xAxis = axisSvg()
          .ticks(2);
      var yAxis = axisSvg()
          .orient('right')
          .ticks(3);

      function classedDataJoin(clazz) {
          return _dataJoin()
              .selector('g.' + clazz)
              .element('g')
              .attr('class', clazz);
      }

      var dataJoin = classedDataJoin('multiple'),
          xAxisDataJoin = classedDataJoin('x-axis'),
          yAxisDataJoin = classedDataJoin('y-axis');

      var multiples = function(selection) {
          selection.each(function(data, index) {

              var container = d3.select(this);

              var expandedMargin = expandRect(margin);
              expandedMargin.position = 'absolute';

              var svg = container.selectAll('svg')
                  .data([data]);
              svg.enter()
                  .append('svg')
                  .layout('flex', 1)
                  .append('g')
                  .attr('class', 'multiples-chart');

              var plotAreaContainer = svg.select('g')
                  .layout(expandedMargin);

              container.layout();

              var rows = Math.ceil(data.length / columns);
              var multipleWidth = plotAreaContainer.layout('width') / columns - padding;
              var multipleHeight = plotAreaContainer.layout('height') / rows - padding;

              function translationForMultiple(row, column) {
                  return {
                      xOffset: (multipleWidth + padding) * row,
                      yOffset: (multipleHeight + padding) * column
                  };
              }

              setRange(xScale, [0, multipleWidth]);
              setRange(yScale, [multipleHeight, 0]);

              plotArea.xScale(xScale)
                  .yScale(yScale);

              // create a container for each multiple chart
              var multipleContainer = dataJoin(plotAreaContainer, data);
              multipleContainer.attr('transform', function(d, i) {
                  var translation = translationForMultiple(i % columns, Math.floor(i / columns));
                  return 'translate(' + translation.xOffset + ',' + translation.yOffset + ')';
              });

              // within each, add an inner 'g' and background rect
              var inner = multipleContainer.enter()
                  .append('g');
              inner.append('rect')
                  .attr('class', 'background');
              inner.append('g')
                  .attr('transform', 'translate(' + (multipleWidth / 2) + ', 0)')
                  .append('text')
                  .attr('class', 'label')
                  .text(key);

              // on update, call the plotArea and size the rect element
              multipleContainer.select('g')
                  .datum(values)
                  .call(plotArea);
              multipleContainer.select('rect')
                  .attr({width: multipleWidth, height: multipleHeight});

              decorate(multipleContainer, data, index);

              var xAxisContainer = xAxisDataJoin(plotAreaContainer, d3.range(columns));
              xAxisContainer.attr('transform', function(d, i) {
                  var row = xAxis.orient() === 'bottom' ? rows : 0;
                  var offset = xAxis.orient() === 'bottom' ? 0 : -padding;
                  var translation = translationForMultiple(i, row);
                  return 'translate(' + translation.xOffset + ',' + (translation.yOffset + offset) + ')';
              });
              xAxis.scale(xScale);
              xAxisContainer.call(xAxis);

              var yAxisContainer = yAxisDataJoin(plotAreaContainer, d3.range(rows));
              yAxisContainer.attr('transform', function(d, i) {
                  var column = yAxis.orient() === 'left' ? 0 : columns;
                  var offset = yAxis.orient() === 'left' ? -padding : 0;
                  var translation = translationForMultiple(column, i);
                  return 'translate(' + (translation.xOffset + offset) + ',' + translation.yOffset + ')';
              });
              yAxis.scale(yScale);
              yAxisContainer.call(yAxis);
          });
      };

      var scaleExclusions = [
          /range\w*/,   // the scale range is set via the component layout
          /tickFormat/  // use axis.tickFormat instead (only present on linear scales)
      ];
      rebindAll(multiples, xScale, 'x', scaleExclusions);
      rebindAll(multiples, yScale, 'y', scaleExclusions);

      rebindAll(multiples, xAxis, 'x');
      rebindAll(multiples, yAxis, 'y');

      multiples.columns = function(x) {
          if (!arguments.length) {
              return columns;
          }
          columns = x;
          return multiples;
      };

      multiples.margin = function(x) {
          if (!arguments.length) {
              return margin;
          }
          margin = x;
          return multiples;
      };

      multiples.padding = function(x) {
          if (!arguments.length) {
              return padding;
          }
          padding = x;
          return multiples;
      };

      multiples.plotArea = function(x) {
          if (!arguments.length) {
              return plotArea;
          }
          plotArea = x;
          return multiples;
      };

      multiples.values = function(x) {
          if (!arguments.length) {
              return values;
          }
          values = x;
          return multiples;
      };

      multiples.key = function(x) {
          if (!arguments.length) {
              return key;
          }
          key = x;
          return multiples;
      };

      multiples.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return multiples;
      };

      return multiples;
  }

  function tooltip() {

      var split = 50,
          decorate = noop;

      var items = [
          ['datum:', function(d) { return d.datum; }]
      ];

      var dataJoin = _dataJoin()
          .selector('g.cell')
          .element('g')
          .attr('class', 'cell tooltip');

      var tooltip = function(selection) {
          selection.each(function(data, index) {
              var container = d3.select(this);

              var legendData = items.map(function(item, i) {
                  return {
                      datum: data,
                      label: d3.functor(item[0]),
                      value: d3.functor(item[1])
                  };
              });

              var g = dataJoin(container, legendData);

              g.enter()
                  .layout({
                      'flex': 1,
                      'flexDirection': 'row'
                  });

              g.enter().append('text')
                  .attr('class', 'label')
                  .layout('flex', split);
              g.enter().append('text')
                  .attr('class', 'value')
                  .layout('flex', 100 - split);

              g.select('.label')
                  .text(function(d, i) {
                      return d.label.call(this, d.datum, i);
                  });

              g.select('.value')
                  .text(function(d, i) {
                      return d.value.call(this, d.datum, i);
                  });

              decorate(g, data, index);

              container.layout();
          });
      };

      tooltip.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return tooltip;
      };

      tooltip.split = function(x) {
          if (!arguments.length) {
              return split;
          }
          split = x;
          return tooltip;
      };

      tooltip.items = function(x) {
          if (!arguments.length) {
              return items;
          }
          items = x;
          return tooltip;
      };

      return tooltip;
  }

  function sparkline() {

      // creates an array with four elements, representing the high, low, open and close
      // values of the given array
      function highLowOpenClose(data) {
          var xValueAccessor = sparkline.xValue(),
              yValueAccessor = sparkline.yValue();

          var high = d3.max(data, yValueAccessor);
          var low = d3.min(data, yValueAccessor);

          function elementWithYValue(value) {
              return data.filter(function(d) {
                  return yValueAccessor(d) === value;
              })[0];
          }

          return [{
              x: xValueAccessor(data[0]),
              y: yValueAccessor(data[0])
          }, {
              x: xValueAccessor(elementWithYValue(high)),
              y: high
          }, {
              x: xValueAccessor(elementWithYValue(low)),
              y: low
          }, {
              x: xValueAccessor(data[data.length - 1]),
              y: yValueAccessor(data[data.length - 1])
          }];
      }

      var xScale = exportedScale();
      var yScale = d3.scale.linear();
      var radius = 2;
      var line = _line();

      // configure the point series to render the data from the
      // highLowOpenClose function
      var point$$ = point()
          .xValue(function(d) { return d.x; })
          .yValue(function(d) { return d.y; })
          .decorate(function(sel) {
              sel.attr('class', function(d, i) {
                  switch (i) {
                  case 0: return 'open';
                  case 1: return 'high';
                  case 2: return 'low';
                  case 3: return 'close';
                  }
              });
          });

      var multi = multiSeries()
          .series([line, point$$])
          .mapping(function(series) {
              switch (series) {
              case point$$:
                  return highLowOpenClose(this);
              default:
                  return this;
              }
          });

      var sparkline = function(selection) {

          point$$.size(radius * radius * Math.PI);

          selection.each(function(data) {

              var container = d3.select(this);
              var dimensions = innerDimensions(this);
              var margin = radius;

              xScale.range([margin, dimensions.width - margin]);
              yScale.range([dimensions.height - margin, margin]);

              multi.xScale(xScale)
                  .yScale(yScale);

              container.call(multi);

          });
      };

      rebind(sparkline, xScale, {
          xDiscontinuityProvider: 'discontinuityProvider',
          xDomain: 'domain'
      });

      rebind(sparkline, yScale, {
          yDomain: 'domain'
      });

      rebind(sparkline, line, 'xValue', 'yValue');

      sparkline.xScale = function() { return xScale; };
      sparkline.yScale = function() { return yScale; };
      sparkline.radius = function(x) {
          if (!arguments.length) {
              return radius;
          }
          radius = x;
          return sparkline;
      };

      return sparkline;
  }

  /**
   * innerHTML property for SVGElement
   * Copyright(c) 2010, Jeff Schiller
   *
   * Licensed under the Apache License, Version 2
   *
   * Minor modifications by Chris Price to only polyfill when required.
   */
  (function(SVGElement) {
    if (!SVGElement || 'innerHTML' in SVGElement.prototype) {
      return;
    }
    var serializeXML = function(node, output) {
      var nodeType = node.nodeType;
      if (nodeType == 3) { // TEXT nodes.
        // Replace special XML characters with their entities.
        output.push(node.textContent.replace(/&/, '&amp;').replace(/</, '&lt;').replace('>', '&gt;'));
      } else if (nodeType == 1) { // ELEMENT nodes.
        // Serialize Element nodes.
        output.push('<', node.tagName);
        if (node.hasAttributes()) {
          var attrMap = node.attributes;
          for (var i = 0, len = attrMap.length; i < len; ++i) {
            var attrNode = attrMap.item(i);
            output.push(' ', attrNode.name, '=\'', attrNode.value, '\'');
          }
        }
        if (node.hasChildNodes()) {
          output.push('>');
          var childNodes = node.childNodes;
          for (var i = 0, len = childNodes.length; i < len; ++i) {
            serializeXML(childNodes.item(i), output);
          }
          output.push('</', node.tagName, '>');
        } else {
          output.push('/>');
        }
      } else if (nodeType == 8) {
        // TODO(codedread): Replace special characters with XML entities?
        output.push('<!--', node.nodeValue, '-->');
      } else {
        // TODO: Handle CDATA nodes.
        // TODO: Handle ENTITY nodes.
        // TODO: Handle DOCUMENT nodes.
        throw 'Error serializing XML. Unhandled node of type: ' + nodeType;
      }
    }
    // The innerHTML DOM property for SVGElement.
    Object.defineProperty(SVGElement.prototype, 'innerHTML', {
      get: function() {
        var output = [];
        var childNode = this.firstChild;
        while (childNode) {
          serializeXML(childNode, output);
          childNode = childNode.nextSibling;
        }
        return output.join('');
      },
      set: function(markupText) {
        // Wipe out the current contents of the element.
        while (this.firstChild) {
          this.removeChild(this.firstChild);
        }

        try {
          // Parse the markup into valid nodes.
          var dXML = new DOMParser();
          dXML.async = false;
          // Wrap the markup into a SVG node to ensure parsing works.
          sXML = '<svg xmlns=\'http://www.w3.org/2000/svg\'>' + markupText + '</svg>';
          var svgDocElement = dXML.parseFromString(sXML, 'text/xml').documentElement;

          // Now take each node, import it and append to this element.
          var childNode = svgDocElement.firstChild;
          while(childNode) {
            this.appendChild(this.ownerDocument.importNode(childNode, true));
            childNode = childNode.nextSibling;
          }
        } catch(e) {
          throw new Error('Error parsing XML string');
        };
      }
    });
  })((1, eval)('this').SVGElement);

  function cartesian(xScale, yScale) {

      xScale = xScale || d3.scale.linear();
      yScale = yScale || d3.scale.linear();

      var margin = {
              bottom: 30,
              right: 30
          },
          yLabel = '',
          xLabel = '',
          xBaseline = null,
          yBaseline = null,
          chartLabel = '',
          plotArea = _line(),
          decorate = noop;

      // Each axis-series has a cross-scale which is defined as an identity
      // scale. If no baseline function is supplied, the axis is positioned
      // using the cross-scale range extents. If a baseline function is supplied
      // it is transformed via the respective scale.
      var xAxis = axis()
          .orient('bottom')
          .baseline(function() {
              if (xBaseline !== null) {
                  return yScale(xBaseline.apply(this, arguments));
              } else {
                  var r = range(yScale);
                  return xAxis.orient() === 'bottom' ? r[0] : r[1];
              }
          });

      var yAxis = axis()
          .orient('right')
          .baseline(function() {
              if (yBaseline !== null) {
                  return xScale(yBaseline.apply(this, arguments));
              } else {
                  var r = range(xScale);
                  return yAxis.orient() === 'left' ? r[0] : r[1];
              }
          });

      var containerDataJoin = _dataJoin()
          .selector('svg.cartesian-chart')
          .element('svg')
          .attr({'class': 'cartesian-chart', 'layout-style': 'flex: 1'});


      var cartesian = function(selection) {

          selection.each(function(data, index) {

              var container = d3.select(this);

              var svg = containerDataJoin(container, [data]);
              svg.enter().html(
                  '<g class="plot-area-container"> \
                    <rect class="background" \
                        layout-style="position: absolute; top: 0; bottom: 0; left: 0; right: 0"/> \
                    <g class="axes-container" \
                        layout-style="position: absolute; top: 0; bottom: 0; left: 0; right: 0"> \
                        <g class="x-axis" layout-style="height: 0; width: 0"/> \
                        <g class="y-axis" layout-style="height: 0; width: 0"/> \
                    </g> \
                    <svg class="plot-area" \
                        layout-style="position: absolute; top: 0; bottom: 0; left: 0; right: 0"/> \
                </g> \
                <g class="x-axis label-container"> \
                    <g layout-style="height: 0; width: 0"> \
                        <text class="label"/> \
                    </g> \
                </g> \
                <g class="y-axis label-container"> \
                    <g layout-style="height: 0; width: 0"> \
                        <text class="label"/> \
                    </g> \
                </g> \
                <g class="title label-container"> \
                    <g layout-style="height: 0; width: 0"> \
                        <text class="label"/> \
                    </g> \
                </g>');

              var expandedMargin = expandRect(margin);

              svg.select('.plot-area-container')
                  .layout({
                      position: 'absolute',
                      top: expandedMargin.top,
                      left: expandedMargin.left,
                      bottom: expandedMargin.bottom,
                      right: expandedMargin.right
                  });

              svg.select('.title')
                  .layout({
                      position: 'absolute',
                      top: 0,
                      alignItems: 'center',
                      left: expandedMargin.left,
                      right: expandedMargin.right
                  });

              var yAxisLayout = {
                  position: 'absolute',
                  top: expandedMargin.top,
                  bottom: expandedMargin.bottom,
                  alignItems: 'center',
                  flexDirection: 'row'
              };
              yAxisLayout[yAxis.orient()] = 0;
              svg.select('.y-axis.label-container')
                  .attr('class', 'y-axis label-container ' + yAxis.orient())
                  .layout(yAxisLayout);

              var xAxisLayout = {
                  position: 'absolute',
                  left: expandedMargin.left,
                  right: expandedMargin.right,
                  alignItems: 'center'
              };
              xAxisLayout[xAxis.orient()] = 0;
              svg.select('.x-axis.label-container')
                  .attr('class', 'x-axis label-container ' + xAxis.orient())
                  .layout(xAxisLayout);

              // perform the flexbox / css layout
              container.layout();

              // update the label text
              svg.select('.title .label')
                  .text(chartLabel);

              svg.select('.y-axis.label-container .label')
                  .text(yLabel)
                  .attr('transform', yAxis.orient() === 'right' ? 'rotate(90)' : 'rotate(-90)');

              svg.select('.x-axis.label-container .label')
                  .text(xLabel);

              // set the axis ranges
              var plotAreaContainer = svg.select('.plot-area');
              setRange(xScale, [0, plotAreaContainer.layout('width')]);
              setRange(yScale, [plotAreaContainer.layout('height'), 0]);

              // render the axes
              xAxis.xScale(xScale)
                  .yScale(d3.scale.identity());

              yAxis.yScale(yScale)
                  .xScale(d3.scale.identity());

              svg.select('.axes-container .x-axis')
                  .call(xAxis);

              svg.select('.axes-container .y-axis')
                  .call(yAxis);

              // render the plot area
              plotArea.xScale(xScale)
                  .yScale(yScale);
              plotAreaContainer.call(plotArea);

              decorate(svg, data, index);
          });
      };

      var scaleExclusions = [
          /range\w*/,   // the scale range is set via the component layout
          /tickFormat/  // use axis.tickFormat instead (only present on linear scales)
      ];
      rebindAll(cartesian, xScale, 'x', scaleExclusions);
      rebindAll(cartesian, yScale, 'y', scaleExclusions);

      var axisExclusions = [
          'baseline',         // the axis baseline is adapted so is not exposed directly
          'xScale', 'yScale'  // these are set by this components
      ];
      rebindAll(cartesian, xAxis, 'x', axisExclusions);
      rebindAll(cartesian, yAxis, 'y', axisExclusions);

      cartesian.xBaseline = function(x) {
          if (!arguments.length) {
              return xBaseline;
          }
          xBaseline = d3.functor(x);
          return cartesian;
      };
      cartesian.yBaseline = function(x) {
          if (!arguments.length) {
              return yBaseline;
          }
          yBaseline = d3.functor(x);
          return cartesian;
      };
      cartesian.chartLabel = function(x) {
          if (!arguments.length) {
              return chartLabel;
          }
          chartLabel = x;
          return cartesian;
      };
      cartesian.plotArea = function(x) {
          if (!arguments.length) {
              return plotArea;
          }
          plotArea = x;
          return cartesian;
      };
      cartesian.xLabel = function(x) {
          if (!arguments.length) {
              return xLabel;
          }
          xLabel = x;
          return cartesian;
      };
      cartesian.margin = function(x) {
          if (!arguments.length) {
              return margin;
          }
          margin = x;
          return cartesian;
      };
      cartesian.yLabel = function(x) {
          if (!arguments.length) {
              return yLabel;
          }
          yLabel = x;
          return cartesian;
      };
      cartesian.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return cartesian;
      };

      return cartesian;
  }

  var chart$2 = {
      cartesian: cartesian,
      sparkline: sparkline,
      tooltip: tooltip,
      smallMultiples: smallMultiples
  };

  function gridline() {

      var xScale = d3.time.scale(),
          yScale = d3.scale.linear(),
          xTicks = 10,
          yTicks = 10;

      var xDecorate = noop,
          yDecorate = noop;

      var xLineDataJoin = _dataJoin()
          .selector('line.x')
          .element('line')
          .attr('class', 'x gridline');

      var yLineDataJoin = _dataJoin()
          .selector('line.y')
          .element('line')
          .attr('class', 'y gridline');

      var gridlines = function(selection) {

          selection.each(function(data, index) {

              var xData = xScale.ticks(xTicks);
              var xLines = xLineDataJoin(this, xData);

              xLines.attr({
                  'x1': xScale,
                  'x2': xScale,
                  'y1': yScale.range()[0],
                  'y2': yScale.range()[1]
              });

              xDecorate(xLines, xData, index);

              var yData = yScale.ticks(yTicks);
              var yLines = yLineDataJoin(this, yData);

              yLines.attr({
                  'x1': xScale.range()[0],
                  'x2': xScale.range()[1],
                  'y1': yScale,
                  'y2': yScale
              });

              yDecorate(yLines, yData, index);

          });
      };

      gridlines.xScale = function(x) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = x;
          return gridlines;
      };
      gridlines.yScale = function(x) {
          if (!arguments.length) {
              return yScale;
          }
          yScale = x;
          return gridlines;
      };
      gridlines.xTicks = function(x) {
          if (!arguments.length) {
              return xTicks;
          }
          xTicks = x;
          return gridlines;
      };
      gridlines.yTicks = function(x) {
          if (!arguments.length) {
              return yTicks;
          }
          yTicks = x;
          return gridlines;
      };
      gridlines.yDecorate = function(x) {
          if (!arguments.length) {
              return yDecorate;
          }
          yDecorate = x;
          return gridlines;
      };
      gridlines.xDecorate = function(x) {
          if (!arguments.length) {
              return xDecorate;
          }
          xDecorate = x;
          return gridlines;
      };

      rebind(gridlines, xLineDataJoin, {'xKey': 'key'});
      rebind(gridlines, yLineDataJoin, {'yKey': 'key'});

      return gridlines;
  }

  function band() {

      var xScale = d3.time.scale(),
          yScale = d3.scale.linear(),
          x0, x1, y0, y1,
          x0Scaled = function() {
              return range(xScale)[0];
          },
          x1Scaled = function() {
              return range(xScale)[1];
          },
          y0Scaled = function() {
              return range(yScale)[0];
          },
          y1Scaled = function() {
              return range(yScale)[1];
          },
          decorate = noop;

      var dataJoin = _dataJoin()
          .selector('g.annotation')
          .element('g')
          .attr('class', 'annotation');

      var band = function(selection) {
          selection.each(function(data, index) {

              var container = d3.select(this);

              var g = dataJoin(container, data);

              g.enter()
                  .append('path')
                  .classed('band', true);

              var pathGenerator = svgBar()
                  .horizontalAlign('right')
                  .verticalAlign('top')
                  .x(x0Scaled)
                  .y(y0Scaled)
                  .height(function() {
                      return y1Scaled.apply(this, arguments) - y0Scaled.apply(this, arguments);
                  })
                  .width(function() {
                      return x1Scaled.apply(this, arguments) - x0Scaled.apply(this, arguments);
                  });

              g.select('path')
                  .attr('d', function(d, i) {
                      // the path generator is being used to render a single path, hence
                      // an explicit index is provided
                      return pathGenerator.call(this, [d], i);
                  });

              decorate(g, data, index);
          });
      };

      band.xScale = function(x) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = x;
          return band;
      };
      band.yScale = function(x) {
          if (!arguments.length) {
              return yScale;
          }
          yScale = x;
          return band;
      };
      band.decorate = function(x) {
          if (!arguments.length) {
              return decorate;
          }
          decorate = x;
          return band;
      };
      band.x0 = function(x) {
          if (!arguments.length) {
              return x0;
          }
          x0 = d3.functor(x);
          x0Scaled = function() {
              return xScale(x0.apply(this, arguments));
          };
          return band;
      };
      band.x1 = function(x) {
          if (!arguments.length) {
              return x1;
          }
          x1 = d3.functor(x);
          x1Scaled = function() {
              return xScale(x1.apply(this, arguments));
          };
          return band;
      };
      band.y0 = function(x) {
          if (!arguments.length) {
              return y0;
          }
          y0 = d3.functor(x);
          y0Scaled = function() {
              return yScale(y0.apply(this, arguments));
          };
          return band;
      };
      band.y1 = function(x) {
          if (!arguments.length) {
              return y1;
          }
          y1 = d3.functor(x);
          y1Scaled = function() {
              return yScale(y1.apply(this, arguments));
          };
          return band;
      };
      return band;
  }

  var annotation = {
      band: band,
      gridline: gridline,
      line: annotationLine
  };

  var cssLayout = (function (module) {
  var exports = module.exports;
  // UMD (Universal Module Definition)
  // See https://github.com/umdjs/umd for reference
  //
  // This file uses the following specific UMD implementation:
  // https://github.com/umdjs/umd/blob/master/returnExports.js
  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define([], factory);
    } else if (typeof exports === 'object') {
      // Node. Does not work with strict CommonJS, but
      // only CommonJS-like environments that support module.exports,
      // like Node.
      module.exports = factory();
    } else {
      // Browser globals (root is window)
      root.computeLayout = factory();
    }
  }(this, function() {
    /**
   * Copyright (c) 2014, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   */

  var computeLayout = (function() {

    var CSS_UNDEFINED;

    var CSS_DIRECTION_INHERIT = 'inherit';
    var CSS_DIRECTION_LTR = 'ltr';
    var CSS_DIRECTION_RTL = 'rtl';

    var CSS_FLEX_DIRECTION_ROW = 'row';
    var CSS_FLEX_DIRECTION_ROW_REVERSE = 'row-reverse';
    var CSS_FLEX_DIRECTION_COLUMN = 'column';
    var CSS_FLEX_DIRECTION_COLUMN_REVERSE = 'column-reverse';

    var CSS_JUSTIFY_FLEX_START = 'flex-start';
    var CSS_JUSTIFY_CENTER = 'center';
    var CSS_JUSTIFY_FLEX_END = 'flex-end';
    var CSS_JUSTIFY_SPACE_BETWEEN = 'space-between';
    var CSS_JUSTIFY_SPACE_AROUND = 'space-around';

    var CSS_ALIGN_FLEX_START = 'flex-start';
    var CSS_ALIGN_CENTER = 'center';
    var CSS_ALIGN_FLEX_END = 'flex-end';
    var CSS_ALIGN_STRETCH = 'stretch';

    var CSS_POSITION_RELATIVE = 'relative';
    var CSS_POSITION_ABSOLUTE = 'absolute';

    var leading = {
      'row': 'left',
      'row-reverse': 'right',
      'column': 'top',
      'column-reverse': 'bottom'
    };
    var trailing = {
      'row': 'right',
      'row-reverse': 'left',
      'column': 'bottom',
      'column-reverse': 'top'
    };
    var pos = {
      'row': 'left',
      'row-reverse': 'right',
      'column': 'top',
      'column-reverse': 'bottom'
    };
    var dim = {
      'row': 'width',
      'row-reverse': 'width',
      'column': 'height',
      'column-reverse': 'height'
    };

    // When transpiled to Java / C the node type has layout, children and style
    // properties. For the JavaScript version this function adds these properties
    // if they don't already exist.
    function fillNodes(node) {
      if (!node.layout || node.isDirty) {
        node.layout = {
          width: undefined,
          height: undefined,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        };
      }

      if (!node.style) {
        node.style = {};
      }

      if (!node.children) {
        node.children = [];
      }
      node.children.forEach(fillNodes);
      return node;
    }

    function isUndefined(value) {
      return value === undefined;
    }

    function isRowDirection(flexDirection) {
      return flexDirection === CSS_FLEX_DIRECTION_ROW ||
             flexDirection === CSS_FLEX_DIRECTION_ROW_REVERSE;
    }

    function isColumnDirection(flexDirection) {
      return flexDirection === CSS_FLEX_DIRECTION_COLUMN ||
             flexDirection === CSS_FLEX_DIRECTION_COLUMN_REVERSE;
    }

    function getLeadingMargin(node, axis) {
      if (node.style.marginStart !== undefined && isRowDirection(axis)) {
        return node.style.marginStart;
      }

      var value = null;
      switch (axis) {
        case 'row':            value = node.style.marginLeft;   break;
        case 'row-reverse':    value = node.style.marginRight;  break;
        case 'column':         value = node.style.marginTop;    break;
        case 'column-reverse': value = node.style.marginBottom; break;
      }

      if (value !== undefined) {
        return value;
      }

      if (node.style.margin !== undefined) {
        return node.style.margin;
      }

      return 0;
    }

    function getTrailingMargin(node, axis) {
      if (node.style.marginEnd !== undefined && isRowDirection(axis)) {
        return node.style.marginEnd;
      }

      var value = null;
      switch (axis) {
        case 'row':            value = node.style.marginRight;  break;
        case 'row-reverse':    value = node.style.marginLeft;   break;
        case 'column':         value = node.style.marginBottom; break;
        case 'column-reverse': value = node.style.marginTop;    break;
      }

      if (value != null) {
        return value;
      }

      if (node.style.margin !== undefined) {
        return node.style.margin;
      }

      return 0;
    }

    function getLeadingPadding(node, axis) {
      if (node.style.paddingStart !== undefined && node.style.paddingStart >= 0
          && isRowDirection(axis)) {
        return node.style.paddingStart;
      }

      var value = null;
      switch (axis) {
        case 'row':            value = node.style.paddingLeft;   break;
        case 'row-reverse':    value = node.style.paddingRight;  break;
        case 'column':         value = node.style.paddingTop;    break;
        case 'column-reverse': value = node.style.paddingBottom; break;
      }

      if (value != null && value >= 0) {
        return value;
      }

      if (node.style.padding !== undefined && node.style.padding >= 0) {
        return node.style.padding;
      }

      return 0;
    }

    function getTrailingPadding(node, axis) {
      if (node.style.paddingEnd !== undefined && node.style.paddingEnd >= 0
          && isRowDirection(axis)) {
        return node.style.paddingEnd;
      }

      var value = null;
      switch (axis) {
        case 'row':            value = node.style.paddingRight;  break;
        case 'row-reverse':    value = node.style.paddingLeft;   break;
        case 'column':         value = node.style.paddingBottom; break;
        case 'column-reverse': value = node.style.paddingTop;    break;
      }

      if (value != null && value >= 0) {
        return value;
      }

      if (node.style.padding !== undefined && node.style.padding >= 0) {
        return node.style.padding;
      }

      return 0;
    }

    function getLeadingBorder(node, axis) {
      if (node.style.borderStartWidth !== undefined && node.style.borderStartWidth >= 0
          && isRowDirection(axis)) {
        return node.style.borderStartWidth;
      }

      var value = null;
      switch (axis) {
        case 'row':            value = node.style.borderLeftWidth;   break;
        case 'row-reverse':    value = node.style.borderRightWidth;  break;
        case 'column':         value = node.style.borderTopWidth;    break;
        case 'column-reverse': value = node.style.borderBottomWidth; break;
      }

      if (value != null && value >= 0) {
        return value;
      }

      if (node.style.borderWidth !== undefined && node.style.borderWidth >= 0) {
        return node.style.borderWidth;
      }

      return 0;
    }

    function getTrailingBorder(node, axis) {
      if (node.style.borderEndWidth !== undefined && node.style.borderEndWidth >= 0
          && isRowDirection(axis)) {
        return node.style.borderEndWidth;
      }

      var value = null;
      switch (axis) {
        case 'row':            value = node.style.borderRightWidth;  break;
        case 'row-reverse':    value = node.style.borderLeftWidth;   break;
        case 'column':         value = node.style.borderBottomWidth; break;
        case 'column-reverse': value = node.style.borderTopWidth;    break;
      }

      if (value != null && value >= 0) {
        return value;
      }

      if (node.style.borderWidth !== undefined && node.style.borderWidth >= 0) {
        return node.style.borderWidth;
      }

      return 0;
    }

    function getLeadingPaddingAndBorder(node, axis) {
      return getLeadingPadding(node, axis) + getLeadingBorder(node, axis);
    }

    function getTrailingPaddingAndBorder(node, axis) {
      return getTrailingPadding(node, axis) + getTrailingBorder(node, axis);
    }

    function getBorderAxis(node, axis) {
      return getLeadingBorder(node, axis) + getTrailingBorder(node, axis);
    }

    function getMarginAxis(node, axis) {
      return getLeadingMargin(node, axis) + getTrailingMargin(node, axis);
    }

    function getPaddingAndBorderAxis(node, axis) {
      return getLeadingPaddingAndBorder(node, axis) +
          getTrailingPaddingAndBorder(node, axis);
    }

    function getJustifyContent(node) {
      if (node.style.justifyContent) {
        return node.style.justifyContent;
      }
      return 'flex-start';
    }

    function getAlignContent(node) {
      if (node.style.alignContent) {
        return node.style.alignContent;
      }
      return 'flex-start';
    }

    function getAlignItem(node, child) {
      if (child.style.alignSelf) {
        return child.style.alignSelf;
      }
      if (node.style.alignItems) {
        return node.style.alignItems;
      }
      return 'stretch';
    }

    function resolveAxis(axis, direction) {
      if (direction === CSS_DIRECTION_RTL) {
        if (axis === CSS_FLEX_DIRECTION_ROW) {
          return CSS_FLEX_DIRECTION_ROW_REVERSE;
        } else if (axis === CSS_FLEX_DIRECTION_ROW_REVERSE) {
          return CSS_FLEX_DIRECTION_ROW;
        }
      }

      return axis;
    }

    function resolveDirection(node, parentDirection) {
      var direction;
      if (node.style.direction) {
        direction = node.style.direction;
      } else {
        direction = CSS_DIRECTION_INHERIT;
      }

      if (direction === CSS_DIRECTION_INHERIT) {
        direction = (parentDirection === undefined ? CSS_DIRECTION_LTR : parentDirection);
      }

      return direction;
    }

    function getFlexDirection(node) {
      if (node.style.flexDirection) {
        return node.style.flexDirection;
      }
      return CSS_FLEX_DIRECTION_COLUMN;
    }

    function getCrossFlexDirection(flexDirection, direction) {
      if (isColumnDirection(flexDirection)) {
        return resolveAxis(CSS_FLEX_DIRECTION_ROW, direction);
      } else {
        return CSS_FLEX_DIRECTION_COLUMN;
      }
    }

    function getPositionType(node) {
      if (node.style.position) {
        return node.style.position;
      }
      return 'relative';
    }

    function isFlex(node) {
      return (
        getPositionType(node) === CSS_POSITION_RELATIVE &&
        node.style.flex > 0
      );
    }

    function isFlexWrap(node) {
      return node.style.flexWrap === 'wrap';
    }

    function getDimWithMargin(node, axis) {
      return node.layout[dim[axis]] + getMarginAxis(node, axis);
    }

    function isDimDefined(node, axis) {
      return node.style[dim[axis]] !== undefined && node.style[dim[axis]] >= 0;
    }

    function isPosDefined(node, pos) {
      return node.style[pos] !== undefined;
    }

    function isMeasureDefined(node) {
      return node.style.measure !== undefined;
    }

    function getPosition(node, pos) {
      if (node.style[pos] !== undefined) {
        return node.style[pos];
      }
      return 0;
    }

    function boundAxis(node, axis, value) {
      var min = {
        'row': node.style.minWidth,
        'row-reverse': node.style.minWidth,
        'column': node.style.minHeight,
        'column-reverse': node.style.minHeight
      }[axis];

      var max = {
        'row': node.style.maxWidth,
        'row-reverse': node.style.maxWidth,
        'column': node.style.maxHeight,
        'column-reverse': node.style.maxHeight
      }[axis];

      var boundValue = value;
      if (max !== undefined && max >= 0 && boundValue > max) {
        boundValue = max;
      }
      if (min !== undefined && min >= 0 && boundValue < min) {
        boundValue = min;
      }
      return boundValue;
    }

    function fmaxf(a, b) {
      if (a > b) {
        return a;
      }
      return b;
    }

    // When the user specifically sets a value for width or height
    function setDimensionFromStyle(node, axis) {
      // The parent already computed us a width or height. We just skip it
      if (node.layout[dim[axis]] !== undefined) {
        return;
      }
      // We only run if there's a width or height defined
      if (!isDimDefined(node, axis)) {
        return;
      }

      // The dimensions can never be smaller than the padding and border
      node.layout[dim[axis]] = fmaxf(
        boundAxis(node, axis, node.style[dim[axis]]),
        getPaddingAndBorderAxis(node, axis)
      );
    }

    function setTrailingPosition(node, child, axis) {
      child.layout[trailing[axis]] = node.layout[dim[axis]] -
          child.layout[dim[axis]] - child.layout[pos[axis]];
    }

    // If both left and right are defined, then use left. Otherwise return
    // +left or -right depending on which is defined.
    function getRelativePosition(node, axis) {
      if (node.style[leading[axis]] !== undefined) {
        return getPosition(node, leading[axis]);
      }
      return -getPosition(node, trailing[axis]);
    }

    function layoutNodeImpl(node, parentMaxWidth, /*css_direction_t*/parentDirection) {
      var/*css_direction_t*/ direction = resolveDirection(node, parentDirection);
      var/*(c)!css_flex_direction_t*//*(java)!int*/ mainAxis = resolveAxis(getFlexDirection(node), direction);
      var/*(c)!css_flex_direction_t*//*(java)!int*/ crossAxis = getCrossFlexDirection(mainAxis, direction);
      var/*(c)!css_flex_direction_t*//*(java)!int*/ resolvedRowAxis = resolveAxis(CSS_FLEX_DIRECTION_ROW, direction);

      // Handle width and height style attributes
      setDimensionFromStyle(node, mainAxis);
      setDimensionFromStyle(node, crossAxis);

      // Set the resolved resolution in the node's layout
      node.layout.direction = direction;

      // The position is set by the parent, but we need to complete it with a
      // delta composed of the margin and left/top/right/bottom
      node.layout[leading[mainAxis]] += getLeadingMargin(node, mainAxis) +
        getRelativePosition(node, mainAxis);
      node.layout[trailing[mainAxis]] += getTrailingMargin(node, mainAxis) +
        getRelativePosition(node, mainAxis);
      node.layout[leading[crossAxis]] += getLeadingMargin(node, crossAxis) +
        getRelativePosition(node, crossAxis);
      node.layout[trailing[crossAxis]] += getTrailingMargin(node, crossAxis) +
        getRelativePosition(node, crossAxis);

      // Inline immutable values from the target node to avoid excessive method
      // invocations during the layout calculation.
      var/*int*/ childCount = node.children.length;
      var/*float*/ paddingAndBorderAxisResolvedRow = getPaddingAndBorderAxis(node, resolvedRowAxis);

      if (isMeasureDefined(node)) {
        var/*bool*/ isResolvedRowDimDefined = !isUndefined(node.layout[dim[resolvedRowAxis]]);

        var/*float*/ width = CSS_UNDEFINED;
        if (isDimDefined(node, resolvedRowAxis)) {
          width = node.style.width;
        } else if (isResolvedRowDimDefined) {
          width = node.layout[dim[resolvedRowAxis]];
        } else {
          width = parentMaxWidth -
            getMarginAxis(node, resolvedRowAxis);
        }
        width -= paddingAndBorderAxisResolvedRow;

        // We only need to give a dimension for the text if we haven't got any
        // for it computed yet. It can either be from the style attribute or because
        // the element is flexible.
        var/*bool*/ isRowUndefined = !isDimDefined(node, resolvedRowAxis) && !isResolvedRowDimDefined;
        var/*bool*/ isColumnUndefined = !isDimDefined(node, CSS_FLEX_DIRECTION_COLUMN) &&
          isUndefined(node.layout[dim[CSS_FLEX_DIRECTION_COLUMN]]);

        // Let's not measure the text if we already know both dimensions
        if (isRowUndefined || isColumnUndefined) {
          var/*css_dim_t*/ measureDim = node.style.measure(
            /*(c)!node->context,*/
            /*(java)!layoutContext.measureOutput,*/
            width
          );
          if (isRowUndefined) {
            node.layout.width = measureDim.width +
              paddingAndBorderAxisResolvedRow;
          }
          if (isColumnUndefined) {
            node.layout.height = measureDim.height +
              getPaddingAndBorderAxis(node, CSS_FLEX_DIRECTION_COLUMN);
          }
        }
        if (childCount === 0) {
          return;
        }
      }

      var/*bool*/ isNodeFlexWrap = isFlexWrap(node);

      var/*css_justify_t*/ justifyContent = getJustifyContent(node);

      var/*float*/ leadingPaddingAndBorderMain = getLeadingPaddingAndBorder(node, mainAxis);
      var/*float*/ leadingPaddingAndBorderCross = getLeadingPaddingAndBorder(node, crossAxis);
      var/*float*/ paddingAndBorderAxisMain = getPaddingAndBorderAxis(node, mainAxis);
      var/*float*/ paddingAndBorderAxisCross = getPaddingAndBorderAxis(node, crossAxis);

      var/*bool*/ isMainDimDefined = !isUndefined(node.layout[dim[mainAxis]]);
      var/*bool*/ isCrossDimDefined = !isUndefined(node.layout[dim[crossAxis]]);
      var/*bool*/ isMainRowDirection = isRowDirection(mainAxis);

      var/*int*/ i;
      var/*int*/ ii;
      var/*css_node_t**/ child;
      var/*(c)!css_flex_direction_t*//*(java)!int*/ axis;

      var/*css_node_t**/ firstAbsoluteChild = null;
      var/*css_node_t**/ currentAbsoluteChild = null;

      var/*float*/ definedMainDim = CSS_UNDEFINED;
      if (isMainDimDefined) {
        definedMainDim = node.layout[dim[mainAxis]] - paddingAndBorderAxisMain;
      }

      // We want to execute the next two loops one per line with flex-wrap
      var/*int*/ startLine = 0;
      var/*int*/ endLine = 0;
      // var/*int*/ nextOffset = 0;
      var/*int*/ alreadyComputedNextLayout = 0;
      // We aggregate the total dimensions of the container in those two variables
      var/*float*/ linesCrossDim = 0;
      var/*float*/ linesMainDim = 0;
      var/*int*/ linesCount = 0;
      while (endLine < childCount) {
        // <Loop A> Layout non flexible children and count children by type

        // mainContentDim is accumulation of the dimensions and margin of all the
        // non flexible children. This will be used in order to either set the
        // dimensions of the node if none already exist, or to compute the
        // remaining space left for the flexible children.
        var/*float*/ mainContentDim = 0;

        // There are three kind of children, non flexible, flexible and absolute.
        // We need to know how many there are in order to distribute the space.
        var/*int*/ flexibleChildrenCount = 0;
        var/*float*/ totalFlexible = 0;
        var/*int*/ nonFlexibleChildrenCount = 0;

        // Use the line loop to position children in the main axis for as long
        // as they are using a simple stacking behaviour. Children that are
        // immediately stacked in the initial loop will not be touched again
        // in <Loop C>.
        var/*bool*/ isSimpleStackMain =
            (isMainDimDefined && justifyContent === CSS_JUSTIFY_FLEX_START) ||
            (!isMainDimDefined && justifyContent !== CSS_JUSTIFY_CENTER);
        var/*int*/ firstComplexMain = (isSimpleStackMain ? childCount : startLine);

        // Use the initial line loop to position children in the cross axis for
        // as long as they are relatively positioned with alignment STRETCH or
        // FLEX_START. Children that are immediately stacked in the initial loop
        // will not be touched again in <Loop D>.
        var/*bool*/ isSimpleStackCross = true;
        var/*int*/ firstComplexCross = childCount;

        var/*css_node_t**/ firstFlexChild = null;
        var/*css_node_t**/ currentFlexChild = null;

        var/*float*/ mainDim = leadingPaddingAndBorderMain;
        var/*float*/ crossDim = 0;

        var/*float*/ maxWidth;
        for (i = startLine; i < childCount; ++i) {
          child = node.children[i];
          child.lineIndex = linesCount;

          child.nextAbsoluteChild = null;
          child.nextFlexChild = null;

          var/*css_align_t*/ alignItem = getAlignItem(node, child);

          // Pre-fill cross axis dimensions when the child is using stretch before
          // we call the recursive layout pass
          if (alignItem === CSS_ALIGN_STRETCH &&
              getPositionType(child) === CSS_POSITION_RELATIVE &&
              isCrossDimDefined &&
              !isDimDefined(child, crossAxis)) {
            child.layout[dim[crossAxis]] = fmaxf(
              boundAxis(child, crossAxis, node.layout[dim[crossAxis]] -
                paddingAndBorderAxisCross - getMarginAxis(child, crossAxis)),
              // You never want to go smaller than padding
              getPaddingAndBorderAxis(child, crossAxis)
            );
          } else if (getPositionType(child) === CSS_POSITION_ABSOLUTE) {
            // Store a private linked list of absolutely positioned children
            // so that we can efficiently traverse them later.
            if (firstAbsoluteChild === null) {
              firstAbsoluteChild = child;
            }
            if (currentAbsoluteChild !== null) {
              currentAbsoluteChild.nextAbsoluteChild = child;
            }
            currentAbsoluteChild = child;

            // Pre-fill dimensions when using absolute position and both offsets for the axis are defined (either both
            // left and right or top and bottom).
            for (ii = 0; ii < 2; ii++) {
              axis = (ii !== 0) ? CSS_FLEX_DIRECTION_ROW : CSS_FLEX_DIRECTION_COLUMN;
              if (!isUndefined(node.layout[dim[axis]]) &&
                  !isDimDefined(child, axis) &&
                  isPosDefined(child, leading[axis]) &&
                  isPosDefined(child, trailing[axis])) {
                child.layout[dim[axis]] = fmaxf(
                  boundAxis(child, axis, node.layout[dim[axis]] -
                    getPaddingAndBorderAxis(node, axis) -
                    getMarginAxis(child, axis) -
                    getPosition(child, leading[axis]) -
                    getPosition(child, trailing[axis])),
                  // You never want to go smaller than padding
                  getPaddingAndBorderAxis(child, axis)
                );
              }
            }
          }

          var/*float*/ nextContentDim = 0;

          // It only makes sense to consider a child flexible if we have a computed
          // dimension for the node.
          if (isMainDimDefined && isFlex(child)) {
            flexibleChildrenCount++;
            totalFlexible += child.style.flex;

            // Store a private linked list of flexible children so that we can
            // efficiently traverse them later.
            if (firstFlexChild === null) {
              firstFlexChild = child;
            }
            if (currentFlexChild !== null) {
              currentFlexChild.nextFlexChild = child;
            }
            currentFlexChild = child;

            // Even if we don't know its exact size yet, we already know the padding,
            // border and margin. We'll use this partial information, which represents
            // the smallest possible size for the child, to compute the remaining
            // available space.
            nextContentDim = getPaddingAndBorderAxis(child, mainAxis) +
              getMarginAxis(child, mainAxis);

          } else {
            maxWidth = CSS_UNDEFINED;
            if (!isMainRowDirection) {
              if (isDimDefined(node, resolvedRowAxis)) {
                maxWidth = node.layout[dim[resolvedRowAxis]] -
                  paddingAndBorderAxisResolvedRow;
              } else {
                maxWidth = parentMaxWidth -
                  getMarginAxis(node, resolvedRowAxis) -
                  paddingAndBorderAxisResolvedRow;
              }
            }

            // This is the main recursive call. We layout non flexible children.
            if (alreadyComputedNextLayout === 0) {
              layoutNode(/*(java)!layoutContext, */child, maxWidth, direction);
            }

            // Absolute positioned elements do not take part of the layout, so we
            // don't use them to compute mainContentDim
            if (getPositionType(child) === CSS_POSITION_RELATIVE) {
              nonFlexibleChildrenCount++;
              // At this point we know the final size and margin of the element.
              nextContentDim = getDimWithMargin(child, mainAxis);
            }
          }

          // The element we are about to add would make us go to the next line
          if (isNodeFlexWrap &&
              isMainDimDefined &&
              mainContentDim + nextContentDim > definedMainDim &&
              // If there's only one element, then it's bigger than the content
              // and needs its own line
              i !== startLine) {
            nonFlexibleChildrenCount--;
            alreadyComputedNextLayout = 1;
            break;
          }

          // Disable simple stacking in the main axis for the current line as
          // we found a non-trivial child. The remaining children will be laid out
          // in <Loop C>.
          if (isSimpleStackMain &&
              (getPositionType(child) !== CSS_POSITION_RELATIVE || isFlex(child))) {
            isSimpleStackMain = false;
            firstComplexMain = i;
          }

          // Disable simple stacking in the cross axis for the current line as
          // we found a non-trivial child. The remaining children will be laid out
          // in <Loop D>.
          if (isSimpleStackCross &&
              (getPositionType(child) !== CSS_POSITION_RELATIVE ||
                  (alignItem !== CSS_ALIGN_STRETCH && alignItem !== CSS_ALIGN_FLEX_START) ||
                  isUndefined(child.layout[dim[crossAxis]]))) {
            isSimpleStackCross = false;
            firstComplexCross = i;
          }

          if (isSimpleStackMain) {
            child.layout[pos[mainAxis]] += mainDim;
            if (isMainDimDefined) {
              setTrailingPosition(node, child, mainAxis);
            }

            mainDim += getDimWithMargin(child, mainAxis);
            crossDim = fmaxf(crossDim, boundAxis(child, crossAxis, getDimWithMargin(child, crossAxis)));
          }

          if (isSimpleStackCross) {
            child.layout[pos[crossAxis]] += linesCrossDim + leadingPaddingAndBorderCross;
            if (isCrossDimDefined) {
              setTrailingPosition(node, child, crossAxis);
            }
          }

          alreadyComputedNextLayout = 0;
          mainContentDim += nextContentDim;
          endLine = i + 1;
        }

        // <Loop B> Layout flexible children and allocate empty space

        // In order to position the elements in the main axis, we have two
        // controls. The space between the beginning and the first element
        // and the space between each two elements.
        var/*float*/ leadingMainDim = 0;
        var/*float*/ betweenMainDim = 0;

        // The remaining available space that needs to be allocated
        var/*float*/ remainingMainDim = 0;
        if (isMainDimDefined) {
          remainingMainDim = definedMainDim - mainContentDim;
        } else {
          remainingMainDim = fmaxf(mainContentDim, 0) - mainContentDim;
        }

        // If there are flexible children in the mix, they are going to fill the
        // remaining space
        if (flexibleChildrenCount !== 0) {
          var/*float*/ flexibleMainDim = remainingMainDim / totalFlexible;
          var/*float*/ baseMainDim;
          var/*float*/ boundMainDim;

          // If the flex share of remaining space doesn't meet min/max bounds,
          // remove this child from flex calculations.
          currentFlexChild = firstFlexChild;
          while (currentFlexChild !== null) {
            baseMainDim = flexibleMainDim * currentFlexChild.style.flex +
                getPaddingAndBorderAxis(currentFlexChild, mainAxis);
            boundMainDim = boundAxis(currentFlexChild, mainAxis, baseMainDim);

            if (baseMainDim !== boundMainDim) {
              remainingMainDim -= boundMainDim;
              totalFlexible -= currentFlexChild.style.flex;
            }

            currentFlexChild = currentFlexChild.nextFlexChild;
          }
          flexibleMainDim = remainingMainDim / totalFlexible;

          // The non flexible children can overflow the container, in this case
          // we should just assume that there is no space available.
          if (flexibleMainDim < 0) {
            flexibleMainDim = 0;
          }

          currentFlexChild = firstFlexChild;
          while (currentFlexChild !== null) {
            // At this point we know the final size of the element in the main
            // dimension
            currentFlexChild.layout[dim[mainAxis]] = boundAxis(currentFlexChild, mainAxis,
              flexibleMainDim * currentFlexChild.style.flex +
                  getPaddingAndBorderAxis(currentFlexChild, mainAxis)
            );

            maxWidth = CSS_UNDEFINED;
            if (isDimDefined(node, resolvedRowAxis)) {
              maxWidth = node.layout[dim[resolvedRowAxis]] -
                paddingAndBorderAxisResolvedRow;
            } else if (!isMainRowDirection) {
              maxWidth = parentMaxWidth -
                getMarginAxis(node, resolvedRowAxis) -
                paddingAndBorderAxisResolvedRow;
            }

            // And we recursively call the layout algorithm for this child
            layoutNode(/*(java)!layoutContext, */currentFlexChild, maxWidth, direction);

            child = currentFlexChild;
            currentFlexChild = currentFlexChild.nextFlexChild;
            child.nextFlexChild = null;
          }

        // We use justifyContent to figure out how to allocate the remaining
        // space available
        } else if (justifyContent !== CSS_JUSTIFY_FLEX_START) {
          if (justifyContent === CSS_JUSTIFY_CENTER) {
            leadingMainDim = remainingMainDim / 2;
          } else if (justifyContent === CSS_JUSTIFY_FLEX_END) {
            leadingMainDim = remainingMainDim;
          } else if (justifyContent === CSS_JUSTIFY_SPACE_BETWEEN) {
            remainingMainDim = fmaxf(remainingMainDim, 0);
            if (flexibleChildrenCount + nonFlexibleChildrenCount - 1 !== 0) {
              betweenMainDim = remainingMainDim /
                (flexibleChildrenCount + nonFlexibleChildrenCount - 1);
            } else {
              betweenMainDim = 0;
            }
          } else if (justifyContent === CSS_JUSTIFY_SPACE_AROUND) {
            // Space on the edges is half of the space between elements
            betweenMainDim = remainingMainDim /
              (flexibleChildrenCount + nonFlexibleChildrenCount);
            leadingMainDim = betweenMainDim / 2;
          }
        }

        // <Loop C> Position elements in the main axis and compute dimensions

        // At this point, all the children have their dimensions set. We need to
        // find their position. In order to do that, we accumulate data in
        // variables that are also useful to compute the total dimensions of the
        // container!
        mainDim += leadingMainDim;

        for (i = firstComplexMain; i < endLine; ++i) {
          child = node.children[i];

          if (getPositionType(child) === CSS_POSITION_ABSOLUTE &&
              isPosDefined(child, leading[mainAxis])) {
            // In case the child is position absolute and has left/top being
            // defined, we override the position to whatever the user said
            // (and margin/border).
            child.layout[pos[mainAxis]] = getPosition(child, leading[mainAxis]) +
              getLeadingBorder(node, mainAxis) +
              getLeadingMargin(child, mainAxis);
          } else {
            // If the child is position absolute (without top/left) or relative,
            // we put it at the current accumulated offset.
            child.layout[pos[mainAxis]] += mainDim;

            // Define the trailing position accordingly.
            if (isMainDimDefined) {
              setTrailingPosition(node, child, mainAxis);
            }

            // Now that we placed the element, we need to update the variables
            // We only need to do that for relative elements. Absolute elements
            // do not take part in that phase.
            if (getPositionType(child) === CSS_POSITION_RELATIVE) {
              // The main dimension is the sum of all the elements dimension plus
              // the spacing.
              mainDim += betweenMainDim + getDimWithMargin(child, mainAxis);
              // The cross dimension is the max of the elements dimension since there
              // can only be one element in that cross dimension.
              crossDim = fmaxf(crossDim, boundAxis(child, crossAxis, getDimWithMargin(child, crossAxis)));
            }
          }
        }

        var/*float*/ containerCrossAxis = node.layout[dim[crossAxis]];
        if (!isCrossDimDefined) {
          containerCrossAxis = fmaxf(
            // For the cross dim, we add both sides at the end because the value
            // is aggregate via a max function. Intermediate negative values
            // can mess this computation otherwise
            boundAxis(node, crossAxis, crossDim + paddingAndBorderAxisCross),
            paddingAndBorderAxisCross
          );
        }

        // <Loop D> Position elements in the cross axis
        for (i = firstComplexCross; i < endLine; ++i) {
          child = node.children[i];

          if (getPositionType(child) === CSS_POSITION_ABSOLUTE &&
              isPosDefined(child, leading[crossAxis])) {
            // In case the child is absolutely positionned and has a
            // top/left/bottom/right being set, we override all the previously
            // computed positions to set it correctly.
            child.layout[pos[crossAxis]] = getPosition(child, leading[crossAxis]) +
              getLeadingBorder(node, crossAxis) +
              getLeadingMargin(child, crossAxis);

          } else {
            var/*float*/ leadingCrossDim = leadingPaddingAndBorderCross;

            // For a relative children, we're either using alignItems (parent) or
            // alignSelf (child) in order to determine the position in the cross axis
            if (getPositionType(child) === CSS_POSITION_RELATIVE) {
              /*eslint-disable */
              // This variable is intentionally re-defined as the code is transpiled to a block scope language
              var/*css_align_t*/ alignItem = getAlignItem(node, child);
              /*eslint-enable */
              if (alignItem === CSS_ALIGN_STRETCH) {
                // You can only stretch if the dimension has not already been set
                // previously.
                if (isUndefined(child.layout[dim[crossAxis]])) {
                  child.layout[dim[crossAxis]] = fmaxf(
                    boundAxis(child, crossAxis, containerCrossAxis -
                      paddingAndBorderAxisCross - getMarginAxis(child, crossAxis)),
                    // You never want to go smaller than padding
                    getPaddingAndBorderAxis(child, crossAxis)
                  );
                }
              } else if (alignItem !== CSS_ALIGN_FLEX_START) {
                // The remaining space between the parent dimensions+padding and child
                // dimensions+margin.
                var/*float*/ remainingCrossDim = containerCrossAxis -
                  paddingAndBorderAxisCross - getDimWithMargin(child, crossAxis);

                if (alignItem === CSS_ALIGN_CENTER) {
                  leadingCrossDim += remainingCrossDim / 2;
                } else { // CSS_ALIGN_FLEX_END
                  leadingCrossDim += remainingCrossDim;
                }
              }
            }

            // And we apply the position
            child.layout[pos[crossAxis]] += linesCrossDim + leadingCrossDim;

            // Define the trailing position accordingly.
            if (isCrossDimDefined) {
              setTrailingPosition(node, child, crossAxis);
            }
          }
        }

        linesCrossDim += crossDim;
        linesMainDim = fmaxf(linesMainDim, mainDim);
        linesCount += 1;
        startLine = endLine;
      }

      // <Loop E>
      //
      // Note(prenaux): More than one line, we need to layout the crossAxis
      // according to alignContent.
      //
      // Note that we could probably remove <Loop D> and handle the one line case
      // here too, but for the moment this is safer since it won't interfere with
      // previously working code.
      //
      // See specs:
      // http://www.w3.org/TR/2012/CR-css3-flexbox-20120918/#layout-algorithm
      // section 9.4
      //
      if (linesCount > 1 && isCrossDimDefined) {
        var/*float*/ nodeCrossAxisInnerSize = node.layout[dim[crossAxis]] -
            paddingAndBorderAxisCross;
        var/*float*/ remainingAlignContentDim = nodeCrossAxisInnerSize - linesCrossDim;

        var/*float*/ crossDimLead = 0;
        var/*float*/ currentLead = leadingPaddingAndBorderCross;

        var/*css_align_t*/ alignContent = getAlignContent(node);
        if (alignContent === CSS_ALIGN_FLEX_END) {
          currentLead += remainingAlignContentDim;
        } else if (alignContent === CSS_ALIGN_CENTER) {
          currentLead += remainingAlignContentDim / 2;
        } else if (alignContent === CSS_ALIGN_STRETCH) {
          if (nodeCrossAxisInnerSize > linesCrossDim) {
            crossDimLead = (remainingAlignContentDim / linesCount);
          }
        }

        var/*int*/ endIndex = 0;
        for (i = 0; i < linesCount; ++i) {
          var/*int*/ startIndex = endIndex;

          // compute the line's height and find the endIndex
          var/*float*/ lineHeight = 0;
          for (ii = startIndex; ii < childCount; ++ii) {
            child = node.children[ii];
            if (getPositionType(child) !== CSS_POSITION_RELATIVE) {
              continue;
            }
            if (child.lineIndex !== i) {
              break;
            }
            if (!isUndefined(child.layout[dim[crossAxis]])) {
              lineHeight = fmaxf(
                lineHeight,
                child.layout[dim[crossAxis]] + getMarginAxis(child, crossAxis)
              );
            }
          }
          endIndex = ii;
          lineHeight += crossDimLead;

          for (ii = startIndex; ii < endIndex; ++ii) {
            child = node.children[ii];
            if (getPositionType(child) !== CSS_POSITION_RELATIVE) {
              continue;
            }

            var/*css_align_t*/ alignContentAlignItem = getAlignItem(node, child);
            if (alignContentAlignItem === CSS_ALIGN_FLEX_START) {
              child.layout[pos[crossAxis]] = currentLead + getLeadingMargin(child, crossAxis);
            } else if (alignContentAlignItem === CSS_ALIGN_FLEX_END) {
              child.layout[pos[crossAxis]] = currentLead + lineHeight - getTrailingMargin(child, crossAxis) - child.layout[dim[crossAxis]];
            } else if (alignContentAlignItem === CSS_ALIGN_CENTER) {
              var/*float*/ childHeight = child.layout[dim[crossAxis]];
              child.layout[pos[crossAxis]] = currentLead + (lineHeight - childHeight) / 2;
            } else if (alignContentAlignItem === CSS_ALIGN_STRETCH) {
              child.layout[pos[crossAxis]] = currentLead + getLeadingMargin(child, crossAxis);
              // TODO(prenaux): Correctly set the height of items with undefined
              //                (auto) crossAxis dimension.
            }
          }

          currentLead += lineHeight;
        }
      }

      var/*bool*/ needsMainTrailingPos = false;
      var/*bool*/ needsCrossTrailingPos = false;

      // If the user didn't specify a width or height, and it has not been set
      // by the container, then we set it via the children.
      if (!isMainDimDefined) {
        node.layout[dim[mainAxis]] = fmaxf(
          // We're missing the last padding at this point to get the final
          // dimension
          boundAxis(node, mainAxis, linesMainDim + getTrailingPaddingAndBorder(node, mainAxis)),
          // We can never assign a width smaller than the padding and borders
          paddingAndBorderAxisMain
        );

        if (mainAxis === CSS_FLEX_DIRECTION_ROW_REVERSE ||
            mainAxis === CSS_FLEX_DIRECTION_COLUMN_REVERSE) {
          needsMainTrailingPos = true;
        }
      }

      if (!isCrossDimDefined) {
        node.layout[dim[crossAxis]] = fmaxf(
          // For the cross dim, we add both sides at the end because the value
          // is aggregate via a max function. Intermediate negative values
          // can mess this computation otherwise
          boundAxis(node, crossAxis, linesCrossDim + paddingAndBorderAxisCross),
          paddingAndBorderAxisCross
        );

        if (crossAxis === CSS_FLEX_DIRECTION_ROW_REVERSE ||
            crossAxis === CSS_FLEX_DIRECTION_COLUMN_REVERSE) {
          needsCrossTrailingPos = true;
        }
      }

      // <Loop F> Set trailing position if necessary
      if (needsMainTrailingPos || needsCrossTrailingPos) {
        for (i = 0; i < childCount; ++i) {
          child = node.children[i];

          if (needsMainTrailingPos) {
            setTrailingPosition(node, child, mainAxis);
          }

          if (needsCrossTrailingPos) {
            setTrailingPosition(node, child, crossAxis);
          }
        }
      }

      // <Loop G> Calculate dimensions for absolutely positioned elements
      currentAbsoluteChild = firstAbsoluteChild;
      while (currentAbsoluteChild !== null) {
        // Pre-fill dimensions when using absolute position and both offsets for
        // the axis are defined (either both left and right or top and bottom).
        for (ii = 0; ii < 2; ii++) {
          axis = (ii !== 0) ? CSS_FLEX_DIRECTION_ROW : CSS_FLEX_DIRECTION_COLUMN;

          if (!isUndefined(node.layout[dim[axis]]) &&
              !isDimDefined(currentAbsoluteChild, axis) &&
              isPosDefined(currentAbsoluteChild, leading[axis]) &&
              isPosDefined(currentAbsoluteChild, trailing[axis])) {
            currentAbsoluteChild.layout[dim[axis]] = fmaxf(
              boundAxis(currentAbsoluteChild, axis, node.layout[dim[axis]] -
                getBorderAxis(node, axis) -
                getMarginAxis(currentAbsoluteChild, axis) -
                getPosition(currentAbsoluteChild, leading[axis]) -
                getPosition(currentAbsoluteChild, trailing[axis])
              ),
              // You never want to go smaller than padding
              getPaddingAndBorderAxis(currentAbsoluteChild, axis)
            );
          }

          if (isPosDefined(currentAbsoluteChild, trailing[axis]) &&
              !isPosDefined(currentAbsoluteChild, leading[axis])) {
            currentAbsoluteChild.layout[leading[axis]] =
              node.layout[dim[axis]] -
              currentAbsoluteChild.layout[dim[axis]] -
              getPosition(currentAbsoluteChild, trailing[axis]);
          }
        }

        child = currentAbsoluteChild;
        currentAbsoluteChild = currentAbsoluteChild.nextAbsoluteChild;
        child.nextAbsoluteChild = null;
      }
    }

    function layoutNode(node, parentMaxWidth, parentDirection) {
      node.shouldUpdate = true;

      var direction = node.style.direction || CSS_DIRECTION_LTR;
      var skipLayout =
        !node.isDirty &&
        node.lastLayout &&
        node.lastLayout.requestedHeight === node.layout.height &&
        node.lastLayout.requestedWidth === node.layout.width &&
        node.lastLayout.parentMaxWidth === parentMaxWidth &&
        node.lastLayout.direction === direction;

      if (skipLayout) {
        node.layout.width = node.lastLayout.width;
        node.layout.height = node.lastLayout.height;
        node.layout.top = node.lastLayout.top;
        node.layout.left = node.lastLayout.left;
      } else {
        if (!node.lastLayout) {
          node.lastLayout = {};
        }

        node.lastLayout.requestedWidth = node.layout.width;
        node.lastLayout.requestedHeight = node.layout.height;
        node.lastLayout.parentMaxWidth = parentMaxWidth;
        node.lastLayout.direction = direction;

        // Reset child layouts
        node.children.forEach(function(child) {
          child.layout.width = undefined;
          child.layout.height = undefined;
          child.layout.top = 0;
          child.layout.left = 0;
        });

        layoutNodeImpl(node, parentMaxWidth, parentDirection);

        node.lastLayout.width = node.layout.width;
        node.lastLayout.height = node.layout.height;
        node.lastLayout.top = node.layout.top;
        node.lastLayout.left = node.layout.left;
      }
    }

    return {
      layoutNodeImpl: layoutNodeImpl,
      computeLayout: layoutNode,
      fillNodes: fillNodes
    };
  })();

  // This module export is only used for the purposes of unit testing this file. When
  // the library is packaged this file is included within css-layout.js which forms
  // the public API.
  if (typeof exports === 'object') {
    module.exports = computeLayout;
  }


    return function(node) {
      /*eslint-disable */
      // disabling ESLint because this code relies on the above include
      computeLayout.fillNodes(node);
      computeLayout.computeLayout(node);
      /*eslint-enable */
    };
  }));
  return module.exports;
  })({exports:{}});

  function ownerSVGElement(node) {
      while (node.ownerSVGElement) {
          node = node.ownerSVGElement;
      }
      return node;
  }

  // parses the style attribute, converting it into a JavaScript object
  function parseStyle(style) {
      if (!style) {
          return {};
      }
      var properties = style.split(';');
      var json = {};
      properties.forEach(function(property) {
          var components = property.split(':');
          if (components.length === 2) {
              var name = components[0].trim();
              var value = components[1].trim();
              json[name] = isNaN(value) ? value : Number(value);
          }
      });
      return json;
  }

  // creates the structure required by the layout engine
  function createNodes(el) {
      function getChildNodes() {
          var children = [];
          for (var i = 0; i < el.childNodes.length; i++) {
              var child = el.childNodes[i];
              if (child.nodeType === 1) {
                  if (child.getAttribute('layout-style')) {
                      children.push(createNodes(child));
                  }
              }
          }
          return children;
      }
      return {
          style: parseStyle(el.getAttribute('layout-style')),
          children: getChildNodes(el),
          element: el
      };
  }

  // takes the result of layout and applied it to the SVG elements
  function applyLayout(node, subtree) {
      // don't set layout-width/height on layout root node
      if (subtree) {
          node.element.setAttribute('layout-width', node.layout.width);
          node.element.setAttribute('layout-height', node.layout.height);
      }

      node.element.setAttribute('layout-x', node.layout.left);
      node.element.setAttribute('layout-y', node.layout.top);

      var rectOrSvg = node.element.nodeName.match(/(?:svg|rect)/i);

      //for svg / rect set the dimensions via width/height properties
      if (rectOrSvg) {
          node.element.setAttribute('width', node.layout.width);
          node.element.setAttribute('height', node.layout.height);
      }

      //for non-root svg / rect set the offset via x/y properties
      if (rectOrSvg && subtree) {
          node.element.setAttribute('x', node.layout.left);
          node.element.setAttribute('y', node.layout.top);
      }

      // for all other non-root elements apply a transform
      if (!rectOrSvg && subtree) {
          node.element.setAttribute('transform',
              'translate(' + node.layout.left + ', ' + node.layout.top + ')');
      }

      node.children.forEach(function(childNode) {
          applyLayout(childNode, true);
      });
  }

  function computeDimensions(node) {
      if (node.hasAttribute('layout-width') && node.hasAttribute('layout-height')) {
          return {
              width: Number(node.getAttribute('layout-width')),
              height: Number(node.getAttribute('layout-height'))
          };
      } else {
          return innerDimensions(node);
      }
  }

  function computePosition(node) {
      if (node.hasAttribute('layout-x') && node.hasAttribute('layout-y')) {
          return {
              x: Number(node.getAttribute('layout-x')),
              y: Number(node.getAttribute('layout-y'))
          };
      } else {
          return { x: 0, y: 0 };
      }
  }

  function layout$1(node) {
      if (ownerSVGElement(node).__layout__ === 'suspended') {
          return;
      }

      var dimensions = computeDimensions(node);

      var position = computePosition(node);

      // create the layout nodes
      var layoutNodes = createNodes(node);

      // set the dimensions / position of the root
      layoutNodes.style.width = dimensions.width;
      layoutNodes.style.height = dimensions.height;
      layoutNodes.style.left = position.x;
      layoutNodes.style.top = position.y;

      // use the Facebook CSS goodness
      cssLayout(layoutNodes);

      // apply the resultant layout
      applyLayout(layoutNodes);
  }

  function layoutSuspended(x) {
      if (!arguments.length) {
          return Boolean(ownerSVGElement(this.node()).__layout__);
      }
      return this.each(function() {
          ownerSVGElement(this).__layout__ = x ? 'suspended' : '';
      });
  }

  d3.selection.prototype.layoutSuspended = layoutSuspended;
  d3.transition.prototype.layoutSuspended = layoutSuspended;

  function layoutSelection(name, value) {
      var argsLength = arguments.length;

      // For layout(string), return the lyout value for the first node
      if (argsLength === 1 && typeof name === 'string') {
          var node = this.node();
          return Number(node.getAttribute('layout-' + name));
      }

      // for all other invocations, iterate over each item in the selection
      return this.each(function() {
          if (argsLength === 2) {
              if (typeof name !== 'string') {
                  // layout(number, number) - sets the width and height and performs layout
                  this.setAttribute('layout-width', name);
                  this.setAttribute('layout-height', value);
                  layout$1(this);
              } else {
                  // layout(name, value) - sets a layout- attribute
                  this.setAttribute('layout-style', name + ':' + value);
              }
          } else if (argsLength === 1) {
              if (typeof name !== 'string') {
                  // layout(object) - sets the layout-style property to the given object
                  var currentStyle = parseStyle(this.getAttribute('layout-style'));
                  var styleDiff = name;
                  Object.keys(styleDiff)
                      .forEach(function(property) {
                          currentStyle[property] = styleDiff[property];
                      });
                  var layoutCss = Object.keys(currentStyle)
                      .map(function(property) {
                          return property + ':' + currentStyle[property];
                      })
                      .join(';');
                  this.setAttribute('layout-style', layoutCss);
              }
          } else if (argsLength === 0) {
              // layout() - executes layout
              layout$1(this);
          }
      });
  }

  d3.selection.prototype.layout = layoutSelection;
  d3.transition.prototype.layout = layoutSelection;

  // Needs to be defined like this so that the grunt task can update it
  var version = 'development';

  var fc = {
      annotation: annotation,
      chart: chart$2,
      data: data$1,
      indicator: indicator,
      scale: scale,
      series: series,
      svg: svg,
      tool: tool,
      util: util$1,
      version: version,
      layout: layout$2
  };

  var id = 0;
  function uid() {
      return ++id;
  }

  /*global window */
  var renderedOnce = false;

  function layout(containers, charts) {

      function getSecondaryContainer(chartIndex) {
          return containers.secondaries.filter(function(d, index) { return index === chartIndex; });
      }

      var secondaryChartsShown = 0;
      for (var j = 0; j < charts.secondaries.length; j++) {
          if (charts.secondaries[j]) {
              secondaryChartsShown++;
          }
      }
      containers.secondaries
          .filter(function(d, index) { return index < secondaryChartsShown; })
          .style('flex', '1');
      containers.secondaries
          .filter(function(d, index) { return index >= secondaryChartsShown; })
          .style('flex', '0');
      containers.overlaySecondaries
          .filter(function(d, index) { return index < secondaryChartsShown; })
          .style('flex', '1');
      containers.overlaySecondaries
          .filter(function(d, index) { return index >= secondaryChartsShown; })
          .style('flex', '0');

      var headRowHeight = parseInt(containers.app.select('.head-row').style('height'), 10);
      if (!renderedOnce) {
          headRowHeight +=
            parseInt(containers.app.select('.head-row').style('padding-top'), 10) +
            parseInt(containers.app.select('.head-row').style('padding-bottom'), 10) +
            parseInt(containers.app.select('.head-row').style('margin-bottom'), 10);
          renderedOnce = true;
      }

      var useableScreenHeight = window.innerHeight - headRowHeight;

      containers.charts
        .style('height', useableScreenHeight + 'px');

      charts.xAxis.dimensionChanged(containers.xAxis);
      charts.navbar.dimensionChanged(containers.navbar);
      charts.primary.dimensionChanged(containers.primary);
      for (var i = 0; i < charts.secondaries.length; i++) {
          charts.secondaries[i].option.dimensionChanged(getSecondaryContainer(i));
      }
  }

  function trackingLatestData(domain, data) {
      var latestViewedTime = d3.max(domain, function(d) { return d.getTime(); });
      var latestDatumTime = d3.max(data, function(d) { return d.date.getTime(); });
      return latestViewedTime === latestDatumTime;
  }

  function padYDomain(yExtent, paddingPercentage) {
      var paddingArray = Array.isArray(paddingPercentage) ?
        paddingPercentage : [paddingPercentage, paddingPercentage];
      var orderedYExtentDifference = yExtent[1] - yExtent[0];

      return [yExtent[0] - orderedYExtentDifference * paddingArray[0],
          yExtent[1] + orderedYExtentDifference * paddingArray[1]];
  }

  function moveToLatest(domain, data, ratio) {
      if (arguments.length < 3) {
          ratio = 1;
      }
      var dataExtent = fc.util.extent()
        .fields('date')(data);
      var dataTimeExtent = (dataExtent[1].getTime() - dataExtent[0].getTime()) / 1000;
      var domainTimes = domain.map(function(d) { return d.getTime(); });
      var scaledDomainTimeDifference = ratio * (d3.max(domainTimes) - d3.min(domainTimes)) / 1000;
      var scaledLiveDataDomain = scaledDomainTimeDifference < dataTimeExtent ?
        [d3.time.second.offset(dataExtent[1], -scaledDomainTimeDifference), dataExtent[1]] : dataExtent;
      return scaledLiveDataDomain;
  }

  function filterDataInDateRange(domain, data) {
      var startDate = d3.min(domain, function(d) { return d.getTime(); });
      var endDate = d3.max(domain, function(d) { return d.getTime(); });

      var dataSortedByDate = data.sort(function(a, b) {
          return a.date - b.date;
      });

      var bisector = d3.bisector(function(d) { return d.date; });
      var filteredData = data.slice(
        // Pad and clamp the bisector values to ensure extents can be calculated
        Math.max(0, bisector.left(dataSortedByDate, startDate) - 1),
        Math.min(bisector.right(dataSortedByDate, endDate) + 1, dataSortedByDate.length)
      );
      return filteredData;
  }

  function centerOnDate(domain, data, centerDate) {
      var dataExtent = fc.util.extent()
        .fields('date')(data);
      var domainTimes = domain.map(function(d) { return d.getTime(); });
      var domainTimeDifference = (d3.max(domainTimes) - d3.min(domainTimes)) / 1000;

      if (centerDate.getTime() < dataExtent[0] || centerDate.getTime() > dataExtent[1]) {
          return [new Date(d3.min(domainTimes)), new Date(d3.max(domainTimes))];
      }

      var centeredDataDomain = [d3.time.second.offset(centerDate, -domainTimeDifference / 2),
          d3.time.second.offset(centerDate, domainTimeDifference / 2)];
      var timeShift = 0;
      if (centeredDataDomain[1].getTime() > dataExtent[1].getTime()) {
          timeShift = (dataExtent[1].getTime() - centeredDataDomain[1].getTime()) / 1000;
      } else if (centeredDataDomain[0].getTime() < dataExtent[0].getTime()) {
          timeShift = (dataExtent[0].getTime() - centeredDataDomain[0].getTime()) / 1000;
      }

      return [d3.time.second.offset(centeredDataDomain[0], timeShift),
          d3.time.second.offset(centeredDataDomain[1], timeShift)];
  }

  var domain = {
      centerOnDate: centerOnDate,
      filterDataInDateRange: filterDataInDateRange,
      moveToLatest: moveToLatest,
      padYDomain: padYDomain,
      trackingLatestData: trackingLatestData
  };

  var util = {
      domain: domain,
      layout: layout,
      uid: uid
  };

  var event = {
      crosshairChange: 'crosshairChange',
      viewChange: 'viewChange',
      newTrade: 'newTrade',
      historicDataLoaded: 'historicDataLoaded',
      historicFeedError: 'historicFeedError',
      streamingFeedError: 'streamingFeedError',
      dataProductChange: 'dataProductChange',
      dataPeriodChange: 'dataPeriodChange',
      resetToLatest: 'resetToLatest',
      clearAllPrimaryChartIndicatorsAndSecondaryCharts: 'clearAllPrimaryChartIndicatorsAndSecondaryCharts',
      primaryChartSeriesChange: 'primaryChartSeriesChange',
      primaryChartYValueAccessorChange: 'primaryChartYValueAccessorChange',
      primaryChartIndicatorChange: 'primaryChartIndicatorChange',
      secondaryChartChange: 'secondaryChartChange',
      indicatorChange: 'indicatorChange'
  };

  function zoomBehavior(width) {

      var dispatch = d3.dispatch('zoom');

      var zoomBehavior = d3.behavior.zoom();
      var scale;

      var allowPan = true;
      var allowZoom = true;
      var trackingLatest = true;

      function controlPan(zoomExtent) {
          // Don't pan off sides
          if (zoomExtent[0] >= 0) {
              return -zoomExtent[0];
          } else if (zoomExtent[1] <= 0) {
              return -zoomExtent[1];
          }
          return 0;
      }

      function controlZoom(zoomExtent) {
          // If zooming, and about to pan off screen, do nothing
          return (zoomExtent[0] > 0 && zoomExtent[1] < 0);
      }

      function translateXZoom(translation) {
          var tx = zoomBehavior.translate()[0];
          tx += translation;
          zoomBehavior.translate([tx, 0]);
      }

      function resetBehaviour() {
          zoomBehavior.translate([0, 0]);
          zoomBehavior.scale(1);
      }

      function zoom(selection) {

          var xExtent = fc.util.extent()
            .fields('date')(selection.datum().data);

          zoomBehavior.x(scale)
            .on('zoom', function() {
                var min = scale(xExtent[0]);
                var max = scale(xExtent[1]);

                var maxDomainViewed = controlZoom([min, max - width]);
                var panningRestriction = controlPan([min, max - width]);
                translateXZoom(panningRestriction);

                var panned = (zoomBehavior.scale() === 1);
                var zoomed = (zoomBehavior.scale() !== 1);

                if ((panned && allowPan) || (zoomed && allowZoom)) {
                    var domain = scale.domain();
                    if (maxDomainViewed) {
                        domain = xExtent;
                    } else if (zoomed && trackingLatest) {
                        domain = util.domain.moveToLatest(domain, selection.datum().data);
                    }

                    if (domain[0].getTime() !== domain[1].getTime()) {
                        dispatch.zoom(domain);
                    } else {
                        // Ensure the user can't zoom-in infinitely, causing the chart to fail to render
                        // #168, #411
                        resetBehaviour();
                    }
                } else {
                    resetBehaviour();
                }
            });

          selection.call(zoomBehavior);
      }

      zoom.allowPan = function(x) {
          if (!arguments.length) {
              return allowPan;
          }
          allowPan = x;
          return zoom;
      };

      zoom.allowZoom = function(x) {
          if (!arguments.length) {
              return allowZoom;
          }
          allowZoom = x;
          return zoom;
      };

      zoom.trackingLatest = function(x) {
          if (!arguments.length) {
              return trackingLatest;
          }
          trackingLatest = x;
          return zoom;
      };

      zoom.scale = function(x) {
          if (!arguments.length) {
              return scale;
          }
          scale = x;
          return zoom;
      };

      d3.rebind(zoom, dispatch, 'on');

      return zoom;
  }

  function base() {
      var dispatch = d3.dispatch(event.viewChange);
      var xScale = fc.scale.dateTime();
      var yScale = d3.scale.linear();
      var trackingLatest = true;
      var yAxisWidth = 60;

      var multi = fc.series.multi();
      var chart = fc.chart.cartesian(xScale, yScale)
        .plotArea(multi)
        .xTicks(0)
        .yOrient('right')
        .margin({
            top: 0,
            left: 0,
            bottom: 0,
            right: yAxisWidth
        });
      var zoomWidth;

      function secondary(selection) {
          selection.each(function(data) {
              var container = d3.select(this)
                .call(chart);

              var zoom = zoomBehavior(zoomWidth)
                .scale(xScale)
                .trackingLatest(trackingLatest)
                .on('zoom', function(domain) {
                    dispatch[event.viewChange](domain);
                });

              container.select('.plot-area-container')
                .datum({data: selection.datum()})
                .call(zoom);
          });
      }

      secondary.trackingLatest = function(x) {
          if (!arguments.length) {
              return trackingLatest;
          }
          trackingLatest = x;
          return secondary;
      };

      d3.rebind(secondary, dispatch, 'on');
      d3.rebind(secondary, multi, 'series', 'mapping', 'decorate');
      d3.rebind(secondary, chart, 'yTickValues', 'yTickFormat', 'yTicks', 'xDomain', 'yDomain');

      secondary.dimensionChanged = function(container) {
          zoomWidth = parseInt(container.style('width'), 10) - yAxisWidth;
      };

      return secondary;
  }

  function volume() {
      var dispatch = d3.dispatch(event.viewChange);
      var volumeBar = fc.series.bar()
        .yValue(function(d) { return d.volume; });

      var chart = base()
        .series([volumeBar])
        .yTicks(4)
        .on(event.viewChange, function(domain) {
            dispatch[event.viewChange](domain);
        });

      function volume(selection) {
          selection.each(function(model) {
              var paddedYExtent = fc.util.extent()
                  .fields('volume')
                  .pad(0.08)(model.data);
              if (paddedYExtent[0] < 0) {
                  paddedYExtent[0] = 0;
              }
              chart.yTickFormat(model.product.volumeFormat)
                  .trackingLatest(model.trackingLatest)
                  .xDomain(model.viewDomain)
                  .yDomain(paddedYExtent);

              selection.datum(model.data)
                  .call(chart);
          });
      }

      d3.rebind(volume, dispatch, 'on');

      volume.dimensionChanged = function(container) {
          chart.dimensionChanged(container);
      };

      return volume;
  }

  function rsi() {
      var dispatch = d3.dispatch(event.viewChange);
      var renderer = fc.indicator.renderer.relativeStrengthIndex();
      var algorithm = fc.indicator.algorithm.relativeStrengthIndex();
      var tickValues = [renderer.lowerValue(), 50, renderer.upperValue()];

      var chart = base()
        .series([renderer])
        .yTickValues(tickValues)
        .on(event.viewChange, function(domain) {
            dispatch[event.viewChange](domain);
        });

      function rsi(selection) {
          var model = selection.datum();
          algorithm(model.data);

          chart.trackingLatest(model.trackingLatest)
            .xDomain(model.viewDomain)
            .yDomain([0, 100]);

          selection.datum(model.data)
            .call(chart);
      }

      d3.rebind(rsi, dispatch, 'on');

      rsi.dimensionChanged = function(container) {
          chart.dimensionChanged(container);
      };

      return rsi;
  }

  function macd() {
      var dispatch = d3.dispatch(event.viewChange);
      var zeroLine = fc.annotation.line()
        .value(0)
        .label('');
      var renderer = fc.indicator.renderer.macd();
      var algorithm = fc.indicator.algorithm.macd();

      var chart = base()
        .series([zeroLine, renderer])
        .yTicks(5)
        .mapping(function(series) {
            return series === zeroLine ? [0] : this;
        })
        .decorate(function(g) {
            g.enter()
              .attr('class', function(d, i) {
                  return ['multi zero', 'multi'][i];
              });
        })
        .on(event.viewChange, function(domain) {
            dispatch[event.viewChange](domain);
        });

      function macd(selection) {
          var model = selection.datum();
          algorithm(model.data);

          var paddedYExtent = fc.util.extent()
              .fields('macd')
              .symmetricalAbout(0)
              .pad(0.08)(model.data.map(function(d) { return d.macd; }));
          chart.trackingLatest(model.trackingLatest)
            .xDomain(model.viewDomain)
            .yDomain(paddedYExtent);

          selection.datum(model.data)
            .call(chart);
      }

      d3.rebind(macd, dispatch, 'on');

      macd.dimensionChanged = function(container) {
          chart.dimensionChanged(container);
      };

      return macd;
  }

  var secondary = {
      base: base,
      macd: macd,
      rsi: rsi,
      volume: volume
  };

  function xAxis() {
      var xScale = fc.scale.dateTime();
      var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');

      function preventTicksMoreFrequentThanPeriod(period) {
          var scaleTickSeconds = (xScale.ticks()[1] - xScale.ticks()[0]) / 1000;
          if (scaleTickSeconds < period.seconds) {
              xAxis.ticks(period.d3TimeInterval.unit, period.d3TimeInterval.value);
          } else {
              xAxis.ticks(6);
          }
      }

      function xAxisChart(selection) {
          var model = selection.datum();
          xScale.domain(model.viewDomain);
          preventTicksMoreFrequentThanPeriod(model.period);
          selection.call(xAxis);
      }

      xAxisChart.dimensionChanged = function(container) {
          xScale.range([0, parseInt(container.style('width'), 10)]);
      };

      return xAxisChart;
  }

  function option(displayString, valueString, option, icon) {
      return {
          displayString: displayString, // TODO: is 'displayName' better?
          valueString: valueString, // TODO: is this an id?
          option: option, // TODO: Ideally, remove.
          isSelected: false,
          icon: icon
      };
  }

  function candlestickSeries() {
      var xScale = fc.scale.dateTime();
      var yScale = d3.scale.linear();
      var barWidth = fc.util.fractionalBarWidth(0.75);
      var xValue = function(d, i) { return d.date; };
      var xValueScaled = function(d, i) { return xScale(xValue(d, i)); };
      var yLowValue = function(d) { return d.low; };
      var yHighValue = function(d) { return d.high; };
      var yCloseValue = function(d, i) { return d.close; };

      var candlestickSvg = fc.svg.candlestick()
        .x(function(d) { return xScale(d.date); })
        .open(function(d) { return yScale(d.open); })
        .high(function(d) { return yScale(yHighValue(d)); })
        .low(function(d) { return yScale(yLowValue(d)); })
        .close(function(d) { return yScale(d.close); });

      var upDataJoin = fc.util.dataJoin()
        .selector('path.up')
        .element('path')
        .attr('class', 'up');

      var downDataJoin = fc.util.dataJoin()
        .selector('path.down')
        .element('path')
        .attr('class', 'down');

      var candlestick = function(selection) {
          selection.each(function(data) {
              candlestickSvg.width(barWidth(data.map(xValueScaled)));

              var upData = data.filter(function(d) { return d.open < d.close; });
              var downData = data.filter(function(d) { return d.open >= d.close; });

              upDataJoin(this, [upData])
                .attr('d', candlestickSvg);

              downDataJoin(this, [downData])
                .attr('d', candlestickSvg);
          });
      };

      candlestick.xScale = function(x) {
          if (!arguments.length) {
              return xScale;
          }
          xScale = x;
          return candlestick;
      };
      candlestick.yScale = function(x) {
          if (!arguments.length) {
              return yScale;
          }
          yScale = x;
          return candlestick;
      };
      candlestick.xValue = function(x) {
          if (!arguments.length) {
              return xValue;
          }
          xValue = x;
          return candlestick;
      };
      candlestick.yLowValue = function(x) {
          if (!arguments.length) {
              return yLowValue;
          }
          yLowValue = x;
          return candlestick;
      };
      candlestick.yHighValue = function(x) {
          if (!arguments.length) {
              return yHighValue;
          }
          yHighValue = x;
          return candlestick;
      };
      candlestick.yCloseValue = function(x) {
          if (!arguments.length) {
              return yCloseValue;
          }
          yCloseValue = x;
          return candlestick;
      };
      candlestick.width = function(data) {
          return barWidth(data.map(xValueScaled));
      };

      return candlestick;
  }

  function calculateCloseAxisTagPath(width, height) {
      var h2 = height / 2;
      return [
          [0, 0],
          [h2, -h2],
          [width, -h2],
          [width, h2],
          [h2, h2],
          [0, 0]
      ];
  }

  function produceAnnotatedTickValues(scale, annotation) {
      var annotatedTickValues = scale.ticks.apply(scale, []);

      var extent = scale.domain();
      for (var i = 0; i < annotation.length; i++) {
          if (annotation[i] > extent[0] && annotation[i] < extent[1]) {
              annotatedTickValues.push(annotation[i]);
          }
      }
      return annotatedTickValues;
  }

  function findTotalYExtent(visibleData, currentSeries, currentIndicators) {
      var extentAccessor;
      switch (currentSeries.valueString) {
      case 'candlestick':
      case 'ohlc':
          extentAccessor = [currentSeries.option.yLowValue(), currentSeries.option.yHighValue()];
          break;
      case 'line':
      case 'point':
          extentAccessor = currentSeries.option.yValue();
          break;
      case 'area' :
          extentAccessor = currentSeries.option.y1Value();
          break;
      default:
          throw new Error('Main series given to chart does not have expected interface');
      }
      var extent = fc.util.extent()
        .fields(extentAccessor)(visibleData);

      if (currentIndicators.length) {
          var indicators = currentIndicators.map(function(indicator) { return indicator.valueString; });
          var movingAverageShown = (indicators.indexOf('movingAverage') !== -1);
          var bollingerBandsShown = (indicators.indexOf('bollinger') !== -1);
          if (bollingerBandsShown) {
              var bollingerBandsVisibleDataObject = visibleData.map(function(d) { return d.bollingerBands; });
              var bollingerBandsExtent = fc.util.extent()
                .fields(['lower', 'upper'])(bollingerBandsVisibleDataObject);
              extent[0] = d3.min([bollingerBandsExtent[0], extent[0]]);
              extent[1] = d3.max([bollingerBandsExtent[1], extent[1]]);
          }
          if (movingAverageShown) {
              var movingAverageExtent = fc.util.extent()
                .fields('movingAverage')(visibleData);
              extent[0] = d3.min([movingAverageExtent[0], extent[0]]);
              extent[1] = d3.max([movingAverageExtent[1], extent[1]]);
          }
          if (!(movingAverageShown || bollingerBandsShown)) {
              throw new Error('Unexpected indicator type');
          }
      }
      return extent;
  }

  function primary() {

      var yAxisWidth = 60;
      var dispatch = d3.dispatch(event.viewChange, event.crosshairChange);

      var currentSeries;
      var currentYValueAccessor = function(d) { return d.close; };
      var currentIndicators = [];
      var zoomWidth;

      var crosshairData = [];
      var crosshair = fc.tool.crosshair()
        .xLabel('')
        .yLabel('')
        .on('trackingmove', function(updatedCrosshairData) {
            if (updatedCrosshairData.length > 0) {
                dispatch.crosshairChange(updatedCrosshairData[0].datum);
            } else {
                dispatch.crosshairChange(undefined);
            }
        })
        .on('trackingend', function() {
            dispatch.crosshairChange(undefined);
        });
      crosshair.id = util.uid();

      var gridlines = fc.annotation.gridline()
        .yTicks(5)
        .xTicks(0);
      var closeLine = fc.annotation.line()
        .orient('horizontal')
        .value(currentYValueAccessor)
        .label('');
      closeLine.id = util.uid();

      var multi = fc.series.multi()
          .key(function(series) { return series.id; })
          .mapping(function(series) {
              switch (series) {
              case closeLine:
                  return [this.data[this.data.length - 1]];
              case crosshair:
                  return crosshairData;
              default:
                  return this.data;
              }
          });

      var xScale = fc.scale.dateTime();
      var yScale = d3.scale.linear();

      var primaryChart = fc.chart.cartesian(xScale, yScale)
        .xTicks(0)
        .yOrient('right')
        .margin({
            top: 0,
            left: 0,
            bottom: 0,
            right: yAxisWidth
        });

      // Create and apply the Moving Average
      var movingAverage = fc.indicator.algorithm.movingAverage();
      var bollingerAlgorithm = fc.indicator.algorithm.bollingerBands();

      function updateMultiSeries() {
          var baseChart = [gridlines, currentSeries.option, closeLine];
          var indicators = currentIndicators.map(function(indicator) { return indicator.option; });
          return baseChart.concat(indicators, crosshair);
      }

      function updateYValueAccessorUsed() {
          movingAverage.value(currentYValueAccessor);
          bollingerAlgorithm.value(currentYValueAccessor);
          closeLine.value(currentYValueAccessor);
          switch (currentSeries.valueString) {
          case 'line':
          case 'point':
          case 'area':
              currentSeries.option.yValue(currentYValueAccessor);
              break;
          default:
              break;
          }
      }

      // Call when what to display on the chart is modified (ie series, options)
      function selectorsChanged(model) {
          currentSeries = model.series;
          currentYValueAccessor = model.yValueAccessor.option;
          currentIndicators = model.indicators;
          updateYValueAccessorUsed();
          multi.series(updateMultiSeries());
          primaryChart.yTickFormat(model.product.priceFormat);
          model.selectorsChanged = false;
      }

      function bandCrosshair(data) {
          var width = currentSeries.option.width(data);

          crosshair.decorate(function(selection) {
              selection.classed('band hidden-xs hidden-sm', true);

              selection.selectAll('.vertical > line')
                .style('stroke-width', width);
          });
      }

      function lineCrosshair(selection) {
          selection.classed('band', false)
              .classed('hidden-xs hidden-sm', true)
              .selectAll('line')
              .style('stroke-width', null);
      }
      function updateCrosshairDecorate(data) {
          if (currentSeries.valueString === 'candlestick' || currentSeries.valueString === 'ohlc') {
              bandCrosshair(data);
          } else {
              crosshair.decorate(lineCrosshair);
          }
      }

      function primary(selection) {
          var model = selection.datum();

          if (model.selectorsChanged) {
              selectorsChanged(model);
          }

          primaryChart.xDomain(model.viewDomain);

          crosshair.snap(fc.util.seriesPointSnapXOnly(currentSeries.option, model.data));
          updateCrosshairDecorate(model.data);

          movingAverage(model.data);
          bollingerAlgorithm(model.data);

          // Scale y axis
          var visibleData = util.domain.filterDataInDateRange(primaryChart.xDomain(), model.data);
          var yExtent = findTotalYExtent(visibleData, currentSeries, currentIndicators);
          // Add percentage padding either side of extreme high/lows
          var paddedYExtent = util.domain.padYDomain(yExtent, 0.04);
          primaryChart.yDomain(paddedYExtent);

          // Find current tick values and add close price to this list, then set it explicitly below
          var latestPrice = currentYValueAccessor(model.data[model.data.length - 1]);
          var tickValues = produceAnnotatedTickValues(yScale, [latestPrice]);
          primaryChart.yTickValues(tickValues)
            .yDecorate(function(s) {
                s.selectAll('.tick')
                  .filter(function(d) { return d === latestPrice; })
                  .classed('closeLine', true)
                  .select('path')
                  .attr('d', function(d) {
                      return d3.svg.area()(calculateCloseAxisTagPath(yAxisWidth, 14));
                  });
            });

          // Redraw
          primaryChart.plotArea(multi);
          selection.call(primaryChart);

          var zoom = zoomBehavior(zoomWidth)
            .scale(xScale)
            .trackingLatest(model.trackingLatest)
            .on('zoom', function(domain) {
                dispatch[event.viewChange](domain);
            });

          selection.select('.plot-area')
            .call(zoom);
      }

      d3.rebind(primary, dispatch, 'on');

      // Call when the main layout is modified
      primary.dimensionChanged = function(container) {
          zoomWidth = parseInt(container.style('width'), 10) - yAxisWidth;
      };

      return primary;
  }

  function nav() {
      var navHeight = 100; // Also maintain in variables.less
      var bottomMargin = 40; // Also maintain in variables.less
      var navChartHeight = navHeight - bottomMargin;
      var backgroundStrokeWidth = 2; // Also maintain in variables.less
      // Stroke is half inside half outside, so stroke/2 per border
      var borderWidth = backgroundStrokeWidth / 2;
      // should have been 2 * borderWidth, but for unknown reason it is incorrect in practice.
      var extentHeight = navChartHeight - borderWidth;
      var barHeight = extentHeight;
      var handleCircleCenter = borderWidth + barHeight / 2;
      var handleBarWidth = 2;

      var dispatch = d3.dispatch(event.viewChange);

      var navChart = fc.chart.cartesian(fc.scale.dateTime(), d3.scale.linear())
        .yTicks(0)
        .margin({
            bottom: bottomMargin      // Variable also in navigator.less - should be used once ported to flex
        });

      var viewScale = fc.scale.dateTime();

      var area = fc.series.area()
        .yValue(function(d) { return d.close; });
      var line = fc.series.line()
        .yValue(function(d) { return d.close; });
      var brush = d3.svg.brush();
      var navMulti = fc.series.multi()
        .series([area, line, brush])
        .decorate(function(selection) {
            var enter = selection.enter();

            selection.select('.extent')
              .attr('height', extentHeight)
              .attr('y', backgroundStrokeWidth / 2);

            // overload d3 styling for the brush handles
            // as Firefox does not react properly to setting these through less file.
            enter.selectAll('.resize.w>rect, .resize.e>rect')
              .attr('width', handleBarWidth)
              .attr('x', -handleBarWidth / 2);
            selection.selectAll('.resize.w>rect, .resize.e>rect')
              .attr('height', barHeight)
              .attr('y', borderWidth);

            // Adds the handles to the brush sides
            var handles = enter.selectAll('.e, .w');
            handles.append('circle')
              .attr('cy', handleCircleCenter)
              .attr('r', 7)
              .attr('class', 'outer-handle');
            handles.append('circle')
              .attr('cy', handleCircleCenter)
              .attr('r', 4)
              .attr('class', 'inner-handle');
        })
        .mapping(function(series) {
            if (series === brush) {
                brush.extent([
                    [viewScale.domain()[0], navChart.yDomain()[0]],
                    [viewScale.domain()[1], navChart.yDomain()[1]]
                ]);
            } else {
                // This stops the brush data being overwritten by the point data
                return this.data;
            }
        });
      var layoutWidth;


      function setHide(selection, brushHide) {
          selection.select('.plot-area')
            .selectAll('.e, .w')
            .classed('hidden', brushHide);
      }

      function xEmpty(navBrush) {
          return ((navBrush.extent()[0][0] - navBrush.extent()[1][0]) === 0);
      }

      function nav(selection) {
          var model = selection.datum();

          viewScale.domain(model.viewDomain);

          var filteredData = util.domain.filterDataInDateRange(
            fc.util.extent().fields('date')(model.data),
            model.data);
          var yExtent = fc.util.extent()
            .fields(['low', 'high'])(filteredData);

          var brushHide = false;

          navChart.xDomain(fc.util.extent().fields('date')(model.data))
            .yDomain(yExtent);

          brush.on('brush', function() {
              var brushExtentIsEmpty = xEmpty(brush);

              // Hide the bar if the extent is empty
              setHide(selection, brushExtentIsEmpty);
              if (!brushExtentIsEmpty) {
                  dispatch[event.viewChange]([brush.extent()[0][0], brush.extent()[1][0]]);
              }
          })
              .on('brushend', function() {
                  var brushExtentIsEmpty = xEmpty(brush);
                  setHide(selection, false);
                  if (brushExtentIsEmpty) {
                      dispatch[event.viewChange](util.domain.centerOnDate(viewScale.domain(),
                          model.data, brush.extent()[0][0]));
                  }
              });

          navChart.plotArea(navMulti);
          selection.call(navChart);

          // Allow to zoom using mouse, but disable panning
          var zoom = zoomBehavior(layoutWidth)
            .scale(viewScale)
            .trackingLatest(model.trackingLatest)
            .allowPan(false)
            .on('zoom', function(domain) {
                dispatch[event.viewChange](domain);
            });

          selection.select('.plot-area')
            .call(zoom);
      }

      d3.rebind(nav, dispatch, 'on');

      nav.dimensionChanged = function(container) {
          layoutWidth = parseInt(container.style('width'), 10);
          viewScale.range([0, layoutWidth]);
      };

      return nav;
  }

  function legend() {
      var formatPrice;
      var formatVolume;
      var formatTime;
      var lastDataPointDisplayed;

      var legendItems = [
          'T',
          function(d) { return formatTime(d.date); },
          'O',
          function(d) { return formatPrice(d.open); },
          'H',
          function(d) { return formatPrice(d.high); },
          'L',
          function(d) { return formatPrice(d.low); },
          'C',
          function(d) { return formatPrice(d.close); },
          'V',
          function(d) { return formatVolume(d.volume); }
      ];

      function legend(selection) {
          selection.each(function(model) {
              var container = d3.select(this);

              formatPrice = model.product.priceFormat;
              formatVolume = model.product.volumeFormat;
              formatTime = model.period.timeFormat;

              if (model.data == null || model.data !== lastDataPointDisplayed) {
                  lastDataPointDisplayed = model.data;

                  var span = container.selectAll('span')
                    .data(legendItems);

                  span.enter()
                    .append('span')
                    .attr('class', function(d, i) { return i % 2 === 0 ? 'legendLabel' : 'legendValue'; });

                  span.text(function(d, i) {
                      var text = '';
                      if (i % 2 === 0) {
                          return d;
                      } else if (model.data) {
                          return d(model.data);
                      }
                      return text;
                  });
              }
          });
      }

      return legend;
  }

  var chart = {
      legend: legend,
      nav: nav,
      primary: primary,
      xAxis: xAxis,
      secondary: secondary
  };

  function source(historicFeed, streamingFeed) {
      return {
          historic: historicFeed,
          streaming: streamingFeed
      };
  }

  function product(config) {
      return {
          id: config.id,
          display: config.display || 'Unspecified Product',
          priceFormat: d3.format(config.priceFormat || '.2f'),
          volumeFormat: d3.format(config.volumeFormat || '.2f'),
          periods: config.periods || [],
          source: config.source
      };
  }

  function period(config) {
      config = config || {};
      return {
          display: config.display || '1 day',
          seconds: config.seconds || 60 * 60 * 24,
          d3TimeInterval: config.d3TimeInterval || {unit: d3.time.day, value: 1},
          timeFormat: d3.time.format(config.timeFormat || '%b %d')
      };
  }

  var data = {
      period: period,
      product: product,
      source: source
  };

  function xAxis$1(initialPeriod) {
      return {
          viewDomain: [],
          period: initialPeriod
      };
  }

  function secondary$1(initialProduct) {
      return {
          data: [],
          viewDomain: [],
          trackingLatest: true,
          product: initialProduct
      };
  }

  function primary$1(initialProduct) {
      var model = {
          data: [],
          trackingLatest: true,
          viewDomain: [],
          selectorsChanged: true
      };

      var _product = initialProduct;
      Object.defineProperty(model, 'product', {
          get: function() { return _product; },
          set: function(newValue) {
              _product = newValue;
              model.selectorsChanged = true;
          }
      });

      var candlestick = candlestickSeries();
      candlestick.id = util.uid();
      var _series = option('Candlestick', 'candlestick', candlestick);
      Object.defineProperty(model, 'series', {
          get: function() { return _series; },
          set: function(newValue) {
              _series = newValue;
              model.selectorsChanged = true;
          }
      });

      var _yValueAccessor = {option: function(d) { return d.close; }};
      Object.defineProperty(model, 'yValueAccessor', {
          get: function() { return _yValueAccessor; },
          set: function(newValue) {
              _yValueAccessor = newValue;
              model.selectorsChanged = true;
          }
      });

      var _indicators = [];
      Object.defineProperty(model, 'indicators', {
          get: function() { return _indicators; },
          set: function(newValue) {
              _indicators = newValue;
              model.selectorsChanged = true;
          }
      });

      return model;
  }

  function navigationReset$1() {
      return {
          trackingLatest: true
      };
  }

  function nav$1() {
      return {
          data: [],
          viewDomain: [],
          trackingLatest: true
      };
  }

  function legend$1(initialProduct, initialPeriod) {
      return {
          data: undefined,
          product: initialProduct,
          period: initialPeriod
      };
  }

  var chart$1 = {
      legend: legend$1,
      nav: nav$1,
      navigationReset: navigationReset$1,
      primary: primary$1,
      secondary: secondary$1,
      xAxis: xAxis$1
  };

  function overlay$1() {

      return {
          primaryIndicators: [],
          secondaryIndicators: []
      };
  }

  // Generates a menu option similar to those generated by sc.model.menu.option from a sc.model.data.product object
  function productAdaptor(product) {
      return {
          displayString: product.display,
          option: product
      };
  }

  // Generates a menu option similar to those generated by model.menu.option from a model.data.period object
  function periodAdaptor(period) {
      return {
          displayString: period.display,
          option: period
      };
  }

  function head$1(initialProducts, initialSelectedProduct, initialSelectedPeriod) {
      return {
          productConfig: {
              title: null,
              careted: true,
              listIcons: false,
              icon: false
          },
          mobilePeriodConfig: {
              title: null,
              careted: false,
              listIcons: false,
              icon: false
          },
          products: initialProducts,
          selectedProduct: initialSelectedProduct,
          selectedPeriod: initialSelectedPeriod
      };
  }

  function seriesSelector() {

      var candlestick = candlestickSeries();
      candlestick.id = util.uid();
      var candlestickOption = option(
        'Candlestick',
        'candlestick',
        candlestick,
        'sc-icon-candlestick-series');
      candlestickOption.isSelected = true;

      var ohlc = fc.series.ohlc();
      ohlc.id = util.uid();

      var line = fc.series.line();
      line.id = util.uid();

      var point = fc.series.point();
      point.id = util.uid();

      var area = fc.series.area();
      area.id = util.uid();

      return {
          config: {
              title: null,
              careted: false,
              listIcons: true,
              icon: true
          },
          options: [
              candlestickOption,
              option('OHLC', 'ohlc', ohlc, 'sc-icon-ohlc-series'),
              option('Line', 'line', line, 'sc-icon-line-series'),
              option('Point', 'point', point, 'sc-icon-point-series'),
              option('Area', 'area', area, 'sc-icon-area-series')
          ]};
  }

  var movingAverage$1 = fc.series.line()
    .decorate(function(select) {
        select.enter()
          .classed('movingAverage', true);
    })
    .yValue(function(d) { return d.movingAverage; });
  movingAverage$1.id = util.uid();

  var bollingerBands$2 = fc.indicator.renderer.bollingerBands();
  bollingerBands$2.id = util.uid();

  var indicatorOptions = [
      option('Moving Average', 'movingAverage',
        movingAverage$1, 'sc-icon-moving-average-indicator'),
      option('Bollinger Bands', 'bollinger',
        bollingerBands$2, 'sc-icon-bollinger-bands-indicator')
  ];

  var secondaryChartOptions = [
      option(
          'Relative Strength Index',
          'secondary-rsi',
          secondary.rsi(),
          'sc-icon-rsi-indicator'),
      option(
          'MACD',
          'secondary-macd',
          secondary.macd(),
          'sc-icon-macd-indicator'),
      option(
          'Volume',
          'secondary-volume',
          secondary.volume(),
          'sc-icon-bar-series')
  ];

  function indicatorSelector() {
      return {
          config: {
              title: 'Add Indicator',
              careted: false,
              listIcons: true,
              icon: false
          },
          indicatorOptions: indicatorOptions,
          secondaryChartOptions: secondaryChartOptions
      };
  }

  function selectors$1() {

      // TODO: Instantiate series/indicator components outside of menu model?
      return {
          seriesSelector: seriesSelector(),
          indicatorSelector: indicatorSelector()
      };
  }

  var menu$1 = {
      selectors: selectors$1,
      head: head$1,
      periodAdaptor: periodAdaptor,
      productAdaptor: productAdaptor,
      overlay: overlay$1
  };

  var model = {
      menu: menu$1,
      chart: chart$1,
      data: data
  };

  function quandlAdaptor() {

      var historicFeed = fc.data.feed.quandl(),
          granularity,
          candles;

      // More options are allowed through the API; for now, only support daily and weekly
      var allowedPeriods = d3.map();
      allowedPeriods.set(60 * 60 * 24, 'daily');
      allowedPeriods.set(60 * 60 * 24 * 7, 'weekly');

      function quandlAdaptor(cb) {
          var startDate = d3.time.second.offset(historicFeed.end(), -candles * granularity);
          historicFeed.apiKey('kM9Z9aEULVDD7svZ4A8B');
          historicFeed.start(startDate)
              .collapse(allowedPeriods.get(granularity));
          historicFeed(cb);
      }

      quandlAdaptor.candles = function(x) {
          if (!arguments.length) {
              return candles;
          }
          candles = x;
          return quandlAdaptor;
      };

      quandlAdaptor.granularity = function(x) {
          if (!arguments.length) {
              return granularity;
          }
          if (!allowedPeriods.has(x)) {
              throw new Error('Granularity of ' + x + ' is not supported.');
          }
          granularity = x;
          return quandlAdaptor;
      };

      fc.util.rebind(quandlAdaptor, historicFeed, {
          end: 'end',
          product: 'dataset'
      });

      return quandlAdaptor;
  }

  // https://docs.exchange.coinbase.com/#websocket-feed

  function webSocket() {

      var product = 'BTC-USD';
      var dispatch = d3.dispatch('open', 'close', 'error', 'message');
      var messageType = 'match';
      var socket;

      var webSocket = function(url, subscribe) {
          url = url || 'wss://ws-feed.exchange.coinbase.com';
          subscribe = subscribe || {
              'type': 'subscribe',
              'product_id': product
          };

          socket = new WebSocket(url);

          socket.onopen = function(event) {
              socket.send(JSON.stringify(subscribe));
              dispatch.open(event);
          };
          socket.onerror = function(event) {
              dispatch.error(event);
          };
          socket.onclose = function(event) {
              dispatch.close(event);
          };
          socket.onmessage = function(event) {
              var msg = JSON.parse(event.data);
              if (msg.type === messageType) {
                  dispatch.message(msg);
              } else if (msg.type === 'error') {
                  dispatch.error(msg);
              }
          };
      };

      d3.rebind(webSocket, dispatch, 'on');

      webSocket.close = function() {
          if (socket) {
              socket.close();
          }
      };

      webSocket.messageType = function(x) {
          if (!arguments.length) {
              return messageType;
          }
          messageType = x;
          return webSocket;
      };

      webSocket.product = function(x) {
          if (!arguments.length) {
              return product;
          }
          product = x;
          return webSocket;
      };

      return webSocket;
  }

  function coinbaseAdaptor() {

      var historicFeed = fc.data.feed.coinbase(),
          candles;

      function coinbaseAdaptor(cb) {
          var startDate = d3.time.second.offset(historicFeed.end(), -candles * historicFeed.granularity());
          historicFeed.start(startDate);
          historicFeed(cb);
      }

      coinbaseAdaptor.candles = function(x) {
          if (!arguments.length) {
              return candles;
          }
          candles = x;
          return coinbaseAdaptor;
      };

      d3.rebind(coinbaseAdaptor, historicFeed, 'end', 'granularity', 'product');

      return coinbaseAdaptor;
  }

  function dataGeneratorAdaptor() {

      var dataGenerator = fc.data.random.financial(),
          allowedPeriods = [60 * 60 * 24],
          candles,
          end,
          granularity,
          product = null;

      var dataGeneratorAdaptor = function(cb) {
          end.setHours(0, 0, 0, 0);
          var millisecondsPerDay = 24 * 60 * 60 * 1000;
          dataGenerator.startDate(new Date(end - (candles - 1) * millisecondsPerDay));

          var data = dataGenerator(candles);
          cb(null, data);
      };

      dataGeneratorAdaptor.candles = function(x) {
          if (!arguments.length) {
              return candles;
          }
          candles = x;
          return dataGeneratorAdaptor;
      };

      dataGeneratorAdaptor.end = function(x) {
          if (!arguments.length) {
              return end;
          }
          end = x;
          return dataGeneratorAdaptor;
      };

      dataGeneratorAdaptor.granularity = function(x) {
          if (!arguments.length) {
              return granularity;
          }
          if (allowedPeriods.indexOf(x) === -1) {
              throw new Error('Granularity of ' + x + ' is not supported. '
               + 'Random Financial Data Generator only supports daily data.');
          }
          granularity = x;
          return dataGeneratorAdaptor;
      };

      dataGeneratorAdaptor.product = function(x) {
          if (!arguments.length) {
              return dataGeneratorAdaptor;
          }
          if (x !== null) {
              throw new Error('Random Financial Data Generator does not support products.');
          }
          product = x;
          return dataGeneratorAdaptor;
      };

      return dataGeneratorAdaptor;
  }

  function editIndicatorGroup() {
      var dispatch = d3.dispatch(event.indicatorChange);

      function editIndicatorGroup(selection) {
          selection.each(function(model) {
              var sel = d3.select(this);

              var div = sel.selectAll('div')
                  .data(model.selectedIndicators, function(d) {
                      return d.valueString;
                  });

              var containersEnter = div.enter()
                  .append('div')
                  .attr('class', 'edit-indicator');

              containersEnter.append('span')
                  .attr('class', 'icon sc-icon-delete')
                  .on('click', dispatch.indicatorChange);

              containersEnter.append('span')
                  .attr('class', 'indicator-label')
                  .text(function(d) {
                      return d.displayString;
                  });

              div.exit()
                  .remove();
          });
      }

      d3.rebind(editIndicatorGroup, dispatch, 'on');

      return editIndicatorGroup;

  }

  function overlay() {
      var dispatch = d3.dispatch(
          event.primaryChartIndicatorChange,
          event.secondaryChartChange);

      var primaryChartIndicatorToggle = editIndicatorGroup()
          .on(event.indicatorChange, dispatch[event.primaryChartIndicatorChange]);

      var secondaryChartToggle = editIndicatorGroup()
          .on(event.indicatorChange, dispatch[event.secondaryChartChange]);

      var overlay = function(selection) {
          selection.each(function(model) {
              var container = d3.select(this);

              container.select('#overlay-primary-container .edit-indicator-container')
                  .datum({selectedIndicators: model.primaryIndicators})
                  .call(primaryChartIndicatorToggle);

              container.selectAll('.overlay-secondary-container')
                  .each(function(d, i) {
                      var currentSelection = d3.select(this);

                      var selectedIndicators = model.secondaryIndicators[i] ? [model.secondaryIndicators[i]] : [];

                      currentSelection.select('.edit-indicator-container')
                          .datum({selectedIndicators: selectedIndicators})
                          .call(secondaryChartToggle);
                  });
          });
      };

      d3.rebind(overlay, dispatch, 'on');

      return overlay;
  }

  function navigationReset() {

      var dispatch = d3.dispatch(event.resetToLatest);

      function navReset(selection) {
          var model = selection.datum();

          var resetButton = selection.selectAll('g')
            .data([model]);

          resetButton.enter()
            .append('g')
            .attr('class', 'reset-button')
            .on('click', function() { dispatch[event.resetToLatest](); })
            .append('path')
            .attr('d', 'M1.5 1.5h13.438L23 20.218 14.937 38H1.5l9.406-17.782L1.5 1.5z');

          resetButton.classed('active', !model.trackingLatest);
      }

      d3.rebind(navReset, dispatch, 'on');

      return navReset;
  }

  function dropdown() {
      var dispatch = d3.dispatch('optionChange');

      var buttonDataJoin = fc.util.dataJoin()
          .selector('button')
          .element('button')
          .attr({
              'class': 'dropdown-toggle',
              'type': 'button',
              'data-toggle': 'dropdown'
          });

      var caretDataJoin = fc.util.dataJoin()
          .selector('.caret')
          .element('span')
          .attr('class', 'caret');

      var listDataJoin = fc.util.dataJoin()
          .selector('ul')
          .element('ul')
          .attr('class', 'dropdown-menu');

      var listItemsDataJoin = fc.util.dataJoin()
          .selector('li')
          .element('li')
          .key(function(d) { return d.displayString; });

      function dropdown(selection) {
          var model = selection.datum();
          var selectedIndex = model.selectedIndex || 0;
          var config = model.config;

          var button = buttonDataJoin(selection, [model.options]);

          if (config.icon) {
              var dropdownButtonIcon = button.selectAll('.icon')
                  .data([0]);
              dropdownButtonIcon.enter()
                  .append('span');
              dropdownButtonIcon.attr('class', 'icon ' + model.options[selectedIndex].icon);
          } else {
              button.select('.icon').remove();
              button.text(function() {
                  return config.title || model.options[selectedIndex].displayString;
              });
          }

          caretDataJoin(button, config.careted ? [0] : []);

          var list = listDataJoin(selection, [model.options]);

          var listItems = listItemsDataJoin(list, model.options);
          var listItemAnchors = listItems.enter()
              .on('click', dispatch.optionChange)
              .append('a')
              .attr('href', '#');

          listItemAnchors.append('span')
              .attr('class', 'icon');
          listItemAnchors.append('span')
              .attr('class', 'name');

          listItems.selectAll('.icon')
              .attr('class', function(d) { return 'icon ' + d.icon; });
          listItems.selectAll('.name')
              .text(function(d) { return d.displayString; });
      }

      d3.rebind(dropdown, dispatch, 'on');

      return dropdown;
  }

  function selectors() {
      var dispatch = d3.dispatch(
        event.primaryChartSeriesChange,
        event.primaryChartIndicatorChange,
        event.secondaryChartChange);

      var primaryChartSeriesButtons = dropdown()
        .on('optionChange', dispatch[event.primaryChartSeriesChange]);

      var indicatorToggle = dropdown()
        .on('optionChange', function(indicator) {
            if (indicator.valueString.indexOf('secondary') === 0) {
                dispatch[event.secondaryChartChange](indicator);
            } else {
                dispatch[event.primaryChartIndicatorChange](indicator);
            }
        });

      var selectors = function(selection) {
          selection.each(function(model) {
              var container = d3.select(this);

              var selectedSeriesIndex = model.seriesSelector.options.map(function(option) {
                  return option.isSelected;
              }).indexOf(true);

              container.select('#series-dropdown')
                .datum({config: model.seriesSelector.config,
                    options: model.seriesSelector.options,
                    selectedIndex: selectedSeriesIndex})
                .call(primaryChartSeriesButtons);

              var indicators = model.indicatorSelector.indicatorOptions
                .concat(model.indicatorSelector.secondaryChartOptions);

              var selectedIndicatorIndexes = indicators
                .map(function(option, index) {
                    return option.isSelected ? index : null;
                })
                .filter(function(option) {
                    return option;
                });

              container.select('#indicator-dropdown')
                .datum({config: model.indicatorSelector.config,
                    options: indicators,
                    selected: selectedIndicatorIndexes})
                .call(indicatorToggle);

          });
      };

      d3.rebind(selectors, dispatch, 'on');

      return selectors;
  }

  function tabGroup() {
      var dispatch = d3.dispatch('tabClick');
      var dataJoin = fc.util.dataJoin()
        .selector('ul')
        .element('ul');

      function tabGroup(selection) {
          var selectedIndex = selection.datum().selectedIndex || 0;

          var ul = dataJoin(selection, [selection.datum().options]);

          ul.enter()
              .append('ul');

          var li = ul.selectAll('li')
              .data(fc.util.fn.identity);

          li.enter()
              .append('li')
              .append('a')
              .attr('href', '#')
              .on('click', dispatch.tabClick);

          li.classed('active', function(d, i) { return i === selectedIndex; })
              .select('a')
              .text(function(option) { return option.displayString; });

          li.exit()
              .remove();
      }

      d3.rebind(tabGroup, dispatch, 'on');
      return tabGroup;
  }

  function head() {

      var dispatch = d3.dispatch(
          event.dataProductChange,
          event.dataPeriodChange,
          event.clearAllPrimaryChartIndicatorsAndSecondaryCharts);

      var dataProductDropdown = dropdown()
          .on('optionChange', dispatch[event.dataProductChange]);

      var dataPeriodSelector = tabGroup()
          .on('tabClick', dispatch[event.dataPeriodChange]);

      var dropdownPeriodSelector = dropdown()
          .on('optionChange', dispatch[event.dataPeriodChange]);

      var head = function(selection) {
          selection.each(function(model) {
              var container = d3.select(this);

              var products = model.products;
              container.select('#product-dropdown')
                  .datum({
                      config: model.productConfig,
                      options: products.map(productAdaptor),
                      selectedIndex: products.indexOf(model.selectedProduct)
                  })
                  .call(dataProductDropdown);

              var periods = model.selectedProduct.periods;
              container.select('#period-selector')
                  .classed('hidden', periods.length <= 1) // TODO: get from model instead?
                  .datum({
                      options: periods.map(periodAdaptor),
                      selectedIndex: periods.indexOf(model.selectedPeriod)
                  })
                  .call(dataPeriodSelector);

              container.select('#mobile-period-selector')
                  .classed('hidden', periods.length <= 1)
                  .datum({
                      config: model.mobilePeriodConfig,
                      options: periods.map(periodAdaptor),
                      selectedIndex: periods.indexOf(model.selectedPeriod)
                  })
                  .call(dropdownPeriodSelector);

              container.select('#clear-indicators')
                  .on('click', dispatch[event.clearAllPrimaryChartIndicatorsAndSecondaryCharts]);

              selection.select('#toggle-button')
                  .on('click', function() {
                      dispatch[event.toggleSlideout]();
                  });
          });
      };

      d3.rebind(head, dispatch, 'on');

      return head;
  }

  var menu = {
      head: head,
      selectors: selectors,
      navigationReset: navigationReset,
      overlay: overlay
  };

  function callbackInvalidator() {
      var n = 0;

      function callbackInvalidator(callback) {
          var id = ++n;
          return function(err, data) {
              if (id < n) { return; }
              callback(err, data);
          };
      }

      callbackInvalidator.invalidateCallback = function() {
          n++;
          return callbackInvalidator;
      };

      return callbackInvalidator;
  }

  function collectOhlc() {

      var date = function(d) { return d.date; };
      var volume = function(d) { return Number(d.volume); };
      var price = function(d) { return Number(d.price); };
      var granularity = 60;

      function getBucketStart(tradeDate) {
          var granularityInMs = granularity * 1000;
          return new Date(Math.floor(tradeDate.getTime() / granularityInMs) * granularityInMs);
      }

      var collectOhlc = function(data, trade) {
          var bucketStart = getBucketStart(date(trade));
          var tradePrice = price(trade);
          var tradeVolume = volume(trade);
          var bisectDate = d3.bisector(function(d) { return d.date; }).left;
          var existing = data.filter(function(d) {
              return d.date.getTime() === bucketStart.getTime();
          })[0];
          if (existing) {
              existing.high = Math.max(tradePrice, existing.high);
              existing.low = Math.min(tradePrice, existing.low);
              existing.close = tradePrice;
              existing.volume += tradeVolume;
          } else {
              data.splice(bisectDate(data, bucketStart), 0, {
                  date: bucketStart,
                  open: tradePrice,
                  high: tradePrice,
                  low: tradePrice,
                  close: tradePrice,
                  volume: tradeVolume
              });
          }
      };

      collectOhlc.granularity = function(x) {
          if (!arguments.length) {
              return granularity;
          }
          granularity = x;
          return collectOhlc;
      };

      collectOhlc.price = function(x) {
          if (!arguments.length) {
              return price;
          }
          price = x;
          return collectOhlc;
      };

      collectOhlc.volume = function(x) {
          if (!arguments.length) {
              return volume;
          }
          volume = x;
          return collectOhlc;
      };

      collectOhlc.date = function(x) {
          if (!arguments.length) {
              return date;
          }
          date = x;
          return collectOhlc;
      };

      return collectOhlc;
  }

  function dataInterface() {
      var dispatch = d3.dispatch(
          event.historicDataLoaded,
          event.historicFeedError,
          event.newTrade,
          event.streamingFeedError);

      var _collectOhlc = collectOhlc()
          .date(function(d) {return new Date(d.time); })
          .volume(function(d) {return Number(d.size); });

      var historicFeed,
          streamingFeed,
          callbackGenerator = callbackInvalidator(),
          candlesOfData = 200,
          data = [];

      function invalidate() {
          if (streamingFeed) {
              streamingFeed.close();
          }
          data = [];
          callbackGenerator.invalidateCallback();
      }

      function dateSortAscending(dataToSort) {
          return dataToSort.sort(function(a, b) {
              return a.date - b.date;
          });
      }

      function dataInterface(granularity, product) {
          invalidate();

          if (arguments.length === 2) {
              historicFeed = product.source.historic;
              historicFeed.product(product.id);

              streamingFeed = product.source.streaming;
              if (streamingFeed != null) {
                  streamingFeed.product(product.id);
              }
          }

          var now = new Date();

          historicFeed.end(now)
              .candles(candlesOfData)
              .granularity(granularity);

          _collectOhlc.granularity(granularity);

          historicFeed(callbackGenerator(function(error, newData) {
              if (!error) {
                  data = dateSortAscending(newData);
                  dispatch[event.historicDataLoaded](data);
              } else {
                  dispatch[event.historicFeedError](error);
              }
          }));

          if (streamingFeed != null) {
              streamingFeed.on('message', function(trade) {
                  _collectOhlc(data, trade);
                  dispatch[event.newTrade](data);
              })
              .on('error', function(error) {
                  // TODO: The 'close' event is potentially more useful for error info.
                  dispatch[event.streamingFeedError](error);
              });
              streamingFeed();
          }
      }

      d3.rebind(dataInterface, dispatch, 'on');

      return dataInterface;
  }

  function coinbaseProducts(callback) {
      d3.json('https://api.exchange.coinbase.com/products', function(error, response) {
          if (error) {
              callback(error);
              return;
          }
          callback(error, response);
      });
  }

  function formatProducts(products, source, defaultPeriods, productPeriodOverrides) {
      var formattedProducts = products.map(function(product) {
          if (productPeriodOverrides.has(product.id)) {
              return {
                  id: product.id,
                  display: product.id,
                  periods: productPeriodOverrides.get(product.id),
                  source: source
              };
          } else {
              return {
                  id: product.id,
                  display: product.id,
                  periods: defaultPeriods,
                  source: source
              };
          }
      });

      return formattedProducts.map(model.data.product);
  }

  function app() {

      var app = {};

      var appContainer = d3.select('#app-container');
      var chartsContainer = appContainer.select('#charts-container');
      var overlay = appContainer.select('#overlay');
      var containers = {
          app: appContainer,
          charts: chartsContainer,
          primary: chartsContainer.select('#primary-container'),
          secondaries: chartsContainer.selectAll('.secondary-container'),
          xAxis: chartsContainer.select('#x-axis-container'),
          navbar: chartsContainer.select('#navbar-container'),
          overlay: overlay,
          overlaySecondaries: overlay. selectAll('.overlay-secondary-container'),
          legend: appContainer.select('#legend'),
          suspendLayout: function(value) {
              var self = this;
              Object.keys(self).forEach(function(key) {
                  if (typeof self[key] !== 'function') {
                      self[key].layoutSuspended(value);
                  }
              });
          }
      };

      var week1 = model.data.period({
          display: 'Weekly',
          seconds: 60 * 60 * 24 * 7,
          d3TimeInterval: {unit: d3.time.week, value: 1},
          timeFormat: '%b %d'});
      var day1 = model.data.period({
          display: 'Daily',
          seconds: 60 * 60 * 24,
          d3TimeInterval: {unit: d3.time.day, value: 1},
          timeFormat: '%b %d'});
      var hour1 = model.data.period({
          display: '1 Hr',
          seconds: 60 * 60,
          d3TimeInterval: {unit: d3.time.hour, value: 1},
          timeFormat: '%b %d %Hh'});
      var minute5 = model.data.period({
          display: '5 Min',
          seconds: 60 * 5,
          d3TimeInterval: {unit: d3.time.minute, value: 5},
          timeFormat: '%H:%M'});
      var minute1 = model.data.period({
          display: '1 Min',
          seconds: 60,
          d3TimeInterval: {unit: d3.time.minute, value: 1},
          timeFormat: '%H:%M'});

      var generatedSource = model.data.source(dataGeneratorAdaptor());
      var bitcoinSource = model.data.source(coinbaseAdaptor(), webSocket());
      var quandlSource = model.data.source(quandlAdaptor());

      var generated = model.data.product({
          id: null,
          display: 'Data Generator',
          volumeFormat: '.3s',
          periods: [day1],
          source: generatedSource
      });

      function getParameterByName(name) {
          name = name.replace('/[\[]/', '\\[').replace('/[\]]/', '\\]');
          var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
              results = regex.exec(location.search);
          return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
      }

      var quandl = model.data.product({
          id: getParameterByName('stockcode'),
          display: getParameterByName('stockcode'),
          volumeFormat: '.3s',
          periods: [day1, week1],
          source: quandlSource
      });

      var primaryChartModel = model.chart.primary(quandl);
      var secondaryChartModel = model.chart.secondary(quandl);
      var selectorsModel = model.menu.selectors();
      var xAxisModel = model.chart.xAxis(day1);
      var navModel = model.chart.nav();
      var navResetModel = model.chart.navigationReset();
      var headMenuModel = model.menu.head([quandl, generated], quandl, day1);
      var legendModel = model.chart.legend(quandl, day1);
      var overlayModel = model.menu.overlay();

      var charts = {
          primary: undefined,
          secondaries: [],
          xAxis: chart.xAxis(),
          navbar: undefined,
          legend: chart.legend()
      };

      var headMenu;
      var navReset;
      var selectors;

      function renderInternal() {
          if (layoutRedrawnInNextRender) {
              containers.suspendLayout(false);
          }

          containers.primary.datum(primaryChartModel)
              .call(charts.primary);

          containers.legend.datum(legendModel)
              .call(charts.legend);

          containers.secondaries.datum(secondaryChartModel)
              // TODO: Add component: group of secondary charts.
              // Then also move method layout.getSecondaryContainer into the group.
              .filter(function(d, i) { return i < charts.secondaries.length; })
              .each(function(d, i) {
                  d3.select(this)
                      .attr('class', 'secondary-container ' + charts.secondaries[i].valueString)
                      .call(charts.secondaries[i].option);
              });

          containers.xAxis.datum(xAxisModel)
              .call(charts.xAxis);

          containers.navbar.datum(navModel)
              .call(charts.navbar);

          containers.app.select('#navbar-reset')
              .datum(navResetModel)
              .call(navReset);

          containers.app.select('.head-menu')
              .datum(headMenuModel)
              .call(headMenu);

          containers.app.select('#selectors')
              .datum(selectorsModel)
              .call(selectors);

          containers.overlay.datum(overlayModel)
              .call(overlay);

          if (layoutRedrawnInNextRender) {
              containers.suspendLayout(true);
              layoutRedrawnInNextRender = false;
          }
      }

      var render = fc.util.render(renderInternal);

      var layoutRedrawnInNextRender = true;

      function updateLayout() {
          layoutRedrawnInNextRender = true;
          util.layout(containers, charts);
      }

      function initialiseResize() {
          d3.select(window).on('resize', function() {
              updateLayout();
              render();
          });
      }

      function onViewChange(domain) {
          var viewDomain = [domain[0], domain[1]];
          primaryChartModel.viewDomain = viewDomain;
          secondaryChartModel.viewDomain = viewDomain;
          xAxisModel.viewDomain = viewDomain;
          navModel.viewDomain = viewDomain;

          var trackingLatest = util.domain.trackingLatestData(
              primaryChartModel.viewDomain,
              primaryChartModel.data);
          primaryChartModel.trackingLatest = trackingLatest;
          secondaryChartModel.trackingLatest = trackingLatest;
          navModel.trackingLatest = trackingLatest;
          navResetModel.trackingLatest = trackingLatest;
          render();
      }

      function onPrimaryIndicatorChange(indicator) {
          indicator.isSelected = !indicator.isSelected;
          updatePrimaryChartIndicators();
          render();
      }

      function onSecondaryChartChange(_chart) {
          _chart.isSelected = !_chart.isSelected;
          updateSecondaryCharts();
          render();
      }

      function onCrosshairChange(dataPoint) {
          legendModel.data = dataPoint;
          render();
      }

      function resetToLatest() {
          var data = primaryChartModel.data;
          var dataDomain = fc.util.extent()
              .fields('date')(data);
          var navTimeDomain = util.domain.moveToLatest(dataDomain, data, 0.2);
          onViewChange(navTimeDomain);
      }

      function loading(isLoading) {
          appContainer.select('#loading-message')
              .classed('hidden', !isLoading);
          appContainer.select('#charts')
              .classed('hidden', isLoading);
      }

      function updateModelData(data) {
          primaryChartModel.data = data;
          secondaryChartModel.data = data;
          navModel.data = data;
      }

      function updateModelSelectedProduct(product) {
          headMenuModel.selectedProduct = product;
          primaryChartModel.product = product;
          secondaryChartModel.product = product;
          legendModel.product = product;
      }

      function updateModelSelectedPeriod(period) {
          headMenuModel.selectedPeriod = period;
          xAxisModel.period = period;
          legendModel.period = period;
      }

      function initialisePrimaryChart() {
          return chart.primary()
              .on(event.crosshairChange, onCrosshairChange)
              .on(event.viewChange, onViewChange);
      }

      function initialiseNav() {
          return chart.nav()
              .on(event.viewChange, onViewChange);
      }

      function initialiseNavReset() {
          return menu.navigationReset()
              .on(event.resetToLatest, resetToLatest);
      }

      function initialiseDataInterface() {
          return dataInterface()
              .on(event.newTrade, function(data) {
                  updateModelData(data);
                  if (primaryChartModel.trackingLatest) {
                      var newDomain = util.domain.moveToLatest(
                          primaryChartModel.viewDomain,
                          primaryChartModel.data);
                      onViewChange(newDomain);
                  }
              })
              .on(event.historicDataLoaded, function(data) {
                  loading(false);
                  updateModelData(data);
                  legendModel.data = null;
                  resetToLatest();
                  updateLayout();
              })
              .on(event.historicFeedError, function(err) {
                  console.log('Error getting historic data: ' + err); // TODO: something more useful for the user!
              })
              .on(event.streamingFeedError, function(err) {
                  console.log('Error loading data from websocket: ' + err); // TODO: something more useful for the user!
              });
      }

      function initialiseHeadMenu(_dataInterface) {
          return menu.head()
              .on(event.dataProductChange, function(product) {
                  loading(true);
                  updateModelSelectedProduct(product.option);
                  updateModelSelectedPeriod(product.option.periods[0]);
                  _dataInterface(product.option.periods[0].seconds, product.option);
                  render();
              })
              .on(event.dataPeriodChange, function(period) {
                  loading(true);
                  updateModelSelectedPeriod(period.option);
                  _dataInterface(period.option.seconds);
                  render();
              })
              .on(event.clearAllPrimaryChartIndicatorsAndSecondaryCharts, function() {
                  primaryChartModel.indicators.forEach(deselectOption);
                  charts.secondaries.forEach(deselectOption);

                  updatePrimaryChartIndicators();
                  updateSecondaryCharts();
                  render();
              });
      }

      function selectOption(option, options) {
          options.forEach(function(_option) {
              _option.isSelected = false;
          });
          option.isSelected = true;
      }

      function deselectOption(option) { option.isSelected = false; }

      function fetchCoinbaseProducts() {
          coinbaseProducts(insertProductsIntoHeadMenuModel);
      }

      function insertProductsIntoHeadMenuModel(error, bitcoinProducts) {
          if (error) {
              console.log('Error getting Coinbase products: ' + error); // TODO: something more useful for the user!
          } else {
              var defaultPeriods = [hour1, day1];
              var productPeriodOverrides = d3.map();
              productPeriodOverrides.set('BTC-USD', [minute1, minute5, hour1, day1]);
              var formattedProducts = formatProducts(bitcoinProducts, bitcoinSource, defaultPeriods, productPeriodOverrides);
              headMenuModel.products = headMenuModel.products.concat(formattedProducts);
              render();
          }
      }

      function initialiseSelectors() {
          return menu.selectors()
              .on(event.primaryChartSeriesChange, function(series) {
                  primaryChartModel.series = series;
                  selectOption(series, selectorsModel.seriesSelector.options);
                  render();
              })
              .on(event.primaryChartIndicatorChange, onPrimaryIndicatorChange)
              .on(event.secondaryChartChange, onSecondaryChartChange);
      }

      function updatePrimaryChartIndicators() {
          primaryChartModel.indicators =
              selectorsModel.indicatorSelector.indicatorOptions.filter(function(option) {
                  return option.isSelected;
              });

          overlayModel.primaryIndicators = primaryChartModel.indicators;
      }

      function updateSecondaryCharts() {
          charts.secondaries =
              selectorsModel.indicatorSelector.secondaryChartOptions.filter(function(option) {
                  return option.isSelected;
              });
          // TODO: This doesn't seem to be a concern of menu.
          charts.secondaries.forEach(function(chartOption) {
              chartOption.option.on(event.viewChange, onViewChange);
          });

          overlayModel.secondaryIndicators = charts.secondaries;
          // TODO: Remove .remove! (could a secondary chart group component manage this?).
          containers.secondaries.selectAll('*').remove();
          updateLayout();
      }

      function initialiseOverlay() {
          return menu.overlay()
              .on(event.primaryChartIndicatorChange, onPrimaryIndicatorChange)
              .on(event.secondaryChartChange, onSecondaryChartChange);
      }


      app.run = function() {
          charts.primary = initialisePrimaryChart();
          charts.navbar = initialiseNav();


          var _dataInterface = initialiseDataInterface();
          headMenu = initialiseHeadMenu(_dataInterface);
          navReset = initialiseNavReset();
          selectors = initialiseSelectors();
          overlay = initialiseOverlay();

          updateLayout();
          initialiseResize();

          _dataInterface(generated.periods[0].seconds, quandl);

          d3.select('#stock-title').text(quandl.display);
          //fetchCoinbaseProducts();

          //updateModelSelectedProduct(quandl);
      };

      return app;
  }

  app().run();

}));