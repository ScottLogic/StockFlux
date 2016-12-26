import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Version from '../../../../../src/child/components/version/Version';

describe('child/components/version/Version', () => {
    let output;
    const clickSpy = sinon.spy();

    before(() => {
        Version.__Rewire__('version', '1.2.3');
        Version.__Rewire__('currentWindowService', { openUrlWithBrowser: clickSpy });

        const renderer = TestUtils.createRenderer();
        renderer.render(<Version />);
        output = renderer.getRenderOutput();
    });

    after(() => {
        Version.__ResetDependency__('version');
        Version.__ResetDependency__('currentWindowService');
    });

    it('should render correctly', () => {
        expect(output.type).to.equal('a');
        expect(output.props.className).to.equal('version');
        expect(output.props.title).to.equal('Open project on GitHub');
        expect(output.props.onClick).to.be.a('function');

        const [versionLabel, version] = output.props.children;
        expect(versionLabel).to.equal('GitHub ');
        expect(version).to.equal('1.2.3');
    });

    it('should open StockFlux\'s GitHub page when clicked', () => {
        output.props.onClick();
        expect(clickSpy.calledOnce).to.be.true;
        expect(clickSpy.calledWithExactly('https://github.com/ScottLogic/StockFlux')).to.be.true;
    });
});
