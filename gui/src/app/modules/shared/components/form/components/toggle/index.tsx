import { ChangeEvent, useRef } from 'react';
import { Container, Input } from './styles';

interface Props {
  label?: string | null;
  error?: string | null;
  width: string;
  properties: React.InputHTMLAttributes<HTMLInputElement>;
}

const Toggle = (props: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = () => {
    const { current: input } = inputRef;
    const { onChange } = props.properties;

    if (!input) return;

    input.value = input.value === 'true' ? 'false' : 'true';

    if (onChange) {
      onChange({ target: input } as ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <Container width={props.width}>
      <Input {...props.properties} ref={inputRef} />
      {props.label}
    </Container>
  )
}

export { Toggle }
