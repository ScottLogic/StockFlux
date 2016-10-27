import { expect } from 'chai';
import currentWindowServiceStub from '../../../helper/currentWindowServiceStub';
import {
    appSelector,
    favouritesSelector,
    searchSelector,
    sidebarSelector,
    toolbarSelector,
    closedWindowsSelector,
    openWindowNamesSelector,
    initialOpenSelector,
    __RewireAPI__ as rewiredSelectors
} from '../../../../src/child/selectors/selectors';

describe('child/selectors/selectors', () => {

    const intitialState = {
        childWindows: {
            window0001: {},
            window0002: {
                favourites: {
                    codes: ['AAPL', 'GOOG'],
                    names: {
                        AAPL: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume',
                        GOOG: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
                    }
                },
                initialOpen: false,
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
        },
        closedWindows: {
            window0004: {}
        }
    };

    before(() => {
        rewiredSelectors.__Rewire__('currentWindowService', currentWindowServiceStub);
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

    describe('initialOpenSelector', () => {
        it('should return the correct result', () => {
            const expectedResult = false;
            expect(initialOpenSelector(intitialState)).to.equal(expectedResult);
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
                },
                closedWindowsCount: 1
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

    describe('closedWindowsSelector', () => {
        it('should return the correct result', () => {
            const expectedResult = {
                closedWindows: {
                    window0004: {}
                }
            };
            expect(closedWindowsSelector(intitialState)).to.deep.equal(expectedResult);
        });
    });

    describe('openWindowNamesSelector', () => {
        it('should return the correct result', () => {
            const expectedResult = ['window0001', 'window0002', 'window0003'];
            expect(openWindowNamesSelector(intitialState)).to.deep.equal(expectedResult);
        });
    });
});
