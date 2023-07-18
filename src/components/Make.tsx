import Draw from './Draw'
import { useSelector } from "react-redux"
import { RootState } from '../export/store'
import Banner from './Banner';

function Make() {
    const imgs = useSelector((state: RootState) => state.imgs)
    return (
        <>
            <Banner>
                {
                    imgs.map((img, index) =>
                        <Draw key={img.id} src={img.url} img={img} index={index} make={true} />
                    )
                }
            </Banner>
        </>
    )
}
export default Make