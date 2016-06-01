import { expect } from 'chai';
import * as actions from '../../src/parent/actions.js';
import ACTION_TYPES from '../../src/parent/actionTypes.js';

describe('parent/actions', () => {
    it('should create an action to initialise the state', () => {
        const expectedAction = { type: ACTION_TYPES.INITIALISE_STATE };

        expect(actions.initialiseState()).to.deep.equal(expectedAction);
    });

    it('should create an action to create a child', () => {
        const expectedAction = {
            type: ACTION_TYPES.CHILD_CONNECT,
            id: 0
        };
        const id = 0;

        expect(actions.childConnect(id)).to.deep.equal(expectedAction);
    });

    it('should create an action to change a child state', () => {
        const expectedAction = {
            type: ACTION_TYPES.CHILD_CHANGE,
            state: {
                key1: 'test1',
                key2: 'test2'
            },
            id: 1
        };
        const id = 1;
        const state = {
            key1: 'test1',
            key2: 'test2'
        };

        expect(actions.childChange(state, id)).to.deep.equal(expectedAction);
    });

    it('should create an action to close a child', () => {
        const expectedAction = {
            type: ACTION_TYPES.CHILD_CLOSED,
            id: 2
        };
        const id = 2;

        expect(actions.childClosed(id)).to.deep.equal(expectedAction);
    });
});
