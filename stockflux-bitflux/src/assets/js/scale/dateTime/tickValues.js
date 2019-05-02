import d3 from 'd3';

var second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24,
    week = day * 7,
    month = day * 30,
    year = day * 365;

function createInterval(interval, step, duration, format) {
    return { interval: interval, step: step, duration: duration, format: format };
}

// 2 days doesn't work well with weekends skipped
var intervals = [
    [d3.time.second, 1, second, '%H:%M,%d %b'],
    [d3.time.second, 5, 5 * second, '%H:%M,%d %b'],
    [d3.time.second, 15, 15 * second, '%H:%M,%d %b'],
    [d3.time.second, 30, 30 * second, '%H:%M,%d %b'],
    [d3.time.minute, 1, minute, '%H:%M,%d %b'],
    [d3.time.minute, 5, 5 * minute, '%H:%M,%d %b'],
    [d3.time.minute, 15, 15 * minute, '%H:%M,%d %b'],
    [d3.time.minute, 30, 30 * minute, '%H:%M,%d %b'],
    [d3.time.hour, 1, hour, '%H:%M,%d %b'],
    [d3.time.hour, 3, 3 * hour, '%H:%M,%d %b'],
    [d3.time.hour, 6, 6 * hour, '%H:%M,%d %b'],
    [d3.time.hour, 12, 12 * hour, '%H:%M,%d %b'],
    [d3.time.day, 1, day, '%a %d,%b %Y'],
    [d3.time.week, 1, week, '%d %b,%Y'],
    [d3.time.month, 1, month, '%B,%Y'],
    [d3.time.month, 3, 3 * month, '%B,%Y'],
    [d3.time.year, 1, year, '%Y']
].map(function(interval) { return createInterval.apply(this, interval); });

// Based on D3's time scale tick generation, but enforces a strict limit on tick count
// and allows a minimum tick interval to be specified
// (no tick interval more frequenct should be applied than the minimum tick interval)
// https://github.com/d3/d3/blob/9cc9a875e636a1dcf36cc1e07bdf77e1ad6e2c74/src/time/scale.js
export default function() {
    var domain,
        ticks = 10,
        minimumTickInterval,
        discontinuityProvider;

    function extentSpan(extent) {
        return discontinuityProvider.distance(extent[0], extent[1]);
    }

    function scaleExtent(scaleDomain) {
        var start = scaleDomain[0],
            stop = scaleDomain[scaleDomain.length - 1];
        return start < stop ? [start, stop] : [stop, start];
    }

    function tickIntervalForMultiYearInterval(mappedDomain, m) {
        var extent = scaleExtent(mappedDomain.map(function(d) { return d / year; })),
            span = extent[1] - extent[0],
            step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)),
            err = m / span * step;

        if (err <= 0.15) {
            step *= 10;
        } else if (err <= 0.35) {
            step *= 5;
        } else if (err <= 0.75) {
            step *= 2;
        }

        return createInterval(d3.time.year, step, step * year, '%Y');
    }

    function minimumTickIntervalIndex() {
        var i = -1;
        if (minimumTickInterval != null && minimumTickInterval.length === 2) {
            intervals.forEach(function(interval, intervalIndex) {
                if (interval.interval === minimumTickInterval[0] && interval.step === minimumTickInterval[1]) {
                    i = intervalIndex;
                }
            });
        }
        return i;
    }

    function tickInterval(extent, count) {
        var span = extentSpan(extent),
            target = span / count,
            i = d3.bisector(function(d) { return d.duration; }).right(intervals, target);

        var method;
        if (i === intervals.length) {
            method = tickIntervalForMultiYearInterval(extent, count);

            // N.B. there are some edges cases, where more ticks might be created than specified
            // but this to ensure there is at least one tick, if there is a tick count > 0
            var adjustedCount = count;
            while (span / method.duration > count && adjustedCount >= 2 && count > 0) {
                adjustedCount -= 1;
                method = tickIntervalForMultiYearInterval(extent, adjustedCount);
            }
        } else {
            var intervalIndex = i > 0 && target / intervals[i - 1].duration < intervals[i].duration / target ? i - 1 : i;
            while (span / intervals[intervalIndex].duration > count && intervalIndex < intervals.length - 1) {
                intervalIndex += 1;
            }
            method = intervals[Math.max(intervalIndex, minimumTickIntervalIndex())];
        }
        return method;
    }

    function tickValues() {
        if (minimumTickInterval != null && minimumTickIntervalIndex() === -1) {
            throw new Error('Specified minimum tick interval is not supported');
        }

        var extent = scaleExtent(domain),
            method = tickInterval(extent, ticks === null ? 10 : ticks);

        var interval = method.interval,
            step = method.step;

        var calculatedTicks = interval.range(extent[0], new Date(+extent[1] + 1), Math.max(1, step)); // inclusive upper bound
        calculatedTicks.method = [interval, step];
        calculatedTicks.format = method.format;

        return calculatedTicks;
    }

    tickValues.domain = function(x) {
        if (!arguments.length) {
            return domain;
        }
        domain = x;
        return tickValues;
    };

    tickValues.ticks = function(x) {
        if (!arguments.length) {
            return ticks;
        }
        ticks = x;
        return tickValues;
    };

    tickValues.minimumTickInterval = function(x) {
        if (!arguments.length) {
            return minimumTickInterval;
        }
        minimumTickInterval = x;
        return tickValues;
    };


    tickValues.discontinuityProvider = function(x) {
        if (!arguments.length) {
            return discontinuityProvider;
        }
        discontinuityProvider = x;
        return tickValues;
    };

    return tickValues;
}
