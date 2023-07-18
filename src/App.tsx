import './css/App.css'
import {
  Outlet,
  useLocation,
} from "react-router-dom";
import { Suspense, useEffect, useState } from "react"
import { Button, Dropdown, Layout, Upload, message, Space, Spin, Drawer } from "antd";
import type { UploadProps } from 'antd';
const { Header } = Layout;
import { createFromIconfontCN, DownOutlined } from "@ant-design/icons"
import { routesItems } from "./export/router"
import { parse } from 'exifr'
import heic2any from "heic2any"
import { addImg, useAppDispatch } from './export/store';
import { imageDomSize, imageResize, imgBlobToBase64 } from './export/image';
import Make from './components/Make';
import canvasSize from 'canvas-size';
import { imgBase64LoadExif } from './export/piexif';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4091339_seq47rhpkrl.js',
})


const useCanvasMaxSize = () => {
  const [canvasMaxSize,setCanvasMaxSize] = useState({
    width: 1080,
    height: 1080
  })
  useEffect(() => {
    canvasSize.maxArea({
      usePromise: true,
      useWorker: true,
    }).then(({width,height}) => setCanvasMaxSize({
      width,
      height
    }))
  },[])
  return canvasMaxSize
}

const useRoutesItem = (id: string) => {
  const [routesItem,setRoutesItem] = useState<typeof routesItems>()
  useEffect(() => {
    setRoutesItem(routesItems.filter(i => i.key !== id))
  },[id])
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
    return routesItems[index]['name']
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

  // const uploads: Set<number> = new Set()
  const [loading,setLoading] = useState(false)
  const UploadProps: UploadProps = {
    beforeUpload: async (file) => {
      
      setLoading(true)
      const id = file.lastModified + file.size
      // if(uploads.has(id)){
      //   messageApi.warning('该图片已上传')
      //   return false;
      // }
      // uploads.add(id)
      const output = await parse(file).catch(() => false)
      if (!output) {
        messageApi.warning('图像不规范')
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
        width : urlWidth,
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
        icon: 'leica',
        filter: '',
        exifr: {
          Make: output?.Make || void 0,
          Model: output?.Model || 'Immers Mark',
          Focal: output?.FocalLengthIn35mmFormat || output?.FocalLength || void 0,
          Time: output?.DateTimeOriginal ? formaTime(output.DateTimeOriginal) : void 0,
          Iso: output?.ISO || void 0,
          Fnumber: output?.FNumber || void 0,
          Exposure: output?.ExposureTime >= 1 ? `${output.ExposureTime}"` : output?.ExposureTime && `1/${Math.round(1 / output.ExposureTime)}` || void 0,
          ExposureTime: output?.ExposureTime || void 0,
          Latitude: output?.GPSLatitude || [],
          Longitude: output?.GPSLongitude || [],
          LatitudeRef: output?.GPSLatitudeRef || void 0,
          LongitudeRef: output?.GPSLongitudeRef || void 0,
          LensModel: output?.LensModel || void 0,
          LensMake: output?.LensMake || void 0,
        },
        exif: imgBase64LoadExif(fileBase64)
      }))
      setLoading(false)

      return false
    },
    showUploadList: false,
    multiple: true,
    disabled: loading,
  }

  const [making, setMaking] = useState(false);

  return (
    <>
      {contextHolder}
      <Header>
        <IconFont type="icon-mark" style={{ fontSize: '2.6rem' }} />
        <Dropdown menu={{ items: routesItem }} placement="bottom" trigger={['click']}>
          <Button>{GetElementName(id)}<DownOutlined /></Button>
        </Dropdown>
        <Space>
          <Upload {...UploadProps}>
            <Spin spinning={ loading }>
              <Button type="dashed">选择</Button>
            </Spin>
          </Upload>
          <Button type="primary" onClick={() => setMaking(true)} disabled={loading}>生成</Button>
        </Space>
          <Drawer title="保存水印" placement="right" width="100%" onClose={() => setMaking(false)} open={making} destroyOnClose={true}>
            { making && <Make />}
          </Drawer>
      </Header>
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  )
}

export default App
