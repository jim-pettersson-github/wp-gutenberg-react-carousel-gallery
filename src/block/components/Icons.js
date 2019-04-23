/**
 * Custom icons
 */

export const Arrow = ({ color, height, width, transform }) =>
  <svg fill={color} style={{ height, width, transform }} viewBox="0 0 100 100">
    <path d="M 10,50 L 60,100 L 65,95 L 20,50  L 65,5 L 60,0 Z" className="arrow"></path>
  </svg>;

Arrow.defaultProps = {
  height: '50pt',
  transform: '',
  color: '#cec2ab',
};

export default Arrow;
