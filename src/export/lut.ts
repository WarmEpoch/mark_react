import { createCanvas } from "./cavnvas";
import { imageDom } from "./image";

export const CanvasAddfilter = async (lutSrc: string, canvasData: ImageData) => {
    const lutDom = await imageDom(lutSrc)
    const { width: lutWidth, height: lutHeight } = lutDom
    const canvas = createCanvas(lutWidth, lutHeight)
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
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