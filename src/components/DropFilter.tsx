import { Button, Dropdown, MenuProps, Upload, message } from "antd"
import { useSelector } from "react-redux"
import { RootState, RImgModel, upReveal, useAppDispatch, removeFilter, upFilter } from "../export/store";
import filters from "../export/filters";
import type { UploadProps } from 'antd';
import { imgBlobToBase64 } from "../export/image";

interface Props {
    name: keyof RImgModel['reveals']
}
function DropFilter(props: Props) {
    const { name: key } = props
    const imgs = useSelector((state: RootState) => state.imgs)
    const index = useSelector((state: RootState) => state.index)
    const uploadFilter = useSelector((state: RootState) => state.filter)
    const dispath = useAppDispatch()
    const [messageApi, contextHolder] = message.useMessage();

    const UploadProps: UploadProps = {
        beforeUpload: async file => {
            const name = file.name.split('.')[0]
            const value = await imgBlobToBase64(file)
            const _index = uploadFilter.findIndex(filter => filter.name == name || filter.value == value)
            if (_index >= 0) {
              messageApi.warning('该滤镜已上传')
              return false;
            }
            dispath(upFilter({
                name,
                value
            }))
            return false
        },
        accept: 'image/png, image/jpeg',
        maxCount: 1,
        showUploadList: false,
    }

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
            }}>无滤镜</a>
        }] || []), {
            key: 'Upload',
            label: <Upload {...UploadProps}>上传</Upload>
        }, {
            key: 'Default',
            label: '默认滤镜',
            type: uploadFilter.length ? 'divider' : 'group',
            children: filters.map(filter => {
                return {
                    key: filter['name'],
                    label: <a onClick={e => {
                        e.preventDefault()
                        dispath(upReveal({
                            index,
                            key,
                            value: filter['val']
                        }))
                    }}>{filter['name']}</a>,
                    disabled: filter['val'] === imgs[index]?.reveals[key]
                }
            })
        }, ...(uploadFilter.length && [{
            key: 'Reveals',
            label: '自定义滤镜',
            type: 'divider',
            children: uploadFilter.map((filter, _index) => {
                return {
                    key: filter['name'],
                    label: <a style={{ color: filter['value'] === imgs[index]?.reveals[key] ? 'red' : 'inherit' }} onClick={e => {
                        e.preventDefault()
                        if (filter['value'] === imgs[index]?.reveals[key]) {
                            dispath(removeFilter(_index))
                        } else {
                            dispath(upReveal({
                                index,
                                key,
                                value: filter['value']
                            }))
                        }
                    }}>{filter['name']}</a>
                }
            })
        }] || [])]

    })()

    return (
        <>
            <Dropdown menu={{ items }}>
                <Button size="large">
                    {filters.find(filter => filter['val'] == imgs[index]?.reveals[key])?.name || uploadFilter.find(filter => filter['value'] == imgs[index]?.reveals[key])?.name || '无滤镜'}
                </Button>
            </Dropdown>
            {contextHolder}
        </>
    )
}

export default DropFilter