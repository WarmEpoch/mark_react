import { configureStore, PayloadAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { createSlice } from "@reduxjs/toolkit";
import { IExif } from "piexifjs";

export interface ImgModel {
  id: number
  name: string
  url: string
  src: string
  width: number
  height: number
  scale: number
  maxScale: number
  icon: string
  filter: string
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
  },
  exif: IExif,
}

const initialImg: ImgModel[] = []

const imgService = createSlice({
  name: "imgs",
  initialState: initialImg,
  reducers: {
    addImg(state, action: PayloadAction<ImgModel>) {
      state.push(action.payload);
    },
    removeImg(state, action: PayloadAction<number>){
      console.log(action.payload)
      state.splice(action.payload,1)
    },
    updateExifr<T extends keyof ImgModel["exifr"]>(state: ImgModel[], action: PayloadAction<{ index: number, key: T, value: ImgModel["exifr"][T] }>){
      const { index, key, value } = action.payload;
      state[index].exifr[key] = value
    },
  },
});

export const { addImg, removeImg, updateExifr } = imgService.actions;

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


export const store = configureStore({
    reducer:{
        imgs: imgService.reducer,
        index: indexService.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;

export const useAppSelector:TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<RootDispatch>();