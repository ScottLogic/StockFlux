import React, { Component, PropTypes } from 'react';
import { scaleLinear, scaleTime } from 'd3-scale';
import { select } from 'd3-selection';
import { scaleDiscontinuous, discontinuitySkipWeekends } from 'd3fc-discontinuous-scale';
import { extentDate, extentLinear } from 'd3fc-extent';
import { seriesSvgArea, seriesSvgLine, seriesSvgPoint, seriesSvgMulti } from 'd3fc-series';

class Minichart extends Component {

    shouldComponentUpdate(nextProps) {
        return this.props.chartData !== nextProps.chartData;
    }

    componentDidUpdate() {
        const { stockCode, chartData } = this.props;
        let data = chartData.stockData.data;

        // There needs to be 2 data points to draw the minichart
        // if there's not enough, show an error.
        if (data.length < 2) {
            this.showMinichart = false;
            return;
        }

        data = data.map((d) => {
            const datum = d;
            const date = moment(d.date);
            datum.date = date.toDate();
            return datum;
        });

        const extent = innerDimensions(document.getElementById(`${stockCode}chart`));
        const width = extent.width;
        const height = extent.height;

        const container = select(`#${stockCode}chart`)
            .insert('svg', 'div')
            .attr('width', width)
            .attr('height', height);

        // Create scale for x axis
        const xScale = scaleDiscontinuous(scaleTime())
            .domain(extentDate().accessors([d => d.date])(data))
            .discontinuityProvider(discontinuitySkipWeekends())
            .range([0, width]);

        // Create scale for y axis. We're only showing close, so
        // only use that extent.
        const closeExtent = extentLinear().accessors([d => d.close])(data);
        const yScale = scaleLinear()
            .domain(closeExtent)
            .range([height, 0])
            .nice();

        const area = seriesSvgArea()
            .crossValue(d => d.date)
            .baseValue(_ => closeExtent[0])
            .mainValue(d => d.close)
            .decorate((selection) => {
                selection.attr('fill', `url(#${stockCode}-minichart-gradient)`);
            });

        const line = seriesSvgLine()
            .crossValue(d => d.date)
            .mainValue(d => d.close);

        const point = seriesSvgPoint()
            .crossValue(d => d.date)
            .mainValue(d => d.close);

        const multi = seriesSvgMulti()
            .series([area, line, point])
            .xScale(xScale)
            .yScale(yScale)
            .mapping((data, index, series) => {
                switch (series[index]) {
                    case point:
                        return [data.slice(0)[0]];
                    default:
                        return data;
                }
            });
        container
            .datum(data)
            .call(multi);
    }

    render() {
        const { stockCode, chartData } = this.props;
        const shouldShowChart = this.showMinichart !== false && chartData && chartData.stockData && chartData.stockData.data.length > 2;
        return (
            <div className="minichartWrapper">
                {shouldShowChart ? <svg className="minichart" id={`${stockCode}chart`}>
                    <defs>
                        <linearGradient id={`${stockCode}-minichart-gradient`} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" className="minichart-gradient top" />
                            <stop offset="100%" className="minichart-gradient bottom" />
                        </linearGradient>
                    </defs>
                </svg> : <div className="minichart minichart-error">
                    Not enough data to show minichart
                </div>}
            </div>
        );
    }
 }


Minichart.propTypes = {
    chartData: PropTypes.shape({
        dataset: PropTypes.object,
        stockData: PropTypes.shape({
            data: PropTypes.array,
            endDate: PropTypes.string,
            startDate: PropTypes.string
        })
    }),
    stockCode: PropTypes.string.isRequired
};

export default Minichart;

function innerDimensions(element) {
    const style = element.ownerDocument.defaultView.getComputedStyle(element);
    return {
        width: parseFloat(style.width) - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
        height: parseFloat(style.height) - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
    };
}