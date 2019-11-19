import React, { useRef, useCallback, useEffect } from 'react';
import './chart.css';
import * as d3 from 'd3'
import * as fc from 'd3fc';

let firstRun = true;

const Chart = ({ chartData, chartType }) => {

  useEffect(() => {
    if (chartData != null) {
      makeChart(chartData)
    } else {
      makeChart(fc.randomFinancial()(100))
    }
  }, [chartData, chartType]);

  const showcaseContainer = useRef(null);
  const navigationContainer = useRef(null);


  const legend = () => {
    const labelJoin = fc.dataJoin("text", "legend-label");
    const valueJoin = fc.dataJoin("text", "legend-value");

    const instance = selection => {
      selection.each((data, selectionIndex, nodes) => {
        labelJoin(d3.select(nodes[selectionIndex]), data)
          .attr("transform", (_, i) => "translate(50, " + (i + 1) * 15 + ")")
          .text(d => d.name);

        valueJoin(d3.select(nodes[selectionIndex]), data)
          .attr("transform", (_, i) => "translate(60, " + (i + 1) * 15 + ")")
          .text(d => d.value);
      });
    };

    return instance;
  };

  const dateFormat = d3.timeFormat("%a %H:%M%p");
  const priceFormat = d3.format(",.2f");
  const legendData = datum => [
    { name: "Open", value: priceFormat(datum.open) },
    { name: "High", value: priceFormat(datum.high) },
    { name: "Low", value: priceFormat(datum.low) },
    { name: "Close", value: priceFormat(datum.close) },
    { name: "Volume", value: priceFormat(datum.volume) }
  ];



  function makeChart(data) {

    //Extents calculate the domain/(min/max) of data
    var yExtent = fc.extentLinear().accessors([function (d) { return d.high; },
    function (d) { return d.low }]).pad([0.1, 0.1])

    var xExtent = fc.extentDate()
      .accessors([function (d) { return d.date; }]);

    var xScale = d3.scaleTime()
      .domain(xExtent(data));

    var xScaleSkip = fc.scaleDiscontinuous(d3.scaleTime()).discontinuityProvider(fc.discontinuitySkipWeekends()).domain(xExtent(data))
    var yScale = d3.scaleLinear()
      .domain(yExtent(data));

    // var line = d3.svg.line()
    //   .xScale(function (d) { return xScale(d.date); })
    //   .y0(height)
    //   .y1(function (d) { return yScale(d.close); });


    var chartData = {
      series: data,
      brushedRange: [0.75, 1]
    };


    var gridlines = fc.annotationSvgGridline().yTicks(10).xTicks(10)

    var line = fc.seriesSvgLine()
      .crossValue(function (d) { return d.date; })
      .mainValue(function (d) { return d.close; })

    var area = fc.seriesSvgArea()
      .crossValue(function (d) { return d.date; })
      .mainValue(function (d) { return d.close; })

    var candlestick = fc.seriesSvgCandlestick()

    var brush = fc.brushX()
      .on('brush', function (evt) {
        // if the brush has zero height there is no selection
        if (evt.selection) {
          chartData.brushedRange = evt.selection;
          mainChart.xDomain(evt.xDomain);
          render();
        }
      });

    const chartLegend = legend();

    var multi = fc.seriesSvgMulti()
      .series([area, brush, chartLegend])
      .mapping((data, index, series) => {
        switch (series[index]) {
          case chartLegend:
            const lastPoint = data[data.length - 1];
            console.log(lastPoint)
            return legendData(lastPoint)
          case area:
            return data.series;
          case brush:
            return data.brushedRange;
        }
      });

    const main = fc.seriesSvgMulti()
      .series([gridlines, candlestick]);


    var mainChart = fc.chartCartesian(xScale, yScale)
      .svgPlotArea(main)
    // .decorate(function (selection) {
    //   var plot = selection.enter().select('.plot-line')
    //   plot.attr('class', 'plot-line main-chart')
    // })


    var navigatorChart = fc.chartCartesian(xScale.copy(), yScale.copy())
      .svgPlotArea(multi);

    var scale = d3.scaleTime().domain(xScale.domain());
    mainChart.xDomain(chartData.brushedRange.map(scale.invert));



    const render = () => {
      d3.selectAll("#showcase-container > *").remove();
      d3.select('#showcase-container')
        .datum(chartData.series)
        .call(mainChart);

      d3.select('#navigation-container')
        .datum(chartData)
        .call(navigatorChart)
    };

    render()

  }

  return <div className="chart-content">
    <div ref={showcaseContainer} id="showcase-container" />
    <div ref={navigationContainer} id="navigation-container" />
  </div>
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
