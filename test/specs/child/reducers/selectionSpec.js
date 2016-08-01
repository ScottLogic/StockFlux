import { expect } from 'chai';
import selection from '../../../../src/child/reducers/selection';
import { SELECTION as ACTION_TYPES } from '../../../../src/shared/constants/actionTypes';

describe('child/reducers/selection', () => {
    it('should return the initial state', () => {
        expect(selection(undefined, {})).to.deep.equal({});
    });

    it('should handle SELECTION', () => {
        const action = {
            type: ACTION_TYPES.SELECTION,
            code: 'stockcode',
            name: 'Stock Name'
        };
        expect(selection({}, action)).to.deep.equal({
            code: 'stockcode',
            name: 'Stock Name'
        });
        expect(selection({
            code: 'GOOG',
            name: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
        }, action)).to.deep.equal({
            code: 'stockcode',
            name: 'Stock Name'
        });
    });

    it('should handle UNSELECT', () => {
        const action = { type: ACTION_TYPES.UNSELECT };
        expect(selection({}, action)).to.deep.equal({});
        expect(selection({
            code: 'GOOG',
            name: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
        }, action)).to.deep.equal({});
    });

    it('should return the previous state for any unknown action', () => {
        const action = { type: 'UNKNOWN_ACTION' };
        const code = 'GOOG';
        const name = 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume';
        expect(selection({}, action)).to.deep.equal({});
        expect(selection({
            code,
            name
        }, action)).to.deep.equal({
            code,
            name
        });
    });
});
