import React, { TextareaHTMLAttributes } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { ChangeEvent } from '../../controller';
import { Container, TextAreaStyle, Label, Legend, Counter } from './styles';

interface Props {
  label?: string | null;
  error?: string | null;
  width: string;
  properties: Omit<TextareaHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    onChange?: (e: ChangeEvent<string>) => void;
  }
}

export const TextArea: React.FC<Props> = (props) => {
  const [length, setLength] = React.useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { onChange } = props.properties;
    const { currentTarget: textarea } = e;

    setLength(textarea.value.length);

    if (onChange) {
      onChange({ name: textarea.name, value: textarea.value });
    }
  };

  return (
    <Container width={props.width}>
      {props.label && (
        <Label>
          {props.label}
          {props.properties.required && <Legend>*</Legend>}
        </Label>
      )}

      <TextAreaStyle {...props.properties} error={props.error} onChange={handleChange} />
      
      <Counter>
        {length}/{props.properties.maxLength}
      </Counter>

      {props.error && (
        <Legend>
          <AiOutlineInfoCircle />
          {props.error}
        </Legend>
      )}
    </Container>
  );
};
