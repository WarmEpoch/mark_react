import { Button, Popover, Slider } from "antd"
import { ReactElement } from "react";

interface Props {
    value: number
    onChange: (value: number) => void
    icon: {
        success: ReactElement
        error: ReactElement
    }
}

function DropSwitch({ value, onChange, icon }: Props) {

    return (
        <Popover content={
            <Slider defaultValue={value} max={10} onChangeComplete={value => {
                onChange(value)
            }} />
        } title>
            <Button size="large" icon={value > 0 ? icon.success : icon.error} />
        </Popover>
    )
}

export default DropSwitch