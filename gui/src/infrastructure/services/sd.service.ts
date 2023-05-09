import { useAxios } from '../../app/modules/shared/hooks/useAxios'

interface InpaintRequest {
  image: string;
  mask: string;
  properties: {
    model: string;
    positive: string;
    negative: string;
    images: number;
    steps: number;
    cfg: number;
    width: number;
    height: number;
    sampler: string;
    seed: number;
  }
}

interface InpaintResponse {
  id: number;
  image: string;
  embedding: string;
  properties_id: number;
}

const useSdService = () => {
  const axios = useAxios('/sd');

  const inpaint = async (body: InpaintRequest) => {
    const { data } = await axios.post<InpaintResponse[]>('/inpaint', body)
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
