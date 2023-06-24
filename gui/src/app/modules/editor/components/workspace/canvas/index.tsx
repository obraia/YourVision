import { RefAttributes, RefObject, forwardRef, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../infrastructure/redux/store';
import { EditorRef } from '../editor';
import { Container } from './styles';

export interface Props {
  width: number;
  height: number;
  image?: string;
  handles: {
    onClick: (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
    onMouseDown: (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
    onMouseUp: (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
    onMouseMove: (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
    onMouseLeave: (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
    onTouchStart: (event: React.TouchEvent<HTMLCanvasElement>) => void;
    onTouchEnd: (event: React.TouchEvent<HTMLCanvasElement>) => void;
    onTouchMove: (event: React.TouchEvent<HTMLCanvasElement>) => void;
  },
  editorRef: RefObject<EditorRef>;
}

export const CanvasInner = (props: Props, outRef: any) => {

  const { tool, brush, eraser } = useSelector((state: RootState) => state.tools);

  const ref = useRef<HTMLCanvasElement>(null);

  const mergeRefs = (...refs: any | undefined) => {
    return (node: any) => {
      for (const ref of refs) {
        if(ref) ref.current = node
      }
    }
  }

  /**
   * Set the image
   */ 
  useEffect(() => {
    const { current: canvas } = ref;

    if(canvas && props.image) {
      const context = canvas.getContext('2d');

      if(context) {
        const image = new Image();
        image.src = props.image;

        image.onload = () => {
          context.clearRect(0, 0, props.width, props.height);
          context.drawImage(image, 0, 0);
        };
      }
    }
  }, [props.width, props.height]);


  /**
   * Set the brush color
   */
  useEffect(() => {
    const { current: canvas } = ref;

    if (canvas) {
      const context = canvas.getContext('2d');

      if (context) {
        context.strokeStyle = brush.color;
        context.lineJoin = 'round';
        context.lineCap = 'round';
      }
    }
  }, [brush.color, props.width, props.height])

  /**
   * Set drawing mode
   */
  useEffect(() => {
    const { current: canvas } = ref;

    if (canvas) {
      const context = canvas.getContext('2d');

      if (context) {
        switch (tool) {
          case 'brush':
            context.globalCompositeOperation = 'source-over';
            break;
          case 'eraser':
            context.globalCompositeOperation = 'destination-out';
            break;
        }
      }
    }
  }, [tool, props.width, props.height])

  /**
   * Set the brush size
   */
  useEffect(() => {
    const { current: canvas } = ref;

    if (canvas && (tool === 'brush' || tool === 'eraser')) {
      const context = canvas.getContext('2d');

      const sizes = {
        'brush': brush.size,
        'eraser': eraser.size,
      };

      if (context) {
        context.lineWidth = sizes[tool];
      }
    }
  }, [tool, brush.size, eraser.size, props.width, props.height])

  return (
    <Container 
      width={props.width}
      height={props.height}
      onClick={props.handles.onClick}
      onMouseDown={props.handles.onMouseDown}
      onMouseUp={props.handles.onMouseUp}
      onMouseMove={props.handles.onMouseMove}
      onMouseLeave={props.handles.onMouseLeave}
      onTouchStart={props.handles.onTouchStart}
      onTouchEnd={props.handles.onTouchEnd}
      onTouchMove={props.handles.onTouchMove}
      ref={mergeRefs(ref, outRef)} />
  );
}

export const Canvas = forwardRef(CanvasInner) as (props: Props & RefAttributes<unknown>) => JSX.Element;