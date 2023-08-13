import { Button, } from "antd"
import { useSelector } from "react-redux"
import { RootState, RImgModel, useAppDispatch, upSetting } from "../export/store";
import { ReactElement } from "react";
import { FileImageOutlined, FileImageFilled, BorderOuterOutlined, BorderInnerOutlined } from '@ant-design/icons';

interface Props {
    name: keyof RImgModel['setting']
}

function DropSwitch(props: Props) {
    const { name: key } = props
    const imgs = useSelector((state: RootState) => state.imgs)
    const index = useSelector((state: RootState) => state.index)
    const dispath = useAppDispatch()

    const Icon: {
        [n in keyof RImgModel['setting']]: {
            'success': ReactElement,
            'error': ReactElement
    }} = {
        'border': {
            'success': <BorderOuterOutlined />,
            'error': <BorderInnerOutlined />
        },
        'shadow': {
            'success': <FileImageFilled />,
            'error': <FileImageOutlined />
        },
    }

    return (
        <Button size="large" icon={imgs[index].setting[key] ? Icon[key]['success'] : Icon[key]['error']} onClick={() => {
            dispath(upSetting({
                index,
                key
            }))
        }} />
    )
}

export default DropSwitch