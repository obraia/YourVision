import { RefAttributes, RefObject, forwardRef, useRef } from 'react';
import { Shape } from '../../../../../../infrastructure/redux/reducers/layers';
import { Container } from './styles';
import { EditorRef } from '../editor';

export interface Props {
  width: number;
  height: number;
  shapes: Shape[];
  editorRef: RefObject<EditorRef>;
}

export const ShapesInner = (props: Props, outRef: any) => {

  const ref = useRef<HTMLDivElement>(null);

  const mergeRefs = (...refs: any | undefined) => {
    return (node: any) => {
      for (const ref of refs) {
        if(ref) ref.current = node
      }
    }
  }
  
  const renderShape = (shape: Shape) => {
    if(shape.type === 'image' && shape.imageOptions) {
      return (
        <img
          key={shape.id}
          id={shape.id}
          className={shape.classList?.join(' ')}
          src={shape.imageOptions.src}
          style={{
            position: 'absolute',
            top: shape.y + 'px',
            left: shape.x + 'px',
            width: shape.imageOptions.width + 'px',
            height: shape.imageOptions.height + 'px',
          }}
        />
      );
    } else if(shape.type === 'text' && shape.textOptions) {
      return (
        <h1
          key={shape.id}
          id={shape.id}
          className={shape.classList?.join(' ')}
          children={shape.textOptions.text}
          style={{
            position: 'absolute',
            top: shape.y + 'px',
            left: shape.x + 'px',
            fontSize: shape.textOptions.fontSize + 'px',
            fontFamily: shape.textOptions.fontFamily,
            fontWeight: shape.textOptions.fontWeight,
            color: shape.textOptions.color,
          }}
        />
      );
    }
  }

  return (
    <Container 
      $width={props.width} 
      $height={props.height}
      children={props.shapes.map(renderShape)}
      ref={mergeRefs(ref, outRef)} />
  );
}

export const Shapes = forwardRef(ShapesInner) as (props: Props & RefAttributes<unknown>) => JSX.Element;