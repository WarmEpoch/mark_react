import canvasSize from "canvas-size";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { atomWithImmer } from "jotai-immer";
import { ImageHead } from "blueimp-load-image";

export interface ImgModel {
  id: string
  name: string
  url: string
  src: string
  width: number
  height: number
  scale: number
  maxScale: number
  exifr: {
    Make?:         string
    Model?:        string
    Focal?:        string
    Time?:         string
    Iso?:          string
    Fnumber?:      string
    Exposure?:     string
    LatitudeRef?:  string
    LongitudeRef?: string
    LensModel?:    string
    LensMake?:     string
    parm?:         string
    locate?:       string
  },
  exif?: ImageHead['imageHead'],
}

export type Exifr = keyof ImgModel['exifr']

export const imgsAtom = atomWithImmer<ImgModel[]>([])

export const AddImgAtom = atom(void 0, (_get, set, img: ImgModel) => {
  img.exifr.locate = `${img.exifr.LatitudeRef} ${img.exifr.LongitudeRef}`.replace(/undefined/g,'').trim() || void 0
  img.exifr.parm = `${img.exifr.Focal} ${img.exifr.Fnumber} ${img.exifr.Exposure} ${img.exifr.Iso}`.replace(/undefined/g,'').trim()
  set(imgsAtom, (draft) => {
    draft.push(img)
  })
})

export const UpImgMaxScaleAtom = atom(void 0, (_get, set, id: string, value: number) => {
  set(imgsAtom, (draft) => {
    const img = draft.find(img => img.id === id)
    if(img) {
      img.maxScale = value
      if(img.scale > value) img.scale = value
    }
  })
})

export const RemoveImgAtom = atom(void 0, (_get, set, id: string) => {
  set(imgsAtom, (draft) => {
    return draft.filter(img => img.id !== id)
  })
})


// const initialImg: ImgModel[] = []

// const imgService = createSlice({
//   name: "imgs",
//   initialState: initialImg,
//   reducers: {
//     addImg(state, action: PayloadAction<ImgModel>) {
//       action.payload.exifr.locate = `${action.payload.exifr.LatitudeRef} ${action.payload.exifr.LongitudeRef}`.replace(/undefined/g,'').trim() || void 0
//       action.payload.exifr.parm = `${action.payload.exifr.Focal} ${action.payload.exifr.Fnumber} ${action.payload.exifr.Exposure} ${action.payload.exifr.Iso}`.replace(/undefined/g,'').trim()
//       action.payload.exifr.fuk = '龙行龘龘，前程朤朤'
//       // const _rImgModel = Object.assign(action.payload, {
//       //   reveals: {
//       //     ...action.payload.exifr,
//       //     icon: defaultIcons.find(icon => icon.describe == action.payload.exifr.Make?.toLocaleLowerCase())?.val || cameraIcons.find(icon => icon.describe == action.payload.exifr.Make?.toLocaleLowerCase())?.val || cameraIcons[0].val,
//       //     filter: void 0,
//       //   }
//       // })
//       state.push(action.payload);
//     },
//     removeImg(state, action: PayloadAction<number>){
//       URL.revokeObjectURL(state[action.payload].src)
//       URL.revokeObjectURL(state[action.payload].url)
//       state.splice(action.payload,1)
//     },
//     upScale(state: ImgModel[], action: PayloadAction<{id: ImgModel['id'], value: number}>){
//       const { id, value } = action.payload;
//       const _index = state.findIndex(img => img.id == id)
//       state[_index].scale = value
//     },
//     upMaxScale(state: ImgModel[], action: PayloadAction<{id: ImgModel['id'], value: number}>){
//       const { id, value } = action.payload;
//       const _index = state.findIndex(img => img.id == id)
//       state[_index].maxScale = value
//       state[_index].scale > value && (state[_index].scale = value)
//     },
//     upSetting<T extends keyof ImgModel['setting']>(state: ImgModel[], action: PayloadAction<{ index: number, key: T, value: ImgModel['setting'][T] }>){
//       const {index, key, value} = action.payload
//       state[index].setting[key] = value
//     },
//   },
// });

// export const { addImg, removeImg, upScale, upMaxScale, upSetting } = imgService.actions;

export const currentAtom = atom(0)
// const initialIndex = 0

// const indexService = createSlice({
//   name: "index",
//   initialState: initialIndex,
//   reducers: {
//     upIndex(_state, action: PayloadAction<number>){
//       return action.payload
//     }
//   },
// });

// export const { upIndex } = indexService.actions;

// const initialReveals: string[] = JSON.parse(localStorage.getItem('reveals') || '[]')
export const revealsAtom = atomWithStorage<string[]>('reveals', [])

