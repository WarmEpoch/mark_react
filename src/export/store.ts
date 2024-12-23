import { configureStore, PayloadAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { createSlice } from "@reduxjs/toolkit";
import { IExif } from "piexifjs";
import { defaultIcons, cameraIcons} from "./icons";

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
    fuk?:          string
  },
  exif?: IExif,
  setting: {
    border: number
    shadow: number
    color: string
  }
}

export interface RImgModel extends ImgModel {
  reveals: {
    icon: string
    filter?: string
  } & ImgModel['exifr']
}

const initialImg: RImgModel[] = []

const imgService = createSlice({
  name: "imgs",
  initialState: initialImg,
  reducers: {
    addImg(state, action: PayloadAction<ImgModel>) {
      action.payload.exifr.locate = `${action.payload.exifr.LatitudeRef} ${action.payload.exifr.LongitudeRef}`.replace(/undefined/g,'').trim() || void 0
      action.payload.exifr.parm = `${action.payload.exifr.Focal} ${action.payload.exifr.Fnumber} ${action.payload.exifr.Exposure} ${action.payload.exifr.Iso}`.replace(/undefined/g,'').trim()
      action.payload.exifr.fuk = '龙行龘龘，前程朤朤'
      const _rImgModel = Object.assign(action.payload, {
        reveals: {
          ...action.payload.exifr,
          icon: defaultIcons.find(icon => icon.describe == action.payload.exifr.Make?.toLocaleLowerCase())?.val || cameraIcons.find(icon => icon.describe == action.payload.exifr.Make?.toLocaleLowerCase())?.val || cameraIcons[0].val,
          filter: void 0,
        }
      })
      state.push(_rImgModel);
    },
    removeImg(state, action: PayloadAction<number>){
      state.splice(action.payload,1)
    },
    upReveal<T extends keyof RImgModel["reveals"]>(state: RImgModel[], action: PayloadAction<{ index: number, key: T, value: RImgModel["reveals"][T] }>){
      const { index, key, value } = action.payload;
      state[index].reveals[key] = value
    },
    upScale(state: RImgModel[], action: PayloadAction<{id: RImgModel['id'], value: number}>){
      const { id, value } = action.payload;
      const _index = state.findIndex(img => img.id == id)
      state[_index].scale = value
    },
    upMaxScale(state: RImgModel[], action: PayloadAction<{id: RImgModel['id'], value: number}>){
      const { id, value } = action.payload;
      const _index = state.findIndex(img => img.id == id)
      state[_index].maxScale = value
      state[_index].scale > value && (state[_index].scale = value)
    },
    upSetting(state: RImgModel[], action: PayloadAction<{ index: number, key: keyof RImgModel['setting'], value: never }>){
      const {index, key, value} = action.payload
      state[index].setting[key] = value
    },
  },
});

export const { addImg, removeImg, upReveal, upScale, upMaxScale, upSetting } = imgService.actions;

const initialIndex = 0

const indexService = createSlice({
  name: "index",
  initialState: initialIndex,
  reducers: {
    upIndex(_state, action: PayloadAction<number>){
      return action.payload
    }
  },
});

export const { upIndex } = indexService.actions;

const initialReveals: string[] = JSON.parse(localStorage.getItem('reveals') || '[]')

const revealService = createSlice({
  name: "reveals",
  initialState: initialReveals,
  reducers: {
    upReveals(state, action: PayloadAction<string>){
      state.push(action.payload)
      localStorage.setItem('reveals',JSON.stringify(state))
    },
    removeReveals(state, action: PayloadAction<number>){
      state.splice(action.payload,1)
      state.length > 0 ? localStorage.setItem('reveals',JSON.stringify(state)) : localStorage.removeItem('reveals')
    }
  },
});

export const { upReveals, removeReveals } = revealService.actions;

const initialIcons: [{name: string,value: string}] = JSON.parse(localStorage.getItem('icons') || '[]')

const iconService = createSlice({
  name: "icons",
  initialState: initialIcons,
  reducers: {
    upIcons(state, action: PayloadAction<{name: string, value: string}>) {
      const { name, value } = action.payload
      state.push({
        name,
        value
      })
      localStorage.setItem('icons',JSON.stringify(state))
    },
    removeIcons(state, action: PayloadAction<number>){
      state.splice(action.payload, 1)
      Object.keys(state).length > 0 ? localStorage.setItem('icons',JSON.stringify(state)) : localStorage.removeItem('icons')
    }
  }
})

export const { upIcons, removeIcons } = iconService.actions;


const initialFilter: [{name: string,value: string}] = JSON.parse(localStorage.getItem('filter') || '[]')

const filterService = createSlice({
  name: "filter",
  initialState: initialFilter,
  reducers: {
    upFilter(state, action: PayloadAction<{name: string, value: string}>) {
      const { name, value } = action.payload
      state.push({
        name,
        value
      })
      localStorage.setItem('filter',JSON.stringify(state))
    },
    removeFilter(state, action: PayloadAction<number>){
      state.splice(action.payload, 1)
      Object.keys(state).length > 0 ? localStorage.setItem('filter',JSON.stringify(state)) : localStorage.removeItem('filter')
    }
  }
})

export const { upFilter, removeFilter } = filterService.actions;


const initialMake = false
const makeService = createSlice({
  name: "make",
  initialState: initialMake,
  reducers: {
    upMake(state) {
      return !state
    },
  }
})

export const { upMake } = makeService.actions;

const initialOnly = localStorage.getItem('only') || ''

const onlyService = createSlice({
  name: "only",
  initialState: initialOnly,
  reducers: {
    upOnly(_state, action: PayloadAction<typeof initialOnly>){
      localStorage.setItem('only', action.payload)
      return action.payload
    },
    removeOnly(){
      localStorage.removeItem('only')
      return ''
    }
  },
});

export const { upOnly, removeOnly } = onlyService.actions;

const initialCanvasMax = {
  maxArea: 1166400,
  maxHeight: 1080,
  maxWidth: 1080,
  extent: true
}

export type CanvasMaxType = typeof initialCanvasMax

const canvasMaxService = createSlice({
  name: "canvasMax",
  initialState: initialCanvasMax,
  reducers: {
    setCanvasMax(state, action: PayloadAction<CanvasMaxType>) {
      Object.assign(state, { ...action.payload })
    }
  },
})

export const { setCanvasMax } = canvasMaxService.actions;

export const store = configureStore({
    reducer:{
        imgs: imgService.reducer,
        index: indexService.reducer,
        reveals: revealService.reducer,
        icons: iconService.reducer,
        filter: filterService.reducer,
        make: makeService.reducer,
        only: onlyService.reducer,
        canvasMax: canvasMaxService.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;

export const useAppSelector:TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<RootDispatch>();