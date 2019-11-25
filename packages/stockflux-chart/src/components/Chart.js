import React, { useRef, useEffect } from 'react';
import './chart.css';
import * as d3 from 'd3';
import * as fc from 'd3fc';

const Chart = ({ chartData }) => {
  useEffect(() => {
    if (chartData != null) {
      chartData.sort((a, b) => {
        return a.date - b.date;
      });
      makeChart(chartData);
    }

    // else {
    //   makeChart(fc.randomFinancial()(100))
    // }
  }, [chartData, makeChart]);

  const showcaseContainer = useRef(null);
  const navigationContainer = useRef(null);
  const legendContainer = useRef(null);

  const legend = () => {
    const labelJoin = fc.dataJoin('text', 'legend-label');
    const valueJoin = fc.dataJoin('text', 'legend-value');

    const instance = selection => {
      selection.each((data, selectionIndex, nodes) => {
        labelJoin(d3.select(nodes[selectionIndex]), data)
          .attr('transform', (_, i) => 'translate(5, ' + (i + 1) * 30 + ')')
          .attr('x', '10%')
          .text(d => d.name);

        valueJoin(d3.select(nodes[selectionIndex]), data)
          .attr('transform', (_, i) => 'translate(5, ' + (i + 1) * 30 + ')')
          .attr('x', '15%')
          .text(d => d.value);
      });
    };

    instance.xScale = () => instance;
    instance.yScale = () => instance;
    return instance;
  };

  const priceFormat = d3.format(',.2f');
  const volumeFormat = d3.format(',.4s');

  const legendData = datum => [
    { name: 'O', value: priceFormat(datum.open) },
    { name: 'H', value: priceFormat(datum.high) },
    { name: 'L', value: priceFormat(datum.low) },
    { name: 'C', value: priceFormat(datum.close) },
    { name: 'V', value: volumeFormat(datum.volume) }
  ];

  // eslint-disable-next-line 
  function makeChart(data) {
    //Extents calculate the domain/(min/max) of data
    var yExtent = fc
      .extentLinear()
      .accessors([
        function (d) {
          return d.high;
        },
        function (d) {
          return d.low;
        }
      ])
      .pad([0.1, 0.1]);

    var xExtent = fc.extentTime().accessors([
      function (d) {
        return d.date;
      }
    ]);

    // var format = d3.timeFormat('%b %Y');

    var xScale = d3.scaleTime().domain(xExtent(data));

    // xScale.ticks(1111)

    // var x2Scale = d3.scaleTime().domain(xExtent(data));
    // var x2Axis = d3.axisTop(x2Scale);
    // var xScaleSkip = fc.scaleDiscontinuous(d3.scaleTime()).discontinuityProvider(fc.discontinuitySkipWeekends()).domain(xExtent(data))
    var yScale = d3.scaleLinear().domain(yExtent(data));

    var chartData = {
      series: data,
      brushedRange: [0.75, 1],
      crosshair: [],
      currentValueCrosshair: []
    };

    var gridlines = fc
      .annotationSvgGridline()
      .yTicks(10)
      .xTicks(10);

    var area = fc
      .seriesSvgArea()
      .crossValue(function (d) {
        return d.date;
      })
      .mainValue(function (d) {
        return d.close;
      });

    var candlestick = fc.seriesSvgCandlestick();

    var brush = fc.brushX().on('brush', function (evt) {
      // if the brush has zero height there is no selection
      if (evt.selection) {
        chartData.brushedRange = evt.selection;
        mainChart.xDomain(evt.xDomain);
        render();
      }
    });

    var navigationMulti = fc
      .seriesSvgMulti()
      .series([area, brush])
      .mapping((data, index, series) => {
        switch (series[index]) {
          case area:
            return data.series;
          case brush:
            return data.brushedRange;
          default:
            return data
        }
      });

    const chartLegend = legend();
    const crosshair = fc
      .annotationSvgCrosshair()
      .x(d => xScale(d.date))
      .xLabel('')
      .y(d => yScale(d.close))
      .yLabel('');
    const currentValueCrosshair = fc
      .annotationSvgCrosshair()
      .y(d => yScale(d.close))
      .yLabel('Close');

    chartData.currentValueCrosshair[0] =
      chartData.series[chartData.series.length - 1];
    const mainMulti = fc
      .seriesSvgMulti()
      .series([gridlines, candlestick, crosshair, currentValueCrosshair])

      .mapping((data, index, series) => {
        switch (series[index]) {
          // case chartLegend:
          //   const lastPoint = data.series[data.series.length - 1];
          //   return legendData(lastPoint)
          case crosshair:
            return data.crosshair;
          case currentValueCrosshair:
            return data.currentValueCrosshair;
          default:
            return data.series;
        }
      });

    var mainChart = fc.chartCartesian(xScale, yScale).svgPlotArea(mainMulti);

    // {
    //   d3.select("#legend-container")
    //     .datum(legendData(data[data.length - 1]))
    //     .call(chartLegend);
    // });

    var navigatorChart = fc
      .chartCartesian(xScale.copy(), yScale.copy())

      // .decorate(selection => {
      //   selection.enter().append('d3fc-svg').style('grid-column', 3)
      //     .style('grid-row', 3).on('measure.x2-axis', () => {
      //       x2Scale.range([d3.event.detail.width, 0]);
      //       console.log(d3.event.detail.width)
      //     }).on('draw.x2-axis', (d, i, nodes) => {
      //       // draw the axis into the svg within the d3fc-svg element
      //       d3.select(nodes[i])
      //         .select('svg')
      //         .call(x2Axis);
      //     });
      // })
      .svgPlotArea(navigationMulti);

    var scale = d3.scaleTime().domain(xScale.domain());
    mainChart.xDomain(chartData.brushedRange.map(scale.invert));

    const render = () => {
      d3.selectAll('#legend-container > *').remove();
      d3.select('#showcase-container')
        .datum(chartData)
        .call(mainChart);

      if (chartData.crosshair[0] !== undefined) {
        d3.select('#legend-container')
          .datum(legendData(chartData.crosshair[0]))
          .call(chartLegend);
      } else {
        d3.select('#legend-container')
          .datum(legendData(chartData.series[chartData.series.length - 1]))
          .call(chartLegend);
      }
      const pointer = fc.pointer().on('point', event => {
        chartData.crosshair = event.map(({ x }) => {
          const closestIndex = d3
            .bisector(d => d.date)
            .left(chartData.series, xScale.invert(x));
          return chartData.series[closestIndex];
        });
        render();

        // chartData.crosshair = event.map(pointer => {
        //   console.log(pointer)
        //   closest(chartData, d =>
        //     Math.abs(xScale.invert(pointer.x).getTime() - d.date.getTime())
        //   )
        // }
        // );
        // render()
      });

      d3.select('#showcase-container .plot-area').call(pointer);
    };

    // d3.select("#legend-container").datum(legendData(data[data.length - 1])).call(chartLegend);

    d3.select('#navigation-container')
      .datum(chartData)
      .call(navigatorChart);

    render();
  }

  return (
    <div className="chart-content">
      <svg ref={legendContainer} id="legend-container" />
      <div ref={showcaseContainer} id="showcase-container" />
      <div ref={navigationContainer} id="navigation-container" />
    </div>
  );
};
// .decorate(function (selection) {
//   var enter = selection.enter();
//   // console.log(enter)
//   // var handles = enter.select('.plot-line')
//   // console.log(handles)
//   var line = (d3.select('.plot-line'))
//   console.log("line", line)
//   var brush = (d3.select('.brush'))
//   console.log("brush", brush)
//   var handles = brush.selectAll('.handle')
//   console.log("handle", handles)
//   handles
//     .append('circle')
//     .attr('cy', 30)
//     .attr('r', 7)
//     .attr('class', 'outer-handle');
//   handles
//     .append('circle')
//     .attr('cy', 30)
//     .attr('r', 4)
//     .attr('class', 'inner-handle');
// })
export default Chart;
