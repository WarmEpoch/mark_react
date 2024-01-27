import { useEffect, useState, useRef, ReactNode } from "react"
import html2canvas from 'html2canvas';
import { imgBlobToBase64, imageDom, imageResize, imgBase64ToBlob, imgBase64Save } from "../export/image";
import { imgBase64ToExif } from "../export/piexif"
import { RImgModel, RootState, upMaxScale, useAppDispatch } from "../export/store"
import { htmlCanvastoBlob, createCanvas, canvasMaximage } from '../export/canvas'
import { useUnmount } from 'ahooks';
import { CanvasAddfilter } from "../export/lut";
import { useSelector } from "react-redux";
import { fetchCreates } from "../export/fetch";
import { isPC, usePlusReady } from "../export/state";


interface Props {
    img: RImgModel
    children: ReactNode
    border?: number
}


function Draw(props: Props) {
    const { children, img, border = 0 } = props
    const make = useSelector((state: RootState) => state.make)
    const only = useSelector((state: RootState) => state.only)
    const canvasMax = useSelector((state: RootState) => state.canvasMax)
    const div = useRef<HTMLDivElement>(null)
    const widthOrHeight = img.width > img.height ? img.width : img.height
    let divStyleWidth = widthOrHeight + border / 100 * 2 * widthOrHeight
    const { valid, scaleM } = canvasMaximage(divStyleWidth, divStyleWidth, canvasMax.maxHeight, canvasMax.maxWidth, canvasMax.maxArea, canvasMax.extent)
    !valid && (divStyleWidth = divStyleWidth * scaleM)
    const [show, setShow] = useState(false)
    const [makeImg, setMakeImg] = useState('')
    const plusReady = usePlusReady()
    const dispath = useAppDispatch()

    useEffect(() => {
        Promise.resolve().then(async () => {
            setShow(false)
            div.current?.classList.add("show")
            const divUrl = await html2canvas(div.current as HTMLDivElement, {
                useCORS: true,
                scale: 1,
            }).then(async dom => {
                div.current?.classList.remove("show")
                const blob = await htmlCanvastoBlob(dom, void 0, "image/png")
                return URL.createObjectURL(blob)
            })
            const divDom = await imageDom(divUrl)
            const src = make ? img.url : img.src
            const imgDom = make && img.scale < 100 ? await imageDom(await imageResize(src, img.width * (img.scale / 100) - (img.width * img.setting.border / 100))) : await imageDom(src)
            const { width: divWidth, height: divHeight } = divDom
            const { width: srcWidth, height: srcHeight } = imgDom
            const borders = (() => {
                const widthOrHeight = img.width > img.height ? srcWidth : srcHeight
                if(only){
                    if(img.setting.border){
                        return widthOrHeight * img.setting.border / 100
                    }else{
                        return 0
                    }
                }
                if(border){
                    return widthOrHeight * border / 100
                }
                return 0
            })()
            const canvasWidth = srcWidth + borders * 2
            const divDrawHeight = canvasWidth / divWidth * divHeight
            const canvasHeight = srcHeight + divDrawHeight + borders
            if(!make){
                const preSize = {
                    width: img.width / srcWidth * canvasWidth,
                    height: img.height / srcHeight * canvasHeight
                }
                const { valid, scale } = canvasMaximage(preSize.width, preSize.height, canvasMax.maxHeight, canvasMax.maxWidth, canvasMax.maxArea, canvasMax.extent)
                !valid && dispath(upMaxScale({
                    id: img.id,
                    value: scale
                }))
            }
            const canvas = createCanvas(canvasWidth, canvasHeight)
            canvas.transferControlToOffscreen
            const context = canvas.getContext('2d') as CanvasRenderingContext2D
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, canvasWidth, canvasHeight);
            if(img.setting.shadow > 0){
                context.shadowColor = 'rgba(0,0,0,0.4)'
                const widthOrHeight = srcWidth > srcHeight ? srcHeight : srcWidth
                context.shadowBlur = widthOrHeight * img.setting.shadow / 100;
                context.shadowOffsetX = widthOrHeight * 0.03;
                context.shadowOffsetY = context.shadowOffsetX;
            }
            context.drawImage(imgDom, borders, borders, srcWidth, srcHeight)
            context.shadowColor = 'rgba(0,0,0,0)'
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

    const blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    
    return (
        <>
            <div ref={div} className="mark" style={{ width: `${divStyleWidth}px`, fontSize: img.width > img.height ? `${divStyleWidth * 0.018}px` : `${divStyleWidth * 0.033}px` }}>
                { children }
            </div>
            <img src={show ? makeImg : blank} style={{ width: '100%', opacity: show ? '1' : '0' }} data-html2canvas-ignore/>
        </>
    )
}

export default Draw