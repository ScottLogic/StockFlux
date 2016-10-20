import configService from '../../shared/ConfigService';
import { close } from '../actions/parent';

class ParentService {

    constructor(store) {
        this.store = store;
        this.onChildClosed = this.onChildClosed.bind(this);

        fin.desktop.InterApplicationBus.subscribe(
            fin.desktop.Application.getCurrent().uuid,
            'createChildWindow',
            (config) => this.createChildWindow(config)
        );
    }

    getChildWindowCount() {
        return Object.keys(this.store.getState().childWindows).length;
    }

    onChildClosed({ name }) {
        this.store.dispatch(close(name, Date.now()));

        // Close the main parent window if all child windows are closed
        if (this.getChildWindowCount() === 0 && Object.keys(this.store.getState().dragOut).length === 0) {
            fin.desktop.Window.getCurrent().contentWindow.close();
        }
    }

    createChildWindowSuccess(childWindow, position) {
        if (position) {
            childWindow.setBounds(position[0], position[1]);
        }

        childWindow.show();
        childWindow.addEventListener('closed', this.onChildClosed);
    }

    createChildWindow(config = {}) {
        const { windowName, position, intialState } = config;
        const windowConfig = this.getChildWindowConfigOrDefault(windowName, intialState);
        const childWindow = new fin.desktop.Window(
            windowConfig,
            () => this.createChildWindowSuccess(childWindow, position)
        );
    }

    getChildWindowConfigOrDefault(windowName, intialState) {
        let windowConfig;
        if (windowName && intialState) {
            if (intialState.isCompact) {
                windowConfig = configService.getCompactWindowConfig(windowName);
            } else if (intialState.isMaximized) {
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

        if (this.getChildWindowCount() === 0) {
            this.createChildWindow();
        } else {
            const childWindows = this.store.getState().childWindows;
            Object.keys(childWindows).forEach((windowName) => {
                const newWindowName = windowName === 'undefined' ? null : windowName;
                this.createChildWindow({ windowName: newWindowName, initalState: childWindows[newWindowName] });
            });
        }
    }

}

export default ParentService;
