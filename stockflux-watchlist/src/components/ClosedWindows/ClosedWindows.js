import React, { useState } from "react";
import moment from "moment";
import closedWindowsImageInactive from "../../assets/png/closed_tabs.png";
import closedWindowsImageActive from "../../assets/png/closed_tabs_active.png";

const ClosedWindows = props => {
    const [iconHover, setIconHover] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const onIconClick = e => {
        e.stopPropagation();
        // TODO: Implement if we decide we need closed windows functionality
    };

    const onMouseOver = () => {
        setIconHover(true);
    };

    const onMouseOut = () => {
        setIconHover(false);
    };

    const icon =
        iconHover || modalOpen
            ? closedWindowsImageActive
            : closedWindowsImageInactive;

    const closedWindows = props.closedWindows || {};
    const closedWindowsNames = Object.keys(closedWindows) || [];

    return (
        <>
            {modalOpen && (
                <div
                    className="favourite-closed-cover"
                    onClick={() => setModalOpen(false)}
                >
                    <div className="bubble-head" />
                    <div className="closed-selection">
                        {closedWindowsNames.map(closedWindowName => (
                            <div
                                key={closedWindowName}
                                className="closed-card-container"
                                onClick={() =>
                                    props.bindings.openWindow(closedWindowName)
                                }
                            >
                                <div className="closed-card">
                                    <div className="closed-time">
                                        {moment(
                                            closedWindows[closedWindowName].date
                                        ).format("DD MMM YYYY HH:mm")}
                                    </div>
                                    <div className="closed-stocks">
                                        {closedWindows[
                                            closedWindowName
                                        ].favourites.codes.join(", ")}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <img
                src={icon}
                className="icon-right"
                onClick={e => onIconClick(e)}
                onMouseOver={() => onMouseOver()}
                onMouseOut={() => onMouseOut()}
                alt="Closed Windows Icon"
                draggable="false"
            />
        </>
    );
};

export default ClosedWindows;
