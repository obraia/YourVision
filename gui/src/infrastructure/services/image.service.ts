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

export interface ImageParamsRequest {
  page: number;
  per_page: number;
}

export interface ImageResponse {
  items: ImageData[];
  pages: number;
  total: number;
  has_next: boolean;
  has_prev: boolean;
}

export const useImageService = () => {
  const axios = useAxios('/images');
  
  const [images, setImages] = useState<ImageData[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 1,
    has_next: false,
    has_prev: false
  });

  const getImages = (params: ImageParamsRequest) => {
    axios.get<ImageResponse>('', { params }).then(({ data }) => { 
      setImages(data.items);
      setPagination({
        page: params.page,
        pages: data.pages,
        total: data.total,
        has_next: data.has_next,
        has_prev: data.has_prev
      });
     });
  }

  const prevImages = () => {
    if (pagination.has_prev) {
      getImages({ page: pagination.page - 1, per_page: 20 });
    }
  }

  const nextImages = () => {
    if (pagination.has_next) {
      getImages({ page: pagination.page + 1, per_page: 20 });
    }
  }

  const deleteImage = (id: number) => {
    return axios.delete(`/${id}`);
  }

  useEffect(() => {
    getImages({ page: 1, per_page: 20 });
  }, []);

  return {
    images,
    pagination,
    getImages,
    prevImages,
    nextImages,
    deleteImage
  }
}
