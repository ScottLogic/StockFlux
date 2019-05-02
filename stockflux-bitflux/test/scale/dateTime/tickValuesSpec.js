import d3 from 'd3';
import fc from 'd3fc';
import dateTimeTickValues from '../../../src/assets/js/scale/dateTime/tickValues';

// Based on D3's time scale tick generation, but enforces a strict limit on tick count
// and allows a minimum tick interval to be specified
// (no tick interval more frequenct should be applied than the minimum tick interval)
// https://github.com/d3/d3/blob/9cc9a875e636a1dcf36cc1e07bdf77e1ad6e2c74/src/time/scale.js
describe('scale/dateTime/tickValues', function() {

    var tickValues;
    describe('properties', function() {
        beforeEach(function() {
            tickValues = dateTimeTickValues();
        });

        it('should have a default target tick count of 10', function() {
            expect(tickValues.ticks()).toEqual(10);
        });

        it('should have a default domain of undefined', function() {
            expect(tickValues.domain()).not.toBeDefined();
        });

        it('should have a default minimum tick interval of undefined', function() {
            expect(tickValues.minimumTickInterval()).not.toBeDefined();
        });

        it('should have a default discontinuity provider of undefined', function() {
            expect(tickValues.discontinuityProvider()).not.toBeDefined();
        });

        it('should have a getter/setter for ticks', function() {
            var ticks = tickValues.ticks(5);
            expect(ticks.ticks()).toEqual(5);
        });

        it('should default to 10 ticks if ticks are set to null', function() {
            var ticks = tickValues
                .ticks(null)
                .discontinuityProvider(fc.scale.discontinuity.identity())
                .domain([new Date(2011, 0, 1, 12, 0, 0), new Date(2011, 0, 1, 12, 0, 9)])();
            expect(ticks.length).toBe(10);
            expect(ticks[0]).toEqual(new Date(2011, 0, 1, 12, 0, 0));
            expect(ticks[1]).toEqual(new Date(2011, 0, 1, 12, 0, 1));
            expect(ticks[2]).toEqual(new Date(2011, 0, 1, 12, 0, 2));
            expect(ticks[3]).toEqual(new Date(2011, 0, 1, 12, 0, 3));
            expect(ticks[4]).toEqual(new Date(2011, 0, 1, 12, 0, 4));
            expect(ticks[5]).toEqual(new Date(2011, 0, 1, 12, 0, 5));
            expect(ticks[6]).toEqual(new Date(2011, 0, 1, 12, 0, 6));
            expect(ticks[7]).toEqual(new Date(2011, 0, 1, 12, 0, 7));
            expect(ticks[8]).toEqual(new Date(2011, 0, 1, 12, 0, 8));
            expect(ticks[9]).toEqual(new Date(2011, 0, 1, 12, 0, 9));
        });

        it('should have a getter/setter for domain', function() {
            var ticks = tickValues.domain([new Date(2011, 0, 1, 12, 0, 0), new Date(2011, 0, 1, 12, 0, 4)]);
            expect(ticks.domain()).toEqual([new Date(2011, 0, 1, 12, 0, 0), new Date(2011, 0, 1, 12, 0, 4)]);
        });

        it('should have a getter/setter for minimum tick interval', function() {
            var ticks = tickValues.minimumTickInterval([d3.time.year, 1]);
            expect(ticks.minimumTickInterval()).toEqual([d3.time.year, 1]);
        });

        it('should have a getter/setter for minimum tick interval', function() {
            var discontinuityProvider = function() { return; };
            var ticks = tickValues.discontinuityProvider(discontinuityProvider);
            expect(ticks.discontinuityProvider()).toEqual(discontinuityProvider);
        });
    });

    describe('tick generation', function() {
        beforeEach(function() {
            tickValues = dateTimeTickValues().discontinuityProvider(fc.scale.discontinuity.identity());
        });

        it('should generate 1-second ticks', function() {
            var ticks = tickValues
                .ticks(5)
                .domain([new Date(2011, 0, 1, 12, 0, 0), new Date(2011, 0, 1, 12, 0, 4)])();
            expect(ticks.length).toBe(5);
            expect(ticks[0]).toEqual(new Date(2011, 0, 1, 12, 0, 0));
            expect(ticks[1]).toEqual(new Date(2011, 0, 1, 12, 0, 1));
            expect(ticks[2]).toEqual(new Date(2011, 0, 1, 12, 0, 2));
            expect(ticks[3]).toEqual(new Date(2011, 0, 1, 12, 0, 3));
            expect(ticks[4]).toEqual(new Date(2011, 0, 1, 12, 0, 4));
        });

        it('should generate 5-second ticks', function() {
            var ticks = tickValues
                .ticks(5)
                .domain([new Date(2011, 0, 1, 12, 0, 0), new Date(2011, 0, 1, 12, 0, 20)])();
            expect(ticks.length).toBe(5);
            expect(ticks[0]).toEqual(new Date(2011, 0, 1, 12, 0, 0));
            expect(ticks[1]).toEqual(new Date(2011, 0, 1, 12, 0, 5));
            expect(ticks[2]).toEqual(new Date(2011, 0, 1, 12, 0, 10));
            expect(ticks[3]).toEqual(new Date(2011, 0, 1, 12, 0, 15));
            expect(ticks[4]).toEqual(new Date(2011, 0, 1, 12, 0, 20));
        });

        it('should generate 15-second ticks', function() {
            var ticks = tickValues
                .ticks(5)
                .domain([new Date(2011, 0, 1, 12, 0, 0), new Date(2011, 0, 1, 12, 0, 50)])();
            expect(ticks.length).toBe(4);
            expect(ticks[0]).toEqual(new Date(2011, 0, 1, 12, 0, 0));
            expect(ticks[1]).toEqual(new Date(2011, 0, 1, 12, 0, 15));
            expect(ticks[2]).toEqual(new Date(2011, 0, 1, 12, 0, 30));
            expect(ticks[3]).toEqual(new Date(2011, 0, 1, 12, 0, 45));
        });

        it('should generate 30-second ticks', function() {
            var ticks = tickValues
                .ticks(5)
                .domain([new Date(2011, 0, 1, 12, 0, 0), new Date(2011, 0, 1, 12, 0, 50)])();
            expect(ticks.length).toBe(4);
            expect(ticks[0]).toEqual(new Date(2011, 0, 1, 12, 0, 0));
            expect(ticks[1]).toEqual(new Date(2011, 0, 1, 12, 0, 15));
            expect(ticks[2]).toEqual(new Date(2011, 0, 1, 12, 0, 30));
            expect(ticks[3]).toEqual(new Date(2011, 0, 1, 12, 0, 45));
        });

        it('should generate 1-minute ticks', function() {
            var ticks = tickValues
                .ticks(5)
                .domain([new Date(2011, 0, 1, 12, 0, 27), new Date(2011, 0, 1, 12, 4, 27)])();
            expect(ticks.length).toBe(4);
            expect(ticks[0]).toEqual(new Date(2011, 0, 1, 12, 1));
            expect(ticks[1]).toEqual(new Date(2011, 0, 1, 12, 2));
            expect(ticks[2]).toEqual(new Date(2011, 0, 1, 12, 3));
            expect(ticks[3]).toEqual(new Date(2011, 0, 1, 12, 4));
        });

        it('should generate 5-minute ticks', function() {
            var ticks = tickValues
                .ticks(5)
                .domain([new Date(2011, 0, 1, 12, 3, 27), new Date(2011, 0, 1, 12, 21, 12)])();
            expect(ticks.length).toBe(4);
            expect(ticks[0]).toEqual(new Date(2011, 0, 1, 12, 5));
            expect(ticks[1]).toEqual(new Date(2011, 0, 1, 12, 10));
            expect(ticks[2]).toEqual(new Date(2011, 0, 1, 12, 15));
            expect(ticks[3]).toEqual(new Date(2011, 0, 1, 12, 20));
        });

        it('should generate 15-minute ticks', function() {
            var ticks = tickValues
                .ticks(5)
                .domain([new Date(2011, 0, 1, 12, 8, 27), new Date(2011, 0, 1, 13, 4, 12)])();
            expect(ticks.length).toBe(4);
            expect(ticks[0]).toEqual(new Date(2011, 0, 1, 12, 15));
            expect(ticks[1]).toEqual(new Date(2011, 0, 1, 12, 30));
            expect(ticks[2]).toEqual(new Date(2011, 0, 1, 12, 45));
            expect(ticks[3]).toEqual(new Date(2011, 0, 1, 13, 0));
        });

        it('should generate 30-minute ticks', function() {
            var ticks = tickValues
                .ticks(5)
                .domain([new Date(2011, 0, 1, 12, 28, 27), new Date(2011, 0, 1, 14, 4, 12)])();
            expect(ticks.length).toBe(4);
            expect(ticks[0]).toEqual(new Date(2011, 0, 1, 12, 30));
            expect(ticks[1]).toEqual(new Date(2011, 0, 1, 13, 0));
            expect(ticks[2]).toEqual(new Date(2011, 0, 1, 13, 30));
            expect(ticks[3]).toEqual(new Date(2011, 0, 1, 14, 0));
        });

        it('should generate 1-hour ticks', function() {
            var ticks = tickValues
                .ticks(5)
                .domain([new Date(2011, 0, 1, 12, 28, 27), new Date(2011, 0, 1, 16, 34, 12)])();
            expect(ticks.length).toBe(4);
            expect(ticks[0]).toEqual(new Date(2011, 0, 1, 13));
            expect(ticks[1]).toEqual(new Date(2011, 0, 1, 14));
            expect(ticks[2]).toEqual(new Date(2011, 0, 1, 15));
            expect(ticks[3]).toEqual(new Date(2011, 0, 1, 16));
        });

        it('should generate 3-hour ticks', function() {
            var ticks = tickValues
                .ticks(5)
                .domain([new Date(2011, 0, 1, 14, 28, 27), new Date(2011, 0, 2, 1, 34, 12)])();
            expect(ticks.length).toBe(4);
            expect(ticks[0]).toEqual(new Date(2011, 0, 1, 15));
            expect(ticks[1]).toEqual(new Date(2011, 0, 1, 18));
            expect(ticks[2]).toEqual(new Date(2011, 0, 1, 21));
            expect(ticks[3]).toEqual(new Date(2011, 0, 2, 0));
        });

        it('should generate 6-hour ticks', function() {
            var ticks = tickValues
                .ticks(5)
                .domain([new Date(2011, 0, 1, 16, 28, 27), new Date(2011, 0, 2, 14, 34, 12)])();
            expect(ticks.length).toBe(4);
            expect(ticks[0]).toEqual(new Date(2011, 0, 1, 18));
            expect(ticks[1]).toEqual(new Date(2011, 0, 2, 0));
            expect(ticks[2]).toEqual(new Date(2011, 0, 2, 6));
            expect(ticks[3]).toEqual(new Date(2011, 0, 2, 12));
        });

        it('should generate 12-hour ticks', function() {
            var ticks = tickValues
                .ticks(5)
                .domain([new Date(2011, 0, 1, 16, 28, 27), new Date(2011, 0, 3, 21, 34, 12)])();
            expect(ticks.length).toBe(4);
            expect(ticks[0]).toEqual(new Date(2011, 0, 2, 0));
            expect(ticks[1]).toEqual(new Date(2011, 0, 2, 12));
            expect(ticks[2]).toEqual(new Date(2011, 0, 3, 0));
            expect(ticks[3]).toEqual(new Date(2011, 0, 3, 12));
        });

        it('should generate 1-day ticks', function() {
            var ticks = tickValues
                .ticks(5)
                .domain([new Date(2011, 0, 1, 16, 28, 27), new Date(2011, 0, 5, 21, 34, 12)])();
            expect(ticks.length).toBe(4);
            expect(ticks[0]).toEqual(new Date(2011, 0, 2));
            expect(ticks[1]).toEqual(new Date(2011, 0, 3));
            expect(ticks[2]).toEqual(new Date(2011, 0, 4));
            expect(ticks[3]).toEqual(new Date(2011, 0, 5));
        });

        it('should generate 1-week ticks', function() {
            var ticks = tickValues
                .ticks(5)
                .domain([new Date(2011, 0, 1, 16, 28, 27), new Date(2011, 0, 23, 21, 34, 12)])();
            expect(ticks.length).toBe(4);
            expect(ticks[0]).toEqual(new Date(2011, 0, 2));
            expect(ticks[1]).toEqual(new Date(2011, 0, 9));
            expect(ticks[2]).toEqual(new Date(2011, 0, 16));
            expect(ticks[3]).toEqual(new Date(2011, 0, 23));
        });

        it('should generate 1-month ticks', function() {
            var ticks = tickValues
                .ticks(5)
                .domain([new Date(2011, 0, 18), new Date(2011, 4, 2)])();
            expect(ticks.length).toBe(4);
            expect(ticks[0]).toEqual(new Date(2011, 1, 1));
            expect(ticks[1]).toEqual(new Date(2011, 2, 1));
            expect(ticks[2]).toEqual(new Date(2011, 3, 1));
            expect(ticks[3]).toEqual(new Date(2011, 4, 1));
        });

        it('should generate 3-month ticks', function() {
            var ticks = tickValues
                .ticks(5)
                .domain([new Date(2010, 11, 18), new Date(2011, 10, 2)])();
            expect(ticks.length).toBe(4);
            expect(ticks[0]).toEqual(new Date(2011, 0, 1));
            expect(ticks[1]).toEqual(new Date(2011, 3, 1));
            expect(ticks[2]).toEqual(new Date(2011, 6, 1));
            expect(ticks[3]).toEqual(new Date(2011, 9, 1));
        });

        it('should generate 1 year ticks', function() {
            var ticks = tickValues
                .ticks(5)
                .domain([new Date(2010, 11, 18), new Date(2014, 2, 2)])();
            expect(ticks.length).toBe(4);
            expect(ticks[0]).toEqual(new Date(2011, 0, 1));
            expect(ticks[1]).toEqual(new Date(2012, 0, 1));
            expect(ticks[2]).toEqual(new Date(2013, 0, 1));
            expect(ticks[3]).toEqual(new Date(2014, 0, 1));

            // This is an edge-case where the number of ticks is greated than
            // the specfied count, to avoid 0 ticks
            ticks = tickValues
                .ticks(1)
                .domain([new Date(2010, 0, 1), new Date(2011, 0, 1, 0, 0, 1)])();
            expect(ticks.length).toBe(2);
            expect(ticks[0]).toEqual(new Date(2010, 0, 1));
            expect(ticks[1]).toEqual(new Date(2011, 0, 1));
        });

        it('should generate multi-year ticks', function() {
            var ticks = tickValues
                .ticks(4)
                .domain([new Date(1900, 0, 0), new Date(2014, 2, 2)])();
            expect(ticks.length).toBe(3);
            expect(ticks[0]).toEqual(new Date(1900, 0, 1));
            expect(ticks[1]).toEqual(new Date(1950, 0, 1));
            expect(ticks[2]).toEqual(new Date(2000, 0, 1));

            ticks = tickValues
                .ticks(4)
                .domain([new Date(2000, 0, 0), new Date(2014, 2, 2)])();
            expect(ticks.length).toBe(3);
            expect(ticks[0]).toEqual(new Date(2000, 0, 1));
            expect(ticks[1]).toEqual(new Date(2005, 0, 1));
            expect(ticks[2]).toEqual(new Date(2010, 0, 1));
        });

        it('should generate 0 ticks if specified', function() {
            var ticks = tickValues
                .ticks(0)
                .domain([new Date(1900, 0, 0), new Date(2014, 2, 2)])();
            expect(ticks.length).toBe(0);

            ticks = tickValues
                .ticks(0)
                .domain([new Date(2014, 0, 0), new Date(2014, 2, 2)])();
            expect(ticks.length).toBe(0);
        });
    });

    describe('minimum tick interval', function() {
        beforeEach(function() {
            tickValues = dateTimeTickValues().discontinuityProvider(fc.scale.discontinuity.identity());
        });

        it('should respect minimum tick interval', function() {
            var ticks = tickValues
                .minimumTickInterval([d3.time.day, 1])
                .ticks(5)
                .domain([new Date(2011, 0, 1, 16, 28, 27), new Date(2011, 0, 3, 21, 34, 12)])();
            expect(ticks.length).toBe(2);
            expect(ticks[0]).toEqual(new Date(2011, 0, 2, 0));
            expect(ticks[1]).toEqual(new Date(2011, 0, 3, 0));
        });

        it('should throw an error if a minimum tick interval is not supported', function() {
            expect(function() {
                tickValues
                    .minimumTickInterval([d3.time.day, 10000])
                    .ticks(5)
                    .domain([new Date(2011, 0, 1, 16, 28, 27), new Date(2011, 0, 3, 21, 34, 12)])();
            }).toThrow(new Error('Specified minimum tick interval is not supported'));
        });
    });
});
