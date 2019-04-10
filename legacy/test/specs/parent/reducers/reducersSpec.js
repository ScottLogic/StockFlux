import { expect } from 'chai';
import reducers from '../../../../src/parent/reducers/reducers';

describe('parent/reducers/reducers', () => {
    it('should return the initial state', () => {
        expect(reducers(undefined, { type: 'AN_ACTION' })).to.deep.equal({
            childWindows: {},
            closedWindows: {},
            dragOut: {}
        });
    });
});
