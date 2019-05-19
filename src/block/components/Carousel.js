const { Fragment, useState, useEffect } = wp.element;
import GalleryImage from './GalleryImage';
import Dots from './CarouselDots';
import useInterval from './useInterval';
import useHover from './useHover';
import { Arrow } from './Icons';

const Carousel = ({ settings, images, className, defaultSettings }) => {
  const [slideIndex, setSlideIndex] = useState(1);
  const [isPrevNextClicked, setIsPrevNextClicked] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [carouselDelay, setCarouselDelay] = useState(0);
  const [hoverRef, isHovered] = useHover();

  const mergedSettings = { ...defaultSettings, ...settings };
  const {
    imagesPerRow,
    numerOfRows,
    gap,
    isAutoPlay,
    autoPlaySpeed,
    isArrowNavigation,
    isPageDots,
  } = mergedSettings;

  // useEffect(() => {
  //   console.log('delay', delay);
  //   console.log('carouselDelay', carouselDelay);
  //   console.log('autoPlaySpeed', autoPlaySpeed);
  //   console.log('isAutoPlay', isAutoPlay);
  //   console.log('isHovered', isHovered);
  //   console.log('hoverRef', hoverRef);
  // }, [isHovered, carouselDelay]);

  // If the caller updates the delay prop, update state
  useEffect(() => {
    if (! document.hidden && isAutoPlay) {
      setCarouselDelay(autoPlaySpeed * 1000);
    }
  }, [autoPlaySpeed]);

  const startTimer = () => setCarouselDelay(autoPlaySpeed * 1000); // Start by setting delay to the prop given by caller
  const stopTimer = () => setCarouselDelay(0); // Stop by setting the delay to 0.

  // Hover/-Mouseover
  useEffect(() => {
    if (! isHovered) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [isHovered]);

  // Next/-Back Buttons/-Arrows
  useEffect(() => {
    if (! isPrevNextClicked) {
      const timeout = setTimeout(() => {
        setIsPrevNextClicked(true);
        startTimer();
      }, carouselDelay);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isPrevNextClicked]);

  // AUTOPLAY / INTERVAL / setInterval()
  useInterval(() => {
    changeSlide(slideIndex + 1);
  }, isAutoPlay && carouselDelay);

  const calculateSlideIndex = (imgIndex, limit) => Math.ceil((imgIndex + 1) / limit); // ex) 9/10 = 1 => 11/10 = 2

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

  const handlePrevNextClicked = value => {
    stopTimer();
    setIsPrevNextClicked(false);
    changeSlide(value);
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

  return (
    <Fragment>
      <div
        ref={hoverRef}
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
      <button className="prev" onClick={() => handlePrevNextClicked(slideIndex - 1)}><Arrow /></button>
      <button className="next" onClick={() => handlePrevNextClicked(slideIndex + 1)}><Arrow transform="rotate(180deg)" /></button>
      <div className="dot-panel" style={{ textAlign: 'center' }}>
        {isPageDots && <Dots className="dot" value={slideIndex} onDotsClick={setSlideIndex} number={calculateMaxSlides()} /> }
      </div>
    </Fragment>
  );
};

Carousel.defaultProps = {
  defaultSettings: {
    delay: 3000,
    autoPlay: false,
    autoPlaySpeed: 3,
    arrowNavigation: true,
  },
};

export default Carousel;
