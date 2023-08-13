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