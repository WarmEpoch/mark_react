import { useSelector } from "react-redux"
import { RootState } from '../export/store'
import Banner from "../components/Banner"
import Draw from '../components/Draw'
import DropInput from "../components/DropInput";
import DropIcon from "../components/DropIcon";
import Footer from "../components/Footer";

const bottom = {
  vertical: 'https://web.immers.icu/assets/bottom/mi_long_vertical.png',
  horizontal: 'https://web.immers.icu/assets/bottom/mi_long_horizontal.png',
}

function Long() {
  const imgs = useSelector((state: RootState) => state.imgs)
  return (
    <>
      <Banner>
        {
          imgs.map(img =>
            <Draw key={img.id} img={img}>
              <div style={{ color: '#ecd69c', boxSizing: 'border-box', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: img.width > img.height ? '1.2em 2em' : '1.1em 2em', backgroundImage: img.width > img.height ? `url('${bottom.horizontal}')`: `url('${bottom.vertical}')`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexFlow: 'column wrap' }}>
                  <p style={{ fontWeight: 'bold', fontSize: img.width > img.height ? '1.14em' : '1.1em' }}>{img.reveals.Model}</p>
                </div>
                <div style={{ display: 'flex', flexFlow: 'column wrap', justifyContent: 'center', position: 'relative', height: '2.3em', lineHeight: '2.3em' }}>
                  <img src={img.reveals.icon} style={{ borderRight: `solid .06em #6e1b13`, height: 'calc(100% - .5em)', position: 'absolute', top: '.6em', left: '0', padding: '0 .5em', boxSizing: 'border-box', transform: 'translateX(calc(-100% - .5em))' }} />
                  <p style={{ fontWeight: 'bold', fontSize: img.width > img.height ? '1.26em' : '1.2em' }}>{img.reveals.fuk}</p>
                </div>
              </div>
            </Draw>
          )
        }
      </Banner>
      <Footer>
        <DropIcon name="icon" />
        <DropInput name="Model" />
        <DropInput name="fuk" />
      </Footer>
    </>
  )
}

export default Long