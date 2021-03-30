import { cacheExchange } from "@urql/exchange-graphcache";
import { dedupExchange, fetchExchange } from "urql";
import {
	LoginMutation,
	MeQuery,
	MeDocument,
	RegisterMutation,
	LogoutMutation,
} from "../generated/graphql";
import { typeSafeUpdateQuery } from "./typeSafeUpdateQuery";

export const createUrqlClient = (ssrExchange: any) =>
	({
		url: "http://localhost:5000/graphql",
		fetchOptions: {
			credentials: "include" as const,
		},
		exchanges: [
			dedupExchange,
			cacheExchange({
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
												user: registerQueryResult.register.user
											}
										}
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
			ssrExchange,
			fetchExchange,
		],
	});
