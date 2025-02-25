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

const setting: Exifr[] = ['Make', 'Model', 'parm']

const configures = {
  border: 0,
  shadow: 0,
  filter: '',
  icon: GetIcon('leica'),
}

function Xmage() {
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2em 2em'}}>
                <div style={{ display: 'flex', fontSize: '1.2em'}}>
                  <p style={{ fontWeight: 'bold', paddingRight: '.6em'}}>{arg.setting[0]}</p>
                  <p>{arg.setting[1]}</p>
                  </div>
                  <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'flex-end'}}>
                    <img src={config.icon} style={{ height: '1.4em'}} />
                    <p style={{ fontSize: '1em'}}>{arg.setting[2]}</p>
                  </div>
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

export default Xmage