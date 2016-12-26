import React, { PropTypes } from 'react';

const UnfavouriteConfirmation = (props) => (
    <div className="confirmation-backdrop" onClick={props.bindings.onModalBackdropClick}>
        <div className="bubble-head" style={{ top: props.bindings.modalBubbleHeadTopPosition() }} />
        <div className={`confirmation-modal${props.isFlipped ? ' flipped' : ''}`} style={{ top: props.bindings.modalTopPosition() }}>
            <div className="confirmation-content" onClick={(e) => e.stopPropagation()}>
                <div className="message">
                    <span>Are you sure you wish to remove this stock from your favourites?</span>
                </div>
                <div className="buttons">
                    <button className="btn btn-primary" onClick={props.bindings.onModalConfirmClick}>Confirm</button>
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
