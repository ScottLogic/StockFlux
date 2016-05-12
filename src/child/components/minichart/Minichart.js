import React, { Component, PropTypes } from 'react';

class Minichart extends Component {

    shouldComponentUpdate(nextProps) {
        return this.props.chartData !== nextProps.chartData;
    }

    componentDidUpdate() {
        const { stockCode, chartData } = this.props;
        let data = chartData.stockData.data;
        const extent = fc.util.innerDimensions(document.getElementById(`${stockCode}chart`));
        const width = extent.width;
        const height = extent.height;

        // There needs to be 2 data points to draw the minichart
        // if there's not enough, show an error.
        if (data.length < 2) {
            this.showMinichart = false;
            return;
        }

        data = data.map(d => {
            const datum = d;
            const date = moment(d.date);
            datum.date = date.toDate();
            return datum;
        });
        const container = d3.select(`#${stockCode}chart`)
                        .insert('svg', 'div')
                        .attr('width', width)
                        .attr('height', height);
                    // Create scale for x axis
        const xScale = fc.scale.dateTime()
                        .domain(fc.util.extent().fields(['date'])(data))
                        .discontinuityProvider(fc.scale.discontinuity.skipWeekends())
                        .range([0, width]);

                    // Create scale for y axis. We're only showing close, so
                    // only use that extent.
        const closeExtent = fc.util.extent().fields(['close'])(data);

        const yScale = d3.scale.linear()
                        .domain(closeExtent)
                        .range([height, 0])
                        .nice();
        const area = fc.series.area()
                        .y0Value(() => closeExtent[0])
                        .y1Value((d) => d.close)
                        .decorate((selection) => {
                            selection.attr('fill', `url(#${stockCode}-minichart-gradient)`);
                        });
        const line = fc.series.line();

        const pointData = [].concat(data.slice(0)[0]);
        const point = fc.series.point();

        const multi = fc.series.multi()
                        .series([area, line, point])
                        .xScale(xScale)
                        .yScale(yScale)
                        .mapping((series) => {
                            switch (series) {
                            case point:
                                return pointData;
                            default:
                                return data;
                            }
                        });
        container.append('g')
                    .datum(data)
                    .call(multi);
    }

    render() {
        const { stockCode, chartData } = this.props;
        return (
            <div className="minichartWrapper">
                <svg className="minichart" id={`${stockCode}chart`}>
                    <defs>
                        <linearGradient id={`${stockCode}-minichart-gradient`} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" className="minichart-gradient top" />
                            <stop offset="100%" className="minichart-gradient bottom" />
                        </linearGradient>
                    </defs>
                </svg>
                {!chartData && <div className="minichart minichart-error">
                    Not enough data to show minichart
                </div>
            }
            </div>
        );
    }
 }


// onClick: PropTypes.func.isRequired,
Minichart.propTypes = {
    chartData: PropTypes.object,
    stockCode: PropTypes.string.isRequired
};

export default Minichart;
