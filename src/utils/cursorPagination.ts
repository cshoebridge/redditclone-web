import { stringifyVariables } from "@urql/core";
import { Variables, NullArray, Resolver } from "@urql/exchange-graphcache";
import { FieldsOnCorrectTypeRule } from "graphql";

export type MergeMode = "before" | "after";

export interface PaginationParams {
	offsetArgument?: string;
	limitArgument?: string;
	mergeMode?: MergeMode;
}

export const cursorPagination = (): Resolver => {
	return (_parent, fieldArgs, cache, info) => {
		const { parentKey: entityKey, fieldName } = info;

		const allFields = cache.inspectFields(entityKey);
		const fieldInfos = allFields.filter(
			(info) => info.fieldName === fieldName
		);
		const size = fieldInfos.length;
		if (size === 0) {
			return undefined;
		}

		const isInCache = cache.resolve(cache.resolve(
			entityKey,
			`${fieldName}(${stringifyVariables(fieldArgs)})`
		) as string, "posts");
		info.partial = !isInCache;
		
		let hasMore = true;
		const results: string[] = [];
		fieldInfos.forEach((fi) => {
			const key = cache.resolve(entityKey, fi.fieldKey) as string;
			const data = cache.resolve(key, 'posts') as string[];
			const _hasMore = cache.resolve(key, "hasMore");
			if (!_hasMore) {
				hasMore = false;
			}
			results.push(...data);
		});

		return {
			__typename: "PostPagination",
			hasMore,
			posts: results
		};
	};
};
