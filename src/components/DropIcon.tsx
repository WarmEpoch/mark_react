import { Dropdown, Input, MenuProps, Upload, message } from "antd"
import { useSelector } from "react-redux"
import { RootState, RImgModel, upReveal, useAppDispatch, upIcons, removeIcons } from "../export/store";
import { defaultIcons, cameraIcons} from "../export/icons";
import type { UploadProps } from 'antd';
import { imgBlobToBase64 } from "../export/image";

interface Props {
    name: keyof RImgModel['reveals']
}
function DropIcon(props: Props) {
    const { name: key } = props
    const imgs = useSelector((state: RootState) => state.imgs)
    const index = useSelector((state: RootState) => state.index)
    const uploadIcons = useSelector((state: RootState) => state.icons)
    const dispath = useAppDispatch()
    const [messageApi, contextHolder] = message.useMessage();

    const UploadProps: UploadProps = {
        beforeUpload: async file => {
            const name = file.name.split('.')[0]
            const value = await imgBlobToBase64(file)
            const _index = uploadIcons.findIndex(icon => icon.name == name || icon.value == value)
            if (_index >= 0) {
              messageApi.warning('该标志已上传')
              return false;
            }
            dispath(upIcons({
                name,
                value
            }))
            return false
        },
        accept: 'image/svg+xml, image/png, image/jpeg',
        maxCount: 1,
        showUploadList: false,
    }

    const items: MenuProps['items'] = (() => {
        return [{
            key: 'Upload',
            label: <Upload {...UploadProps}>上传</Upload>
        }, {
            key: 'Default',
            label: '默认标志',
            type: 'divider',
            children: defaultIcons.map(icon => {
                return {
                    key: icon['name'],
                    label: <a onClick={e => {
                        e.preventDefault()
                        dispath(upReveal({
                            index,
                            key,
                            value: icon['val']
                        }))
                    }}>{icon['name']}</a>,
                    disabled: icon['val'] === imgs[index]?.reveals[key]
                }
            })
        }, {
            key: 'Camera',
            label: '相机标志',
            type: 'divider',
            children: cameraIcons.map(icon => {
                return {
                    key: icon['name'],
                    label: <a onClick={e => {
                        e.preventDefault()
                        dispath(upReveal({
                            index,
                            key,
                            value: icon['val']
                        }))
                    }}>{icon['name']}</a>,
                    disabled: icon['val'] === imgs[index]?.reveals[key]
                }
            })
        }, ...(uploadIcons.length && [{
            key: 'Reveals',
            label: '自定义标志',
            type: 'divider',
            children: uploadIcons.map((icon,_index) => {
                return {
                    key: icon['name'],
                    label: <a style={{ color: icon['value'] === imgs[index]?.reveals[key] ? 'red' : 'inherit' }} onClick={e => {
                        e.preventDefault()
                        if (icon['value'] === imgs[index]?.reveals[key]) {
                            dispath(removeIcons(_index))
                        } else {
                            dispath(upReveal({
                                index,
                                key,
                                value: icon['value']
                            }))
                        }
                    }}>{icon['name']}</a>
                }
            })
        }] || [])]
    })()

    return (
        <>
            <Dropdown.Button menu={{ items }}>
                <Input style={{ minWidth: '4em' }} variant="borderless" disabled={true} key={imgs[index]?.reveals[key]} defaultValue={defaultIcons.find(icon => icon['val'] == imgs[index]?.reveals[key])?.name || cameraIcons.find(icon => icon['val'] == imgs[index]?.reveals[key])?.name || uploadIcons.find(icon => icon['value'] == imgs[index]?.reveals[key])?.name || '错误'} />
            </Dropdown.Button>
            {contextHolder}
        </>
    )
}

export default DropIcon