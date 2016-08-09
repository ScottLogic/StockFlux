import { expect } from 'chai';
import { insertFavouriteAt,
         toggleFavourite,
         quandlResponse,
         __RewireAPI__ as rewiredActions } from '../../../../src/child/actions/favourites';
import { FAVOURITES as ACTION_TYPES } from '../../../../src/shared/constants/actionTypes';

describe('child/actions/favourites', () => {
    before(() => {
        rewiredActions.__Rewire__('currentWindowService', { getCurrentWindowName: () => 0 });
    });

    after(() => {
        rewiredActions.__ResetDependency__('currentWindowService');
    });

    it('should create an action to insert a favourite at a given index', () => {
        const index = 1;
        const code = 'GOOG';
        const expectedAction = {
            windowName: 0,
            type: ACTION_TYPES.INSERT_FAVOURITE_AT,
            index,
            code
        };
        const actualAction = insertFavouriteAt(index, code);
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action to toggle a favourite', () => {
        const code = 'GOOG';
        const expectedAction = {
            windowName: 0,
            type: ACTION_TYPES.TOGGLE_FAVOURITE,
            code
        };
        const actualAction = toggleFavourite(code);
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action for Quandl response', () => {
        const code = 'GOOG';
        const name = 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume';
        const expectedAction = {
            windowName: 0,
            type: ACTION_TYPES.QUANDL_RESPONSE,
            code,
            name
        };
        const actualAction = quandlResponse(code, name);
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });
});
