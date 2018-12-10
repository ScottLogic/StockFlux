import React from 'react';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';

import Favourites from './favourites/Favourites';
import ClosedWindows from './closedWindows/ClosedWindows';
import Search from './search/Search';
import { sidebarSelector as mapStateToProps } from '../../selectors/selectors';
import currentWindowService from '../../services/currentWindowService';
import { openClosedWindow } from '../../../parent/actions/parent';
import { selectFavourites, selectSearch } from '../../actions/sidebar';
import { selectStock } from '../../actions/selection';
import { toggleFavourite, moveFavouriteFromWindow } from '../../actions/favourites';
import windowStateShape from '../../propTypeShapes/windowState';
import favouritesShape from '../../propTypeShapes/favourites';
import sidebarShape from '../../propTypeShapes/sidebar';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.addActive = this.addActive.bind(this);
        this.removeActive = this.removeActive.bind(this);
        this.focusFav = this.focusFav.bind(this);
        this.focusSearch = this.focusSearch.bind(this);
        this.toggleFavourite = this.toggleFavourite.bind(this);
        this.selectStock = this.selectStock.bind(this);
        this.openWindow = this.openWindow.bind(this);

        this.state = { draggingFromAnotherWindow: false };
    }

    onDragEnter(e) {
        const dragStartWindow = this.getWindowFromDT(e.dataTransfer.types);

        if (dragStartWindow !== currentWindowService.getCurrentWindowName()) {
            this.addActive();
        }
    }

    onDragOver(e) {
        if (!e.defaultPrevented) {
            e.preventDefault();
        }
    }

    onDragLeave(e) {
        if (e.target === e.currentTarget) {
            this.removeActive();
        }
    }

    onDrop(e) {
        const code = this.getCodeFromDT(e.dataTransfer.types);
        const codes = this.props.favourites.codes;
        if (!codes.includes(code)) {
            this.props.dispatch(moveFavouriteFromWindow(code, this.getWindowFromDT(e.dataTransfer.types)));
        }
        this.removeActive();
    }

    /*
     * DataTransfer.getData is only available in dragstart, drop and dragEnd
     * We can get around that by adding our data to DataTransfer.types
     * Each element of the types array is stringified JSON
     * */
    getCodeFromDT(types) {
        for (let i = 0; i < types.length; i += 1) {
            const dataTransferObj = JSON.parse(types[i]);
            if (Object.keys(dataTransferObj)[0] === 'code') {
                return dataTransferObj.code.toUpperCase();
            }
        }
        return undefined;
    }

    getWindowFromDT(types) {
        for (let i = 0; i < types.length; i += 1) {
            const dataTransferObj = JSON.parse(types[i]);
            if (Object.keys(dataTransferObj)[0] === 'window') {
                return dataTransferObj.window;
            }
        }
        return undefined;
    }

    addActive() {
        if (!this.state.draggingFromAnotherWindow) {
            this.setState({ draggingFromAnotherWindow: true });
        }
    }

    removeActive() {
        if (this.state.draggingFromAnotherWindow) {
            this.setState({ draggingFromAnotherWindow: false });
        }
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
    }

    selectStock(stockCode, stockName) {
        if (!this.props.windowState.isCompact) {
            this.props.dispatch(selectStock(stockCode, stockName));
        }
    }

    openWindow(windowName) {
        this.props.dispatch(openClosedWindow(windowName));
    }

    render() {
        const { sidebar, closedWindowsCount } = this.props;

        const searchBindings = {
            toggleFavourite: this.toggleFavourite,
            selectStock: this.selectStock
        };
        const favouritesBindings = {
            ...searchBindings,
            getCodeFromDT: this.getCodeFromDT
        };

        const sidebarsClass = classNames({
            active: this.state.draggingFromAnotherWindow
        });

        const searchClass = classNames({
            expanded: sidebar.showSearch,
            contracted: sidebar.showFavourites
        });

        const favouritesClass = classNames({
            expanded: sidebar.showFavourites,
            contracted: sidebar.showSearch
        });

        return (
            <div className={`sidebars ${sidebarsClass}`} onDragEnter={this.onDragEnter} onDragOver={this.onDragOver} onDragLeave={this.onDragLeave} onDrop={this.onDrop}>
                <div className={`search main-search ${searchClass}`} onClick={this.focusSearch}>
                    <Search bindings={searchBindings} />
                </div>
                <div className={`search compact-search ${searchClass}`} onClick={this.focusSearch}>
                    <Search bindings={searchBindings} />
                </div>
                <div className={`favourites ${favouritesClass}`} onClick={this.focusFav}>
                    <Favourites bindings={favouritesBindings} />
                </div>
                <div className="closed-window-selection">
                    {closedWindowsCount ? <ClosedWindows openWindow={this.openWindow} /> : null}
                </div>
            </div>
        );
    }
}
Sidebar.propTypes = {
    dispatch: PropTypes.func.isRequired,
    sidebar: sidebarShape.isRequired,
    windowState: windowStateShape.isRequired,
    favourites: favouritesShape.isRequired,
    closedWindowsCount: PropTypes.number.isRequired
};

export default connect(mapStateToProps)(Sidebar);
