import { expect } from 'chai';
import createActionCreator from '../../../src/child/utils/createActionCreator';

describe('child/utils/createActionCreator', () => {
    it('should return a function', () => {
        const baseActionCreator = (type) => ({
            type
        });
        const actionCreator = createActionCreator(baseActionCreator);

        expect(actionCreator).to.be.a('function');
    });

    it('should add the current window name to the action if it isn\'t specified', () => {
        const baseActionCreator = (type) => ({
            type
        });
        const actionCreator = createActionCreator(baseActionCreator);

        const expectedAction = { type: 'AN_ACTION', windowName: 'window0002' };
        const actualAction = actionCreator('AN_ACTION');

        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should add the current window name to the action if it is undefined', () => {
        const baseActionCreator = (type, windowName = undefined) => ({
            type,
            windowName
        });
        const actionCreator = createActionCreator(baseActionCreator);

        const expectedAction = { type: 'AN_ACTION', windowName: 'window0002' };
        const actualAction = actionCreator('AN_ACTION');

        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should allow current window name to be overridden', () => {
        const baseActionCreator = (type, windowName = undefined) => ({
            type,
            windowName
        });
        const actionCreator = createActionCreator(baseActionCreator);

        const expectedAction = { type: 'AN_ACTION', windowName: 'window0001' };
        const actualAction = actionCreator('AN_ACTION', 'window0001');

        expect(actualAction).to.deep.equal(expectedAction);
    });
});
