export const htmlCanvastoBlob = (canvas: HTMLCanvasElement, quality = 1, type = 'image/jpeg'): Promise<Blob> => {
    return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob as Blob), type, quality))
}

export const offScreenCanvastoBlob = (canvas: OffscreenCanvas, quality = 1, type = 'image/jpeg'): Promise<Blob> => {
    return new Promise((resolve) => canvas.convertToBlob({ type, quality }).then(blob => resolve(blob)))
}