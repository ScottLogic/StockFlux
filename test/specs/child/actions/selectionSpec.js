import { expect } from 'chai';
import currentWindowServiceStub from '../../../helper/currentWindowServiceStub';
import { selectStock,
         unselectStock,
         __RewireAPI__ as rewiredActions } from '../../../../src/child/actions/selection';
import { SELECTION as ACTION_TYPES } from '../../../../src/shared/constants/actionTypes';

describe('child/actions/selection', () => {
    before(() => {
        rewiredActions.__Rewire__('currentWindowService', currentWindowServiceStub);
    });

    after(() => {
        rewiredActions.__ResetDependency__('currentWindowService');
    });

    it('should create an action to select a stock', () => {
        const code = 'GOOG';
        const name = 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume';
        const expectedAction = {
            windowName: 'window0002',
            type: ACTION_TYPES.SELECTION,
            code,
            name,
            analyticsEvent: {
                category: 'Select stock',
                action: code
            }
        };
        const actualAction = selectStock(code, name);
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action to select a stock and allow window name to be overridden', () => {
        const code = 'GOOG';
        const name = 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume';
        const windowName = 'window0001';
        const expectedAction = {
            windowName,
            type: ACTION_TYPES.SELECTION,
            code,
            name,
            analyticsEvent: {
                category: 'Select stock',
                action: code
            }
        };
        const actualAction = selectStock(code, name, windowName);
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action to unselect a stock', () => {
        const expectedAction = { windowName: 'window0002', type: ACTION_TYPES.UNSELECT };
        const actualAction = unselectStock();
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action to unselect a stock and allow window name to be overridden', () => {
        const windowName = 'window0001';
        const expectedAction = { windowName, type: ACTION_TYPES.UNSELECT };
        const actualAction = unselectStock(windowName);
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });
});
