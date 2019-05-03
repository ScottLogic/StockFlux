import d3 from 'd3';

export default function(domain, data) {
    var startDate = d3.min(domain, function(d) { return d.getTime(); });
    var endDate = d3.max(domain, function(d) { return d.getTime(); });

    var dataSortedByDate = data.sort(function(a, b) {
        return a.date - b.date;
    });

    var bisector = d3.bisector(function(d) { return d.date; });
    var filteredData = data.slice(
      // Pad and clamp the bisector values to ensure extents can be calculated
      Math.max(0, bisector.left(dataSortedByDate, startDate) - 1),
      Math.min(bisector.right(dataSortedByDate, endDate) + 1, dataSortedByDate.length)
    );
    return filteredData;
}
