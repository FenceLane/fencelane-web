import { useLayoutEffect, useState } from "react";
import debounce from "../util/debounce";

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }

    const updateSize = debounce(
      () => setIsMobile(window.innerWidth < 768),
      250
    );

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return isMobile;
};
