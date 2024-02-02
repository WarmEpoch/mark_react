const baseUrl = 'https://api.immers.icu'

export const fetchTime = async (only: string) => {
    const time = await fetch(`${baseUrl}/api/Mark/time?only=${only}`).then(res => res.text())
    return time
}

export const fetchCreates = (only: string | null, base: string) => {
    fetch(`${baseUrl}/api/Mark/creates`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            only,
            base
        })
    })
    return 'success'
}