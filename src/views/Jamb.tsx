import { useSelector } from "react-redux"
import { RootState } from '../export/store'
import Draw from "../components/Draw"
import Banner from "../components/Banner"
import DropInput from "../components/DropInput"
import Footer from "../components/Footer"

function Jamb() {
  const imgs = useSelector((state: RootState) => state.imgs)
  return (
    <>
      <Banner>
        {
          imgs.map(img =>
            <Draw key={img.id} img={img} border={3}>
              <div style={{ boxSizing: 'border-box', display: 'flex', justifyContent: 'center', padding: img.width > img.height ? '1em 0' : '1em 0' }}>
                <p style={{ fontWeight: '500', fontSize: img.width > img.height ? '.86em' : '.82em', lineHeight: img.width > img.height ? '2.2em' : '1.9em' }}>{img.reveals.Model}</p>
              </div>
            </Draw>
          )
        }
      </Banner>
      <Footer>
        <DropInput name="Model" />
      </Footer>
    </>
  )
}
export default Jamb