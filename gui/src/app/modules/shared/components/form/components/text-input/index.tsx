import React, { InputHTMLAttributes, useCallback } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { mask } from 'remask';
import { ChangeEvent } from '../../controller';
import { Container, InputStyle, Label, Legend } from './styles';

interface Props {
  masks?: string[];
  label?: string | null;
  error?: string | null;
  width: string;
  properties: Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    onChange?: (e: ChangeEvent<string>) => void;
  }
}

const TextInput: React.FC<Props> = (props) => {

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = props.properties;
    const { currentTarget: input } = e;

    if (props.masks) {
      input.value = mask(input.value, props.masks);
    }

    if (onChange) {
      onChange({ name: input.name, value: input.value });
    }
  }, [props]);

  return (
    <Container width={props.width}>
      {props.label && (
        <Label>
          {props.label}
          {props.properties.required && <Legend>*</Legend>}
        </Label>
      )}
      <InputStyle {...props.properties} error={Boolean(props.error)} onChange={handleChange} />
      {props.error && (
        <Legend>
          <AiOutlineInfoCircle />
          {props.error}
        </Legend>
      )}
    </Container>
  );
};

export { TextInput };
