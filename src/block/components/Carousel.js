const { Fragment, useState, useEffect } = wp.element;
import GalleryImage from './GalleryImage';
import Dots from './CarouselDots';
import { Arrow } from './Icons';

const Carousel = ({ settings, images, className }) => {
  const [slideIndex, setSlideIndex] = useState(1);
  const [animationClass, setAnimationClass] = useState('');

  const {
    imagesPerRow,
    numerOfRows,
    gap,
    // autoPlay,
    // autoPlaySpeed,
    // arrowNavigation,
    pageDots,
  } = settings;

  const calculateSlideIndex = (imgIndex, limit) => {
    const calcualtedSlideIndex = Math.ceil((imgIndex + 1) / limit); // ex) 9/10 = 1 => 11/10 = 2
    return calcualtedSlideIndex;
    // return (calcualtedSlideIndex === currentSlideIndex) ? true : false;
  };

  const calculateMaxSlides = () => Math.ceil(images.length / (imagesPerRow * numerOfRows));

  const calcualteAnimationClass = (_className, _isCurrentSlideIndex) => {

    if (_isCurrentSlideIndex && _className === 'animate-right') {
      return 'animate-right';
    } else if (_isCurrentSlideIndex && _className === 'animate-left') {
      return 'animate-left';
    }

    if (! _isCurrentSlideIndex && _className === 'animate-right') {
      return 'leave-animate-right';
    } else if (! _isCurrentSlideIndex && _className === 'animate-left') {
      return 'leave-animate-left';
    }

    return '';
    // const gg = _className === 'animate-right' ? 'animate-right' : 'animate-left';
    // return gg;
  };

  const changeSlide = value => {
    // right : left
    setAnimationClass( value > slideIndex ? 'animate-right' : 'animate-left' );

    // Calcualte => Add / Subtract / Reset the slider index
    if (value > calculateMaxSlides()) {
      setSlideIndex(1); // Ex => 4 > 3 => Then reset to 1.
    } else if (value < 1) {
      setSlideIndex(calculateMaxSlides()); // Ex => 4 > 3 => Then reset to 1.
    } else {
      setSlideIndex(value);
    }
  };

  useEffect(() => {
    console.log('GalleryImage => useEffect slideIndex', slideIndex);
  }, [slideIndex]);

  return (
    <Fragment>
      <div
        className={className}
        style={{
          gridGap: gap,
          gridTemplateColumns: `repeat(${ imagesPerRow }, auto)`,
        }}
      >
        { images.map((img, index) => {
          const isCurrentSlideIndex = (calculateSlideIndex(index, (imagesPerRow * numerOfRows)) === slideIndex) ? true : false;
          return (
            <GalleryImage
              key={img.id || img.url}
              className={`jp-guten-gallery-item ${ calcualteAnimationClass(animationClass, isCurrentSlideIndex) }`}
              url={ img.url }
              alt={ img.alt }
              id={ img.id }
              caption={ img.caption }
              hide={! isCurrentSlideIndex}
            />
          );
        })}
      </div>
      <button className="prev" onClick={() => changeSlide(slideIndex - 1)}><Arrow /></button>
      <button className="next" onClick={() => changeSlide(slideIndex + 1)}><Arrow transform="rotate(180deg)" /></button>
      <div className="dot-panel" style={{ textAlign: 'center' }}>
        {pageDots && <Dots className="dot" value={slideIndex} onDotsClick={setSlideIndex} number={calculateMaxSlides()} /> }
      </div>
    </Fragment>
  );
};

export default Carousel;
