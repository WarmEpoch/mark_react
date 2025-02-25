import { Button, Dropdown, MenuProps, Upload, message } from "antd";
import {
  filterAtom,
} from "../export/store";
import filtered from "../export/filters";
import type { UploadProps } from "antd";
import { BlobToBase64 } from "../export/util";
import { WorkerWrapper } from "../export/worker";
import { useAtom } from "jotai";

interface Props {
  value: string
  onChange: (value: string) => void
}
function DropFilter({ value, onChange }: Props) {
  const [filters, setFilters] = useAtom(filterAtom);
  const [messageApi, contextHolder] = message.useMessage();

  const UploadProps: UploadProps = {
    beforeUpload: async (file) => {
      const name = file.name.split(".")[0];
      const value = await WorkerWrapper(BlobToBase64, file);
      const _index = filters.findIndex(
        (filter) => filter.name == name || filter.value == value
      );
      if (_index >= 0) {
        messageApi.warning("该滤镜已上传");
        return false;
      }
      setFilters(filters.concat({ name, value }));
      return false;
    },
    accept: "image/png, image/jpeg",
    maxCount: 1,
    showUploadList: false,
  };

  
  const items: MenuProps['items'] = (() => {
    const items = [
      {
        key: "Upload",
        label: <Upload {...UploadProps}>上传</Upload>,
      },
      {
        key: "Default",
        label: "默认滤镜",
        // type: filtered.length ? "divider" : "group",
        children: filtered.map((filter) => {
          return {
            key: filter["name"],
            label: (
              <a
                onClick={(e) => {
                  e.preventDefault()
                  onChange(filter['val'])
                }}
              >
                {filter["name"]}
              </a>
            ),
            disabled: filter["val"] === value,
          };
        }),
      },
    ];
    if (value) {
      items.unshift({
        key: "None",
        label: (
          <a
            onClick={(e) => {
              e.preventDefault()
              onChange('')
            }}
          >
            无滤镜
          </a>
        ),
      });
    }
    if (filters.length) {
      items.push({
        key: "Reveals",
        label: "自定义滤镜",
        // type: "divider",
        children: filters.map((filter, _index) => {
          return {
            key: filter.name,
            label: (
              <a
                style={{
                  color: filter.value === value ? "red" : "inherit",
                }}
                onClick={(e) => {
                  e.preventDefault()
                  if (filter.value === value) {
                    // dispath(removeFilter(_index))
                    setFilters(filters.filter((_, index) => index !== _index));
                    onChange('')
                  } else {
                    onChange(filter.value)
                  }
                }}
              >
                {filter.name}
              </a>
            ),
            disabled: false,
          };
        }),
      });
    }

    return items;
  })();

  return (
    <>
      <Dropdown menu={{ items }}>
        <Button size="large">
          {filtered.find((filter) => filter.val == value)?.name ||
            filters.find((filter) => filter["value"] == value)
              ?.name ||
            "无滤镜"}
        </Button>
      </Dropdown>
      {contextHolder}
    </>
  );
}

export default DropFilter;
