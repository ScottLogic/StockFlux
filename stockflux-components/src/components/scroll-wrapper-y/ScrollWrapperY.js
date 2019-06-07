import React, { useRef, useEffect } from 'react';
import './ScrollWrapperY.css';

const ScrollWrapperY = ({ children }) => {
  const scrollWrapperRef = useRef(null);

  useEffect(() => {
    checkIfOverflowing();
    window.addEventListener('resize', checkIfOverflowing);
    return () => {
      window.removeEventListener('resize', checkIfOverflowing);
    };
  }, []);

  const checkIfOverflowing = () => {
    const domElement = scrollWrapperRef.current;
    if (domElement)
      domElement.classList.toggle(
        'scrollPaddingRight',
        domElement.scrollHeight > domElement.clientHeight
      );
  };

  useEffect(checkIfOverflowing);

  return (
    <div className="scrollWrapperY" ref={scrollWrapperRef}>
      {children}
    </div>
  );
};
export default ScrollWrapperY;
