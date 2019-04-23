<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function jp_guten_gallery_cgb_block_assets() {

	$frontend_js_path = "/dist/blocks.build.js";

	// Enqueue frontend JS
	wp_enqueue_script(
		'jp_guten_gallery-cgb-block-js',
		plugins_url( $frontend_js_path, dirname( __FILE__ ) ),
		[ 'wp-element', 'wp-editor' ]
		// true
		// filemtime( plugins_url( $frontend_js_path, dirname( __FILE__ ) ) ),
	);

	wp_enqueue_style(
		'jp_guten_gallery-cgb-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-editor' ) // Dependency to include the CSS after it.
	);

}
add_action( 'enqueue_block_assets', 'jp_guten_gallery_cgb_block_assets' );


/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function jp_guten_gallery_cgb_editor_assets() { // phpcs:ignore

	wp_enqueue_script(
		'jp_guten_gallery-cgb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components' ), // Dependencies, defined above.
		true // Enqueue the script in the footer.
	);

	wp_enqueue_style(
		'jp_guten_gallery-cgb-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ) // Dependency to include the CSS after it.
	);

}
add_action( 'enqueue_block_editor_assets', 'jp_guten_gallery_cgb_editor_assets' );

/**
 * Register archives block.
 * 
 * FRONTEND Server-side rendering of the `jp/guten-block-gallery` block.
 * 
 * Instead of handling render of content in .js => This replaces --> save() {} in registerBlockType(); 
 * https://wordpress.org/gutenberg/handbook/designers-developers/developers/tutorials/block-tutorial/creating-dynamic-blocks/
 * https://github.com/WordPress/gutenberg/blob/master/packages/block-library/src/latest-posts/index.php
 */

function jp_guten_gallery_dynamic_block() {
	
	register_block_type(
		'jp/guten-block-gallery',
		[
			'attributes' => [
				// 'images' => [
				// 	'type'    => 'array',
				// ],
				'imagesPerRow' => [
					'type'    => 'number',
					'default' => 4,
				],
				'numerOfRows' => [
					'type'    => 'number',
					'default' => 1,
				],
				'gap' => [
					'type'    => 'number',
					'default' => 15,
				],
				'pageDots' => [
					'type'    => 'boolean',
					'default' => false,
				]
			],
			'render_callback' => 'render_jp_guten_gallery_dynamic_block' 
				
				// return sprintf('<div>hejhej</div>');
				// return esc_attr( d( $attributes["images"][0] ) );
				// return $attributes["images"][0];

				// $block_content = sprintf(
				// 	'<div class="">%1$s</div>',
				// 	print_r( $attributes["images"][0] )
				// );
				// return $block_content;
		]
	);
			
}
add_action( 'init', 'jp_guten_gallery_dynamic_block' );
		
/**
 * Renders the `cgb/block-jp-guten-gallery` block on server.
 *
 * @param array $attributes The block attributes.
 *
 * @return string Returns the page content with images gallery added.
 */
function render_jp_guten_gallery_dynamic_block( $attributes ) {

	$img_items_markup = '';

	if ( empty( $attributes['images'] ) ) return null;
	
	foreach ( $attributes['images'] as $index => $image ) {

		// Caching => pre-render the first x images (based on rows) if it's a carousel. 
		// The rest of the carousel slides is rendered in React
		if ($index >= ($attributes['imagesPerRow'] * $attributes['numerOfRows'])) break;

		$img_items_markup .= sprintf(
			'<div class="jp-guten-gallery-item">
				<img src="%1$s" data-id="%2$s" />
			</div>',
			esc_url( $image['sizes']['medium']['url'] ),
			esc_attr( $image['id'] )
		);
	}

	// Save all $attributes except the images "key" as a data-* => data-attributes
	$filterd_attributes = $attributes;
	unset($filterd_attributes["images"]);

	$block_content = sprintf(
		'<div class="jp-guten-block-gallery-fe-container" data-ids="%3$s" data-attributes="%4$s" data-serverrenderedimages="%5$s">
			<div style="%1$s" class="jp-guten-block-gallery">
				%2$s
			</div>
		</div>',
		esc_attr( "grid-gap: {$attributes['gap']}px; grid-template-columns: repeat({$attributes['imagesPerRow']}, auto);" ),
		$img_items_markup,
		esc_attr( json_encode( array_column($attributes['images'], 'id') ) ),
		esc_attr( json_encode( $filterd_attributes ) ),
		esc_attr( json_encode( $attributes['images'] ) )
	);

	// return json_encode( array_column($attributes['images'], 'id') );
	// return d( $attributes );
	// return $block_content . d( $attributes["images"][0] );
	return $block_content;
	
}
