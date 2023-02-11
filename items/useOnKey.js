import { useEffect } from "react";

export const useOnKeyPress = (targetKey, callback) => {
  useEffect(() => {
    const keyPressHandler = (event) => {
      if (event.key === targetKey) {
        callback();
      }
    };
    window.addEventListener("keydown", keyPressHandler);
    return () => {
      window.removeEventListener("keydown", keyPressHandler);
    };
  }, [targetKey, callback]);
};
