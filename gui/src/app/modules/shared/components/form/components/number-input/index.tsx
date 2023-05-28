import React, { InputHTMLAttributes, useCallback } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { ChangeEvent } from '../../controller';
import { ArrowButtonBottom, ArrowButtonTop, ArrowsContainer, Container, InputStyle, Label, Legend } from './styles';

interface Props {
  label?: string | null;
  error?: string | null;
  width: string;
  properties: Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    onChange?: (e: ChangeEvent<number>) => void;
  }
}

const NumberInput: React.FC<Props> = (props) => {
  const inputRef = React.createRef<HTMLInputElement>();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = props.properties;
    const { currentTarget: input } = e;

    if(!input) return;

    const min = Number(input.min || Number.MIN_SAFE_INTEGER);
    const max = Number(input.max || Number.MAX_SAFE_INTEGER);

    if(input.value === '') input.value = '';
    else if(Number(input.value) < min) input.value = min.toString();
    else if(Number(input.value) > max) input.value = max.toString();

    if (onChange) {
      onChange({ name: input.name, value: Number(input.value) });
    }
  }, [props]);

  const handleStep = useCallback((step: number) => {
    const { current: input } = inputRef;

    if(input) {
      const fractionDigits = step.toString().split('.')[1]?.length || 0;

      input.value = (Number(input.value) + step).toFixed(fractionDigits);
      
      handleChange({
        currentTarget: input
      } as React.ChangeEvent<HTMLInputElement>)
    }
  }, [inputRef, handleChange])

  return (
    <Container width={props.width}>
      {props.label && (
        <Label>
          {props.label}
          {props.properties.required && <Legend>*</Legend>}
        </Label>
      )}

      <InputStyle {...props.properties} error={props.error} onChange={handleChange} ref={inputRef} />

      {props.properties.step && (
        <ArrowsContainer>
          <ArrowButtonTop type="button" onClick={() => handleStep(Number(props.properties.step))}>
            <IoMdArrowDropup />
          </ArrowButtonTop>
          
          <ArrowButtonBottom type="button" onClick={() => handleStep(-Number(props.properties.step))}>
            <IoMdArrowDropdown />
          </ArrowButtonBottom>
        </ArrowsContainer>
      )}
      
      {props.error && (
        <Legend>
          <AiOutlineInfoCircle />
          {props.error}
        </Legend>
      )}
    </Container>
  );
};

export { NumberInput };
