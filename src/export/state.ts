import { useEffect, useState } from "react";

export const usePlusReady = () => {
  const [state, setState] = useState(false);
  useEffect(() => {
    const flag = typeof plus !== "undefined";
    function handlePlusReady() {
      setState(true);
    }
    if (flag) {
      handlePlusReady();
    } else {
      document.addEventListener("plusready", handlePlusReady);
      return () => document.removeEventListener("plusready", handlePlusReady);
    }
  }, []);
  return state;
};

export const isPC = (() => {
  const u = navigator.userAgent;
  const agents = [
    "Android",
    "iPhone",
    "webOS",
    "BlackBerry",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod",
  ];
  
  return !agents.some(agent => u.includes(agent));
})();
