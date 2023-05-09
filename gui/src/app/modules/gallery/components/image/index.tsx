import React from 'react'
import { Container, Img, Name } from './styles'
import { middleTruncateString } from '../../../shared/utils/formatters/string.formatter'
import { ImageData } from '../../../../../infrastructure/services/image.service'

interface Props {
  data: ImageData
  onMouseDownCapture?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onContextMenu?: (e: MouseEvent) => void
}

export const Image = (props: Props) => {
  const src = `${process.env.REACT_APP_API_URL}/static/images/${props.data.image}`;

  return (
    <Container
      onMouseDownCapture={props.onMouseDownCapture}
      onContextMenu={props.onContextMenu}>
      <Img src={src} />
      <Name>{middleTruncateString(props.data.image, 15)}</Name>
    </Container>
  )
}
