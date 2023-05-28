import React, { InputHTMLAttributes } from 'react';
import { ChangeEvent } from '../../controller';
import { Button, ButtonsContainer, Container, Label, Legend } from './styles';

interface Props {
  children?: React.ReactNode;
  masks?: string[];
  label?: string | null;
  error?: string | null;
  properties: Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    count: number;
    onAdd?: () => void;
    onRemove?: () => void;
    onChange?: (e: ChangeEvent<string>) => void;
  }
}

export const Group: React.FC<Props> = (props) => {

  return (
    <Container>
      {props.label && (
        <Label>
          {props.label}
          {props.properties.required && <Legend>*</Legend>}
        </Label>
      )}
      {props.children}
      <ButtonsContainer>
        <Button onClick={props.properties.onRemove} disabled={props.properties.count === 1}>-</Button>
        <Button onClick={props.properties.onAdd}>+</Button>
      </ButtonsContainer>
    </Container>
  );
};
