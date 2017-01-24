import sinon from 'sinon';
import currentWindowService from '../../src/child/services/currentWindowService';

const currentWindowServiceStub = sinon.stub(currentWindowService);
currentWindowServiceStub.getCurrentWindowName.returns('window0002');

export default currentWindowServiceStub;
