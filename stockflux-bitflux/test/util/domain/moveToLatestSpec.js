import fc from 'd3fc';
import makeDatum from '../../helpers/makeDatum';
import moveToLatest from '../../../src/assets/js/util/domain/moveToLatest';
import skipWeekends from '../../../src/assets/js/scale/discontinuity/skipWeekends';

describe('util/domain/moveToLatest', function() {

    var dataDateExtent;
    var reversedDataDateExtent;

    var saturday = new Date(2015, 7, 15);
    var sunday = new Date(2015, 7, 16);
    var tuesday = new Date(2015, 7, 18);
    var wednesday = new Date(2015, 7, 19);

    beforeEach(function() {
        dataDateExtent = fc.util.extent().fields(['date'])([makeDatum(1000), makeDatum(10000)]);
        reversedDataDateExtent = [dataDateExtent[1], dataDateExtent[0]];
    });

    it('should keep the extent size the same by default with identity discontinuity', function() {
        var extent = [new Date(1000), new Date(6000)];
        var reversedExtent = [extent[1], extent[0]];

        var moveToLatestExtent = moveToLatest(fc.scale.discontinuity.identity(), extent, dataDateExtent);

        expect(moveToLatestExtent.length).toEqual(extent.length);
        expect(moveToLatestExtent[0].getTime()).toEqual(5000);
        expect(moveToLatestExtent[1].getTime()).toEqual(10000);

        var reversedMoveToLatestExtent = moveToLatest(fc.scale.discontinuity.identity(), reversedExtent, reversedDataDateExtent);

        expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
        expect(reversedMoveToLatestExtent[0].getTime()).toEqual(5000);
        expect(reversedMoveToLatestExtent[1].getTime()).toEqual(10000);
    });

    it('should move the extent to end at the last data point if extent ends before the data with identity discontinuity', function() {
        var extent = [new Date(1000), new Date(6000)];
        var reversedExtent = [extent[1], extent[0]];

        var moveToLatestExtent = moveToLatest(fc.scale.discontinuity.identity(), extent, dataDateExtent);

        expect(moveToLatestExtent.length).toEqual(extent.length);
        expect(moveToLatestExtent[0].getTime()).toEqual(5000);
        expect(moveToLatestExtent[1].getTime()).toEqual(10000);

        var reversedMoveToLatestExtent = moveToLatest(fc.scale.discontinuity.identity(), reversedExtent, reversedDataDateExtent);

        expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
        expect(reversedMoveToLatestExtent[0].getTime()).toEqual(5000);
        expect(reversedMoveToLatestExtent[1].getTime()).toEqual(10000);
    });

    it('should move the extent to end at the last data point if extent ends after the data with identity discontinuity', function() {
        var extent = [new Date(11000), new Date(16000)];
        var reversedExtent = [extent[1], extent[0]];

        var moveToLatestExtent = moveToLatest(fc.scale.discontinuity.identity(), extent, dataDateExtent);

        expect(moveToLatestExtent.length).toEqual(extent.length);
        expect(moveToLatestExtent[0].getTime()).toEqual(5000);
        expect(moveToLatestExtent[1].getTime()).toEqual(10000);

        var reversedMoveToLatestExtent = moveToLatest(fc.scale.discontinuity.identity(), reversedExtent, reversedDataDateExtent);

        expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
        expect(reversedMoveToLatestExtent[0].getTime()).toEqual(5000);
        expect(reversedMoveToLatestExtent[1].getTime()).toEqual(10000);
    });

    it('should scale the extent in proportion to the inputted value with identity discontinuity', function() {
        var extent = [new Date(1000), new Date(6000)];
        var reversedExtent = [extent[1], extent[0]];

        var moveToLatestExtent = moveToLatest(fc.scale.discontinuity.identity(), extent, dataDateExtent, 0.2);

        expect(moveToLatestExtent.length).toEqual(extent.length);
        expect(moveToLatestExtent[0].getTime()).toEqual(9000);
        expect(moveToLatestExtent[1].getTime()).toEqual(10000);

        var reversedMoveToLatestExtent = moveToLatest(fc.scale.discontinuity.identity(), reversedExtent, reversedDataDateExtent, 0.2);

        expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
        expect(reversedMoveToLatestExtent[0].getTime()).toEqual(9000);
        expect(reversedMoveToLatestExtent[1].getTime()).toEqual(10000);
    });

    it('should return the data extent if the domain extent is too large with identity discontinuity', function() {
        var extent = [new Date(1000), new Date(20000)];
        var reversedExtent = [extent[1], extent[0]];

        var moveToLatestExtent = moveToLatest(fc.scale.discontinuity.identity(), extent, dataDateExtent);

        expect(moveToLatestExtent.length).toEqual(extent.length);
        expect(moveToLatestExtent[0].getTime()).toEqual(1000);
        expect(moveToLatestExtent[1].getTime()).toEqual(10000);

        var reversedMoveToLatestExtent = moveToLatest(fc.scale.discontinuity.identity(), reversedExtent, reversedDataDateExtent);

        expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
        expect(reversedMoveToLatestExtent[0].getTime()).toEqual(1000);
        expect(reversedMoveToLatestExtent[1].getTime()).toEqual(10000);
    });

    it('should return weekend data if applicable with identity discontinuity', function() {
        var extent = [saturday, tuesday];
        var reversedExtent = [tuesday, saturday];
        dataDateExtent = [saturday, wednesday];
        reversedDataDateExtent = [saturday, wednesday];

        var moveToLatestExtent = moveToLatest(fc.scale.discontinuity.identity(), extent, dataDateExtent);

        expect(moveToLatestExtent.length).toEqual(extent.length);
        expect(moveToLatestExtent[0]).toEqual(sunday);
        expect(moveToLatestExtent[1]).toEqual(wednesday);

        var reversedMoveToLatestExtent = moveToLatest(fc.scale.discontinuity.identity(), reversedExtent, reversedDataDateExtent);

        expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
        expect(reversedMoveToLatestExtent[0]).toEqual(sunday);
        expect(reversedMoveToLatestExtent[1]).toEqual(wednesday);
    });

    it('should keep the extent size the same by default with skip weekends discontinuity', function() {
        var extent = [new Date(1000), new Date(6000)];
        var reversedExtent = [extent[1], extent[0]];

        var moveToLatestExtent = moveToLatest(skipWeekends(), extent, dataDateExtent);

        expect(moveToLatestExtent.length).toEqual(extent.length);
        expect(moveToLatestExtent[0].getTime()).toEqual(5000);
        expect(moveToLatestExtent[1].getTime()).toEqual(10000);

        var reversedMoveToLatestExtent = moveToLatest(skipWeekends(), reversedExtent, reversedDataDateExtent);

        expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
        expect(reversedMoveToLatestExtent[0].getTime()).toEqual(5000);
        expect(reversedMoveToLatestExtent[1].getTime()).toEqual(10000);
    });

    it('should move the extent to end at the last data point if extent ends before the data with skip weekends discontinuity', function() {
        var extent = [new Date(1000), new Date(6000)];
        var reversedExtent = [extent[1], extent[0]];

        var moveToLatestExtent = moveToLatest(skipWeekends(), extent, dataDateExtent);

        expect(moveToLatestExtent.length).toEqual(extent.length);
        expect(moveToLatestExtent[0].getTime()).toEqual(5000);
        expect(moveToLatestExtent[1].getTime()).toEqual(10000);

        var reversedMoveToLatestExtent = moveToLatest(skipWeekends(), reversedExtent, reversedDataDateExtent);

        expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
        expect(reversedMoveToLatestExtent[0].getTime()).toEqual(5000);
        expect(reversedMoveToLatestExtent[1].getTime()).toEqual(10000);
    });

    it('should move the extent to end at the last data point if extent ends after the data with skip weekends discontinuity', function() {
        var extent = [new Date(11000), new Date(16000)];
        var reversedExtent = [extent[1], extent[0]];

        var moveToLatestExtent = moveToLatest(skipWeekends(), extent, dataDateExtent);

        expect(moveToLatestExtent.length).toEqual(extent.length);
        expect(moveToLatestExtent[0].getTime()).toEqual(5000);
        expect(moveToLatestExtent[1].getTime()).toEqual(10000);

        var reversedMoveToLatestExtent = moveToLatest(skipWeekends(), reversedExtent, reversedDataDateExtent);

        expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
        expect(reversedMoveToLatestExtent[0].getTime()).toEqual(5000);
        expect(reversedMoveToLatestExtent[1].getTime()).toEqual(10000);
    });

    it('should scale the extent in proportion to the inputted value with skip weekends discontinuity', function() {
        var extent = [new Date(1000), new Date(6000)];
        var reversedExtent = [extent[1], extent[0]];

        var moveToLatestExtent = moveToLatest(skipWeekends(), extent, dataDateExtent, 0.2);

        expect(moveToLatestExtent.length).toEqual(extent.length);
        expect(moveToLatestExtent[0].getTime()).toEqual(9000);
        expect(moveToLatestExtent[1].getTime()).toEqual(10000);

        var reversedMoveToLatestExtent = moveToLatest(skipWeekends(), reversedExtent, reversedDataDateExtent, 0.2);

        expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
        expect(reversedMoveToLatestExtent[0].getTime()).toEqual(9000);
        expect(reversedMoveToLatestExtent[1].getTime()).toEqual(10000);
    });

    it('should return the data extent if the domain extent is too large with skip weekends discontinuity', function() {
        var extent = [new Date(1000), new Date(20000)];
        var reversedExtent = [extent[1], extent[0]];

        var moveToLatestExtent = moveToLatest(skipWeekends(), extent, dataDateExtent);

        expect(moveToLatestExtent.length).toEqual(extent.length);
        expect(moveToLatestExtent[0].getTime()).toEqual(1000);
        expect(moveToLatestExtent[1].getTime()).toEqual(10000);

        var reversedMoveToLatestExtent = moveToLatest(skipWeekends(), reversedExtent, reversedDataDateExtent);

        expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
        expect(reversedMoveToLatestExtent[0].getTime()).toEqual(1000);
        expect(reversedMoveToLatestExtent[1].getTime()).toEqual(10000);
    });

    it('should not return weekend data if applicable with identity discontinuity', function() {
        var extent = [saturday, tuesday];
        var reversedExtent = [tuesday, saturday];
        dataDateExtent = [saturday, wednesday];
        reversedDataDateExtent = [wednesday, saturday];

        var moveToLatestExtent = moveToLatest(skipWeekends(), extent, dataDateExtent);

        expect(moveToLatestExtent.length).toEqual(extent.length);
        expect(moveToLatestExtent[0]).toEqual(tuesday);
        expect(moveToLatestExtent[1]).toEqual(wednesday);

        var reversedMoveToLatestExtent = moveToLatest(skipWeekends(), reversedExtent, reversedDataDateExtent);

        expect(reversedMoveToLatestExtent.length).toEqual(reversedExtent.length);
        expect(reversedMoveToLatestExtent[0]).toEqual(tuesday);
        expect(reversedMoveToLatestExtent[1]).toEqual(wednesday);
    });
});
