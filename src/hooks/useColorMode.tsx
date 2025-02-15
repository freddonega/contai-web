import { useEffect } from "react";
import { useColorModeStore } from "@/storage/colorModeStorage";

const useColorMode = () => {
  const colorMode = useColorModeStore((state) => state.colorMode);
  const setColorMode = useColorModeStore((state) => state.setColorMode);

  useEffect(() => {
    const className = "dark";
    const bodyClass = window.document.body.classList;

    colorMode === "dark"
      ? bodyClass.add(className)
      : bodyClass.remove(className);
  }, [colorMode]);

  return [colorMode, setColorMode];
};

export default useColorMode;
