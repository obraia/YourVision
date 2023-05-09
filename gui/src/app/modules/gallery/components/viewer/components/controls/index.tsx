import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { Button, Container } from './styles';

export interface ControlsProps {
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
}

export const Controls = (props: ControlsProps) => {

  const handlePrevious = (e: MouseEvent) => {
    e.stopPropagation();

    if (props.onPrevious) {
      props.onPrevious();
    }
  }

  const handleNext = (e: MouseEvent) => {
    e.stopPropagation();

    if (props.onNext) {
      props.onNext();
    }
  }

  return (
    <Container>
      <Button onClick={handlePrevious} disabled={!props.hasPrevious}>
        <SlArrowLeft />
      </Button>

      <Button onClick={handleNext} disabled={!props.hasNext}>
        <SlArrowRight />
      </Button>
    </Container>
  )
}
