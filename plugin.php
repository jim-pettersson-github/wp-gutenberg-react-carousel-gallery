<?php
/**
 * Plugin Name: jp-guten-gallery — Gutenberg Block Plugin
 * Plugin URI: https://github.com/ahmadawais/create-guten-block/
 * Description: jp-guten-gallery — is a Gutenberg plugin created via create-guten-block.
 * Author: Jim Pettersson
 * Author URI: https://github.com/jim-arbete
 * Version: 0.2.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/********************
 * GLOBALA FUNKTIONER
 * HELPER FUNCTIONS
 ********************/
// img sizes => \wp-content\themes\porto-child\functions.php
// add_image_size('small', 160, 213, true);
// add_image_size('polaroid', 320, 427, true);
// add_image_size('profile', 480, 640, true);
// add_image_size('portfolios', 320, 213, true);
// add_image_size('big', 768, 1024, true);

/********************
 * DEBUG
 ********************/
function debug( $arr = [] ) {
	echo '<pre>'. print_r($arr, true) .'</pre>';
}
function d( $arr = []) {
	debug( $arr );
}


/********************
 * Block Initializer.
 ********************/
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';


