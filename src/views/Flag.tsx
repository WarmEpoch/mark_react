import { useAtomValue } from "jotai"
import { Exifr, imgsAtom } from "../export/store"
import Draw from "../components/Draw"
import DropInput from "../components/DropInput"
import DropIcon from "../components/DropIcon"
import { PanelRef, Panel } from "../components/Panel"
import { Toggle } from "../components/Toggle"
import { useRef } from "react"
import { useConfig, useImageArgs } from "../export/hooks"
import { GetIcon } from "../export/icons"

const setting: Exifr[] = ['Model', 'parm']

const configures = {
  border: 5,
  shadow: 0,
  filter: '',
  icon: GetIcon('leica'),
}

export default function Flag() {
  const imgs = useAtomValue(imgsAtom)
  const [args, updateArg] = useImageArgs(imgs, setting)
  const PanelRef = useRef<PanelRef>(null)
  const [config, updateConfig] = useConfig(configures)
  
  return (
    <>
      <Toggle afterChange={current => PanelRef.current?.goTo(current)}>
        {
          args.map(arg => (
            <Draw key={arg.id} img={arg.img} config={config} setting={arg.setting}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column' }}>
                <img src={config.icon} style={{ height: arg.img.width > arg.img.height ? '3.6em' : '3.3em', paddingTop: arg.img.width > arg.img.height ? '1em' : '1.2em' }} />
                <p style={{ fontWeight: 'bold', fontSize: arg.img.width > arg.img.height ? '.86em' : '.82em', lineHeight: arg.img.width > arg.img.height ? '3.6em' : '2.8em' }}>
                  {arg.setting[0]}{arg.setting[1] && arg.setting[0] && ` | `}{arg.setting[1]}
                </p>
              </div>
            </Draw>
          ))
        }
      </Toggle>
      <Panel ref={PanelRef}>
        {
          args.map(arg => (
            <Panel.Item key={arg.id} img={arg.img} config={config} updateConfig={updateConfig}>
              <DropIcon
                value={config.icon}
                onChange={(value) => updateConfig.setIcon(value)}
              />
              {
                arg.setting.map((setting, index) => (
                  <DropInput 
                    key={index} 
                    value={setting} 
                    img={arg.img} 
                    onChange={value => updateArg(arg.id, index, value)}
                  />
                ))
              }
            </Panel.Item>
          ))
        }
      </Panel>
    </>
  )
}