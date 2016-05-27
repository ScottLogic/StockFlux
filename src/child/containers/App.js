import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Toolbar from './toolbar/Toolbar.js';
import SideBar from './sidebars/Sidebar.js';
import Showcase from './showcase/Showcase';
import Version from '../components/version/Version';
import { truncate } from '../services/formatters';


import DevTools from './devTools/DevTools.js';
import '../../../node_modules/d3fc/dist/d3fc.min.css';
import '../../../node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css';
require('script!../../../node_modules/jquery/dist/jquery.min.js');
require('script!../../../node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js');
require('script!../../../node_modules/moment/moment.js');
require('script!../../../node_modules/BitFlux/node_modules/bootstrap/js/dropdown.js');
require('script!../../../node_modules/d3fc/dist/d3fc.bundle.min.js');
require('script!../../../node_modules/BitFlux/dist/bitflux.js');

class App extends Component {
    componentDidMount() {
        const { isMaximised } = this.props;
        fin.desktop.main(() => {
            const win = fin.desktop.Window.getCurrent();
            if (isMaximised) {
                win.maximize();
            }
        });
    }

    componentWillUpdate(nextProps) {
        const { isMaximised } = this.props;
        const nextIsMaximised = nextProps.isMaximised;

        if (nextIsMaximised !== isMaximised) {
            if (nextIsMaximised) {
                fin.desktop.Window.getCurrent().maximize();
            } else {
                fin.desktop.Window.getCurrent().restore();
            }
        }
    }

    render() {
        const { code, name } = this.props;
        return (
            <div className="main">
                <SideBar />
                <div className="main-content">
                    <Toolbar />
                    <div className={code ? '' : 'hidden'}>
                        <div id="showcase-title">
                            <div className="code">{code}</div> <div className="name">({truncate(name)})</div>
                        </div>
                        <Showcase code={code} />
                    </div>
                    <Version />
                </div>
                <DevTools />
            </div>
        );
    }
}

App.propTypes = {
    code: PropTypes.string,
    name: PropTypes.string,
    isMaximised: PropTypes.bool
};

function mapStateToProps(state) {
    const { selection, windowState } = state;
    const { name, code } = selection;
    const { isMaximised } = windowState;
    return { name, code, isMaximised };
}

export default connect(mapStateToProps)(App);
