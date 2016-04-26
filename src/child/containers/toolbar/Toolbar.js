import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
    minimise,
    maximise,
    unMaximise,
    compact,
    expand
} from '../../actions/window.js';
import icon from '../../assets/png/scottlogic_logo.png';


class Toolbar extends Component {
    constructor(props) {
        super(props);
        this.onMinimize = this.onMinimize.bind(this);
        this.onCompact = this.onCompact.bind(this);
        this.onFullView = this.onFullView.bind(this);
        this.onMaximise = this.onMaximise.bind(this);
        this.onUnMaximise = this.onUnMaximise.bind(this);
        this.onClose = this.onClose.bind(this);
        // reset maximize state on window resize
        // addEventListener('resize', onResize.bind(this), false);
    }

    onMinimize() {
        this.props.dispatch(minimise());
        fin.desktop.Window.getCurrent().minimize();
    }

    onCompact() {
        this.props.dispatch(compact());
    }

    onFullView() {
        this.props.dispatch(expand());
    }

    onMaximise() {
        this.props.dispatch(maximise());
        fin.desktop.Window.getCurrent().maximize();
    }

    onUnMaximise() {
        this.props.dispatch(unMaximise());
        fin.desktop.Window.getCurrent().restore();
    }

    onClose() {
        // notifyParent(WINDOW_CLOSE, {
        //     name: window.name,
        //     state: this.props.windowState
        // });
        // this.props.dispatch(close());
        // console.log('    state', this)
        window.close();
    }

    render() {
        const { windowState } = this.props;
        return (
            <div className="toolbarWrapper drag">
                <img id="logo" src={icon} className="logo" alt="Scott Logic" />
                <div className="wrapper action">
                    <div className="icon minimise" onClick={this.onMinimize} title="Minimize">&nbsp;</div>
                    {windowState.isCompact
                        ? <div className="icon full_view" onClick={this.onFullView} title="Full View">&nbsp;</div>
                        : <div className="icon compact" onClick={this.onCompact} title="Compact View">&nbsp;</div>
                    }
                    {!windowState.isCompact && (windowState.isMaximised
                        ? <div className="icon normal_size" onClick={this.onUnMaximise} title="Restore" ng-show="toolbarCtrl.maximised && !toolbarCtrl.isCompact()">&nbsp;</div>
                        : <div className="icon maximise" onClick={this.onMaximise} title="Maximise" ng-show="!toolbarCtrl.maximised && !toolbarCtrl.isCompact()">&nbsp;</div>
                    )}
                    <div className="icon close" onClick={this.onClose} title="Close">&nbsp;</div>
                </div>
            </div>
        );
    }
}

Toolbar.propTypes = {
    windowState: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    const { windowState } = state;
    return { windowState };
}

export default connect(mapStateToProps)(Toolbar);
