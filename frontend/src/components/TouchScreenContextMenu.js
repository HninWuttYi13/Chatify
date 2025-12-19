import { useRef } from "react";
import { useContextMenu } from "./useContextMenu";
export const TouchScreenContextMenu = () => {
  const { setMenu } = useContextMenu();
  const longPressTimer = useRef();
  const handleTouchStart = (e, payload) => {
    const touch = e.touches[0];
    longPressTimer.current = setTimeout(() => {
      setMenu({
        x: touch.clientX,
        y: touch.clientY,
        payload,
      });
    }, 600);
  };
  const handleTouchEnd = () => clearTimeout(longPressTimer.current);
  return {
    handleTouchStart,
    handleTouchEnd,
  };
};
