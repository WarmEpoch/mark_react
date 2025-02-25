import { Dropdown, Input, MenuProps, Upload, message } from "antd";
import {
  iconsAtom,
} from "../export/store";
import { defaultIcons, cameraIcons, Icon } from "../export/icons";
import type { UploadProps } from "antd";
import { BlobToBase64 } from "../export/util";
import { WorkerWrapper } from "../export/worker";
import { useAtom } from "jotai";

interface Props {
  value: string
  onChange: (value: string) => void
}

const transparent = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=='

function DropIcon({ value, onChange }: Props) {
  const [icons, setIcons] = useAtom(iconsAtom);
  const [messageApi, contextHolder] = message.useMessage();

  const UploadProps: UploadProps = {
    beforeUpload: async (file) => {
      const name = file.name.split(".")[0];
      const value = await WorkerWrapper(BlobToBase64, file);
      const _index = icons.findIndex(
        (icon) => icon.name == name || icon.value == value
      );
      if (_index >= 0) {
        messageApi.warning("该标志已上传");
        return false;
      }
      setIcons(
        icons.concat({
          name,
          value,
        })
      );
      return false;
    },
    accept: "image/svg+xml, image/png, image/jpeg",
    maxCount: 1,
    showUploadList: false,
  };
  const createIconMenuItems = (icons: Icon) => {
    return icons.map((icon) => {
      return {
        key: icon["name"],
        label: (
          <a
            onClick={(e) => {
              e.preventDefault()
              onChange(icon.val)
            }}
          >
            {icon.name}
          </a>
        ),
        disabled: icon.val === value,
      };
    });
  };

  const items: MenuProps["items"] = (() => {
    const items = [
      {
        key: "Upload",
        label: <Upload {...UploadProps}>上传</Upload>,
      },
      {
        key: "Default",
        label: "默认标志",
        children: createIconMenuItems(defaultIcons),
      },
      {
        key: "Camera",
        label: "相机标志",
        children: createIconMenuItems(cameraIcons),
      },
    ];

    if (icons.length) {
      items.push({
        key: "Reveals",
        label: "自定义标志",
        children: icons.map((icon) => {
          return {
            key: icon.name,
            label: (
              <a
                style={{
                  color:
                    icon.value === value
                      ? "red"
                      : "inherit",
                }}
                onClick={(e) => {
                  e.preventDefault()
                  if (icon.value === value) {
                    setIcons(icons.filter((_icon) => _icon.name !== icon.name));
                  } else {
                    onChange(icon.value)
                  }
                }}
              >
                {icon.name}
              </a>
            ),
            disabled: true,
          };
        }),
      });
    }

    if(value !== transparent) {
      items.unshift({
        key: "None",
        label: <a onClick={(e) => {
          e.preventDefault()
          onChange(transparent)
        }}>无</a>,
      });
    }

    return items;
  })();

  return (
    <>
      <Dropdown.Button menu={{ items }} size="large">
        <Input
          style={{ minWidth: "4em" }}
          variant="borderless"
          disabled={true}
          key={value}
          defaultValue={
            defaultIcons.find((icon) => icon["val"] == value)
              ?.name ||
            cameraIcons.find((icon) => icon["val"] == value)?.name ||
            icons.find((icon) => icon["value"] == value)?.name ||
            (value == transparent && "无") || "错误"
          }
        />
      </Dropdown.Button>
      {contextHolder}
    </>
  );
}

export default DropIcon;
