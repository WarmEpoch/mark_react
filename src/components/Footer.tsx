import { DeleteOutlined } from "@ant-design/icons";
import { Button, Divider, Dropdown, Input, Layout, Popover, Space, message, Image } from "antd";
import type { InputRef, MenuProps } from 'antd';
import { RootState, removeImg, removeOnly, upOnly, upScale, useAppDispatch } from "../export/store";
import { useSelector } from "react-redux";
import { ReactNode, useEffect, useRef, useState } from "react";
import DropFilter from "./DropFilter";
import { useMount } from "ahooks";
import { fetchTime } from "../export/fetch";
import DropSwitch from "./DropSwitch";
import { usePlusReady, isPC } from "../export/state";

const { Footer: Footer_Antd } = Layout;
interface Props {
    children: ReactNode
}

function Footer(props: Props) {
    const { children } = props
    const dispath = useAppDispatch()
    const index = useSelector((state: RootState) => state.index)
    const imgs = useSelector((state: RootState) => state.imgs)
    const make = useSelector((state: RootState) => state.make)
    const only = useSelector((state: RootState) => state.only)
    const [messageApi, messageHolder] = message.useMessage();
    const plusReady = usePlusReady()


    const scaleItem = [
        {
            value: 100,
            name: '原',
            key: 'max'
        },
        {
            value: 75,
            name: '高',
            key: 'large'
        },
        {
            value: 50,
            name: '中',
            key: 'middle'
        },
        {
            value: 25,
            name: '低',
            key: 'small'
        }
    ]

    const scaleItems = (maxScale: number, scale: number): MenuProps['items'] => {
        return scaleItem.map((item, i) => {
            if(maxScale < item.value){
                item.value = maxScale
                if(scaleItem[i - 1]?.value == maxScale) {
                    return null
                }
            }
            return {
                key: item.key,
                label: <a onClick={e => {
                    e.preventDefault()
                    dispath(upScale({
                        id: imgs[index].id,
                        value: item.value
                    }))
                }}>{item.name}</a>,
                disabled: item.value === scale,
                value: item.value
            }
        })
    }

    const GetScaleName = (scale: number) => {
        const _index = scaleItem.findIndex(val => val.value <= scale)
        return scaleItem[_index]?.name || '差'
    }

    const checking = async (only: string, tips = true) => {
        if (tips) {
            messageApi.open({
                key: 'only',
                content: '身份验证中！',
                type: 'loading',
                duration: 0
            })
        }
        const time = await fetchTime(only)
        if (Date.now() < +time * 1000) {
            if (tips) {
                messageApi.open({
                    key: 'only',
                    content: '开启自定义模式！',
                    type: 'success'
                })
            }
            dispath(upOnly(only))
            setCheck(true)
            return true
        } else {
            messageApi.open({
                key: 'only',
                content: time === '0' ? '身份码输入错误！' : '身份码已过期！',
                type: time === '0' ? 'error' : 'info'
            })
            dispath(removeOnly())
            return false
        }
    }

    useMount(() => {
        alone && checking(alone, false).then(res => !res && setAlone(''))
    })

    const [check, setCheck] = useState(false)
    const [sing, setSing] = useState('自定义')
    const [singB, setSingB] = useState(false)
    useEffect(() => {
        if (sing.length <= 0) {
            setCheck(false)
            dispath(removeOnly())
        }
        if (singB || check) return
        Promise.resolve().then(async () => {
            if (sing.length >= 6) {
                setSingB(true)
                await checking(sing)
                setSingB(false)
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sing])
    const [alone, setAlone] = useState(only)
    const [pop, setPop] = useState(false)
    const singRef = useRef<InputRef>(null);
    return (
        <>
            {
            make ?
                <Footer_Antd>
                    <Space>
                        Tips：{plusReady ? 'App会自动为您保存到相册！' : `${isPC ? '右键' : '长按'}保存，有误请更换浏览器。`}
                    </Space>
                </Footer_Antd>
            :
            imgs.length > 0 && check ?
                <Footer_Antd onWheel={e => { e.currentTarget.scrollLeft += e.deltaY }}>
                    <Space>
                        <Button size="large" onClick={() => dispath(removeImg(index))} danger icon={<DeleteOutlined />} />
                        <Dropdown menu={{ items: scaleItems(imgs[index]?.maxScale, imgs[index]?.scale) }}>
                            <Button size="large">{ GetScaleName(imgs[index]?.scale) }</Button>
                        </Dropdown>
                        <DropSwitch name="border" />
                        <DropSwitch name="shadow" />
                        <DropFilter name="filter" />
                        {children}
                    </Space>
                </Footer_Antd>
            :
                <Footer_Antd>
                    <Space split={<Divider type="vertical" />}>
                        <Popover open={pop} title="💴：7天/4元 15天/7元 30天/9元 永久/98元" trigger="hover" content={
                            <Image src="https://shp.qpic.cn/collector/1523230910/3522ceeb-3d8f-484b-b86b-5d83c033c4dc/0" width={320} preview={false} />
                        }>
                            <Input ref={singRef} style={{ width: '4.4em' }} enterKeyHint="done" size='small' placeholder="身份码" maxLength={6} bordered={false} value={sing} onChange={e => {
                                setSing(e.target.value)
                                setAlone(e.target.value)
                            }} onBlur={() => {
                                setSing('自定义')
                                setPop(false)    
                            }} onFocus={() => {
                                setPop(true)
                                setSing(alone)
                            }} onPressEnter={() => singRef.current?.blur()} />
                        </Popover>
                        <Button type="text" target="_blank" size='small' href="//mp.weixin.qq.com/mp/appmsgalbum?__biz=Mzg3MTgwNzU0NA==&action=getalbum&album_id=2544483400624160768">沐享教程</Button>
                        <Button type="text" target="_blank" size='small' href="//mp.weixin.qq.com/mp/appmsgalbum?__biz=Mzg3MTgwNzU0NA==&action=getalbum&album_id=3054840868278583296#wechat_redirect">水印手册</Button>
                        <Button type="text" target="_blank" size='small' href="//www.immers.icu/#quick">快捷指令</Button>
                        <Button type="text" target="_blank" size='small' href="//www.immers.icu/#call">联系我们</Button>
                    </Space>
                </Footer_Antd>
            }
            {messageHolder}
        </>
    )
}


export default Footer