import { expect } from 'chai';
import favourites from '../../../../src/child/reducers/favourites';
import { FAVOURITES as ACTION_TYPES } from '../../../../src/shared/constants/actionTypes';

describe('child/reducers/favourites', () => {
    it('should return the initial state', () => {
        const initialState = { codes: [], names: {} };
        expect(favourites(undefined, {})).to.deep.equal(initialState);
    });

    it('should handle TOGGLE_FAVOURITE', () => {
        const action = {
            type: ACTION_TYPES.TOGGLE_FAVOURITE,
            code: 'GOOG'
        };
        expect(favourites({
            codes: [],
            names: {}
        }, action)).to.deep.equal({
            codes: ['GOOG'],
            names: {}
        });

        expect(favourites({
            codes: ['GOOG'],
            names: {}
        }, action)).to.deep.equal({
            codes: [],
            names: {}
        });

        expect(favourites({
            codes: ['GOOG'],
            names: {}
        }, {
            type: ACTION_TYPES.TOGGLE_FAVOURITE,
            code: 'AAPL'
        })).to.deep.equal({
            codes: ['GOOG', 'AAPL'],
            names: {}
        });
    });

    it('should handle INSERT_FAVOURITE_AT', () => {
        expect(favourites({
            codes: ['GOOG', 'AAPL'],
            names: {}
        }, {
            type: ACTION_TYPES.INSERT_FAVOURITE_AT,
            index: -1,
            code: 'FB'
        })).to.deep.equal({
            codes: ['GOOG', 'AAPL', 'FB'],
            names: {}
        });

        expect(favourites({
            codes: [],
            names: {}
        }, {
            type: ACTION_TYPES.INSERT_FAVOURITE_AT,
            index: 0,
            code: 'GOOG'
        })).to.deep.equal({
            codes: ['GOOG'],
            names: {}
        });

        expect(favourites({
            codes: ['GOOG'],
            names: {}
        }, {
            type: ACTION_TYPES.INSERT_FAVOURITE_AT,
            index: 1,
            code: 'AAPL'
        })).to.deep.equal({
            codes: ['GOOG', 'AAPL'],
            names: {}
        });

        expect(favourites({
            codes: ['GOOG', 'AAPL'],
            names: {}
        }, {
            type: ACTION_TYPES.INSERT_FAVOURITE_AT,
            index: 1,
            code: 'FB'
        })).to.deep.equal({
            codes: ['GOOG', 'FB', 'AAPL'],
            names: {}
        });

        expect(favourites({
            codes: ['GOOG', 'FB', 'AAPL'],
            names: {}
        }, {
            type: ACTION_TYPES.INSERT_FAVOURITE_AT,
            index: 2,
            code: 'FB'
        })).to.deep.equal({
            codes: ['GOOG', 'AAPL', 'FB'],
            names: {}
        });
    });

    it('should handle QUANDL_RESPONSE', () => {
        const action = {
            type: ACTION_TYPES.QUANDL_RESPONSE,
            code: 'GOOG',
            name: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
        };
        expect(favourites({
            codes: ['GOOG'],
            names: {}
        }, action)).to.deep.equal({
            codes: ['GOOG'],
            names: { GOOG: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume' }
        });
        expect(favourites({
            codes: ['AAPL', 'GOOG'],
            names: { AAPL: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume' }
        }, action)).to.deep.equal({
            codes: ['AAPL', 'GOOG'],
            names: {
                AAPL: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume',
                GOOG: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
            }
        });
    });

    it('should return the previous state for any unknown action', () => {
        const action = { type: 'UNKNOWN_ACTION' };
        const codes = ['GOOG'];
        const names = { GOOG: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume' };
        expect(favourites({
            codes,
            names
        }, action)).to.deep.equal({
            codes,
            names
        });
    });
});
