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


  return <div ref={showcaseContainer} id="showcase-container" />;
};

export default Chart;
