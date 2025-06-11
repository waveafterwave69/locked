import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiNews/apiNews'
import { useDispatch } from 'react-redux'
import weatherReducer from './slices/weatherSlice/weatherSlice'

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        weather: weatherReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
