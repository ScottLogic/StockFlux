import d3 from 'd3';
import util from '../util/util';

export default function(width) {
  var dispatch = d3.dispatch('zoom');

  var zoomBehavior = d3.behavior.zoom();
  var scale;
  var discontinuityProvider;
  var dataDateExtent;

  var allowPan = true;
  var allowZoom = true;
  var trackingLatest = true;

  function controlZoom(zoomExtent) {
    // If zooming, and about to pan off screen, do nothing
    return zoomExtent[0] > 0 && zoomExtent[1] < 0;
  }

  function resetBehaviour() {
    zoomBehavior.translate([0, 0]);
    zoomBehavior.scale(1);
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function clampDomain(domain, totalXExtent) {
    var clampedDomain = domain;

    if (scale(dataDateExtent[0]) > 0) {
      clampedDomain[1] = scale.invert(
        scale(domain[1]) + scale(dataDateExtent[0])
      );
    }

    clampedDomain[0] = d3.max([totalXExtent[0], clampedDomain[0]]);
    clampedDomain[1] = d3.min([totalXExtent[1], clampedDomain[1]]);

    return clampedDomain;
  }

  function zoom(selection) {
    var min = scale(dataDateExtent[0]);
    var max = scale(dataDateExtent[1]);
    var zoomPixelExtent = [min, max - width];

    zoomBehavior.x(scale).on('zoom', function() {
      var t = d3.event.translate,
        tx = t[0];

      var maxDomainViewed = controlZoom(zoomPixelExtent);

      tx = clamp(tx, -zoomPixelExtent[1], -zoomPixelExtent[0]);
      zoomBehavior.translate([tx, 0]);

      var panned = zoomBehavior.scale() === 1;
      var zoomed = zoomBehavior.scale() !== 1;

      if ((panned && allowPan) || (zoomed && allowZoom)) {
        var domain = scale.domain();
        if (maxDomainViewed) {
          domain = dataDateExtent;
        } else if (zoomed && trackingLatest) {
          domain = util.domain.moveToLatest(
            discontinuityProvider,
            domain,
            dataDateExtent
          );
        }

        domain = clampDomain(domain, dataDateExtent);

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

    selection.call(zoomBehavior).on('dblclick.zoom', null);
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

  zoom.discontinuityProvider = function(x) {
    if (!arguments.length) {
      return discontinuityProvider;
    }
    discontinuityProvider = x;
    return zoom;
  };

  zoom.dataDateExtent = function(x) {
    if (!arguments.length) {
      return dataDateExtent;
    }
    dataDateExtent = x;
    return zoom;
  };

  d3.rebind(zoom, dispatch, 'on');

  return zoom;
}
