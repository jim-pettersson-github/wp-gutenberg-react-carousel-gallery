const { useState, useEffect, useRef } = wp.element;

// https://medium.com/@droopytersen/use-react-hooks-to-compose-behavior-324b4e446caa
export const useHover = () => {
  const [isHovered, setIsHovered] = useState(false);

  const hoverRef = useRef(null);

  const handleMouseOver = () => setIsHovered(true);
  const handleMouseOut = () => setIsHovered(false);

  useEffect(
    () => {
      const elem = hoverRef.current;
      if (elem) {
        elem.addEventListener('mouseover', handleMouseOver);
        elem.addEventListener('mouseout', handleMouseOut);

        return () => {
          elem.removeEventListener('mouseover', handleMouseOver);
          elem.removeEventListener('mouseout', handleMouseOut);
        };
      }
    },
    [hoverRef.current]
  ); // Recall only if ref changes

  return [hoverRef, isHovered];
};

export default useHover;
