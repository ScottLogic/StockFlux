import { expect } from 'chai';
import { minimise, compact, expand, fullView, maximize,
         restore, close, resizing, __RewireAPI__ as rewiredActions } from '../../../../src/child/actions/window';
import { WINDOW as ACTION_TYPES } from '../../../../src/child/constants/actionTypes.js';

describe('child/actions/window', () => {

    before(() => {
        const windowNameFunc = () => ({ name: 0 });
        rewiredActions.__Rewire__('currentWindowService', { getCurrentWindow: windowNameFunc });
    });

    it('should create an action for minimise', () => {
        const expectedAction = { windowName: 0, type: ACTION_TYPES.MINIMIZE };
        expect(minimise()).to.deep.equal(expectedAction);
    });

    it('should create an action for compact', () => {
        const expectedAction = {
            windowName: 0,
            type: ACTION_TYPES.TOGGLE_COMPACT,
            state: true
        };
        expect(compact()).to.deep.equal(expectedAction);
    });

    it('should create an action for expand', () => {
        const expectedAction = {
            windowName: 0,
            type: ACTION_TYPES.TOGGLE_COMPACT,
            state: false
        };
        expect(expand()).to.deep.equal(expectedAction);
    });

    it('should create an action for full view', () => {
        const expectedAction = { windowName: 0, type: ACTION_TYPES.STATE_FULL_VIEW };
        expect(fullView()).to.deep.equal(expectedAction);
    });

    it('should create an action for maximize', () => {
        const expectedAction = { windowName: 0, type: ACTION_TYPES.MAXIMIZE };
        expect(maximize()).to.deep.equal(expectedAction);
    });

    it('should create an action for restore', () => {
        const expectedAction = { windowName: 0, type: ACTION_TYPES.RESTORE };
        expect(restore()).to.deep.equal(expectedAction);
    });

    it('should create an action for close', () => {
        const expectedAction = { windowName: 0, type: ACTION_TYPES.CLOSE };
        expect(close()).to.deep.equal(expectedAction);
    });

    it('should create an action for resizing', () => {
        const expectedAction = { windowName: 0, type: ACTION_TYPES.RESIZING };
        expect(resizing()).to.deep.equal(expectedAction);
    });
});
