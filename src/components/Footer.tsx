import { DeleteOutlined } from "@ant-design/icons";
import { Button, Divider, Dropdown, Input, Layout, Space, message, notification } from "antd";
import type { MenuProps } from 'antd';
import { RootState, removeImg, upScale, useAppDispatch } from "../export/store";
import { useSelector } from "react-redux";
import { ReactNode, useEffect, useState } from "react";
import DropFilter from "./DropFilter";
import { useMount } from "ahooks";

const { Footer: Footer_Antd } = Layout;
interface Props {
    children: ReactNode
}

const plusReady = (() => {
    try {
        return !!plus
    } catch {
        return false
    }
})()

function Footer(props: Props) {
    const { children } = props
    const dispath = useAppDispatch()
    const index = useSelector((state: RootState) => state.index)
    const imgs = useSelector((state: RootState) => state.imgs)
    const make = useSelector((state: RootState) => state.make)
    const [notificationApi, notificationHolder] = notification.useNotification();
    const [messageApi, messageHolder] = message.useMessage();
    useEffect(() => {
        if (make) {
            notificationApi.open({
                message: '导出图片',
                description: '长按保存至相册，有误请更换浏览器。',
                placement: 'bottomRight',
                closeIcon: false,
                duration: null,
                key: 'export',
                btn: (plusReady &&
                    <Space>
                        <Button type="primary" onClick={() => {
                            // plus.gallery.save('https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wEaH', e => {
                            //     console.log(e)
                            // }, e => {
                            //     console.log(e)
                            // })
                        }
                        }>
                            下载当前
                        </Button>
                    </Space>
                )
            })
        } else {
            notificationApi.destroy()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [make])


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
        return scaleItem.map(item => {
            return {
                key: item.key,
                label: <a onClick={e => {
                    e.preventDefault()
                    dispath(upScale({
                        id: imgs[index].id,
                        value: item.value
                    }))
                }}>{item.name}</a>,
                disabled: item.value === scale || maxScale < item.value
            }
        })
    }

    const GetScaleName = (scale: number) => {
        const _index = scaleItem.findIndex(val => val.value <= scale)
        return scaleItem[_index]?.name || '差'
    }

    const checking = async (only: string, tips = true) => {
        const time = await fetch(`//api.immers.icu/api/Mark/time?only=${only}`).then(res => res.text())
        if (Date.now() < +time * 1000) {
            if (tips) {
                messageApi.open({
                    key: 'only',
                    content: '开启自定义模式！',
                    type: 'success'
                })
            }
            localStorage.setItem('only', only)
            setCheck(true)
        } else {
            messageApi.open({
                key: 'only',
                content: time === '0' ? '身份码输入错误！' : '身份码已过期！',
                type: time === '0' ? 'error' : 'info'
            })
            time !== '0' && localStorage.removeItem('only')
        }
    }

    useMount(() => {
        const only = localStorage.getItem('only')
        only && checking(only, false)
    })

    const [check,setCheck] = useState(false)
    const [only, setOnly] = useState('身份码')
    const [onlyB, setOnlyB] = useState(false)
    useEffect(() => {
        if (onlyB || check) return
        Promise.resolve().then(async () => {
            if (only.length >= 6) {
                setOnlyB(true)
                await checking(only)
                setOnly('')
                setAlone('')
                setOnlyB(false)
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [only])
    const [alone, setAlone] = useState(localStorage.getItem('only') || '')

    return (
        <>
            {(imgs.length > 0 && !make && check) ?
                <Footer_Antd onWheel={e => { e.currentTarget.scrollLeft += e.deltaY }}>
                    <Space>
                        <Button size="large" onClick={() => dispath(removeImg(index))} danger icon={<DeleteOutlined />} />
                        <Dropdown menu={{ items: scaleItems(imgs[index]?.maxScale, imgs[index]?.scale) }}>
                            <Button size="large">{GetScaleName(imgs[index]?.scale)}</Button>
                        </Dropdown>
                        <DropFilter name="filter" />
                        {children}
                    </Space>
                </Footer_Antd>
                :
                <Footer_Antd>
                    <Space split={<Divider type="vertical" />}>
                        <Button type="text" target="_blank" size='small' href="//mp.weixin.qq.com/mp/appmsgalbum?__biz=Mzg3MTgwNzU0NA==&action=getalbum&album_id=2544483400624160768">帮助中心</Button>
                        <Button type="text" target="_blank" size='small' href="//www.immers.icu/#call">联系我们</Button>
                        <Button type="text" target="_blank" size='small' href="//www.immers.icu/#quick">快捷指令</Button>
                        <Input style={{ width: '4.4em' }} size='small' placeholder="身份码" maxLength={6} bordered={false} value={only} onChange={e => {
                            setOnly(e.target.value)
                            setAlone(e.target.value)
                        }} onBlur={() => setOnly('身份码')} onFocus={() => setOnly(alone)} />
                    </Space>
                </Footer_Antd>
            }
            {notificationHolder}
            {messageHolder}
        </>
    )
}


export default Footer