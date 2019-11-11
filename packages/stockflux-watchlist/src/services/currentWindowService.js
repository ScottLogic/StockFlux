import { OpenfinApiHelpers } from 'stockflux-core';

/**
 * Abstraction layer for the OpenFin API.
 */
class CurrentWindowService {
  getCurrentWindow() {
    return OpenfinApiHelpers.getCurrentWindow();
  }

  getCurrentWindowName() {
    return this.getCurrentWindow().name;
  }

  ready(cb) {
    OpenfinApiHelpers.useMain(cb);
  }

  openUrlWithBrowser(url) {
    OpenfinApiHelpers.openUrlWithBrowser(url);
  }

  resizeTo(...args) {
    return this.getCurrentWindow().resizeTo(...args);
  }

  updateOptions(...args) {
    return this.getCurrentWindow().updateOptions(...args);
  }
}

export default new CurrentWindowService();
