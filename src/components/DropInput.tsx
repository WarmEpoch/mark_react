import { Dropdown, Input, MenuProps } from "antd"
import { useSelector } from "react-redux"
import { RootState, ImgModel, updateExifr, useAppDispatch } from "../export/store";
import { useRequest } from "ahooks";

interface Props {
    index: number
    name: keyof ImgModel['exifr']
}
function DropInput(props: Props) {
    const { index, name: key } = props
    const imgs = useSelector((state: RootState) => state.imgs)
    const dispath = useAppDispatch()

    const { run: change } = useRequest(async (value: string) => {
        return Promise.resolve().then(() => {
            dispath(updateExifr({
                index,
                key,
                value
            }))
        })
    }, {
        debounceWait: 1000,
        manual: true,
    })

    console.log(imgs[index] && imgs[index].exifr)
    const items: MenuProps['items'] = imgs[index] && Object.entries(imgs[index].exifr).filter(val => {
        return Array.isArray(val[1]) ? val[1].length > 0 : Boolean(val[1])
    }).map(item => {
        return {
            key: item[0],
            label: <a onClick={e => {
                e.preventDefault()
                dispath(updateExifr({
                    index,
                    key,
                    value: item[1]
                }))
            }}>{item[1]}</a>
        }
    }) || []
    
    
    return (
        <Dropdown.Button menu={{ items }} trigger={['click']}>
            <Input bordered={false} defaultValue={imgs[index]?.exifr[key] as string} key={imgs[index]?.exifr[key] as string} onChange={e => change(e.target.value)} />
        </Dropdown.Button>
    )
}

export default DropInput