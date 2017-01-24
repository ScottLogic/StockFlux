import { expect } from 'chai';
import semver from 'semver';
import versionValue from '../../../src/shared/versionValue.prod';

describe('shared/versionValue.prod', () => {
    it('should be a valid semantic version', () => {
        expect(semver.valid(versionValue)).to.equal(versionValue);
        expect(semver.valid(versionValue)).not.to.be.null;
    });
});
