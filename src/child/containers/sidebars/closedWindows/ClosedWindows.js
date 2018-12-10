import React from 'react';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import moment from 'moment';

import { closedWindowsSelector as mapStateToProps } from '../../../selectors/selectors';
import closedWindowsImageInactive from '../../../assets/png/closed_tabs.png';
import closedWindowsImageActive from '../../../assets/png/closed_tabs_active.png';

class ClosedWindows extends React.Component {

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

        const { closedWindows, openWindow } = this.props;
        const closedWindowsNames = Object.keys(closedWindows) || [];

        return (
            <div>
                {modalOpen &&
                <div className="favourite-closed-cover" onClick={() => this.setState({ modalOpen: false })}>
                    <div className="bubble-head" />
                    <div className="closed-selection">
                        {closedWindowsNames.map((closedWindowName) =>
                            <div key={closedWindowName} className="closed-card-container" onClick={() => openWindow(closedWindowName)}>
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
    closedWindows: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    openWindow: PropTypes.func.isRequired
};
ClosedWindows.defaultProps = {
    closedWindows: {}
};

export default connect(mapStateToProps)(ClosedWindows);
