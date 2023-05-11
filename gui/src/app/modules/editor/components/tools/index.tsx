import { MouseEvent, RefObject } from 'react';
import { Container, Gutter, ToolsWrapper } from './styles'
import { Tool, ToolButton } from './tool-button';
import { ImMagicWand } from 'react-icons/im';
import { toolsActions } from '../../../../../infrastructure/redux/reducers/tools';
import { FaEraser, FaPaintBrush, FaSave, FaTrash } from 'react-icons/fa';
import { MdOpacity } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../infrastructure/redux/store';
import { EditorRef } from '../workspace/editor';
import { propertiesActions } from '../../../../../infrastructure/redux/reducers/properties';

interface Props {
  editorRef: RefObject<EditorRef>;
}

const Tools = (props: Props) => {
  const { tool, brush, eraser, mask } = useSelector((state: RootState) => state.tools);
  const dispatch = useDispatch();

  const resizer = (e: MouseEvent) => {
    const element = e.target as HTMLDivElement;
    const width = element.parentElement?.clientWidth || 0;
    const x = e.clientX;

    const mouseMove = (e: globalThis.MouseEvent) => {
      const newWidth = width - (x - e.clientX);
      element.parentElement!.style.width = `${newWidth}px`;
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
      <ToolButton key={index} tool={tool} />
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
            max: 100,
            step: 1,
            defaultValue: [brush.size],
            onChange([value]) { dispatch(toolsActions.setBrushSize(value)) },
          }
        }
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
            max: 100,
            step: 1,
            defaultValue: [eraser.size],
            onChange([value]) { dispatch(toolsActions.setEraserSize(value)) },
          }
        }
      ],
      onClick() { dispatch(toolsActions.setTool('eraser')) },
    },
    {
      name: 'Mask',
      icon: MdOpacity,
      properties: [
        {
          label: 'Mask opacity',
          type: 'range',
          rangeOptions: {
            min: 0,
            max: 1,
            step: 0.1,
            defaultValue: [mask.opacity],
            onChange([value]) { dispatch(toolsActions.setMaskOpacity(value)) },
          }
        },
        {
          label: 'Mask blur',
          type: 'range',
          rangeOptions: {
            min: 0,
            max: 30,
            step: 1,
            defaultValue: [mask.blur],
            onChange([value]) { dispatch(toolsActions.setMaskBlur(value)) },
          }
        },
        {
          label: 'Mask color',
          type: 'colors',
          colorOptions: {
            defaultValue: mask.color,
            onChange(value) { dispatch(toolsActions.setMaskColor(value)) },
          }
        },
        {
          label: 'Save mask',
          type: 'button',
          buttonOptions: {
            color: 'textPrimary',
            backgroundColor: 'primary',
            onClick() {
              props.editorRef.current?.saveMask();
            },
          }
        },
        {
          label: 'Clear mask',
          type: 'button',
          buttonOptions: {
            color: 'error',
            backgroundColor: 'textError',
            onClick() {
              props.editorRef.current?.clear();
            },
          }
        },
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
      name: 'Delete',
      icon: FaTrash,
      properties: [
        {
          label: 'Remove current',
          type: 'button',
          buttonOptions: {
            color: 'textPrimary',
            backgroundColor: 'primary',
            onClick() {
              dispatch(propertiesActions.deleteCurrent());
            },
          }
        },
        {
          label: 'Remove all',
          type: 'button',
          buttonOptions: {
            color: 'error',
            backgroundColor: 'textError',
            onClick() {
              dispatch(propertiesActions.deleteAll());
            },
          }
        },
      ],
    },
  ];

  return (
    <Container>
      <ToolsWrapper>
        {tools.map(renderTool)}
      </ToolsWrapper>
      <Gutter onMouseDown={resizer} />
    </Container>
  )
}

export { Tools }
