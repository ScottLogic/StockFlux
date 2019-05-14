import React from 'react';
import * as PropTypes from 'prop-types';
import { modalDimensions } from './ModalDimensions';
import './UnwatchConfirmation.css';

function UnwatchConfirmation(props) {
  const shouldPositionModalAboveStar = starTopPos => {
    const { offset, height } = modalDimensions;
    const modalBottom = starTopPos + offset + height;
    return modalBottom >= window.innerHeight;
  };

  const isFlipped = shouldPositionModalAboveStar(props.starTop);
  const { bubbleHeadFlippedOffset, bubbleHeadOffset } = modalDimensions;
  const modalBubbleHeadTopPosition = () => {
    return (
      props.starTop +
      (shouldPositionModalAboveStar(props.starTop)
        ? bubbleHeadFlippedOffset
        : bubbleHeadOffset)
    );
  };

  const modalTopPosition = () => {
    const { flippedOffset, offset } = modalDimensions;
    return (
      props.starTop +
      (shouldPositionModalAboveStar(props.starTop) ? flippedOffset : offset)
    );
  };

  return (
    <div className="confirmation-backdrop" onClick={props.onModalBackdropClick}>
      <div
        className="bubble-head"
        style={{ top: modalBubbleHeadTopPosition() }}
      />
      <div
        className={`confirmation-modal${isFlipped ? ' flipped' : ''}`}
        style={{ top: modalTopPosition() }}
      >
        <div
          className="confirmation-content"
          onClick={e => e.stopPropagation()}
        >
          <div className="message">
            <span>
              Are you sure you wish to remove this stock from your favourites?
            </span>
          </div>
          <div className="buttons">
            <button
              className="btn btn-primary"
              onClick={props.onModalConfirmClick}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
UnwatchConfirmation.propTypes = {
  onModalBackdropClick: PropTypes.func.isRequired,
  onModalConfirmClick: PropTypes.func.isRequired
};

export default UnwatchConfirmation;
