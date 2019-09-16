import d3 from 'd3';

export default function(display, seconds, d3TimeInterval, timeFormat) {
  return {
    display: display || '1 day',
    seconds: seconds || 60 * 60 * 24,
    d3TimeInterval: d3TimeInterval || { unit: d3.time.day, value: 1 },
    timeFormat: d3.time.format(timeFormat || '%b %d')
  };
}
