import './css/App.css'
import {
  Outlet,
  useLocation,
} from "react-router-dom";
import { Suspense, useEffect, useState } from "react"
import { Button, Dropdown, Layout, Upload, message, Space, Spin } from "antd";
import type { UploadProps } from 'antd';
const { Header } = Layout;
import { createFromIconfontCN, DownOutlined } from "@ant-design/icons"
import { routesItems } from "./export/router"
import { parse } from 'exifr'
import heic2any from "heic2any"
import { RootState, addImg, upMake, useAppDispatch } from './export/store';
import { imageDomSize, imageResize, imgBlobToBase64 } from './export/image';
import canvasSize from 'canvas-size';
import { imgBase64LoadExif } from './export/piexif';
import { useSelector } from 'react-redux';
import { plusReady } from './export/state';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4091339_seq47rhpkrl.js',
})

const useCanvasMaxSize = () => {
  const [canvasMaxSize, setCanvasMaxSize] = useState({
    width: 1080,
    height: 1080
  })
  useEffect(() => {
    canvasSize.maxArea({
      usePromise: true,
      useWorker: true,
    }).then(({ width, height }) => setCanvasMaxSize({
      width,
      height
    }))
  }, [])
  return canvasMaxSize
}

const useRoutesItem = (id: string) => {
  const [routesItem, setRoutesItem] = useState<typeof routesItems>()
  useEffect(() => {
    setRoutesItem(routesItems.filter(i => i.key !== id))
  }, [id])
  return routesItem
}

function App() {

  const { width: canvasMaxWidth, height: canvasMaxHeight } = useCanvasMaxSize()

  const { pathname: id } = useLocation()

  const routesItem = useRoutesItem(id)

  const dispath = useAppDispatch()

  const [messageApi, contextHolder] = message.useMessage();

  const GetElementName = (id: string | undefined) => {
    const index = routesItems.findIndex(item => item.key === id)
    return routesItems[index]?.name || '敬请期待'
  }

  const formaTime = (Date: Date) => {
    const Y = Date.getFullYear();
    const M = (Date.getMonth() + 1 + '').padStart(2, '0');
    const D = (Date.getDate() + '').padStart(2, '0');
    const H = (Date.getHours() + '').padStart(2, '0');
    const Mi = (Date.getMinutes() + '').padStart(2, '0');
    const S = (Date.getSeconds() + '').padStart(2, '0');
    return `${Y}.${M}.${D} ${H}:${Mi}:${S}`
  }
  const [loading, setLoading] = useState(false)
  const UploadProps: UploadProps = {
    beforeUpload: async (file) => {

      setLoading(true)
      const id = file.lastModified + file.size
      const _index = imgs.findIndex(img => img.id == id)
      if (_index >= 0) {
        messageApi.warning('该图片已上传')
        setLoading(false)
        return false;
      }
      const output = await parse(file).catch(() => false)
      if (!output) {
        messageApi.warning('图像不规范')
        setLoading(false)
        return false
      }
      const blob: Blob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 1,
      }).then(res => res as Blob).catch(() => file)

      const fileBase64 = await imgBlobToBase64(blob)

      const heic: string = URL.createObjectURL(blob)

      const resizeHeic = await imageResize(heic, 1080, 0.8)

      const { width: urlWidth, height: urlHeight } = await imageDomSize(heic)

      const isValidCanvas = canvasSize.test({
        width: urlWidth,
        height: urlHeight
      })

      const canvaScale = isValidCanvas ? 100 : Math.floor(urlWidth > urlHeight ? canvasMaxWidth / urlWidth * 100 : canvasMaxHeight / urlHeight * 100)

      
      dispath(addImg({
        id: id,
        name: file.name.split('.')[0],
        url: heic,
        src: resizeHeic,
        height: urlHeight,
        width: urlWidth,
        scale: canvaScale,
        maxScale: canvaScale,
        exifr: {
          Make: output?.Make || void 0,
          Model: output?.Model || 'Immers Mark',
          Focal: (output?.FocalLengthIn35mmFormat && `${output?.FocalLengthIn35mmFormat}mm`) || (output?.FocalLength && `${output?.FocalLength}mm`) || void 0,
          Time: output?.DateTimeOriginal ? formaTime(output.DateTimeOriginal) : void 0,
          Iso: (output?.ISO && `ISO${output?.ISO}`) || void 0,
          Fnumber: (output?.FNumber &&  `f/${output?.FNumber}`) || void 0,
          Exposure: output?.ExposureTime >= 1 ? `${output.ExposureTime}"` : output?.ExposureTime && `1/${Math.round(1 / output.ExposureTime)}` || void 0,
          LatitudeRef: output?.GPSLatitude?.length >= 3 ? `${Math.round(output?.GPSLatitude[0])}°${Math.round(output?.GPSLatitude[1])}'${Math.round(output?.GPSLatitude[2])}"${output?.GPSLatitudeRef}` : void 0,
          LongitudeRef: output?.GPSLongitude?.length >= 3 ? `${Math.round(output?.GPSLongitude[0])}°${Math.round(output?.GPSLongitude[1])}'${Math.round(output?.GPSLongitude[2])}"${output?.GPSLongitudeRef}` : void 0,
          LensModel: output?.LensModel || void 0,
          LensMake: output?.LensMake || void 0,
        },
        exif: imgBase64LoadExif(fileBase64),
      }))
      
      setLoading(false)

      return false
    },
    showUploadList: false,
    multiple: true,
    disabled: loading,
  }

  const make = useSelector((state: RootState) => state.make)
  const imgs = useSelector((state: RootState) => state.imgs)
  

  return (
    <>
      {contextHolder}
      <Header style={{ paddingTop: plusReady ? plus.navigator.getStatusbarHeight() : '0'}}>
        <Button type='link' style={{width: 'unset'}} href='/' icon={<IconFont type="icon-mark" style={{ fontSize: '2.6rem' }} />} / >
        <Dropdown menu={{ items: routesItem }} placement="bottom" trigger={['click']} disabled={make}>
          <Button>{GetElementName(id)}<DownOutlined /></Button>
        </Dropdown>
        <Space>
          <Upload {...UploadProps}>
            <Spin spinning={loading}>
              <Button type="dashed" disabled={make}>选择</Button>
            </Spin>
          </Upload>
          <Button type="primary" onClick={() => dispath(upMake())} disabled={loading || imgs.length <= 0}>{make ? '编辑' : '导出'}</Button>
        </Space>
      </Header>
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  )
}

export default App
