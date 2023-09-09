import { configureStore, PayloadAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { createSlice } from "@reduxjs/toolkit";
import { IExif } from "piexifjs";
import { defaultIcons, cameraIcons} from "./icons";

export interface ImgModel {
  id: number
  name: string
  url: string
  src: string
  width: number
  height: number
  scale: number
  maxScale: number
  exifr: {
    Make:         string | undefined
    Model:        string | undefined
    Focal:        string | undefined
    Time:         string | undefined
    Iso:          number | undefined
    Fnumber:      string | undefined
    Exposure:     string | undefined
    LatitudeRef:  string | undefined
    LongitudeRef: string | undefined
    LensModel:    string | undefined
    LensMake:     string | undefined
    parm?:         string | undefined
    locate?:       string | undefined
  },
  exif: IExif,
}

export interface RImgModel extends ImgModel {
  reveals: {
    icon: string
    filter: string | undefined
  } & ImgModel['exifr']
  setting: {
    border: number
    shadow: number
  }
  draw?: string | undefined
}

const initialImg: RImgModel[] = []

const imgService = createSlice({
  name: "imgs",
  initialState: initialImg,
  reducers: {
    addImg(state, action: PayloadAction<ImgModel>) {
      action.payload.exifr.locate = `${action.payload.exifr.LatitudeRef} ${action.payload.exifr.LongitudeRef}`.replace(/undefined/g,'').trim() || void 0
      action.payload.exifr.parm = `${action.payload.exifr.Focal} ${action.payload.exifr.Fnumber} ${action.payload.exifr.Exposure} ${action.payload.exifr.Iso}`.replace(/undefined/g,'').trim()
      state.push({...action.payload, ...{
        reveals: {
          ...action.payload.exifr,
          icon: defaultIcons.find(icon => icon.describe == action.payload.exifr.Make?.toLocaleLowerCase())?.val || cameraIcons.find(icon => icon.describe == action.payload.exifr.Make?.toLocaleLowerCase())?.val || cameraIcons[0].val,
          filter: void 0,
        },
        setting: {
          border: 0,
          shadow: 0
        }
      }});
    },
    removeImg(state, action: PayloadAction<number>){
      state.splice(action.payload,1)
    },
    upReveal<T extends keyof RImgModel["reveals"]>(state: RImgModel[], action: PayloadAction<{ index: number, key: T, value: RImgModel["reveals"][T] }>){
      const { index, key, value } = action.payload;
      state[index].reveals[key] = value
    },
    upDraw(state: RImgModel[], action: PayloadAction<{ id: RImgModel['id'], value: RImgModel["draw"] }>){
      const { id, value } = action.payload;
      const _index = state.findIndex(img => img.id == id)
      state[_index].draw = value
    },
    upScale(state: RImgModel[], action: PayloadAction<{id: RImgModel['id'], value: number}>){
      const { id, value } = action.payload;
      const _index = state.findIndex(img => img.id == id)
      state[_index].scale = value
    },
    upSetting(state: RImgModel[], action: PayloadAction<{ index: number, key: keyof RImgModel['setting'], value: number}>){
      const {index, key, value} = action.payload
      state[index].setting[key] = value
    },
  },
});

export const { addImg, removeImg, upReveal, upDraw, upScale, upSetting } = imgService.actions;

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
    upOnly(_state, action: PayloadAction<string>){
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

export const store = configureStore({
    reducer:{
        imgs: imgService.reducer,
        index: indexService.reducer,
        reveals: revealService.reducer,
        icons: iconService.reducer,
        filter: filterService.reducer,
        make: makeService.reducer,
        only: onlyService.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;

export const useAppSelector:TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<RootDispatch>();