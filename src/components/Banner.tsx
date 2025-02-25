import { Carousel } from "antd";
import { ReactNode, useEffect, useRef } from "react";
import { Layout } from "antd";
import "../css/Banner.css";
import { CarouselRef } from "antd/es/carousel";
import { currentAtom } from "../export/store";
import { useAtom } from "jotai";

interface Props {
  children: ReactNode;
  length: number;
  beforeChange?: (from: number, to: number) => void;
  afterChange?: (current: number) => void;
}

const { Content } = Layout;

function Banner(props: Props) {
  const { children, length, beforeChange, afterChange } = props;
  const [current, setCurrent] = useAtom(currentAtom);
  const carouselRef = useRef<CarouselRef>(null);
  const now = useRef(current);
  const max = useRef(0);

  useEffect(() => {
    console.log(length, now.current, max.current);
    if (length <= 0) return;
    const timeoutId = setTimeout(() => {
      if (length > max.current) {
        console.log("banner", "0", "去最后");
        carouselRef.current?.goTo(length - 1, false);
      } else if (length <= now.current) {
        console.log("banner", "1", "删除当前，去左边一个");
        carouselRef.current?.goTo(now.current - 1, false);
      } else if (now.current > 0) {
        console.log("banner", "2", "去当前");
        carouselRef.current?.goTo(now.current, false);
      }
      max.current = length;
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [length]);

  // const onBeforeChange = (_from: number, to: number) => {
  //   // console.log(_from, to);
  //   now.current = to;
  // };
  // useEffect(() => {
  //     if(now < imgs.length){
  //         carouselRef.current?.goTo(imgs.length)
  //     }
  //     setNow(imgs.length)
  // },[imgs.length, now])

  // useEffect(() => {
  //     // if(index != carouselRef.current?.getCurrentIndex())
  //     console.log(index, 'index')
  //     carouselRef.current?.goTo(index)
  // }, [index])

  return (
    <Content>
      {length > 0 && (
        <Carousel
          ref={carouselRef}
          dotPosition="top"
          infinite={false}
          swipeToSlide
          draggable
          beforeChange={(from, to) => {
            beforeChange?.(from, to);
          }}
          afterChange={(current) => {
            // if(current != index){
            //     console.log(current, index, 'current')
            //     dispath(upIndex(current >= 0 ? current : 0))
            // }
            // console.log(currentSlide, index, nextSlide,  'current')
            now.current = current;
            setCurrent(current);
            afterChange?.(current);
          }}
        >
          {children}
        </Carousel>
      )}
    </Content>
  );
}

export default Banner;
