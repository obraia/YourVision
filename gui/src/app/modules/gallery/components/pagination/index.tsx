import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Button, Container } from "./styles";

interface Props {
  pages: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const Pagination = (props: Props) => {

  return (
    <Container>
      <Button onClick={props.onPrevious} disabled={!props.hasPrev}>
        <MdKeyboardArrowLeft />
      </Button>

      <Button onClick={props.onNext} disabled={!props.hasNext}>
        <MdKeyboardArrowRight />
      </Button>
    </Container>
  );
}