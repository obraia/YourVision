import { MouseEvent, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoReload } from 'react-icons/io5';
import { AiOutlineLock } from 'react-icons/ai';
import { TbArrowsRandom } from 'react-icons/tb';
import { RootState } from '../../../../../infrastructure/redux/store';
import { PluginProperties, propertiesActions } from '../../../../../infrastructure/redux/reducers/properties';
import { useSdService } from '../../../../../infrastructure/services/sd.service';
import { Properties } from '../../pages/editor/controller';
import { Field, Form, FormRef } from '../../../shared/components/form';
import { Extras } from './extras';
import { Button, ButtonText, ButtonWrapper, Container, Gutter, PropertiesWrapper } from './styles';

interface Props {
  disableSubmit?: boolean;
  onSubmit: (data: Properties, pluginsData: object[]) => void;
  onCancel?: () => void;
}

const Properties = (props: Props) => {
  const { image, models, samplers, properties, pluginProperties, loading, progress } = useSelector((state: RootState) => state.properties);
  const formRef = useRef<FormRef<Properties>>(null);
  const dispatch = useDispatch();
  const sdService = useSdService();

  const resizer = (e: MouseEvent) => {
    const element = e.target as HTMLDivElement;
    const width = element.parentElement?.clientWidth || 0;
    const x = e.clientX;

    const mouseMove = (e: globalThis.MouseEvent) => {
      const newWidth = width + (x - e.clientX);
      element.parentElement!.style.width = `${newWidth}px`;
    };

    const mouseUp = () => {
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    };

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
  }

  const handleSubmit = (e: MouseEvent) => {
    if (formRef.current) {
      const data = formRef.current.submit();
      const pluginsData = pluginProperties.map((p: PluginProperties) => ({ name: p.name, type: p.type, properties: formartFormData(p.properties) }));

      if(data) {
        props.onSubmit(data, pluginsData);
      }
    }
  }

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

  const loadModels = async () => {
    const models = await sdService.getModels();
    dispatch(propertiesActions.setModels(models));
  }

  const loadSamplers = async () => {
    const samplers = await sdService.getSamplers();
    dispatch(propertiesActions.setSamplers(samplers));
  }

  const fields: Field<Properties>[] = [
    {
      name: 'model',
      label: 'Model',
      type: 'select',
      width: 'calc(100% - 45px)',
      required: true,
      selectOptions: {
        items: models
      }
    },
    {
      type: 'action',
      width: `35px`,
      actionOptions: {
        icon: IoReload,
        onClick() { loadModels() }
      }
    },
    {
      label: 'Generation',
      type: 'separator',
      width: '100%'
    },
    {
      name: 'images',
      label: 'Images',
      type: 'number',
      width: `${100/3}%`,
      required: true,
      numberOptions: {
        min: 1,
        max: 1000,
        step: 1,
      }
    },
    {
      name: 'steps',
      label: 'Steps',
      type: 'number',
      width: `${100/3}%`,
      required: true,
      numberOptions: {
        min: 1,
        max: 300,
        step: 1,
      }
    },
    {
      name: 'cfg',
      label: 'CFG',
      type: 'number',
      width: `${100/3}%`,
      required: true,
      numberOptions: {
        min: 1,
        max: 100,
        step: 0.1,
      }
    },
    {
      label: 'Dimensions',
      type: 'separator',
      width: '100%'
    },
    {
      name: 'width',
      label: 'Width',
      type: 'number',
      width: `50%`,
      required: true,
      numberOptions: {
        step: 8,
      }
    },
    {
      name: 'height',
      label: 'Height',
      type: 'number',
      width: `50%`,
      required: true,
      numberOptions: {
        step: 8,
      }
    },
    {
      label: 'Sampler',
      type: 'separator',
      width: '100%'
    },
    {
      name: 'sampler',
      label: 'Sampler',
      type: 'select',
      width: '100%',
      required: true,
      selectOptions: {
        items: samplers
      }
    },
    {
      label: 'Seed',
      type: 'separator',
      width: '100%'
    },
    {
      name: 'seed',
      label: 'Seed',
      type: 'number',
      width: `calc(100% - 90px)`,
      required: true,
    },
    {
      type: 'action',
      width: `35px`,
      actionOptions: {
        icon: AiOutlineLock,
        onClick() { dispatch(propertiesActions.setSeed(-1)) }
      }
    },
    {
      type: 'action',
      width: `35px`,
      actionOptions: {
        icon: TbArrowsRandom,
        onClick() { dispatch(propertiesActions.generateRandomSeed()) }
      }
    },
    {
      label: 'Prompts',
      type: 'separator',
      width: '100%'
    },
    {
      name: 'positive',
      label: 'Positive',
      type: 'textarea',
      width: `100%`,
      textareaOptions: {
        maxLength: 300,
        autoCorrect: 'off',
        autoCapitalize: 'off',
      }
    },
    {
      name: 'negative',
      label: 'Negative',
      type: 'textarea',
      width: `100%`,
      textareaOptions: {
        maxLength: 300,
        autoCorrect: 'off',
        autoCapitalize: 'off',
      }
    },
  ];

  useEffect(() => {
    loadModels();
    loadSamplers();
  }, []);

  const renderPluginForm = (plugin: PluginProperties) => {
    const handleChange = (values: any, field?: Field<any>) => {
      dispatch(propertiesActions.setPluginProperties({ properties: values, name: plugin.name }));

      if (field) {
        dispatch(propertiesActions.setPluginField({ field, name: plugin.name }));
      }
    }

    return (
      <Form key={plugin.name} fields={plugin.fields} values={plugin.properties} onChange={handleChange} />
    )
  }

  return (
    <Container>
      <Gutter onMouseDown={resizer} />

      <Extras />

      <PropertiesWrapper>
        <Form fields={fields} values={properties} onChange={values => dispatch(propertiesActions.setProperties(values))} ref={formRef} />
        {pluginProperties.map(renderPluginForm)}
      </PropertiesWrapper>

      <ButtonWrapper>
        <Button onClick={handleSubmit} disabled={loading || !image} $progress={progress.current / progress.total * 100}>
          <ButtonText>GENERATE</ButtonText>
        </Button>
      </ButtonWrapper>
    </Container>
  )
}

export { Properties }
