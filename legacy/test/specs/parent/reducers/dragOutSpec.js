import { expect } from 'chai';
import dragOut from '../../../../src/parent/reducers/dragOut';
import { PARENT as ACTION_TYPES } from '../../../../src/shared/constants/actionTypes';

describe('parent/reducers/dragOut', () => {
    it('should return the initial state', () => {
        const initialState = {};
        expect(dragOut(undefined, {})).to.deep.equal(initialState);
    });

    it('should handle DRAG_OUT', () => {
        const action = {
            type: ACTION_TYPES.DRAG_OUT,
            windowName: 'window0001',
            code: 'GOOG',
            name: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
        };
        expect(dragOut(null, action)).to.deep.equal({
            window0001: {
                code: 'GOOG',
                name: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
            }
        });

        expect(dragOut({
            window0002: {
                code: 'AAPL',
                name: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume'
            }
        }, action)).to.deep.equal({
            window0002: {
                code: 'AAPL',
                name: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume'
            },
            window0001: {
                code: 'GOOG',
                name: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
            }
        });
    });

    it('should handle DRAG_ACCEPT', () => {
        const windowName = 'window0001';
        const action = {
            type: ACTION_TYPES.DRAG_ACCEPT,
            windowName
        };
        expect(dragOut(null, action)).to.deep.equal({});

        expect(dragOut({
            [windowName]: {
                code: 'AAPL',
                name: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume'
            }
        }, action)).to.deep.equal({});
    });

    it('should return the previous state for any unknown action', () => {
        const action = { type: 'UNKNOWN_ACTION' };
        const windowName = 'window0001';
        const code = 'GOOG';
        const name = 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume';
        expect(dragOut(null, action)).to.be.null;
        expect(dragOut({
            [windowName]: {
                code,
                name
            }
        }, action)).to.deep.equal({
            [windowName]: {
                code,
                name
            }
        });
    });
});
