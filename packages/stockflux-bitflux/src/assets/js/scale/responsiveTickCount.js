export default function(
  availableSpacePixels,
  tickFrequencyPixels,
  minimumTickCount
) {
  if (arguments.length < 3) {
    minimumTickCount = 1;
  }
  return Math.max(
    Math.ceil(availableSpacePixels / tickFrequencyPixels),
    minimumTickCount
  );
}
