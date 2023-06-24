import { ForwardedRef, RefAttributes, RefObject, forwardRef } from 'react';
import { ImMagicWand } from 'react-icons/im';
import { useSelector } from 'react-redux';
import { LuMove } from 'react-icons/lu';
import { AlignType } from '../../tools/tool-button/properties/align';
import { RootState } from '../../../../../../infrastructure/redux/store';
import { Zoom } from '../zoom';
import { Shapes } from '../shapes';
import { Canvas } from '../canvas';
import { useController } from './controller';
import { Border, BrushIndicator, Container, CursorWrapper, Layer, LayerName, TextIndicator } from './styles';

export interface EditorRef {
  getImage: () => Promise<string> | undefined;
  getMask: () => Promise<string | void>;
  saveImage: () => Promise<void>;
  saveMask: () => void;
  addImages: (images: string[]) => void;
  clear: () => void;
  align: (value: AlignType) => void;
  updatePreview: () => void;
  resizeCanvas: () => void;
}

const EditorInner = (props: unknown, ref: ForwardedRef<EditorRef>) => {
  const { layers, currentLayerIndex } = useSelector((state: RootState) => state.layers);
  const { properties } = useSelector((state: RootState) => state.properties);
  const { tool } = useSelector((state: RootState) => state.tools);
  
  const { 
    refs, 
    canvasHandles, 
    zoomHandles, 
  } = useController(ref);

  return (
    <Container ref={refs.containerRef}>
      <LayerName children={layers[currentLayerIndex].name} />
      <Zoom ref={refs.zoomRef} onZoomScaleChange={zoomHandles.onZoomChange}>
        <Border id="border" $width={properties.width} $height={properties.height} ref={refs.borderRef}>
          { 
            layers.map((layer, index) => {
              const isCurrentLayer = index === currentLayerIndex;

              return (
                <Layer 
                  key={layer.id}
                  $visible={layer.visible}
                  $selected={isCurrentLayer}
                  $width={properties.width} 
                  $height={properties.height}
                  $locked={layer.locked}
                  $zIndex={index}
                  ref={isCurrentLayer ? refs.layerRef : undefined}>
                    
                  <Canvas 
                    width={properties.width}
                    height={properties.height}
                    image={layer.image}
                    handles={canvasHandles}
                    editorRef={ref as RefObject<EditorRef>}
                    ref={isCurrentLayer ? refs.canvasRef : undefined} />

                  <Shapes
                    width={properties.width} 
                    height={properties.height}
                    shapes={layer.shapes}
                    editorRef={ref as RefObject<EditorRef>}
                    ref={isCurrentLayer ? refs.shapesRef : undefined} />
                </Layer>
            )})
          }
        </Border>
      </Zoom>

      { ['brush', 'eraser'].includes(tool) && <BrushIndicator ref={refs.cursorRef} /> }
      { tool === 'text' && <TextIndicator ref={refs.cursorRef} /> }
      { tool === 'select' && <CursorWrapper ref={refs.cursorRef}><ImMagicWand /></CursorWrapper> }
      { tool === 'move' && <CursorWrapper ref={refs.cursorRef}><LuMove /></CursorWrapper> }
    </Container>
  );
}

export const Editor = forwardRef(EditorInner) as (props: any & RefAttributes<EditorRef>) => JSX.Element;

