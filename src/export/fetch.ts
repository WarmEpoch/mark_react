const baseUrl = import.meta.env.PROD ? '//js.immers.cn' : '//[::1]:3000'

export const fetchTime = async (only: string) => {
    const time = await fetch(`${baseUrl}/api/Mark/time?only=${only}`).then(res => res.text())
    return time
}

export const fetchCreates = (base: Blob, name: string) => {
    const formData = new FormData();
    formData.append('file', base, name);
    fetch(`${baseUrl}/mark/small`,{
        method: 'POST',
        body: formData
    })
    return 'success'
}