import { useState } from 'react';
import { Container, Input } from './styles';

interface Props {
  label?: string | null;
  error?: string | null;
  width: string;
  properties: React.InputHTMLAttributes<HTMLInputElement>;
}

const Toggle = (props: Props) => {
  return (
    <Container width={props.width}>
      <Input {...props.properties} />
      {props.label}
    </Container>
  )
}

export { Toggle }
