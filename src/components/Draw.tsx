import { useEffect, useState, useRef, ReactNode } from "react"
import html2canvas from 'html2canvas';
import { imgBlobToBase64, imageDom, imageDomToSize, imageResize } from "../export/image";
import { imgBase64ToExif } from "../export/piexif"
import { RImgModel, RootState } from "../export/store"
import { htmlCanvastoBlob, offScreenCanvastoBlob } from '../export/cavnvas'
import { useUnmount } from 'ahooks';
import { CanvasAddfilter } from "../export/lut";
import { useSelector } from "react-redux";

interface Props {
    img: RImgModel
    children: ReactNode
    border?: number
}


function Draw(props: Props) {
    const { children, img, border = 0 } = props
    const make = useSelector((state: RootState) => state.make)
    const div = useRef<HTMLDivElement>(null)
    const divStyleWidth = img.width > img.height ? (img.width + border * img.width / 100 * 2) * (img.scale / 100) : (img.height + border * img.height / 100 * 2) * (img.scale / 100)
    const [show, setShow] = useState(false)
    const [makeImg, setMakeImg] = useState('')
    // const dispath = useAppDispatch()
    // useEffect(() => {
    //     dispath(upDraw({id: img.id, value: makeImg}))
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // },[makeImg])

    useEffect(() => {
        setTimeout(async () => {
            setShow(false)
            div.current?.classList.add("show")
            const divUrl = await html2canvas(div.current as HTMLDivElement, {
                useCORS: true,
                scale: 1,
                backgroundColor: void 0,
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
            const borders = img.width > img.height ? border * srcWidth / 100 : border * srcHeight / 100
            const canvasWidth = srcWidth + borders * 2
            const divDrawHeight = canvasWidth / divWidth * divHeight
            const canvasHeight = srcHeight + divDrawHeight + borders
            const offscreen = new OffscreenCanvas(canvasWidth, canvasHeight);
            const context = offscreen.getContext('2d', {
                willReadFrequency: true,
            }) as OffscreenCanvasRenderingContext2D
            context.drawImage(imgDom, borders, borders, srcWidth, srcHeight)
            if (img.reveals.filter) {
                const filterData = await CanvasAddfilter(img.reveals.filter, context.getImageData(0, 0, canvasWidth, canvasHeight))
                context.putImageData(filterData, 0, 0)
            }
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, borders, canvasHeight);
            context.fillRect(0, 0, canvasWidth, borders);
            context.fillRect(canvasWidth - borders, 0, borders, canvasHeight);
            context.fillRect(0, canvasHeight + borders, canvasWidth, divDrawHeight);
            context.drawImage(divDom, 0, srcHeight + borders, canvasWidth, divDrawHeight)
            const blob = await offScreenCanvastoBlob(offscreen)
            URL.revokeObjectURL(makeImg)
            if (make) {
                const blobBase64 = await imgBlobToBase64(blob)
                const base64Exif = imgBase64ToExif(img.exif, blobBase64)
                // setMakeImg(imgBase64ToBlob(base64Exif))
                setMakeImg(base64Exif)
            } else {
                setMakeImg(URL.createObjectURL(blob))
            }
            URL.revokeObjectURL(divUrl)
            setShow(true)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [make, img.reveals])

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