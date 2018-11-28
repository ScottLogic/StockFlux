import sinon from 'sinon';
import 'babel-polyfill';

function createOpenFin({
    application: { uuid },
    window: { name }
}) {
    return {
        desktop: {
            Application: {
                getCurrent: () => ({ uuid })
            },
            InterApplicationBus: {
                send: () => {},
                subscribe: () => {}
            },
            Window: {
                getCurrent: () => ({ name })
            }
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

function fakeOpenFin(openfinLayout, environment) {
    let Layouts;

    beforeEach(() => {
        global.fin = createOpenFin(environment);
        global.fin.desktop.InterApplicationBus.send = sinon.spy(global.fin.desktop.InterApplicationBus, 'send');
        global.fin.desktop.InterApplicationBus.subscribe = sinon.spy(global.fin.desktop.InterApplicationBus, 'subscribe');

        // eslint-disable-next-line global-require
        Layouts = require('openfin-layouts');

        // eslint-disable-next-line no-param-reassign
        openfinLayout.addEventListener = sinon.spy(Layouts, 'addEventListener');
        // eslint-disable-next-line no-param-reassign
        openfinLayout.generateLayout = sinon.stub(Layouts, 'generateLayout');
        // eslint-disable-next-line no-param-reassign
        openfinLayout.undockWindow = sinon.spy(Layouts, 'undockWindow');
    });

    afterEach(() => {
        global.fin.desktop.InterApplicationBus.send.restore();
        global.fin.desktop.InterApplicationBus.subscribe.restore();
        delete global.fin;

        Layouts.addEventListener.restore();
        Layouts.generateLayout.restore();
        Layouts.undockWindow.restore();
    });
}

export default fakeOpenFin;
