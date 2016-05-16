/* global $ */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { searchInput, search, clearSearch, selectStock, toggleFavourite } from '../../../actions/sidebar';
import searchTabImage from '../../../assets/png/search_tab.png';
import SearchResult from '../../../components/SearchResult.js';
const SEARCH_TIMEOUT_INTERVAL = 250;

class Search extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onIconClick = this.onIconClick.bind(this);
        this.clear = this.clear.bind(this);
    }

    componentDidMount() {
        $(this.refs.searchscroll).mCustomScrollbar({
            scrollInertia: 0,
            mouseWheel: {
                scrollAmount: 80
            }
        });
    }

    onChange(e) {
        const query = e.target.value;
        this.props.dispatch(searchInput(query));

        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
            this.props.dispatch(search(query));
        }, SEARCH_TIMEOUT_INTERVAL);
    }

    onIconClick(stock) {
        this.props.dispatch(toggleFavourite(stock.code));
    }

    onClick(stock) {
        this.props.dispatch(selectStock(stock.code, stock.name));
    }

    clear() {
        this.props.dispatch(clearSearch());
    }

    render() {
        const { favourites, isSearching, hasErrors, results, term, selection } = this.props;
        const codes = favourites.codes;
        let bindings = {
            onClick: this.onClick,
            onIconClick: this.onIconClick
        };
        return (
            <div>
                <div>
                    <img className="top-icon" src={searchTabImage} title="Search Stocks" draggable="false" />
                    <input value={term} className="sidetab hiddenOnContracted" type="text" maxLength="20" placeholder="Enter stock name or symbol" onChange={this.onChange} />
                    <div className="button-icon close hiddenOnContracted" title="Close Search" onClick={this.clear}>&nbsp;</div>
                </div>
                <div id="search-scroll" ref="searchscroll" className="side-scroll custom-scrollbar">
                    <div className="sidetab hiddenOnContracted">
                        {hasErrors && <div className="results-message">
                            An error occurred while retrieving data. Please check your internet connection or wait for our data services to be re-established.
                        </div>
}
                        {isSearching && <div className="loading-message results-message">Loading search results...</div>}

                        {(results || []).map(stock =>
                            <SearchResult
                              key={stock.code}
                              stock={stock}
                              bindings={bindings}
                              selected={stock.code === selection.code}
                              isFavourite={codes.indexOf(stock.code) >= 0}
                            />)}
                        {results && results.length === 0 && !hasErrors && !isSearching && <div className="results-message no-results">
                            Oops!<br />
                            Looks like no matches were found.
                        </div>}
                    </div>
                </div>
            </div>
        );
    }
}
Search.propTypes = {
    isSearching: PropTypes.bool,
    hasErrors: PropTypes.bool,
    results: PropTypes.array,
    favourites: PropTypes.object,
    selection: PropTypes.object.isRequired,
    term: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    const { favourites, selection } = state;
    const { isSearching, hasErrors, results, term } = state && state.search;
    return { favourites, isSearching, hasErrors, results, term, selection };
}

export default connect(mapStateToProps)(Search);
