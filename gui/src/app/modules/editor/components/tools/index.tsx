import { MouseEvent, RefObject, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tool, ToolButton } from './tool-button';
import { LuMove } from 'react-icons/lu';
import { ImMagicWand } from 'react-icons/im';
import { FaEraser, FaPaintBrush, FaSave, FaTrash } from 'react-icons/fa';
import { BiText } from 'react-icons/bi';
import { toolsActions } from '../../../../../infrastructure/redux/reducers/tools';
import { RootState } from '../../../../../infrastructure/redux/store';
import { EditorRef } from '../workspace/editor';
import { Container, Gutter, ToolsWrapper } from './styles'
import { IoLayers } from 'react-icons/io5';
import { layersActions } from '../../../../../infrastructure/redux/reducers/layers';
import { propertiesActions } from '../../../../../infrastructure/redux/reducers/properties';

interface Props {
  editorRef: RefObject<EditorRef>;
}

const Tools = (props: Props) => {
  const { tool, brush, eraser, text, mask } = useSelector((state: RootState) => state.tools);

  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();

  const resizer = (e: MouseEvent) => {
    const element = e.target as HTMLDivElement;
    const width = element.parentElement?.clientWidth || 0;
    const x = e.clientX;

    const mouseMove = (e: globalThis.MouseEvent) => {
      const newWidth = width - (x - e.clientX);
      element.parentElement!.style.width = `${newWidth}px`;
      
      setExpanded(newWidth > 180);

      if(props.editorRef.current) {
        props.editorRef.current.resizeCanvas();
      }
    };

    const mouseUp = () => {
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    };

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
  }

  const renderTool = (tool: Tool, index: number) => {
    return (
      <ToolButton key={index} tool={tool} expanded={expanded} />
    )
  }

  const tools: Tool[] = [
    {
      name: 'Select',
      icon: ImMagicWand,
      active: tool === 'select',
      onClick() { dispatch(toolsActions.setTool('select')) },
    },
    {
      name: 'Brush',
      icon: FaPaintBrush,
      active: tool === 'brush',
      properties: [
        {
          label: 'Brush size',
          type: 'range',
          rangeOptions: {
            min: 1,
            max: 50,
            step: 0.1,
            defaultValue: brush.size,
            onChange(value) { dispatch(toolsActions.setBrushSize(value)) },
          }
        },
        {
          label: 'Softness',
          type: 'range',
          rangeOptions: {
            min: 0,
            max: 10,
            step: 0.1,
            defaultValue: mask.blur,
            onChange(value) { dispatch(toolsActions.setMaskBlur(value)) },
          }
        },
        {
          label: 'Brush color',
          type: 'colors',
          colorOptions: {
            defaultValue: brush.color,
            onChange(value) { dispatch(toolsActions.setBrushColor(value)) },
          }
        },
      ],
      onClick() { dispatch(toolsActions.setTool('brush')) },
    },
    {
      name: 'Eraser',
      icon: FaEraser,
      active: tool === 'eraser',
      properties: [
        {
          label: 'Eraser size',
          type: 'range',
          rangeOptions: {
            min: 1,
            max: 50,
            step: 0.1,
            defaultValue: eraser.size,
            onChange(value) { dispatch(toolsActions.setEraserSize(value)) },
          }
        },
        {
          label: 'Softness',
          type: 'range',
          rangeOptions: {
            min: 0,
            max: 10,
            step: 0.1,
            defaultValue: mask.blur,
            onChange(value) { dispatch(toolsActions.setMaskBlur(value)) },
          }
        },
      ],
      onClick() { dispatch(toolsActions.setTool('eraser')) },
    },
    {
      name: 'Text',
      icon: BiText,
      active: tool === 'text',
      properties: [
        {
          label: 'Font',
          type: 'select',
          selectOptions: {
            defaultValue: text.fontFamily,
            disabled: true,
            items: [
              { label: 'Arial', value: 'Arial' },
              { label: 'Dancing Script', value: 'Dancing Script' },
              { label: 'Open Sans', value: 'Open Sans' },
              { label: 'Pacifico', value: 'Pacifico' },
              { label: 'Roboto', value: 'Roboto' },
              { label: 'M PLUS Rounded 1c', value: 'M PLUS Rounded 1c' },
              { label: 'Times New Roman', value: 'Times New Roman' },
            ],
            onChange(value) { dispatch(toolsActions.setTextFontFamily(value)) },
          }
        },
        {
          label: 'Font weight',
          type: 'select',
          selectOptions: {
            defaultValue: text.fontWeight,
            disabled: true,
            items: [
              { label: 'lighter', value: 'lighter' },
              { label: 'normal', value: 'normal' },
              { label: 'bold', value: 'bold' },
              { label: 'bolder', value: 'bolder' },
              { label: '100', value: '100' },
              { label: '200', value: '200' },
              { label: '300', value: '300' },
              { label: '400', value: '400' },
              { label: '500', value: '500' },
              { label: '600', value: '600' },
              { label: '700', value: '700' },
              { label: '800', value: '800' },
              { label: '900', value: '900' },
            ],
            onChange(value) { dispatch(toolsActions.setTextFontWeight(value)) },
          }
        },
        {
          label: 'Font size',
          type: 'range',
          rangeOptions: {
            min: 1,
            max: 320,
            step: 1,
            defaultValue: text.size,
            onChange(value) { dispatch(toolsActions.setTextSize(value)) },
          }
        },
        {
          label: 'Text color',
          type: 'colors',
          colorOptions: {
            defaultValue: text.color,
            onChange(value) { dispatch(toolsActions.setTextColor(value)) },
          }
        },
      ],
      onClick() { dispatch(toolsActions.setTool('text')) },
    },
    {
      name: 'Move',
      icon: LuMove,
      active: tool === 'move',
      properties: [
        {
          label: 'Align objects',
          type: 'align',
          alignOptions: {
            onChange(value) { 
              props.editorRef.current?.align(value);
            },
          }
        },
      ],
      onClick() { dispatch(toolsActions.setTool('move')) },
    },
    {
      name: 'Layer',
      icon: IoLayers,
      properties: [
        {
          label: 'Layer opacity',
          type: 'range',
          rangeOptions: {
            min: 0,
            max: 1,
            step: 0.1,
            defaultValue: mask.opacity,
            onChange(value) { dispatch(toolsActions.setMaskOpacity(value)) },
          }
        },
        {
          label: 'New layer',
          type: 'button',
          buttonOptions: {
            color: 'textPrimary',
            backgroundColor: 'primary',
            onClick() { 
              dispatch(layersActions.createLayer({
                shapes: [], 
                preview: '', 
                visible: true, 
                mask: false,
                locked: false,
              }));
            },
          }
        },
        {
          label: 'Layers',
          type: 'layers',
        }
      ],
    },
    {
      name: 'Save',
      icon: FaSave,
      onClick() {
        props.editorRef.current?.saveImage();
      },
    },
    {
      name: 'Clear',
      icon: FaTrash,
      onClick() {
        dispatch(layersActions.removeAllLayers());
        dispatch(propertiesActions.setLoading(false));
        dispatch(propertiesActions.setProgress(0));
      }
    }
  ];

  return (
    <Container $expanded={expanded}>
      <ToolsWrapper $expanded={expanded}>
        {tools.map(renderTool)}
      </ToolsWrapper>
      <Gutter onMouseDown={resizer} />
    </Container>
  )
}

export { Tools }
