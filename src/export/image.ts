export const ImageDom = (url: string, crossorigin = false): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve(img)
        if(crossorigin) img.crossOrigin = 'anonymous'
        img.src = url
    })
}

export const ImageSize = async (url: string): Promise<{ width: number, height: number }> => {
    // const dom = await imageDom(url)
    const img = await ('ImageBitmap' in self ? ImageToBitmap(url) : ImageDom(url))
    return {
        width: img.width,
        height: img.height
    }
}

export const ImageToBitmap = async (url: string) => {
    const blob = await fetch(url).then(res => res.blob())
    return createImageBitmap(blob)
}

export const CreateCanvasImageSource = async (url: string) => {
    const img = await ('ImageBitmap' in self ? ImageToBitmap(url) : ImageDom(url))
    return img
}

import { CreateCanvas, CanvasToBlob } from './canvas'

export const ImageResize = async (blobUrl: string, width: number, quality = 1, type = 'image/jpeg') => {
    const img = await CreateCanvasImageSource(blobUrl)
    const { width: imgWidth, height: imgHeight } = await ImageSize(blobUrl)
    const canvas = CreateCanvas(width, width / imgWidth * imgHeight)
    const context = canvas.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
    context.drawImage(img, 0, 0, canvas.width, canvas.height)
    return CanvasToBlob(canvas, quality, type)
}

import { ImageHead, parseMetaData, replaceHead, WriteExifData, writeExifData } from 'blueimp-load-image'

export const ImageWriteExif = (blob: Blob, exifr: ImageHead['imageHead']) => {
    return exifr && replaceHead(blob, exifr);
};
  
type Exif = {
    getAll: () => {
        Make: string
        Model: string
        Exif: {
            [key: string]: string
        }
        GPSInfo: {
            [key: string]: string
        }
    }
}


export const ImageLoadExif = async (file: Blob | File) => {
    const data = await parseMetaData(file)
    console.log('exifload', data)
    if(!data.exif) return
    const head = data.imageHead ? writeExifData(
      data.imageHead,
      data as unknown as WriteExifData,
      'Orientation',
      1
    ) : data.imageHead
    return {
      imageHead: head,
      exif: (data.exif as unknown as Exif).getAll()
    };
  };