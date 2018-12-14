/* global $ */
import React from 'react';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import { searchInput, search } from '../../../actions/search';
import { selectFavourites } from '../../../actions/sidebar';
import searchTabImage from '../../../assets/png/search_tab.png';
import SearchResult from '../../../components/SearchResult';
import { searchSelector as mapStateToProps } from '../../../selectors/selectors';

import favouriteShape from '../../../propTypeShapes/favourites';
import selectionShape from '../../../propTypeShapes/selection';

const SEARCH_TIMEOUT_INTERVAL = 250;

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onIconClick = this.onIconClick.bind(this);
        this.closeSearch = this.closeSearch.bind(this);
    }

    componentDidMount() {
        $(this.searchScroll).mCustomScrollbar({
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

    onIconClick(stockCode) {
        this.props.bindings.toggleFavourite(stockCode);
    }

    onClick(stockCode, stockName) {
        this.props.bindings.selectStock(stockCode, stockName);
    }

    closeSearch() {
        this.props.dispatch(selectFavourites());
    }

    render() {
        const { favourites, isSearching, hasErrors, results, term, selection } = this.props;
        const { codes, names } = favourites;
        const bindings = {
            onClick: this.onClick,
            onIconClick: this.onIconClick
        };

        return (
            <div>
                <div>
                    <img className="top-icon" src={searchTabImage} title="Search Stocks" draggable="false" />
                    <input value={term} className="sidetab searchInput" type="text" maxLength="20" placeholder="Enter stock name or symbol" onChange={this.onChange} />
                    <div className="button-icon close" title="Close Search" onClick={this.closeSearch}>&nbsp;</div>
                </div>
                <div id="search-scroll" ref={(ref) => { this.searchScroll = ref; }} className="side-scroll custom-scrollbar">
                    <div className="sidetab hiddenOnContracted">
                        {hasErrors &&
                            <div className="results-message">
                                An error occurred while retrieving data. Please check your internet connection or wait for our data services to be re-established.
                            </div>
                        }

                        {isSearching && <div className="loading-message results-message">Loading search results...</div>}

                        {!isSearching && !results && codes.map((stockCode) =>
                            <SearchResult
                              key={stockCode}
                              stock={{ code: stockCode, name: names[stockCode] }}
                              bindings={bindings}
                              selected={stockCode === selection.code}
                              isFavourite={codes.indexOf(stockCode) >= 0}
                            />)
                        }

                        {!isSearching && !results && !hasErrors && codes.length === 0 &&
                            <div className="no-favourites">
                                <p>Use the search tab to add new stocks to the list.</p>
                            </div>
                        }

                        {(results || []).map((stock) =>
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
    results: PropTypes.array, // eslint-disable-line react/forbid-prop-types
    favourites: favouriteShape.isRequired,
    selection: selectionShape.isRequired,
    term: PropTypes.string.isRequired,
    bindings: PropTypes.shape({
        toggleFavourite: PropTypes.func.isRequired,
        selectStock: PropTypes.func.isRequired
    }).isRequired,
    dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(Search);
