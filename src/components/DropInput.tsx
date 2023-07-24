import { Dropdown, Input, MenuProps, Tooltip } from "antd"
import { useSelector } from "react-redux"
import { RootState, RImgModel, upReveal, useAppDispatch, upReveals, removeReveals } from "../export/store";
import { useState } from "react";

interface Props {
    index: number
    name: keyof RImgModel['reveals']
}
function DropInput(props: Props) {
    const { index, name: key } = props
    const imgs = useSelector((state: RootState) => state.imgs)
    const reveals = useSelector((state: RootState) => state.reveals)
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
            type: 'group',
            children: Object.entries(imgs[index].exifr).filter(val => {
                return val[1] === imgs[index]?.reveals[key] || Array.isArray(val[1]) ? false : Boolean(val[1])
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
                    }}>{item[1]}</a>
                }
            })
        }, ...(reveals.length && [{
            key: 'Reveals',
            label: '自定义参数',
            type: 'group',
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
                    }}>{reveal[1]}</a>
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
                <Input style={{ minWidth: '8em' }} bordered={false} disabled={false} key={imgs[index]?.reveals[key]} defaultValue={imgs[index]?.reveals[key] || '空'} onChange={e => {
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