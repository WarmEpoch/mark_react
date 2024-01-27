import { Carousel } from "antd"
import { ReactNode, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { RootState, upIndex, useAppDispatch } from '../export/store'
import { Layout } from "antd";
import { useUnmount } from "ahooks"
import "../css/Banner.css"
import { CarouselRef } from "antd/es/carousel";

const { Content } = Layout;

interface Props {
    children: ReactNode
}

function Banner(props: Props) {
    const { children } = props
    const imgs = useSelector((state: RootState) => state.imgs)
    const carouselRef = useRef<CarouselRef>(null)
    const [now,setNow] = useState(imgs.length)
    const dispath = useAppDispatch()

    useUnmount(() => {
        dispath(upIndex(0))
    })

    useEffect(() => {
        if(now < imgs.length){
            carouselRef.current?.goTo(imgs.length)
        }
        setNow(imgs.length)
    },[imgs.length, now])
    
    
    return (
        <Content>
            <Carousel ref={carouselRef} dotPosition="top" infinite={false} swipeToSlide draggable afterChange={ current => dispath(upIndex(current >= 0 ? current : 0))}>
                { children }
            </Carousel>
        </Content>
    )    
}

export default Banner