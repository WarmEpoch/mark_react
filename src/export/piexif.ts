import { IExif, TagValues, insert, dump, load } from 'piexifjs'

export const imgBase64ToExif = (exifr: IExif | undefined, jpegData: string) => {
    if(!exifr) return jpegData
    const _exifr = JSON.parse(JSON.stringify(exifr))
    _exifr['0th'] && (_exifr['0th'][TagValues.ImageIFD.Software] = 'Immers Mark')
    _exifr['0th'] && (delete _exifr['0th'][TagValues.ImageIFD.Orientation])
    const initial = insert(dump(_exifr), jpegData)
    return initial
}

export const imgBase64LoadExif = (jpegData: string) => {
    try {
        return load(jpegData)
    } catch (error) {
        console.log(error)
        return void 0
    }
}
