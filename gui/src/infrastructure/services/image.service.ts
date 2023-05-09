import { useEffect, useState } from 'react';
import { useAxios } from '../../app/modules/shared/hooks/useAxios'

export interface ImageData {
  id: number;
  image: string;
  embedding: string;
  properties_id: number;
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

export const useImageService = () => {
  const axios = useAxios('/images');
  const [images, setImages] = useState<ImageData[]>([]);

  const getImages = () => {
    axios.get<ImageData[]>('').then(({ data }) => { setImages(data) });
  }

  const deleteImage = (id: number) => {
    return axios.delete(`/${id}`);
  }

  useEffect(() => {
    getImages();
  }, []);

  return {
    images,
    getImages,
    deleteImage
  }
}
