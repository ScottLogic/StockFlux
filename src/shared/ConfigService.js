const BITFLUX_STOCK_AMOUNT = 1200;
const BITFLUX_INITIAL_PROPORTION = 112 / BITFLUX_STOCK_AMOUNT; // 112 days == ~4 months
const CLOSED_SIDEBAR_WIDTH = 50;
const SIDETAB_TOP_HEIGHT = 50;
const TEAROUT_WINDOW_OFFSET = [CLOSED_SIDEBAR_WIDTH, SIDETAB_TOP_HEIGHT];
const TEAROUT_WINDOW_OFFSET_COMPACT = [0, 34];
const TEAROUT_CARD_WIDTH = 230;
const TEAROUT_CARD_DIMENSIONS = [TEAROUT_CARD_WIDTH, 110];
const COMPACT_WINDOW_DIMENSIONS = [TEAROUT_CARD_WIDTH, 500];
const DEFAULT_WINDOW_DIMENSIONS = [1280, 720];
const DEFAULT_WINDOW_MIN_DIMENSIONS = [918, 510];
const DEFAULT_STOCKS = ['AAPL', 'MSFT', 'TITN', 'TSLA'];

const allowContextMenu = process.env.NODE_ENV !== 'production';

/**
 * Stores common configuration for the application.
 */
class ConfigService {
    createName() {
        return `window${Math.floor(Math.random() * 1000) + Math.ceil(Math.random() * 999)}`;
    }

    getConfig(name, overrides) {
        const sharedConfig = {
            name: name || this.createName(),
            contextMenu: allowContextMenu,
            autoShow: false,
            frame: false,
            shadow: false,
            resizeRegion: {
                size: 7,
                topLeftCorner: 14,
                topRightCorner: 14,
                bottomRightCorner: 14,
                bottomLeftCorner: 14
            }
        };

        Object.keys(sharedConfig).forEach((key) => {
            if (overrides[key] === undefined) {
                overrides[key] = sharedConfig[key]; // eslint-disable-line no-param-reassign
            }
        });

        return overrides;
    }

    getWindowConfig(name) {
        return this.getConfig(name, {
            showTaskbarIcon: true,
            saveWindowState: true,
            url: 'index.html',
            resizable: true,
            maximizable: true,
            minWidth: DEFAULT_WINDOW_MIN_DIMENSIONS[0],
            minHeight: DEFAULT_WINDOW_MIN_DIMENSIONS[1],
            defaultWidth: DEFAULT_WINDOW_DIMENSIONS[0],
            defaultHeight: DEFAULT_WINDOW_DIMENSIONS[1]
        });
    }

    getCompactWindowConfig(name) {
        return this.getConfig(name, {
            showTaskbarIcon: true,
            saveWindowState: true,
            url: 'index.html',
            resizable: false,
            maximizable: false,
            minWidth: COMPACT_WINDOW_DIMENSIONS[0],
            minHeight: COMPACT_WINDOW_DIMENSIONS[1],
            defaultWidth: COMPACT_WINDOW_DIMENSIONS[0],
            defaultHeight: COMPACT_WINDOW_DIMENSIONS[1]
        });
    }

    getMaximizedWindowConfig(name) {
        return this.getConfig(name, {
            showTaskbarIcon: true,
            saveWindowState: true,
            url: 'index.html',
            resizable: true,
            maximizable: true,
            state: 'maximized',
            minWidth: DEFAULT_WINDOW_MIN_DIMENSIONS[0],
            minHeight: DEFAULT_WINDOW_MIN_DIMENSIONS[1],
            defaultWidth: DEFAULT_WINDOW_DIMENSIONS[0],
            defaultHeight: DEFAULT_WINDOW_DIMENSIONS[1]
        });
    }

    getTearoutConfig(name) {
        return this.getConfig(name, {
            maximizable: false,
            resizable: false,
            showTaskbarIcon: false,
            saveWindowState: false,
            maxWidth: TEAROUT_CARD_DIMENSIONS[0],
            maxHeight: TEAROUT_CARD_DIMENSIONS[1],
            url: 'tearout.html'
        });
    }

    getTearoutCardDimensions() {
        return TEAROUT_CARD_DIMENSIONS;
    }

    getCompactWindowDimensions() {
        return COMPACT_WINDOW_DIMENSIONS;
    }

    getDefaultWindowDimensions() {
        return DEFAULT_WINDOW_DIMENSIONS;
    }

    getDefaultWindowMinDimensions() {
        return DEFAULT_WINDOW_MIN_DIMENSIONS;
    }

    getTopCardOffset(compact) {
        return compact ? TEAROUT_WINDOW_OFFSET_COMPACT : TEAROUT_WINDOW_OFFSET;
    }

    getInitialBitfluxProportion() {
        return BITFLUX_INITIAL_PROPORTION;
    }

    getBitfluxStockAmount() {
        return BITFLUX_STOCK_AMOUNT;
    }

    getDefaultStocks() {
        return DEFAULT_STOCKS;
    }
}

export default new ConfigService();
