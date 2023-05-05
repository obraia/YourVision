import { useAxios } from '../../../app/modules/shared/hooks/useAxios'

const useSamService = () => {
  const axios = useAxios('/sam')

  const generateEmbedding = async (formData: FormData) => {
    const { data } = await axios.post<{ embedding: string }>('/generate-embedding', formData);
    return data
  }

  return {
    generateEmbedding
  }
}

export { useSamService }
