import { Button, Popover, Slider } from "antd"
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
        <Popover content={
            <Slider defaultValue={imgs[index].setting[key]} max={10} onAfterChange={value => {
                dispath(upSetting({
                    index,
                    key,
                    value
                }))
            }} />
        } title>
            <Button size="large" icon={imgs[index].setting[key] > 0 ? Icon[key]['success'] : Icon[key]['error']} />
        </Popover>
    )
}

export default DropSwitch