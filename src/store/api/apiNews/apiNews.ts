import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'url',
    }),
    tagTypes: ['News'],
    endpoints: (builder) => ({
        getNews: builder.query({
            query: () => `latest-news?apiKey=apikey`,
        }),
    }),
})

export const { useGetNewsQuery } = apiSlice
