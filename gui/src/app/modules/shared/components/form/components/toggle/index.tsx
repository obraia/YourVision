import React, { InputHTMLAttributes } from 'react';

import { Container, InputGroup, Input, ToggleStyle, Label } from './styles';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string | null;
}

const Toggle: React.FC<Props> = (props) => {
  const handle_change = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = props;

    event.currentTarget.value = event.currentTarget.checked ? 'true' : 'false';

    if (onChange) {
      onChange(event);
    }
  };

  return (
    <Container>
      <InputGroup>
        <Input
          id={props.id}
          name={props.name}
          type='checkbox'
          onChange={handle_change}
          defaultChecked={props.defaultChecked}
        />
        <ToggleStyle htmlFor={props.id} />
      </InputGroup>
      {props.label && <Label>{props.label}</Label>}
    </Container>
  );
};

export { Toggle };
