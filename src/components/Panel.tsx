import { Button, Space } from "antd";
import { forwardRef, ForwardRefExoticComponent, ReactNode, RefAttributes, useImperativeHandle, useState } from "react";
import {
  ImgModel,
  makeAtom,
  RemoveImgAtom,
  UpImgMaxScaleAtom,
} from "../export/store";
import {
  BorderInnerOutlined,
  BorderOuterOutlined,
  DeleteOutlined,
  FileImageFilled,
  FileImageOutlined,
} from "@ant-design/icons";
import DropFilter from "./DropFilter";
import DropSwitch from "./DropSwitch";
import DropScale from "./DropScale";
import { useAtom, useAtomValue } from "jotai";
import "../css/Panel.css";
import { UpdateConfig } from "../export/hooks";
import { Config } from "./Draw";

export type PanelRef = {
  goTo: (current: number) => void
}

export const Panel = forwardRef(({ children }: { children: ReactNode }, ref) => {
  const [current, setCurrent] = useState(0)
  // const plusReady = usePlusReady();
  // const areaBottom = plusReady
  //   ? plus.webview.currentWebview().getSafeAreaInsets().deviceBottom + "px"
  //   : "0";
  const make = useAtomValue(makeAtom)
  useImperativeHandle(ref, () => {
    return {
      goTo: (current: number) => {
        setCurrent(current)
      }
    };
  }, []);
  return !make && <div className="panel">
          <div className="panel-container" style={{ transform: `translate3d(-${current * 100}%, 0, 0)` }}>
            {children}
        </div>
      </div>
}) as ForwardRefExoticComponent<{ children: ReactNode } & RefAttributes<PanelRef>> & { Item: typeof PanelItem }

type PanelItemProps = { children: ReactNode; img: ImgModel; config: Config; updateConfig: UpdateConfig }

const PanelItem = ({ children, img, config, updateConfig  }: PanelItemProps) => {
    
  const [,RemoveImg] = useAtom(RemoveImgAtom)

  const [, upMaxScale] = useAtom(UpImgMaxScaleAtom)


  return <div onWheel={(e) => {
    e.currentTarget.scrollLeft += e.deltaY;
  }}
  className="panel-item"
  >
    <Space>
      <Button
        size="large"
        onClick={() => {
          RemoveImg(img.id);
        }}
        danger
        icon={<DeleteOutlined />}
      />
      <DropScale
        value={img.scale}
        onChange={(value) => upMaxScale(img.id, value)}
        max={img.maxScale}
      />
      <DropFilter
        value={config.filter}
        onChange={(value) => updateConfig.setFilter(value)}
      />
      <DropSwitch
        value={config.border}
        onChange={(value) => updateConfig.setBorder(value)}
        icon={{
          success: <BorderOuterOutlined />,
          error: <BorderInnerOutlined />,
        }}
      />
      <DropSwitch
        value={config.shadow}
        onChange={(value) => updateConfig.setShadow(value)}
        icon={{
          success: <FileImageFilled />,
          error: <FileImageOutlined />,
        }}
      />
      {children}
    </Space>
    </div>
};

Panel.Item = PanelItem;

// function Panel({ children, id }: Props) {
//   const plusReady = usePlusReady();
//   const areaBottom = plusReady
//     ? plus.webview.currentWebview().getSafeAreaInsets().deviceBottom + "px"
//     : "0";
//   const [,RemoveImg] = useAtom(RemoveImgAtom)

//   return <Footer
//       onWheel={(e) => {
//         e.currentTarget.scrollLeft += e.deltaY;
//       }}
//       style={{ paddingBottom: `calc(${areaBottom} + 1rem)` }}
//     >
//       <Space>
//         <Button
//           size="large"
//           onClick={() => {
//             RemoveImg(id);
//           }}
//           danger
//           icon={<DeleteOutlined />}
//         />
//         <DropScale
//           value={img.scale}
//           onChange={(value) => console.log(value)}
//           max={img.maxScale}
//         />
//         <DropFilter
//           value={img.setting.filter}
//           onChange={(value) => console.log(value)}
//         />
//         <DropSwitch
//           value={img.setting.border}
//           onChange={(value) => console.log(value)}
//           icon={{
//             success: <BorderOuterOutlined />,
//             error: <BorderInnerOutlined />
//           }}
//         />
//         <DropSwitch
//           value={img.setting.shadow}
//           onChange={(value) => console.log(value)}
//           icon={{
//             success: <FileImageFilled />,
//             error: <FileImageOutlined />
//           }}
//         />
//         <DropIcon
//           value={img.setting.icon}
//           onChange={(value) => console.log(value)}
//         />
//         {children}
//       </Space>
//     </Footer>

// }

// export default Panel;
