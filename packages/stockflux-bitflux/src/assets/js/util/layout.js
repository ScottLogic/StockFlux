import fc from 'd3fc';

var renderedOnce = false;

export default function(containers, charts) {
    containers.secondaries.style('flex', charts.secondaries().charts().length);
    containers.overlaySecondaries.style('flex', charts.secondaries().charts().length);

    var headRowHeight = parseInt(containers.app.select('.head-row').style('height'), 10);
    if (!renderedOnce) {
        headRowHeight +=
          parseInt(containers.app.select('.head-row').style('padding-top'), 10) +
          parseInt(containers.app.select('.head-row').style('padding-bottom'), 10) +
          parseInt(containers.app.select('.head-row').style('margin-bottom'), 10);
        renderedOnce = true;
    }

    var useableHeight = fc.util.innerDimensions(containers.app.node()).height - headRowHeight;

    containers.chartsAndOverlay.style('height', useableHeight + 'px');

    charts.xAxis().dimensionChanged(containers.xAxis);
    charts.nav().dimensionChanged(containers.navbar);
    charts.primary().dimensionChanged(containers.primary);
    charts.secondaries().charts().forEach(function(chart) {
        chart.option.dimensionChanged(containers.secondaries);
    });
}
