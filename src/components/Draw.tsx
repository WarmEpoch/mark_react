import { useEffect, useState, useRef, ReactNode } from "react"
import html2canvas from '@wtto00/html2canvas';
import { ImageResize, ImageWriteExif, CreateCanvasImageSource } from "../export/image";
import { ImgModel, makeAtom, UpImgMaxScaleAtom} from "../export/store"
import { canvasMaxAtom } from "../export/store"
import { CanvasToBlob, CreateCanvas, CanvasAddfilter, CalculateSizeScale } from '../export/canvas'
import { isPC, usePlusReady } from "../export/state";
import { fetchCreates } from "../export/fetch";
import { WorkerWrapper } from "../export/worker";
import { Base64Save } from "../export/plus";
import { BlobToBase64 } from "../export/util";
import { useAtom, useAtomValue } from "jotai";
import { Toggle } from "./Toggle";

export type Config = {
    border: number
    shadow: number
    filter: string
    icon?: string
}

interface Props {
    img: ImgModel
    children: ReactNode
    fillColor?: string
    config: Config
    setting: string[]
}


export default function Draw(props: Props) {
    const { children, img, fillColor = '#ffffff', config, setting } = props
    const make = useAtomValue(makeAtom)
    // const only = useSelector((state: RootState) => state.only)
    const canvasMax = useAtomValue(canvasMaxAtom)
    const div = useRef<HTMLDivElement>(null)
    const widthOrHeight = img.width > img.height ? img.width : img.height
    const [divStyleWidth, setDivStyleWidth] = useState(img.width + config.border / 100 * 2 * widthOrHeight)
    // let divStyleWidth = widthOrHeight + img.setting.border / 100 * 2 * widthOrHeight
    // const { valid, scaleMax } = canvasMaxSizeValid(divStyleWidth, divStyleWidth, canvasMax.maxHeight, canvasMax.maxWidth, canvasMax.maxArea, canvasMax.extent)
    // !valid && (divStyleWidth = divStyleWidth * scaleMax)
    const [show, setShow] = useState(false)
    const [makeImg, setMakeImg] = useState('')
    const makeImgRef = useRef(makeImg)
    const plusReady = usePlusReady()
    const [,UpImgMaxScale] = useAtom(UpImgMaxScaleAtom)

    useEffect(() => {
        const _width = img.width + config.border / 100 * 2 * widthOrHeight
        const { valid, scale } = CalculateSizeScale(_width, _width, canvasMax)
        if (valid) {
            setDivStyleWidth(_width)
        } else {
            setDivStyleWidth(_width * scale)
        }
    }, [UpImgMaxScale, canvasMax, img.id, config.border, widthOrHeight, img.width])

    useEffect(() => {
        Promise.resolve().then(async () => {
            console.log('draw', img.id)
            setShow(false)
            const divUrl = await html2canvas(div.current as HTMLDivElement, {
                useCORS: true,
                scale: 1,
                backgroundColor: null
            }).then(async dom => URL.createObjectURL(await CanvasToBlob(dom, void 0, "image/png")))
            const { blob, mini, width, height } = await WorkerWrapper(async (img: ImgModel, divUrl: string, make: boolean, fillColor: string, config: Config) => {
                const divDom = await CreateCanvasImageSource(divUrl)
                const src = make ? img.url : img.src
                const imgDom = await (async () => {
                    if(make && img.scale < 100){
                        const blob = URL.createObjectURL(await ImageResize(src, img.width * (img.scale / 100)))
                        const bitmap = await CreateCanvasImageSource(blob)
                        URL.revokeObjectURL(blob)
                        return bitmap
                    }else{
                        return CreateCanvasImageSource(src)
                    }
                })()
                const { width: divWidth, height: divHeight } = divDom
                const { width: srcWidth, height: srcHeight } = imgDom
                const widthOrHeight = img.width > img.height ? srcWidth : srcHeight
                const borders = (() => {
                    return widthOrHeight * config.border / 100
                })()
                const canvasWidth = srcWidth + borders * 2
                const divDrawHeight = canvasWidth / divWidth * divHeight
                const canvasHeight = srcHeight + divDrawHeight + borders
                const canvas = CreateCanvas(canvasWidth, canvasHeight)
                const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D
                context.fillStyle = fillColor;
                context.fillRect(0, 0, canvasWidth, canvasHeight);
                if(config.shadow > 0){
                    context.shadowColor = 'rgba(0,0,0,0.4)'
                    context.shadowBlur = widthOrHeight * config.shadow / 100;
                    context.shadowOffsetX = widthOrHeight * 0.03;
                    context.shadowOffsetY = context.shadowOffsetX;
                }
                context.drawImage(imgDom, borders, borders, srcWidth, srcHeight)
                context.shadowColor = 'rgba(0,0,0,0)'
                if (config.filter) {
                    const filterData = await CanvasAddfilter(config.filter, context.getImageData(borders, borders, srcWidth, srcHeight))
                    context.putImageData(filterData, borders, borders)
                }
                context.drawImage(divDom, 0, srcHeight + borders, canvasWidth, divDrawHeight)
                // const base = await canvastoBase(canvas)
                // const baseExif = img.exif ? imgBase64ToExif(base, img.exif) : base
                const blob = await CanvasToBlob(canvas)
                const mini = await CanvasToBlob(canvas, 0.01)
                return { blob, mini, width: canvasWidth, height: canvasHeight }
            }, img, divUrl, make, fillColor, config)
            
            URL.revokeObjectURL(divUrl)

            if (make) {
                const temp = img.exif ? await ImageWriteExif(blob, img.exif) || blob : blob
                const blobUrl = URL.createObjectURL(temp)
                makeImgRef.current = blobUrl
                // setMakeImg(blobUrl)
                const base64 = await BlobToBase64(temp)
                setMakeImg(base64)
                
                setTimeout(async () => {
                    fetchCreates(img.exif ? await ImageWriteExif(mini, img.exif) || mini : mini, `${img.name}.jpeg`)
                }, 0)
                
                if(plusReady){
                    await Base64Save(base64, `${img.name}.jpeg`) && plus.nativeUI.toast("已保存至相册")
                }else if(isPC){
                    const a = document.createElement('a')
                    a.href = blobUrl
                    a.download = `${img.name}.jpeg`
                    a.click()
                }
            } else {
                const blobUrl = URL.createObjectURL(blob)
                makeImgRef.current = blobUrl
                setMakeImg(blobUrl)

                const _scale = img.width / 1080
                const widthScale = width * _scale
                const heightScale = height * _scale
                const { valid, scale } = CalculateSizeScale(widthScale, heightScale, canvasMax)
                if(!valid) {
                    UpImgMaxScale(img.id, scale * 100)
                }

            }
            setShow(true)
        })
        return () => {
            URL.revokeObjectURL(makeImgRef.current)
        }
    }, [make, img, plusReady, fillColor, config, setting, canvasMax, UpImgMaxScale])


    // const blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    
    return (
        <Toggle.Item>
            <div ref={div} className="mark" style={{ width: `${divStyleWidth}px`, fontSize: img.width > img.height ? `${divStyleWidth * 0.018}px` : `${divStyleWidth * 0.033}px` }}>
                { children }
            </div>
            <img src={makeImg} style={{ width: '100%', opacity: show ? '1' : '0' }} data-html2canvas-ignore/>
        </Toggle.Item>
    )
}