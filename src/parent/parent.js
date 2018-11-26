import parentStore from './store/configureStore';
import ParentService from './services/ParentService';
import LayoutsService from './services/LayoutsService';

fin.desktop.main(() => {
    const store = parentStore();
    const parentService = new ParentService(store);
    parentService.start();
    LayoutsService(store);
});
