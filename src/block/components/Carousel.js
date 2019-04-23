const { Fragment, useState, useEffect } = wp.element;
import GalleryImage from './GalleryImage';
import Dots from './CarouselDots';
import useInterval from './useInterval';
import { Arrow } from './Icons';

const Carousel = ({settings, images, className, defaultSettings }) => {
  const [slideIndex, setSlideIndex] = useState(1);
  const [isAutoPlayRunning, setIsAutoPlayRunning] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

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
    setIsAutoPlayRunning(false);
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

  // AUTOPLAY / INTERVAL / setInterval()
  // https://overreacted.io/making-setinterval-declarative-with-react-hooks/
  useInterval(() => {
    if (! document.hidden && isAutoPlay) {
      changeSlide(slideIndex + 1);
    }
  }, (isAutoPlayRunning && isAutoPlay) ? Number(autoPlaySpeed) * 1000 : null);

  useEffect(() => {
    if (! isAutoPlayRunning) {
      setIsAutoPlayRunning(false);
      const timeout = setTimeout(() => {
        setIsAutoPlayRunning(true);
      }, Number(autoPlaySpeed) * 1000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isAutoPlayRunning]);

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
    autoPlay: false,
    autoPlaySpeed: 3,
    arrowNavigation: true,
  },
};

export default Carousel;
