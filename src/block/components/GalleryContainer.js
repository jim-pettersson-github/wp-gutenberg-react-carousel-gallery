const { Fragment, useState, useEffect } = wp.element;
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import GalleryImage from './GalleryImage';
import Carousel from './Carousel';

const GET_IMAGES = gql`
  query GET_IMAGES($first: Int, $ids: [ID]) {
    mediaItems(first: $first, where: { in: $ids }) {
      edges {
        node {
          mediaItemId
          id
          link
          sourceUrl
          altText
          caption
          mediaDetails {
            sizes {
              name
              sourceUrl
            }
          }
        }
      }
    }
  }
`;

const GalleryContainer = ({ element }) => {
  const [images, setImages] = useState([]);
  const [graphQLResponse, setGraphQLResponse] = useState([]);
  const [imagesIsReady, setimagesIsReady] = useState(false);

  const ids = JSON.parse(element.dataset.ids);
  const attributes = JSON.parse(element.dataset.attributes);
  const serverRenderImages = JSON.parse(element.dataset.serverrenderedimages);

  const {
    imagesPerRow,
    numerOfRows,
  } = attributes;

  useEffect(() => {
    const newImages = [];

    if (graphQLResponse.length > 0) {
      graphQLResponse.map(({ node: { id, mediaItemId, sourceUrl, altText, caption, mediaDetails } }, index) => {
        const { sizes } = mediaDetails;
        const imgFromSize = sizes.find(img => img.name === 'polaroid');
        const dynamicSourceUrl = sizes.find(img => img.name === 'polaroid') ? imgFromSize.sourceUrl : sourceUrl;

        newImages.push({
          id: mediaItemId,
          url: dynamicSourceUrl,
          sourceUrl: sourceUrl,
          alt: altText,
          caption: caption,
        });

        const loadedImg = new Image();
        loadedImg.src = dynamicSourceUrl;

        // preload images before we swap them in
        if ((imagesPerRow * numerOfRows) >= index) {
          loadedImg.onload = () => {
            // when it finishes loading, update the component state
            setImages( newImages );
            setimagesIsReady(true);
          };
        }
      });
    } else {
      serverRenderImages.forEach((img, index) => {
        if ((imagesPerRow * numerOfRows) > index) {
          newImages.push({
            id: img.id,
            url: img.sizes.medium.url,
            sourceUrl: img.url,
            alt: img.alt,
            caption: img.caption,
          });
        }
      });
      setImages( newImages );
      // console.log('GalleryContainer => PRE useEffect serverRenderImages', serverRenderImages);
    }
  }, [graphQLResponse]);

  useEffect(() => {
    if (images.length > 0) {
      // console.log('GalleryContainer => useEffect attributes', attributes);
    }
  }, [images]);

  // GraphQL => https://docs.wpgraphql.com/getting-started/interacting-with-wpgraphql
  // 1. Fetch all IDs belonging to the gallery-block
  // 1.1 GraphQL => fetch 8 images and map IDs and replace ALL img URL values

  // 2. Start preloading the 1st slide of images
  // 2.1 Replace thumbnail images with higher resolution preloaded images

  return (
    <Query query={GET_IMAGES} variables={{ first: 10000, ids: ids }}>
      {({ loading, error, data }) => {
        if (loading) {
          return (
            <Carousel
              settings={attributes}
              className="jp-guten-block-gallery"
              images={images}
            />
          );
        }
        if (error) {
          return <p>Error {error.message}</p>;
        }
        setGraphQLResponse(data.mediaItems.edges);

        return (
          <Carousel
            settings={attributes}
            className="jp-guten-block-gallery"
            images={images}
          />
        );
        // return (
        //   <Fragment>
        //     <Gallery images={images} attributes={attributes} />
        //     {/* {graphQLResponse.map(({ node: { id, mediaItemId } }) => (
        //       <div key={id}>
        //           {id}: {mediaItemId}
        //       </div>
        //     ))} */}
        //   </Fragment>
        // );
      }}
    </Query>
  );
};

export default GalleryContainer;
