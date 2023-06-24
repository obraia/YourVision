import { useDispatch, useSelector } from 'react-redux';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { TbLock, TbLockOpen, TbMask, TbMaskOff, TbTrash } from 'react-icons/tb';
import { CgRename } from 'react-icons/cg';
import { RootState } from '../../../../../../../../infrastructure/redux/store';
import { contextMenuActions } from '../../../../../../../../infrastructure/redux/reducers/contextmenu';
import { layersActions } from '../../../../../../../../infrastructure/redux/reducers/layers';
import { Container, Label, Layer, VisibilityButton } from './styles';

export const Layers = () => {
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
      id: 'MASK',
      name: layers[index].mask ? 'Unmask' : 'Mask',
      icon: layers[index].mask ? TbMaskOff : TbMask,
      onClick() {
        dispatch(layersActions.toggleLayerMask(index));
        dispatch(contextMenuActions.hideMenu());
      }
    },
    {
      id: 'RENAME',
      name: 'Rename',
      icon: CgRename,
      onClick() {
        const name = prompt('Enter new layer name', layers[index].name);

        if(name) {
          dispatch(layersActions.renameLayerByIndex({ index, name }));
        }

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

  const handleLock = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    dispatch(layersActions.toggleLayerLock(index));
  }

  const renderLayer = (layer: any, index: number) => {
    return (
      <Layer 
        key={layer.id}
        $mask={layer.mask}
        $selected={index === currentLayerIndex}
        onContextMenu={(e: MouseEvent) => handleContextMenu(e, index)}
        onClick={() => handleSelect(index)}>
        <VisibilityButton onClick={(e: React.MouseEvent) => handleLock(e, index)}>
          {layer.locked ? <TbLock /> : <TbLockOpen />}
        </VisibilityButton>

        <Label>{layer.name}</Label>

        <VisibilityButton onClick={(e: React.MouseEvent) => handleVisibility(e, index)}>
          {layer.visible ? <MdVisibility /> : <MdVisibilityOff />}
        </VisibilityButton>
      </Layer>
    )
  }

  if(!layers.length) return null;

  return (
    <Container>
      {layers.map(renderLayer)}
    </Container>
  )
}
