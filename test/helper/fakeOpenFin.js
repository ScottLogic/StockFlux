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
            openfinLayout.addEventListener = sinon.stub(Layouts, 'addEventListener');
            // eslint-disable-next-line no-param-reassign
            openfinLayout.generateLayout = sinon.stub(Layouts, 'generateLayout');
            // eslint-disable-next-line no-param-reassign
            openfinLayout.undockWindow = sinon.stub(Layouts, 'undockWindow');
        }
    });

    afterEach(() => {
        delete global.fin;

        if (Layouts) {
            Layouts.addEventListener.restore();
            Layouts.generateLayout.restore();
            Layouts.undockWindow.restore();
        }
    });
}

export default fakeOpenFin;
