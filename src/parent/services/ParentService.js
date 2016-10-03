import configService from '../../shared/ConfigService';
import { close } from '../actions/parent';

class ParentService {

    constructor(store) {
        this.store = store;
        this.onChildClosed = this.onChildClosed.bind(this);

        fin.desktop.InterApplicationBus.subscribe(
            fin.desktop.Application.getCurrent().uuid,
            'createChildWindow',
            position => this.createChildWindow(null, position)
        );
    }

    getChildWindowCount() {
        return Object.keys(this.store.getState().childWindows).length;
    }

    onChildClosed({ name }) {
        this.store.dispatch(close(name, Date.now()));

        // Close the main parent window if all child windows are closed
        if (this.getChildWindowCount() === 0 && this.store.getState().dragOut === null) {
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

    createChildWindow(windowName, position) {
        let windowConfig;
        if (windowName) {
            const { windowState } = this.store.getState().childWindows[windowName];
            if (windowState.isCompact) {
                windowConfig = configService.getCompactWindowConfig(windowName);
            } else if (windowState.isMaximized) {
                windowConfig = configService.getMaximizedWindowConfig(windowName);
            } else {
                windowConfig = configService.getWindowConfig(windowName);
            }
        } else {
            windowConfig = configService.getWindowConfig();
        }

        const childWindow = new fin.desktop.Window(
            windowConfig,
            () => this.createChildWindowSuccess(childWindow, position)
        );
    }

    start() {
        fin.desktop.Window.getCurrent().contentWindow.store = this.store;

        if (this.getChildWindowCount() === 0) {
            this.createChildWindow();
        } else {
            Object.keys(this.store.getState().childWindows).forEach((windowName) => {
                const newWindowName = windowName === 'undefined' ? null : windowName;
                this.createChildWindow(newWindowName);
            });
        }
    }

}

export default ParentService;
