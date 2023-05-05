import React, { ChangeEvent, InputHTMLAttributes, useState } from 'react';
import { mask } from 'remask';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import {IoIosEye, IoIosEyeOff} from 'react-icons/io';
import { Container, InputStyle, Label, Legend, RightButton } from './styles';

interface PropsType extends InputHTMLAttributes<HTMLInputElement> {
  masks?: string[];
  label?: string | null;
  error?: string | null;
}

const Input = React.forwardRef<HTMLInputElement, PropsType>((props, ref) => {
  const [type, setType] = useState(props.type);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { onChange, masks } = props;

    if (masks) {
      e.currentTarget.value = mask(e.currentTarget.value, masks);
    }

    if (onChange) {
      onChange(e);
    }
  };

  const renderShowPassword = () => {
    if(props.type !== 'password') return

    const toggleType = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      setType(type === 'password' ? 'text' : 'password');
    };

    return (
      <RightButton onClick={toggleType} >
        {type === 'password' ? <IoIosEyeOff /> :<IoIosEye /> }
      </RightButton>
    )
  }

  return (
    <Container>
      {props.label && (
        <Label>
          {props.label}
          {props.required && <Legend>*</Legend>}
        </Label>
      )}

      <InputStyle {...props} type={type} ref={ref} error={Boolean(props.error)} onChange={handleChange} />

      {renderShowPassword()}
      
      {props.error && (
        <Legend>
          <AiOutlineInfoCircle />
          {props.error}
        </Legend>
      )}
    </Container>
  );
});

export { Input };
