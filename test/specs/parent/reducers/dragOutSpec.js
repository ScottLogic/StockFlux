import { expect } from 'chai';
import dragOut from '../../../../src/parent/reducers/dragOut';
import { PARENT as ACTION_TYPES } from '../../../../src/shared/constants/actionTypes';

describe('parent/reducers/dragOut', () => {
    it('should return the initial state', () => {
        const initialState = null;
        expect(dragOut(undefined, {})).to.equal(initialState);
    });

    it('should handle DRAG_OUT', () => {
        const action = {
            type: ACTION_TYPES.DRAG_OUT,
            code: 'GOOG',
            name: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
        };
        expect(dragOut(null, action)).to.deep.equal({
            code: 'GOOG',
            name: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
        });

        expect(dragOut({
            code: 'AAPL',
            name: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume'
        }, action)).to.deep.equal({
            code: 'GOOG',
            name: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
        });
    });

    it('should handle DRAG_ACCEPT', () => {
        const action = {
            type: ACTION_TYPES.DRAG_ACCEPT
        };
        expect(dragOut(null, action)).to.be.null;

        expect(dragOut({
            code: 'AAPL',
            name: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume'
        }, action)).to.be.null;
    });

    it('should return the previous state for any unknown action', () => {
        const action = { type: 'UNKNOWN_ACTION' };
        const code = 'GOOG';
        const name = 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume';
        expect(dragOut(null, action)).to.be.null;
        expect(dragOut({
            code,
            name
        }, action)).to.deep.equal({
            code,
            name
        });
    });
});
