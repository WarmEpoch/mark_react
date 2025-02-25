import Draw from '../components/Draw'
import DropInput from "../components/DropInput";
import { useAtomValue } from "jotai";
import { useConfig, useImageArgs } from "../export/hooks";
import { PanelRef, Panel } from "../components/Panel";
import { useRef } from "react";
import { Exifr, imgsAtom } from "../export/store";
import { Toggle } from "../components/Toggle";
import { GetIcon } from "../export/icons";
import DropIcon from "../components/DropIcon";

const setting: Exifr[] = ['Model', 'parm', 'Time', 'locate']

const configures = {
  border: 0,
  shadow: 0,
  filter: '',
  icon: GetIcon('leica'),
}

export default function Mi() {
  const imgs = useAtomValue(imgsAtom)
  const [args, updateArg] = useImageArgs(imgs, setting)
  const PanelRef = useRef<PanelRef>(null)
  const [config, updateConfig] = useConfig(configures)

  return (
    <>
      <Toggle afterChange={current => PanelRef.current?.goTo(current)}>
        {
          args.map(arg => {
            return <Draw key={arg.id} img={arg.img} config={config} setting={arg.setting}>
              <div style={{ boxSizing: 'border-box', display: 'flex', justifyContent: 'space-between', padding: arg.img.width > arg.img.height ? '1.2em 2em' : '1.1em 2em' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexFlow: 'column wrap' }}>
                <p style={{ fontWeight: 'bold', fontSize: arg.img.width > arg.img.height ? '.86em' : '.82em' }}>{arg.setting[0]}</p>
                <p style={{ fontSize: '.69em', color: '#818185' }}>{arg.setting[2]}</p>
              </div>
              <div style={{ display: 'flex', flexFlow: 'column wrap', justifyContent: 'center', position: 'relative', minHeight: '2.3em' }}>
                <img src={config.icon} style={{ borderRight: `solid .06em #ccc`, height: 'calc(100% - .5em)', position: 'absolute', top: '.5em', left: '0', padding: '0 .5em', boxSizing: 'border-box', transform: 'translateX(calc(-100% - .5em))' }} />
                <p style={{ fontWeight: 'bold', fontSize: arg.img.width > arg.img.height ? '.84em' : '.78em' }}>{arg.setting[1]}</p>
                <p style={{ fontSize: '.67em', color: '#7f7f7f' }}>{arg.setting[3]}</p>
              </div>
            </div>
          </Draw>
          })
        }
      </Toggle>
      <Panel ref={PanelRef}>
        {
          args.map(arg => {
            return <Panel.Item key={arg.id} img={arg.img} config={config} updateConfig={updateConfig}>
              <DropIcon
                  value={config.icon}
                  onChange={(value) => updateConfig.setIcon(value)}
                />
                {
    
                  arg.setting.map((setting, index) => {
                    return <DropInput key={index} value={setting} img={arg.img} onChange={value => updateArg(arg.id, index, value)}/>
                  })
                }
            </Panel.Item>
          })
        }
      </Panel>
    </>
  )
}