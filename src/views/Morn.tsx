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
            <Draw key={img.id} img={img}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontWeight: 'bold', lineHeight: img.width > img.height ? '3.8em' : '3em' }}>{ img.reveals.Model }</p>
                  <div style={{ width: '.1em', height: img.width > img.height ? '2em' : '1.6em', backgroundColor: '#ccc', margin: '0 .5em', marginTop: '.5em' }}></div>
                  <img src={img.reveals.icon} style={{ boxSizing: 'border-box', height: img.width > img.height ? '3.4em' : '2.6em', marginTop: '.5em', padding: '.4em 0' }} />
                </div>
                <div style={{ display: 'flex', gap: '1em', padding: '1em 0 2em 0'}}>
                  <Style name="S" value={img.reveals.Exposure} />
                  <Style name="ISO" value={img.reveals.Iso} />
                  <Style name="mm" value={img.reveals.Focal} />
                  <Style name="F" value={img.reveals.Fnumber} />
                </div>
              </div>
            </Draw>
          )
        }
      </Banner>
      <Footer>
        <DropIcon name="icon" />
        <DropInput name="Model" />
        <DropInput name="Exposure" />
        <DropInput name="Iso" />
        <DropInput name="Focal" />
        <DropInput name="Fnumber" />
      </Footer>
    </>
  )
}
export default Morn