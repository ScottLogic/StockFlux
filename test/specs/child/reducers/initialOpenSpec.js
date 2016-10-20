import { expect } from 'chai';
import initalOpen from '../../../../src/child/reducers/initialOpen';
import { INITIAL_OPEN as ACTION_TYPES } from '../../../../src/shared/constants/actionTypes';

describe('child/reducers/initialOpen', () => {
    it('should return the initial state', () => {
        expect(initalOpen(undefined, {})).to.deep.equal(false);
    });

    it('should handle WILL_BE_INITIAL_OPEN', () => {
        const action = { type: ACTION_TYPES.WILL_BE_INITIAL_OPEN };
        expect(initalOpen(true, action)).to.deep.equal(true);
        expect(initalOpen(false, action)).to.deep.equal(true);
    });

    it('should handle OPENED', () => {
        const action = { type: ACTION_TYPES.OPENED };
        expect(initalOpen(true, action)).to.deep.equal(false);
        expect(initalOpen(false, action)).to.deep.equal(false);
    });

    it('should return the previous state for any unknown action', () => {
        const action = { type: 'UNKNOWN_ACTION' };
        expect(initalOpen(false, action)).to.deep.equal(false);
        expect(initalOpen(true, action)).to.deep.equal(true);
    });
});
