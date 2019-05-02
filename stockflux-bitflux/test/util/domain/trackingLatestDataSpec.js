import d3 from 'd3';
import trackingLatestData from '../../../src/assets/js/util/domain/trackingLatestData';
import makeDatum from '../../helpers/makeDatum';

describe('util/domain/trackingLatestData', function() {

    var data;
    var shuffledData;

    var monday = new Date(2015, 7, 17);
    var tuesday = new Date(2015, 7, 18);
    var wednesday = new Date(2015, 7, 19);
    var thursday = new Date(2015, 7, 20);
    var friday = new Date(2015, 7, 21);

    beforeEach(function() {
        data = [
            makeDatum(monday), makeDatum(tuesday), makeDatum(wednesday), makeDatum(thursday), makeDatum(friday)
        ];
        shuffledData = [
            makeDatum(thursday), makeDatum(wednesday), makeDatum(monday), makeDatum(friday), makeDatum(tuesday)
        ];
    });

    it('should return true if latest domain time is equal to latest data time', function() {
        var domain = [tuesday, friday];
        var reversedDomain = [domain[1], domain[0]];

        expect(trackingLatestData(domain, data)).toBe(true);
        expect(trackingLatestData(reversedDomain, shuffledData)).toBe(true);
    });

    it('should return false if latest domain time is less than latest data time', function() {
        var domain = [tuesday, thursday];
        var reversedDomain = [domain[1], domain[0]];

        expect(trackingLatestData(domain, data)).toBe(false);
        expect(trackingLatestData(reversedDomain, shuffledData)).toBe(false);
    });

    it('should return false if latest domain time is more than latest data time', function() {
        var domain = [tuesday, d3.time.day.offset(friday, 1)];
        var reversedDomain = [domain[1], domain[0]];

        expect(trackingLatestData(domain, data)).toBe(false);
        expect(trackingLatestData(reversedDomain, shuffledData)).toBe(false);
    });

    it('should return false if domain time does not coincide with data times', function() {
        var domain = [d3.time.day.offset(friday, 1), d3.time.day.offset(friday, 2)];
        var reversedDomain = [domain[1], domain[0]];

        expect(trackingLatestData(domain, data)).toBe(false);
        expect(trackingLatestData(reversedDomain, shuffledData)).toBe(false);
    });

});
