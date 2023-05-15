import React, { ChangeEvent, InputHTMLAttributes, useCallback, useEffect } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { ArrowButtonBottom, ArrowButtonTop, ArrowsContainer, Container, InputStyle, Label, Legend } from './styles';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';

interface Props {
  label?: string | null;
  error?: string | null;
  width: string;
  properties: InputHTMLAttributes<HTMLInputElement>;
}

const NumberInput: React.FC<Props> = (props) => {
  const inputRef = React.createRef<HTMLInputElement>();

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { onChange } = props.properties;
    const { current: input } = inputRef;

    if(!input) return;

    const min = Number(e.currentTarget.min || Number.MIN_SAFE_INTEGER);
    const max = Number(e.currentTarget.max || Number.MAX_SAFE_INTEGER);

    if(e.currentTarget.value === '') e.currentTarget.value = '';
    else if(Number(e.currentTarget.value) < min) e.currentTarget.value = min.toString();
    else if(Number(e.currentTarget.value) > max) e.currentTarget.value = max.toString();

    input.value = e.currentTarget.value;

    if(!e.target) e.target = input;
    if (onChange) onChange(e);
  }, [props]);

  const handleStep = useCallback((step: number) => {
    const { current: input } = inputRef;

    if(input) {
      const value = Number(input.value) + step;
      
      props.properties.onChange?.({
        currentTarget: {
          value: value.toString(),
          min: input.min,
          max: input.max
        }} as ChangeEvent<HTMLInputElement>)

      handleChange({
        currentTarget: {
          value: value.toString(),
          min: input.min,
          max: input.max
        }
      } as ChangeEvent<HTMLInputElement>)
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
