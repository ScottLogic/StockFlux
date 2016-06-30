import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Favourites from './favourites/Favourites.js';
import Search from './search/Search.js';

import { selectFavourites, selectSearch, toggleFavourite, selectStock, unselectStock } from '../../actions/sidebar';


class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.focusFav = this.focusFav.bind(this);
        this.focusSearch = this.focusSearch.bind(this);
        this.toggleFavourite = this.toggleFavourite.bind(this);
        this.selectStock = this.selectStock.bind(this);
    }

    focusFav() {
        if (!this.props.sidebar.showFavourites) {
            this.props.dispatch(selectFavourites());
        }
    }

    focusSearch() {
        if (!this.props.sidebar.showSearch) {
            this.props.dispatch(selectSearch());
        }
    }

    toggleFavourite(stockCode) {
        this.props.dispatch(toggleFavourite(stockCode));

        const isFavourite = this.props.favourites.codes.some(favourite => favourite === stockCode);
        if (this.props.selection.code === stockCode && isFavourite) {
            if (this.props.favourites.codes.length >= 2) {
                const newStockCode = this.props.favourites.codes.find(favourite => favourite !== stockCode);
                const newStockName = this.props.favourites.names[newStockCode];
                this.props.dispatch(selectStock(newStockCode, newStockName));
            } else {
                this.props.dispatch(unselectStock());
            }
        }
    }

    selectStock(stockCode, stockName) {
        if (!this.props.windowState.isCompact) {
            this.props.dispatch(selectStock(stockCode, stockName));
        }
    }

    render() {
        const { sidebar } = this.props;

        let bindings = {
            toggleFavourite: this.toggleFavourite,
            selectStock: this.selectStock
        };

        return (
            <div className="sidebars">
                <div className={`search main-search ${sidebar.showSearch ? 'expanded' : 'contracted'}`} onClick={this.focusSearch}>
                    <Search bindings={bindings} />
                </div>
                <div className={`search compact-search ${sidebar.showSearch ? 'expanded' : 'contracted'}`} onClick={this.focusSearch}>
                    <Search bindings={bindings} />
                </div>
                <div className={`favourites ${sidebar.showFavourites ? 'expanded' : 'contracted'}`} onClick={this.focusFav}>
                    <Favourites bindings={bindings} />
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
    sidebar: PropTypes.object.isRequired,
    windowState: PropTypes.object.isRequired,
    selection: PropTypes.object.isRequired,
    favourites: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    const { sidebar, selection, favourites, windowState } = state[fin.desktop.Window.getCurrent().contentWindow.name];
    return { sidebar, selection, favourites, windowState };
}
export default connect(mapStateToProps)(Sidebar);