// const revealService = createSlice({
//   name: "reveals",
//   initialState: initialReveals,
//   reducers: {
//     upReveals(state, action: PayloadAction<string>){
//       state.push(action.payload)
//       localStorage.setItem('reveals',JSON.stringify(state))
//     },
//     removeReveals(state, action: PayloadAction<number>){
//       state.splice(action.payload,1)
//       state.length > 0 ? localStorage.setItem('reveals',JSON.stringify(state)) : localStorage.removeItem('reveals')
//     }
//   },
// });

// export const { upReveals, removeReveals } = revealService.actions;

// const initialIcons: [{name: string,value: string}] = JSON.parse(localStorage.getItem('icons') || '[]')

export const iconsAtom = atomWithStorage<{name: string,value: string}[]>('icons', [])
// const iconService = createSlice({
//   name: "icons",
//   initialState: initialIcons,
//   reducers: {
//     upIcons(state, action: PayloadAction<{name: string, value: string}>) {
//       const { name, value } = action.payload
//       state.push({
//         name,
//         value
//       })
//       localStorage.setItem('icons',JSON.stringify(state))
//     },
//     removeIcons(state, action: PayloadAction<number>){
//       state.splice(action.payload, 1)
//       Object.keys(state).length > 0 ? localStorage.setItem('icons',JSON.stringify(state)) : localStorage.removeItem('icons')
//     }
//   }
// })

// export const { upIcons, removeIcons } = iconService.actions;


// const initialFilter: [{name: string,value: string}] = JSON.parse(localStorage.getItem('filter') || '[]')
export const filterAtom = atomWithStorage<{name: string,value: string}[]>('filter', [])

// const filterService = createSlice({
//   name: "filter",
//   initialState: initialFilter,
//   reducers: {
//     upFilter(state, action: PayloadAction<{name: string, value: string}>) {
//       const { name, value } = action.payload
//       state.push({
//         name,
//         value
//       })
//       localStorage.setItem('filter',JSON.stringify(state))
//     },
//     removeFilter(state, action: PayloadAction<number>){
//       state.splice(action.payload, 1)
//       Object.keys(state).length > 0 ? localStorage.setItem('filter',JSON.stringify(state)) : localStorage.removeItem('filter')
//     }
//   }
// })

// export const { upFilter, removeFilter } = filterService.actions;


export const makeAtom = atom(false)
// const initialMake = false
// const makeService = createSlice({
//   name: "make",
//   initialState: initialMake,
//   reducers: {
//     upMake(state) {
//       return !state
//     },
//   }
// })

// export const { upMake } = makeService.actions;

// const initialOnly = localStorage.getItem('only') || ''

// const onlyService = createSlice({
//   name: "only",
//   initialState: initialOnly,
//   reducers: {
//     upOnly(_state, action: PayloadAction<typeof initialOnly>){
//       localStorage.setItem('only', action.payload)
//       return action.payload
//     },
//     removeOnly(){
//       localStorage.removeItem('only')
//       return ''
//     }
//   },
// });

// export const { upOnly, removeOnly } = onlyService.actions;



const initialCanvasMax = {
  maxArea: 1166400,
  maxHeight: 1080,
  maxWidth: 1080,
  extent: true
}
export type CanvasMaxType = typeof initialCanvasMax
export const canvasMaxAtom = atomWithStorage<CanvasMaxType>('CANVASMAX', initialCanvasMax, {
  getItem: async (key) => {
    const localCanvasMax = localStorage.getItem(key)
    if(localCanvasMax){
      return JSON.parse(localCanvasMax)
    }
    const maxHeight = await canvasSize.maxHeight({
      usePromise: true,
      useWorker: true
    }).then(({height}) => height)
    const maxWidth = await canvasSize.maxWidth({
      usePromise: true,
      useWorker: true
    }).then(({width}) => width)
    const maxArea = await canvasSize.maxArea({
      usePromise: true,
      useWorker: true,
    }).then(({ width, height }) => {
      return { width, height }
    })
    const canvasMax = {
      extent: maxArea.width === maxWidth && maxArea.height === maxHeight,
      maxArea: maxArea.width * maxArea.height,
      maxHeight,
      maxWidth
    }
    localStorage.setItem(key, JSON.stringify(canvasMax))
    return canvasMax
  },
  setItem: async (key, value) => {
    return localStorage.setItem(key, JSON.stringify(value))
  },
  removeItem: async (key) => {
    return localStorage.removeItem(key)
  }
}, {
  getOnInit: true  // 添加这个选项确保在初始化时从storage获取值
})

// export const store = configureStore({
//     reducer:{
//         // imgs: imgService.reducer,
//         // index: indexService.reducer,
//         // reveals: revealService.reducer,
//         // icons: iconService.reducer,
//         // filter: filterService.reducer,
//         // make: makeService.reducer,
//         // only: onlyService.reducer,
//         // canvasMax: canvasMaxService.reducer,
//     }
// })

// export type RootState = ReturnType<typeof store.getState>;
// export type RootDispatch = typeof store.dispatch;

// export const useAppSelector:TypedUseSelectorHook<RootState> = useSelector;
// export const useAppDispatch = () => useDispatch<RootDispatch>();

