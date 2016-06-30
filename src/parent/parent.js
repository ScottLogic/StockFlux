import configService from '../shared/ConfigService';
import parentStore from './store/configureStore';
import 'babel-polyfill';

// Need to increment on drag out also
let openWindows = 0;

const closedEvent = () => {
    openWindows--;
    // Close the application
    if (openWindows === 0) {
        fin.desktop.Window.getCurrent().contentWindow.close();
    }
};

function createChildWindow(windowName) {
    const childWindow = new fin.desktop.Window(
        configService.getWindowConfig(windowName),
        () => childWindow.show()
    );

    openWindows++;
    childWindow.addEventListener('closed', closedEvent);
}

function createChildWindows() {
    fin.desktop.Window.getCurrent().contentWindow.store = parentStore();

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
