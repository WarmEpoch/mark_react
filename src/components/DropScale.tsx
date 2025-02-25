import { Button, Dropdown, MenuProps } from "antd";

interface Props {
    value: number
    max: number
    onChange: (value: number) => void
}

function DropScale({ value, max, onChange }: Props) {
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
        return scaleItem.map((item) => {
            // if (maxScale < item.value) {
            //     item.value = maxScale
            //     if (scaleItem[i - 1]?.value == maxScale) {
            //         return null
            //     }
            // }
            return {
                key: item.key,
                label: <a onClick={e => {
                    e.preventDefault()
                    onChange(item.value)
                }}>{item.name}</a>,
                disabled: maxScale < item.value || scale == item.value,
                value: item.value
            }
        })
    }

    const GetScaleName = (scale: number) => {
        return scaleItem.find(val => val.value <= scale)?.name ?? '差'
    }
    return <Dropdown menu={{ items: scaleItems(max, value) }}>
        <Button size="large">{ GetScaleName(value) }</Button>
    </Dropdown>
}

export default DropScale