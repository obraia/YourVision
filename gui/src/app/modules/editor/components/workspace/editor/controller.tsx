import { ForwardedRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react"
import { InferenceSession, Tensor } from 'onnxruntime-web';
import { useDispatch, useSelector } from "react-redux";
import html2canvas from 'html2canvas';
import npyjs from 'npyjs';
import { v4 as uuidv4 } from 'uuid';
import { modelData } from "../../../../../../infrastructure/utils/onnx.util";
import { onnxMaskToImage } from "../../../../../../infrastructure/utils/mask.util";
import { RootState } from "../../../../../../infrastructure/redux/store";
import { propertiesActions } from "../../../../../../infrastructure/redux/reducers/properties";
import { EditorRef } from ".";
import { toolsActions } from "../../../../../../infrastructure/redux/reducers/tools";
import { Shape, layersActions } from "../../../../../../infrastructure/redux/reducers/layers";

interface ModelScale {
  samScale: number;
  height: number;
  width: number;
}

const SAM_MODEL_PATH = '/model/sam_vit_l_0b3195.onnx';

function useController(ref: ForwardedRef<EditorRef>) {
  const { properties, embedding } = useSelector((state: RootState) => state.properties);
  const { currentLayerIndex, layers } = useSelector((state: RootState) => state.layers);
  const { tool, mask, brush, eraser, text } = useSelector((state: RootState) => state.tools);
  const { theme } = useSelector((state: RootState) => state.theme);

  const [model, setModel] = useState<InferenceSession | null>(null);
  const [tensor, setTensor] = useState<Tensor | null>(null);
  const [modelScale, setModelScale] = useState<ModelScale | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  useImperativeHandle(ref, () => {
    return {
      async getMask() {
        const layersMask = layers.filter((layer) => layer.mask && layer.image && layer.visible);

        if(layersMask.length) {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          if(context) {
            canvas.width = properties.width;
            canvas.height = properties.height;

            for (const mask of layersMask) {
              const image = new Image();

              image.src = mask.image as string;

              await new Promise((resolve) => image.onload = resolve);

              context.drawImage(image, 0, 0);
            }
          }

          return imageToBase64(canvas.toDataURL('image/png'));
        }
      },
      getImage() {
        const { current: border } = borderRef;

        if(border) {
          const currentTransform = border.style.transform;
          const currentOutlineWidth = border.style.outlineWidth;

          border.style.transform = `scale(1)`;
          border.style.outlineWidth = `${1}px`;

          return new Promise<string>((resolve) => {
            html2canvas(border, {
              backgroundColor: null,
              scale: 1,
              useCORS: true,
              width: properties.width,
              height: properties.height,
            }).then((canvas) => {
              resolve(canvas.toDataURL('image/png'));
            }).finally(() => {
              border.style.transform = currentTransform;
              border.style.outlineWidth = currentOutlineWidth;
            });
          });
        }
      },
      async saveImage() {
        const image = await this.getImage();

        if(image) {
          const timestamp = new Date().getTime();
          const link = document.createElement('a');
          
          link.setAttribute('download', timestamp + '.png');
          link.setAttribute('href', image);
          link.click();
        }
      },
      async saveMask() {
        const mask = await this.getMask();

        if(mask) {
          const timestamp = new Date().getTime();
          const link = document.createElement('a');
          
          link.setAttribute('download', timestamp + '.png');
          link.setAttribute('href', mask);
          link.click();
        }
      },
      async addImages(images: string[]) {
        for (const image of images) {
          insertImage(image, false, true);
        }
      },
      clear() {
        const { current: canvas } = canvasRef;

        if (canvas) {
          const context = canvas.getContext('2d');
    
          if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
          }
        }

        updateLayerPreview();
      },
      align(alignment) {
        const { current: shape } = shapeRef;
        const { current: canvas } = canvasRef;

        if(shape && canvas) {
          let { width, height } = canvas.getBoundingClientRect();
          let { width: shapeWidth, height: shapeHeight } = shape.getBoundingClientRect();

          const scaleTransform = canvas.style.transform.match(/scale\((.*?)\)/);
          const scale = scaleTransform ? parseFloat(scaleTransform[1]) : 1;

          width = width / scale;
          height = height / scale;
          shapeWidth = shapeWidth / scale;
          shapeHeight = shapeHeight / scale;

          if(alignment === 'horizontal-start') {
            shape.style.left = '0px';
          }

          if(alignment === 'horizontal-center') {
            shape.style.left = `${(width - shapeWidth) / 2}px`;
          }

          if(alignment === 'horizontal-end') {
            shape.style.left = `${width - shapeWidth}px`;
          }

          if(alignment === 'vertical-start') {
            shape.style.top = '0px';
          }

          if(alignment === 'vertical-center') {
            shape.style.top = `${(height - shapeHeight) / 2}px`;
          }

          if(alignment === 'vertical-end') {
            shape.style.top = `${height - shapeHeight}px`;
          }

          saveShapePosition();
        }
      },
      updateImage() {
        updateImage();
      },
      updatePreview() {
        const { current: layer } = layerRef;

        if (layer) {
          html2canvas(layer, {
            backgroundColor: null,
            scale: 0.05,
            useCORS: true,
          }).then((canvas) => {
            dispatch(layersActions.setCurrentLayerPreview(canvas.toDataURL('image/png')));
          });
        }
      },
      resizeCanvas() {
        resizeCanvas();
      },
    };
  }, [layers]);

  const updateImage = useCallback(() => {
    const { current: canvas } = canvasRef;

    if(canvas && (tool === 'brush' || tool === 'eraser')) {
      dispatch(layersActions.setCurrentLayerImage(canvas.toDataURL('image/png')));
    }
  }, [tool]);

  const checkCanvasEmpty = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');

    if(context) {
      const pixelBuffer = new Uint32Array(
        context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
      );

      return !pixelBuffer.some(color => color !== 0);
    }

    return true;
  }

  const imageToBase64 = (image: string): Promise<string> => {
    return (
      fetch(image)
        .then(res => res.blob())
        .then(blob => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
      )
    );
  }

  const insertImage = (url: string, currentLayer = false, locked = false) => {
    const { current: shapes } = shapesRef;

    if(!shapes) return;
    
    const image = new Image();
    image.src = url;
    
    image.onload = () => {
      const { width, height } = properties;
      const biggerThanCanvas = image.width > width || image.height > height;
      const proportion = image.width / image.height;
      const shapeWidth = biggerThanCanvas ? (proportion > 1 ? width : height * proportion) : image.width;
      const shapeHeight = biggerThanCanvas ? (proportion > 1 ? width / proportion : height) : image.height;

      const shape: Shape = {
        id: uuidv4(),
        type: 'image' as const,
        imageOptions: {
          src: url,
          width: shapeWidth,
          height: shapeHeight,
        },
        x: (width - shapeWidth) / 2,
        y: (height - shapeHeight) / 2,
      };

      if(currentLayer) {
        dispatch(layersActions.pushShape(shape));
      } else {
        dispatch(layersActions.createLayer({
          mask: false, 
          preview: url, 
          shapes: [shape], 
          visible: true,
          locked,
        }));
      }
    } 
  }

  const initializeSamModel = useCallback(async () => {
    try {
      if (SAM_MODEL_PATH === undefined) return
      const model = await InferenceSession.create(SAM_MODEL_PATH)
      setModel(model)
    } catch (error) {
      console.error(error)
    }
  }, [])

  const loadNpyTensor = async (embedding: string) => {
    const npLoader = new npyjs();
    const npArray = await npLoader.load(embedding);
    const tensor = new Tensor("float32", npArray.data, npArray.shape);
    setTensor(tensor);
  };

  const loadSamModelScale = () => {
    const { current: image } = imageRef;

    if (image) {
      const LONG_SIDE_LENGTH = 1024;
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      const samScale = LONG_SIDE_LENGTH / Math.max(width, height);
      setModelScale({ height, width, samScale })
    }
  }

  const resetZoom = () => {
    const { current: zoom } = zoomRef;

    if (zoom) {
      zoom._zoomFactor = 1;
      zoom._onResize();
    }
  }

  const resizeCanvas = () => {
    const { current: border } = borderRef;

    if (border) {
      const { parentElement } = border;

      if (parentElement) {
        const { width, height } = parentElement.getBoundingClientRect();
        const scaleW = Math.min((((width / zoomScale) - 40) / (properties.width)), 1);
        const scaleH = Math.min((((height / zoomScale) - 40) / (properties.height)), 1);
        const scale = Math.min(scaleW, scaleH);
        
        border.style.transform = `scale(${scale})`;
        border.style.outlineWidth = `${2 / scale}px`;

        resetZoom();
      }
    }
  }

  const onSelect = useCallback(async (offsetX: number, offsetY: number) => {
    if(tool !== 'select') return;

    const { current: canvas } = canvasRef;
    const { current: image } = imageRef;

    if (canvas && image && model && tensor && modelScale) {
      const imageScale = Math.max(image.width, image.height) / Math.max(image.naturalWidth, image.naturalHeight);
      const width = image.naturalWidth * imageScale;
      const height = image.naturalHeight * imageScale;

      /**
       * The image may have a height or width smaller than the canvas
       * so it is necessary to calculate the difference between the image and the canvas
       */
      const diffWidth = (canvas.width - width);
      const diffHeight = (canvas.height - height);

      /**
       * The click position is relative to the canvas, so it is necessary
       * subtract the difference between the image and the canvas
       */
      const canvasX = (offsetX - diffWidth / 2) / imageScale;
      const canvasY = (offsetY - diffHeight / 2) / imageScale;

      const feeds = modelData({
        clicks: [{ x: canvasX, y: canvasY, clickType: 1 }],
        tensor,
        modelScale,
      });
      
      if (feeds === undefined) return;

      // Run the SAM ONNX model with the feeds returned from modelData()
      const results = await model.run(feeds);
      const output = results[model.outputNames[0]];

      /**
       * The predicted mask returned from the ONNX model is an array which is
       * rendered as an HTML image using onnxMaskToImage() from maskUtils.tsx.
       */
      const maskImage = onnxMaskToImage(output.data, output.dims[2], output.dims[3], mask.color);

      /**
       * The mask is drawn on the canvas using the image dimensions and the
       * difference between the image and the canvas
       */
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        ctx.globalCompositeOperation = 'source-over';

        maskImage.onload = () => {
          const dx = (diffWidth / 2);
          const dy = (diffHeight / 2);
          ctx.drawImage(maskImage, dx, dy, width, height);
        }
      }
    }

  }, [model, tensor, modelScale, tool, mask.color])

  const onText = useCallback((clientX: number, clientY: number, offsetX: number, offsetY: number) => {
    const { current: shapes } = shapesRef;

    if(!shapes || !text.color || !text.fontFamily || !text.fontWeight || !text.size) return;

    let textElement: HTMLDivElement | null = null;

    for (const element of shapes.children) {
      const rect = element.getBoundingClientRect();

      if ((clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) && element.tagName === 'H1') {
        textElement = (element as HTMLDivElement);
      }
    }

    const value = prompt('Enter text', textElement?.innerText);

    /**
     * If the text element exists and the value is empty, remove the text element
     */
    if(value === "" && textElement) {
      dispatch(layersActions.removeShape(textElement.id));
      shapeRef.current = null;
      return;
    }

    /**
     * If the text element already exists, update the text and select the text element
     */
    if(value && textElement) {
      dispatch(layersActions.updateShape({ id: textElement.id, textOptions: { text: value } }));
      shapeRef.current = textElement;
      shapeRef.current.classList.add('selected');
      return;
    }

    /**
     * If the text element does not exist, create a new text element
     */
    if(value) {
      const shape: Shape = {
        id: uuidv4(),
        type: 'text' as const,
        textOptions: {
          text: value,
          color: text.color,
          fontFamily: text.fontFamily,
          fontWeight: text.fontWeight,
          fontSize: text.size,
          textAlign: 'center' as const,
          verticalAlign: 'middle' as const,
          lineHeight: text.size, 
        },
        x: offsetX,
        y: offsetY - (text.size / 2),
      }

      dispatch(layersActions.pushShape(shape));

      if(shapeRef.current) {
        shapeRef.current.classList.remove('selected');
      }
    }

  }, [tool, text, theme])

  const selectShape = useCallback((x: number, y: number) => {
    const { current: shapes } = shapesRef;

    if(shapeRef.current) {
      shapeRef.current.classList.remove('selected');
    }

    if (shapes) {
      let shape: HTMLDivElement | null = null;

      for (const element of shapes.children as any) {
        const elementRect = element.getBoundingClientRect();

        if (x >= elementRect.left && x <= elementRect.right && y >= elementRect.top && y <= elementRect.bottom) {
          shape = element;
        }
      }

      if(!shape) {
        shapeRef.current = null;
        return;
      }

      if(shape.tagName === 'H1') {
        const rgb2hex = (rgb: string) => rgb ? `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)?.slice(1).map((n: string) => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}` : '';

        const fontFamily = shape.style.fontFamily.replace(/"/g, '');
        const fontWeight = shape.style.fontWeight;
        const fontSize = parseInt(shape.style.fontSize.replace('px', ''));
        const textColor = rgb2hex(shape.style.color);

        dispatch(toolsActions.setTextFontFamily(fontFamily));
        dispatch(toolsActions.setTextFontWeight(fontWeight));
        dispatch(toolsActions.setTextSize(fontSize));
        dispatch(toolsActions.setTextColor(textColor));
      } else if(shape.tagName === 'IMG') {
      
      }

      shapeRef.current = shape;
      shapeRef.current.classList.add('selected');
    }
  }, [tool])

  const deleteShape = () => {
    const { current: shapes } = shapesRef;

    if (shapes && shapeRef.current) {
      dispatch(layersActions.removeShape(shapeRef.current.id));
      shapeRef.current = null;
    }
  }

  const updateLayerPreview = () => {
    const { current: layer } = layerRef;

    if (layer) {
      html2canvas(layer, {
        backgroundColor: null,
        scale: 0.05,
        useCORS: true,

      }).then((canvas) => {
        dispatch(layersActions.setCurrentLayerPreview(canvas.toDataURL('image/png')));
      });
    }
  }

  const saveShapePosition = useCallback(() => {
    const { current: shape } = shapeRef;

    if (shape && tool === 'move') {
      dispatch(layersActions.updateShape({
        id: shape.id,
        x: parseFloat(shape.style.left.replace('px', '')),
        y: parseFloat(shape.style.top.replace('px', ''))
      }));
    }
  }, [tool])

  const onClick = useCallback(async (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { clientX, clientY } = event;
    const { offsetX, offsetY } = event.nativeEvent;

    switch (tool) {
      case 'select':
        onSelect(offsetX, offsetY);
        break;
      case 'text':
        onText(clientX, clientY, offsetX, offsetY);
        break;
    }
  }, [tool, onSelect, onText])

  const onMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if(isTouch) return;

    const { clientX, clientY } = event;
    const { offsetX, offsetY } = event.nativeEvent;

    switch (tool) {
      case 'brush':
      case 'eraser':
        onStartDrawing(offsetX, offsetY);
        break;
      case 'move':
        selectShape(clientX, clientY);
        break;
      default:
        break;
    }
  }, [tool])

  const onStartDrawing = useCallback((offsetX: number, offsetY: number) => {
    const { current: canvas } = canvasRef;

    if (canvas) {
      const context = canvas.getContext('2d');

      if (context) {
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        context.lineTo(offsetX, offsetY);
        context.stroke();
        setIsDrawing(true);
      }
   }
  }, [tool])

  const onMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (isTouch) return;

    const { current: cursor } = cursorRef;

    if (cursor) {
      const sizes = {
        'brush': brush.size,
        'eraser': eraser.size,
        'text': text.size,
        'select': 18,
        'move': 18,
      };

      const cursorSize = sizes[tool];

      cursor.style.visibility = 'visible';
      cursor.style.width = `${cursorSize * zoomScale}px`;
      cursor.style.height = `${cursorSize * zoomScale}px`;
      cursor.style.left = `${event.nativeEvent.clientX - ((cursorSize * zoomScale) / 2) + 1}px`;
      cursor.style.top = `${event.nativeEvent.clientY - ((cursorSize * zoomScale) / 2) + 1}px`;
    }

    switch (tool) {
      case 'brush':
      case 'eraser':
        if(isDrawing) onDrawing(event);
        break;
      case 'move':
        onMoveShape(event);
        break;
    }
  }, [tool, isDrawing, brush.size, eraser.size, text.size, zoomScale])

  const onMoveShape = useCallback((event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (tool !== 'move' || event.buttons !== 1) return;

    const { current: shape } = shapeRef;

    if (shape) {
      shape.style.left = `${event.nativeEvent.offsetX - (shape.offsetWidth / 2)}px`;
      shape.style.top = `${event.nativeEvent.offsetY - (shape.offsetHeight / 2)}px`;
    }
  }, [tool])

  const onDrawing = useCallback((event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (isDrawing && event.buttons === 1) {
      const { current: canvas } = canvasRef;

      if (canvas) {
        const context = canvas.getContext('2d');

        if (context) {
          context.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
          context.stroke();
        }
      }
    } else {
      setIsDrawing(false);
    }
  }, [isDrawing])

  const onTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.nativeEvent.stopPropagation();

    const { clientX, clientY } = e.nativeEvent.touches[0];

    switch (tool) {
      case 'brush':
      case 'eraser':
        onStartDrawingTouch(clientX, clientY);
        break;
      case 'move':
        selectShape(clientX, clientY);
        break;
      default:
        break;
    }
  }, [tool])

  const onStartDrawingTouch = useCallback((clientX: number, clientY: number) => {
    const { current: canvas } = canvasRef

    if (canvas) {
      const context = canvas.getContext('2d')
      const rect = canvas.getBoundingClientRect()
      const canvasX = (clientX - rect.left) * (canvas.width / rect.width)
      const canvasY = (clientY - rect.top) * (canvas.height / rect.height)

      if (context) {
        context.beginPath();
        context.moveTo(canvasX, canvasY);
        context.lineTo(canvasX, canvasY);
        setIsDrawing(true);
      }
    }
  }, [tool])

  const onTouchMove = useCallback((event: React.TouchEvent<HTMLCanvasElement>) => {
    switch (tool) {
      case 'brush':
      case 'eraser':
        onDrawingTouch(event);
        break;
      case 'move':
        onMoveShapeTouch(event);
        break;
    }
  }, [tool, isDrawing])
  
  const onMoveShapeTouch = useCallback((event: React.TouchEvent<HTMLCanvasElement>) => {
    const { current: canvas } = canvasRef
    const { current: shape } = shapeRef;

    if (shape && canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = (event.nativeEvent.touches[0].clientX - rect.left) * (canvas.width / rect.width);
      const y = (event.nativeEvent.touches[0].clientY - rect.top) * (canvas.height / rect.height);

      shape.style.left = `${x - (shape.offsetWidth / 2)}px`;
      shape.style.top = `${y - (shape.offsetHeight / 2)}px`;
    }
  }, [isDrawing])

  const onDrawingTouch = useCallback((event: React.TouchEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      const { current: canvas } = canvasRef
      const { current: cursor } = cursorRef

      if (canvas) {
        const context = canvas.getContext('2d')
        const rect = canvas.getBoundingClientRect()

        const x = (event.nativeEvent.touches[0].clientX - rect.left) * (canvas.width / rect.width)
        const y = (event.nativeEvent.touches[0].clientY - rect.top) * (canvas.height / rect.height)

        if (context) {
          context.lineTo(x, y)
          context.stroke()
        }
      }

      if(cursor) {
        const sizes = {
          'brush': brush.size,
          'eraser': eraser.size,
          'text': text.size,
          'select': 18,
          'move': 18,
        };
  
        const cursorSize = sizes[tool];
        const x = event.touches[0].pageX;
        const y = event.touches[0].pageY;

        cursor.style.visibility = 'visible';
        cursor.style.width = `${cursorSize * zoomScale}px`;
        cursor.style.height = `${cursorSize * zoomScale}px`;
        cursor.style.left = `${x - ((cursorSize * zoomScale) / 2)}px`;
        cursor.style.top = `${y - ((cursorSize * zoomScale) / 2)}px`;
      }
    }
  }, [isDrawing, tool])

  const onTouchEnd = useCallback(() => {
    switch (tool) {
      case 'brush':
      case 'eraser':
        onFinishDrawing();
        break;
    }
  }, [tool])

  const onMouseUp = useCallback(() => {
    switch (tool) {
      case 'brush':
      case 'eraser':
        onFinishDrawing();
        break;
    }
  }, [tool])
  
  const onFinishDrawing = useCallback(() => {
    setIsDrawing(false);
  }, [])

  const onMouseLeave = useCallback(() => {
    const { current: cursor } = cursorRef;

    if (cursor) {
      cursor.style.visibility = 'hidden';
    }
  }, [])

  const onZoomChange = (scale: number) => {
    setZoomScale(scale);
  }

  /**
   * Initialize the ONNX model
   */
  useEffect(() => {
      initializeSamModel();
  }, [])

  /**
   * Load model scale
   */
  useEffect(() => {
    const { current: image } = imageRef;

    if (image) { 
      image.onload = () => {
        resizeCanvas();
        loadSamModelScale();
      }
    }
  }, [])

  /**
   * Resize canvas
   */
  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    }
  }, [])

  /**
   * Resize canvas
   */
  useEffect(() => {    
    resizeCanvas();
  }, [properties.width, properties.height])

  /**
   * Load the Segment Anything pre-computed embedding
   */
  useEffect(() => {
    if (embedding && embedding !== 'empty') {
      loadNpyTensor(`${process.env.REACT_APP_API_URL}/static/embeddings/${embedding}`);
    }
  }, [embedding])

  /**
   * Change layer opacity
   */
  useEffect(() => {
    const { current: layer } = layerRef;

    if (layer) {
      layer.style.opacity = `${mask.opacity}`;
    }
  }, [mask.opacity])

  /**
   * Set layer opacity when layer is changed
   */
  useEffect(() => {
    const { current: layer } = layerRef;

    if (layer) {
      const opacity = parseFloat(layer.style.opacity) || 1;
      dispatch(toolsActions.setMaskOpacity(opacity));
    }
  }, [currentLayerIndex])

  /**
   * Change cursor size and show it in the center of the canvas
   */
  useEffect(() => {
    if(!['brush', 'eraser'].includes(tool)) {
      return;
    }

    const { current: cursor } = cursorRef;
    const { current: container } = containerRef;

    const sizes = {
      'brush': brush.size,
      'eraser': eraser.size,
      'text': text.size,
      'select': 18,
      'move': 18,
    };

    const cursorSize = sizes[tool];

    if (cursor && container) {
      const { left, top, width , height } = container.getBoundingClientRect()
      cursor.style.left = `${left + (width / 2) - ((cursorSize * zoomScale) / 2)}px`;
      cursor.style.top = `${top + (height / 2) - ((cursorSize * zoomScale) / 2)}px`;
      cursor.style.width = `${cursorSize * zoomScale}px`;
      cursor.style.height = `${cursorSize * zoomScale}px`;
      cursor.style.visibility = 'visible';
    }
  }, [brush.size, eraser.size, text.size, tool, currentLayerIndex])

  /**
   * Change shape properties
   */
  useEffect(() => {
    const { current: shape } = shapeRef;

    if(shape) {
      dispatch(layersActions.updateShape({
        id: shape.id,
        textOptions: {
          color: text.color,
          fontSize: text.size,
          fontWeight: text.fontWeight,
          fontFamily: text.fontFamily,
          lineHeight: text.size,
        }
      }));
    }

  }, [text, tool])

  /**
   * Shortcuts
   **/
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
        }
      } else {
        switch (event.key) {
          case 'Delete':
            deleteShape();
            break;
        } 
      }
    }
    
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    }
  }, [])

  /**
   * Update preview and shape position when mouse is up
   */
  useEffect(() => {
    const { current: container } = containerRef;
    
    if (container) {

      const onMouseUp = (e: MouseEvent) => {
        saveShapePosition();
        updateImage();
      }

      container.addEventListener('mouseup', onMouseUp);

      return () => {
        container.removeEventListener('mouseup', onMouseUp);
      }
    }
  }, [tool])

  /**
   * File upload
   */
  useEffect(() => {
    const { current: container } = containerRef;
    const { current: shapes } = shapesRef;
    
    if (container && shapes) {
      const onDragOver = (e: DragEvent) => {
        e.preventDefault();
      }
  
      const onDragEnter = (e: DragEvent) => {
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'copy';
          container.classList.add('dragover');
        }
      }

      const onDragLeave = () => {
        container.classList.remove('dragover');
      }

      const onDrop = (e: DragEvent) => {
        e.preventDefault();
        
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          container.classList.remove('dragover');

          const file = e.dataTransfer.files[0];

          console.log(file.type)

          if (file.type.includes('image')) {
            const reader = new FileReader()

            reader.onload = (e) => {
              if (e.target) {
                insertImage(e.target.result as string, true);
              }
            }

            reader.readAsDataURL(file);
          }
        }
      }

      container.addEventListener('dragover', onDragOver);
      container.addEventListener('dragenter', onDragEnter);
      container.addEventListener('dragleave', onDragLeave);
      container.addEventListener('drop', onDrop);

      return () => {
        container.removeEventListener('dragover', onDragOver);
        container.removeEventListener('dragenter', onDragEnter);
        container.removeEventListener('dragleave', onDragLeave);
        container.removeEventListener('drop', onDrop);
      }
    }
  }, [currentLayerIndex])

  return {
    refs: {
      containerRef,
      zoomRef,
      canvasRef,
      layerRef,
      borderRef,
      imageRef,
      shapesRef,
      cursorRef,
      inputRef,
    },
    canvasHandles: {
      onClick,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onMouseLeave,
    },
    zoomHandles: {
      onZoomChange
    },
  }
}

export { useController };