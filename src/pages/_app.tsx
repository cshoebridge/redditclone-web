import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { cacheExchange, Cache, QueryInput } from "@urql/exchange-graphcache";
import React from "react";
import { createClient, dedupExchange, fetchExchange, Provider } from "urql";
import {
	LoginMutation,
	MeDocument,
	MeQuery,
	RegisterMutation,
} from "../generated/graphql";

import theme from "../theme";

function typeSafeUpdateQuery<Result, Query>(
	cache: Cache,
	qi: QueryInput,
	result: any,
	fn: (r: Result, q: Query) => Query
) {
	return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

const client = createClient({
	url: "http://localhost:4040/graphql",
	fetchOptions: {
		credentials: "include",
	},
	exchanges: [
		dedupExchange,
		cacheExchange({
			updates: {
				Mutation: {
					login: (result, args, cache, info) => {
						typeSafeUpdateQuery<LoginMutation, MeQuery>(cache, { query: MeDocument }, result, (_res, data) => {
							if (_res.login.errors || !_res.login.user?.id) {
								return data;
							}
							else {
								data.me.user = _res.login.user;
								return data;
							}
						})
					},
					register: (result, args, cache, info) => {
						typeSafeUpdateQuery<RegisterMutation, MeQuery>(cache, { query: MeDocument }, result, (_res, data) => {
							if (_res.register.errors || !_res.register.user?.id) {
								return data;
							}
							else {
								data.me.user = _res.register.user;
								return data;
							}
						})
					},
				},
			},
		}),
		fetchExchange,
	],
});

function MyApp({ Component, pageProps }: any) {
	return (
		<Provider value={client}>
			<ChakraProvider resetCSS theme={theme}>
				<ColorModeProvider
					options={{
						useSystemColorMode: true,
					}}
				>
					<Component {...pageProps} />
				</ColorModeProvider>
			</ChakraProvider>
		</Provider>
	);
}

export default MyApp;
