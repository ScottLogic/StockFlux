import d3 from 'd3';
import fc from 'd3fc';
import centerOnDate from '../../../src/assets/js/util/domain/centerOnDate';
import makeDatum from '../../helpers/makeDatum';
import skipWeekends from '../../../src/assets/js/scale/discontinuity/skipWeekends';

describe('util/domain/centerOnDate', function() {

    var domain;
    var reversedDomain;
    var data;
    var shuffledData;

    var monday = new Date(2015, 7, 17);
    var tuesday = new Date(2015, 7, 18);
    var wednesday = new Date(2015, 7, 19);
    var thursday = new Date(2015, 7, 20);
    var friday = new Date(2015, 7, 21);
    var saturday = new Date(2015, 7, 22);
    var sunday = new Date(2015, 7, 23);
    var monday2 = new Date(2015, 7, 24);

    beforeEach(function() {
        domain = [tuesday, thursday];
        reversedDomain = [thursday, tuesday];
        data = [
            makeDatum(monday), makeDatum(tuesday), makeDatum(wednesday), makeDatum(thursday),
            makeDatum(friday), makeDatum(saturday), makeDatum(sunday), makeDatum(monday2)
        ];
        shuffledData = [
            makeDatum(thursday), makeDatum(wednesday), makeDatum(monday), makeDatum(friday),
            makeDatum(tuesday), makeDatum(monday2), makeDatum(sunday), makeDatum(saturday)
        ];
    });

    it('should center on a different date contained strictly within the valid range for the domain with identity discontinuity', function() {
        var centerDate = thursday;

        var centerOnDateDomain = centerOnDate(fc.scale.discontinuity.identity(), domain, data, centerDate);

        expect(centerOnDateDomain.length).toEqual(domain.length);
        expect(centerOnDateDomain[0]).toEqual(wednesday);
        expect(centerOnDateDomain[1]).toEqual(friday);

        var shuffledCenterOnDateDomain = centerOnDate(fc.scale.discontinuity.identity(), reversedDomain, shuffledData, centerDate);

        expect(shuffledCenterOnDateDomain.length).toEqual(reversedDomain.length);
        expect(shuffledCenterOnDateDomain[0]).toEqual(wednesday);
        expect(shuffledCenterOnDateDomain[1]).toEqual(friday);
    });

    it('should be able to center on itself with identity discontinuity', function() {
        var centerDate = wednesday;

        var centerOnDateDomain = centerOnDate(fc.scale.discontinuity.identity(), domain, data, centerDate);

        expect(centerOnDateDomain.length).toEqual(domain.length);
        expect(centerOnDateDomain[0]).toEqual(tuesday);
        expect(centerOnDateDomain[1]).toEqual(thursday);

        var shuffledCenterOnDateDomain = centerOnDate(fc.scale.discontinuity.identity(), reversedDomain, shuffledData, centerDate);

        expect(shuffledCenterOnDateDomain.length).toEqual(reversedDomain.length);
        expect(shuffledCenterOnDateDomain[0]).toEqual(tuesday);
        expect(shuffledCenterOnDateDomain[1]).toEqual(thursday);
    });

    it('should be able to center on the earliest date of the domain with identity discontinuity', function() {
        var earliestDate = monday;

        var centerOnDateDomain = centerOnDate(fc.scale.discontinuity.identity(), domain, data, earliestDate);

        expect(centerOnDateDomain.length).toEqual(domain.length);
        expect(centerOnDateDomain[0]).toEqual(monday);
        expect(centerOnDateDomain[1]).toEqual(wednesday);

        var shuffledCenterOnDateDomain = centerOnDate(fc.scale.discontinuity.identity(), reversedDomain, shuffledData, earliestDate);

        expect(shuffledCenterOnDateDomain.length).toEqual(reversedDomain.length);
        expect(shuffledCenterOnDateDomain[0]).toEqual(monday);
        expect(shuffledCenterOnDateDomain[1]).toEqual(wednesday);

    });

    it('should be able to center on the latest date of the domain with identity discontinuity', function() {
        var latestDate = monday2;

        var centerOnDateDomain = centerOnDate(fc.scale.discontinuity.identity(), domain, data, latestDate);

        expect(centerOnDateDomain.length).toEqual(domain.length);
        expect(centerOnDateDomain[0]).toEqual(saturday);
        expect(centerOnDateDomain[1]).toEqual(monday2);

        var shuffledCenterOnDateDomain = centerOnDate(fc.scale.discontinuity.identity(), reversedDomain, shuffledData, latestDate);

        expect(shuffledCenterOnDateDomain.length).toEqual(reversedDomain.length);
        expect(shuffledCenterOnDateDomain[0]).toEqual(saturday);
        expect(shuffledCenterOnDateDomain[1]).toEqual(monday2);
    });

    it('should not center on a different date that is not contained within the data domain range with identity discontinuity', function() {
        var centerDate = d3.time.day.offset(monday2, 1);

        var centerOnDateDomain = centerOnDate(fc.scale.discontinuity.identity(), domain, data, centerDate);

        expect(centerOnDateDomain.length).toEqual(domain.length);
        expect(centerOnDateDomain[0]).toEqual(tuesday);
        expect(centerOnDateDomain[1]).toEqual(thursday);

        var shuffledCenterOnDateDomain = centerOnDate(fc.scale.discontinuity.identity(), reversedDomain, shuffledData, centerDate);

        expect(shuffledCenterOnDateDomain.length).toEqual(reversedDomain.length);
        expect(shuffledCenterOnDateDomain[0]).toEqual(tuesday);
        expect(shuffledCenterOnDateDomain[1]).toEqual(thursday);
    });

    it('should be able to center on the weekend dates of the domain with identity discontinuity', function() {
        var centerDate = saturday;

        var centerOnDateDomain = centerOnDate(fc.scale.discontinuity.identity(), domain, data, centerDate);

        expect(centerOnDateDomain.length).toEqual(domain.length);
        expect(centerOnDateDomain[0]).toEqual(friday);
        expect(centerOnDateDomain[1]).toEqual(sunday);

        var shuffledCenterOnDateDomain = centerOnDate(fc.scale.discontinuity.identity(), reversedDomain, shuffledData, centerDate);

        expect(shuffledCenterOnDateDomain.length).toEqual(reversedDomain.length);
        expect(shuffledCenterOnDateDomain[0]).toEqual(friday);
        expect(shuffledCenterOnDateDomain[1]).toEqual(sunday);
    });

    it('should center on a different date contained strictly within the valid range for the domain with skip weekends discontinuity', function() {
        var centerDate = thursday;

        var centerOnDateDomain = centerOnDate(skipWeekends(), domain, data, centerDate);

        expect(centerOnDateDomain.length).toEqual(domain.length);
        expect(centerOnDateDomain[0]).toEqual(wednesday);
        expect(centerOnDateDomain[1]).toEqual(friday);

        var shuffledCenterOnDateDomain = centerOnDate(skipWeekends(), reversedDomain, shuffledData, centerDate);

        expect(shuffledCenterOnDateDomain.length).toEqual(reversedDomain.length);
        expect(shuffledCenterOnDateDomain[0]).toEqual(wednesday);
        expect(shuffledCenterOnDateDomain[1]).toEqual(friday);
    });

    it('should be able to center on itself with skip weekends discontinuity', function() {
        var centerDate = wednesday;

        var centerOnDateDomain = centerOnDate(skipWeekends(), domain, data, centerDate);

        expect(centerOnDateDomain.length).toEqual(domain.length);
        expect(centerOnDateDomain[0]).toEqual(tuesday);
        expect(centerOnDateDomain[1]).toEqual(thursday);

        var shuffledCenterOnDateDomain = centerOnDate(skipWeekends(), reversedDomain, shuffledData, centerDate);

        expect(shuffledCenterOnDateDomain.length).toEqual(reversedDomain.length);
        expect(shuffledCenterOnDateDomain[0]).toEqual(tuesday);
        expect(shuffledCenterOnDateDomain[1]).toEqual(thursday);
    });

    it('should be able to center on the earliest date of the domain with skip weekends discontinuity', function() {
        var earliestDate = monday;

        var centerOnDateDomain = centerOnDate(skipWeekends(), domain, data, earliestDate);

        expect(centerOnDateDomain.length).toEqual(domain.length);
        expect(centerOnDateDomain[0]).toEqual(monday);
        expect(centerOnDateDomain[1]).toEqual(wednesday);

        var shuffledCenterOnDateDomain = centerOnDate(skipWeekends(), reversedDomain, shuffledData, earliestDate);

        expect(shuffledCenterOnDateDomain.length).toEqual(reversedDomain.length);
        expect(shuffledCenterOnDateDomain[0]).toEqual(monday);
        expect(shuffledCenterOnDateDomain[1]).toEqual(wednesday);

    });

    it('should be able to center on the latest date of the domain with skip weekends discontinuity', function() {
        var latestDate = monday2;

        var centerOnDateDomain = centerOnDate(skipWeekends(), domain, data, latestDate);

        expect(centerOnDateDomain.length).toEqual(domain.length);
        expect(centerOnDateDomain[0]).toEqual(thursday);
        expect(centerOnDateDomain[1]).toEqual(monday2);

        var shuffledCenterOnDateDomain = centerOnDate(skipWeekends(), reversedDomain, shuffledData, latestDate);

        expect(shuffledCenterOnDateDomain.length).toEqual(reversedDomain.length);
        expect(shuffledCenterOnDateDomain[0]).toEqual(thursday);
        expect(shuffledCenterOnDateDomain[1]).toEqual(monday2);
    });

    it('should not center on a different date that is not contained within the data domain range with skip weekends discontinuity', function() {
        var centerDate = d3.time.day.offset(monday2, 1);

        var centerOnDateDomain = centerOnDate(skipWeekends(), domain, data, centerDate);

        expect(centerOnDateDomain.length).toEqual(domain.length);
        expect(centerOnDateDomain[0]).toEqual(tuesday);
        expect(centerOnDateDomain[1]).toEqual(thursday);

        var shuffledCenterOnDateDomain = centerOnDate(skipWeekends(), reversedDomain, shuffledData, centerDate);

        expect(shuffledCenterOnDateDomain.length).toEqual(reversedDomain.length);
        expect(shuffledCenterOnDateDomain[0]).toEqual(tuesday);
        expect(shuffledCenterOnDateDomain[1]).toEqual(thursday);
    });

    it('should be able to center on the weekend dates of the domain with skip weekend discontinuity', function() {
        var centerDate = saturday;

        var centerOnDateDomain = centerOnDate(skipWeekends(), domain, data, centerDate);

        expect(centerOnDateDomain.length).toEqual(domain.length);
        expect(centerOnDateDomain[0]).toEqual(thursday);
        expect(centerOnDateDomain[1]).toEqual(monday2);

        var shuffledCenterOnDateDomain = centerOnDate(skipWeekends(), reversedDomain, shuffledData, centerDate);

        expect(shuffledCenterOnDateDomain.length).toEqual(reversedDomain.length);
        expect(shuffledCenterOnDateDomain[0]).toEqual(thursday);
        expect(shuffledCenterOnDateDomain[1]).toEqual(monday2);
    });
});
