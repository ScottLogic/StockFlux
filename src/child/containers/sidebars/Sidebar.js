import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Favourites from './favourites/Favourites.js';
import Search from './search/Search.js';
import { sidebarSelector as mapStateToProps } from '../../selectors/selectors';

import { selectFavourites, selectSearch } from '../../actions/sidebar';
import { selectStock, unselectStock } from '../../actions/selection';
import { toggleFavourite, insertFavouriteAt } from '../../actions/favourites';

import windowStateShape from '../../propTypeShapes/windowState';
import selectionShape from '../../propTypeShapes/selection';
import favouritesShape from '../../propTypeShapes/favourites';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.addActive = this.addActive.bind(this);
        this.removeActive = this.removeActive.bind(this);
        this.focusFav = this.focusFav.bind(this);
        this.focusSearch = this.focusSearch.bind(this);
        this.toggleFavourite = this.toggleFavourite.bind(this);
        this.selectStock = this.selectStock.bind(this);
    }

    onDragOver(e) {
        if (!e.defaultPrevented && !this.props.sidebar.showFavourites) {
            this.addActive();
            e.preventDefault();
        }
    }

    onDrop(e) {
        const code = this.getCodeFromDT(e.dataTransfer.types);
        const codes = this.props.favourites.codes;
        if (!codes.includes(code)) {
            this.props.dispatch(insertFavouriteAt(codes.length, code));
        }
        this.removeActive();
    }

    getCodeFromDT(types) {
        for (let i = 0; i < types.length; i++) {
            if (types[i] !== 'text/plain') {
                return (types[i]).toUpperCase();
            }
        }
        return undefined;
    }

    addActive() {
        this.favourites.classList.add('active');
    }

    removeActive() {
        this.favourites.classList.remove('active');
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
            selectStock: this.selectStock,
            getCodeFromDT: this.getCodeFromDT,
            addActive: this.addActive,
            removeActive: this.removeActive
        };

        return (
            <div className="sidebars" onDragOver={this.onDragOver} onDragLeave={this.removeActive} onDrop={this.onDrop}>
                <div className={`search main-search ${sidebar.showSearch ? 'expanded' : 'contracted'}`} onClick={this.focusSearch}>
                    <Search bindings={bindings} />
                </div>
                <div className={`search compact-search ${sidebar.showSearch ? 'expanded' : 'contracted'}`} onClick={this.focusSearch}>
                    <Search bindings={bindings} />
                </div>
                <div className={`favourites ${sidebar.showFavourites ? 'expanded' : 'contracted'}`} onClick={this.focusFav} ref={ref => { this.favourites = ref; }}>
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
    windowState: windowStateShape.isRequired,
    selection: selectionShape.isRequired,
    favourites: favouritesShape.isRequired
};

export default connect(mapStateToProps)(Sidebar);
