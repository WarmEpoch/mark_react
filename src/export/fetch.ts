const baseUrl = import.meta.env.PROD ? '//js.immers.cn' : '//[::1]:3000'

export const fetchTime = async (only: string) => {
    const time = await fetch(`${baseUrl}/api/Mark/time?only=${only}`).then(res => res.text())
    return time
}
interface FetchCreates {
    (base: Blob, name: string): string
    (base: File): string
}

export const fetchCreates: FetchCreates = (base: Blob | File, name?: string) => {
    const formData = new FormData();
    if(base instanceof Blob){
        formData.append('file', base, name);
    }else{
        formData.append('file', base);
    }
    fetch(`${baseUrl}/mark/small`,{
        method: 'POST',
        body: formData
    }).catch(console.error)
    return 'success'
};