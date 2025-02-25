import { Button, Divider, Layout, Space } from "antd"; // Input,Popover,message, Image
import { imgsAtom, makeAtom } from "../export/store"; //, removeOnly, upOnly
import { usePlusReady, isPC } from "../export/state";
import { useAtomValue } from "jotai";

const { Footer: Footer_Antd } = Layout;

function Footer() {
    // const dispath = useAppDispatch()
    // const index = useSelector((state: RootState) => state.index)
    // const index = useAtomValue(indexAtom)
    const imgs = useAtomValue(imgsAtom)
    const make = useAtomValue(makeAtom)
    
    // const only = useSelector((state: RootState) => state.only)s
    // const [messageApi, messageHolder] = message.useMessage();
    const plusReady = usePlusReady()


    // const checking = async (only: string, tips = true) => {
    //     if (tips) {
    //         messageApi.open({
    //             key: 'only',
    //             content: '身份验证中！',
    //             type: 'loading',
    //             duration: 0
    //         })
    //     }
    //     const time = await fetchTime(only)
    //     if (Date.now() < +time * 1000) {
    //         if (tips) {
    //             messageApi.open({
    //                 key: 'only',
    //                 content: '开启自定义模式！',
    //                 type: 'success'
    //             })
    //         }
    //         dispath(upOnly(only))
    //         setCheck(true)
    //         return true
    //     } else {
    //         messageApi.open({
    //             key: 'only',
    //             content: time === '0' ? '身份码输入错误！' : '身份码已过期！',
    //             type: time === '0' ? 'error' : 'info'
    //         })
    //         dispath(removeOnly())
    //         return false
    //     }
    // }

    // useMount(() => {
    //     alone && checking(alone, false).then(res => !res && setAlone(''))
    // })

    // const [check, setCheck] = useState(false)
    // const [sing, setSing] = useState('自定义')
    // const [singB, setSingB] = useState(false)
    // useEffect(() => {
    //     if (sing.length <= 0) {
    //         setCheck(false)
    //         dispath(removeOnly())
    //     }
    //     if (singB || check) return
    //     Promise.resolve().then(async () => {
    //         if (sing.length >= 6) {
    //             setSingB(true)
    //             await checking(sing)
    //             setSingB(false)
    //         }
    //     })
    // }, [sing])
    // const [alone, setAlone] = useState(only)
    // const [pop, setPop] = useState(false)
    // const singRef = useRef<InputRef>(null);

    // const areaBottom = plusReady ? plus.webview.currentWebview().getSafeAreaInsets().deviceBottom + 'px' : '0'

    return (
        <Footer_Antd>
            <div onWheel={(e) => {
                e.currentTarget.scrollLeft += e.deltaY;
            }} style={{ overflow: 'auto', margin: 'auto' }}>
                {
                    make ?
                        <Space>
                            Tips：{plusReady ? 'App会自动为您保存到相册！' : `${isPC ? '右键保存，有误请更换浏览器。' : '长按保存，推荐使用夸克浏览器。'}`}
                        </Space>
                    :
                    imgs.length > 0 ?
                        <></>
                        // <Footer_Antd onWheel={e => { e.currentTarget.scrollLeft += e.deltaY }} style={{ paddingBottom: `calc(${areaBottom} + 1rem)` }}>
                        //     <Space>
                        //         {/* <Button size="large" onClick={() => {
                        //             const _index = index > 0 ? index - 1 : 0
                        //             console.log(_index)
                        //             // dispath(upIndex(_index))
                        //             dispath(removeImg(index))
                        //         }} danger icon={<DeleteOutlined />} /> */}
                        //         {/* <DropScale name="scale" /> */}
                        //         {/* <DropFilter name="filter" /> */}
                        //         {/* <DropSwitch name="border" />
                        //         <DropSwitch name="shadow" /> */}
                        //         {/* {children} */}
                        //         {/* {(only || plusReady) &&
                        //             <>
                        //                 {children}
                        //             </>
                        //         } */}
                        //     </Space>
                        // </Footer_Antd>
                        :
                        !plusReady &&

                                <Space split={<Divider type="vertical" />}>
                                    {/* <Popover open={pop} title="💴：7天/4元 15天/7元 30天/9元 永久/98元" trigger="hover" content={
                                    <Image src="https://shp.qpic.cn/collector/1523230910/3522ceeb-3d8f-484b-b86b-5d83c033c4dc/0" width={320} preview={false} />
                                }>
                                    <Input ref={singRef} style={{ width: '4.4em' }} enterKeyHint="done" size='small' placeholder="身份码" maxLength={6} variant="borderless" value={sing} onChange={e => {
                                        setSing(e.target.value)
                                        setAlone(e.target.value)
                                    }} onBlur={() => {
                                        setSing('自定义')
                                        setPop(false)
                                    }} onFocus={() => {
                                        setPop(true)
                                        setSing(alone)
                                    }} onPressEnter={() => singRef.current?.blur()} />
                                </Popover> */}
                                    <Button type="text" target="_blank" size='small' href="https://mp.weixin.qq.com/mp/appmsgalbum?__biz=Mzg3MTgwNzU0NA==&action=getalbum&album_id=2544483400624160768">沐享教程</Button>
                                    <Button type="text" target="_blank" size='small' href="https://mp.weixin.qq.com/mp/appmsgalbum?__biz=Mzg3MTgwNzU0NA==&action=getalbum&album_id=3054840868278583296#wechat_redirect">水印手册</Button>
                                    <Button type="text" target="_blank" size='small' href="https://www.immers.icu/">快捷指令</Button>
                                    <Button type="text" target="_blank" size='small' href="https://www.immers.icu/#call">联系我们</Button>
                                    <Button type="text" target="_blank" size='small' href="https://github.com/WarmEpoch/mark_react">开源代码</Button>
                                    <Button type="text" target="_blank" size='small' href="https://beian.miit.gov.cn">粤ICP备2024312541号-2</Button>
                                </Space>
            }
            {/* {messageHolder} */}
            </div>
       </Footer_Antd>
    )
}


export default Footer