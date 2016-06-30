import { expect } from 'chai';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { searchInput, selectStock, unselectStock, insertFavouriteAt,
         toggleFavourite, selectSearch, selectFavourites, quandlResponse,
         search, __RewireAPI__ as rewiredActions } from '../../../../src/child/actions/sidebar';
import { SIDEBAR as ACTION_TYPES } from '../../../../src/child/constants/actionTypes.js';
import { apiKey } from '../../../../src/child/services/QuandlService';
import createFakeQuandlServer from '../../../helper/fakeQuandlServer';

describe('child/actions/sidebar', () => {

    before(() => {
        const windowNameFunc = () => ({ name: 0 });
        rewiredActions.__Rewire__('currentWindowService', { getCurrentWindow: windowNameFunc });
    });

    it('should create an action to input a stock to search for', () => {
        const term = 'GOOG';
        const expectedAction = {
            windowName: 0,
            type: ACTION_TYPES.SEARCH_INPUT,
            term
        };
        expect(searchInput(term)).to.deep.equal(expectedAction);
    });

    it('should create an action to select a stock', () => {
        const code = 'GOOG';
        const name = 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume';
        const expectedAction = {
            windowName: 0,
            type: ACTION_TYPES.SELECTION,
            code,
            name
        };
        expect(selectStock(code, name)).to.deep.equal(expectedAction);
    });

    it('should create an action to unselect a stock', () => {
        const expectedAction = { windowName: 0, type: ACTION_TYPES.UNSELECT };
        expect(unselectStock()).to.deep.equal(expectedAction);
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
        expect(insertFavouriteAt(index, code)).to.deep.equal(expectedAction);
    });

    it('should create an action to toggle a favourite', () => {
        const code = 'GOOG';
        const expectedAction = {
            windowName: 0,
            type: ACTION_TYPES.TOGGLE_FAVOURITE,
            code
        };
        expect(toggleFavourite(code)).to.deep.equal(expectedAction);
    });

    it('should create an action to select search', () => {
        const expectedAction = { windowName: 0, type: ACTION_TYPES.SEARCH_CLICKED };
        expect(selectSearch()).to.deep.equal(expectedAction);
    });

    it('should create an action to select favourites', () => {
        const expectedAction = { windowName: 0, type: ACTION_TYPES.FAV_CLICKED };
        expect(selectFavourites()).to.deep.equal(expectedAction);
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
        expect(quandlResponse(code, name)).to.deep.equal(expectedAction);
    });

    describe('search', () => {
        let mockStore;
        let clock;
        before(() => {
            mockStore = configureMockStore([thunk]);
            createFakeQuandlServer(apiKey());
            clock = sinon.useFakeTimers(new Date(2016, 5, 1).getTime());
        });

        after(() => {
            nock.cleanAll();
            clock.restore();
        });

        it('should create an action to clear a search', () => {
            const term = '';
            const expectedActions = [{ windowName: 0, type: ACTION_TYPES.CLEAR_SEARCH }];

            const store = mockStore();

            return store.dispatch(search(term))
                .then(() => {
                    expect(store.getActions()).to.deep.equal(expectedActions);
                });
        });

        it('should create an action to finish a successful search', () => {
            const term = 'GOOG';
            const result1 = {
                code: 'GOOG',
                name: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
            };
            const result2 = {
                code: 'GOOGL',
                name: 'Alphabet Inc (GOOGL) Prices, Dividends, Splits and Trading Volume'
            };
            const results = [result1, result2];
            const expectedActions = [
                { windowName: 0, type: ACTION_TYPES.SEARCH_STARTED, term },
                { windowName: 0, type: ACTION_TYPES.SEARCH_FINISHED, term, results }
            ];

            const store = mockStore();

            return store.dispatch(search(term))
                .then(() => {
                    expect(store.getActions()).to.deep.equal(expectedActions);
                });
        });

        it('should create an action to error a search', () => {
            const term = 'BAD';
            const expectedActions = [
                { windowName: 0, type: ACTION_TYPES.SEARCH_STARTED, term },
                { windowName: 0, type: ACTION_TYPES.SEARCH_ERROR }
            ];

            const store = mockStore();

            return store.dispatch(search(term))
                .then(() => {
                    expect(store.getActions()).to.deep.equal(expectedActions);
                });
        });
    });
});
