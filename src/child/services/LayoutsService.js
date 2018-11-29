import * as Layouts from 'openfin-layouts';
import { joinedSnapGroup, leftSnapGroup } from '../actions/window';

const uuid = fin.desktop.Application.getCurrent().uuid;
const childWindow = fin.desktop.Window.getCurrent();
const childWindowName = childWindow.name;

export function start(store) {
    Layouts.addEventListener('join-snap-group', () => {
        fin.desktop.InterApplicationBus.send(uuid, 'join-snap-group', null);
    });

    Layouts.addEventListener('leave-snap-group', () => {
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
    await Layouts.undockWindow(childWindow);
}
