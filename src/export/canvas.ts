import { CreateCanvasImageSource } from "./image";
import { CanvasMaxType } from "./store";
import { BlobToBase64 } from "./util";
import { isWorker } from "./worker/constants";

export const CanvasToBlob = (canvas: HTMLCanvasElement | OffscreenCanvas, quality = 1, type = 'image/jpeg') => {
    return new Promise<Blob>((resolve, reject) => {
      if('convertToBlob' in canvas){
        canvas.convertToBlob({ type, quality }).then(blob => resolve(blob))
      } else if('toBlob' in canvas){
        canvas.toBlob((blob) => resolve(blob as Blob), type, quality)
      } else {
        reject('Canvas type error')
      }
    })
}

export const CanvastoBase = (canvas: HTMLCanvasElement | OffscreenCanvas, quality = 1, type = 'image/jpeg') => {
    return new Promise<string>((resolve, reject) => {
      if('convertToBlob' in canvas){
        canvas.convertToBlob({ type, quality }).then(blob => BlobToBase64(blob)).then(resolve)
      }else if('toDataURL' in canvas){
        resolve(canvas.toDataURL(type,quality))
      }else{
        reject('Canvas type error')
      }
    })
}

export const CreateCanvas = (width: number, height: number) => {
    const canvas = isWorker ? new OffscreenCanvas(width, height) : document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    return canvas
}

export const CalculateSizeScale = (width: number, height: number, canvasMax: CanvasMaxType) => {
  const valid = canvasMax.maxHeight >= height && canvasMax.maxWidth >= width && canvasMax.maxArea >= height * width
  
  const scale = valid ? 100 : (() => {
      if(canvasMax.extent){
          return Math.floor(width > height ? canvasMax.maxWidth / width * 100 : canvasMax.maxHeight / height * 100)
      } else {
          return Math.floor(Math.sqrt(canvasMax.maxArea / height / width) * 100)
      }
  })()

  return {
    valid,
    scale: scale / 100,
  }
}


export const CanvasAddfilter = async (lutSrc: string, canvasData: ImageData) => {
  const lutDom = await CreateCanvasImageSource(lutSrc)
  const { width: lutWidth, height: lutHeight } = lutDom
  const canvas = CreateCanvas(lutWidth, lutHeight)
  const context = canvas.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  context.drawImage(lutDom, 0, 0);
  const lutData = context.getImageData(0, 0, lutWidth, lutHeight)
  for (let i = 0; i < canvasData.data.length; i += 4) {
      const r = Math.floor(canvasData.data[i] / 4);
      const g = Math.floor(canvasData.data[i + 1] / 4);
      const b = Math.floor(canvasData.data[i + 2] / 4);

      const lutX = (b % 8) * (lutWidth / 8) + r;
      const lutY = Math.floor(b / 8) * (lutWidth / 8) + g;
      const lutIndex = (lutY * lutWidth + lutX) * 4;
      
      canvasData.data[i] = lutData.data[lutIndex];
      canvasData.data[i + 1] = lutData.data[lutIndex + 1];
      canvasData.data[i + 2] = lutData.data[lutIndex + 2];
  }
  return canvasData
}