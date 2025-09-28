

import { useEffect, useState } from "react";

export default function useDeviceType() {
  const [deviceType, setDeviceType] = useState("unknown");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width <= 768) {
        setDeviceType("mobile");
      } else if (width <= 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    handleResize(); // call immediately
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return deviceType;
}
