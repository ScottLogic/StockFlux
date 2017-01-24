import configService from '../../shared/ConfigService';
import { close } from '../actions/parent';
import { toggleFavouriteInWindow } from '../../child/actions/favourites';
import { willBeInitialOpen } from '../../child/actions/initialOpen';

class ParentService {

    constructor(store) {
        this.store = store;
        this.parentClosing = false;
        this.onChildClosed = this.onChildClosed.bind(this);
        this.onCloseRequested = this.onCloseRequested.bind(this);

        fin.desktop.InterApplicationBus.subscribe(
            fin.desktop.Application.getCurrent().uuid,
            'createChildWindow',
            (config) => this.createChildWindow(config)
        );
    }

    getChildWindowCount() {
        return Object.keys(this.store.getState().childWindows).length;
    }

    getWindowDragOutCount() {
        return Object.keys(this.store.getState().dragOut).length;
    }

    onChildClosed({ name }) {
        if (this.parentClosing) {
            return;
        }

        const isFinalChildWindowClosing = this.getChildWindowCount() === 0 || (this.getChildWindowCount() === 1 && this.store.getState().childWindows[name]);

        if (isFinalChildWindowClosing && this.getWindowDragOutCount() === 0) {
            fin.desktop.Window.getCurrent().close();
        } else {
            this.store.dispatch(close(name, Date.now()));
        }
    }

    onCloseRequested() {
        this.parentClosing = true;
        fin.desktop.Window.getCurrent().close(true);
    }

    createChildWindowSuccess(childWindow, position, defaultStocks) {
        if (position) {
            childWindow.setBounds(position[0], position[1]);
        }

        if (defaultStocks) {
            const childWindowName = childWindow.name;
            this.store.dispatch(willBeInitialOpen(childWindowName));
            defaultStocks.forEach((code) => {
                this.store.dispatch(toggleFavouriteInWindow(code, childWindowName));
            });
        }

        childWindow.show();
        childWindow.addEventListener('closed', this.onChildClosed);
    }

    createChildWindow(config = {}) {
        const { windowName, position, initialState, defaultStocks } = config;
        const windowConfig = this.getChildWindowConfigOrDefault(windowName, initialState);
        const childWindow = new fin.desktop.Window(
            windowConfig,
            () => this.createChildWindowSuccess(childWindow, position, defaultStocks)
        );
    }

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

    start() {
        fin.desktop.Window.getCurrent().contentWindow.store = this.store;

        fin.desktop.Window.getCurrent().addEventListener('close-requested', this.onCloseRequested);

        if (this.getChildWindowCount() === 0) {
            this.createChildWindow({ defaultStocks: configService.getDefaultStocks() });
        } else {
            const childWindows = this.store.getState().childWindows;
            Object.keys(childWindows).forEach((windowName) => {
                const newWindowName = windowName === 'undefined' ? null : windowName;
                this.createChildWindow({ windowName: newWindowName, initialState: childWindows[newWindowName] });
            });
        }
    }

}

export default ParentService;
