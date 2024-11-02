import { useEffect, RefObject } from "react";

const useScrollEffect = (
  imageRef: RefObject<HTMLImageElement>,
  setOpacity: (opacity: number) => void,
  zoomMultiplier: number = 1,
  opacityMultiplier: number = 0.5
) => {
  useEffect(() => {
    const handleScroll = () => {
      if (imageRef.current) {
        const scrollPosition = window.scrollY;
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        const scale = 1 + (scrollPosition / maxScroll) * zoomMultiplier;
        setOpacity(0.6 - (scrollPosition / maxScroll) * opacityMultiplier);
        imageRef.current.style.transform = `scale(${scale})`;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [imageRef, setOpacity, zoomMultiplier, opacityMultiplier]);
};

export default useScrollEffect;
