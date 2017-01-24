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

    resizeTo(...args) {
        return this.getCurrentWindow().resizeTo(...args);
    }

    updateOptions(...args) {
        return this.getCurrentWindow().updateOptions(...args);
    }
}

export default new CurrentWindowService();
