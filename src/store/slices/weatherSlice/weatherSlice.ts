import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios, { AxiosResponse } from 'axios'

interface WeatherData {
    coord: {
        lon: number
        lat: number
    }
    weather: {
        id: number
        main: string
        description: string
        icon: string
    }[]
    base: string
    main: {
        temp: number
        feels_like: number
        temp_min: number
        temp_max: number
        pressure: number
        humidity: number
    }
    visibility: number
    wind: {
        speed: number
        deg: number
    }
    clouds: {
        all: number
    }
    dt: number
    sys: {
        type: number
        id: number
        message: number
        country: string
        sunrise: number
        sunset: number
    }
    timezone: number
    id: number
    name: string
    cod: number
}

interface WeatherState {
    weatherData: WeatherData | null
    loading: boolean
    error: string | null
}

const initialState: WeatherState = {
    weatherData: null,
    loading: false,
    error: null,
}

export const fetchWeather = createAsyncThunk<WeatherData, string>(
    'weather/fetchWeather',
    async (city: string) => {
        const response: AxiosResponse<WeatherData> = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY`
        )
        return response.data
    }
)

const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWeather.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(
                fetchWeather.fulfilled,
                (state, action: PayloadAction<WeatherData>) => {
                    state.loading = false
                    state.weatherData = action.payload
                }
            )
            .addCase(fetchWeather.rejected, (state, action) => {
                state.loading = false
                state.error =
                    action.error.message || 'Failed to fetch weather data'
            })
    },
})

export default weatherSlice.reducer
