import { Dropdown, Input, MenuProps, Upload } from "antd"
import { useSelector } from "react-redux"
import { RootState, RImgModel, upReveal, useAppDispatch, removeFilter, upFilter } from "../export/store";
import filters from "../export/filters";
import type { UploadProps } from 'antd';
import { imgBlobToBase64 } from "../export/image";

interface Props {
    index: number
    name: keyof RImgModel['reveals']
}
function DropFilter(props: Props) {
    const { index, name: key } = props
    const imgs = useSelector((state: RootState) => state.imgs)
    const uploadFilter = useSelector((state: RootState) => state.filter)
    const dispath = useAppDispatch()

    

    const UploadProps: UploadProps = {
        beforeUpload: async file => {
            dispath(upFilter({
                name: file.name.split('.')[0],
                value: await imgBlobToBase64(file)
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
            label: '默认参数',
            type: uploadFilter.length ? 'divider' : 'group',
            children: filters.filter(filter => filter.val !== imgs[index]?.reveals[key]).map(filter => {
                return {
                    key: filter['name'],
                    label: <a onClick={e => {
                        e.preventDefault()
                        dispath(upReveal({
                            index,
                            key,
                            value: filter['val']
                        }))
                    }}>{filter['name']}</a>
                }
            })
        }, ...(uploadFilter.length && [{
            key: 'Reveals',
            label: '自定义滤镜',
            type: 'divider',
            children: uploadFilter.map((filter,_index) => {
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

        <Dropdown.Button menu={{ items }}>
            <Input style={{ minWidth: '6em'}} bordered={false} disabled={key === 'icon' || key === 'filter' ? true : false} key={imgs[index]?.reveals[key]} defaultValue={filters.find(filter => filter['val'] == imgs[index]?.reveals[key])?.name || uploadFilter.find(filter => filter['value'] == imgs[index]?.reveals[key])?.name || '无滤镜'} />
        </Dropdown.Button>
    )
}

export default DropFilter