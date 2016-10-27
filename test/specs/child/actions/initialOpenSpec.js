import { expect } from 'chai';
import currentWindowServiceStub from '../../../helper/currentWindowServiceStub';
import { willBeInitialOpen, opened, __RewireAPI__ as rewiredActions } from '../../../../src/child/actions/initialOpen';
import { INITIAL_OPEN as ACTION_TYPES } from '../../../../src/shared/constants/actionTypes';

describe('child/actions/initialOpen', () => {
    before(() => {
        rewiredActions.__Rewire__('currentWindowService', currentWindowServiceStub);
    });

    after(() => {
        rewiredActions.__ResetDependency__('currentWindowService');
    });

    it('should create an action to indicate that a window will be the application\'s initial window', () => {
        const windowName = 'window0002';
        const expectedAction = {
            windowName,
            type: ACTION_TYPES.WILL_BE_INITIAL_OPEN
        };
        const actualAction = willBeInitialOpen(windowName);
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action to indicate that the application\'s initial window has been opened', () => {
        const windowName = 'window0002';
        const expectedAction = {
            windowName,
            type: ACTION_TYPES.OPENED
        };
        const actualAction = opened(windowName);
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });
});
