interface Icons {
    name: string
    val: string
    describe?: string
}
const _defaultIcons: Icons[] = [
    {
        name: '沐享',
        val: 'logo',
    },
    {
        name: '大疆',
        val: 'dji',
    },
    {
        name: 'FotorGear',
        val: 'fotorgear',
    },
]

const _cameraIcons: Icons[] = [
    {
        name: '徕卡',
        val: 'leica',
    },
    {
        name: '哈苏',
        val: 'hasselblad',
    },
    {
        name: '阿莱',
        val: 'arri',
    },
    {
        name: '蔡司',
        val: 'zeiss',
    },
    {
        name: '富士',
        val: 'fujifilm',
    },
    {
        name: '索尼',
        val: 'sony',
    },
    {
        name: '佳能',
        val: 'canon',
    },
    {
        name: '尼康',
        val: 'nikon',
        describe: "NIKON CORPORATION"
    },
    {
        name: '宾得',
        val: 'pentax',
    },
    {
        name: '苹果',
        val: 'apple',
    },
    {
        name: '金尼康',
        val: 'nikons',
    },
    {
        name: '奥林巴斯',
        val: 'olympus',
    },
    {
        name: 'SIGMA',
        val: 'sigma',
    },
    {
        name: 'RICOH',
        val: 'ricoh',
    },
    {
        name: 'Lumix',
        val: 'lumix',
    },
    {
        name: 'TAMRON',
        val: 'tamron',
    },
]

const Icons = (icons: Icons[]) => icons.map(icon => {
    return {
        name: icon['name'],
        describe: (icon['describe'] || icon['val']).toLocaleLowerCase(),
        val: `//web.immers.icu/assets/icon/${icon['val']}.svg`,
    }
})

export const defaultIcons = Icons(_defaultIcons)
export const cameraIcons = Icons(_cameraIcons)