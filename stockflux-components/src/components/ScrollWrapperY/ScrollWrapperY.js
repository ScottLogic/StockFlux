import React, { useRef, useEffect } from 'react';
import './ScrollWrapperY.css';

const ScrollWrapperY = props => {
  const scrollWrapperRef = useRef(null);

  useEffect(() => {
    checkIfOverflowing();
    window.addEventListener('resize', checkIfOverflowing);
    return () => {
      window.removeEventListener('resize', checkIfOverflowing);
    };
  }, []);

  useEffect(() => {
    checkIfOverflowing();
  }, [props.contentChanged]);

  const checkIfOverflowing = () => {
    const domElement = scrollWrapperRef.current;
    if (domElement)
      domElement.classList.toggle(
        'scrollPaddingRight',
        domElement.scrollHeight > domElement.clientHeight
      );
  };

  return (
    <div className="scrollWrapperY" ref={scrollWrapperRef}>
      {props.children}
    </div>
  );
};
export default ScrollWrapperY;
