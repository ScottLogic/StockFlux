import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Toolbar from './toolbar/Toolbar.js';
import SideBar from './sidebars/Sidebar.js';
import Showcase from './showcase/Showcase';
import Version from '../components/version/Version';
import { truncate } from '../services/formatters';

import DevTools from './devTools/DevTools.js';
import '../../../node_modules/d3fc/dist/d3fc.min.css';
import '../../../node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css';
import noFavourites from '../assets/png/no_favourites.png';
require('script!../../../node_modules/jquery/dist/jquery.min.js');
require('script!../../../node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js');
require('script!../../../node_modules/moment/moment.js');
require('script!../../../node_modules/BitFlux/node_modules/bootstrap/js/dropdown.js');
require('script!../../../node_modules/d3fc/dist/d3fc.bundle.min.js');
require('script!../../../node_modules/BitFlux/dist/bitflux.js');

const App = ({ code, name, windowState }) => (
    <div className={`main${windowState.isCompact ? ' compact' : ''}`}>
        <SideBar />
        <div className="main-content">
            <Toolbar />
            <img className={`no-favourites-image${code ? ' hidden' : ''}`} src={noFavourites} />
            <div className={`showcase${code && !windowState.isResizing ? '' : ' hidden'}`}>
                <div id="showcase-title">
                    <div className="code">{code}</div> <div className="name">({truncate(name)})</div>
                </div>
                <Showcase code={code} />
            </div>
            <Version />
        </div>
        {DevTools && <DevTools />}
    </div>
);

App.propTypes = {
    code: PropTypes.string,
    name: PropTypes.string,
    windowState: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    const { selection, windowState } = state;
    const { name, code } = selection;
    return { name, code, windowState };
}

export default connect(mapStateToProps)(App);
