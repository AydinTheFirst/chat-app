import { useEffect, useState } from "react";

export const useViewport = () => {
  const [viewport, setViewport] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  });

  const updateViewport = () => {
    setViewport({
      height: window.innerHeight,
      width: window.innerWidth
    });
  };

  useEffect(() => {
    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  return viewport;
};

export function useDevice() {
  const { width } = useViewport();

  return {
    isDesktop: width >= 1024,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024
  };
}
