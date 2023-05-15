import { ChangeEvent, InputHTMLAttributes, createRef, useCallback, useState } from 'react';
import { IRenderThumbParams, IRenderTrackParams } from 'react-range/lib/types';
import { Container, Input, Label} from './styles';

interface Props {
  label?: string;
  error?: string;
  width: string;
  properties: InputHTMLAttributes<HTMLInputElement>;
}

const Range = (props: Props) => {
  const inputRef = createRef<HTMLInputElement>();

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

  return (
    <Container width={props.width}>
      { props.label && <Label>{props.label}</Label>} 
      <Input {...props.properties}  onChange={handleChange} ref={inputRef} />
    </Container>
  )
}

export { Range }
