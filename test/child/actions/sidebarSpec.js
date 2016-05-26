import { expect } from 'chai';
import * as actions from '../../../src/child/actions/sidebar';
import { SIDEBAR as ACTION_TYPES } from '../../../src/child/constants/actionTypes.js';

describe('child/actions/sidebar', () => {
    it('should create an action to input a stock to search for', () => {
        const term = 'GOOG';
        const expectedAction = {
            type: ACTION_TYPES.SEARCH_INPUT,
            term
        };
        expect(actions.searchInput(term)).to.deep.equal(expectedAction);
    });

    it('should create an action to select a stock', () => {
        const code = 'GOOG';
        const name = 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume';
        const expectedAction = {
            type: ACTION_TYPES.SELECTION,
            code,
            name
        };
        expect(actions.selectStock(code, name)).to.deep.equal(expectedAction);
    });

    it('should create an action to unselect a stock', () => {
        const expectedAction = { type: ACTION_TYPES.UNSELECT };
        expect(actions.unselectStock()).to.deep.equal(expectedAction);
    });

    it('should create an action to insert a favourite at a given index', () => {
        const index = 1;
        const code = 'GOOG';
        const expectedAction = {
            type: ACTION_TYPES.INSERT_FAVOURITE_AT,
            index,
            code
        };
        expect(actions.insertFavouriteAt(index, code)).to.deep.equal(expectedAction);
    });

    it('should create an action to toggle a favourite', () => {
        const code = 'GOOG';
        const expectedAction = {
            type: ACTION_TYPES.TOGGLE_FAVOURITE,
            code
        };
        expect(actions.toggleFavourite(code)).to.deep.equal(expectedAction);
    });

    it('should create an action to clear a search', () => {
        const expectedAction = { type: ACTION_TYPES.CLEAR_SEARCH };
        expect(actions.clearSearch()).to.deep.equal(expectedAction);
    });

    it('should create an action to finish a search', () => {
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
        const expectedAction = {
            type: ACTION_TYPES.SEARCH_FINISHED,
            term,
            results
        };
        expect(actions.searchFinished(term, results)).to.deep.equal(expectedAction);
    });

    it('should create an action to error a search', () => {
        const expectedAction = { type: ACTION_TYPES.SEARCH_ERROR };
        expect(actions.searchError()).to.deep.equal(expectedAction);
    });

    it('should create an action to select search', () => {
        const expectedAction = { type: ACTION_TYPES.SEARCH_CLICKED };
        expect(actions.selectSearch()).to.deep.equal(expectedAction);
    });

    it('should create an action to select favourites', () => {
        const expectedAction = { type: ACTION_TYPES.FAV_CLICKED };
        expect(actions.selectFavourites()).to.deep.equal(expectedAction);
    });

    it('should create an action for Quandl response', () => {
        const code = 'GOOG';
        const name = 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume';
        const expectedAction = {
            type: ACTION_TYPES.QUANDL_RESPONSE,
            code,
            name
        };
        expect(actions.quandlResponse(code, name)).to.deep.equal(expectedAction);
    });
});
