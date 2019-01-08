import { expect } from 'chai';
import sinon from 'sinon';
import fakeOpenFin from '../../../helper/fakeOpenFin';
import { joinedSnapGroup, leftSnapGroup } from '../../../../src/child/actions/window';

describe('child/services/LayoutsService', () => {

    const windowName = 'windowName';
    const uuid = 'uuid';

    const openfinLayout = {};
    let layoutsService;
    let store;

    fakeOpenFin({ openfinLayout, environment: { name: windowName, uuid } });

    beforeEach(() => {
        // eslint-disable-next-line global-require
        layoutsService = require('../../../../src/child/services/LayoutsService');
        store = { dispatch: sinon.spy() };
    });

    describe('start', () => {
        it('listen to openfin layouts join-snap-group event', async () => {
            await layoutsService.start();
            expect(openfinLayout.addEventListener.firstCall.args[0]).to.equal('join-snap-group');
            await openfinLayout.addEventListener.firstCall.args[1].call();
            expect(global.fin.desktop.InterApplicationBus.send.lastCall.args[0]).to.equal(uuid);
            expect(global.fin.desktop.InterApplicationBus.send.lastCall.args[1]).to.equal('join-snap-group');
            expect(global.fin.desktop.InterApplicationBus.send.lastCall.args[2]).to.be.null;
        });

        it('listen to openfin layouts leave-snap-group event', async () => {
            await layoutsService.start();
            expect(openfinLayout.addEventListener.secondCall.args[0]).to.equal('leave-snap-group');
            await openfinLayout.addEventListener.secondCall.args[1].call();
            expect(global.fin.desktop.InterApplicationBus.send.lastCall.args[0]).to.equal(uuid);
            expect(global.fin.desktop.InterApplicationBus.send.lastCall.args[1]).to.equal('leave-snap-group');
            expect(global.fin.desktop.InterApplicationBus.send.lastCall.args[2]).to.be.null;
        });

        it('listen to inter-applications joined-snap-group event', async () => {
            await layoutsService.start(store);
            expect(global.fin.desktop.InterApplicationBus.subscribe.firstCall.args[0]).to.equal(uuid);
            expect(global.fin.desktop.InterApplicationBus.subscribe.firstCall.args[1]).to.equal('joined-snap-group');
            global.fin.desktop.InterApplicationBus.subscribe.firstCall.args[2].call(null, { windowName: 'anotherWindowName' });
            expect(store.dispatch.notCalled).to.be.true;
            global.fin.desktop.InterApplicationBus.subscribe.firstCall.args[2].call(null, { windowName });
            expect(store.dispatch.lastCall.args[0]).to.deep.equal(joinedSnapGroup());
        });

        it('listen to inter-applications left-snap-group event', async () => {
            await layoutsService.start(store);
            expect(global.fin.desktop.InterApplicationBus.subscribe.lastCall.args[0]).to.equal(uuid);
            expect(global.fin.desktop.InterApplicationBus.subscribe.lastCall.args[1]).to.equal('left-snap-group');
            global.fin.desktop.InterApplicationBus.subscribe.lastCall.args[2].call(null, { windowName: 'anotherWindowName' });
            expect(store.dispatch.notCalled).to.be.true;
            global.fin.desktop.InterApplicationBus.subscribe.lastCall.args[2].call(null, { windowName });
            expect(store.dispatch.lastCall.args[0]).to.deep.equal(leftSnapGroup());
        });
    });

    describe('undockWindows', () => {
        it('calls openfin layouts undockWindow', async () => {
            await layoutsService.undockWindow();
            expect(openfinLayout.undockWindow.calledOnce).to.be.true;
        });
    });
});
