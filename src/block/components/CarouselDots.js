const { Fragment, useState, useEffect } = wp.element;

export const CarouselDots = ({ value, number, onDotsClick, className }) => {
  return (
    <Fragment>
      { new Array(number).fill(0).map((dot, index) =>
        <button key={index} onClick={() => onDotsClick && onDotsClick(index + 1)} className={`${ className } ${ ((index + 1) === value) ? 'active' : '' }` } value={value}></button>
      )}
    </Fragment>
  );
};

export default CarouselDots;
