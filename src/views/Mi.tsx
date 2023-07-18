import { useSelector } from "react-redux"
import { RootState, removeImg, useAppDispatch } from '../export/store'
import Banner from "../components/Banner"
import Draw from '../components/Draw'
import { Button, Layout } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import DropInput from "../components/DropInput";

const { Footer } = Layout;


function Mi() {
  const imgs = useSelector((state: RootState) => state.imgs)
  const index = useSelector((state: RootState) => state.index)
  const dispath = useAppDispatch()
  return (
    <>
      <Banner>
        {
          imgs.map(img =>
            <Draw key={img.id} img={img} src={img.src} />
          )
        }
      </Banner>
      { imgs.length > 0 && <Footer onWheel={e => {e.currentTarget.scrollLeft += e.deltaY}}>
          <Button onClick={() => dispath(removeImg(index))} danger icon={<DeleteOutlined />} />
          <div>
            <DropInput index={ index } name="Model" />
            <DropInput index={ index } name="Make" />
            <DropInput index={ index } name="LensModel" />
            <DropInput index={ index } name="Iso" />
          </div>
      </Footer>}
    </>
  )
}

export default Mi