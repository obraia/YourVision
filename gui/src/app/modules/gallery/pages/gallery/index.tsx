import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BiPaint } from "react-icons/bi";
import { TbDownload, TbInfoCircle, TbTrash } from "react-icons/tb";
import { ImageData, useImageService } from "../../../../../infrastructure/services/image.service";
import { propertiesActions } from "../../../../../infrastructure/redux/reducers/properties";
import { contextMenuActions } from "../../../../../infrastructure/redux/reducers/contextmenu";
import { Image } from "../../components/image";
import { Container, ImagesSection } from "./styles";

export const GalleryPage = () => {
  const { images, getImages, deleteImage } = useImageService();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const contextMenuItems = (data: ImageData) => [
    {
      id: 'SEND_TO_EDITOR',
      name: 'Send to editor',
      icon: BiPaint,
      onClick() {
        dispatch(propertiesActions.setCurrent(data.id));
        dispatch(propertiesActions.setImage(data.image));
        dispatch(propertiesActions.setSamEmbedding(data.embedding));
        dispatch(propertiesActions.setResults([data]));
        dispatch(propertiesActions.setProperties(data.properties));
        dispatch(contextMenuActions.hideMenu());
        navigate('/');
      },
    },
    {
      id: 'DOWNLOAD',
      name: 'Download',
      icon: TbDownload,
      onClick() {
        fetch(`${process.env.REACT_APP_API_URL}/static/images/${data.image}`)
          .then((response) => response.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = data.image;
            a.click();
          });
        dispatch(contextMenuActions.hideMenu());
      },
    },
    {
      id: 'DELETE',
      name: 'Delete',
      icon: TbTrash,
      onClick() { 
        deleteImage(data.id).then(() => {
          getImages();
          dispatch(propertiesActions.deleteResultById(data.id));
          dispatch(contextMenuActions.hideMenu());
        });
      },
    },
  ]

  const handleContextMenu = (e: MouseEvent, image: ImageData) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(contextMenuActions.showMenu({ items: contextMenuItems(image), xPos: e.pageX, yPos: e.pageY }));
  }

  const renderImage = (data: ImageData) => {
    return (
      <Image key={data.id} data={data} onContextMenu={e => handleContextMenu(e, data)} />
    );
  }

  return (
    <Container>
      <ImagesSection>
        {images.map(renderImage)}
      </ImagesSection>
    </Container>
  );
}