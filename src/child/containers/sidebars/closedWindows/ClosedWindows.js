import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { closedWindowsSelector as mapStateToProps } from '../../../selectors/selectors';

import closedWindowsImageInactive from '../../../assets/png/closed_tabs.png';
import closedWindowsImageActive from '../../../assets/png/closed_tabs_active.png';

class ClosedWindows extends Component {

    constructor(props) {
        super(props);
        this.onIconClick = this.onIconClick.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
    }

    componentWillMount() {
        this.setState({ iconHover: false, modalOpen: false });
    }

    onIconClick(e) {
        e.stopPropagation();
        if (Object.values(this.props.closedWindows).length) {
            this.setState({ modalOpen: true });
        }
    }

    onMouseOver() {
        this.setState({ iconHover: true });
    }

    onMouseOut() {
        this.setState({ iconHover: false });
    }

    render() {
        const { iconHover, modalOpen } = this.state;
        const icon = iconHover || modalOpen ? closedWindowsImageActive : closedWindowsImageInactive;

        const closedWindows = this.props.closedWindows || {};
        const closedWindowsNames = Object.keys(closedWindows) || [];

        return (
            <div>
                {modalOpen && <div className="favourite-closed-cover" onClick={() => this.setState({ modalOpen: false })}>
                    <div className="bubble-head"></div>
                    <div className="closed-selection">
                        {closedWindowsNames.map(closedWindowName =>
                            <div key={closedWindowName} className="closed-card-container" onClick={() => this.props.bindings.openWindow(closedWindowName)}>
                                <div className="closed-card">
                                    <div className="closed-time">{moment(closedWindows[closedWindowName].date).format('DD MMM YYYY HH:mm')}</div>
                                    <div className="closed-stocks">{closedWindows[closedWindowName].favourites.codes.join(', ')}</div>
                                </div>
                            </div>)
                        }
                    </div>
                </div>
                }
                <img
                  src={icon}
                  className="bottom-icon"
                  draggable="false"
                  onClick={this.onIconClick}
                  onMouseOver={this.onMouseOver}
                  onMouseOut={this.onMouseOut}
                />
            </div>
        );
    }
}

ClosedWindows.propTypes = {
    bindings: PropTypes.shape({
        toggleFavourite: PropTypes.func.isRequired,
        selectStock: PropTypes.func.isRequired,
        openWindow: PropTypes.func.isRequired,
    }).isRequired,
    closedWindows: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(ClosedWindows);
