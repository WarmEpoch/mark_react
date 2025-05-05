import { Dropdown, Input, MenuProps, Tooltip } from "antd";
import {
  ImgModel,
  revealsAtom,
} from "../export/store";
import { useState } from "react";
import { useAtom } from "jotai";

interface Props {
  img: ImgModel;
  value: string;
  onChange: (value: string) => void;
}

function DropInput({ img, value, onChange }: Props) {
  const [reveals, setReveals] = useAtom(revealsAtom);

  const loong = [
    "龙年大吉 万事如意",
    "龙行龘龘 前程朤朤",
    "祥龙昂首 鸿运当头",
    "龙腾四海 财源广进",
    "龙年吉祥 幸福安康",
    "龙行天下 前程似锦",
    "龙跃九天 步步高升",
    "龙腾盛世 喜迎春来",
    "烟火年年 岁岁平安",
    "龙腾虎跃 年年有余",
  ];

  const si = [
    "巳巳如意 生生不息",
    "年年有余 平安喜乐",
    "祥瑞满堂 福泽绵长",
    "蛇年大吉 万事如意",
    "吉星高照 国泰民安",
    "鸿运当头 前程似锦",
  ];

  // 创建带唯一 key 的菜单项
  const createIconMenuItems = (prefix: string, items: [string, string][]) => {
    return items.map((item, index) => ({
      key: `${prefix}-${index}`, // 使用前缀 + 索引确保唯一性
      label: (
        <a onClick={(e) => {
          e.preventDefault();
          onChange(item[1]);
        }}>
          {item[1]}
        </a>
      ),
      disabled: item[1] === value,
    }));
  };

  // 构建菜单项
  const items: MenuProps["items"] = [
    {
      key: "Default",
      label: "默认参数",
      children: createIconMenuItems("default", Object.entries(img.exifr ?? [])),
    },
    {
      key: "Loong",
      label: "龙行龘龘",
      children: createIconMenuItems("loong", Object.entries(loong)),
    },
    {
      key: "Si",
      label: "巳巳如意",
      children: createIconMenuItems("si", Object.entries(si)),
    },
  ];

  // 如果当前有值，则添加“清空”选项
  if (value) {
    items.unshift({
      key: "None",
      label: (
        <a
          onClick={(e) => {
            e.preventDefault();
            onChange("");
          }}
        >
          清空
        </a>
      ),
      disabled: false,
    });
  }

  // 添加自定义记忆项
  if (reveals.length) {
    items.push({
      key: "Reveals",
      label: "自定义参数",
      children: reveals.map((reveal, index) => ({
        key: `reveal-${index}`,
        label: (
          <a
            onClick={(e) => {
              e.preventDefault();
              onChange(reveal);
            }}
          >
            {reveal}
          </a>
        ),
        disabled: false,
      })),
    });
  }

  const [tipShow, setTipShow] = useState(false);
  const [focus, setFocus] = useState(false);
  const [tip, setTip] = useState("");

  const Enter = (target: HTMLInputElement) => {
    if (tipShow && target.value.trim() !== "") {
      onChange(target.value);
      setReveals([...reveals, target.value]);
    }
    setTipShow(false);
  };

  const findReveals = (target: HTMLInputElement) => {
    const value = target.value.trim();
    if (value === "") {
      setTip("不能为空");
    } else if (reveals.includes(value)) {
      setTip("请按确定删除此自定义");
      setTipShow(true);
    } else {
      setTip("请按确定确认输入");
    }
  };

  return (
    <Dropdown.Button menu={{ items }} size="large">
      <Tooltip placement="topLeft" title={tip} open={focus && tipShow}>
        <Input
          enterKeyHint="done"
          style={{ minWidth: "8em" }}
          variant="borderless"
          disabled={false}
          key={value}
          defaultValue={value || "空"}
          onChange={(e) => {
            findReveals(e.target);
            setTipShow(true);
          }}
          onBlur={() => setFocus(false)}
          onFocus={(e) => {
            findReveals(e.target);
            setFocus(true);
          }}
          onPressEnter={(e) => Enter(e.currentTarget)}
        />
      </Tooltip>
    </Dropdown.Button>
  );
}

export default DropInput;
