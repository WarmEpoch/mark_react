import { useEffect, useState } from "react"

export const usePlusReady = () => {
    const [state, setState] = useState(false)
    useEffect(() => {
        try {
            setState(!!plus)
        } catch {
            setState(false)
        }
    }, [])
    return state
}

export const isPC = (() => {
    const u = navigator.userAgent;
    const Agents = ["Android", "iPhone", "webOS", "BlackBerry", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    let flag = true;
    for (let i = 0; i < Agents.length; i++) {
        if (u.indexOf(Agents[i]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
})()