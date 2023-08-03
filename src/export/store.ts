import { configureStore, PayloadAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { createSlice } from "@reduxjs/toolkit";
import { IExif } from "piexifjs";
import icons from "./icons";

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
    Focal:        number | undefined
    Time:         string | undefined
    Iso:          number | undefined
    Fnumber:      number | undefined
    Exposure:     string | undefined
    ExposureTime: number | undefined
    Latitude:     number[]
    Longitude:    number[]
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
    icon: string,
    filter: string | undefined
    h1: string | undefined,
    h2: string | undefined,
    h3: string | undefined,
    h4: string | undefined,
  }
  draw?: string | undefined
}

const initialImg: RImgModel[] = []

const imgService = createSlice({
  name: "imgs",
  initialState: initialImg,
  reducers: {
    addImg(state, action: PayloadAction<ImgModel>) {
      action.payload.exifr.locate = `${action.payload.exifr.Latitude.length > 0 ? Math.round(action.payload.exifr.Latitude[0]) + '°' + Math.round(action.payload.exifr.Latitude[1]) + "'" + Math.round(action.payload.exifr.Latitude[2]) + '"' + action.payload.exifr.LatitudeRef + ' ' + Math.round(action.payload.exifr.Longitude[0]) + '°' + Math.round(action.payload.exifr.Longitude[1]) + "'" + Math.round(action.payload.exifr.Longitude[2]) + '"' + action.payload.exifr.LongitudeRef : ''}`
      action.payload.exifr.parm = `${action.payload.exifr.Focal && `${action.payload.exifr.Focal}mm`} ${action.payload.exifr.Fnumber && `f/${action.payload.exifr.Fnumber}`} ${action.payload.exifr.Exposure} ${action.payload.exifr.Iso && `ISO${action.payload.exifr.Iso}`}`
      state.push({...action.payload, ...{
        reveals: {
          icon: icons.find(icon => icon.describe == action.payload.exifr.Make?.toLocaleLowerCase())?.val || icons[0].val,
          filter: void 0,
          h1: action.payload.exifr.Model,
          h2: action.payload.exifr.parm,
          h3: action.payload.exifr.Time,
          h4: action.payload.exifr.locate,
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
      state[_index]['draw'] = value
    },
    upScale(state: RImgModel[], action: PayloadAction<{id: RImgModel['id'], value: number}>){
      const { id, value } = action.payload;
      const _index = state.findIndex(img => img.id == id)
      state[_index]['scale'] = value
    },
  },
});

export const { addImg, removeImg, upReveal, upDraw, upScale } = imgService.actions;

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

export const store = configureStore({
    reducer:{
        imgs: imgService.reducer,
        index: indexService.reducer,
        reveals: revealService.reducer,
        icons: iconService.reducer,
        filter: filterService.reducer,
        make: makeService.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;

export const useAppSelector:TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<RootDispatch>();