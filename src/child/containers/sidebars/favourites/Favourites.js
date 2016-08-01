/* global $ */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectStock, quandlResponse, insertFavouriteAt } from '../../../actions/favourites';
import { resizeToDefault } from '../../../actions/window';
import favTabImage from '../../../assets/png/favourites_tab.png';
import Favourite from '../../../components/Favourite.js';
import { favouritesSelector as mapStateToProps } from '../../../selectors/selectors';

import selectionShape from '../../../propTypeShapes/selection';
import favouritesShape from '../../../propTypeShapes/favourites';
import windowStateShape from '../../../propTypeShapes/windowState';

/*
 *  dataTransfer.getData is only available in dragstart, drop and dragEnd
 * This allows us to get around that by setting only 2 properties:
 * -> The 'text/plain' key points to the stock code
 * -> ${stockcode} is the key and points to empty string
 * By accesing the set keys and ignoring 'text/plain'
 * we get the key code of the stock being dragged
 * */
function getCodeFromDT(types) {
    for (let i = 0; i < types.length; i++) {
        if (types[i] !== 'text/plain') {    // horrible hack to access
            return (types[i]).toUpperCase();
        }
    }
    return undefined;
}

class Favourites extends Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.onIconClick = this.onIconClick.bind(this);
        this.onDragOverFavourite = this.onDragOverFavourite.bind(this);
        this.onDropOverFavourite = this.onDropOverFavourite.bind(this);
        this.onQuandlResponse = this.onQuandlResponse.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
    }

    componentDidMount() {
        const scrollPadding = 'scroll-padding';
        const el = this.refs.scrollarea;
        $(this.refs.scrollarea).mCustomScrollbar({
            scrollInertia: 0,
            mouseWheel: {
                scrollAmount: 80
            },
            callbacks: {
                onOverflowY: () => {
                    $(el).addClass(scrollPadding);
                },
                onOverflowYNone: () => {
                    $(el).removeClass(scrollPadding);
                }
            }
        });
    }

    onClick(stockCode, stockName) {
        this.props.bindings.selectStock(stockCode, stockName);
    }

    onDoubleClick(stockCode, stockName) {
        if (this.props.windowState.isCompact) {
            this.props.dispatch(resizeToDefault());
            this.props.dispatch(selectStock(stockCode, stockName));
        }
    }

    onDragOverFavourite(e, targetCode) {
        const codes = this.props.favourites.codes;
        const code = getCodeFromDT(e.dataTransfer.types);

        const indexOfCode = codes.indexOf(code);
        if (indexOfCode <= -1 || targetCode !== code) {
            e.target.classList.add('dragOver');
        }
        e.stopPropagation();
    }

    // when dropped over fav
    onDropOverFavourite(e, targetCode) {
        const codes = this.props.favourites.codes;
        const code = e.dataTransfer.getData('text/plain');
        const currentDropCodeIndex = codes.indexOf(code);
        const targetCodeLocation = codes.indexOf(targetCode);
        this.props.dispatch(insertFavouriteAt(Math.max(0, currentDropCodeIndex > targetCodeLocation ? targetCodeLocation : targetCodeLocation - 1), code));
        e.target.classList.remove('dragOver');
        e.stopPropagation();
    }

    onQuandlResponse(stockCode, stockName) {
        this.props.dispatch(quandlResponse(stockCode, stockName));
    }

    onIconClick(stockCode) {
        this.props.bindings.toggleFavourite(stockCode);
    }

    onDrop(e) {
        const codes = this.props.favourites.codes;
        const code = e.dataTransfer.getData('text/plain');
        this.props.dispatch(insertFavouriteAt(codes.length, code));
        e.currentTarget.classList.remove('dragOver');
    }

    onDragOver(e) {
        if (!e.currentTarget.classList.contains('dragOver')) {
            e.currentTarget.classList.add('dragOver');
        }
        e.preventDefault();
    }

    onDragLeave(e) {
        e.currentTarget.classList.remove('dragOver');
    }

    render() {
        const { favourites, hasErrors, isStarting, selection } = this.props;
        const codes = favourites.codes;
        let bindings = {
            dnd: {
                onDragEnter: this.onDragOverFavourite,
                onDrop: this.onDropOverFavourite
            },
            onClick: this.onClick,
            onIconClick: this.onIconClick,
            onQuandlResponse: this.onQuandlResponse,
            onDoubleClick: this.onDoubleClick
        };
        return (
            <div
              id="favDropTarget"
              className="favDropTarget"
              onDrop={this.onDrop}
              onDragOver={this.onDragOver}
              onDragLeave={this.onDragLeave}
            >
                <div className="sidetab-top">
                    <img src={favTabImage} className="top-icon" title="Favourites List" draggable="false" />
                </div>
                <div id="favourite-scroll" ref="scrollarea" className="side-scroll custom-scrollbar hiddenOnContracted">
                    <div className="sidetab">

                        {isStarting && <div className="no-favourites">
                            <p>Loading favourite stocks...</p>
                        </div>
                        }
                        {hasErrors && <div className="no-favourites errorWrapper">
                            An error occurred while retrieving data. Please check your internet connection or wait for our data services to be re-established.
                        </div>
                        }
                        {!hasErrors && codes.length === 0 && <div className="no-favourites">
                            <p>You have no favourites to display.</p>
                            <p>Use the search tab to add new stocks to the list.</p>
                        </div>
                        }
                        {codes.map(stockCode =>
                            <Favourite
                              key={stockCode}
                              stockCode={stockCode}
                              bindings={bindings}
                              selected={stockCode === selection.code}
                              isFavourite={favourites.codes.indexOf(stockCode) >= 0}
                            />)
                        }
                    </div>
                </div>
            </div>
        );
    }
}

Favourites.propTypes = {
    selection: selectionShape.isRequired,
    favourites: favouritesShape.isRequired,
    windowState: windowStateShape.isRequired,
    hasErrors: PropTypes.bool,
    isStarting: PropTypes.bool,
    bindings: PropTypes.shape({
        toggleFavourite: PropTypes.func.isRequired,
        selectStock: PropTypes.func.isRequired
    }).isRequired,
    dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(Favourites);
