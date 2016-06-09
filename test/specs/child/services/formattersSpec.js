import { expect } from 'chai';
import { truncate } from '../../../../src/child/services/formatters';

describe('child/services/formatters', () => {
    describe('truncate', () => {
        it('should return undefined for an input of undefined', () => {
            const input = undefined;
            expect(truncate(input)).not.to.be.defined;
        });

        it('should return null for an input of null', () => {
            const input = null;
            expect(truncate(input)).to.be.null;
        });

        it('should return empty string for an input of empty string', () => {
            const input = '';
            expect(truncate(input)).to.equal('');
        });

        it('should remove the space before and all content after the first opening bracket', () => {
            const name = 'Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume';
            expect(truncate(name)).to.equal('Alphabet Inc');
        });

        it('should return the input string if the string doesn\'t contain an opening bracket', () => {
            const name = 'Alphabet Inc';
            expect(truncate(name)).to.equal('Alphabet Inc');
        });
    });
});
