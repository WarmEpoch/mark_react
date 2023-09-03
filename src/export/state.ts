export const plusReady = (() => {
    try {
        return !!plus
    } catch {
        return false
    }
})()

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