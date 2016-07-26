/**
 * Abstraction layer for the OpenFin API.
 */
class CurrentWindowService {
    getCurrentWindow() {
        return fin.desktop.Window.getCurrent();
    }

    getCurrentWindowName() {
        return this.getCurrentWindow().name;
    }

    ready(cb) {
        fin.desktop.main(cb);
    }

    openUrlWithBrowser(url) {
        fin.desktop.System.openUrlWithBrowser(url);
    }
}

export default new CurrentWindowService();
