import React, { useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import {
  Arrow,
  Container,
  Input,
  InputWrapper,
  Label,
  Option,
  OptionLabel,
  OptionsList,
} from './styles';
import { Scroll } from '../../../../../../shared/components/layout/scroll';

export interface SelectItem {
  value: string | number;
  label: string;
}

interface Props {
  label?: string | null;
  items: SelectItem[];
  properties: {
    disabled?: boolean;
    defaultValue: string;
    onChange: (value: string) => void;
  }
}

export const Select: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const optionsRef = React.useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = props.properties;

    if (onChange) {
      onChange(e.currentTarget.value);
    }

    toggleOptions();
  };

  const handleSelect = (value: string | number) => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.value = value.toString();
    }

    handleChange({
      currentTarget: {
        value: value.toString(),
      }
    } as React.ChangeEvent<HTMLInputElement>)
  };

  const setOptionsPosition = () => {
    const { current: input } = inputRef;
    const { current: options } = optionsRef;

    if (!input || !options || !options.classList.contains('active')) return;

    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) {
        options.classList.remove('active');
      }
    });

    observer.observe(input);

    const {
      width: inputWidth,
      top: inputTop, 
      bottom: inputBottom,
      left: inputLeft,
    } = input.getBoundingClientRect();  

    options.style.width = `${inputWidth}px`;
    options.style.left = `${inputLeft}px`;

    const { 
      height: optionsHeight,
    } = options.getBoundingClientRect();

    if ((inputBottom + optionsHeight + 80) > window.innerHeight) {
      options.style.top = `${inputTop - optionsHeight - 5 }px`;
    } else {
      options.style.top = `${inputBottom + 5}px`;
    }
  }

  const toggleOptions = () => {
    const { current: options } = optionsRef;
    const { current: input } = inputRef;

    if (!options || !input) return;

    options.classList.toggle('active');

    setOptionsPosition();
  }

  useEffect(() => {
    const { current: container } = containerRef;
    const { current: options } = optionsRef;
    const { current: input } = inputRef;

    if (!options || !input || !container || !container.parentElement) return;

    const listItens = options.querySelectorAll('li');

    if(!listItens) return;

    for (const item of listItens) {
      item.addEventListener('mousedown', (e) => e.stopPropagation());
      item.addEventListener('click', () => handleSelect(item.id));
    }

    document.body.appendChild(options);

    const closeOnClickOutside = (e: MouseEvent) => {
      if (!container.contains(e.target as Node)) {
        options.classList.remove('active');
      }
    };

    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        options.classList.remove('active');
      }
    };

    document.addEventListener('click', closeOnClickOutside);
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('scroll', setOptionsPosition, true);
    window.addEventListener('resize', setOptionsPosition, true);

    return () => {
      document.body.removeChild(options);
      document.removeEventListener('click', closeOnClickOutside);
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('scroll', setOptionsPosition, true);
      window.removeEventListener('resize', setOptionsPosition, true);
    }
  }, []);

  return (
    <Container ref={containerRef}>
      <Label>{props.label}</Label>
      
      <InputWrapper>
        <Input
          {...props.properties}
          readOnly
          ref={inputRef}
          onChange={handleChange}
          onClick={toggleOptions}
          autoComplete='off' />

        <Arrow className={isOpen ? 'active' : ''}>
          <IoIosArrowDown />
        </Arrow>

        <OptionsList ref={optionsRef}>
          <Scroll column="true" scroll-auto="true">
            {/* <Option>
                <OptionLabel>Search...</OptionLabel>
            </Option> */}

            {props.items.map((item) => (
              <Option key={item.value} id={item.value}>
                <OptionLabel>{item.label}</OptionLabel>
              </Option>
            ))}
          </Scroll>
        </OptionsList>

      </InputWrapper>
    </Container>
  );
};