import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../infrastructure/redux/store';
import { ContextMenuItem } from '../../../../../shared/components/layout/contextmenu';
import { Button, Container } from './styles';

export const Actions = () => {
  const { items } = useSelector((state: RootState) => state.contextMenu);
 

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, action: ContextMenuItem) => {
    e.stopPropagation();

    if (action.onClick) {
      action.onClick(e);
    }
  }

  const renderAction = (item: ContextMenuItem) => {
    return (
      <Button key={item.id} onClick={(e: any) => handleClick(e, item)}>
        <item.icon />
      </Button>
    )
  }

  return (
    <Container>
      {items.map(renderAction)}
    </Container>
  )
}
