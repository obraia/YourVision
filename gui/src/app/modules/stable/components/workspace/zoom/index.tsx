import React, { useCallback, useRef, useState } from "react";
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";
import { useGesture } from "@use-gesture/react";
import { Content } from "./styles";

interface Props {
  children?: React.ReactNode;
  onZoomScaleChange?: (scale: number) => void;
}

export const Zoom = React.forwardRef((props: Props, ref: any) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const animationDuration = 250;

  const onZoomUpdate = useCallback(({ x, y, scale }: any) => {
    const { current: content } = contentRef;

    if (content) {
      const value = make3dTransformValue({ x, y, scale });
      content.style.setProperty("transform", value);

      if (props.onZoomScaleChange) {
        props.onZoomScaleChange(scale);
      }
    }
  }, []);
  
  useGesture({
    onPinch: () => {
      setEnabled(true);
    },
    onPinchEnd: () => {
      setTimeout(() => { setEnabled(false) }, animationDuration);
    },
    onDrag: () => {
      setEnabled(true);
      contentRef.current!.style.cursor = "grabbing";
    },
    onDragEnd: () => {
      setTimeout(() => { setEnabled(false) }, animationDuration);
      contentRef.current!.style.cursor = "grab";
    }
  }, {
    target: contentRef,
    eventOptions: {
      passive: false
    },
    drag: { pointer: { buttons: 4 } }
  })

  return (
    <QuickPinchZoom 
      containerProps={{
        style: {
          width: "100%",
          height: "100%",
          overflow: "hidden",
          position: "relative",
        }
      }}
      animationDuration={animationDuration}
      onUpdate={onZoomUpdate}
      draggableUnZoomed={false}
      inertiaFriction={0}
      enabled={enabled}>
        <Content ref={contentRef}>
          {props.children}
        </Content>
    </QuickPinchZoom>
  );
})
