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

const setting: Exifr[] = ['Model']

const configures = {
  border: 0,
  shadow: 0,
  filter: '',
  icon: GetIcon('leica'),
}

const options = ['巳巳如意 生生不息']
const bottom = '//web.immers.cn/assets/bottom/sishe.png'

export default function Si() {
  const imgs = useAtomValue(imgsAtom)
  const [args, updateArg] = useImageArgs(imgs, setting, options)
  const PanelRef = useRef<PanelRef>(null)
  const [config, updateConfig] = useConfig(configures)
  
  return (
    <>
      <Toggle afterChange={current => PanelRef.current?.goTo(current)}>
        {
          args.map(arg => (
            <Draw key={arg.id} img={arg.img} config={config} setting={arg.setting} fillColor="#901410">
              <div style={{ color: '#ecd69c', boxSizing: 'border-box', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: arg.img.width > arg.img.height ? '1.2em 2em' : '1.1em 2em', backgroundImage: `url('${bottom}')`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexFlow: 'column wrap' }}><p style={{ fontWeight: 'bold', fontSize: arg.img.width > arg.img.height ? '1.14em' : '1.1em' }}>{arg.setting[0]}</p></div>
                <div style={{ display: 'flex', flexFlow: 'column wrap', justifyContent: 'center', position: 'relative', height: '2.3em', lineHeight: '2.3em' }}><img src={config.icon} style={{ height: 'calc(100% - .5em)', position: 'absolute', top: '.6em', left: '0', padding: '0 .5em', boxSizing: 'border-box', transform: 'translateX(calc(-100% - .5em))' }} /><p style={{ fontWeight: 'bold', fontSize: arg.img.width > arg.img.height ? '1.26em' : '1.2em' }}>{arg.setting[1]}</p></div>
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
