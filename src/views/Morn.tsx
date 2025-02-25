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

interface StyleProps {
  name: string
  value?: string | number
}

function Style(styleProps: StyleProps) {
  const { name, value } = styleProps
  return (
    <>
      {
        value && 
        <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center'}}>
          <p style={{ border: 'solid .1em #ccc', borderRadius: '.5em', padding: '0 1em', paddingBottom: '.4em'}}>
            { value }
          </p>
          <p>
            {name}
          </p>
        </div>
      }
    </>
  )
}

const setting: Exifr[] = ['Model', 'Exposure', 'Iso', 'Focal', 'Fnumber']

const configures = {
  border: 5,
  shadow: 0,
  filter: '',
  icon: GetIcon('leica'),
}

export default function Morn() {
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontWeight: 'bold', lineHeight: arg.img.width > arg.img.height ? '3.8em' : '3em' }}>{ arg.setting[0] }</p>
                  <div style={{ width: '.1em', height: arg.img.width > arg.img.height ? '2em' : '1.6em', backgroundColor: '#ccc', margin: '0 .5em', marginTop: '.5em' }}></div>
                  <img src={config.icon} style={{ boxSizing: 'border-box', height: arg.img.width > arg.img.height ? '3.4em' : '2.6em', marginTop: '.5em', padding: '.4em 0' }} />
                </div>
                <div style={{ display: 'flex', gap: '1em', padding: '1em 0 2em 0'}}>
                  <Style name="S" value={arg.setting[1]} />
                  <Style name="ISO" value={arg.setting[2]} />
                  <Style name="mm" value={arg.setting[3]} />
                  <Style name="F" value={arg.setting[4]} />
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
