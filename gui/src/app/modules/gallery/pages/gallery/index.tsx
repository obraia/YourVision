import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BiPaint } from "react-icons/bi";
import { TbCopy, TbDownload, TbTrash } from "react-icons/tb";
import { ImageData, useImageService } from "../../../../../infrastructure/services/image.service";
import { propertiesActions } from "../../../../../infrastructure/redux/reducers/properties";
import { contextMenuActions } from "../../../../../infrastructure/redux/reducers/contextmenu";
import { Image } from "../../components/image";
import { Viewer } from "../../components/viewer";
import { Pagination } from "../../components/pagination";
import { Container, ImagesSection } from "./styles";

export const GalleryPage = () => {
  const { images, pagination, prevImages, nextImages, getImages, deleteImage } = useImageService();
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);
  const [hasNext, setHasNext] = useState<boolean>(false);

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
      id: 'COPY_PROPERTIES',
      name: 'Copy properties',
      icon: TbCopy,
      onClick() {
        const properties = JSON.stringify(data.properties);
        navigator.clipboard.writeText(properties);
        dispatch(contextMenuActions.hideMenu());
      },
    },
    {
      id: 'DELETE',
      name: 'Delete',
      icon: TbTrash,
      onClick() { 
        deleteImage(data.id).then(() => {
          getImages({ page: pagination.page, per_page: 30 });
          dispatch(propertiesActions.deleteResultById(data.id));
          dispatch(contextMenuActions.hideMenu());
          handleCloseImage();
        });
      },
    },
  ]

  const handleContextMenu = (e: MouseEvent, image: ImageData) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(contextMenuActions.showMenu({ items: contextMenuItems(image), xPos: e.pageX, yPos: e.pageY }));
  }

  const handleImageClick = (data: ImageData) => {
    setSelectedImage(data);
    dispatch(contextMenuActions.setItems(contextMenuItems(data)));
  }

  const handleCloseImage = () => {
    setSelectedImage(null);
    dispatch(contextMenuActions.setItems([]));
  }

  const handlePrevImage = () =>  {
    const index = images.findIndex((image) => image.id === selectedImage?.id);

    if (index === -1) {
      return;
    }

    const previousIndex = index - 1;

    if (previousIndex < 0) {
      return;
    }

    const previousImage = images[previousIndex];
    
    setSelectedImage(previousImage);
    dispatch(contextMenuActions.setItems(contextMenuItems(previousImage)));
  }
  
  const handleNextImage = () => {
    const index = images.findIndex((image) => image.id === selectedImage?.id);

    if (index === -1) {
      return;
    }

    const nextIndex = index + 1;

    if (nextIndex >= images.length) {
      return;
    }

    const nextImage = images[nextIndex];

    setSelectedImage(nextImage);
    dispatch(contextMenuActions.setItems(contextMenuItems(nextImage)));
  }

  useEffect(() => {
    if (selectedImage) {
      const index = images.findIndex((image) => image.id === selectedImage.id);

      if (index === -1) {
        return;
      }

      setHasPrevious(index > 0);
      setHasNext(index < images.length - 1);
    }
  }, [selectedImage, images]);

  const renderImage = (data: ImageData) => {
    return (
      <Image 
        key={data.id} 
        data={data} 
        onContextMenu={e => handleContextMenu(e, data)}
        onClick={() => handleImageClick(data)}
      />
    );
  }

  return (
    <Container>
      <ImagesSection>
        {images.map(renderImage)}
      </ImagesSection>

      <Pagination 
        pages={pagination.pages}
        total={pagination.total}
        hasNext={pagination.has_next}
        hasPrev={pagination.has_prev}
        onPrevious={prevImages}
        onNext={nextImages}
      />

      <Viewer 
        data={selectedImage} 
        onClose={handleCloseImage}
        constrolsProps={{
          hasPrevious,
          hasNext,
          onPrevious: handlePrevImage,
          onNext: handleNextImage,
        }}
      />
    </Container>
  );
}