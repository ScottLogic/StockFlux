import { expect } from 'chai';
import { selectSearch,
         selectFavourites,
         __RewireAPI__ as rewiredActions } from '../../../../src/child/actions/sidebar';
import { SIDEBAR as ACTION_TYPES } from '../../../../src/shared/constants/actionTypes';

describe('child/actions/sidebar', () => {
    before(() => {
        rewiredActions.__Rewire__('currentWindowService', { getCurrentWindowName: () => 0 });
    });

    after(() => {
        rewiredActions.__ResetDependency__('currentWindowService');
    });

    it('should create an action to select search', () => {
        const expectedAction = { windowName: 0, type: ACTION_TYPES.SEARCH_CLICKED };
        const actualAction = selectSearch();
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action to select favourites', () => {
        const expectedAction = { windowName: 0, type: ACTION_TYPES.FAV_CLICKED };
        const actualAction = selectFavourites();
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });
});
