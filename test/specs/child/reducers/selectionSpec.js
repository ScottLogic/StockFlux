import { expect } from 'chai';
import selection from '../../../../src/child/reducers/selection';
import { SELECTION as SELECTION_ACTION_TYPES, FAVOURITES as FAVOURITES_ACTION_TYPES } from '../../../../src/shared/constants/actionTypes';

describe('child/reducers/selection', () => {
    it('should return the initial state', () => {
        expect(selection(undefined, {})).to.deep.equal({});
    });

    it('should handle SELECTION', () => {
        const action = {
            type: SELECTION_ACTION_TYPES.SELECTION,
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
        const action = { type: SELECTION_ACTION_TYPES.UNSELECT };
        expect(selection({}, action)).to.deep.equal({});
        expect(selection({
            code: 'GOOG',
            name: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
        }, action)).to.deep.equal({});
    });

    it('should handle QUANDL_RESPONSE', () => {
        const action = {
            type: FAVOURITES_ACTION_TYPES.QUANDL_RESPONSE,
            code: 'GOOG',
            name: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
        };
        expect(selection({
            code: 'GOOG'
        }, action)).to.deep.equal({
            code: 'GOOG',
            name: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
        });
        expect(selection({
            code: 'GOOG',
            name: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
        }, action)).to.deep.equal({
            code: 'GOOG',
            name: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
        });
        expect(selection({
            code: 'AAPL'
        }, action)).to.deep.equal({
            code: 'AAPL'
        });
        expect(selection({
            code: 'AAPL',
            name: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume'
        }, action)).to.deep.equal({
            code: 'AAPL',
            name: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume'
        });
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
