import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import currentWindowServiceStub from '../../../helper/currentWindowServiceStub';
import { minimise,
         compact,
         expand,
         fullView,
         maximize,
         restore,
         resizing,
         open,
         resizeToCompact,
         resizeToDefault,
         __RewireAPI__ as rewiredActions } from '../../../../src/child/actions/window';
import { WINDOW as ACTION_TYPES } from '../../../../src/shared/constants/actionTypes';

describe('child/actions/window', () => {
    beforeEach(() => {
        rewiredActions.__Rewire__('currentWindowService', currentWindowServiceStub);
    });

    afterEach(() => {
        rewiredActions.__ResetDependency__('currentWindowService');
    });

    it('should create an action for minimise', () => {
        const expectedAction = { windowName: 'window0002', type: ACTION_TYPES.MINIMIZE };
        const actualAction = minimise();
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action for compact', () => {
        const expectedAction = {
            windowName: 'window0002',
            type: ACTION_TYPES.TOGGLE_COMPACT,
            state: true
        };
        const actualAction = compact();
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action for expand', () => {
        const expectedAction = {
            windowName: 'window0002',
            type: ACTION_TYPES.TOGGLE_COMPACT,
            state: false
        };
        const actualAction = expand();
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action for full view', () => {
        const expectedAction = { windowName: 'window0002', type: ACTION_TYPES.STATE_FULL_VIEW };
        const actualAction = fullView();
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action for maximize', () => {
        const expectedAction = { windowName: 'window0002', type: ACTION_TYPES.MAXIMIZE };
        const actualAction = maximize();
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action for restore', () => {
        const expectedAction = { windowName: 'window0002', type: ACTION_TYPES.RESTORE };
        const actualAction = restore();
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action for resizing', () => {
        const expectedAction = { windowName: 'window0002', type: ACTION_TYPES.RESIZING };
        const actualAction = resizing();
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action for open', () => {
        const expectedAction = { windowName: 'window0002', type: ACTION_TYPES.OPEN };
        const actualAction = open();
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    describe('resizeTo', () => {
        let store;

        beforeEach(() => {
            const mockStore = configureMockStore([thunk]);
            store = mockStore();
        });

        afterEach(() => {
            store = null;
        });

        describe('compact', () => {
            it('should return a promise', () => {
                expect(store.dispatch(resizeToCompact())).to.be.a('promise');
            });

            it('should resolve when both updating the options and resizing succeed', () => {
                const expectedActions = [
                    { windowName: 'window0002', type: ACTION_TYPES.UPDATING_OPTIONS },
                    { windowName: 'window0002', type: ACTION_TYPES.UPDATING_OPTIONS_SUCCESS },
                    { windowName: 'window0002', type: ACTION_TYPES.RESIZING },
                    { windowName: 'window0002', type: ACTION_TYPES.TOGGLE_COMPACT, state: true }
                ];

                currentWindowServiceStub.updateOptions.callsArg(1); // call success callback
                currentWindowServiceStub.resizeTo.callsArg(3);      // call success callback

                return store.dispatch(resizeToCompact())
                    .then(() => {
                        expect(store.getActions()[0].type).to.be.a('string');
                        expect(store.getActions()[1].type).to.be.a('string');
                        expect(store.getActions()[2].type).to.be.a('string');
                        expect(store.getActions()[3].type).to.be.a('string');
                        expect(store.getActions()).to.deep.equal(expectedActions);
                    });
            });

            it('should reject when updating the options fails and resizing succeeds', () => {
                const expectedActions = [
                    { windowName: 'window0002', type: ACTION_TYPES.UPDATING_OPTIONS },
                    { windowName: 'window0002', type: ACTION_TYPES.UPDATING_OPTIONS_ERROR },
                    { windowName: 'window0002', type: ACTION_TYPES.RESIZING },
                    { windowName: 'window0002', type: ACTION_TYPES.TOGGLE_COMPACT, state: true }
                ];

                currentWindowServiceStub.updateOptions.callsArg(2); // call error callback
                currentWindowServiceStub.resizeTo.callsArg(3);      // call success callback

                return store.dispatch(resizeToCompact())
                    .catch(() => {
                        expect(store.getActions()[0].type).to.be.a('string');
                        expect(store.getActions()[1].type).to.be.a('string');
                        expect(store.getActions()[2].type).to.be.a('string');
                        expect(store.getActions()[3].type).to.be.a('string');
                        expect(store.getActions()).to.deep.equal(expectedActions);
                    });
            });

            it('should reject when updating the options succeeds and resizing fails', () => {
                const expectedActions = [
                    { windowName: 'window0002', type: ACTION_TYPES.UPDATING_OPTIONS },
                    { windowName: 'window0002', type: ACTION_TYPES.UPDATING_OPTIONS_SUCCESS },
                    { windowName: 'window0002', type: ACTION_TYPES.RESIZING },
                    { windowName: 'window0002', type: ACTION_TYPES.RESIZE_ERROR }
                ];

                currentWindowServiceStub.updateOptions.callsArg(1); // call success callback
                currentWindowServiceStub.resizeTo.callsArg(4);      // call error callback

                return store.dispatch(resizeToCompact())
                    .catch(() => {
                        expect(store.getActions()[0].type).to.be.a('string');
                        expect(store.getActions()[1].type).to.be.a('string');
                        expect(store.getActions()[2].type).to.be.a('string');
                        expect(store.getActions()[3].type).to.be.a('string');
                        expect(store.getActions()).to.deep.equal(expectedActions);
                    });
            });

            it('should reject when both updating the options and resizing fail', () => {
                const expectedActions = [
                    { windowName: 'window0002', type: ACTION_TYPES.UPDATING_OPTIONS },
                    { windowName: 'window0002', type: ACTION_TYPES.UPDATING_OPTIONS_ERROR },
                    { windowName: 'window0002', type: ACTION_TYPES.RESIZING },
                    { windowName: 'window0002', type: ACTION_TYPES.RESIZE_ERROR }
                ];

                currentWindowServiceStub.updateOptions.callsArg(2); // call error callback
                currentWindowServiceStub.resizeTo.callsArg(4);      // call error callback

                return store.dispatch(resizeToCompact())
                    .catch(() => {
                        expect(store.getActions()[0].type).to.be.a('string');
                        expect(store.getActions()[1].type).to.be.a('string');
                        expect(store.getActions()[2].type).to.be.a('string');
                        expect(store.getActions()[3].type).to.be.a('string');
                        expect(store.getActions()).to.deep.equal(expectedActions);
                    });
            });
        });

        describe('default', () => {
            it('should return a promise', () => {
                expect(store.dispatch(resizeToDefault())).to.be.a('promise');
            });

            it('should resolve when both updating the options and resizing succeed', () => {
                const expectedActions = [
                    { windowName: 'window0002', type: ACTION_TYPES.UPDATING_OPTIONS },
                    { windowName: 'window0002', type: ACTION_TYPES.UPDATING_OPTIONS_SUCCESS },
                    { windowName: 'window0002', type: ACTION_TYPES.RESIZING },
                    { windowName: 'window0002', type: ACTION_TYPES.TOGGLE_COMPACT, state: false }
                ];

                currentWindowServiceStub.updateOptions.callsArg(1); // call success callback
                currentWindowServiceStub.resizeTo.callsArg(3);      // call success callback

                return store.dispatch(resizeToDefault())
                    .then(() => {
                        expect(store.getActions()[0].type).to.be.a('string');
                        expect(store.getActions()[1].type).to.be.a('string');
                        expect(store.getActions()[2].type).to.be.a('string');
                        expect(store.getActions()[3].type).to.be.a('string');
                        expect(store.getActions()).to.deep.equal(expectedActions);
                    });
            });

            it('should reject when updating the options fails and resizing succeeds', () => {
                const expectedActions = [
                    { windowName: 'window0002', type: ACTION_TYPES.UPDATING_OPTIONS },
                    { windowName: 'window0002', type: ACTION_TYPES.UPDATING_OPTIONS_ERROR },
                    { windowName: 'window0002', type: ACTION_TYPES.RESIZING },
                    { windowName: 'window0002', type: ACTION_TYPES.TOGGLE_COMPACT, state: false }
                ];

                currentWindowServiceStub.updateOptions.callsArg(2); // call error callback
                currentWindowServiceStub.resizeTo.callsArg(3);      // call success callback

                return store.dispatch(resizeToDefault())
                    .catch(() => {
                        expect(store.getActions()[0].type).to.be.a('string');
                        expect(store.getActions()[1].type).to.be.a('string');
                        expect(store.getActions()[2].type).to.be.a('string');
                        expect(store.getActions()[3].type).to.be.a('string');
                        expect(store.getActions()).to.deep.equal(expectedActions);
                    });
            });

            it('should reject when updating the options succeeds and resizing fails', () => {
                const expectedActions = [
                    { windowName: 'window0002', type: ACTION_TYPES.UPDATING_OPTIONS },
                    { windowName: 'window0002', type: ACTION_TYPES.UPDATING_OPTIONS_SUCCESS },
                    { windowName: 'window0002', type: ACTION_TYPES.RESIZING },
                    { windowName: 'window0002', type: ACTION_TYPES.RESIZE_ERROR }
                ];

                currentWindowServiceStub.updateOptions.callsArg(1); // call success callback
                currentWindowServiceStub.resizeTo.callsArg(4);      // call error callback

                return store.dispatch(resizeToDefault())
                    .catch(() => {
                        expect(store.getActions()[0].type).to.be.a('string');
                        expect(store.getActions()[1].type).to.be.a('string');
                        expect(store.getActions()[2].type).to.be.a('string');
                        expect(store.getActions()[3].type).to.be.a('string');
                        expect(store.getActions()).to.deep.equal(expectedActions);
                    });
            });

            it('should reject when both updating the options and resizing fail', () => {
                const expectedActions = [
                    { windowName: 'window0002', type: ACTION_TYPES.UPDATING_OPTIONS },
                    { windowName: 'window0002', type: ACTION_TYPES.UPDATING_OPTIONS_ERROR },
                    { windowName: 'window0002', type: ACTION_TYPES.RESIZING },
                    { windowName: 'window0002', type: ACTION_TYPES.RESIZE_ERROR }
                ];

                currentWindowServiceStub.updateOptions.callsArg(2); // call error callback
                currentWindowServiceStub.resizeTo.callsArg(4);      // call error callback

                return store.dispatch(resizeToDefault())
                    .catch(() => {
                        expect(store.getActions()[0].type).to.be.a('string');
                        expect(store.getActions()[1].type).to.be.a('string');
                        expect(store.getActions()[2].type).to.be.a('string');
                        expect(store.getActions()[3].type).to.be.a('string');
                        expect(store.getActions()).to.deep.equal(expectedActions);
                    });
            });
        });
    });
});
