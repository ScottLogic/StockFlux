import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { toggleFavourite, selectStock } from '../../../actions/sidebar';
import favTabImage from '../../../assets/png/favourites_tab.png';
import Favourite from '../../../components/Favourite.js';

class Favourites extends Component {
    constructor(props) {
        super(props);
        this.onDrag = this.onDrag.bind(this);
        this.onClick = this.onClick.bind(this);
        this.toggleFavourite = this.toggleFavourite.bind(this);
    }

    onClick(stock) {
        this.props.dispatch(selectStock(stock.code, stock.name));
    }

    onDrag() {
        // TODO: send content to tearout
    }

    toggleFavourite(stock) {
        this.props.dispatch(toggleFavourite(stock.code, stock));
    }

    render() {

        const { favourites, hasErrors, isStarting, selection } = this.props;
        let bindings = {
            onClick: this.onClick,
            onIconClick: this.toggleFavourite,
            onDrag: this.onDrag
        };
        return (
            <div>
                <div className="sidetab-top">
                    <img src={favTabImage} className="top-icon" title="Favourites List" draggable="false" />
                </div>
                <div id="favourite-scroll" className="side-scroll custom-scrollbar hiddenOnContracted">
                    <div className="sidetab">

                        {isStarting && <div className="no-favourites">
                            <p>Loading favourite stocks...</p>
                        </div>
                        }
                        {hasErrors && <div className="no-favourites errorWrapper">
                            An error occurred while retrieving data. Please check your internet connection or wait for our data services to be re-established.
                        </div>
                        }
                        {!hasErrors && favourites.length === 0 && <div className="no-favourites">
                            <p>You have no favourites to display.</p>
                            <p>Use the search tab to add new stocks to the list.</p>
                        </div>
                        }
                        {favourites && favourites.length > 0 && (favourites || []).map(stock =>
                            <Favourite key={stock.code} stock={stock} bindings={bindings} selected={stock.code === selection.code} />)}
                    </div>
                </div>
            </div>
        );
    }
}
Favourites.propTypes = {
    selection: PropTypes.object,
    favourites: PropTypes.array,
    hasErrors: PropTypes.bool,
    isStarting: PropTypes.bool,
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    const { favourites, selection } = state;
    // TODO: create logic for 'isStarting
    return { favourites, selection, isStarting: false, hasErrors: false };
}
export default connect(mapStateToProps)(Favourites);
