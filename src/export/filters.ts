const filters = [
    {
        name: '徕卡经典',
        val: 'natural.png',
    },
    {
        name: '徕卡生动',
        val: 'vivid.png',
    },
    {
        name: '徕卡单色',
        val: 'monochrome.png',
    },
    {
        name: '徕卡单色HC',
        val: 'monochrome_hight_contrast.png',
    },
    {
        name: '柯达ek80',
        val: 'm1.png',
    },
    {
        name: 'EPR64',
        val: 'm2.png',
    },
    {
        name: 'Business400',
        val: 'm3.png',
    },
    {
        name: 'Morandi200',
        val: 'm4.png',
    },
    {
        name: 'HK200',
        val: 'm5.png',
    },
    {
        name: 'Kodachrome64',
        val: 'm6.png',
    },
]

export default filters.map(i => ({
    name: i.name,
    val: `//web.immers.cn/assets/png/lut/${i.val}`
}))