import { useEffect, useState } from 'react';
import { useAxios } from '../../app/modules/shared/hooks/useAxios';
import { Field } from '../../app/modules/shared/components/form';

export interface Plugin {
  name: string
  description: string
  category: string
  icon: string
  type: string
  fields: Field<any>[]
  inputs: string[]
  endpoint: string
}

export interface PluginResponse {
  plugins: Plugin[];
}

export const usePluginService = () => {
  const axios = useAxios('/plugins');
  
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  
  const getPlugins = () => {
    axios.get<PluginResponse>('').then(({ data }) => { 
      setPlugins(data.plugins);
    });
  }

  useEffect(() => {
    getPlugins();
  }, []);

  return {
    plugins,
    getPlugins
  }
}
