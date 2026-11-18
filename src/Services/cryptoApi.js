import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const baseUrl = '/api/coingecko';
const rawBaseQuery = fetchBaseQuery({ baseUrl });
let requestQueue = Promise.resolve();
let nextRequestAt = 0;

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const rateLimitedBaseQuery = async (args, api, extraOptions) => {
    let releaseRequest;
    const queuedRequest = new Promise((resolve) => {
        releaseRequest = resolve;
    });
    const previousRequest = requestQueue;
    requestQueue = previousRequest.then(() => queuedRequest);
    await previousRequest;

    try {
        const delay = Math.max(0, nextRequestAt - Date.now());
        if (delay) await wait(delay);

        const result = await rawBaseQuery(args, api, extraOptions);
        const retryAfter = Number(result.meta?.response?.headers.get('Retry-After'));
        const cooldown = Number.isFinite(retryAfter) && retryAfter > 0
            ? retryAfter * 1000
            : 15000;
        nextRequestAt = Date.now() + (result.error?.status === 429 ? cooldown : 2000);

        return result;
    } finally {
        releaseRequest();
    }
};

const timeperiodDays = {
    '3h': 1,
    '24h': 1,
    '7d': 7,
    '30d': 30,
    '3m': 90,
    '1y': 365,
    '3y': 'max',
    '5y': 'max',
};

export const cryptoApi = createApi({
    reducerPath: 'cryptoApi',
    baseQuery: rateLimitedBaseQuery,
    endpoints: (builder) => ({
        getCryptos: builder.query({
            query: () => '/global',
            keepUnusedDataFor: 300,
        }),
        getCoins: builder.query({
            query: (count = 50) => `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${count}&page=1&sparkline=false`,
            keepUnusedDataFor: 300,
        }),
        getExchanges: builder.query({
            query: () => '/exchanges?per_page=100&page=1',
            keepUnusedDataFor: 300,
        }),
        getCryptoDetails: builder.query({
            query: (coinId) => `/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
            keepUnusedDataFor: 300,
            transformResponse: (response) => ({
                data: {
                    coin: {
                        name: response.name,
                        symbol: response.symbol,
                        price: response.market_data?.current_price?.usd,
                        rank: response.market_cap_rank,
                        volume: response.market_data?.total_volume?.usd,
                        marketCap: response.market_data?.market_cap?.usd,
                        allTimeHigh: { price: response.market_data?.ath?.usd },
                        numberOfMarkets: response.tickers?.length,
                        numberOfExchanges: undefined,
                        supply: {
                            confirmed: response.market_data?.max_supply != null,
                            total: response.market_data?.total_supply,
                            circulating: response.market_data?.circulating_supply,
                        },
                        description: response.description?.en || '',
                        links: (response.links?.homepage || [])
                            .filter(Boolean)
                            .map((url, index) => ({
                                name: index === 0 ? 'Official website' : `Website ${index + 1}`,
                                type: 'website',
                                url,
                            })),
                    },
                },
            }),
        }),
        getCryptoHistory: builder.query({
            query: ({ coinId, timeperiod }) => {
                const days = timeperiodDays[timeperiod] || 7;
                return `/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
            },
            keepUnusedDataFor: 300,
            transformResponse: (response) => ({
                data: {
                    history: (response.prices || []).map(([timestamp, price]) => ({
                        timestamp,
                        price,
                    })),
                },
            }),
        }),
    }),
});

export const {
    useGetCryptosQuery,
    useGetCoinsQuery,
    useGetExchangesQuery,
    useGetCryptoDetailsQuery,
    useGetCryptoHistoryQuery,
} = cryptoApi;
