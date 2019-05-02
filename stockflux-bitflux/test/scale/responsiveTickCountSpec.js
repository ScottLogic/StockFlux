import responsiveTickCount from '../../src/assets/js/scale/responsiveTickCount';

describe('scale/responsiveTickCount', function() {
    it('should return the correct result', function() {
        expect(responsiveTickCount(100, 100)).toEqual(1);
        expect(responsiveTickCount(300, 100)).toEqual(3);
        expect(responsiveTickCount(1000, 1)).toEqual(1000);
    });

    it('should round up to the nearest integer (when a minimum tick count is not specified)', function() {
        expect(responsiveTickCount(250, 100)).toEqual(3);
        expect(responsiveTickCount(250.1, 100)).toEqual(3);
        expect(responsiveTickCount(3, 2)).toEqual(2);
        expect(responsiveTickCount(3.5, 2)).toEqual(2);
    });

    describe('minimum tick count', function() {
        it('returns a minimum of 1 tick by default', function() {
            expect(responsiveTickCount(100, 300)).toEqual(1);
            expect(responsiveTickCount(1, 1000)).toEqual(1);
        });

        it('should allow a minimum tick count to be specified', function() {
            expect(responsiveTickCount(100, 100, 2)).toEqual(2);
            expect(responsiveTickCount(300, 100, 100)).toEqual(100);
            expect(responsiveTickCount(1000, 1, 1001)).toEqual(1001);
        });
    });
});
