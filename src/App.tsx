import "./css/App.css";
import { Outlet, useLocation } from "react-router-dom";
import { StrictMode, Suspense, useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  Layout,
  Upload,
  message,
  Space,
  Spin,
  Image,
} from "antd";
import type { GetProp, UploadProps } from "antd";
const { Header } = Layout;
import { DownOutlined } from "@ant-design/icons";
import { routesItems } from "./export/router";
import heic2any from "heic2any";
import {
  AddImgAtom,
  imgsAtom,
  makeAtom,
} from "./export/store";
import { ImageSize, ImageResize, ImageLoadExif } from "./export/image";
import { usePlusReady } from "./export/state";
import { WorkerWrapper } from "./export/worker";
import { formaTime } from "./export/util";
import Footer from "./components/Footer";
import { useAtom, useAtomValue } from "jotai";


const useRoutesItem = (id: string) => {
  const [routesItem, setRoutesItem] = useState<typeof routesItems>();
  useEffect(() => {
    setRoutesItem(routesItems.filter((i) => i.key !== id));
  }, [id]);
  return routesItem;
};

function App() {
  const { pathname } = useLocation();

  const routesItem = useRoutesItem(pathname);

  const [,AddImg] = useAtom(AddImgAtom)
  // useMount(async () => {
  //   const { maxArea, maxHeight, maxWidth, extent } = await canvasMaxSize();
  //   dispath(
  //     setCanvasMax({
  //       maxArea,
  //       maxHeight,
  //       maxWidth,
  //       extent,
  //     })
  //   );
  // });

  const plusReady = usePlusReady();

  const [messageApi, contextHolder] = message.useMessage();

  const GetElementName = (id: string) => {
    return routesItems.find((item) => item.key === id)?.name || "敬请期待";
  };

  const [make, setMake] = useAtom(makeAtom);
  const imgs = useAtomValue(imgsAtom);


  const [loading, setLoading] = useState(false);

  type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

  const Uploading = async (fileList: FileType[]) => {
    setLoading(true);
    for (const file of fileList) {
      const id = file.name + file.size;

      const _idIndex = imgs.findIndex((img) => img.id == id);
      if (_idIndex >= 0) {
        messageApi.warning("该图片已上传");
        setLoading(false);
        // return false;
        continue;
      }
      // const output = await parse(file).catch(() => false);

      
      const exifs = await ImageLoadExif(file);
      if (!exifs) {
        messageApi.warning("图像不规范");
        setLoading(false);
        // return false
        continue;
      }

      const blob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 1,
      })
        .then((res) => res as Blob)
        .catch(() => file);

      // const fileBase64 = await WorkerWrapper(imgBlobToBase64, blob);

      const heic = URL.createObjectURL(blob);

      const resizeHeic = URL.createObjectURL(await WorkerWrapper(ImageResize, heic, 1080, 0.8));

      const { width: urlWidth, height: urlHeight } = await WorkerWrapper(ImageSize, heic);

      
      // console.log(exif.GPSInfo[exif.GPSInfo.map["GPSLongitudeRef"]], exif.Exif[exif.Exif.map['LensMake']])

      // console.log("照片参数：", output, exifs);
      const longitude = exifs.exif.GPSInfo?.['GPSLongitude'].split(',').map(Number).map(Math.round)
      const latitude = exifs.exif.GPSInfo?.['GPSLatitude'].split(',').map(Number).map(Math.round)
        AddImg({
          id: id,
          name: file.name.split(".")[0],
          url: heic,
          src: resizeHeic,
          height: urlHeight,
          width: urlWidth,
          scale: 100,
          maxScale: 100,
          exifr: {
            Make: exifs.exif.Make,
            Model: exifs.exif.Model || "Immers Mark",
            Focal: exifs.exif.Exif['FocalLengthIn35mmFilm']
              ? `${exifs.exif.Exif['FocalLengthIn35mmFilm']}mm`
              : exifs.exif.Exif['FocalLength']
              ? `${exifs.exif.Exif['FocalLength']}mm`
              : void 0,
            Time: exifs.exif.Exif['DateTimeOriginal']
              ? formaTime(new Date(exifs.exif.Exif['DateTimeOriginal'].replace(/(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3")))
              : void 0,
            Iso: exifs.exif.Exif['PhotographicSensitivity'] ? `ISO${exifs.exif.Exif['PhotographicSensitivity']}` : void 0,
            Fnumber: exifs.exif.Exif['FNumber']
              ? `f/${Math.round(Number(exifs.exif.Exif['FNumber']) * 100) / 100}`
              : void 0,
            Exposure: exifs.exif.Exif['ExposureTime']
              ? Number(exifs.exif.Exif['ExposureTime']) >= 1
                ? `${exifs.exif.Exif['ExposureTime']}"`
                : `1/${Math.round(1 / Number(exifs.exif.Exif['ExposureTime']))}`
              : void 0,
            LatitudeRef:
              exifs.exif.GPSInfo?.['GPSLatitudeRef'] ? `${latitude[0]}°${latitude[1]}'${latitude[2]}"${
                exifs.exif.GPSInfo['GPSLatitudeRef']
                  }`
                : void 0,
            LongitudeRef:
              exifs.exif.GPSInfo?.['GPSLongitudeRef'] ? `${longitude[0]}°${longitude[1]}'${longitude[2]}"${
                exifs.exif.GPSInfo['GPSLongitudeRef']
                  }`
                : void 0,
            // LensModel: exifs.exif.Exif['LensModel'] || void 0,
            // LensMake: exifs.exif.Exif['LensMake'] || void 0,
          },
          exif: exifs.imageHead,
          // setting: {
          //   ...GetSetting(pathname),
          //   icon: GetIcon(output?.Make || void 0),
          //   filter: '',
          // }
        })
    }
    // dispath(upIndex(imgs.length))
    setLoading(false);
  };

  // const { run: UploadRun } = useRequest(Uploading, {
  //   debounceWait: 200,
  //   manual: true,
  // });

  const UploadProps: UploadProps = {
    beforeUpload: (file, fileList) => {
      if(file == fileList[0]) Uploading(fileList);
      return false;
    },
    showUploadList: false,
    multiple: true,
    disabled: loading,
  };

  return (
    <StrictMode>
      <Layout>
      {contextHolder}
      <Header
        style={{
          paddingTop: plusReady ? plus.navigator.getStatusbarHeight() : "0",
        }}
      >
        <Button
          type="link"
          href="/"  
          icon={
            <Image
              src="//web.immers.cn/assets/immers/mark.svg"
              width="2.6rem"
              preview={false}
            />
          }
        />
        <Dropdown
          menu={{ items: routesItem }}
          placement="bottom"
          trigger={["click"]}
          disabled={make}
        >
          <Button>
            {GetElementName(pathname)}
            <DownOutlined />
          </Button>
        </Dropdown>
        <Space>
          <Upload {...UploadProps}>
            <Spin spinning={loading}>
              <Button type="dashed" disabled={make}>
                选择
              </Button>
            </Spin>
          </Upload>
          <Button
            type="primary"
            onClick={() => setMake(!make)}
            disabled={loading || imgs.length <= 0}
          >
            {make ? "编辑" : "导出"}
          </Button>
        </Space>
      </Header>
      <Suspense>
        <Outlet />
      </Suspense>
      <Footer />
      </Layout>
    </StrictMode>
  );
}

export default App;
