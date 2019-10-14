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

    var yExtent = fc.extentLinear().accessors([function (d) { return d.high; },
    function (d) { return d.low }]).pad([0.1, 0.1])

    var xExtent = fc.extentDate()
      .accessors([function (d) { return d.date; }]);

    var x = d3.scaleTime()
      .domain(xExtent(data));
    var y = d3.scaleLinear()
      .domain(yExtent(data));


    var chartData = {
      series: data,
      brushedRange: [0.75, 1]
    };

    var area = fc.seriesSvgLine()
      .crossValue(function (d) { return d.date; })
      .mainValue(function (d) { return d.close; })


    var brush = fc.brushX()
      .on('brush', function (evt) {
        // if the brush has zero height there is no selection
        if (evt.selection) {
          chartData.brushedRange = evt.selection;
          mainChart.xDomain(evt.xDomain);
          render();
        }
      });

    var multi = fc.seriesSvgMulti()
      .series([area, brush])
      .mapping((data, index, series) => {
        switch (series[index]) {
          case area:
            return data.series;
          case brush:
            return data.brushedRange;
        }
      });

    var mainChart = fc.chartCartesian(x, y)
      .svgPlotArea(area);

    var navigatorChart = fc.chartCartesian(x.copy(), y.copy())
      .svgPlotArea(multi);


    var scale = d3.scaleTime().domain(x.domain());
    mainChart.xDomain(chartData.brushedRange.map(scale.invert));

    const render = () => {
      d3.select('#showcase-container')
        .datum(chartData.series)
        .call(mainChart);

      d3.select('#navigation-container')
        .datum(chartData)
        .call(navigatorChart);
    };

    render()
  }

  return <div><div ref={showcaseContainer} id="showcase-container" />
    <div ref={navigationContainer} id="navigation-container" />
  </div>
};

export default Chart;
