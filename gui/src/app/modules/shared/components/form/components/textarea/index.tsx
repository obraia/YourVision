import React, { ChangeEvent, TextareaHTMLAttributes, useEffect } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { Container, TextAreaStyle, Label, Legend, Counter } from './styles';

interface Props {
  label?: string | null;
  error?: string | null;
  width: string;
  properties: TextareaHTMLAttributes<HTMLTextAreaElement>;
}

export const TextArea: React.FC<Props> = (props) => {
  const textareaRef = React.createRef<HTMLTextAreaElement>();
  const [length, setLength] = React.useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLength(e.currentTarget.value.length);

    if (props.properties.onChange) {
      props.properties.onChange(e);
    }
  };

  useEffect(() => {
    if(props.properties.defaultValue && textareaRef.current) {
      textareaRef.current.value = props.properties.defaultValue.toString()
      
      handleChange({ 
        currentTarget: { 
          value: props.properties.defaultValue.toString() 
        } 
      } as ChangeEvent<HTMLTextAreaElement>)
    }
  }, [props.properties.defaultValue, textareaRef, handleChange])

  return (
    <Container width={props.width}>
      {props.label && (
        <Label>
          {props.label}
          {props.properties.required && <Legend>*</Legend>}
        </Label>
      )}

      <TextAreaStyle {...props.properties} error={props.error} onChange={handleChange} ref={textareaRef} />
      
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
