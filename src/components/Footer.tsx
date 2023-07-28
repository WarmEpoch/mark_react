import { DeleteOutlined } from "@ant-design/icons";
import { Button, Layout, Space, notification } from "antd";
import { RootState, removeImg, useAppDispatch } from "../export/store";
import { useSelector } from "react-redux";
import { ReactNode, useEffect } from "react";
import DropFilter from "./DropFilter";

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
    const [api, contextHolder] = notification.useNotification();
    // const download = (name: string, url: string | undefined) => {
    //     if(!url) return
    //     const a = document.createElement('a')
    //     a.href = url,
    //     a.download = name
    //     a.click()
    // }
    useEffect(() => {
        if(make){
            api.open({
                message: '导出图片',
                description: '长按图片保存至相册或点击下载文件。',
                placement: 'bottomRight',
                closeIcon: false,
                duration: null,
                key: 'export',
                // btn: (
                //     <Space>
                //       <Button onClick={() => download(`${imgs[index].name}.jpg`, imgs[index].draw)}>
                //         下载当前
                //       </Button>
                //       <Button type="primary" onClick={() => api.destroy('export')}>
                //         下载全部
                //       </Button>
                //     </Space>
                // )
              })
        }else{
            api.destroy()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [make])
    return (
        <>
            { (imgs.length > 0 && !make) && 
                <Footer_Antd onWheel={e => { e.currentTarget.scrollLeft += e.deltaY }}>
                    <Space>
                        <Button onClick={() => dispath(removeImg(index))} danger icon={<DeleteOutlined />} />
                        <DropFilter name="filter" />
                        {children}
                    </Space>
                </Footer_Antd>
            }
            {contextHolder}
        </>
    )
}


export default Footer