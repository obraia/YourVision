import { useState } from 'react';
import { Container, ImageContainer } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../infrastructure/redux/store';
import { propertiesActions } from '../../../../../../infrastructure/redux/reducers/properties';

export const Carousel = () => {
  const { results } = useSelector((state: RootState) => state.properties);
  const [current, setCurrent] = useState(0);
  const dispatch = useDispatch();

  const handleSelect = (index: number) => {
    setCurrent(index);
    dispatch(propertiesActions.setImage(results[index]));
  }

  const renderImages = () => {
    return results.map((image, index) => {
      return (
        <ImageContainer 
          key={index} 
          selected={index === current}
          onClick={() => handleSelect(index)}>
          <img src={image} alt={index.toString()} />
        </ImageContainer>
      )
    })
  }

  if(!results.length) return null;

  return (
    <Container>
      {renderImages()}
    </Container>
  )
}
