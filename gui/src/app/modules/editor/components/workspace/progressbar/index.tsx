import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../infrastructure/redux/store';
import { Container, Progress, ProgressText } from './styles'

const Progressbar = () => {
  const { progress } = useSelector((state: RootState) => state.properties);

  if (progress.total === 0) return null;

  return (
    <Container>
      <Progress $progress={(progress.current / progress.total) * 100} />
      <ProgressText>{progress.current} / {progress.total}</ProgressText>
    </Container>
  )
}

export { Progressbar }
