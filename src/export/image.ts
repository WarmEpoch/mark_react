export const imageDom = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.src = url
    })
}

export const imageDomToSize = (img: HTMLImageElement): {width: number,height: number} => {
    return {
        width: img.width,
        height: img.height,
    }
}

export const imageDomSize = async (url: string): Promise<{width: number,height: number}> => {
    return imageDomToSize(await imageDom(url))
}

import { offScreenCanvastoBlob } from './cavnvas'

export const imageResize = async (blobUrl: string, width: number, quality = 1, type = 'image/jpeg') => {
    const img = await imageDom(blobUrl)
    const { width: imgWidth, height: imgHeight } = imageDomToSize(img)
    const canvas = new OffscreenCanvas(width, (width / imgWidth * imgHeight))
    const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D
    context.drawImage(img, 0, 0, canvas.width, canvas.height)
    const blob = await offScreenCanvastoBlob(canvas, quality, type)
    return URL.createObjectURL(blob)
}

export const imgBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            resolve(e.target?.result as string)
        }
        fileReader.readAsDataURL(blob)
    })
}
