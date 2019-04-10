import sinon from 'sinon';

function createOpenFin({ name, uuid }) {
    const close = sinon.spy();
    const addEventListener = sinon.spy();
    const send = sinon.spy();
    const subscribe = sinon.spy();

    const currentWindow = {
        contentWindow: {},
        name,
        uuid,
        addEventListener,
        close
    };

    class Window {
        constructor(config, callback) {
            currentWindow.name = config.name;
            setTimeout(callback, 0);
        }
        static getCurrent() {
            return currentWindow;
        }
    }

    return {
        desktop: {
            Application: {
                getCurrent: () => ({ uuid })
            },
            InterApplicationBus: {
                send,
                subscribe
            },
            Window
        },
        InterApplicationBus: {
            Channel: {
                connect: () => ({
                    then: () => {}
                })
            }
        }
    };
}

function fakeOpenFin({ environment, openfinLayout }) {
    let Layouts;

    beforeEach(() => {
        global.fin = createOpenFin(environment);

        if (openfinLayout) {
            // eslint-disable-next-line global-require
            Layouts = require('openfin-layouts');

            // eslint-disable-next-line no-param-reassign
            openfinLayout.snapAndDock = {
                addEventListener: sinon.stub(Layouts.snapAndDock, 'addEventListener'),
                undockWindow: sinon.stub(Layouts.snapAndDock, 'undockWindow')
            };
            // eslint-disable-next-line no-param-reassign
            openfinLayout.workspaces = { generate: sinon.stub(Layouts.workspaces, 'generate') };
        }
    });

    afterEach(() => {
        delete global.fin;

        if (Layouts) {
            Layouts.snapAndDock.addEventListener.restore();
            Layouts.snapAndDock.undockWindow.restore();
            Layouts.workspaces.generate.restore();
        }
    });
}

export default fakeOpenFin;
