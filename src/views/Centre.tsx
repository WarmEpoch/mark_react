import { useSelector } from "react-redux"
import { RootState } from '../export/store'
import Banner from "../components/Banner"
import Draw from '../components/Draw'


function Centre() {
  const imgs = useSelector((state: RootState) => state.imgs)
  const i = useSelector((state: RootState) => state.index)
  return (
    <>
      <Banner>
        {
          imgs.map(img =>
            <Draw key={img.id} img={img} src={img.src} />
          )
        }
      </Banner>
      {i}
    </>
  )
}

export default Centre