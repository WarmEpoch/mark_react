import {
    useLocation,
} from "react-router-dom";
import { RImgModel } from "../export/store"

interface Props {
    img: RImgModel
}

function Stencil(props: Props) {
    const { img } = props
    const { pathname: name } = useLocation()
    switch (name) {
        case '/mi':
            return (
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
            )
        case '/flag':
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column' }}>
                    <img src={img.reveals.icon} style={{ height: img.width > img.height ? '3.6em' : '3.3em', paddingTop: img.width > img.height ? '1em' : '1.2em' }} />
                    <p style={{ fontWeight: 'bold', fontSize: img.width > img.height ? '.86em' : '.82em', lineHeight: img.width > img.height ? '3.6em' : '2.8em' }}>{img.reveals.h1}</p>
                </div>
            )
        case '/frame':
            return (
                <div style={{ boxSizing: 'border-box', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '1em 2em' }}>
                    <p style={{ fontWeight: 'bold', fontSize: img.width > img.height ? '.98em' : '.9em', lineHeight: img.width > img.height ? '2.2em' : '1.9em' }}>{img.reveals.h1}</p>
                </div>
            )
        case '/gins':
            return (
                <div style={{ boxSizing: 'border-box', display: 'flex', alignItems: 'center', flexFlow: 'column', padding: img.width > img.height ? '1em 0' : '1em 0' }}>
                    <p style={{ fontWeight: '500', fontSize: img.width > img.height ? '.86em' : '.82em', lineHeight: img.width > img.height ? '2.2em' : '1.9em' }}>Shot on <span style={{ fontSize: img.width > img.height ? '1.1em' : '1.08em', fontWeight: 'bolder' }}>{img.reveals.h1}</span></p>
                    <p style={{ fontWeight: '500', fontSize: img.width > img.height ? '.76em' : '.73em', lineHeight: img.width > img.height ? '2.2em' : '1.9em' }}>{img.reveals.h2}</p>
                </div>
            )
        case '/jamb':
            return (
                <div style={{ boxSizing: 'border-box', display: 'flex', justifyContent: 'center', padding: img.width > img.height ? '1em 0' : '1em 0' }}>
                    <p style={{ fontWeight: '500', fontSize: img.width > img.height ? '.86em' : '.82em', lineHeight: img.width > img.height ? '2.2em' : '1.9em' }}>{img.reveals.h1}</p>
                </div>
            )
        case '/centre':
            return (
                <div style={{ boxSizing: 'border-box', display: 'flex', justifyContent: 'center', padding: img.width > img.height ? '1em 0' : '1em 0' }}>
                    <p style={{ fontWeight: '500', fontSize: img.width > img.height ? '.86em' : '.82em', lineHeight: img.width > img.height ? '2.2em' : '1.9em' }}>{img.reveals.h1}</p>
                </div>
            )
        default:
            return (
                <p>{JSON.stringify(img)}</p>
            )
    }
}


export default Stencil