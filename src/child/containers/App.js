import React from 'react';
import { connect } from 'react-redux';
import Toolbar from './toolbar/Toolbar.js';
import SideBar from './sidebars/Sidebar.js';

import DevTools from './devTools/DevTools.js';

const App = () => (
    <div className="main">
        <SideBar />
        <div className="main-content">
            <Toolbar />
        </div>
        <DevTools />
    </div>
);

export default connect()(App);
