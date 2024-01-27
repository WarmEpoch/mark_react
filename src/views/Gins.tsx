import { useSelector } from "react-redux"
import { RootState } from '../export/store'
import Draw from "../components/Draw"
import Banner from "../components/Banner"
import DropInput from "../components/DropInput"
import Footer from "../components/Footer"

const Gins = () => {
  const imgs = useSelector((state: RootState) => state.imgs)
  return (
    <>
      <Banner>
        {
          imgs.map(img =>
            <Draw key={img.id} img={img} border={3}>
              <div style={{ boxSizing: 'border-box', display: 'flex', alignItems: 'center', flexFlow: 'column', padding: img.width > img.height ? '1em 0' : '1em 0' }}>
                <p style={{ fontWeight: '500', fontSize: img.width > img.height ? '.86em' : '.82em', lineHeight: img.width > img.height ? '2.2em' : '1.9em' }}>Shot on <span style={{ fontSize: img.width > img.height ? '1.1em' : '1.08em', fontWeight: 'bolder' }}>{img.reveals.Model}</span></p>
                <p style={{ fontWeight: '500', fontSize: img.width > img.height ? '.76em' : '.73em', lineHeight: img.width > img.height ? '2.2em' : '1.9em' }}>{img.reveals.parm}</p>
              </div>
            </Draw>
          )
        }
      </Banner>
      <Footer>
        <DropInput name="Model" />
        <DropInput name="parm" />
      </Footer>
    </>
  )
}
export default Gins