import { expect } from 'chai';
import semver from 'semver';
import versionValue from '../../src/shared/versionValue';

describe('shared/versionValue', () => {
    it('should be a valid semantic version', () => {
        expect(semver.valid(versionValue)).to.equal(versionValue);
        expect(semver.valid(versionValue)).to.not.be.null;
    });
});
