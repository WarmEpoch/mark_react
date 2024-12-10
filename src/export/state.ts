import { useEffect, useState } from "react"

export const usePlusReady = () => {
    const [state, setState] = useState(false)
    useEffect(() => {
        setState((typeof plus) !== 'undefined')
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