import { expect } from 'chai';
import reducers from '../../../../src/child/reducers/reducers';
import configService from '../../../../src/shared/ConfigService';

describe('child/reducers/reducers', () => {
    it('should return the initial state', () => {
        const initialState = {
            favourites: {
                codes: [],
                names: {}
            },
            initialOpen: false,
            search: {
                term: ''
            },
            selection: {},
            sidebar: {
                showSearch: true
            },
            windowState: {
                isCompact: false,
                isChangingView: false,
                isMaximized: false,
                isResizing: false,
                previousExpandedDimensions: configService.getDefaultWindowDimensions(),
                previousMaximizedState: false
            },
        };
        expect(reducers(undefined, {})).to.deep.equal(initialState);
    });
});
