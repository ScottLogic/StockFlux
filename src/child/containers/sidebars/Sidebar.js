import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Favourites from './Favourites/Favourites.js';
import Search from './Search/Search.js';

import {selectFavourites, selectSearch} from '../../actions/sidebar';

function notifyParent(eventName, payload) {
    var e = new CustomEvent(eventName, {'detail': payload});
    window.opener.dispatchEvent(e);
}

export default class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.focusFav = this.focusFav.bind(this);
        this.focusSearch = this.focusSearch.bind(this);
    }

    focusFav() {
        !this.props.sidebar.showFavourites && this.props.dispatch(selectFavourites());
    }

    focusSearch() {
        !this.props.sidebar.showSeach && this.props.dispatch(selectSearch());
    }

    render() {
        const {sidebar} = this.props;

        return (
            <div className="sidebars">
                <div className={'search main-search ' + (sidebar.showSeach ? 'expanded' : 'contracted')} onClick={this.focusSearch}>
                    <Search/>
                </div>
                <div className={'favourites ' + (sidebar.showFavourites ? 'expanded' : 'contracted')} onClick={this.focusFav}>
                    <Favourites/>
                </div>

                <div className="closed-window-selection">
                    <closed-window-list icon="'closed_tabs'"></closed-window-list>
                </div>
            </div>

        );
    }
}
Sidebar.propTypes = {
    dispatch: PropTypes.func.isRequired,
    sidebar: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    var {sidebar} = state;
    return {sidebar};
}
export default connect(mapStateToProps)(Sidebar);
