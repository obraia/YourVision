import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { TbLock, TbLockOpen, TbTrash } from 'react-icons/tb';
import { RootState } from '../../../../../../infrastructure/redux/store';
import { Container, Layer, LockIndicator, VisibilityButton } from './styles';
import { contextMenuActions } from '../../../../../../infrastructure/redux/reducers/contextmenu';
import { layersActions } from '../../../../../../infrastructure/redux/reducers/layers';

export const Layers = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { layers, currentLayerIndex } = useSelector((state: RootState) => state.layers);
  const dispatch = useDispatch();

  const contextMenuItems = (index: number) => [
    {
      id: 'TOGGLE_VISIBILITY',
      name: layers[index].visible ? 'Hide' : 'Show',
      icon: layers[index].visible ? MdVisibilityOff : MdVisibility,
      onClick() { 
        dispatch(layersActions.toggleLayerVisibility(index));
        dispatch(contextMenuActions.hideMenu());
      },
    },
    {
      id: 'TOGGLE_LOCK',
      name: layers[index].locked ? 'Unlock' : 'Lock',
      icon: layers[index].locked ? TbLockOpen : TbLock,
      onClick() {
        dispatch(layersActions.toggleLayerLock(index));
        dispatch(contextMenuActions.hideMenu());
      }
    },
    {
      id: 'DELETE',
      name: 'Delete',
      icon: TbTrash,
      onClick() { 
        dispatch(layersActions.deleteLayerByIndex(index));
        dispatch(contextMenuActions.hideMenu());
      },
    },
  ]

  const handleContextMenu = (e: MouseEvent, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(contextMenuActions.showMenu({ items: contextMenuItems(index), xPos: e.pageX, yPos: e.pageY }));
  }

  const handleSelect = (index: number) => {
    dispatch(layersActions.setCurrentLayerIndex(index));
  }

  const handleVisibility = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    dispatch(layersActions.toggleLayerVisibility(index));
  }

  const renderLayer = (layer: any, index: number) => {
    return (
      <Layer 
        key={index} 
        selected={index === currentLayerIndex}
        onContextMenu={(e: MouseEvent) => handleContextMenu(e, index)}
        onClick={() => handleSelect(index)}>
        <VisibilityButton onClick={(e: React.MouseEvent) => handleVisibility(e, index)}>
          {layer.visible ? <MdVisibility /> : <MdVisibilityOff />}
        </VisibilityButton>

        <LockIndicator>
          { layer.locked ? <TbLock /> : <TbLockOpen />}
        </LockIndicator>

        { layer.preview && <img src={layer.preview} alt="Layer preview" /> }
      </Layer>
    )
  }

  useEffect(() => {
    const { current: container } = containerRef;

    if(!container) return;

    const inverseScroll = (event: WheelEvent) => {
      event.preventDefault();
      container.scrollLeft += event.deltaY > 0 ? 50 : -50;
    }

    container.addEventListener('wheel', inverseScroll);

    return () => {
      container.removeEventListener('wheel', inverseScroll);
    }
  }, [layers])
    

  if(!layers.length) return null;

  return (
    <Container ref={containerRef}>
      {layers.map(renderLayer)}
    </Container>
  )
}
