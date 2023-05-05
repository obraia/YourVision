/**
 * Covert hex color to rgba
 * @param hex
 * @returns
 */
export function hexToRgba(hex: string) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b, 255];
}

/**
 * Convert the onnx model mask prediction to ImageData
 * @param input 
 * @param width 
 * @param height 
 * @returns 
 */
export function arrayToImageData(input: any, width: number, height: number, hex: string) {
  const [r, g, b, a] = hexToRgba(hex); // the masks's blue color
  const arr = new Uint8ClampedArray(4 * width * height).fill(0);
  
  for (let i = 0; i < input.length; i++) {
    // Threshold the onnx model mask prediction at 0.0
    // This is equivalent to thresholding the mask using predictor.model.mask_threshold
    // in python
    if (input[i] > 0.0) {
      arr[4 * i + 0] = r;
      arr[4 * i + 1] = g;
      arr[4 * i + 2] = b;
      arr[4 * i + 3] = a;
    }
  }
  return new ImageData(arr, height, width);
}

/**
 * Use a Canvas element to produce an image from ImageData
 * @param imageData 
 * @returns 
 */
function imageDataToImage(imageData: ImageData) {
  const canvas = imageDataToCanvas(imageData);
  const image = new Image();
  image.src = canvas.toDataURL();
  return image;
}

/**
 * Canvas elements can be created from ImageData
 * @param imageData 
 * @returns 
 */
function imageDataToCanvas(imageData: ImageData) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  if(ctx) {
    ctx.putImageData(imageData, 0, 0);
  }

  return canvas;
}

/**
 * Convert the onnx model mask output to an HTMLImageElement
 * @param input 
 * @param width 
 * @param height 
 * @returns 
 */
export function onnxMaskToImage(input: any, width: number, height: number, hex: string) {
  return imageDataToImage(arrayToImageData(input, width, height, hex));
}
