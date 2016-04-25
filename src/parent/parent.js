import configService from '../shared/ConfigService';

function createMainWindow() {

    const mainWindow = new fin.desktop.Window(
        configService.getWindowConfig(),
        () => mainWindow.show()
    );

    const closedEvent = () => {
        // Close the application
        window.close();
    };

    mainWindow.addEventListener('closed', closedEvent);
}

fin.desktop.main(() => createMainWindow());
