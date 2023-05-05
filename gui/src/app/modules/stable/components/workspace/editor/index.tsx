import { ForwardedRef, RefAttributes, forwardRef } from 'react';
import { ImMagicWand } from 'react-icons/im';
import { useSelector } from 'react-redux';
import { useController } from './controller';
import { Zoom } from '../zoom';
import { RootState } from '../../../../../../infrastructure/redux/store';
import { BrushIndicator, Canvas, Container, CursorWrapper, Image } from './styles';

export interface EditorRef {
  getImage: () => Promise<File> | undefined;
  getMask: () => Promise<File> | undefined;
  saveImage: () => void;
  saveMask: () => void;
  clear: () => void;
  delete: () => void;
}

const EditorInner = (props: unknown, ref: ForwardedRef<EditorRef>) => {
  const { image, properties } = useSelector((state: RootState) => state.properties);
  const { tool } = useSelector((state: RootState) => state.tools);
  
  const { 
    refs, 
    canvasHandles, 
    zoomHandles, 
  } = useController(ref);

  return (
    <Container ref={refs.containerRef}>
      <Zoom ref={refs.zoomRef} onZoomScaleChange={zoomHandles.onZoomChange}>
        <Canvas 
          ref={refs.canvasRef}
          onClick={canvasHandles.onSelect}
          onMouseDown={canvasHandles.onStartDrawing}
          onMouseUp={canvasHandles.onFinishDrawing}
          onMouseMove={canvasHandles.onDrawing}
          onMouseLeave={canvasHandles.onLeaveCanvas}
          onTouchStart={canvasHandles.onStartDrawingTouch}
          onTouchEnd={canvasHandles.onFinishDrawing}
          onTouchMove={canvasHandles.onDrawingTouch}
          width={properties.width}
          height={properties.height}
        />
        <Image src={image} ref={refs.imageRef} width={properties.width} height={properties.height} />
      </Zoom>

      { ['brush', 'eraser'].includes(tool) && <BrushIndicator ref={refs.cursorRef} /> }
      { tool === 'select' && <CursorWrapper ref={refs.cursorRef}><ImMagicWand /></CursorWrapper> }
    </Container>
  )
}

export const Editor = forwardRef(EditorInner) as (props: any & RefAttributes<EditorRef>) => JSX.Element;

