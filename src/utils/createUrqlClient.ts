import { cacheExchange } from "@urql/exchange-graphcache";
import { dedupExchange, Exchange, fetchExchange } from "urql";
import { pipe, tap } from "wonka";
import {
	LoginMutation,
	LogoutMutation,
	MeDocument,
	MeQuery,
	RegisterMutation,
} from "../generated/graphql";
import { typeSafeUpdateQuery } from "./typeSafeUpdateQuery";
import Router from "next/router";
import { cursorPagination } from "./cursorPagination";

// all errors thrown to urql client get pumped into here
const errorExchange: Exchange = ({ forward }) => (ops$) => {
	return pipe(
		forward(ops$),
		tap(({ error }) => {
			if (error?.message.includes("not authenticated")) {
				Router.replace("/login");
			}
		})
	);
};

export const createUrqlClient = (ssrExchange: any) => ({
	url: "http://localhost:5000/graphql",
	fetchOptions: {
		credentials: "include" as const,
	},
	exchanges: [
		dedupExchange,
		cacheExchange({
			keys: {
				PostPagination: () => null,
				UserResponse: () => null,
				UserFieldError: () => null,
			},
			resolvers: {
				Query: {
					posts: cursorPagination(),
				},
			},
			updates: {
				Mutation: {
					login: (result, args, cache, info) => {
						typeSafeUpdateQuery<LoginMutation, MeQuery>(
							cache,
							{ query: MeDocument },
							result,
							(loginQueryResult, cachedMeQuery) => {
								if (
									loginQueryResult.login.errors ||
									!loginQueryResult.login.user?.id
								) {
									return cachedMeQuery;
								} else {
									cachedMeQuery.me.user =
										loginQueryResult.login.user;
									return cachedMeQuery;
								}
							}
						);
					},
					register: (result, args, cache, info) => {
						typeSafeUpdateQuery<RegisterMutation, MeQuery>(
							cache,
							{ query: MeDocument },
							result,
							(registerQueryResult, cachedMeQuery) => {
								if (!cachedMeQuery) {
									return {
										me: {
											user:
												registerQueryResult.register
													.user,
										},
									};
								}
								if (
									registerQueryResult.register.errors ||
									!registerQueryResult.register.user?.id
								) {
									return cachedMeQuery;
								} else {
									cachedMeQuery.me.user =
										registerQueryResult.register.user;
									return cachedMeQuery;
								}
							}
						);
					},
					logout: (result, args, cache, info) => {
						typeSafeUpdateQuery<LogoutMutation, MeQuery>(
							cache,
							{ query: MeDocument },
							result,
							(logoutQueryResult, cachedMeQuery) => {
								if (!logoutQueryResult.logout.success) {
									return cachedMeQuery;
								} else {
									cachedMeQuery.me.user = null;
									return cachedMeQuery;
								}
							}
						);
					},
				},
			},
		}),
		errorExchange,
		ssrExchange,
		fetchExchange,
	],
});
