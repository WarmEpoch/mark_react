
export const Base64Save = (base64: string, name: string) => {
    const basePath = '_downloads'
    return new Promise<boolean>((resolve, reject) => {
        plus.io.resolveLocalFileSystemURL(basePath, (directory) => {
            directory.getFile(name, {
                create: true,
                exclusive: false,
            }, (entry) => {
                entry.createWriter((writer) => {
                    writer.onwrite = () => {
                        plus.gallery.save(`${basePath}/${name}`, () => {
                            resolve(true)
                            directory.getFile(name, {}, (file) => {
                                file.remove()
                            })
                        })
                    }
                    writer.onerror = () => reject(false)
                    writer.seek(0)
                    writer.writeAsBinary(base64.split(';base64,')[1])
                }, () => reject(false))
            }, () => reject(false))
        }, () => reject(false))
    })
}