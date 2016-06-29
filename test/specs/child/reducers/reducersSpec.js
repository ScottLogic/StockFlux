import { expect } from 'chai';
import reducers from '../../../../src/child/reducers/reducers';

describe('child/reducers/reducers', () => {
    it('should return the initial state', () => {
        const initialState = {
            favourites: {
                codes: [],
                names: {}
            },
            search: {
                term: ''
            },
            selection: {},
            sidebar: {
                showSearch: true
            },
            windowState: {
                isCompact: false,
                isMaximised: false,
                isResizing: false
            },
        };
        expect(reducers(undefined, {})).to.deep.equal(initialState);
    });
});
