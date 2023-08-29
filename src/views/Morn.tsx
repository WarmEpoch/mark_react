import { useSelector } from "react-redux"
import { RootState } from '../export/store'
import Draw from "../components/Draw";
import Banner from "../components/Banner";
import DropInput from "../components/DropInput";
import DropIcon from "../components/DropIcon";
import Footer from "../components/Footer";


interface StyleProps {
  name: string
  value: string | number | undefined
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

function Morn() {
  const imgs = useSelector((state: RootState) => state.imgs)
  return (
    <>
      <Banner>
        {
          imgs.map(img =>
            <Draw key={img.id} img={img} border={4}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column' }}>
                <div style={{ display: 'flex', position: 'relative' }}>
                  <p style={{ fontWeight: 'bold', fontSize: img.width > img.height ? '1em' : '.9em', lineHeight: img.width > img.height ? '3.8em' : '3em' }}>{ img.reveals.h1 }</p>
                  <img src={img.reveals.icon} style={{ borderLeft: `solid .1em #ccc`, height: 'calc(100% - 1.3em)', position: 'absolute', top: '.9em', right: '0', padding: '0 .5em', boxSizing: 'border-box', transform: 'translateX(calc(100% + .5em))' }} />
                </div>
                <div style={{ display: 'flex', gap: '1em', padding: '1em 0 2em 0'}}>
                  <Style name="S" value={img.reveals.exposure} />
                  <Style name="ISO" value={img.reveals.iso} />
                  <Style name="mm" value={img.reveals.focal} />
                  <Style name="F" value={img.reveals.fnumber} />
                </div>
              </div>
            </Draw>
          )
        }
      </Banner>
      <Footer>
        <DropIcon name="icon" />
        <DropInput name="h1" />
        <DropInput name="exposure" />
        <DropInput name="iso" />
        <DropInput name="focal" />
        <DropInput name="fnumber" />
      </Footer>
    </>
  )
}
export default Morn