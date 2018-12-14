import React from 'react';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';

import Toolbar from './toolbar/Toolbar';
import SideBar from './sidebars/Sidebar';
import Showcase from './showcase/Showcase';
import Version from '../components/version/Version';
import { truncate } from '../services/formatters';
import { appSelector as mapStateToProps } from '../selectors/selectors';

import noFavourites from '../assets/png/no_favourites.png';

import windowStateShape from '../propTypeShapes/windowState';

const App = ({ code, name, windowState }) => (
    <div className={`main${windowState.isCompact ? ' compact' : ''}`}>
        <SideBar />
        <div className="main-content">
            <Toolbar />
            <img className={`no-favourites-image${code ? ' hidden' : ''}`} src={noFavourites} />
            <div className={`showcase${code ? '' : ' hidden'}`}>
                <div id="showcase-title">
                    <div className="code">{code}</div> <div className="name">{name ? `(${truncate(name)})` : ''}</div>
                </div>
                {!windowState.isCompact && <Showcase code={code} />}
            </div>
            <Version />
        </div>
    </div>
);

App.propTypes = {
    code: PropTypes.string,
    name: PropTypes.string,
    windowState: windowStateShape.isRequired
};

export default connect(mapStateToProps)(App);
