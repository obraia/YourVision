import { ImageData } from '../../../../../infrastructure/services/image.service';
import { middleTruncateString } from '../../../shared/utils/formatters/string.formatter';
import { Controls, ControlsProps } from './components/controls';
import { Actions } from './components/actions';
import { Container, Img, Name } from './styles';

interface Props {
  data: ImageData | null;
  constrolsProps: ControlsProps;
  onClose: () => void;
}

export const Viewer = (props: Props) => {

  if (!props.data) {
    return null;
  }

  const src = `${process.env.REACT_APP_API_URL}/static/images/${props.data.image}`;

  return (
    <Container onClick={props.onClose}>
      <Img src={src} />
      <Name>{middleTruncateString(props.data.image, 30)}</Name>
      <Controls
        hasPrevious={props.constrolsProps.hasPrevious}
        hasNext={props.constrolsProps.hasNext}
        onPrevious={props.constrolsProps.onPrevious} 
        onNext={props.constrolsProps.onNext} />
      <Actions />
    </Container>
  )
}
