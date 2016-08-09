import { expect } from 'chai';
import sidebar from '../../../../src/child/reducers/sidebar.js';
import { SIDEBAR as ACTION_TYPES } from '../../../../src/shared/constants/actionTypes';

describe('child/reducers/sidebar', () => {
    it('should return the initial state', () => {
        expect(sidebar(undefined, {})).to.deep.equal({ showSearch: true });
    });

    it('should handle FAV_CLICKED', () => {
        const action = { type: ACTION_TYPES.FAV_CLICKED };
        expect(sidebar({}, action)).to.deep.equal({ showFavourites: true });
        expect(sidebar({ showFavourites: true }, action)).to.deep.equal({ showFavourites: true });
        expect(sidebar({ showSearch: true }, action)).to.deep.equal({ showFavourites: true });
    });

    it('should handle SEARCH_CLICKED', () => {
        const action = { type: ACTION_TYPES.SEARCH_CLICKED };
        expect(sidebar({ showFavourites: true }, action)).to.deep.equal({ showSearch: true });
        expect(sidebar({ showSearch: true }, action)).to.deep.equal({ showSearch: true });
    });

    it('should return the previous state for any unknown action', () => {
        const action = { type: 'UNKNOWN_ACTION' };
        expect(sidebar({ showFavourites: true }, action)).to.deep.equal({ showFavourites: true });
        expect(sidebar({ showSearch: true }, action)).to.deep.equal({ showSearch: true });
    });
});
