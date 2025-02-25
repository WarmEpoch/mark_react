import { useAtomValue } from "jotai"
import { Exifr, imgsAtom } from "../export/store"
import Draw from "../components/Draw"
import DropInput from "../components/DropInput"
import { PanelRef, Panel } from "../components/Panel"
import { Toggle } from "../components/Toggle"
import { useRef } from "react"
import { useConfig, useImageArgs } from "../export/hooks"

const setting: Exifr[] = ['Model', 'parm']

const configures = {
  border: 4,
  shadow: 0,
  filter: '',
}

export default function Gins() {
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
              <div style={{ boxSizing: 'border-box', display: 'flex', alignItems: 'center', flexFlow: 'column', padding: arg.img.width > arg.img.height ? '1em 0' : '1em 0' }}>
                <p style={{ fontWeight: '500', fontSize: arg.img.width > arg.img.height ? '.86em' : '.82em', lineHeight: arg.img.width > arg.img.height ? '2.2em' : '1.9em' }}>
                  Shot on <span style={{ fontSize: arg.img.width > arg.img.height ? '1.1em' : '1.08em', fontWeight: 'bolder' }}>{arg.setting[0]}</span>
                </p>
                <p style={{ fontWeight: '500', fontSize: arg.img.width > arg.img.height ? '.76em' : '.73em', lineHeight: arg.img.width > arg.img.height ? '2.2em' : '1.9em' }}>
                  {arg.setting[1]}
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