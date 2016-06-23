import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Toolbar from './toolbar/Toolbar.js';
import SideBar from './sidebars/Sidebar.js';
import Showcase from './showcase/Showcase';
import Version from '../components/version/Version';
import { truncate } from '../services/formatters';

import DevTools from './devTools/DevTools.js';
import noFavourites from '../assets/png/no_favourites.png';

const App = ({ code, name }) => (
    <div className="main">
        <SideBar />
        <div className="main-content">
            <Toolbar />
            <img className={`no-favourites-image${code ? ' hidden' : ''}`} src={noFavourites} />
            <div className={code ? '' : 'hidden'}>
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
    name: PropTypes.string
};

function mapStateToProps(state) {
    const { selection } = state;
    const { name, code } = selection;
    return { name, code };
}

export default connect(mapStateToProps)(App);
