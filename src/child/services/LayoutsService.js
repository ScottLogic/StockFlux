import { snapAndDock } from 'openfin-layouts';
import { joinedSnapGroup, leftSnapGroup } from '../actions/window';

export async function start(store) {
    await snapAndDock.addEventListener('window-docked', () => {
        store.dispatch(joinedSnapGroup());
    });

    await snapAndDock.addEventListener('window-undocked', () => {
        store.dispatch(leftSnapGroup());
    });
}

export async function undockWindow() {
    await snapAndDock.undockWindow();
}
