import vivid from '../assets/lut/vivid.png'
import natural from '../assets/lut/natural.png'
import monochrome from '../assets/lut/monochrome.png'
import monochrome_hight_contrast from '../assets/lut/monochrome_hight_contrast.png'
import m1 from '../assets/lut/m1.png'
import m2 from '../assets/lut/m2.png'
// import m3 from '../assets/lut/m3.png'
// import m4 from '../assets/lut/m4.png'
import m5 from '../assets/lut/m5.png'
// import m6 from '../assets/lut/m6.png'

const filters = [
    {
        name: '徕卡经典',
        val: natural,
    },
    {
        name: '徕卡生动',
        val: vivid,
    },
    {
        name: '徕卡单色',
        val: monochrome,
    },
    {
        name: '徕卡单色HC',
        val: monochrome_hight_contrast,
    },
    {
        name: '柯达ek80',
        val: m1,
    },
    {
        name: 'EPR64',
        val: m2,
    },
    // {
    //     name: 'Business400',
    //     val: m3,
    // },
    // {
    //     name: 'Morandi200',
    //     val: m4,
    // },
    {
        name: 'HK200',
        val: m5,
    },
    // {
    //     name: 'Kodachrome64',
    //     val: m6,
    // },
]

export default filters