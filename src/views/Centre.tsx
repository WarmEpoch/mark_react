import { useSelector } from "react-redux"
import { RootState } from '../export/store'
import Banner from "../components/Banner"
import Draw from '../components/Draw'


function Centre() {
  const imgs = useSelector((state: RootState) => state.imgs)
  return (
    <>
      <Banner>
        {
          imgs.map(img =>
            <Draw key={img.id} img={img}>
              <div style={{ boxSizing: 'border-box', display: 'flex', justifyContent: 'center', padding: img.width > img.height ? '1em 0' : '1em 0' }}>
                <p style={{ fontWeight: '500', fontSize: img.width > img.height ? '.86em' : '.82em', lineHeight: img.width > img.height ? '2.2em' : '1.9em' }}>{img.reveals.h1}</p>
              </div>
            </Draw>
          )
        }
      </Banner>
    </>
  )
}

export default Centre