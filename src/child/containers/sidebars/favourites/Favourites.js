/* global $ */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { quandlResponse, insertFavouriteAt } from '../../../actions/favourites';
import { selectStock } from '../../../actions/selection';
import { resizeToPrevious } from '../../../actions/window';
import { favouriteDroppedOutside } from '../../../../parent/actions/parent';
import favTabImage from '../../../assets/png/favourites_tab.png';
import Favourite from '../../../components/favourite/Favourite.js';
import { favouritesSelector as mapStateToProps } from '../../../selectors/selectors';

import selectionShape from '../../../propTypeShapes/selection';
import favouritesShape from '../../../propTypeShapes/favourites';
import windowStateShape from '../../../propTypeShapes/windowState';

class Favourites extends Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.onIconClick = this.onIconClick.bind(this);
        this.onQuandlResponse = this.onQuandlResponse.bind(this);
        this.onModalConfirmClick = this.onModalConfirmClick.bind(this);
        this.onModalBackdropClick = this.onModalBackdropClick.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDropOutside = this.onDropOutside.bind(this);

        this.state = { unfavouritingStockCode: null };
    }

    componentDidMount() {
        const scrollPadding = 'scroll-padding';
        const el = this.scrollArea;
        $(el).mCustomScrollbar({
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

    componentWillUpdate(nextProps, nextState) {
        if (nextState.unfavouritingStockCode !== this.state.unfavouritingStockCode) {
            $(this.scrollArea).mCustomScrollbar(nextState.unfavouritingStockCode ? 'disable' : 'update');
        }
    }

    onClick(stockCode, stockName) {
        return (e) => {
            if (!e.defaultPrevented) {
                this.props.bindings.selectStock(stockCode, stockName);
            }
        };
    }

    onDoubleClick(stockCode, stockName) {
        if (this.props.windowState.isCompact) {
            this.props.dispatch(resizeToPrevious());
            this.props.dispatch(selectStock(stockCode, stockName));
        }
    }

    onQuandlResponse(stockCode, stockName) {
        this.props.dispatch(quandlResponse(stockCode, stockName));
    }

    onIconClick(stockCode) {
        return (e) => {
            this.setState({ unfavouritingStockCode: stockCode });
            e.preventDefault();
        };
    }

    onModalConfirmClick(stockCode) {
        return () => {
            this.setState({ unfavouritingStockCode: null });
            this.props.bindings.toggleFavourite(stockCode);
        };
    }

    onModalBackdropClick(e) {
        this.setState({ unfavouritingStockCode: null });
        e.stopPropagation();
    }

    onDropOutside(stockCode, { screenX, screenY, clientX, offsetY }) {
        const dropX = screenX - clientX;
        const dropY = screenY - (this.sidetabTop.getBoundingClientRect().height + offsetY);
        this.props.dispatch(favouriteDroppedOutside(stockCode, [dropX, dropY]));
    }

    onDragStart(e) {
        const { favourites, bindings } = this.props;

        this.setState({
            dragOverIndex: favourites.codes.indexOf(bindings.getCodeFromDT(e.dataTransfer.types)),
            favouriteHeight: e.target.getBoundingClientRect().height,
            dragStartClientY: e.nativeEvent.clientY
        });
    }

    onDragOver(e) {
        const { props, state } = this;
        const { favourites, bindings } = props;
        const { codes } = favourites;
        const { dragOverIndex, favouriteHeight, dragStartClientY } = state;

        if (dragStartClientY) {
            const dragOverIndexOffset = Math.ceil((((e.nativeEvent.clientY - dragStartClientY) / (favouriteHeight / 2)) + 1) / 2);
            const currentDraggedIndex = codes.indexOf(bindings.getCodeFromDT(e.dataTransfer.types));
            let nextDragOverIndex = currentDraggedIndex + dragOverIndexOffset;

            if (nextDragOverIndex <= currentDraggedIndex) {
                nextDragOverIndex--;
            }

            if (codes[nextDragOverIndex] && nextDragOverIndex !== dragOverIndex) {
                this.setState({ dragOverIndex: nextDragOverIndex });
            } else if (nextDragOverIndex >= codes.length) {
                this.setState({ dragOverIndex: codes.length });
            }
        }

        e.preventDefault();
    }

    onDragEnd() {
        this.setState({ dragStartClientY: null, dragOverIndex: null });
    }

    onDrop(e) {
        const { props, state } = this;
        const { dispatch, favourites, bindings } = props;
        const { dragOverIndex, dragStartClientY } = state;

        const code = bindings.getCodeFromDT(e.dataTransfer.types);

        if (dragStartClientY) {
            const currentDraggedIndex = favourites.codes.indexOf(code);
            dispatch(insertFavouriteAt(Math.max(0, currentDraggedIndex > dragOverIndex ? dragOverIndex : dragOverIndex - 1), code));
        } else {
            if (!favourites.codes.includes(code)) {
                dispatch(insertFavouriteAt(favourites.codes.length, code));
            }
        }
    }

    render() {
        const { favourites, hasErrors, isStarting, selection } = this.props;
        const { unfavouritingStockCode, dragOverIndex } = this.state;
        const codes = favourites.codes;

        let bindings = {
            onClick: this.onClick,
            onQuandlResponse: this.onQuandlResponse,
            onModalConfirmClick: this.onModalConfirmClick,
            onModalBackdropClick: this.onModalBackdropClick,
            onIconClick: this.onIconClick,
            onDoubleClick: this.onDoubleClick,
            onDropOutside: this.onDropOutside
        };
        return (
            <div
              id="favDropTarget"
              className="favDropTarget"
              onDragStart={this.onDragStart}
              onDragOver={this.onDragOver}
              onDragEnd={this.onDragEnd}
              onDragLeave={this.onDragLeave}
              onDrag={this.onDrag}
              onDrop={this.onDrop}
              onDragLeave={this.onDragLeave}
            >
                <div className="sidetab-top" ref={ref => { this.sidetabTop = ref; }}>
                    <img src={favTabImage} className="top-icon" title="Favourites List" draggable="false" />
                </div>
                <div id="favourite-scroll" ref={ref => { this.scrollArea = ref; }} className="side-scroll custom-scrollbar hiddenOnContracted">
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
                        {codes.map((stockCode, i) =>
                            <Favourite
                              key={stockCode}
                              stockCode={stockCode}
                              bindings={bindings}
                              selected={stockCode === selection.code}
                              isFavourite={codes.indexOf(stockCode) >= 0}
                              isUnfavouriting={unfavouritingStockCode === stockCode}
                              dragOver={dragOverIndex === i}
                              dragOverBottom={dragOverIndex === codes.length && i === codes.length - 1}
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
        selectStock: PropTypes.func.isRequired,
        getCodeFromDT: PropTypes.func.isRequired
    }).isRequired,
    dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(Favourites);
