import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    resizeToCompact,
    resizeToPrevious
} from '../../actions/window.js';
import { toolbarSelector as mapStateToProps } from '../../selectors/selectors';
import icon from '../../assets/png/scottlogic_logo.png';

import windowStateShape from '../../propTypeShapes/windowState';

class Toolbar extends Component {
    constructor(props) {
        super(props);
        this.onMinimizeClick = this.onMinimizeClick.bind(this);
        this.onCompactClick = this.onCompactClick.bind(this);
        this.onFullViewClick = this.onFullViewClick.bind(this);
        this.onMaximizeClick = this.onMaximizeClick.bind(this);
        this.onRestoreClick = this.onRestoreClick.bind(this);
        this.onCloseClick = this.onCloseClick.bind(this);

        // reset maximize state on window resize
    }

    onMinimizeClick() {
        const { dispatch } = this.props;
        dispatch(minimizeWindow());
    }

    onCompactClick() {
        const { dispatch } = this.props;
        dispatch(resizeToCompact());
    }

    onFullViewClick() {
        const { dispatch } = this.props;
        dispatch(resizeToPrevious());
    }

    onMaximizeClick() {
        const { dispatch } = this.props;
        dispatch(maximizeWindow());
    }

    onRestoreClick() {
        const { dispatch } = this.props;
        dispatch(restoreWindow());
    }

    onCloseClick() {
        fin.desktop.Window.getCurrent().contentWindow.close();
    }

    render() {
        const { windowState } = this.props;
        return (
            <div className="toolbarWrapper drag">
                <img id="logo" src={icon} className="logo" alt="Scott Logic" />
                <div className="wrapper action">
                    <div className="button-icon minimize" onClick={this.onMinimizeClick} title="Minimize">&nbsp;</div>
                    {windowState.isCompact
                        ? <div className="button-icon full_view" onClick={this.onFullViewClick} title="Full View">&nbsp;</div>
                        : <div className="button-icon compact" onClick={this.onCompactClick} title="Compact View">&nbsp;</div>
                    }
                    {!windowState.isCompact && (windowState.isMaximized
                        ? <div className="button-icon normal_size" onClick={this.onRestoreClick} title="Restore">&nbsp;</div>
                    : <div className="button-icon maximize" onClick={this.onMaximizeClick} title="Maximize">&nbsp;</div>
                    )}
                    <div className="button-icon closeIcon" onClick={this.onCloseClick} title="Close">&nbsp;</div>
                </div>
            </div>
        );
    }
}

Toolbar.propTypes = {
    windowState: windowStateShape.isRequired,
    dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(Toolbar);
