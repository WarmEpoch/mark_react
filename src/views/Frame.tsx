import { useSelector } from "react-redux"
import { RootState, removeImg, useAppDispatch } from '../export/store'
import Draw from "../components/Draw"
import Banner from "../components/Banner"
import { Button, Layout, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import DropFilter from "../components/DropFilter";
import DropInput from "../components/DropInput";
const { Footer } = Layout;
function Frame() {
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
          <Space>
            <Button onClick={() => dispath(removeImg(index))} danger icon={<DeleteOutlined />} />
            <DropFilter index={ index } name="filter" />
            <DropInput index={ index } name="h1" />
          </Space>
      </Footer>}
    </>
  )
}
export default Frame