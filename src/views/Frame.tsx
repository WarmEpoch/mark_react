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
            <Draw key={img.id} img={img} src={img.src} />
          )
        }
      </Banner>
      <Footer>
        <DropInput name="h1" />
      </Footer>
    </>
  )
}
export default Frame