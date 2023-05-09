import { Container, Img, Name } from './styles'
import { middleTruncateString } from '../../../shared/utils/formatters/string.formatter'
import { ImageData } from '../../../../../infrastructure/services/image.service'

interface Props {
  data: ImageData
  onContextMenu?: (e: MouseEvent) => void
  onClick?: (e: MouseEvent) => void
  onNext?: () => void
  onPrevious?: () => void
}

export const Image = (props: Props) => {
  const src = `${process.env.REACT_APP_API_URL}/static/images/${props.data.image}`;

  return (
    <Container
      onContextMenu={props.onContextMenu}
      onClick={props.onClick}>
      <Img src={src} />
      <Name>{middleTruncateString(props.data.image, 15)}</Name>
    </Container>
  )
}
