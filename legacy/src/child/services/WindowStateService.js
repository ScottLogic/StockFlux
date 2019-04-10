import { unmountComponentAtNode } from 'react-dom';
import {
    minimize,
    maximize,
    restore,
    windowResized
} from '../actions/window';

class WindowStateService {
    constructor(openFinWindow, store, rootElement) {
        this.window = openFinWindow;
        this.store = store;
        this.rootElement = rootElement;
        this.onMinimize = this.onMinimize.bind(this);
        this.onMaximize = this.onMaximize.bind(this);
        this.onRestore = this.onRestore.bind(this);
        this.onCloseRequested = this.onCloseRequested.bind(this);
        this.onBoundsChanged = this.onBoundsChanged.bind(this);
    }

    start() {
        this.window.addEventListener('minimized', this.onMinimize);
        this.window.addEventListener('maximized', this.onMaximize);
        this.window.addEventListener('restored', this.onRestore);
        this.window.addEventListener('close-requested', this.onCloseRequested);
        this.window.addEventListener('bounds-changed', this.onBoundsChanged);
    }

    stop() {
        this.window.removeEventListener('minimized', this.onMinimize);
        this.window.removeEventListener('maximized', this.onMaximize);
        this.window.removeEventListener('restored', this.onRestore);
        this.window.removeEventListener('close-requested', this.onCloseRequested);
        this.window.removeEventListener('bounds-changed', this.onBoundsChanged);
    }

    onMinimize() {
        this.store.dispatch(minimize());
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

    onBoundsChanged(e) {
        const positionChangeType = 0;

        if (e.changeType !== positionChangeType && !this.store.getState().childWindows[e.name].windowState.isCompact && !this.store.getState().childWindows[e.name].windowState.isChangingView) {
            this.store.dispatch(windowResized([e.width, e.height]));
        }
    }
}

export default WindowStateService;
