import { ImageData } from '../../../../../../../infrastructure/services/image.service';
import { Container, Field } from './styles';

interface Props {
  data: ImageData['properties'];
}

export const Info = (props: Props) => {

  const fields = Object.entries(props.data);

  return (
    <Container>
      {fields.map(([key, value], index) => (
        <Field key={index}>
          <strong>{key}:</strong> {value}
        </Field>
      ))}
    </Container>
  )
}
