import React from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { IoIosArrowDown } from 'react-icons/io';
import { mask } from 'remask';
import { Scroll } from '../../../layout/scroll';
import {
  Arrow,
  Container,
  Input,
  InputWrapper,
  Label,
  Legend,
  Option,
  OptionsList,
  OuterContainer,
} from './styles';

export interface SelectItem {
  value: string | number;
  label: string;
}

interface Props {
  items?: SelectItem[];
  masks?: string[];
  label?: string | null;
  error?: string | null;
  width: string;
  properties: React.InputHTMLAttributes<HTMLInputElement>;
}

export const Select: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const ref = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.masks) {
      e.currentTarget.value = mask(e.currentTarget.value, props.masks);
    }

    if (props.properties.onChange) {
      props.properties.onChange(e);
    }
  };

  const handleSelect = (value: string | number) => {
    setIsOpen(false);

    if (ref.current) {
      ref.current.focus();
      ref.current.value = value.toString();
    }
  };

  const toggleOptions = React.useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <>
      {isOpen && <OuterContainer onClick={toggleOptions} />}
      <Container width={props.width}>
        {props.label && (
          <Label>
            {props.label}
            {props.properties.required && <Legend>*</Legend>}
          </Label>
        )}
        <InputWrapper>
          <Input
            {...props.properties}
            ref={ref}
            error={props.error}
            onChange={handleChange}
            onClick={toggleOptions}
            autoComplete='off' />

          <Arrow className={isOpen ? 'active' : ''}>
            <IoIosArrowDown />
          </Arrow>

          {isOpen && (
            <OptionsList>
              <Scroll column="true" scroll-auto="true">
                {props.items?.map((item, index) => (
                  <Option key={index} onClick={() => handleSelect(item.value)}>
                    {item.label}
                  </Option>
                ))}
              </Scroll>
            </OptionsList>
          )}
        </InputWrapper>

        {props.error && (
          <Legend>
            <AiOutlineInfoCircle />
            {props.error}
          </Legend>
        )}
      </Container>
    </>
  );
};