/* global $ */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

<<<<<<< 3c1bf73e18a6ca250c07ca258da95eec9b740c20
import { selectStock, quandlResponse, insertFavouriteAt } from '../../../actions/sidebar';
=======
import { selectStock, unselectStock, toggleFavourite, quandlResponse, insertFavouriteAt } from '../../../actions/sidebar';
import { close } from '../../../actions/window';
>>>>>>> feat: Added drag out of current window support
import favTabImage from '../../../assets/png/favourites_tab.png';
import Favourite from '../../../components/Favourite.js';

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
        this.onDropOutside = this.onDropOutside.bind(this);
    }

    componentDidMount() {
        this.addDropTarget('favDropTarget');
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
        this.props.dispatch(selectStock(stockCode, stockName));
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

    onDropOutside(e, stockCode) {
        // Notify the parent to spawn a new window with this stockCode
        fin.desktop.InterApplicationBus.publish(
            'spawnNewWindow',
            { stockCode, stockName: this.props.favourites.names[stockCode] }
        );

        // Unfavourite the stock from this window
        this.toggleFavourite(stockCode);

        if (!this.props.favourites.codes.length) {
            this.props.dispatch(close());
        }
        e.stopPropagation();
    }

    onQuandlResponse(stockCode, stockName) {
        this.props.dispatch(quandlResponse(stockCode, stockName));
    }

    onIconClick(stockCode) {
        this.props.bindings.toggleFavourite(stockCode);
    }

    addDropTarget(id) {
        const dropTarget = document.getElementById(id);
        this.dropTarget = dropTarget;

        dropTarget.addEventListener('drop', e => {
            const codes = this.props.favourites.codes;
            const code = e.dataTransfer.getData('text/plain');
            this.props.dispatch(insertFavouriteAt(codes.length, code));
            dropTarget.classList.remove('dragOver');
        }, false);

        dropTarget.addEventListener('dragover', e => {
            if (!dropTarget.classList.contains('dragOver')) {
                dropTarget.classList.add('dragOver');
            }
            e.preventDefault();
        }, false);

        dropTarget.addEventListener('dragleave', () => {
            dropTarget.classList.remove('dragOver');
        }, false);
    }

<<<<<<< 3c1bf73e18a6ca250c07ca258da95eec9b740c20
=======
    toggleFavourite(stockCode) {
        if (this.props.selection.code === stockCode) {
            if (this.props.favourites.codes.length >= 2) {
                const newStockCode = this.props.favourites.codes.find(favourite => favourite !== stockCode);
                const newStockName = this.props.favourites.names[newStockCode];
                this.props.dispatch(selectStock(newStockCode, newStockName));
            } else {
                this.props.dispatch(unselectStock());
            }
        }
        this.props.dispatch(toggleFavourite(stockCode));
    }
>>>>>>> feat: Added drag out of current window support

    render() {
        const { favourites, hasErrors, isStarting, selection } = this.props;
        const codes = favourites.codes;
        let bindings = {
            dnd: {
                onDragEnter: this.onDragOverFavourite,
                onDrop: this.onDropOverFavourite,
                onDropOutside: this.onDropOutside
            },
            onClick: this.onClick,
            onIconClick: this.onIconClick,
            onQuandlResponse: this.onQuandlResponse
        };
        return (
            <div id="favDropTarget" className="favDropTarget" >
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
    selection: PropTypes.object,
    favourites: PropTypes.object.isRequired,
    hasErrors: PropTypes.bool,
    isStarting: PropTypes.bool,
    bindings: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    const { favourites, selection } = state;
    // TODO: create logic for 'isStarting
    return { favourites, selection, isStarting: false, hasErrors: false };
}
export default connect(mapStateToProps)(Favourites);
