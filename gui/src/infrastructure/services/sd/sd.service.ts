import { useAxios } from '../../../app/modules/shared/hooks/useAxios'

const useSdService = () => {
  const axios = useAxios('/sd');

  const inpaint = async (formData: FormData) => {
    const { data } = await axios.post<{
      image: string,
      mask: string,
      outputs: string[],
    }>('/inpaint', formData)
    
    return data;
  }

  const getModels = async () => {
    const { data } = await axios.get<string[]>('/models');
    return data;
  }

  const getSamplers = async () => {
    const { data } = await axios.get<{ label: string, value: string }[]>('/samplers');
    return data;
  }

  return {
    inpaint,
    getModels,
    getSamplers,
  }
}

export { useSdService }
