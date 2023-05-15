import { useState } from 'react';
import { Container } from './styles';

interface Props {
  label: string;
  properties: {
    defaultValue?: boolean;
    onChange?: (value: boolean) => void;
  }
}

const Toggle = (props: Props) => {
  const [value, setValue] = useState(props.properties.defaultValue);

  const toggle = () => {
    const newValue = !value;
    setValue(newValue);

    if(props.properties.onChange) {
      props.properties.onChange(newValue);
    }
  }

  return (
    <Container $active={value} onClick={toggle}>
      {props.label}
    </Container>
  )
}

export { Toggle }
