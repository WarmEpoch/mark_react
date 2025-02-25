import { useState, useEffect } from 'react'
import { Exifr, ImgModel } from '../export/store'
import { Config } from '../components/Draw'


export type Arg = {
  id: string
  setting: string[]
  img: ImgModel
}

export function useImageArgs(imgs: ImgModel[], setting: Exifr[], options?: string[]) {
  const [args, setArgs] = useState<Arg[]>([])

  useEffect(() => {
    setArgs(prevArgs => {
      const prevArgsMap: Record<string, Arg> = {}
      prevArgs.forEach(arg => prevArgsMap[arg.id] = arg)
      return imgs.map(img => prevArgsMap[img.id]? Object.assign(prevArgsMap[img.id], {img: img}) : {
          id: img.id,
          setting: setting.map(key => img.exifr[key] ?? '').concat(options ?? []),
          img: img,
        }
      )
    })
  }, [imgs, setting, options])

  const updateArg = (id: string, index: number, value: string) => {
    setArgs(prevArgs => {
      return prevArgs.map(arg => 
        arg.id === id 
          ? { ...arg, setting: [...arg.setting.slice(0, index), value, ...arg.setting.slice(index + 1)] }
          : arg
      )
    })
  }

  return [args, updateArg] as const
}


export type UpdateConfig = {
  setFilter: (value: string) => void
  setBorder: (value: number) => void
  setShadow: (value: number) => void
  setIcon: (value: string) => void
}

export function useConfig<T extends Config>(configures: T) {
  const [config, setConfig] = useState<T>(configures)

  const updateConfig: UpdateConfig = {
    setFilter: (value: string) => setConfig(prev => ({...prev, filter: value})),
    setBorder: (value: number) => setConfig(prev => ({...prev, border: value})),
    setShadow: (value: number) => setConfig(prev => ({...prev, shadow: value})),
    setIcon: (value: string) => setConfig(prev => ({...prev, icon: value}))
  }

  return [config, updateConfig] as const
}