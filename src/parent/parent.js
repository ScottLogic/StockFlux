import configService from '../shared/ConfigService';
import parentStore from './parentStore';
import configureStore from '../child/store/configureStore';
import { initialiseState, childChange, childConnect, childClosed } from './actions';
import 'babel-polyfill';

let id = 0;
const getId = () => id++;

// Need to increment on drag out also
let openWindows = 0;

let newlySpawnedId = -1;
let newlySpawnedStockCode = null;
let newlySpawnedStockName = null;

function createChildWindows() {
    const store = parentStore([{ id, state: configureStore().getState() }]);

    const closedEvent = () => {
        openWindows--;
        // Close the application
        if (openWindows === 0) {
            window.close();
        }
    };

    // Make sure any states loaded from local storage start at index 0
    store.dispatch(initialiseState());

    fin.desktop.InterApplicationBus.subscribe(
        '*',
        'childConnected',
        message => {
            const newId = getId();
            store.dispatch(childConnect(newId));
            const childState = store.getState().find(state => state.id === newId);

            fin.desktop.InterApplicationBus.publish(
                'initState',
                { state: childState, uuid: message.uuid, id: newId }
            );

            // If this window is spawned by dragging out a favourite
            if (newId === newlySpawnedId) {
                fin.desktop.InterApplicationBus.publish(
                    'initialiseDragged',
                    { id: newId, stockCode: newlySpawnedStockCode, stockName: newlySpawnedStockName }
                );
            }
        }
    );

    fin.desktop.InterApplicationBus.subscribe(
        '*',
        'childUpdated',
        message => {
            store.dispatch(childChange(message.state, message.id));
        }
    );

    fin.desktop.InterApplicationBus.subscribe(
        '*',
        'childClosing',
        message => {
            // If this isn't the final window, remove it from the store so
            // we don't spawn this window next time
            if (openWindows !== 1) {
                store.dispatch(childClosed(message.id));
            }
        }
    );

    fin.desktop.InterApplicationBus.subscribe(
        '*',
        'spawnNewWindow',
        message => {
            // Spawn a new window and set up close listener
            const childWindow = new fin.desktop.Window(
                configService.getWindowConfig(),
                () => childWindow.show()
            );
            openWindows++;
            childWindow.addEventListener('closed', closedEvent);

            newlySpawnedId = id;
            newlySpawnedStockCode = message.stockCode;
            newlySpawnedStockName = message.stockName;
        }
    );

    store.getState().forEach(() => {
        const childWindow = new fin.desktop.Window(
            configService.getWindowConfig(),
            () => childWindow.show()
        );

        openWindows++;

        childWindow.addEventListener('closed', closedEvent);
    });
}

fin.desktop.main(() => createChildWindows());
