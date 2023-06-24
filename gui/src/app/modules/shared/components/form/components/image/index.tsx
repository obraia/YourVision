import React, { InputHTMLAttributes, useEffect } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { BiImageAdd } from 'react-icons/bi';
import { ChangeEvent } from '../../controller';
import { Container, Image, Input, Label, Legend } from './styles';

interface Props {
  label?: string | null;
  error?: string | null;
  width: string;
  properties: Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    onChange?: (e: ChangeEvent<string>) => void;
  }
}

const ImageInput: React.FC<Props> = (props) => {
  const inputRef = React.createRef<HTMLInputElement>();
  const imageRef = React.createRef<HTMLDivElement>();

  useEffect(() => {
    const { current: image } = imageRef;
    const { current: input } = inputRef;

    if (image && input) {
      image.addEventListener('click', () => {
        input.click()
      })

      image.addEventListener('dragover', (e) => {
        e.preventDefault()
      })

      image.addEventListener('dragenter', (e) => {
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'copy'
          image.classList.add('dragover')
        }
      })

      image.addEventListener('dragleave', () => {
        image.classList.remove('dragover')
      })

      image.addEventListener('drop', (e) => {
        e.preventDefault()

        const { onChange } = props.properties;
        
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          image.classList.remove('dragover');

          const reader = new FileReader();

          reader.onload = (e) => {
            if (e.target?.result) {
              image.style.backgroundImage = `url(${e.target.result})`;

              if (onChange  && input.name) {
                onChange({ name: input.name, value: e.target.result.toString() });
              }
            }
          }

          reader.readAsDataURL(e.dataTransfer.files[0]);
        }
      });

      input.addEventListener('change', () => {
        const { onChange } = props.properties;

        if (input.files && input.files[0]) {
          const reader = new FileReader();

          reader.onload = (e) => {
            if (e.target?.result) {
              image.style.backgroundImage = `url(${e.target.result})`;

              if (onChange  && input.name) {
                onChange({ name: input.name, value: e.target.result.toString() });
              }
            }
          }

          reader.readAsDataURL(input.files[0]);
        }
      })
    }
  }, []);

  useEffect(() => {
    const { current: image } = imageRef;
    const { current: input } = inputRef;

    setTimeout(() => {
      if (image && input && input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = (e) => {
          if (e.target?.result) {
            image.style.backgroundImage = `url(${e.target.result})`;
          }
        }

        reader.readAsDataURL(input.files[0]);
      }
    } , 500)
  }, []);

  return (
    <Container width={props.width}>
      {props.label && (
        <Label>
          {props.label}
          {props.properties.required && <Legend>*</Legend>}
        </Label>
      )}
      <Image ref={imageRef}>
        <BiImageAdd />
      </Image>
      <Input {...props.properties} ref={inputRef} onChange={null} />
      {props.error && (
        <Legend>
          <AiOutlineInfoCircle />
          {props.error}
        </Legend>
      )}
    </Container>
  );
};

export { ImageInput };
