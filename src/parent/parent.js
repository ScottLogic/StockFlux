import parentStore from './store/configureStore';
import ParentService from './services/ParentService';

fin.desktop.main(() => {
    const store = parentStore();
    const parentService = new ParentService(store);
    parentService.start();
});
