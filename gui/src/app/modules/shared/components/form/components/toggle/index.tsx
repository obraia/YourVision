import { InputHTMLAttributes, useCallback, useRef } from 'react';
import { ChangeEvent } from '../../controller';
import { Container, Input } from './styles';

interface Props {
  label?: string | null;
  error?: string | null;
  width: string;
  properties: Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    onChange?: (e: ChangeEvent<boolean>) => void;
  }
}

const Toggle = (props: Props) => {

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = props.properties;
    const { currentTarget: input } = e;

    if (onChange) {
      onChange({ name: input.name, value: input.checked });
    }
  }, [props]);

  return (
    <Container width={props.width}>
      <Input {...props.properties} onChange={handleChange} />
      {props.label}
    </Container>
  )
}

export { Toggle }
