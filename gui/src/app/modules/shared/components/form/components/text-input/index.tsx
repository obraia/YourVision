import React, { ChangeEvent, InputHTMLAttributes, useCallback, useEffect } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { mask } from 'remask';
import { Container, InputStyle, Label, Legend } from './styles';

interface Props {
  masks?: string[];
  label?: string | null;
  error?: string | null;
  width: string;
  properties: InputHTMLAttributes<HTMLInputElement>
}

const TextInput: React.FC<Props> = (props) => {
  const inputRef = React.createRef<HTMLInputElement>();

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { onChange } = props.properties;

    if (props.masks) {
      e.currentTarget.value = mask(e.currentTarget.value, props.masks);
    }

    if (onChange) {
      onChange(e);
    }
  }, [props]);

  useEffect(() => {
    if(props.properties.defaultValue && inputRef.current) {
      inputRef.current.value = props.properties.defaultValue.toString()
      
      handleChange({ 
        currentTarget: { 
          value: props.properties.defaultValue.toString() 
        } 
      } as ChangeEvent<HTMLInputElement>)
    }
  }, [props.properties.defaultValue, inputRef, handleChange])

  return (
    <Container width={props.width}>
      {props.label && (
        <Label>
          {props.label}
          {props.properties.required && <Legend>*</Legend>}
        </Label>
      )}
      <InputStyle {...props.properties} error={Boolean(props.error)} onChange={handleChange} ref={inputRef} />
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
