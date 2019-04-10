import { expect } from 'chai';
import sinon from 'sinon';
import fakeOpenFin from '../../../helper/fakeOpenFin';
import { toggleFavouriteInWindow } from '../../../../src/child/actions/favourites';
import { willBeInitialOpen } from '../../../../src/child/actions/initialOpen';
import ParentService from '../../../../src/parent/services/ParentService';
import ConfigService from '../../../../src/shared/ConfigService';
import { PARENT as ACTION_TYPES } from '../../../../src/shared/constants/actionTypes';

describe('parent/services/ParentService', () => {
    const windowName = 'windowName';
    const uuid = 'uuid';
    const noop = () => null;

    let clock;
    let parentService;
    let store;
    let childWindows;

    fakeOpenFin({ environment: { name: windowName, uuid } });

    beforeEach(() => {
        childWindows = {};
        store = { getState: sinon.spy(() => ({ childWindows, dragOut: {} })), dispatch: sinon.spy() };
        parentService = new ParentService(store);
        clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        clock.restore();
    });

    it('returns child window count', () => {
        expect(parentService.getChildWindowCount()).to.equal(0);
        childWindows['child-one'] = {};
        childWindows['child-two'] = {};
        expect(parentService.getChildWindowCount()).to.equal(2);
    });

    it('onCloseRequested triggers force close on the current window', () => {
        parentService.onCloseRequested();
        sinon.assert.calledOnce(global.fin.desktop.Window.getCurrent().close);
        sinon.assert.calledWithExactly(global.fin.desktop.Window.getCurrent().close, true);
    });

    it('sets up service with event listeners and message subscriptions on start', () => {
        const createChildWindow = sinon.stub(parentService, 'createChildWindow');
        const defaultStocks = ConfigService.getDefaultStocks();

        parentService.start();
        const currentWindow = global.fin.desktop.Window.getCurrent();

        expect(currentWindow.contentWindow.store).to.equal(store);
        sinon.assert.calledOnce(currentWindow.addEventListener);
        sinon.assert.calledWithExactly(currentWindow.addEventListener, 'close-requested', parentService.onCloseRequested);
        sinon.assert.calledOnce(createChildWindow);
        sinon.assert.calledWithExactly(createChildWindow, { defaultStocks });

        // clean up
        createChildWindow.restore();
    });

    it('creates child windows from the store on start', () => {
        const createChildWindow = sinon.stub(parentService, 'createChildWindow');

        const windowNameOne = 'child-one';
        const windowNameTwo = 'child-two';
        const initialStateOne = { windowState: { isCompact: true } };
        const initialStateTwo = { windowState: { isMaximised: true } };
        childWindows[windowNameOne] = initialStateOne;
        childWindows[windowNameTwo] = initialStateTwo;

        parentService.start();
        sinon.assert.calledTwice(createChildWindow);
        sinon.assert.calledWithExactly(createChildWindow, { initialState: initialStateOne, windowName: windowNameOne });
        sinon.assert.calledWithExactly(createChildWindow, { initialState: initialStateTwo, windowName: windowNameTwo });

        // clean up
        createChildWindow.restore();
    });

    it('creates child window with compact initial state', () => {
        const createChildWindowSuccess = sinon.stub(parentService, 'createChildWindowSuccess');
        const getCompactWindowConfig = sinon.spy(ConfigService, 'getCompactWindowConfig');
        const initialState = { windowState: { isCompact: true } };

        parentService.createChildWindow({ windowName, initialState });

        sinon.assert.calledOnce(getCompactWindowConfig);
        sinon.assert.calledWithExactly(getCompactWindowConfig, windowName);

        // clean up
        createChildWindowSuccess.restore();
        getCompactWindowConfig.restore();
    });

    it('creates child window with maximised initial state', () => {
        const createChildWindowSuccess = sinon.stub(parentService, 'createChildWindowSuccess');
        const getMaximizedWindowConfig = sinon.spy(ConfigService, 'getMaximizedWindowConfig');
        const initialState = { windowState: { isMaximized: true } };

        parentService.createChildWindow({ windowName, initialState });

        sinon.assert.calledOnce(getMaximizedWindowConfig);
        sinon.assert.calledWithExactly(getMaximizedWindowConfig, windowName);

        // clean up
        createChildWindowSuccess.restore();
        getMaximizedWindowConfig.restore();
    });

    it('creates child window with default initial state', () => {
        const createChildWindowSuccess = sinon.stub(parentService, 'createChildWindowSuccess');
        const getWindowConfig = sinon.spy(ConfigService, 'getWindowConfig');
        const initialState = { windowState: {} };

        parentService.createChildWindow({ windowName, initialState });

        sinon.assert.calledOnce(getWindowConfig);
        sinon.assert.calledWithExactly(getWindowConfig, windowName);

        // clean up
        createChildWindowSuccess.restore();
        getWindowConfig.restore();
    });

    it('creates child window without initial state', () => {
        const createChildWindowSuccess = sinon.stub(parentService, 'createChildWindowSuccess');
        const getWindowConfig = sinon.spy(ConfigService, 'getWindowConfig');

        parentService.createChildWindow({ windowName });

        sinon.assert.calledOnce(getWindowConfig);
        sinon.assert.calledWithExactly(getWindowConfig, windowName);

        // clean up
        createChildWindowSuccess.restore();
        getWindowConfig.restore();
    });

    it('creates child window with position and default stocks', () => {
        const createChildWindowSuccess = sinon.stub(parentService, 'createChildWindowSuccess');
        const position = [1, 2];
        const defaultStocks = ['ABC', 'DEF'];

        parentService.createChildWindow({ windowName, position, defaultStocks });
        clock.tick(); // necessary because of setTimeout in our Window fake's constructor

        sinon.assert.calledOnce(createChildWindowSuccess);
        sinon.assert.calledWithMatch(createChildWindowSuccess, {}, position, defaultStocks);

        createChildWindowSuccess.restore();
    });

    it('sets window bounds on creation if position given', () => {
        const addEventListener = sinon.spy();
        const setBounds = sinon.spy();
        const position = [100, 200];

        const childWindow = {
            name: windowName,
            addEventListener,
            setBounds,
            show: noop
        };

        parentService.createChildWindowSuccess(childWindow, position);

        sinon.assert.calledWithExactly(setBounds, position[0], position[1]);
    });

    it('does not set window bounds on creation if position not given', () => {
        const addEventListener = sinon.spy();
        const setBounds = sinon.spy();

        const childWindow = {
            name: windowName,
            addEventListener,
            setBounds,
            show: noop
        };

        parentService.createChildWindowSuccess(childWindow);

        sinon.assert.notCalled(setBounds);
    });

    it('updates store if default stocks given', () => {
        const addEventListener = sinon.spy();
        const defaultStocks = ['BAH', 'DUM', 'TISH'];
        const initialOpenAction = willBeInitialOpen(windowName);
        const toggleFavouriteAction = (stock) => toggleFavouriteInWindow(stock, windowName);

        const childWindow = {
            name: windowName,
            addEventListener,
            show: noop
        };

        parentService.createChildWindowSuccess(childWindow, undefined, defaultStocks);
        sinon.assert.callCount(store.dispatch, 4);
        sinon.assert.calledWithExactly(store.dispatch, initialOpenAction);
        defaultStocks.forEach((stock) =>
            sinon.assert.calledWithExactly(store.dispatch, toggleFavouriteAction(stock))
        );
    });

    it('stores window on creation so event listener can be removed on close', () => {
        const addEventListener = sinon.spy();
        const removeEventListener = sinon.spy();
        const show = sinon.spy();

        const childWindow = {
            name: windowName,
            addEventListener,
            removeEventListener,
            show
        };

        parentService.createChildWindowSuccess(childWindow);

        sinon.assert.calledOnce(show);
        sinon.assert.calledOnce(addEventListener);
        expect(addEventListener.getCall(0).args[0]).to.equal('closed');
        expect(addEventListener.getCall(0).args[1]).to.equal(parentService.onChildClosed);
        addEventListener.getCall(0).args[2](); // invoke callback to store new window in parentService

        parentService.onChildClosed({ name: windowName });
        sinon.assert.calledOnce(removeEventListener);
        expect(removeEventListener.getCall(0).args[0]).to.equal('closed');
        expect(removeEventListener.getCall(0).args[1]).to.equal(parentService.onChildClosed);
    });

    it('closes the application when closed window is the last remaining child', () => {
        const childWindowName = 'child-one';
        childWindows[childWindowName] = {};

        parentService.onChildClosed({ name: childWindowName });

        sinon.assert.calledOnce(global.fin.desktop.Window.getCurrent().close);
        sinon.assert.notCalled(store.dispatch);
    });

    it('updates the store when closed window is not the last remaining child', () => {
        const childWindowName = 'child-one';
        childWindows[childWindowName] = {};
        childWindows['child-two'] = {};

        parentService.onChildClosed({ name: childWindowName });

        sinon.assert.calledOnce(store.dispatch);
        expect(store.dispatch.getCall(0).args[0].type).to.equal(ACTION_TYPES.CLOSE);
        expect(store.dispatch.getCall(0).args[0].windowName).to.equal(childWindowName);
        sinon.assert.notCalled(global.fin.desktop.Window.getCurrent().close);
    });

});
