import React from 'react';
import * as PropTypes from 'prop-types';

const UnfavouriteConfirmation = ({ bindings, isFlipped }) => (
    <div className="confirmation-backdrop" onClick={bindings.onModalBackdropClick}>
        <div className="bubble-head" style={{ top: bindings.modalBubbleHeadTopPosition() }} />
        <div className={`confirmation-modal${isFlipped ? ' flipped' : ''}`} style={{ top: bindings.modalTopPosition() }}>
            <div className="confirmation-content" onClick={(e) => e.stopPropagation()}>
                <div className="message">
                    <span>Are you sure you wish to remove this stock from your favourites?</span>
                </div>
                <div className="buttons">
                    <button className="btn btn-primary" onClick={bindings.onModalConfirmClick}>Confirm</button>
                </div>
            </div>
        </div>
    </div>
);

UnfavouriteConfirmation.propTypes = {
    bindings: PropTypes.shape({
        onModalBackdropClick: PropTypes.func.isRequired,
        modalBubbleHeadTopPosition: PropTypes.func.isRequired,
        modalTopPosition: PropTypes.func.isRequired,
        onModalConfirmClick: PropTypes.func.isRequired
    }).isRequired,
    isFlipped: PropTypes.bool.isRequired
};

export default UnfavouriteConfirmation;
