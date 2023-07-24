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
            <Draw key={img.id} img={img} src={img.src} />
          )
        }
      </Banner>
    </>
  )
}

export default Centre