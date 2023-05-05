import { MouseEvent, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoReload } from 'react-icons/io5';
import { TbArrowsRandom } from 'react-icons/tb';
import { RootState } from '../../../../../infrastructure/redux/store';
import { Properties } from '../../../stable/pages/inpainting/controller';
import { propertiesActions } from '../../../../../infrastructure/redux/reducers/properties';
import { Field, Form, FormRef } from '../../../shared/components/form';
import { Button } from './button'
import { Container, Gutter, PropertiesWrapper } from './styles'
import { useSdService } from '../../../../../infrastructure/services/sd/sd.service';

interface Props {
  disableSubmit?: boolean;
  onSubmit: (form_data: Properties) => void;
  onCancel?: () => void;
}

const Properties = (props: Props) => {
  const { image, models, samplers, properties, loading } = useSelector((state: RootState) => state.properties);
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

      if(data) {
        props.onSubmit(data);
      }
    }
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
      width: 'calc(100% - 35px)',
      required: true,
      selectOptions: {
        defaultValue: properties.model,
        items: models.map(m => ({ label: m, value: m }))
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
        defaultValue: properties.images,
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
        defaultValue: properties.steps,
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
        defaultValue: properties.cfg,
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
        defaultValue: properties.width,
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
        defaultValue: properties.height,
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
        defaultValue: properties.sampler,
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
      width: `calc(100% - 35px)`,
      required: true,
      numberOptions: {
        defaultValue: properties.seed,
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
        maxLength: 200,
        defaultValue: properties.positive,
      }
    },
    {
      name: 'negative',
      label: 'Negative',
      type: 'textarea',
      width: `100%`,
      textareaOptions: {
        maxLength: 200,
        defaultValue: properties.negative,
      }
    },
  ];

  useEffect(() => {
    loadModels();
    loadSamplers();
  }, []);

  return (
    <Container>
      <Gutter onMouseDown={resizer} />

      <PropertiesWrapper>
        <Form fields={fields} ref={formRef} onChange={values => dispatch(propertiesActions.setProperties(values))}/>
      </PropertiesWrapper>

      <Button onClick={handleSubmit} disabled={loading || !image}>
        GENERATE
      </Button>
    </Container>
  )
}

export { Properties }
