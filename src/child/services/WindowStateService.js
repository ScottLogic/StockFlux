import {
    minimise,
    maximize,
    restore,
} from '../actions/window.js';

class WindowStateService {
    constructor(openFinWindow, store) {
        this.window = openFinWindow;
        this.store = store;
        this.onMinimize = this.onMinimize.bind(this);
        this.onMaximize = this.onMaximize.bind(this);
        this.onRestore = this.onRestore.bind(this);
    }

    start() {
        this.window.addEventListener('minimized', this.onMinimize);
        this.window.addEventListener('maximized', this.onMaximize);
        this.window.addEventListener('restored', this.onRestore);
    }

    stop() {
        this.window.removeEventListener('minimized', this.onMinimize);
        this.window.removeEventListener('maximized', this.onMaximize);
        this.window.removeEventListener('restored', this.onRestore);
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
}

export default WindowStateService;
