import { useSelector } from "react-redux"
import { RootState } from '../export/store'
import Draw from "../components/Draw"
import Banner from "../components/Banner"
function Frame() {
  const imgs = useSelector((state: RootState) => state.imgs)
  return (
    <>
      {
        <Banner>
          {
            imgs.map(img =>
              <Draw key={img.id} img={img} src={img.src} />
            )
          }
        </Banner>
      }
    </>
  )
}
export default Frame