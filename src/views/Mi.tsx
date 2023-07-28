import { useSelector } from "react-redux"
import { RootState } from '../export/store'
import Banner from "../components/Banner"
import Draw from '../components/Draw'
import DropInput from "../components/DropInput";
import DropIcon from "../components/DropIcon";
import Footer from "../components/Footer";


function Mi() {
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
        <DropIcon name="icon" />
        <DropInput name="h1" />
        <DropInput name="h2" />
        <DropInput name="h3" />
        <DropInput name="h4" />
      </Footer>
    </>
  )
}

export default Mi