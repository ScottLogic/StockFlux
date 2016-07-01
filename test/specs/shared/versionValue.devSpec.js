import { expect } from 'chai';
import versionValue from '../../../src/shared/versionValue.dev';

describe('shared/versionValue.dev', () => {
    it('should be a valid semantic version', () => {
        expect(versionValue).to.equal('DEVELOPMENT');
    });
});
