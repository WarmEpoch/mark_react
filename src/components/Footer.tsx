import { DeleteOutlined } from "@ant-design/icons";
import { Button, Layout, Space } from "antd";
import { RootState, removeImg, useAppDispatch } from "../export/store";
import { useSelector } from "react-redux";
import { ReactNode } from "react";
import DropFilter from "./DropFilter";

const { Footer: Footer_Antd } = Layout;
interface Props {
    children: ReactNode
}

function Footer(props: Props) {
    const { children } = props
    const dispath = useAppDispatch()
    const index = useSelector((state: RootState) => state.index)
    return (
        <Footer_Antd onWheel={e => { e.currentTarget.scrollLeft += e.deltaY }}>
            <Space>
                <Button onClick={() => dispath(removeImg(index))} danger icon={<DeleteOutlined />} />
                <DropFilter name="filter" />
                { children }
            </Space>
        </Footer_Antd>
    )
}


export default Footer