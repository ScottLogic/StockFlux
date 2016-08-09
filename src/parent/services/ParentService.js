import configService from '../../shared/ConfigService';
import { close } from '../actions/parent';

class ParentService {

    constructor(store) {
        this.store = store;
        this.onChildClosed = this.onChildClosed.bind(this);
    }

    onChildClosed({ name }) {
        this.store.dispatch(close(name));

        // Close the main parent window if all child windows are closed
        if (Object.keys(this.store.getState()).length === 0) {
            fin.desktop.Window.getCurrent().contentWindow.close();
        }
    }

    createChildWindowSuccess(childWindow) {
        childWindow.show();
        childWindow.addEventListener('closed', this.onChildClosed);
    }

    createChildWindow(windowName) {
        const childWindow = new fin.desktop.Window(
            configService.getWindowConfig(windowName),
            () => this.createChildWindowSuccess(childWindow)
        );
    }

    start() {
        fin.desktop.Window.getCurrent().contentWindow.store = this.store;

        if (!Object.keys(fin.desktop.Window.getCurrent().contentWindow.store.getState()).length) {
            this.createChildWindow();
        } else {
            Object.keys(fin.desktop.Window.getCurrent().contentWindow.store.getState()).forEach((windowName) => {
                const newWindowName = windowName === 'undefined' ? null : windowName;
                this.createChildWindow(newWindowName);
            });
        }
    }

}

export default ParentService;
