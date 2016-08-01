import { expect } from 'chai';
import { minimise,
         compact,
         expand,
         fullView,
         maximize,
         restore,
         resizing,
         __RewireAPI__ as rewiredActions } from '../../../../src/child/actions/window';
import { WINDOW as ACTION_TYPES } from '../../../../src/shared/constants/actionTypes';

describe('child/actions/window', () => {
    before(() => {
        rewiredActions.__Rewire__('currentWindowService', { getCurrentWindowName: () => 0 });
    });

    after(() => {
        rewiredActions.__ResetDependency__('currentWindowService');
    });

    it('should create an action for minimise', () => {
        const expectedAction = { windowName: 0, type: ACTION_TYPES.MINIMIZE };
        const actualAction = minimise();
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action for compact', () => {
        const expectedAction = {
            windowName: 0,
            type: ACTION_TYPES.TOGGLE_COMPACT,
            state: true
        };
        const actualAction = compact();
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action for expand', () => {
        const expectedAction = {
            windowName: 0,
            type: ACTION_TYPES.TOGGLE_COMPACT,
            state: false
        };
        const actualAction = expand();
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action for full view', () => {
        const expectedAction = { windowName: 0, type: ACTION_TYPES.STATE_FULL_VIEW };
        const actualAction = fullView();
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action for maximize', () => {
        const expectedAction = { windowName: 0, type: ACTION_TYPES.MAXIMIZE };
        const actualAction = maximize();
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action for restore', () => {
        const expectedAction = { windowName: 0, type: ACTION_TYPES.RESTORE };
        const actualAction = restore();
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action for resizing', () => {
        const expectedAction = { windowName: 0, type: ACTION_TYPES.RESIZING };
        const actualAction = resizing();
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });
});
