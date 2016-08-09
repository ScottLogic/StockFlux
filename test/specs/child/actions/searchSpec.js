import { expect } from 'chai';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { searchInput,
         search,
         __RewireAPI__ as rewiredActions } from '../../../../src/child/actions/search';
import { SEARCH as ACTION_TYPES } from '../../../../src/shared/constants/actionTypes';
import { apiKey } from '../../../../src/child/services/QuandlService';
import createFakeQuandlServer from '../../../helper/fakeQuandlServer';

describe('child/actions/search', () => {
    before(() => {
        rewiredActions.__Rewire__('currentWindowService', { getCurrentWindowName: () => 0 });
    });

    after(() => {
        rewiredActions.__ResetDependency__('currentWindowService');
    });

    it('should create an action to input a stock to search for', () => {
        const term = 'GOOG';
        const expectedAction = {
            windowName: 0,
            type: ACTION_TYPES.SEARCH_INPUT,
            term
        };
        const actualAction = searchInput(term);
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
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
                    expect(store.getActions()[0].type).to.be.a('string');
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
                    expect(store.getActions()[0].type).to.be.a('string');
                    expect(store.getActions()[1].type).to.be.a('string');
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
                    expect(store.getActions()[0].type).to.be.a('string');
                    expect(store.getActions()[1].type).to.be.a('string');
                    expect(store.getActions()).to.deep.equal(expectedActions);
                });
        });
    });
});
