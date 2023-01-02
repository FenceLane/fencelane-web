import { useLayoutEffect, useState } from "react";
import debounce from "../util/debounce";

const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const updateSize = debounce(
      () => setIsMobile(window.innerWidth < 768),
      250
    );

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return isMobile;
};

export default useIsMobile;
