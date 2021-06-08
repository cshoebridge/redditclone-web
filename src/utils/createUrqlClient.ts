import { cacheExchange } from "@urql/exchange-graphcache";
import { dedupExchange, Exchange, fetchExchange } from "urql";
import { pipe, tap } from "wonka";
import {
	CreatePostMutation,
	DeletePostMutationVariables,
	LoginMutation,
	LogoutMutation,
	MeDocument,
	MeQuery,
	Post,
	PostQueryVariables,
	RegisterMutation,
	VoteMutationVariables,
} from "../generated/graphql";
import { typeSafeUpdateQuery } from "./typeSafeUpdateQuery";
import Router from "next/router";
import { cursorPagination } from "./cursorPagination";
import gql from "graphql-tag";
import { directionToNumber } from "./directionToNumber";
import { isServer } from "./isServer";

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

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
	let cookie = ''
	if (isServer()) {
		cookie = ctx.req.headers.cookie
	}
	return {
		url: "http://localhost:5000/graphql",
		fetchOptions: {
			credentials: "include" as const,
			headers: cookie ? {
				cookie,
			} : undefined
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
						createPost: (result, args, cache, info) => {
							const allFields = cache.inspectFields("Query");
							const fieldInfos = allFields.filter(
								(info) => info.fieldName === "posts"
							);
							// each pagination is stored as a seperate field in the cache, so has to be invalidated seperately
							fieldInfos.forEach((fi) => {
								cache.invalidate(
									"Query",
									"posts",
									fi.arguments || {}
								);
							});
						},
						deletePost: (result, args, cache, info) => {
							if((result?.deletePost as string).includes("success")) {
								cache.invalidate({ __typename: "Post", id: (args as DeletePostMutationVariables).id})
							}
						},
						vote: (result, args, cache, info) => {
							const {
								postId,
								direction,
							} = args as VoteMutationVariables;
							const data = cache.readFragment(
								gql`
									fragment _ on Post {
										id
										points
										voteStatus
									}
								`,
								{ id: postId } as any
							);

							if (data) {
								if (data.voteStatus === direction) {
									return;
								}
								const newPoints =
									(data.points as number) +
									(data.voteStatus ? 2 : 1) *
										directionToNumber(direction);
								cache.writeFragment(
									gql`
										fragment __ on Post {
											points
											voteStatus
										}
									`,
									{
										id: postId,
										points: newPoints,
										voteStatus: direction,
									}
								);
							}
						},
					},
				},
			}),
			errorExchange,
			ssrExchange,
			fetchExchange,
		],
	};
};
