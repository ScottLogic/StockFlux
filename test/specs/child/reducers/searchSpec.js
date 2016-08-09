import { expect } from 'chai';
import search from '../../../../src/child/reducers/search.js';
import { SEARCH as ACTION_TYPES } from '../../../../src/shared/constants/actionTypes';

describe('child/reducers/search', () => {
    it('should return the initial state', () => {
        expect(search(undefined, {})).to.deep.equal({ term: '' });
    });

    it('should handle SEARCH_INPUT', () => {
        const action = {
            type: ACTION_TYPES.SEARCH_INPUT,
            term: 'A'
        };
        expect(search({ term: '' }, action)).to.deep.equal({ term: 'A' });
    });

    it('should handle SEARCH_STARTED', () => {
        const action = {
            type: ACTION_TYPES.SEARCH_STARTED,
            term: 'A'
        };
        expect(search({ term: '' }, action)).to.deep.equal({
            isSearching: true,
            term: 'A'
        });
    });

    it('should handle SEARCH_FINISHED', () => {
        const action = {
            type: ACTION_TYPES.SEARCH_FINISHED,
            term: 'AAPL',
            results: [{
                name: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume',
                code: 'AAPL'
            }]
        };

        expect(search({
            term: 'AAP',
            isSearching: true
        }, action)).to.deep.equal({
            term: 'AAP',
            isSearching: true
        });

        expect(search({
            term: 'AAPL',
            isSearching: true
        }, action)).to.deep.equal({
            isSearching: false,
            term: 'AAPL',
            results: [{
                name: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume',
                code: 'AAPL'
            }]
        });
    });

    it('should handle SEARCH_ERROR', () => {
        const action = { type: ACTION_TYPES.SEARCH_ERROR };
        expect(search({
            term: 'A',
            isSearching: true
        }, action)).to.deep.equal({
            term: 'A',
            isSearching: false,
            hasErrors: true
        });
    });

    it('should handle CLEAR_SEARCH', () => {
        const action = { type: ACTION_TYPES.CLEAR_SEARCH };
        expect(search({
            term: 'A',
            isSearching: true
        }, action)).to.deep.equal({ term: '' });
    });

    it('should return the previous state for any unknown action', () => {
        const action = { type: 'UNKNOWN_ACTION' };
        const term = 'AAPL';
        const isSearching = true;
        expect(search({
            term,
            isSearching
        }, action)).to.deep.equal({
            term,
            isSearching
        });
    });
});
