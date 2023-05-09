import { useAxios } from '../../app/modules/shared/hooks/useAxios'

const useSamService = () => {
  const axios = useAxios('/sam')

  const generateEmbedding = async (body: { image: string }) => {
    const { data } = await axios.post<{ embedding: string }>('/embedding', body);
    return data
  }

  return {
    generateEmbedding
  }
}

export { useSamService }
