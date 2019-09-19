import d3 from 'd3';

export default function(
  id,
  display,
  periods,
  source,
  volumeFormat,
  priceFormat
) {
  return {
    id: id,
    display: display || 'Unspecified Product',
    priceFormat: d3.format(priceFormat || '.2f'),
    volumeFormat: d3.format(volumeFormat || '.2f'),
    periods: periods || [],
    source: source
  };
}
