import { expect } from 'chai';
import { close } from '../../../../src/parent/actions/parent';
import { PARENT as ACTION_TYPES } from '../../../../src/shared/constants/actionTypes';

describe('parent/actions/parent', () => {
    it('should create an action for close', () => {
        const windowName = 0;
        const expectedAction = { windowName, type: ACTION_TYPES.CLOSE };
        const actualAction = close(windowName);
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });
});
