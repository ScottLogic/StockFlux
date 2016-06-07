import { expect } from 'chai';
import sinon from 'sinon';
import windowState from '../../../src/child/reducers/windowState.js';
import { WINDOW as ACTION_TYPES } from '../../../src/child/constants/actionTypes';

const publish = sinon.spy();
const close = sinon.spy();
global.fin = { desktop: { InterApplicationBus: { publish } } };
global.window = { close };

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

        expect(publish.calledOnce).to.be.true;
        expect(close.calledOnce).to.be.true;
        expect(publish.calledWithExactly('childClosing', { id: window.id })).to.be.true;
        expect(close.calledWithExactly()).to.be.true;

        expect(windowState({
            isCompact: true,
            isMaximised: false
        }, action)).to.deep.equal({
            isCompact: true,
            isMaximised: false
        });

        expect(publish.calledTwice).to.be.true;
        expect(close.calledTwice).to.be.true;
        expect(publish.calledWithExactly('childClosing', { id: window.id })).to.be.true;
        expect(close.calledWithExactly()).to.be.true;

        expect(windowState({
            isCompact: false,
            isMaximised: true
        }, action)).to.deep.equal({
            isCompact: false,
            isMaximised: true
        });

        expect(publish.calledThrice).to.be.true;
        expect(close.calledThrice).to.be.true;
        expect(publish.calledWithExactly('childClosing', { id: window.id })).to.be.true;
        expect(close.calledWithExactly()).to.be.true;

        expect(windowState({
            isCompact: true,
            isMaximised: true
        }, action)).to.deep.equal({
            isCompact: true,
            isMaximised: true
        });

        expect(publish.callCount).to.equal(4);
        expect(close.callCount).to.equal(4);
        expect(publish.calledWithExactly('childClosing', { id: window.id })).to.be.true;
        expect(close.calledWithExactly()).to.be.true;
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
