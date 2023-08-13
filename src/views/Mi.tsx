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
            <Draw key={img.id} img={img}>
              <div style={{ boxSizing: 'border-box', display: 'flex', justifyContent: 'space-between', padding: img.width > img.height ? '1.2em 2em' : '1.1em 2em' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexFlow: 'column wrap' }}>
                  <p style={{ fontWeight: 'bold', fontSize: img.width > img.height ? '.86em' : '.82em' }}>{img.reveals.h1}</p>
                  <p style={{ fontSize: '.69em', color: '#818185' }}>{img.reveals.h3}</p>
                </div>
                <div style={{ display: 'flex', flexFlow: 'column wrap', justifyContent: 'center', position: 'relative', minHeight: '2.3em' }}>
                  <img src={img.reveals.icon} style={{ borderRight: `solid .06em #ccc`, height: 'calc(100% - .5em)', position: 'absolute', top: '.5em', left: '0', padding: '0 .5em', boxSizing: 'border-box', transform: 'translateX(calc(-100% - .5em))' }} />
                  <p style={{ fontWeight: 'bold', fontSize: img.width > img.height ? '.84em' : '.78em' }}>{img.reveals.h2}</p>
                  <p style={{ fontSize: '.67em', color: '#7f7f7f' }}>{img.reveals.h4}</p>
                </div>
              </div>
            </Draw>
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