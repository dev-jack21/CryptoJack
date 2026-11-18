import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const baseUrl = 'https://api.rss2json.com/v1';

export const cryptoNewsApi = createApi({
    reducerPath: 'cryptoNewsApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getCryptoNews: builder.query({
            query: ({ count = 10 }) =>
                `/api.json?rss_url=https://cointelegraph.com/rss&count=${count}`,
        }),
    }),
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;
