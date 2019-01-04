import { addEventListener, undockWindow as layoutServiceUndockWindow } from 'openfin-layouts';
import { joinedSnapGroup, leftSnapGroup } from '../actions/window';

const { name: childWindowName, uuid } = fin.desktop.Window.getCurrent();

export async function start(store) {
    await addEventListener('join-snap-group', () => {
        fin.desktop.InterApplicationBus.send(uuid, 'join-snap-group', null);
    });

    await addEventListener('leave-snap-group', () => {
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
    await layoutServiceUndockWindow();
}
