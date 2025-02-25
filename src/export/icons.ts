interface Icons {
    name: string
    val: string
    describe?: string
}
const _defaultIcons: Icons[] = [
    {
        name: '沐享',
        val: 'immers/logo',
    },
    {
        name: '大疆',
        val: 'icon/dji',
    },
    {
        name: 'FotorGear',
        val: 'icon/fotorgear',
    },
    {
        name: '三星',
        val: 'icon/samsung',
    },
    {
        name: '福到啦',
        val: 'icon/fuk',
    },
]

const _cameraIcons: Icons[] = [
    {
        name: '徕卡',
        val: 'icon/leica',
    },
    {
        name: '哈苏',
        val: 'icon/hasselblad',
    },
    {
        name: '阿莱',
        val: 'icon/arri',
    },
    {
        name: '蔡司',
        val: 'icon/zeiss',
    },
    {
        name: '富士',
        val: 'icon/fujifilm',
    },
    {
        name: '索尼',
        val: 'icon/sony',
    },
    {
        name: '佳能',
        val: 'icon/canon',
    },
    {
        name: '尼康',
        val: 'icon/nikon',
        describe: "NIKON CORPORATION"
    },
    {
        name: '宾得',
        val: 'icon/pentax',
    },
    {
        name: '苹果',
        val: 'icon/apple',
    },
    {
        name: '金尼康',
        val: 'icon/nikons',
    },
    {
        name: '奥林巴斯',
        val: 'icon/olympus',
    },
    {
        name: 'SIGMA',
        val: 'icon/sigma',
    },
    {
        name: 'RICOH',
        val: 'icon/ricoh',
    },
    {
        name: 'Lumix',
        val: 'icon/lumix',
    },
    {
        name: 'TAMRON',
        val: 'icon/tamron',
    },
]

const Icons = (icons: Icons[]) => icons.map(icon => {
    return {
        name: icon['name'],
        describe: (icon['describe'] || icon['val']).toLocaleLowerCase(),
        val: `//web.immers.cn/assets/${icon['val']}.svg`,
    }
})

export type Icon = ReturnType<typeof Icons>


export const defaultIcons = Icons(_defaultIcons)
export const cameraIcons = Icons(_cameraIcons)

export const GetIcon = (make: string) => defaultIcons.find(icon => icon.describe == make.toLocaleLowerCase())?.val || cameraIcons.find(icon => icon.describe == make.toLocaleLowerCase())?.val || cameraIcons[0].val
