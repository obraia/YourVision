import React, { InputHTMLAttributes, useEffect } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { IoIosArrowDown } from 'react-icons/io';
import { mask } from 'remask';
import { Scroll } from '../../../layout/scroll';
import { ChangeEvent } from '../../controller';
import {
  Arrow,
  Container,
  Input,
  InputWrapper,
  Label,
  Legend,
  Option,
  OptionLabel,
  OptionSearch,
  OptionSearchInput,
  OptionsList,
  OptionsScroll,
} from './styles';

export interface SelectItem {
  value: string | number;
  label: string;
}

interface Props {
  items: SelectItem[];
  masks?: string[];
  label?: string | null;
  error?: string | null;
  width: string;
  properties: Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    onChange?: (e: ChangeEvent<string>) => void;
  }
}

export const Select: React.FC<Props> = (props) => {
  const [items, setItems] = React.useState<SelectItem[]>(props.items || []);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const optionsRef = React.useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = props.properties;
    const { currentTarget: input } = e;

    if (props.masks) {
      input.value = mask(input.value, props.masks);
    }

    if (onChange) {
      onChange({ name: input.name, value: e.currentTarget.value });
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
        name: props.properties.name,
        value: value.toString(),
      }
    } as React.ChangeEvent<HTMLInputElement>)
  };

  const handleSearch = (event: Event) => {
    const { value } = event.target as HTMLInputElement;
    
    const filteredItems = props.items.filter(item => {
      return item.label.toLowerCase().includes(value.toLowerCase());
    });

    setItems(filteredItems);
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

    if ((inputBottom + optionsHeight + 120) > window.innerHeight) {
      options.style.top = `${inputTop - optionsHeight - 5 }px`;
    } else {
      options.style.top = `${inputBottom + 5}px`;
    }
  }

  const toggleOptions = () => {
    const { current: options } = optionsRef;

    if (options) {
      options.classList.toggle('active');
      setOptionsPosition();
    }
  }

  const stopPropagation = (e: MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const { current: container } = containerRef;
    const { current: options } = optionsRef;
    const { current: search } = searchRef;
    const { current: input } = inputRef;

    if (!options || !search || !input || !container || !container.parentElement) return;

    const listItens = options.querySelectorAll('li');

    if(!listItens) return;

    for (const item of listItens) {
      if(item.id) item.addEventListener('click', () => handleSelect(item.id));
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

    const handleSearch = (event: Event) => {
      const { value } = event.target as HTMLInputElement;
      
      for (const item of listItens) {
        if (item.textContent?.toLowerCase().includes(value.toLowerCase())) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      }

      const hiddenItens = options.querySelectorAll('li.hidden');

      if (hiddenItens.length === listItens.length) {
        options.classList.add('empty');
      } else {
        options.classList.remove('empty');
      }

      setOptionsPosition();
    }

    document.addEventListener('click', closeOnClickOutside);
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('scroll', setOptionsPosition, true);
    window.addEventListener('resize', setOptionsPosition, true);
    search.addEventListener('input', handleSearch);
    search.addEventListener('click', stopPropagation);

    return () => {
      document.body.removeChild(options);
      document.removeEventListener('click', closeOnClickOutside);
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('scroll', setOptionsPosition, true);
      window.removeEventListener('resize', setOptionsPosition, true);
      search.removeEventListener('input', handleSearch);
      search.removeEventListener('click', stopPropagation);
    }

  }, []);

  return (
    <Container width={props.width} ref={containerRef}>
      {props.label && (
        <Label>
          {props.label}
          {props.properties.required && <Legend>*</Legend>}
        </Label>
      )}
      <InputWrapper>
        <Input
          {...props.properties}
          ref={inputRef}
          error={props.error}
          onChange={handleChange}
          onClick={toggleOptions}
          autoComplete='off' />

        <Arrow>
          <IoIosArrowDown />
        </Arrow>

        <OptionsList ref={optionsRef}>
          <OptionSearch>
            <OptionSearchInput ref={searchRef} />
          </OptionSearch>

          <OptionsScroll>
            {items.map((item) => (
              <Option key={item.value} id={item.value}>
                <OptionLabel>{item.label}</OptionLabel>
              </Option>
            ))}
          </OptionsScroll>
        </OptionsList>

      </InputWrapper>

      {props.error && (
        <Legend>
          <AiOutlineInfoCircle />
          {props.error}
        </Legend>
      )}
    </Container>
  );
};