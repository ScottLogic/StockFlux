import { snapAndDock } from 'openfin-layouts';
import { joinedSnapGroup, leftSnapGroup } from '../actions/window';

const { name: childWindowName, uuid } = fin.desktop.Window.getCurrent();

export async function start(store) {
    await snapAndDock.addEventListener('window-docked', () => {
        fin.desktop.InterApplicationBus.send(uuid, 'join-snap-group', null);
    });

    await snapAndDock.addEventListener('window-undocked', () => {
        fin.desktop.InterApplicationBus.send(uuid, 'leave-snap-group', null);
    });

    fin.desktop.InterApplicationBus.subscribe(uuid, 'joined-snap-group', ({ windowName }) => {
        if (childWindowName === windowName) {
            store.dispatch(joinedSnapGroup());
        }
    });

    fin.desktop.InterApplicationBus.subscribe(uuid, 'left-snap-group', ({ windowName }) => {
        if (childWindowName === windowName) {
            store.dispatch(leftSnapGroup());
        }
    });
}

export async function undockWindow() {
    await snapAndDock.undockWindow();
}
