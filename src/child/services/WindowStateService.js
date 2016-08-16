import { unmountComponentAtNode } from 'react-dom';
import {
    minimise,
    maximize,
    restore,
} from '../actions/window.js';

class WindowStateService {
    constructor(openFinWindow, store, rootElement) {
        this.window = openFinWindow;
        this.store = store;
        this.rootElement = rootElement;
        this.onMinimize = this.onMinimize.bind(this);
        this.onMaximize = this.onMaximize.bind(this);
        this.onRestore = this.onRestore.bind(this);
        this.onCloseRequested = this.onCloseRequested.bind(this);
    }

    start() {
        this.window.addEventListener('minimized', this.onMinimize);
        this.window.addEventListener('maximized', this.onMaximize);
        this.window.addEventListener('restored', this.onRestore);
        this.window.addEventListener('close-requested', this.onCloseRequested);
    }

    stop() {
        this.window.removeEventListener('minimized', this.onMinimize);
        this.window.removeEventListener('maximized', this.onMaximize);
        this.window.removeEventListener('restored', this.onRestore);
        this.window.removeEventListener('close-requested', this.onCloseRequested);
    }

    onMinimize() {
        this.store.dispatch(minimise());
    }

    onMaximize() {
        this.store.dispatch(maximize());
    }

    onRestore() {
        this.store.dispatch(restore());
    }

    // By default, the window will be prevented from closing as the
    // 'close-requested' event has been subscribed to.
    // Subscribring to this event gives us the opportunity to unmount the root
    // component before the window is closed (to remove any subscriptions this
    // window has to the redux store) then close the window.
    onCloseRequested() {
        unmountComponentAtNode(this.rootElement);
        this.stop();
        this.window.close(true);
    }
}

export default WindowStateService;
