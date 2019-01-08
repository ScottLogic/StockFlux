import configService from '../../shared/ConfigService';
import { close } from '../actions/parent';
import { toggleFavouriteInWindow } from '../../child/actions/favourites';
import { willBeInitialOpen } from '../../child/actions/initialOpen';

class ParentService {

    constructor(store) {
        this.store = store;
        this.parentClosing = false;
        this.childWindows = {};
        this.onChildClosed = this.onChildClosed.bind(this);
        this.onCloseRequested = this.onCloseRequested.bind(this);

        fin.desktop.InterApplicationBus.subscribe(
            fin.desktop.Application.getCurrent().uuid,
            'createChildWindow',
            (config) => this.createChildWindow(config)
        );
    }

    // external
    start() {
        fin.desktop.Window.getCurrent().contentWindow.store = this.store;

        fin.desktop.Window.getCurrent().addEventListener('close-requested', this.onCloseRequested);

        if (this.getChildWindowCount() === 0) {
            this.createChildWindow({ defaultStocks: configService.getDefaultStocks() });
        } else {
            const childWindowState = this.store.getState().childWindows;
            Object.keys(childWindowState).forEach((windowName) => {
                const newWindowName = windowName === 'undefined' ? null : windowName;
                this.createChildWindow({ windowName: newWindowName, initialState: childWindowState[newWindowName] });
            });
        }
    }

    // internal, in response to Window 'closed' event
    onChildClosed({ name }) {
        if (this.parentClosing) {
            return;
        }

        if (this.childWindows[name]) {
            this.childWindows[name].removeEventListener('closed', this.onChildClosed, () => (
                delete this.childWindows[name]
            ));
        }

        const isFinalChildWindowClosing = this.getChildWindowCount() === 0 ||
            (this.getChildWindowCount() === 1 && this.store.getState().childWindows[name]);

        if (isFinalChildWindowClosing && this.getWindowDragOutCount() === 0) {
            fin.desktop.Window.getCurrent().close();
        } else {
            this.store.dispatch(close(name, Date.now()));
        }
    }

    // internal, in response to Window 'close-requested' event
    onCloseRequested() {
        this.parentClosing = true;
        fin.desktop.Window.getCurrent().close(true);
    }

    // internal, in response to 'createChildWindow' message through InterApplicationBus
    createChildWindow(config = {}) {
        const { windowName, position, initialState, defaultStocks } = config;
        const windowConfig = this.getChildWindowConfigOrDefault(windowName, initialState);
        const childWindow = new fin.desktop.Window(
            windowConfig,
            () => this.createChildWindowSuccess(childWindow, position, defaultStocks)
        );
    }

    // internal
    getChildWindowCount() {
        return Object.keys(this.store.getState().childWindows).length;
    }

    // internal
    getWindowDragOutCount() {
        return Object.keys(this.store.getState().dragOut).length;
    }

    // internal
    getChildWindowConfigOrDefault(windowName, initialState) {
        let windowConfig;
        if (windowName && initialState) {
            if (initialState.windowState.isCompact) {
                windowConfig = configService.getCompactWindowConfig(windowName);
            } else if (initialState.windowState.isMaximized) {
                windowConfig = configService.getMaximizedWindowConfig(windowName);
            } else {
                windowConfig = configService.getWindowConfig(windowName);
            }
        } else if (windowName) {
            windowConfig = configService.getWindowConfig(windowName);
        } else {
            windowConfig = configService.getWindowConfig();
        }
        return windowConfig;
    }

    // internal
    createChildWindowSuccess(childWindow, position, defaultStocks) {
        if (position) {
            childWindow.setBounds(position[0], position[1]);
        }

        const childWindowName = childWindow.name;

        if (defaultStocks) {
            this.store.dispatch(willBeInitialOpen(childWindowName));
            defaultStocks.forEach((code) => {
                this.store.dispatch(toggleFavouriteInWindow(code, childWindowName));
            });
        }

        childWindow.show();
        childWindow.addEventListener('closed', this.onChildClosed, () => (
            this.childWindows[childWindowName] = childWindow
        ));
    }

}

export default ParentService;
