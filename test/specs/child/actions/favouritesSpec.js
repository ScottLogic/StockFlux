import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import currentWindowServiceStub from '../../../helper/currentWindowServiceStub';
import { insertFavouriteAt,
         toggleFavourite,
         quandlResponse,
         __RewireAPI__ as rewiredActions } from '../../../../src/child/actions/favourites';
import { FAVOURITES as FAVOURITES_ACTION_TYPES, SELECTION as SELECTION_ACTION_TYPES } from '../../../../src/shared/constants/actionTypes';

describe('child/actions/favourites', () => {
    before(() => {
        rewiredActions.__Rewire__('currentWindowService', currentWindowServiceStub);
    });

    after(() => {
        rewiredActions.__ResetDependency__('currentWindowService');
    });

    it('should create an action to insert a favourite at a given index', () => {
        const index = 1;
        const code = 'GOOG';
        const expectedAction = {
            windowName: 'window0002',
            type: FAVOURITES_ACTION_TYPES.INSERT_FAVOURITE_AT,
            index,
            code
        };
        const actualAction = insertFavouriteAt(index, code);
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action for Quandl response', () => {
        const code = 'GOOG';
        const name = 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume';
        const expectedAction = {
            windowName: 'window0002',
            type: FAVOURITES_ACTION_TYPES.QUANDL_RESPONSE,
            code,
            name
        };
        const actualAction = quandlResponse(code, name);
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    describe('toggleFavourite', () => {
        let store;
        let createMockStore;

        beforeEach(() => {
            createMockStore = configureMockStore([thunk]);
        });

        afterEach(() => {
            createMockStore = null;
            store = null;
        });

        describe('determining window name', () => {
            it('should default the window name to the current window name if it is not specified', () => {
                store = createMockStore({
                    childWindows: {
                        window0002: {
                            favourites: {
                                codes: [],
                                names: {}
                            },
                            selection: {}
                        }
                    }
                });

                const code = 'AAPL';
                const windowName = 'window0002';

                const expectedActions = [
                    {
                        windowName,
                        code,
                        type: FAVOURITES_ACTION_TYPES.TOGGLE_FAVOURITE,
                        analyticsEvent: {
                            category: 'Toggle Favourite',
                            action: code
                        }
                    }
                ];

                store.dispatch(toggleFavourite(code));

                expect(store.getActions()[0].type).to.be.a('string');
                expect(store.getActions()).to.deep.equal(expectedActions);
            });

            it('should allow the window name to be specified', () => {
                store = createMockStore({
                    childWindows: {
                        window0003: {
                            favourites: {
                                codes: [],
                                names: {}
                            },
                            selection: {}
                        }
                    }
                });

                const code = 'AAPL';
                const windowName = 'window0003';

                const expectedActions = [
                    {
                        windowName,
                        code,
                        type: FAVOURITES_ACTION_TYPES.TOGGLE_FAVOURITE,
                        analyticsEvent: {
                            category: 'Toggle Favourite',
                            action: code
                        }
                    }
                ];

                store.dispatch(toggleFavourite(code, windowName));

                expect(store.getActions()[0].type).to.be.a('string');
                expect(store.getActions()).to.deep.equal(expectedActions);
            });
        });

        describe('toggling a favourite', () => {
            it('should create an action to toggle a stock if it is not the current selection and is not a favourite', () => {
                store = createMockStore({
                    childWindows: {
                        window0002: {
                            favourites: {
                                codes: [],
                                names: {}
                            },
                            selection: {}
                        }
                    }
                });

                const code = 'AAPL';
                const windowName = 'window0002';

                const expectedActions = [
                    {
                        windowName,
                        code,
                        type: FAVOURITES_ACTION_TYPES.TOGGLE_FAVOURITE,
                        analyticsEvent: {
                            category: 'Toggle Favourite',
                            action: code
                        }
                    }
                ];

                store.dispatch(toggleFavourite(code, windowName));

                expect(store.getActions()[0].type).to.be.a('string');
                expect(store.getActions()).to.deep.equal(expectedActions);
            });

            it('should create an action to toggle a stock if it is not the current selection but is a favourite', () => {
                store = createMockStore({
                    childWindows: {
                        window0002: {
                            favourites: {
                                codes: ['AAPL', 'GOOG'],
                                names: {
                                    AAPL: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume',
                                    GOOG: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
                                }
                            },
                            selection: {
                                code: 'GOOG',
                                name: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
                            }
                        }
                    }
                });

                const code = 'AAPL';
                const windowName = 'window0002';

                const expectedActions = [
                    {
                        windowName,
                        code,
                        type: FAVOURITES_ACTION_TYPES.TOGGLE_FAVOURITE,
                        analyticsEvent: {
                            category: 'Toggle Favourite',
                            action: code
                        }
                    }
                ];

                store.dispatch(toggleFavourite(code, windowName));

                expect(store.getActions()[0].type).to.be.a('string');
                expect(store.getActions()).to.deep.equal(expectedActions);
            });

            it('should create an action to toggle a stock if it is the current selection but is not a favourite', () => {
                store = createMockStore({
                    childWindows: {
                        window0002: {
                            favourites: {
                                codes: [],
                                names: {}
                            },
                            selection: {
                                code: 'GOOG',
                                name: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
                            }
                        }
                    }
                });

                const code = 'GOOG';
                const windowName = 'window0002';

                const expectedActions = [
                    {
                        windowName,
                        code,
                        type: FAVOURITES_ACTION_TYPES.TOGGLE_FAVOURITE,
                        analyticsEvent: {
                            category: 'Toggle Favourite',
                            action: code
                        }
                    }
                ];

                store.dispatch(toggleFavourite(code, windowName));

                expect(store.getActions()[0].type).to.be.a('string');
                expect(store.getActions()).to.deep.equal(expectedActions);
            });
        });

        describe('toggling a favourite and unselecting a stock', () => {
            it('should create an action to toggle the selected stock and unselect the stock if it is the only favourited stock', () => {
                store = createMockStore({
                    childWindows: {
                        window0002: {
                            favourites: {
                                codes: ['GOOG'],
                                names: { GOOG: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume' }
                            },
                            selection: {
                                code: 'GOOG',
                                name: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
                            }
                        }
                    }
                });

                const code = 'GOOG';
                const windowName = 'window0002';

                const expectedActions = [
                    {
                        windowName,
                        code,
                        type: FAVOURITES_ACTION_TYPES.TOGGLE_FAVOURITE,
                        analyticsEvent: {
                            category: 'Toggle Favourite',
                            action: code
                        }
                    },
                    {
                        windowName,
                        type: SELECTION_ACTION_TYPES.UNSELECT
                    }
                ];

                store.dispatch(toggleFavourite(code, windowName));

                expect(store.getActions()[0].type).to.be.a('string');
                expect(store.getActions()[1].type).to.be.a('string');
                expect(store.getActions()).to.deep.equal(expectedActions);
            });
        });

        describe('toggling a favourite and selecting a new stock', () => {
            it('should create an action to toggle the selected stock and select the first stock in the favourites list, if there is one other favourite', () => {
                store = createMockStore({
                    childWindows: {
                        window0002: {
                            favourites: {
                                codes: ['AAPL', 'GOOG'],
                                names: {
                                    AAPL: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume',
                                    GOOG: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
                                }
                            },
                            selection: {
                                code: 'GOOG',
                                name: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
                            }
                        }
                    }
                });

                const favouriteToToggleCode = 'GOOG';
                const favouriteToSelectCode = 'AAPL';
                const favouriteToSelectName = 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume';
                const windowName = 'window0002';

                const expectedActions = [
                    {
                        windowName,
                        code: favouriteToToggleCode,
                        type: FAVOURITES_ACTION_TYPES.TOGGLE_FAVOURITE,
                        analyticsEvent: {
                            category: 'Toggle Favourite',
                            action: favouriteToToggleCode
                        }
                    },
                    {
                        windowName,
                        code: favouriteToSelectCode,
                        name: favouriteToSelectName,
                        type: SELECTION_ACTION_TYPES.SELECTION,
                        analyticsEvent: {
                            category: 'Select stock',
                            action: favouriteToSelectCode
                        }
                    }
                ];

                store.dispatch(toggleFavourite(favouriteToToggleCode, windowName));

                expect(store.getActions()[0].type).to.be.a('string');
                expect(store.getActions()[1].type).to.be.a('string');
                expect(store.getActions()).to.deep.equal(expectedActions);
            });

            it('should create an action to toggle the selected stock and select the first stock in the favourites list, if there are other favourites', () => {
                store = createMockStore({
                    childWindows: {
                        window0002: {
                            favourites: {
                                codes: ['AAPL', 'ABCD', 'GOOG'],
                                names: {
                                    AAPL: 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume',
                                    ABCD: 'Another stock',
                                    GOOG: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
                                }
                            },
                            selection: {
                                code: 'GOOG',
                                name: 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume'
                            }
                        }
                    }
                });

                const favouriteToToggleCode = 'GOOG';
                const favouriteToSelectCode = 'AAPL';
                const favouriteToSelectName = 'Apple Inc (AAPL) Prices, Dividends, Splits and Trading Volume';
                const windowName = 'window0002';

                const expectedActions = [
                    {
                        windowName,
                        code: favouriteToToggleCode,
                        type: FAVOURITES_ACTION_TYPES.TOGGLE_FAVOURITE,
                        analyticsEvent: {
                            category: 'Toggle Favourite',
                            action: favouriteToToggleCode
                        }
                    },
                    {
                        windowName,
                        code: favouriteToSelectCode,
                        name: favouriteToSelectName,
                        type: SELECTION_ACTION_TYPES.SELECTION,
                        analyticsEvent: {
                            category: 'Select stock',
                            action: favouriteToSelectCode
                        }
                    }
                ];

                store.dispatch(toggleFavourite(favouriteToToggleCode, windowName));

                expect(store.getActions()[0].type).to.be.a('string');
                expect(store.getActions()[1].type).to.be.a('string');
                expect(store.getActions()).to.deep.equal(expectedActions);
            });
        });
    });
});
