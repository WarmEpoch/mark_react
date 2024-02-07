import { Dropdown, Input, MenuProps, Tooltip } from "antd"
import { useSelector } from "react-redux"
import { RootState, RImgModel, upReveal, useAppDispatch, upReveals, removeReveals } from "../export/store";
import { useState } from "react";

interface Props {
    name: keyof RImgModel['reveals']
}
function DropInput(props: Props) {
    const { name: key } = props
    const imgs = useSelector((state: RootState) => state.imgs)
    const index = useSelector((state: RootState) => state.index)
    const reveals = useSelector((state: RootState) => state.reveals)
    const fuks = ['龙年大吉 万事如意', '龙行龘龘 前程朤朤', '祥龙昂首 鸿运当头', '龙腾四海 财源广进', '龙年吉祥 幸福安康', '龙行天下 前程似锦', '龙跃九天 步步高升', '龙腾盛世 喜迎春来', '烟火年年 岁岁平安', '龙腾虎跃 年年有余' ]
    const dispath = useAppDispatch()

    const items: MenuProps['items'] = (() => {
        return [...(imgs[index]?.reveals[key] && [{
            key: 'None',
            label: <a onClick={e => {
                e.preventDefault()
                dispath(upReveal({
                    index,
                    key,
                    value: void 0
                }))
            }}>清空</a>
        }] || []), {
            key: 'Default',
            label: '默认参数',
            type: 'divider',
            children: Object.entries(imgs[index]?.exifr || []).filter(val => {
                return Array.isArray(val[1]) ? false : Boolean(val[1])
            }).map(item => {
                return {
                    key: item[0],
                    label: <a onClick={e => {
                        e.preventDefault()
                        dispath(upReveal({
                            index,
                            key,
                            value: item[1]?.toString()
                        }))
                    }}>{item[1]}</a>,
                    disabled: item[1] === imgs[index]?.reveals[key]
                }
            })
        }, {
            key: 'Fuks',
            label: '福到啦',
            type: 'divider',
            children: Object.entries(fuks).filter(val => {
                return Array.isArray(val[1]) ? false : Boolean(val[1])
            }).map(item => {
                return {
                    key: item[0],
                    label: <a onClick={e => {
                        e.preventDefault()
                        dispath(upReveal({
                            index,
                            key,
                            value: item[1]?.toString()
                        }))
                    }}>{item[1]}</a>,
                    disabled: item[1] === imgs[index]?.reveals[key]
                }
            })
        }, ...(reveals.length && [{
            key: 'Reveals',
            label: '自定义参数',
            type: 'divider',
            children: Object.entries(reveals).map(reveal => {
                return {
                    key: reveal[0],
                    label: <a onClick={e => {
                        e.preventDefault()
                        dispath(upReveal({
                            index,
                            key,
                            value: reveal[1]
                        }))
                    }}>{reveal[1]}</a>,
                    disabled: reveal[1] === imgs[index]?.reveals[key]
                }
            })
        }] || [])]
    })()

    const [tipShow, setTipShow] = useState(false)
    const [focus, setFocus] = useState(false)
    const [tip, setTip] = useState('')

    const Enter = (target: HTMLInputElement) => {
        const _index = reveals.findIndex(reveal => reveal === target.value)
        if (_index >= 0) {
            dispath(removeReveals(index))
            dispath(upReveal({
                index,
                key,
                value: void 0
            }))
        } else if (tipShow && target.value.trim() !== '') {
            dispath(upReveal({
                index,
                key,
                value: target.value
            }))
            dispath(upReveals(target.value))
        }
        setTipShow(false)
    }

    const findReveals = (target: HTMLInputElement) => {
        const value = target.value.trim()
        if (value === '') {
            setTip('不能为空')
        } else if (reveals.findIndex(reveal => reveal === value) >= 0) {
            setTip('请按确定删除此自定义')
            setTipShow(true)
        } else {
            setTip('请按确定确认输入')
        }
    }

    return (
        <Dropdown.Button menu={{ items }}>
            <Tooltip placement="topLeft" title={tip} open={focus && tipShow}>
                <Input enterKeyHint="done" style={{ minWidth: '8em' }} variant="borderless" disabled={false} key={imgs[index]?.reveals[key]} defaultValue={imgs[index]?.reveals[key] || '空'} onChange={e => {
                    findReveals(e.target)
                    setTipShow(true)
                }} onBlur={() => setFocus(false)} onFocus={e => {
                    findReveals(e.target)
                    setFocus(true)
                }} onPressEnter={e => Enter(e.target as HTMLInputElement)} />
            </Tooltip>
        </Dropdown.Button>
    )
}

export default DropInput