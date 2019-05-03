import skipWeekendsProvider from '../../../src/assets/js/scale/discontinuity/skipWeekends';

// TODO: Temp until merged into d3fc
describe('skipWeekends', function() {

    var millisPerDay = 24 * 3600 * 1000;
    var skipWeekends = skipWeekendsProvider();

    describe('clampUp', function() {

        it('should leave non-weekend days unchanged', function() {
            var date = new Date(2015, 0, 19); // monday
            expect(skipWeekends.clampUp(date)).toEqual(date);

            date = new Date(2015, 0, 21); // wednesday
            expect(skipWeekends.clampUp(date)).toEqual(date);

            date = new Date(2015, 0, 23); // friday
            expect(skipWeekends.clampUp(date)).toEqual(date);
        });

        it('should clamp sunday up to 00:00 on monday', function() {
            var startOfWeek = new Date(2015, 0, 19); // monday 00:00 hours
            var date = new Date(2015, 0, 18, 12); // mid-day sunday
            expect(skipWeekends.clampUp(date)).toEqual(startOfWeek);
        });

        it('should clamp saturday up to 00:00 on monday', function() {
            var startOfWeek = new Date(2015, 0, 19); // monday 00:00 hours
            var date = new Date(2015, 0, 17, 12); // mid-day saturday
            expect(skipWeekends.clampUp(date)).toEqual(startOfWeek);
        });

        it('should return undefined for undefined', function() {
            expect(skipWeekends.clampUp(undefined)).not.toBeDefined();
        });
    });

    describe('clampDown', function() {

        it('should leave non-weekend days unchanged', function() {
            var date = new Date(2015, 0, 19); // monday
            expect(skipWeekends.clampDown(date)).toEqual(date);

            date = new Date(2015, 0, 21); // wednesday
            expect(skipWeekends.clampDown(date)).toEqual(date);

            date = new Date(2015, 0, 23); // friday
            expect(skipWeekends.clampDown(date)).toEqual(date);
        });

        it('should clamp sunday down to 00:00 on saturday', function() {
            var endOfWeek = new Date(2015, 0, 17); // saturday 00:00 hours
            var date = new Date(2015, 0, 18, 12); // mid-day sunday
            expect(skipWeekends.clampDown(date)).toEqual(endOfWeek);
        });

        it('should clamp any time on saturday down to 00:00 on saturday', function() {
            var endOfWeek = new Date(2015, 0, 17); // saturday 00:00 hours
            var date = new Date(2015, 0, 17, 12); // mid-day saturday
            expect(skipWeekends.clampDown(date)).toEqual(endOfWeek);
        });

        it('should return undefined for undefined', function() {
            expect(skipWeekends.clampDown(undefined)).not.toBeDefined();
        });
    });

    describe('distance', function() {
        it('should give the right result - duh!', function() {
            var d1 = new Date(2015, 0, 19); // monday
            var d2 = new Date(2015, 0, 21); // wednesday
            expect(skipWeekends.distance(d1, d2)).toEqual(2 * millisPerDay);
        });

        it('should remove weekends', function() {
            var d1 = new Date(2015, 0, 19); // monday
            var d2 = new Date(2015, 0, 30); // friday
            expect(skipWeekends.distance(d1, d2)).toEqual(11 * millisPerDay - 2 * millisPerDay);
        });

        it('should handle start dates which are weekends', function() {
            var d1 = new Date(2015, 0, 18); // sunday
            var d2 = new Date(2015, 0, 30); // friday
            expect(skipWeekends.distance(d1, d2)).toEqual(11 * millisPerDay - 2 * millisPerDay);
        });

        it('should handle end dates which are weekends', function() {
            var d1 = new Date(2015, 0, 18); // sunday
            var d2 = new Date(2015, 0, 20); // tuesday
            expect(skipWeekends.distance(d1, d2)).toEqual(1 * millisPerDay);
        });
    });

    describe('offset', function() {

        it('should accommodate offsets that do not cross weekend boundaries', function() {
            var d = new Date(2015, 0, 19); // monday
            expect(skipWeekends.offset(d, millisPerDay)).toEqual(new Date(2015, 0, 20));
        });

        it('should clamp up if supplied with a weekend date', function() {
            var d = new Date(2015, 0, 18); // sunday
            expect(skipWeekends.offset(d, millisPerDay)).toEqual(new Date(2015, 0, 20));
        });

        it('should skip weekends', function() {
            var d = new Date(2015, 0, 20); // tuesday
            expect(skipWeekends.offset(d, 5 * millisPerDay)).toEqual(new Date(2015, 0, 27));
        });

        describe('from Monday', function() {
            var d;
            beforeEach(function() {
                d = new Date(2015, 0, 19);
            });

            it('-6 days', function() {
                expect(skipWeekends.offset(d, -millisPerDay * 6)).toEqual(new Date(2015, 0, 9));
            });

            it('-5  days', function() {
                expect(skipWeekends.offset(d, -millisPerDay * 5)).toEqual(new Date(2015, 0, 12));
            });

            it('-4 days', function() {
                expect(skipWeekends.offset(d, -millisPerDay * 4)).toEqual(new Date(2015, 0, 13));
            });

            it('-3 days', function() {
                expect(skipWeekends.offset(d, -millisPerDay * 3)).toEqual(new Date(2015, 0, 14));
            });

            it('-2 days', function() {
                expect(skipWeekends.offset(d, -millisPerDay * 2)).toEqual(new Date(2015, 0, 15));
            });

            it('-1 day', function() {
                expect(skipWeekends.offset(d, -millisPerDay)).toEqual(new Date(2015, 0, 16));
            });

            it('0 days', function() {
                expect(skipWeekends.offset(d, 0)).toEqual(new Date(2015, 0, 19));
            });

            it('+1 day', function() {
                expect(skipWeekends.offset(d, millisPerDay)).toEqual(new Date(2015, 0, 20));
            });

            it('+2 days', function() {
                expect(skipWeekends.offset(d, millisPerDay * 2)).toEqual(new Date(2015, 0, 21));
            });

            it('+3 days', function() {
                expect(skipWeekends.offset(d, millisPerDay * 3)).toEqual(new Date(2015, 0, 22));
            });

            it('+4 days', function() {
                expect(skipWeekends.offset(d, millisPerDay * 4)).toEqual(new Date(2015, 0, 23));
            });

            it('+5 days', function() {
                expect(skipWeekends.offset(d, millisPerDay * 5)).toEqual(new Date(2015, 0, 26));
            });
        });

        describe('from Wednesday', function() {
            var d;
            beforeEach(function() {
                d = new Date(2015, 0, 21);
            });

            it('-6 days', function() {
                expect(skipWeekends.offset(d, -millisPerDay * 6)).toEqual(new Date(2015, 0, 13));
            });

            it('-5 days', function() {
                expect(skipWeekends.offset(d, -millisPerDay * 5)).toEqual(new Date(2015, 0, 14));
            });

            it('-4 days', function() {
                expect(skipWeekends.offset(d, -millisPerDay * 4)).toEqual(new Date(2015, 0, 15));
            });

            it('-3 days', function() {
                expect(skipWeekends.offset(d, -millisPerDay * 3)).toEqual(new Date(2015, 0, 16));
            });

            it('-2 days', function() {
                expect(skipWeekends.offset(d, -millisPerDay * 2)).toEqual(new Date(2015, 0, 19));
            });

            it('-1 day', function() {
                expect(skipWeekends.offset(d, -millisPerDay)).toEqual(new Date(2015, 0, 20));
            });

            it('0 days', function() {
                expect(skipWeekends.offset(d, 0)).toEqual(new Date(2015, 0, 21));
            });

            it('+1  day', function() {
                expect(skipWeekends.offset(d, millisPerDay)).toEqual(new Date(2015, 0, 22));
            });

            it('+2  days', function() {
                expect(skipWeekends.offset(d, millisPerDay * 2)).toEqual(new Date(2015, 0, 23));
            });

            it('+3 days', function() {
                expect(skipWeekends.offset(d, millisPerDay * 3)).toEqual(new Date(2015, 0, 26));
            });

            it('+4 days', function() {
                expect(skipWeekends.offset(d, millisPerDay * 4)).toEqual(new Date(2015, 0, 27));
            });

            it('+5 days', function() {
                expect(skipWeekends.offset(d, millisPerDay * 5)).toEqual(new Date(2015, 0, 28));
            });
        });
    });
});
