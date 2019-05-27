// https://npms.io/search?q=react-gallery
// 1. https://brainhubeu.github.io/react-carousel/docs/api/dots => slider
// 2. http://linxtion.com/demo/react-image-gallery/ => ta arrows
// 3. Gallery med lightbox

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __, sprintf } = wp.i18n;
const { Fragment } = wp.element;
const { registerBlockType } = wp.blocks;
const {
  MediaUpload,
  MediaPlaceholder,
  InspectorControls,
  BlockIcon,
  BlockControls,
} = wp.editor;
const { IconButton, Toolbar, PanelBody, RangeControl, ToggleControl, SelectControl } = wp.components;

registerBlockType( 'jp/guten-block-gallery', {
  title: 'JP Gallery Block',
  description: __( 'Display multiple images in a carousel gallery.' ),
  icon: 'images-alt2',
  category: 'common',
  keywords: ['jp-guten-block-gallery - React Carousel Gallery Block'],

  attributes: {
    images: {
      type: 'array',
      default: [],
    },
    imagesPerRow: {
      type: 'number',
      default: 4,
    },
    numerOfRows: {
      type: 'number',
      default: 1,
    },
    gap: {
      type: 'number',
      default: 15,
    },
    isAutoPlay: {
      type: 'boolean',
      default: true,
    },
    autoPlaySpeed: {
      type: 'number',
      default: 3,
    },
    isArrowNavigation: {
      type: 'boolean',
      default: true,
    },
    isPageDots: {
      type: 'boolean',
      default: true,
    },
  },

  // https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
  edit: ( { attributes, setAttributes, className } ) => {
    const {
      images,
      imagesPerRow,
      numerOfRows,
      gap,
      isAutoPlay,
      autoPlaySpeed,
      isArrowNavigation,
      isPageDots,
    } = attributes;

    const onSelectImages = (selectedImages) => {
      setAttributes( {
        images: [...selectedImages],
      });
    };

    // const onChange = ( event ) => {
      // setAttributes( { author: event.target.value } );
    // };

    const getAutoPlayHelp = ( checked ) => {
      // Retrieve the height value and divide it to display full seconds.
      const speed = autoPlaySpeed;
      const time = ( speed > 1 ) ? __( 'seconds' ) : __( 'second' );

      // translators: 1. Speed of the slider, 2: Time until the slide advances
      return checked ? sprintf( __( 'Automatically advancing to the next gallery item after %1$d %2$s.' ), speed, time ) : __( 'Automatically advance to the next gallery item after a set duration.' );
    };

    // STEP 1 => EMPTY BLOCK
    if (images.length === 0) {
      return (
        <Fragment>
          <MediaPlaceholder
            onSelect={onSelectImages}
            multiple
            allowedTypes={['image']}
            accept="image/*"
            className={className}
            icon={ <BlockIcon icon="images-alt2" /> }
            labels={{
              title: 'JP Gallery Block',
              instructions: __( 'Drag images, upload new ones or select files from your library.' ),
            }}
            // notices={ noticeUI }
            // onError={ noticeOperations.createErrorNotice }
          />
        </Fragment>
      );
    }

    // STEP 2 => MAIN AREA + SIDEPANEL => BLOCK SETTINGS / UPLOAD IMAGES / GALLERY SETTINGS
    return (
      <Fragment>
        <BlockControls>
          <Toolbar>
            <MediaUpload
              onSelect={ onSelectImages }
              allowedTypes={['image']}
              multiple
              gallery
              value={ images.map( ( img ) => img.id ) }
              render={ ( { open } ) => (
                <IconButton
                  className="components-toolbar__control"
                  label={ __( 'Edit Gallery' ) }
                  icon="edit"
                  onClick={ open }
                />
              ) }
            />
          </Toolbar>
        </BlockControls>
        <InspectorControls>
          <PanelBody title={'Gallery Settings'}>
            <div>
              <RangeControl
                label={__('Images per row')}
                value={imagesPerRow}
                onChange={(value) => setAttributes({ imagesPerRow: value })}
                min={1}
                max={6}
                step={1}
              />
              <RangeControl
                label={__('Number of rows')}
                value={ numerOfRows }
                onChange={(value) => setAttributes({ numerOfRows: value })}
                min={1}
                max={4}
                step={1}
              />
              <RangeControl
                label={__('Gap')}
                value={ gap }
                onChange={(value) => setAttributes({ gap: value })}
                min={0}
                max={35}
                step={5}
                help={ `${ gap }px gap between grid elements.`}
              />
            </div>
          </PanelBody>
          <PanelBody title={ __( 'Slider Settings' ) } initialOpen={ true }>
            <ToggleControl
              label={ __( 'Autoplay Slides' ) }
              checked={ !! isAutoPlay }
              onChange={() => setAttributes({ isAutoPlay: ! isAutoPlay })}
              help={ getAutoPlayHelp }
            />
            { isAutoPlay && <SelectControl
              label={ __( 'Transition Speed' ) }
              value={ autoPlaySpeed }
              onChange={(value) => setAttributes({ autoPlaySpeed: value })}
              options={ [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(nr => ({ value: nr, label: `${ nr } ${ nr > 1 ? __( 'Seconds' ) : __( 'Second' ) }` })) }
            /> }
            <ToggleControl
              label={ __( 'Arrow Navigation' ) }
              checked={ !! isArrowNavigation }
              onChange={() => setAttributes({ isArrowNavigation: ! isArrowNavigation })}
              help={checked => checked ? __( 'Showing slide navigation arrows.' ) : __( 'Toggle to show slide navigation arrows.' )}
            />
            <ToggleControl
              label={ __( 'Dot Navigation' ) }
              checked={ !! isPageDots }
              onChange={() => setAttributes({ isPageDots: ! isPageDots })}
              help={checked => checked ? __( 'Showing dot navigation arrows.' ) : __( 'Toggle to show dot navigation.' )}
            />
          </PanelBody>
        </InspectorControls>
        <div className="jp-guten-block-gallery-be-container">
          <div
            className={`jp-guten-block-gallery ${ className }`}
            style={{
              gridGap: gap,
              gridTemplateColumns: `repeat(${ imagesPerRow }, auto)`,
            }}
          >
            {images.map((img, index) => {
              const {
                sizes: { medium },
              } = img;

              // Math.ceil(21 images / 5 imagesPerRow) => 5 => 2 rows ==> 2 % 2 = 0 | 2 % 1
              // 5 index / 5 imagesPerRow => rad 1 => 1 % 2 === 1
              // 10 index / 5 imagesPerRow => rad 2 => 2 % 2 === 0
              // 15 index / 5 imagesPerRow => rad 3 => 3 % 2 === 0
              // 20 index / 5 imagesPerRow => rad 4 4 % 2 === 0
              
              return (
                <Fragment key={img.id}>
                  <div className={ Math.ceil((index + 1) / imagesPerRow) % numerOfRows === 0 ? 'jp-guten-gallery-item jp-guten-gallery-item-column-gap' : 'jp-guten-gallery-item' }>
                    {<img src={medium ? medium.url : img.url} alt={img.alt} />}
                    {/* <GalleryImage
                      className="jp-guten-gallery-item blocks-gallery-item thumbnail
                      url={ img.url }
                      alt={ img.alt }
                      id={ img.id }
                      isSelected={ isSelected && this.state.selectedImage === index }
                      onRemove={ this.onRemoveImage( index ) }
                      onSelect={ this.onSelectImage( index ) }
                      setAttributes={ ( attrs ) => this.setImageAttributes( index, attrs ) }
                      caption={ img.caption }
                      aria-label={ ariaLabel }
                    /> */}
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>
      </Fragment>
    );
  },
  save: () => {
    return null; // See PHP side "src/init.php". This block is rendered on PHP.
  },

  // https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
  // save(props) {
  // save() {
  //   return (
  //     <Fragment>
  //       <div images="12,32,5532">test</div>
  //     </Fragment>
  //   );
  // },
} );
