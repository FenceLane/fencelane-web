import { useState } from "react";
import { useIsomorphicLayoutEffect } from "framer-motion";

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }

    const updateSize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return isMobile;
};
