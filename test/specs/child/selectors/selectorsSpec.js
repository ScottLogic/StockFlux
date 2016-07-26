import { expect } from 'chai';
import {
    appSelector,
    favouritesSelector,
    searchSelector,
    sidebarSelector,
    toolbarSelector,
    __RewireAPI__ as rewiredSelectors
} from '../../../../src/child/selectors/selectors';

describe('child/selectors/selectors', () => {

    const intitialState = {
        window0001: {},
        window0002: {
            favourites: {
                codes: ['AAPL', 'GOOG'],
                names: {
                    AAPL: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume',
                    GOOG: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
                }
            },
            search: {
                isSearching: false,
                term: 'AAPL',
                results: [{
                    name: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume',
                    code: 'AAPL'
                }]
            },
            selection: {
                code: 'AAPL',
                name: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume'
            },
            sidebar: {
                showFavourites: true
            },
            windowState: {
                isCompact: false,
                isMaximised: false,
                isResizing: false
            }
        },
        window0003: {}
    };

    before(() => {
        rewiredSelectors.__Rewire__('currentWindowService', { getCurrentWindowName: () => 'window0002' });
    });

    after(() => {
        rewiredSelectors.__ResetDependency__('currentWindowService');
    });

    describe('appSelector', () => {
        it('should return the correct result', () => {
            const expectedResult = {
                name: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume',
                code: 'AAPL',
                windowState: {
                    isCompact: false,
                    isMaximised: false,
                    isResizing: false
                }
            };
            expect(appSelector(intitialState)).to.deep.equal(expectedResult);
        });
    });

    describe('favouritesSelector', () => {
        it('should return the correct result', () => {
            const expectedResult = {
                favourites: {
                    codes: ['AAPL', 'GOOG'],
                    names: {
                        AAPL: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume',
                        GOOG: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
                    }
                },
                selection: {
                    code: 'AAPL',
                    name: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume'
                },
                windowState: {
                    isCompact: false,
                    isMaximised: false,
                    isResizing: false
                },
                isStarting: false,
                hasErrors: false
            };
            expect(favouritesSelector(intitialState)).to.deep.equal(expectedResult);
        });
    });

    describe('searchSelector', () => {
        it('should return the correct result', () => {
            const expectedResult = {
                favourites: {
                    codes: ['AAPL', 'GOOG'],
                    names: {
                        AAPL: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume',
                        GOOG: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
                    }
                },
                isSearching: false,
                hasErrors: undefined,
                results: [{
                    name: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume',
                    code: 'AAPL'
                }],
                term: 'AAPL',
                selection: {
                    code: 'AAPL',
                    name: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume'
                }
            };
            expect(searchSelector(intitialState)).to.deep.equal(expectedResult);
        });
    });

    describe('sidebarSelector', () => {
        it('should return the correct result', () => {
            const expectedResult = {
                sidebar: {
                    showFavourites: true
                },
                selection: {
                    code: 'AAPL',
                    name: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume'
                },
                favourites: {
                    codes: ['AAPL', 'GOOG'],
                    names: {
                        AAPL: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume',
                        GOOG: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
                    }
                },
                windowState: {
                    isCompact: false,
                    isMaximised: false,
                    isResizing: false
                }
            };
            expect(sidebarSelector(intitialState)).to.deep.equal(expectedResult);
        });
    });

    describe('toolbarSelector', () => {
        it('should return the correct result', () => {
            const expectedResult = {
                windowState: {
                    isCompact: false,
                    isMaximised: false,
                    isResizing: false
                }
            };
            expect(toolbarSelector(intitialState)).to.deep.equal(expectedResult);
        });
    });
});
