import { expect } from 'chai';
import windowState from '../../../../src/child/reducers/windowState.js';
import { WINDOW as ACTION_TYPES } from '../../../../src/child/constants/actionTypes';

describe('child/reducers/windowState', () => {
    it('should return the initial state', () => {
        expect(windowState(undefined, {})).to.deep.equal({
            isCompact: false,
            isMaximised: false
        });
    });

    it('should handle TOGGLE_COMPACT', () => {
        expect(windowState({
            isCompact: false,
            isMaximised: false
        }, {
            type: ACTION_TYPES.TOGGLE_COMPACT,
            state: true
        })).to.deep.equal({
            isCompact: true,
            isMaximised: false
        });
        expect(windowState({
            isCompact: true,
            isMaximised: false
        }, {
            type: ACTION_TYPES.TOGGLE_COMPACT,
            state: false
        })).to.deep.equal({
            isCompact: false,
            isMaximised: false
        });
    });

    it('should handle MAXIMIZE', () => {
        const action = { type: ACTION_TYPES.MAXIMIZE };
        expect(windowState({
            isCompact: true,
            isMaximised: false
        }, action)).to.deep.equal({
            isCompact: true,
            isMaximised: true
        });
        expect(windowState({
            isCompact: true,
            isMaximised: true
        }, action)).to.deep.equal({
            isCompact: true,
            isMaximised: true
        });
    });

    it('should handle RESTORE', () => {
        const action = { type: ACTION_TYPES.RESTORE };
        expect(windowState({
            isCompact: true,
            isMaximised: false
        }, action)).to.deep.equal({
            isCompact: true,
            isMaximised: false
        });
        expect(windowState({
            isCompact: true,
            isMaximised: true
        }, action)).to.deep.equal({
            isCompact: true,
            isMaximised: false
        });
    });

    it('should handle CLOSE', () => {
        const action = { type: ACTION_TYPES.CLOSE };
        expect(windowState({
            isCompact: false,
            isMaximised: false
        }, action)).to.deep.equal({
            isCompact: false,
            isMaximised: false
        });
        expect(windowState({
            isCompact: true,
            isMaximised: false
        }, action)).to.deep.equal({
            isCompact: true,
            isMaximised: false
        });
        expect(windowState({
            isCompact: false,
            isMaximised: true
        }, action)).to.deep.equal({
            isCompact: false,
            isMaximised: true
        });
        expect(windowState({
            isCompact: true,
            isMaximised: true
        }, action)).to.deep.equal({
            isCompact: true,
            isMaximised: true
        });
    });

    it('should return the previous state for any unknown action', () => {
        const action = { type: 'UNKNOWN_ACTION' };
        expect(windowState({
            isCompact: false,
            isMaximised: false
        }, action)).to.deep.equal({
            isCompact: false,
            isMaximised: false
        });
        expect(windowState({
            isCompact: true,
            isMaximised: false
        }, action)).to.deep.equal({
            isCompact: true,
            isMaximised: false
        });
        expect(windowState({
            isCompact: false,
            isMaximised: true
        }, action)).to.deep.equal({
            isCompact: false,
            isMaximised: true
        });
        expect(windowState({
            isCompact: true,
            isMaximised: true
        }, action)).to.deep.equal({
            isCompact: true,
            isMaximised: true
        });
    });
});
