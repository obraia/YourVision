import { RefAttributes, forwardRef } from "react";
import { IconType } from "react-icons";
import { useFormController } from "./controller";
import { SelectItem } from "./components";
import { Container } from "./styles";

export type InputType = 'text' | 'number' | 'textarea' | 'select' | 'action' | 'separator';

export interface Field<T> {
  name?: Extract<keyof T, string>
  label?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  type: InputType;
  error?: string;
  width: string;

  textOptions?: {
    masks?: Array<string>;
    maxLength?: number;
    minLength?: number;
    defaultValue?: string;
    onChange?: (value: string) => void;
  }

  numberOptions?: {
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: number;
    onChange?: (value: number) => void;
  }

  textareaOptions?: {
    maxLength: number;
    defaultValue?: string;
    onChange?: (value: string) => void;
  }

  selectOptions?: {
    defaultValue?: string;
    items: Array<SelectItem>;
  }

  actionOptions?: {
    icon: IconType;
    onClick: () => void;
  }

  searchOptions?: {

  }
}

export interface FormRef<T> {
  submit: () => T | undefined;
  reset: () => void;
}

export interface Props<T> {
  fields: Field<T>[];
  loading?: boolean;
  onChange?: (values: T) => void;
}

function FormInner<T>(props: Props<T>, ref: React.ForwardedRef<FormRef<T>>) {
  const { formRef, renderField } = useFormController<T>(props, ref);

  return (
    <Container ref={formRef}>
      {props.fields.map(renderField)}
    </Container>
  )
};

export const Form = forwardRef(FormInner) as <T>(props: Props<T> & RefAttributes<FormRef<T>>) => JSX.Element;