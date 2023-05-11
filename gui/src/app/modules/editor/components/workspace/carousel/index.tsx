import { Container, ImageContainer } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../infrastructure/redux/store';
import { ImageResult, propertiesActions } from '../../../../../../infrastructure/redux/reducers/properties';
import { useEffect, useRef } from 'react';

export const Carousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { results, current } = useSelector((state: RootState) => state.properties);
  const dispatch = useDispatch();

  const handleSelect = (result: ImageResult) => {
    dispatch(propertiesActions.setCurrent(result.id));
    dispatch(propertiesActions.setImage(result.image));
    dispatch(propertiesActions.setSamEmbedding(result.embedding));
  }

  const renderImages = () => {
    return results.map((result) => {
      let image: string | null = '';

      if(result.image === 'empty') {
        image = null;
      } else if (result.image.startsWith('data:image')) {
        image = result.image;
      } else {
        image = `${process.env.REACT_APP_API_URL}/static/images/${result.image}`;
      }

      console.log({ current, result })

      return (
        <ImageContainer 
          key={result.id} 
          selected={result.id === current}
          onClick={() => handleSelect(result)}>
          {image && <img src={image} alt={result.id.toString()} />}
        </ImageContainer>
      )
    })
  }

  useEffect(() => {
    const { current: container } = containerRef;

    if(!container) return;

    const inverseScroll = (event: WheelEvent) => {
      event.preventDefault();
      container.scrollLeft += event.deltaY > 0 ? 50 : -50;
    }

    container.addEventListener('wheel', inverseScroll);

    return () => {
      container.removeEventListener('wheel', inverseScroll);
    }
  }, [])
    

  if(!results.length) return null;

  return (
    <Container ref={containerRef}>
      {renderImages()}
    </Container>
  )
}
