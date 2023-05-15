import { ForwardedRef, useEffect, useImperativeHandle, useRef } from 'react';
import { unMask } from 'remask';
import { NumberInput, Select, Separator, TextArea, TextInput, Action, Range, Toggle } from './components';
import { Field, FormRef, Props } from '.';

function useFormController<T>(props: Props<T>, ref: ForwardedRef<FormRef<T>>) {
  const formRef = useRef<HTMLFormElement>(null);

  useImperativeHandle(ref, () => {
    return {
      submit() {
        return getValues();
      },
      reset() {
        if(formRef.current) {
          formRef.current.reset();
        }
      }
    };
  }, []);

  const getValues = () => {
    if(!formRef.current) return;

    const formData = new FormData(formRef.current);
    const formProps = Object.fromEntries(formData);
    const data = {} as any;

    for (const key in formProps) {
      const field = props.fields.find(field => field.name === key);

      if(!field) continue;

      data[key] = parser(formProps[key] as string, field.type);

      if(field.textOptions?.masks) {
        data[key] = unMask(data[key]);
      }
    }

    return data as T;
  }

  const patchValues = (values: T) => {
    const { current: form } = formRef;

    if(!form) return;

    for (const key in values) {
      const field = props.fields.find(field => field.name === key);

      if(!field) continue;

      const value = values[key];

      if(field.type === 'toggle') {
        form[key].checked = value;
      } else {
        form[key].value = parser(String(value), field.type);
      }
    }
  }

  const parser = (value: string, type: string) => {
    switch (type) {
      case 'number':
        return parseFloat(value)
      default:
        return value
    }
  }

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, onChange?: (value: string) => void) => {
    if(onChange && event.target) {
      onChange(event.target.value);
    }

    if(props.onChange) {
      const data = getValues();

      if(data) {
        props.onChange(data);
      }
    }
  }

  const handleChangeNumber = (event: React.ChangeEvent<HTMLInputElement>, onChange?: (value: number) => void) => {
    if(onChange && event.target) {
      onChange(Number(event.target.value));
    }

    if(props.onChange) {
      const data = getValues();

      if(data) {
        props.onChange(data);
      }
    }
  }

  const handleChangeToggle = (event: React.ChangeEvent<HTMLInputElement>, onChange?: (value: boolean) => void) => {
    if(onChange && event.target) {
      onChange(event.target.value === 'on');
    }

    if(props.onChange) {
      const data = getValues();

      if(data) {
        props.onChange(data);
      }
    }
  }

  const renderField = (field: Field<T>, index: number) => {
    if(field.type === 'text') {
      return (
        <TextInput
          key={index}
          label={field.label} 
          masks={field.textOptions?.masks} 
          error={field.error}
          width={field.width}
          properties={{
            type: 'text',
            name: field.name,
            disabled: field.disabled,
            required: field.required,
            defaultValue: field.textOptions?.defaultValue,
            onChange: (event) => handleChangeText(event, field.textOptions?.onChange),
          }} />
      );
    }

    if(field.type === 'number') {
      return (
        <NumberInput
          key={index}
          label={field.label} 
          error={field.error} 
          width={field.width}
          properties={{
            type: 'number',
            name: field.name,
            disabled: field.disabled,
            required: field.required,
            min: field.numberOptions?.min,
            max: field.numberOptions?.max,
            step: field.numberOptions?.step,
            defaultValue: field.numberOptions?.defaultValue,
            onChange: (event) => handleChangeNumber(event, field.numberOptions?.onChange),
          }} />
      );
    }

    if(field.type === 'textarea' && field.textareaOptions) {
      return (
        <TextArea
          key={index}
          label={field.label} 
          error={field.error}
          width={field.width}
          properties={{
            name: field.name,
            disabled: field.disabled,
            required: field.required,
            maxLength: field.textareaOptions.maxLength,
            autoCorrect: field.textareaOptions.autoCorrect,
            autoCapitalize: field.textareaOptions.autoCapitalize,
            defaultValue: field.textareaOptions.defaultValue,
            onChange: (event) => handleChangeText(event, field.textareaOptions?.onChange),
          }} />
      );
    }

    if(field.type === 'select' && field.selectOptions) {
      return (
        <Select
          key={index}
          label={field.label} 
          error={field.error}
          items={field.selectOptions.items}
          width={field.width}
          properties={{
            name: field.name,
            defaultValue: field.defaultValue,
            readOnly: true,
            disabled: field.disabled,
            required: field.required,
            onChange: (event) => handleChangeText(event, field.textareaOptions?.onChange),
          }} />
      );
    }

    if(field.type === 'toggle' && field.label) {
      return (
        <Toggle
          key={index}
          label={field.label} 
          error={field.error}
          width={field.width}
          properties={{
            name: field.name,
            // defaultValue: field.defaultValue,
            disabled: field.disabled,
            required: field.required,
            onChange: (event) => handleChangeToggle(event, field.toggleOptions?.onChange),
          }} />
      );
    }

    if(field.type === 'range' && field.rangeOptions) {
      return (
        <Range
          key={index}
          label={field.label} 
          error={field.error}
          width={field.width}
          properties={{
            name: field.name,
            min: field.rangeOptions.min,
            max: field.rangeOptions.max,
            step: field.rangeOptions.step,
            defaultValue: field.rangeOptions.defaultValue,
            disabled: field.disabled,
            required: field.required,
            onChange: (event) => handleChangeNumber(event, field.rangeOptions?.onChange),
          }} />
      );
    }

    if(field.type === 'action' && field.actionOptions) {
      return (
        <Action
          key={index}
          width={field.width}
          icon={field.actionOptions.icon}
          properties={{
            disabled: field.disabled,
            onClick: field.actionOptions.onClick,
          }} />
      );
    }

    if(field.type === 'separator') {
      return (
        <Separator key={index} label={field.label} />
      );
    }
  }

  useEffect(() => {
    if(props.values) {
      patchValues(props.values);
    }
  }, [props.values]);
  
  return {
    formRef,
    renderField
  }
}

export { useFormController }