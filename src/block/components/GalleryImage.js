const { Fragment, useState, useEffect } = wp.element;

// Expect/Input this format
// images: [
//   {
//     url: image.src,
//     width: image.width,
//     height: image.height,
//     alt: image.alt,
//     caption: image.title,
//   }
// ]
const GalleryImage = ({ lightboxImgIndex, onImgClick, className, id, url, sourceUrl, alt, caption, hide }) => {
  // const [isLoaded, setIsLoaded] = useState(true);
  useEffect(() => {
    // setTimeout(() => setIsLoaded(true), 4500);
    // console.log('GalleryImage => useEffect animate-right');
    // ${ 'animate-right' }
  }, []);

  return (
    <div className={`${ className } ` }
      style={{
        display: hide ? 'none' : 'block',
        // visibility: hide ? 'hidden' : 'visible',
        // position: hide ? 'absolute' : 'relative',
      }}
    >
      <img
        data-id={id}
        src={url}
        alt={alt}
        caption={caption}
        onClick={() => onImgClick && onImgClick(lightboxImgIndex)}
      />
    </div>
  );
};

export default GalleryImage;
