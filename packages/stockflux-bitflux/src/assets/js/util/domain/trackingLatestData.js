import d3 from 'd3';

export default function(domain, data) {
  var latestViewedTime = d3.max(domain, function(d) {
    return d.getTime();
  });
  var latestDatumTime = d3.max(data, function(d) {
    return d.date.getTime();
  });
  return latestViewedTime === latestDatumTime;
}
