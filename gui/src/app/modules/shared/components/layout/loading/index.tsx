import React from 'react'
import { useSelector } from 'react-redux'
import { BeatLoader } from 'react-spinners'
import { RootState } from '../../../../../../infrastructure/redux/store'
import { Container } from './styles'

interface Props {
  loading?: boolean
}

const Loading = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { theme } = useSelector((state: RootState) => state.theme)

  return (
    <Container ref={ref}>
      <BeatLoader size={10} color={theme.colors.primary} loading={props.loading} />
    </Container>
  )
})

export { Loading }
