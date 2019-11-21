import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import { scaleLinear, scaleTime } from 'd3-scale';
import { select } from 'd3-selection';
import { minichartDimensions } from './constants';
import Components from 'stockflux-components';
import {
  extentDate,
  extentLinear,
  discontinuitySkipWeekends,
  scaleDiscontinuous,
  seriesSvgArea,
  seriesSvgLine,
  seriesSvgMulti
} from 'd3fc';
import './Minichart.css';

const Minichart = props => {
  const [shouldShowChart, setShouldShowChart] = useState(false);
  useEffect(() => {
    setShouldShowChart(
      !props.fetchError && props.chartData && props.chartData.length >= 2
    );
    // There needs to be 2 data points to draw the minichart
    // if there's not enough, show an error.
    if (shouldShowChart) {
      const data = getTrimmedData(props.chartData);
      const container = getContainer(props.symbol);

      const multi = getMulti(props.symbol, data);
      container.datum(data).call(multi);
    }
  }, [props.chartData, props.fetchError, props.symbol, shouldShowChart]);

  return shouldShowChart ? (
    <svg className="minichart" id={`${props.symbol}chart`}>
      <defs>
        <linearGradient
          id={`${props.symbol}-minichart-gradient`}
          x1="0"
          x2="0"
          y1="0"
          y2="1"
        >
          <stop offset="0%" className="minichart-gradient top" />
          <stop offset="100%" className="minichart-gradient bottom" />
        </linearGradient>
      </defs>
    </svg>
  ) : (
    <div className="minichart minichart-error">
      {props.fetchError ||
        (props.chartData.length === 0 && 'No Results Returned') || (
          <Components.Spinner />
        )}
    </div>
  );
};

const getInnerDimensions = () => {
  const {
    WIDTH,
    HEIGHT,
    PADDING_BOTTOM,
    PADDING_LEFT,
    PADDING_RIGHT,
    PADDING_TOP
  } = minichartDimensions;
  return {
    width: WIDTH - PADDING_LEFT - PADDING_RIGHT,
    height: HEIGHT - PADDING_TOP - PADDING_BOTTOM
  };
};
const getContainer = (symbol, width, height) => {
  return select(`#${symbol}chart`)
    .insert('svg', 'div')
    .attr('width', width)
    .attr('height', height);
};

const getXAxisScale = (chartData, width) => {
  return scaleDiscontinuous(scaleTime())
    .domain(extentDate().accessors([d => d.date])(chartData))
    .discontinuityProvider(discontinuitySkipWeekends())
    .range([0, width]);
};

const getYAxisScale = (chartData, height) => {
  // Create scale for y axis. We're only showing close, so
  // only use that extent.
  const closeExtent = getCloseExtent(chartData);
  return scaleLinear()
    .domain(closeExtent)
    .range([height, 0])
    .nice();
};

const getCloseExtent = chartData => {
  return extentLinear().accessors([d => d.close])(chartData);
};

const getArea = (symbol, chartData) => {
  const closeExtent = getCloseExtent(chartData);
  return seriesSvgArea()
    .crossValue(d => d.date)
    .baseValue(_ => closeExtent[0])
    .mainValue(d => d.close)
    .decorate(selection => {
      selection.attr('fill', `url(#${symbol}-minichart-gradient)`);
    });
};

const getLine = () => {
  return seriesSvgLine()
    .crossValue(d => d.date)
    .mainValue(d => d.close);
};

const getTrimmedData = chartData => {
  return chartData.slice().map(d => {
    const datum = d;
    datum.date = new Date(d.date);
    return datum;
  });
};

const getMulti = (symbol, chartData) => {
  const innerDimensions = getInnerDimensions();
  const xScale = getXAxisScale(chartData, innerDimensions.width);
  const yScale = getYAxisScale(chartData, innerDimensions.height);

  const area = getArea(symbol, chartData);
  const line = getLine();
  return seriesSvgMulti()
    .series([area, line])
    .xScale(xScale)
    .yScale(yScale)
    .mapping((_, index, series) => {
      switch (series[index]) {
        default:
          return chartData;
      }
    });
};

Minichart.propTypes = {
  chartData: PropTypes.array,
  fetchError: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired
};

export default Minichart;
