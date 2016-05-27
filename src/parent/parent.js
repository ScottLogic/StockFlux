import configService from '../shared/ConfigService';
import parentStore from './parentStore';
import configureStore from '../child/store/configureStore';
import { childChange, childConnect } from './actions';
import 'babel-polyfill';

let id = 0;
const getId = () => id++;

function createChildWindows() {
    const store = parentStore([{ id, state: configureStore().getState() }]);

    store.getState().forEach((childState) => {
        const childWindow = new fin.desktop.Window(
            configService.getWindowConfig(),
            () => childWindow.show()
        );

        const closedEvent = () => {
            // Close the application
            window.close();
        };

        childWindow.addEventListener('closed', closedEvent);

        fin.desktop.InterApplicationBus.subscribe(
            '*',
            'childConnected',
            message => {
                const newId = getId();
                store.dispatch(childConnect(newId));
                console.log('child connected: ' + message.uuid);
                fin.desktop.InterApplicationBus.publish(
                    'initState',
                    { state: childState, uuid: message.uuid, id: newId }
                );
            }
        );

        fin.desktop.InterApplicationBus.subscribe(
            '*',
            'childUpdated',
            message => {
                console.log(message);
                store.dispatch(childChange(message.state, message.id));
            }
        );


    });
}

fin.desktop.main(() => createChildWindows());
