import './css/App.css'
import {
  Outlet,
  useLocation,
} from "react-router-dom";
import { Suspense, useEffect, useState } from "react"
import { Button, Dropdown, Layout, Upload, message, Space, Spin } from "antd";
import type { GetProp, UploadProps } from 'antd';
const { Header } = Layout;
import { createFromIconfontCN, DownOutlined } from "@ant-design/icons"
import { routesConfig, routesItems } from "./export/router"
import { parse } from 'exifr'
import heic2any from "heic2any"
import { RootState, addImg, setCanvasMax, upMake, useAppDispatch } from './export/store';
import { imageDomSize, imageResize, imgBlobToBase64 } from './export/image';
import { imgBase64LoadExif } from './export/piexif';
import { useSelector } from 'react-redux';
import { usePlusReady } from './export/state';
import { CanvasMaxSize } from './export/canvas';
import { useMount, useRequest } from 'ahooks';

const IconFont = createFromIconfontCN({
  scriptUrl: 'https://at.alicdn.com/t/c/font_4091339_seq47rhpkrl.js',
})

const useRoutesItem = (id: string) => {
  const [routesItem, setRoutesItem] = useState<typeof routesItems>()
  useEffect(() => {
    setRoutesItem(routesItems.filter(i => i.key !== id))
  }, [id])
  return routesItem
}

function App() {

  const { pathname } = useLocation()

  const routesItem = useRoutesItem(pathname)

  const dispath = useAppDispatch()

  useMount(async () => {
    const { maxArea, maxHeight, maxWidth, extent } = await CanvasMaxSize()
    dispath(setCanvasMax({
      maxArea,
      maxHeight,
      maxWidth,
      extent,
    }))
  })

  const plusReady = usePlusReady()

  const [messageApi, contextHolder] = message.useMessage();

  const GetElementName = (id: string | undefined) => {
    return routesItems.find(item => item.key === id)?.name || '敬请期待'
  }

  const GetSetting = (id: string | undefined) => {
    return routesConfig.find(item => item.path === id)?.setting || {
      border: 0,
      shadow: 0
    }
  }

  const make = useSelector((state: RootState) => state.make)
  const imgs = useSelector((state: RootState) => state.imgs)

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

  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

  const Uploading = async (fileList: FileType[]) => {
    setLoading(true)
    for(const file of fileList){
      const id = file.name + file.size
      
      const _idIndex = imgs.findIndex(img => img.id == id)
      if (_idIndex >= 0) {
        messageApi.warning('该图片已上传')
        setLoading(false)
        // return false;
        break
      }
      const output = await parse(file).catch(() => false)
      if (!output) {
        messageApi.warning('图像不规范')
        setLoading(false)
        // return false
        break
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

      dispath(addImg({
        id: id,
        name: file.name.split('.')[0],
        url: heic,
        src: resizeHeic,
        height: urlHeight,
        width: urlWidth,
        scale: 100,
        maxScale: 100,
        exifr: {
          Make: output?.Make || void 0,
          Model: output?.Model || 'Immers Mark',
          Focal: (output?.FocalLengthIn35mmFormat && `${output?.FocalLengthIn35mmFormat}mm`) || (output?.FocalLength && `${output?.FocalLength}mm`) || void 0,
          Time: output?.DateTimeOriginal ? formaTime(output.DateTimeOriginal) : void 0,
          Iso: (output?.ISO && `ISO${output?.ISO}`) || void 0,
          Fnumber: (output?.FNumber && `f/${output?.FNumber}`) || void 0,
          Exposure: output?.ExposureTime >= 1 ? `${output.ExposureTime}"` : output?.ExposureTime && `1/${Math.round(1 / output.ExposureTime)}` || void 0,
          LatitudeRef: output?.GPSLatitude?.length >= 3 ? `${Math.round(output?.GPSLatitude[0])}°${Math.round(output?.GPSLatitude[1])}'${Math.round(output?.GPSLatitude[2])}"${output?.GPSLatitudeRef}` : void 0,
          LongitudeRef: output?.GPSLongitude?.length >= 3 ? `${Math.round(output?.GPSLongitude[0])}°${Math.round(output?.GPSLongitude[1])}'${Math.round(output?.GPSLongitude[2])}"${output?.GPSLongitudeRef}` : void 0,
          LensModel: output?.LensModel || void 0,
          LensMake: output?.LensMake || void 0,
        },
        exif: imgBase64LoadExif(fileBase64),
        setting: GetSetting(pathname)
      }))
    }
    setLoading(false)
  }

  const { run: UploadRun } = useRequest(Uploading, {
    debounceWait: 1000,
    manual: true,
  });

  const UploadProps: UploadProps = {
    beforeUpload: (_file, fileList) => {
      UploadRun(fileList)
      return false
    },
    showUploadList: false,
    multiple: true,
    disabled: loading,
  }

  return (
    <>
      {contextHolder}
      <Header style={{ paddingTop: plusReady ? plus.navigator.getStatusbarHeight() : '0' }}>
        <Button type='link' href="/" style={{ width: 'unset' }} icon={<IconFont type="icon-mark" style={{ fontSize: '2.6rem' }} />} />
        <Dropdown menu={{ items: routesItem }} placement="bottom" trigger={['click']} disabled={make}>
          <Button>{GetElementName(pathname)}<DownOutlined /></Button>
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
