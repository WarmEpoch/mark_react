import { Dropdown, Input, MenuProps, Tooltip } from "antd";
import {
  ImgModel,
  revealsAtom,
} from "../export/store";
import { useState } from "react";
import { useAtom } from "jotai";

interface Props {
  img: ImgModel
  value: string
  onChange: (value: string) => void
}
function DropInput({ img, value, onChange }: Props) {
  const [reveals, setReveals] = useAtom(revealsAtom)

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
  ]

  const createIconMenuItems = (item: [string, string][]) => {
    return item
    .map((item) => {
      return {
        key: item[0],
        label: (
          <a
            onClick={(e) => {
              e.preventDefault()
              onChange(item[1])
            }}
          >
            {item[1]}
          </a>
        ),
        disabled: item[1] === value,
      };
    })
  } 
  const items: MenuProps["items"] = (() => {
    const items: MenuProps["items"] = [
      {
        key: "Default",
        label: "默认参数",
        children: createIconMenuItems(Object.entries(img.exifr ?? []))
      },
      {
        key: "Loong",
        label: "龙行龘龘",
        children: createIconMenuItems(Object.entries(loong))
      },
      {
        key: "Si",
        label: "巳巳如意",
        children: createIconMenuItems(Object.entries(si))
      }
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
            清空
          </a>
        ),
        disabled: false,
      });
    }

    if (reveals.length) {
      items.push({
        key: "Reveals",
        label: "自定义参数",
        children: Object.entries(reveals).map((reveal) => {
          return {
            key: `reveal-${reveal}`,
            label: (
              <a
                onClick={(e) => {
                  e.preventDefault()
                  onChange(reveal[1])
                }}
              >
                {reveal[1]}
              </a>
            ),
            disabled: false,
          };
        }),
      });
    }

    return items;
  })();

  const [tipShow, setTipShow] = useState(false);
  const [focus, setFocus] = useState(false);
  const [tip, setTip] = useState("");

  const Enter = (target: HTMLInputElement) => {
    // TODO: 重新完成删除逻辑
    // const _index = reveals.findIndex((reveal) => reveal === target.value);
    // if (_index >= 0) {
    //   setReveals(reveals.filter((reveal) => reveal !== target.value));
    //   dispath(
    //     upSetting({
    //       index,
    //       key,
    //       value: void 0,
    //     })
    //   );
    // } else
    if (tipShow && target.value.trim() !== "") {
      onChange(target.value)
      setReveals(reveals.concat(target.value));
    }
    setTipShow(false);
  };

  const findReveals = (target: HTMLInputElement) => {
    const value = target.value.trim();
    if (value === "") {
      setTip("不能为空");
    } else if (reveals.findIndex((reveal) => reveal === value) >= 0) {
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
