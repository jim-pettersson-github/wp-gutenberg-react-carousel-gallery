import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
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
  const ids = JSON.parse(element.dataset.ids);
  const attributes = JSON.parse(element.dataset.attributes);
  const serverRenderImages = JSON.parse(element.dataset.serverrenderedimages);
  const { data, loading, error } = useQuery(GET_IMAGES, { variables: { first: 100, ids } });
  const {
    imagesPerRow,
    numerOfRows,
  } = attributes;

  const sortDataByIDs = ({ _items, _ids, _sortKey }) => _items.sort((a, b) => _ids.indexOf(a[_sortKey]) - _ids.indexOf(b[_sortKey]));

  if (loading) {
    // PRE-VIEW LOW QUALITY IMAGES WHILE THE REAL ONE LOADS
    const nnewImages = [];
    serverRenderImages.forEach((img, index) => {
      if ((imagesPerRow * numerOfRows) > index) {
        nnewImages.push({
          id: img.id,
          url: img.sizes.medium.url,
          sourceUrl: img.url,
          alt: img.alt,
          caption: img.caption,
        });
      }
    });
    return (
      <Carousel
        settings={attributes}
        className="jp-guten-block-gallery"
        images={nnewImages}
      />
    );
  }

  if (error) return <p>Error {error.message}</p>;

  const images = [];
  const sortedData = sortDataByIDs({_items: data.mediaItems.edges.map(_ => _.node), _ids: ids, _sortKey: 'mediaItemId'});
  sortedData.map(({ mediaItemId, sourceUrl, altText, caption, mediaDetails }) => {
    const { sizes } = mediaDetails;
    const imgFromSize = sizes.find(img => img.name === 'polaroid');
    const dynamicSourceUrl = sizes.find(img => img.name === 'polaroid') ? imgFromSize.sourceUrl : sourceUrl;
    images.push({
      id: mediaItemId,
      url: dynamicSourceUrl,
      sourceUrl: sourceUrl,
      alt: altText,
      caption: caption,
    });
  });

  return (
    <Carousel
      settings={attributes}
      className="jp-guten-block-gallery"
      images={images}
    />
  );
};

export default GalleryContainer;
