import * as piexif from 'piexifjs'

export const imgBase64ToExif = (exifr: piexif.IExif, jpegData: string) => {
    try{
        const _exifr: piexif.IExif = JSON.parse(JSON.stringify(exifr))
        _exifr['0th'] && (_exifr['0th'][piexif.TagValues.ImageIFD.Software] = 'Immers Mark')
        _exifr['0th'] && (delete _exifr['0th'][piexif.TagValues.ImageIFD.Orientation])
        const initial = piexif.insert(piexif.dump(_exifr), jpegData)
        return initial
    }catch{
        return jpegData
    }
}

export const imgBase64LoadExif = (jpegData: string) => {
    try {
        return piexif.load(jpegData)
    } catch (error) {
        console.log(error)
        return void 0
    }
}
