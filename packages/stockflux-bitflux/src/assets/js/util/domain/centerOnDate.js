import fc from 'd3fc';

export default function(discontinuityProvider, domain, data, centerDate) {
  var dataExtent = fc.util.extent().fields(['date'])(data);

  var domainExtent = fc.util.extent().fields([fc.util.fn.identity])(domain);

  var domainTimeDifference = discontinuityProvider.distance(
    domainExtent[0],
    domainExtent[1]
  );

  if (
    centerDate.getTime() < dataExtent[0] ||
    centerDate.getTime() > dataExtent[1]
  ) {
    return domainExtent;
  }

  var centeredDataDomain = [
    discontinuityProvider.offset(centerDate, -domainTimeDifference / 2),
    discontinuityProvider.offset(centerDate, domainTimeDifference / 2)
  ];

  var timeShift = 0;
  if (centeredDataDomain[1].getTime() > dataExtent[1].getTime()) {
    timeShift = -discontinuityProvider.distance(
      dataExtent[1],
      centeredDataDomain[1]
    );
  } else if (centeredDataDomain[0].getTime() < dataExtent[0].getTime()) {
    timeShift = discontinuityProvider.distance(
      centeredDataDomain[0],
      dataExtent[0]
    );
  }

  return [
    discontinuityProvider.offset(centeredDataDomain[0], timeShift),
    discontinuityProvider.offset(centeredDataDomain[1], timeShift)
  ];
}
