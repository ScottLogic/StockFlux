import { expect } from 'chai';
import windowState from '../../../../src/child/reducers/windowState';
import { WINDOW as ACTION_TYPES } from '../../../../src/shared/constants/actionTypes';
import configService from '../../../../src/shared/ConfigService';

describe('child/reducers/windowState', () => {
    const dimensions = configService.getDefaultWindowDimensions();

    it('should return the initial state', () => {
        expect(windowState(undefined, {})).to.deep.equal({
            isCompact: false,
            isChangingView: false,
            isMaximized: false,
            isResizing: false,
            previousExpandedDimensions: dimensions,
            previousMaximizedState: false
        });
    });

    it('should handle TOGGLE_COMPACT', () => {
        expect(windowState({
            isCompact: false,
            previousMaximizedState: false,
        }, {
            type: ACTION_TYPES.TOGGLE_COMPACT,
            isCompact: true,
            previousMaximizedState: false
        })).to.deep.equal({
            isCompact: true,
            previousMaximizedState: false
        });
        expect(windowState({
            isCompact: false,
            previousMaximizedState: true
        }, {
            type: ACTION_TYPES.TOGGLE_COMPACT,
            isCompact: true,
            previousMaximizedState: true
        })).to.deep.equal({
            isCompact: true,
            previousMaximizedState: true
        });
        expect(windowState({
            isCompact: true,
            previousMaximizedState: false
        }, {
            type: ACTION_TYPES.TOGGLE_COMPACT,
            isCompact: false,
            previousMaximizedState: false
        })).to.deep.equal({
            isCompact: false,
            previousMaximizedState: false
        });
        expect(windowState({
            isCompact: true,
            previousMaximizedState: true
        }, {
            type: ACTION_TYPES.TOGGLE_COMPACT,
            isCompact: false,
            previousMaximizedState: true
        })).to.deep.equal({
            isCompact: false,
            previousMaximizedState: true
        });
    });

    it('should handle MAXIMIZE', () => {
        const action = { type: ACTION_TYPES.MAXIMIZE };
        expect(windowState({
            isCompact: true,
            isMaximized: false
        }, action)).to.deep.equal({
            isCompact: true,
            isMaximized: true
        });
        expect(windowState({
            isCompact: true,
            isMaximized: true
        }, action)).to.deep.equal({
            isCompact: true,
            isMaximized: true
        });
    });

    it('should handle RESTORE', () => {
        const action = { type: ACTION_TYPES.RESTORE };
        expect(windowState({
            isCompact: true,
            isMaximized: false,
            isResizing: false
        }, action)).to.deep.equal({
            isCompact: true,
            isMaximized: false,
            isResizing: false
        });
        expect(windowState({
            isCompact: true,
            isMaximized: true,
            isResizing: false
        }, action)).to.deep.equal({
            isCompact: true,
            isMaximized: false,
            isResizing: false
        });
    });

    it('should handle RESIZING when not changing view', () => {
        const action = { type: ACTION_TYPES.RESIZING, isChangingView: false };
        expect(windowState({
            isCompact: false,
            isChangingView: false,
            isMaximized: false,
            isResizing: false
        }, action)).to.deep.equal({
            isCompact: false,
            isChangingView: false,
            isMaximized: false,
            isResizing: true
        });
        expect(windowState({
            isCompact: true,
            isChangingView: false,
            isMaximized: false,
            isResizing: false
        }, action)).to.deep.equal({
            isCompact: true,
            isChangingView: false,
            isMaximized: false,
            isResizing: true
        });
        expect(windowState({
            isCompact: false,
            isChangingView: false,
            isMaximized: true,
            isResizing: false
        }, action)).to.deep.equal({
            isCompact: false,
            isChangingView: false,
            isMaximized: true,
            isResizing: true
        });
        expect(windowState({
            isCompact: true,
            isChangingView: false,
            isMaximized: true,
            isResizing: false
        }, action)).to.deep.equal({
            isCompact: true,
            isChangingView: false,
            isMaximized: true,
            isResizing: true
        });
    });

    it('should handle RESIZING when changing view', () => {
        const action = { type: ACTION_TYPES.RESIZING, isChangingView: true };
        expect(windowState({
            isCompact: false,
            isChangingView: false,
            isMaximized: false,
            isResizing: false
        }, action)).to.deep.equal({
            isCompact: false,
            isChangingView: true,
            isMaximized: false,
            isResizing: true
        });
        expect(windowState({
            isCompact: true,
            isChangingView: false,
            isMaximized: false,
            isResizing: false
        }, action)).to.deep.equal({
            isCompact: true,
            isChangingView: true,
            isMaximized: false,
            isResizing: true
        });
        expect(windowState({
            isCompact: false,
            isChangingView: false,
            isMaximized: true,
            isResizing: false
        }, action)).to.deep.equal({
            isCompact: false,
            isChangingView: true,
            isMaximized: true,
            isResizing: true
        });
        expect(windowState({
            isCompact: true,
            isChangingView: false,
            isMaximized: true,
            isResizing: false
        }, action)).to.deep.equal({
            isCompact: true,
            isChangingView: true,
            isMaximized: true,
            isResizing: true
        });
    });

    it('should handle RESIZE_SUCCESS', () => {
        const action = { type: ACTION_TYPES.RESIZE_SUCCESS };
        expect(windowState({
            isResizing: true,
            isChangingView: true,
            hasErrors: false
        }, action)).to.deep.equal({
            isResizing: false,
            isChangingView: false,
            hasErrors: false
        });

        expect(windowState({
            isResizing: true,
            isChangingView: false,
            hasErrors: false
        }, action)).to.deep.equal({
            isResizing: false,
            isChangingView: false,
            hasErrors: false
        });
    });

    it('should handle RESIZE_ERROR', () => {
        const action = { type: ACTION_TYPES.RESIZE_ERROR };
        expect(windowState({
            isCompact: false,
            isChangingView: false,
            isMaximized: false,
            isResizing: true
        }, action)).to.deep.equal({
            isCompact: false,
            isChangingView: false,
            isMaximized: false,
            isResizing: false,
            hasErrors: true
        });

        expect(windowState({
            isCompact: false,
            isChangingView: true,
            isMaximized: false,
            isResizing: true
        }, action)).to.deep.equal({
            isCompact: false,
            isChangingView: false,
            isMaximized: false,
            isResizing: false,
            hasErrors: true
        });
    });

    it('should return the previous state for any unknown action', () => {
        const action = { type: 'UNKNOWN_ACTION' };
        expect(windowState({
            isCompact: false,
            isChangingView: true,
            isMaximized: false,
            isResizing: false
        }, action)).to.deep.equal({
            isCompact: false,
            isChangingView: true,
            isMaximized: false,
            isResizing: false
        });
        expect(windowState({
            isCompact: true,
            isChangingView: false,
            isMaximized: false,
            isResizing: false
        }, action)).to.deep.equal({
            isCompact: true,
            isChangingView: false,
            isMaximized: false,
            isResizing: false
        });
        expect(windowState({
            isCompact: false,
            isChangingView: false,
            isMaximized: true,
            isResizing: false
        }, action)).to.deep.equal({
            isCompact: false,
            isChangingView: false,
            isMaximized: true,
            isResizing: false
        });
        expect(windowState({
            isCompact: true,
            isChangingView: false,
            isMaximized: true,
            isResizing: false
        }, action)).to.deep.equal({
            isCompact: true,
            isChangingView: false,
            isMaximized: true,
            isResizing: false
        });
    });
});
