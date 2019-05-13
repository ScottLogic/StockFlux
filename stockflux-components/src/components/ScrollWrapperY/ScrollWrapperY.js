import React, { useRef, useEffect } from "react";
import "./ScrollWrapperY.css";

const ScrollWrapperY = props => {
  const scrollWrapperRef = useRef(null);

  useEffect(() => {
    checkIfOverflowing();
    window.addEventListener("resize", checkIfOverflowing);
    return () => {
      window.removeEventListener("resize", checkIfOverflowing);
    };
  }, []);

  useEffect(() => {
    checkIfOverflowing();
  }, [props.contentChanged]);

  const checkIfOverflowing = () => {
    if (scrollWrapperRef.current)
      if (
        scrollWrapperRef.current.scrollHeight >
        scrollWrapperRef.current.clientHeight
      )
        scrollWrapperRef.current.classList.add("scroll-padding-right");
      else {
        scrollWrapperRef.current.classList.remove("scroll-padding-right");
      }
  };

  return (
    <div className="scroll-wrapper-y" ref={scrollWrapperRef}>
      {props.children}
    </div>
  );
};
export default ScrollWrapperY;
