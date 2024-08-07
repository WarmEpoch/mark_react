import { useSelector } from "react-redux"
import { RootState } from '../export/store'
import Draw from "../components/Draw";
import Banner from "../components/Banner";
import DropInput from "../components/DropInput";
import DropIcon from "../components/DropIcon";
import Footer from "../components/Footer";

function Flag() {
  const imgs = useSelector((state: RootState) => state.imgs)
  return (
    <>
      <Banner>
        {
          imgs.map(img =>
            <Draw key={img.id} img={img}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column' }}>
                <img src={img.reveals.icon} style={{ height: img.width > img.height ? '3.6em' : '3.3em', paddingTop: img.width > img.height ? '1em' : '1.2em' }} />
                <p style={{ fontWeight: 'bold', fontSize: img.width > img.height ? '.86em' : '.82em', lineHeight: img.width > img.height ? '3.6em' : '2.8em' }}>{img.reveals.Model}{img.reveals.parm && img.reveals.Model && ` | `}{img.reveals.parm}</p>
              </div>
            </Draw>
          )
        }
      </Banner>
      <Footer>
        <DropIcon name="icon" />
        <DropInput name="Model" />
        <DropInput name="parm" />
      </Footer>
    </>
  )
}
export default Flag