import { expect } from 'chai';
import sinon from 'sinon';
import reducers from '../../../../src/parent/reducers/reducers.prod';

describe('parent/reducers/reducers.prod', () => {
    it('should return the reducer', () => {
        const spy = sinon.spy((state, action) => Object.assign({}, state, { foo: action.foo }));
        const reducer = reducers(spy);
        const state = { foo: true };
        const action = { type: 'AN_ACTION', foo: false };

        expect(reducer(state, action)).to.deep.equal({ foo: false });
        expect(spy.calledOnce).to.be.true;
        expect(() => reducer(state, action)).not.to.throw(Error);
        expect(spy.calledTwice).to.be.true;
    });

    it('should not freeze the state passed to the reducer (for performance)', () => {
        const spy = sinon.spy((state, action) => Object.assign({}, state, { foo: action.foo }));
        const reducer = reducers(spy);
        const state = { foo: true };
        const action = { type: 'AN_ACTION', foo: false };

        reducer(state, action);

        expect(Object.isFrozen(spy.getCall(0).args[0])).to.be.false;
    });

    it('should not freeze the action passed to the reducer (for performance)', () => {
        const spy = sinon.spy((state, action) => Object.assign({}, state, { foo: action.foo }));
        const reducer = reducers(spy);
        const state = { foo: true };
        const action = { type: 'AN_ACTION', foo: false };

        reducer(state, action);

        expect(Object.isFrozen(spy.getCall(0).args[1])).to.be.false;
    });

    it('should not throw if the reducer mutates the state', () => {
        const reducer = reducers((state) => {
            state.foo = false; // eslint-disable-line no-param-reassign
            return state;
        });
        expect(() => reducer({ foo: true })).not.to.throw(Error);
    });

    it('should not throw if the reducer mutates the action', () => {
        const reducer = reducers((state, action) => {
            action.type = 'ANOTHER_ACTION'; // eslint-disable-line no-param-reassign
            return state;
        });
        expect(() => reducer({ foo: true }, { type: 'AN_ACTION' })).not.to.throw(Error);
    });
});
