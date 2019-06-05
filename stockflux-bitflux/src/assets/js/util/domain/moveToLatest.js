import fc from 'd3fc';

export default function(discontinuityProvider, viewDomainDateExtent, dataDateExtent, ratio) {
    if (arguments.length < 4) {
        ratio = 1;
    }

    // Ensure the earlier data is first in the array
    var sortedViewDomainExtent = fc.util.extent().fields([fc.util.fn.identity])(viewDomainDateExtent);
    var sortedDataExtent = fc.util.extent().fields([fc.util.fn.identity])(dataDateExtent);

    var dataTimeExtent = discontinuityProvider.distance(sortedDataExtent[0], sortedDataExtent[1]);
    var scaledDomainTimeDifference = ratio * discontinuityProvider.distance(sortedViewDomainExtent[0],
        sortedViewDomainExtent[1]);
    var scaledLiveDataDomain = scaledDomainTimeDifference < dataTimeExtent ?
      [discontinuityProvider.offset(sortedDataExtent[1], -scaledDomainTimeDifference), sortedDataExtent[1]] :
        sortedDataExtent;
    return scaledLiveDataDomain;
}
