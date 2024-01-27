import { useSelector } from "react-redux"
import { RootState } from '../export/store'
import Draw from "../components/Draw";
import Banner from "../components/Banner";
import DropInput from "../components/DropInput";
import DropIcon from "../components/DropIcon";
import Footer from "../components/Footer";

function Xmage() {
  const imgs = useSelector((state: RootState) => state.imgs)
  return (
    <>
      <Banner>
        {
          imgs.map(img =>
            <Draw key={img.id} img={img}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2em 2em'}}>
                <div style={{ display: 'flex', fontSize: '1.2em'}}>
                  <p style={{ fontWeight: 'bold', paddingRight: '.6em'}}>{img.reveals.Make}</p>
                  <p>{img.reveals.Model}</p>
                </div>
                <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'flex-end'}}>
                  <img src={img.reveals.icon} style={{ height: '1.4em'}} />
                  <p style={{ fontSize: '1em'}}>{img.reveals.LensModel}</p>
                </div>
              </div>
            </Draw>
          )
        }
      </Banner>
      <Footer>
        <DropIcon name="icon" />
        <DropInput name="Make" />
        <DropInput name="Model" />
        <DropInput name="LensModel" />
      </Footer>
    </>
  )
}
export default Xmage