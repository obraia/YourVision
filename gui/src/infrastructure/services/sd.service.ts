import { useAxios } from '../../app/modules/shared/hooks/useAxios';

interface Properties {
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

interface InpaintRequest {
  image: string;
  mask: string;
  properties: Properties;
  plugins: object[];
}

interface TextRequest {
  properties: Properties;
  plugins: object[];
}

interface ImageRequest {
  image: string;
  properties: Properties;
  plugins: object[];
}

interface ImageResponse {
  id: number;
  image: string;
  embedding: string;
  properties_id: number;
}


const useSdService = () => {
  const axios = useAxios('/sd');

  const inpaint = async (body: InpaintRequest) => {
    const { data } = await axios.post<ImageResponse[]>('/inpaint', body)
    return data;
  }

  const txt2img = async (body: TextRequest) => {
    const { data } = await axios.post<ImageResponse[]>('/txt2img', body)
    return data;
  }

  const img2img = async (body: ImageRequest) => {
    const { data } = await axios.post<ImageResponse[]>('/img2img', body)
    return data;
  }

  const pix2pix = async (body: ImageRequest) => {
    const { data } = await axios.post<ImageResponse[]>('/pix2pix', body)
    return data;
  }

  const getModels = async () => {
    const { data } = await axios.get<{ label: string, value: string }[]>('/models');
    return data;
  }

  const getSamplers = async () => {
    const { data } = await axios.get<{ label: string, value: string }[]>('/samplers');
    return data;
  }

  const getImageBase64 = async (image: string) => {
    const { data } = await axios.get('/static/' + image, { responseType: 'arraybuffer' });
    return  Buffer.from(data, 'binary').toString('base64');;
  }

  return {
    inpaint,
    txt2img,
    img2img,
    pix2pix,
    getModels,
    getSamplers,
    getImageBase64
  }
}

export { useSdService }
