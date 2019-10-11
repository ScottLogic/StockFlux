import React, { useRef, useCallback, useEffect } from 'react';
import './chart.css';
import * as d3 from 'd3'
import * as fc from 'd3fc';

let firstRun = true;

const Chart = ({ symbol, date }) => {

  const getOHLCData = useCallback(async () => {
    var url = `https://d3capoqa8f983r.cloudfront.net/api/ohlc/${symbol}/${date}`

    const response = await fetch(url, {
      method: 'GET'
    });

    if (!response.ok)
      throw new Error("response not successful");


    const stockData = await response.json();
    if (!stockData.success)
      throw new Error("Not successful")


    const updated = stockData.data.map(item => {
      return {
        open: item.open,
        close: item.close,
        high: item.high,
        low: item.low,
        volume: item.volume,
        date: new Date(item.date)
      };
    })

    return updated

  }, [symbol, date]);

  useEffect(() => {
    getOHLCData().then(data => makeChart(data)
    )
  }, [getOHLCData]);

  const showcaseContainer = useRef(null);
  const navigationContainer = useRef(null);

  function makeChart(data) {

    // data = (fc.randomFinancial()(50));
    var yExtent = fc.extentLinear().pad([0.1, 0.1]).accessors([function (d) { return d.high; },
    function (d) { return d.low }])

    var xExtent = fc.extentDate()
      .accessors([function (d) { return d.date; }]);

    var gridlines = fc.annotationSvgGridline().yTicks(10).xTicks(0)
    const lineSeries = fc.seriesSvgLine().mainValue(d => d.high).crossValue(d => d.date)

    var candlestick = fc.seriesSvgCandlestick();

    // const legend = () => {
    //   const labelJoin = fc.dataJoin("text", "legend-label");
    //   const valueJoin = fc.dataJoin("text", "legend-value");

    //   const instance = selection => {
    //     selection.each((data, selectionIndex, nodes) => {
    //       labelJoin(d3.select(nodes[selectionIndex]), data)
    //         .attr("transform", (_, i) => "translate(" + ((100 * i) + 10) + "," + 15 + ")")
    //         .text(d => d.name);

    //       valueJoin(d3.select(nodes[selectionIndex]), data)
    //         .attr("transform", (_, i) => "translate(" + ((100 * i) + 30) + "," + 15 + ")")
    //         .text(d => d.value);
    //     });
    //   };

    //   return instance;
    // };

    const dateFormat = d3.timeFormat("%a %H:%M%p");
    const priceFormat = d3.format(",.2f");
    // const legendData = datum => [
    //   { name: "O", value: priceFormat(datum.open) },
    //   { name: "H", value: priceFormat(datum.high) },
    //   { name: "L", value: priceFormat(datum.low) },
    //   { name: "C", value: priceFormat(datum.close) },
    //   { name: "V", value: priceFormat(datum.volume) }
    // ];

    // const chartLegend = legend();

    var multi = fc.seriesSvgMulti()
      .series([gridlines, lineSeries])

    var chart = fc.chartCartesian(
      fc.scaleDiscontinuous(d3.scaleTime()),
      d3.scaleLinear()
    )
      .yDomain(yExtent(data))
      .xDomain(xExtent(data))
      .svgPlotArea(multi)


    var svg = d3.select("#showcase-container").append("svg")
      .attr("width", '100%')
      .attr("height", '20%')
      .style("border", "1px solid lightgray");


    console.log("ahha", svg.attr('width'))

    // var navXScale = xExtent(data)
    // console.log(navXScale)
    // var navYScale = yExtent(data)
    // console.log(navYScale)

    var navXScale = d3.scaleTime()
      .domain(xExtent(data))
      .range([50, 800])

    var navYScale = d3.scaleLinear()
      .domain(yExtent(data))
      .range([60, 0]);

    var navXAxis = d3.axisBottom(navXScale)

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + 60 + ')')
      .call(navXAxis);

    var navData = d3.area()
      .x(function (d) { return navXScale(d.date); })
      .y0(100)
      .y1(function (d) { return navYScale(d.close); });

    var navLine = d3.line()
      .x(function (d) { return navXScale(d.date); })
      .y(function (d) { return navYScale(d.close); });


    // svg.append('path').attr('class', 'data').attr('d', navData(data))
    svg.append('path')
      .attr('class', 'line')
      .attr('d', navLine(data));

    // var navChart = d3.select('#showcase-container').classed('chart', true).append('svg').classed('navigator', true).append('g')
    // navChart.append("rect")
    //   .attr("x", 0)
    //   .attr("y", 0)
    //   .attr("width", '100%')
    //   .attr("height", 100)
    //   .style("fill", "#F5F5F5")
    //   .style("shape-rendering", "crispEdges")

    // var navData = d3.area()
    //   .x(function (d) { return xExtent(d); })
    //   .y1(function (d) { return yExtent(d); });

    // var navLine = d3.line()
    //   .x(function (d) { return xExtent(d); })
    //   .y(function (d) { return yExtent(d); });

    // console.log(navData)
    // console.log("here", navData(data))

    // console.log("hre", xExtent(data))
    // console.log("hre", yExtent(data))
    // navChart.append('path')
    //   .attr('class', 'data')
    //   .attr('d', navData(data));

    // navChart.append('path')
    //   .attr('class', 'line')
    //   .attr('d', navLine(data));
    // navChart.append('g').attr('class', 'x-axis').call(navXAxis)





    const render = () => {
      d3.select('#showcase-container')
        .datum(data)
        .call(chart);
    };

    render()
    // useEffect(() => {
    //   if (firstRun) {
    //     // calling run will use random generated data when no symbol is set
    //     chart.run(showcaseContainer.current);
    //     firstRun = false;
    //   }
    //   if (symbol && getData) {
    //     getData(symbol);
    //   }
    // }, [symbol, getData, chart]);

  }


  return <div id="chart-container"><div ref={showcaseContainer} id="showcase-container" />
    <div ref={navigationContainer} id="navigation-container" /></div>;
};

export default Chart;
