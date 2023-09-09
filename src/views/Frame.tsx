import { useSelector } from "react-redux"
import { RootState } from '../export/store'
import Draw from "../components/Draw"
import Banner from "../components/Banner"
import DropInput from "../components/DropInput";
import Footer from "../components/Footer";
function Frame() {
  const imgs = useSelector((state: RootState) => state.imgs)
  return (
    <>
      <Banner>
        {
          imgs.map(img =>
            <Draw key={img.id} img={img}>
              <div style={{ boxSizing: 'border-box', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '1em 2em' }}>
                <p style={{ fontWeight: 'bold', fontSize: img.width > img.height ? '.98em' : '.9em', lineHeight: img.width > img.height ? '2.2em' : '1.9em' }}>{img.reveals.Model}</p>
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
export default Frame