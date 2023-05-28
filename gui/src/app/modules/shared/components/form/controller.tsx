import { ForwardedRef, useEffect, useImperativeHandle, useRef } from 'react';
import { FileListFactory } from '../../utils/factories/fileList.factory';
import { Group } from './components/group';
import { ImageInput } from './components/image';
import { NumberInput, Select, Separator, TextArea, TextInput, Action, Range, Toggle } from './components';
import { Field, FormRef, Props } from '.';

export interface ChangeEvent<T> {
  name: string;
  value: T;
}

function useFormController<T>(props: Props<T>, ref: ForwardedRef<FormRef<T>>) {
  const formRef = useRef<HTMLFormElement>(null);
  const formDataRef = useRef<{ [key: string]: string | number | boolean | object | Array<any> }>({ ...props.values } || {});

  useImperativeHandle(ref, () => {
    return {
      submit() {
        return formartFormData(formDataRef.current) as T;
      },
      reset() {
        if(formRef.current) {
          formRef.current.reset();
        }
      }
    };
  }, []);

  const formartFormData = (data: object) => {
    return Object.entries(data).reduce((acc: any, [key, value]) => {
      const keys = key.split('.');
      const lastKey = keys.pop() as string;
      let obj = acc;
  
      keys.forEach((key) => {
        const match = key.match(/(.*)\[(\d+)\]/);
  
        if (match) {
          const key = match[1];
          const index = match[2];
  
          obj[key] = obj[key] || [];
          obj[key][index] = obj[key][index] || {};
          obj = obj[key][index];
        } else {
          obj[key] = obj[key] || {};
          obj = obj[key];
        }
      });
  
      obj[lastKey] = value;
  
      return acc;
    }, {});
  }

  const deepFieldSearch = (name: string, fields: Array<Field<T>>): Field<T> | undefined => {
    for (const field of fields) {
      if(field.name === name) {
        return field;
      }

      if(field.type === 'group' && field.groupOptions) {
        const key = name.split('.').pop();

        if(key) {
          return deepFieldSearch(key, field.groupOptions.fields);
        }
      }
    }

    return undefined;
  }

  const patchValues = (values: T) => {
    const { current: form } = formRef;
    const { current: formData } = formDataRef;

    if(!form || !formData) return;

    for (const key in values) {
      const field = deepFieldSearch(key, props.fields);

      if(!field) continue;

      const value = values[key];

      if(!value) continue;

      formData[key] = value as string | number | boolean;

      if(field.type === 'toggle') {
        form[key].value = 'on';
        form[key].checked = Boolean(value);
      } else if(field.type === 'image') {
        const file = dataURLtoFile(String(value), 'image.png');
        form[key].files = FileListFactory(file)
      } else {
        form[key].value = String(value);
      }
    }
  }

  const dataURLtoFile = (base64: string, filename: string) => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
        
    while(n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
  }

  const handleChangeText = (event: ChangeEvent<string>, onChange?: (value: string) => void) => {
    const { current: formData } = formDataRef;

    formData[event.name] = event.value;

    if(onChange) onChange(event.value);
    if(props.onChange) props.onChange({...formData} as T);
  }

  const handleChangeNumber = (event: ChangeEvent<number>, onChange?: (value: number) => void) => {
    const { current: formData } = formDataRef;

    formData[event.name] = event.value;

    if(onChange) onChange(event.value);
    if(props.onChange) props.onChange({...formData} as T);
  }

  const handleChangeToggle = (event: ChangeEvent<boolean>, onChange?: (value: boolean) => void) => {
    const { current: formData } = formDataRef;

    formData[event.name] = event.value;

    if(onChange) onChange(event.value);
    if(props.onChange) props.onChange({...formData} as T);
  }

  const handleAddGroup = (field: Field<T>) => {
    const { current: formData } = formDataRef;

    if(!field.groupOptions) return;

    const name = field.name;
    const index = field.groupOptions.count;

    field.groupOptions.fields.forEach(subField => {
      const key = `${name}[${index}].${subField.name}`;
      formData[key] = subField.defaultValue || '';
    });

    if(props.onChange) {
      props.onChange({ ...formData } as T, { ...field, groupOptions: { ...field.groupOptions, count: index + 1 }});
    }
  }

  const handleRemoveGroup = (field: Field<T>) => {
    const { current: formData } = formDataRef;

    if(!field.groupOptions) return;

    const name = field.name;
    const index = field.groupOptions.count - 1;

    field.groupOptions.fields.forEach(subField => {
      const key = `${name}[${index}].${subField.name}`;
      delete formData[key];
    });

    if(props.onChange) {
      props.onChange({ ...formData } as T, { ...field, groupOptions: { ...field.groupOptions, count: index }});
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

    if(field.type === 'image') {
      return (
        <ImageInput
          key={index}
          label={field.label}
          error={field.error}
          width={field.width}
          properties={{
            name: field.name,
            disabled: field.disabled,
            required: field.required,
            onChange: (event) => handleChangeText(event, field.imageOptions?.onChange),
          }} />
      );
    }

    if(field.type === 'group' && field.groupOptions) {
      const subFields = new Array<Field<any>>();

      for(let i = 0; i < field.groupOptions.count; i++) {
        field.groupOptions.fields.map(subField => {
          subFields.push({
            ...subField, 
            name: `${field.name}[${i}].${subField.name}` as Extract<keyof T, string> 
          });
        });
      }

      return (
        <Group
          key={index}
          label={field.label}
          properties={{
            disabled: field.disabled,
            required: field.required,
            count: field.groupOptions.count,
            onAdd() { handleAddGroup(field) },
            onRemove() { handleRemoveGroup(field) }
          }}>
          {subFields.map((subField, subIndex) => renderField(subField, subIndex))}
        </Group>
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