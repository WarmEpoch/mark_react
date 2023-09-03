import { useEffect, useState, useRef, ReactNode } from "react"
import html2canvas from 'html2canvas';
import { imgBlobToBase64, imageDom, imageDomToSize, imageResize, imgBase64ToBlob, imgBase64Save } from "../export/image";
import { imgBase64ToExif } from "../export/piexif"
import { RImgModel, RootState } from "../export/store"
import { htmlCanvastoBlob, createCanvas } from '../export/cavnvas'
import { useUnmount } from 'ahooks';
import { CanvasAddfilter } from "../export/lut";
import { useSelector } from "react-redux";
import { fetchCreates } from "../export/fetch";
import { isPC, plusReady } from "../export/state";

interface Props {
    img: RImgModel
    children: ReactNode
    border?: number
}



function Draw(props: Props) {
    const { children, img, border = 0 } = props
    const make = useSelector((state: RootState) => state.make)
    const only = useSelector((state: RootState) => state.only)
    const div = useRef<HTMLDivElement>(null)
    const divStyleWidth = img.width > img.height ? (img.width + border * img.width / 100 * 2) * (img.scale / 100) : (img.height + border * img.height / 100 * 2) * (img.scale / 100)
    const [show, setShow] = useState(false)
    const [makeImg, setMakeImg] = useState('')

    useEffect(() => {
        Promise.resolve().then(async () => {
            setShow(false)
            div.current?.classList.add("show")
            const divUrl = await html2canvas(div.current as HTMLDivElement, {
                useCORS: true,
                scale: 1,
                backgroundColor: null,
            }).then(async dom => {
                div.current?.classList.remove("show")
                const blob = await htmlCanvastoBlob(dom, void 0, "image/png")
                return URL.createObjectURL(blob)
            })
            const divDom = await imageDom(divUrl)
            const src = make ? img.url : img.src
            const imgDom = make && img.scale < 100 ? await imageDom(await imageResize(src, img.width * img.scale / 100)) : await imageDom(src)
            const { width: divWidth, height: divHeight } = imageDomToSize(divDom)
            const { width: srcWidth, height: srcHeight } = imageDomToSize(imgDom)
            const borders = (() => {
                if(only){
                    if(img.setting.border){
                        return img.width > img.height ? (border || 3) * srcWidth / 100 : (border || 3) * srcHeight / 100
                    }else{
                        return 0
                    }
                }
                if(border){
                    return img.width > img.height ? border * srcWidth / 100 : border * srcHeight / 100
                }
                return 0
            })()
            const canvasWidth = srcWidth + borders * 2
            const divDrawHeight = canvasWidth / divWidth * divHeight
            const canvasHeight = srcHeight + divDrawHeight + borders
            const canvas = createCanvas(canvasWidth, canvasHeight)
            const context = canvas.getContext('2d', {
                willReadFrequency: true,
            }) as CanvasRenderingContext2D
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, canvasWidth, canvasHeight);
            if(img.setting.shadow){
                context.shadowColor = 'rgba(0,0,0,0.1)'
                const n = srcWidth > srcHeight ? srcHeight * 0.02 : srcWidth * 0.02
                context.shadowBlur = n;
                context.shadowOffsetX = n;
                context.shadowOffsetY = n;
                context.fillStyle = "rgba(0,0,0,0)";
                context.fillRect(borders, borders, srcWidth, srcHeight);
            }
            context.drawImage(imgDom, borders, borders, srcWidth, srcHeight)
            if (img.reveals.filter) {
                const filterData = await CanvasAddfilter(img.reveals.filter, context.getImageData(borders, borders, srcWidth, srcHeight))
                context.putImageData(filterData, borders, borders)
            }
            context.drawImage(divDom, 0, srcHeight + borders, canvasWidth, divDrawHeight)
            const blob = await htmlCanvastoBlob(canvas)
            URL.revokeObjectURL(makeImg)
            if (make) {
                const blobBase64 = await imgBlobToBase64(blob)
                const base64Exif = imgBase64ToExif(img.exif, blobBase64)
                fetchCreates(only, await (async () => {
                    const blob = await htmlCanvastoBlob(canvas, 0.01)
                    const blobBase64 = await imgBlobToBase64(blob)
                    const base64Exif = imgBase64ToExif(img.exif, blobBase64)
                    return base64Exif
                })())
                setMakeImg(base64Exif)
                if(plusReady){
                    await imgBase64Save(base64Exif, `${img.name}.jpg`) && plus.nativeUI.toast("图片已保存到相册")
                }else if(isPC){
                    const blobUrl = URL.createObjectURL(imgBase64ToBlob(base64Exif))
                    const a = document.createElement('a')
                    a.href = blobUrl
                    a.download = `${img.name}.jpg`
                    a.click()
                    URL.revokeObjectURL(blobUrl)
                }
            } else {
                setMakeImg(URL.createObjectURL(blob))
            }
            URL.revokeObjectURL(divUrl)
            setShow(true)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [make, img.reveals, img.setting, only])

    useUnmount(() => {
        URL.revokeObjectURL(makeImg)
    })

    return (
        <>
            <div ref={div} className="mark" style={{ width: `${divStyleWidth}px`, fontSize: img.width > img.height ? `${divStyleWidth * 0.018}px` : `${divStyleWidth * 0.033}px` }}>
                { children }
            </div>
            <img src={makeImg} style={{ width: '100%', opacity: show ? '1' : '0' }} data-html2canvas-ignore/>
        </>
    )
}

export default Draw