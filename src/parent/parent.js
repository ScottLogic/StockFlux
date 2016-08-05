import configService from '../shared/ConfigService';
import parentStore from './store/configureStore';
import 'babel-polyfill';

function createChildWindow(windowName) {
    const childWindow = new fin.desktop.Window(
        configService.getWindowConfig(windowName),
        () => childWindow.show()
    );
}

function createChildWindows() {
    const store = parentStore();
    fin.desktop.Window.getCurrent().contentWindow.store = store;

    if (!Object.keys(fin.desktop.Window.getCurrent().contentWindow.store.getState()).length) {
        createChildWindow();
    } else {
        Object.keys(fin.desktop.Window.getCurrent().contentWindow.store.getState()).forEach((windowName) => {
            const newWindowName = windowName === 'undefined' ? null : windowName;
            createChildWindow(newWindowName);
        });
    }
}

fin.desktop.main(() => createChildWindows());
