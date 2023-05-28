import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BiExtension } from 'react-icons/bi';
import { RiArrowDropLeftLine, RiArrowDropRightLine } from 'react-icons/ri';
import { MdContentPaste } from 'react-icons/md';
import { propertiesActions } from '../../../../../../infrastructure/redux/reducers/properties';
import { tryParserJSON } from '../../../../shared/utils/formatters/json.formatter';
import { Properties } from '../../../pages/editor/controller';
import { usePluginService } from '../../../../../../infrastructure/services/plugin.service';
import { RootState } from '../../../../../../infrastructure/redux/store';
import { Field } from '../../../../shared/components/form';
import { Tool, ToolButton } from './extra-button';
import { Property } from './extra-button/properties';
import { Container, ToogleButton } from './styles'

const Extras = () => {
  const { pluginProperties } = useSelector((state: RootState) => state.properties);

  const [isExpanded, setIsExpanded] = useState(false);

  const dispatch = useDispatch();

  const { plugins, getPlugins } = usePluginService();

  const toggle = () => {
    setIsExpanded(!isExpanded);
  }

  const tools: Tool[] = [
    {
      name: 'Paste properties',
      icon: MdContentPaste,
      onClick() { 
        navigator.clipboard.readText().then(text => {
          const properties = tryParserJSON<Properties>(text);

          if(properties) {
            dispatch(propertiesActions.setProperties(properties));
          }
        });
      },
    },
    {
      name: 'Plugins',
      icon: BiExtension,
      onClick() { },
      properties: [
        {
          label: 'Reload plugins',
          type: 'button',
          buttonOptions: {
            color: 'textPrimary',
            backgroundColor: 'primary',
            onClick: () => getPlugins({ reload: true }),
          }
        },
        ...plugins.map(plugin => {
          return {
            label: plugin.name,
            type: 'toggle',
            toggleOptions: {
              defaultValue: pluginProperties.some(property => property.name === plugin.name),
              onChange(value) {
                if(value) {
                  const properties = {} as any;

                  plugin.fields.forEach(field => {
                    if(field.name) { 
                      properties[field.name] = field.defaultValue;
                    }
                  });

                  const fields: Field<any>[] = [
                    { 
                      type: 'separator',
                      label: plugin.name,
                      width: '100%'
                    },
                    ...plugin.fields
                  ];

                  dispatch(propertiesActions.addPlugin({ name: plugin.name, type: plugin.type, properties, fields }));
                } else {
                  dispatch(propertiesActions.removePlugin(plugin.name));
                }
              }
            }
          }
        }) as Property[],
      ],
    }
  ];

  const renderTool = (tool: Tool, index: number) => {
    return (
      <ToolButton key={index} tool={tool} />
    )
  }

  return (
    <Container $isExpanded={isExpanded}>
      <ToogleButton onClick={toggle}>
        {isExpanded ? <RiArrowDropRightLine /> : <RiArrowDropLeftLine />}
      </ToogleButton>
      {tools.map(renderTool)}
    </Container>
  )
}

export { Extras }
