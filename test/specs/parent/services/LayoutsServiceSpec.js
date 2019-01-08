import { expect } from 'chai';
import sinon from 'sinon';
import fakeOpenFin from '../../../helper/fakeOpenFin';

describe('parent/services/LayoutsService', () => {

    const windowName = 'windowName';
    const uuid = 'uuid';

    const openfinLayout = {};
    let startLayoutsService;
    let store;

    fakeOpenFin({ openfinLayout, environment: { name: windowName, uuid } });

    beforeEach(() => {
        // eslint-disable-next-line global-require
        startLayoutsService = require('../../../../src/parent/services/LayoutsService').default;
        store = { subscribe: sinon.spy() };
    });

    it('listens to inter-applications join-snap-group event on start', () => {
        startLayoutsService(store);
        expect(global.fin.desktop.InterApplicationBus.subscribe.firstCall.args[0]).to.equal(uuid);
        expect(global.fin.desktop.InterApplicationBus.subscribe.firstCall.args[1]).to.equal('join-snap-group');
    });

    it('listens to inter-applications leave-snap-group event on start', () => {
        startLayoutsService(store);
        expect(global.fin.desktop.InterApplicationBus.subscribe.lastCall.args[0]).to.equal(uuid);
        expect(global.fin.desktop.InterApplicationBus.subscribe.lastCall.args[1]).to.equal('leave-snap-group');
    });

    it('subscribes to store updates on start', () => {
        startLayoutsService(store);
        expect(store.subscribe.calledOnce).to.be.true;
    });

    it('when a window joins a group the windows of that group are notified', async () => {
        startLayoutsService(store);

        openfinLayout.generateLayout.onCall(0).returns(new Promise((resolve) => {
            resolve({
                apps: [{
                    uuid,
                    childWindows: [
                        { name: 'windowA', windowGroup: [] },
                        { name: 'windowB', windowGroup: [] },
                        { name: 'windowC', windowGroup: [] }
                    ]
                }]
            });
        }));
        store.subscribe.lastCall.args[0].call();
        await new Promise(setTimeout, 0);

        global.fin.desktop.InterApplicationBus.send.resetHistory();

        openfinLayout.generateLayout.onCall(1).returns(new Promise((resolve) => {
            resolve({
                apps: [{
                    uuid,
                    childWindows: [
                        { name: 'windowA', windowGroup: [{ name: 'windowB' }] },
                        { name: 'windowB', windowGroup: [{ name: 'windowA' }] },
                        { name: 'windowC', windowGroup: [] }
                    ]
                }]
            });
        }));

        store.subscribe.lastCall.args[0].call();
        await new Promise(setTimeout, 0);

        expect(global.fin.desktop.InterApplicationBus.send.getCall(0).args[0]).to.equal(uuid);
        expect(global.fin.desktop.InterApplicationBus.send.getCall(0).args[1]).to.equal('joined-snap-group');
        expect(global.fin.desktop.InterApplicationBus.send.getCall(0).args[2]).to.deep.equal({ windowName: 'windowA' });
        expect(global.fin.desktop.InterApplicationBus.send.getCall(1).args[0]).to.equal(uuid);
        expect(global.fin.desktop.InterApplicationBus.send.getCall(1).args[1]).to.equal('joined-snap-group');
        expect(global.fin.desktop.InterApplicationBus.send.getCall(1).args[2]).to.deep.equal({ windowName: 'windowB' });
    });

    it('when a window leaves a group the windows of that group are notified', async () => {
        startLayoutsService(store);

        openfinLayout.generateLayout.onCall(0).returns(new Promise((resolve) => {
            resolve({
                apps: [{
                    uuid,
                    childWindows: [
                        { name: 'windowA', windowGroup: [] },
                        { name: 'windowB', windowGroup: [] },
                        { name: 'windowC', windowGroup: [] }
                    ]
                }]
            });
        }));
        store.subscribe.lastCall.args[0].call();
        await new Promise(setTimeout, 0);

        global.fin.desktop.InterApplicationBus.send.resetHistory();

        openfinLayout.generateLayout.onCall(1).returns(new Promise((resolve) => {
            resolve({
                apps: [{
                    uuid,
                    childWindows: [
                        { name: 'windowA', windowGroup: [{ name: 'windowB' }] },
                        { name: 'windowB', windowGroup: [{ name: 'windowA' }] },
                        { name: 'windowC', windowGroup: [] }
                    ]
                }]
            });
        }));

        store.subscribe.lastCall.args[0].call();
        await new Promise(setTimeout, 0);

        global.fin.desktop.InterApplicationBus.send.resetHistory();

        openfinLayout.generateLayout.onCall(2).returns(new Promise((resolve) => {
            resolve({
                apps: [{
                    uuid,
                    childWindows: [
                        { name: 'windowA', windowGroup: [] },
                        { name: 'windowB', windowGroup: [] },
                        { name: 'windowC', windowGroup: [] }
                    ]
                }]
            });
        }));
        store.subscribe.lastCall.args[0].call();
        await new Promise(setTimeout, 0);

        expect(global.fin.desktop.InterApplicationBus.send.getCall(0).args[0]).to.equal(uuid);
        expect(global.fin.desktop.InterApplicationBus.send.getCall(0).args[1]).to.equal('left-snap-group');
        expect(global.fin.desktop.InterApplicationBus.send.getCall(0).args[2]).to.deep.equal({ windowName: 'windowA' });
        expect(global.fin.desktop.InterApplicationBus.send.getCall(1).args[0]).to.equal(uuid);
        expect(global.fin.desktop.InterApplicationBus.send.getCall(1).args[1]).to.equal('left-snap-group');
        expect(global.fin.desktop.InterApplicationBus.send.getCall(1).args[2]).to.deep.equal({ windowName: 'windowB' });
    });
});
