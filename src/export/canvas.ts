import canvasSize from "canvas-size"
import { CanvasMaxType } from "./store"

export const htmlCanvastoBlob = (canvas: HTMLCanvasElement, quality = 1, type = 'image/jpeg'): Promise<Blob> => {
    return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob as Blob), type, quality))
}

export const htmlCanvastoBase = (canvas: HTMLCanvasElement, quality = 1, type = 'image/jpeg'): Promise<string> => {
    return new Promise((resolve) => resolve(canvas.toDataURL(type,quality)))
}

export const offScreenCanvastoBlob = (canvas: OffscreenCanvas, quality = 1, type = 'image/jpeg'): Promise<Blob> => {
    return new Promise((resolve) => canvas.convertToBlob({ type, quality }).then(blob => resolve(blob)))
}

export const createCanvas = (width: number, height: number) => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    return canvas
}


export const CanvasMaxSize = async (): Promise<CanvasMaxType> => {
  const CANVASMAX_KEY = 'CANVASMAX'
  // localStorage.removeItem(CANVASMAX_KEY)
  const localCanvasMax = localStorage.getItem(CANVASMAX_KEY)
  if(localCanvasMax){
    return JSON.parse(localCanvasMax)
  }
  const maxHeight = await canvasSize.maxHeight({
    usePromise: true,
    useWorker: true
  }).then(({height}) => height)
  const maxWidth = await canvasSize.maxWidth({
    usePromise: true,
    useWorker: true
  }).then(({width}) => width)
  const maxArea = await canvasSize.maxArea({
    usePromise: true,
    useWorker: true,
  }).then(({ width, height }) => {
    return { width, height }
  })
  const canvasMax = {
    extent: maxArea.width === maxWidth && maxArea.height === maxHeight,
    maxArea: maxArea.width * maxArea.height,
    maxHeight,
    maxWidth
  }
  localStorage.setItem(CANVASMAX_KEY, JSON.stringify(canvasMax))
  return canvasMax
}

export const canvasMaximage = (width: number, height: number, maxHeight: number, maxWidth: number, maxArea: number, extent: boolean) => {
  const valid = maxHeight >= height && maxWidth >= width && maxArea >= height * width
  
  const scale = valid ? 100 : (() => {
      if(extent){
          return Math.floor(width > height ? maxWidth / width * 100 : maxHeight / height * 100)
      }else{
          return Math.floor(Math.sqrt(maxArea / height / width) * 100)
      }
  })()

  return {
    valid,
    scale,
    scaleM: scale / 100
  }
}