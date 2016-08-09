import { expect } from 'chai';
import { selectStock,
         unselectStock,
         __RewireAPI__ as rewiredActions } from '../../../../src/child/actions/selection';
import { SELECTION as ACTION_TYPES } from '../../../../src/shared/constants/actionTypes';

describe('child/actions/selection', () => {
    before(() => {
        rewiredActions.__Rewire__('currentWindowService', { getCurrentWindowName: () => 0 });
    });

    after(() => {
        rewiredActions.__ResetDependency__('currentWindowService');
    });

    it('should create an action to select a stock', () => {
        const code = 'GOOG';
        const name = 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume';
        const expectedAction = {
            windowName: 0,
            type: ACTION_TYPES.SELECTION,
            code,
            name
        };
        const actualAction = selectStock(code, name);
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });

    it('should create an action to unselect a stock', () => {
        const expectedAction = { windowName: 0, type: ACTION_TYPES.UNSELECT };
        const actualAction = unselectStock();
        expect(actualAction.type).to.be.a('string');
        expect(actualAction).to.deep.equal(expectedAction);
    });
});
