import { expect } from 'chai';
import reducers from '../../src/parent/reducer.js';
import ACTION_TYPES from '../../src/parent/actionTypes.js';

describe('parent/reducers', () => {
    it('should return the initial state', () => {
        const initialState = [];
        expect(reducers(undefined, {})).to.deep.equal(initialState);
    });

    describe('initialState', () => {
        it('should return the correct state when a child connects with the correct id', () => {
            const initialState = [{ id: 0, state: 'STORE' }];
            const action = { type: ACTION_TYPES.INITIALISE_STATE };
            expect(reducers(initialState, action)).to.deep.equal(initialState);
        });

        it('should return the correct state when a child connects with the incorrect id', () => {
            const initialState = [{ id: 1, state: 'STORE' }];
            const expectedState = [{ id: 0, state: 'STORE' }];
            const action = { type: ACTION_TYPES.INITIALISE_STATE };
            expect(reducers(initialState, action)).to.deep.equal(expectedState);
        });

        it('should return the correct state when multiple children connect with the correct ids', () => {
            const initialState = [{ id: 0, state: 'STORE' }, { id: 1, state: 'STORE' }];
            const action = { type: ACTION_TYPES.INITIALISE_STATE };
            expect(reducers(initialState, action)).to.deep.equal(initialState);
        });

        it('should return the correct state when multiple children connect with the incorrect ids', () => {
            const initialState = [{ id: 1, state: 'STORE' }, { id: 0, state: 'STORE' }];
            const expectedState = [{ id: 0, state: 'STORE' }, { id: 1, state: 'STORE' }];
            const action = { type: ACTION_TYPES.INITIALISE_STATE };
            expect(reducers(initialState, action)).to.deep.equal(expectedState);
        });

        it('should return the correct state when multiple children connect with the correct and incorrect ids', () => {
            const initialState = [{ id: 0, state: 'STORE' }, { id: 16, state: 'STORE' }];
            const expectedState = [{ id: 0, state: 'STORE' }, { id: 1, state: 'STORE' }];
            const action = { type: ACTION_TYPES.INITIALISE_STATE };
            expect(reducers(initialState, action)).to.deep.equal(expectedState);
        });
    });

    describe('childConnect', () => {
        it('should return the current state if an existing child reconnects', () => {
            const initialState = [{ id: 0, state: 'STORE' }];
            const action = {
                type: ACTION_TYPES.CHILD_CONNECT,
                id: 0,
                state: 'STORE'
            };
            expect(reducers(initialState, action)).to.deep.equal(initialState);
        });

        it('should return a new state if a new child connects', () => {
            const initialState = [{ id: 0, state: 'STORE' }];
            const expectedState = [{ id: 0, state: 'STORE' }, { id: 1, state: 'STORE' }];
            const action = {
                type: ACTION_TYPES.CHILD_CONNECT,
                id: 1,
                state: 'STORE'
            };
            expect(reducers(initialState, action)).to.deep.equal(expectedState);
        });
    });

    describe('childChange', () => {
        it('should return an updated state when a child updates and a single child is connected', () => {
            const initialState = [{ id: 0, state: 'STORE' }];
            const expectedState = [{ id: 0, state: 'UPDATED-STORE' }];
            const action = {
                type: ACTION_TYPES.CHILD_CHANGE,
                id: 0,
                state: 'UPDATED-STORE'
            };
            expect(reducers(initialState, action)).to.deep.equal(expectedState);
        });

        it('should return an updated state when a child updates and multipe children is connected', () => {
            const initialState = [{ id: 0, state: 'STORE' }];
            const expectedState = [{ id: 0, state: 'UPDATED-STORE' }];
            const action = {
                type: ACTION_TYPES.CHILD_CHANGE,
                id: 0,
                state: 'UPDATED-STORE'
            };
            expect(reducers(initialState, action)).to.deep.equal(expectedState);
        });
    });
});
