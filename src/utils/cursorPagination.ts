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

    const isInCache = cache.resolve(entityKey, `${fieldName}(${stringifyVariables(fieldArgs)})`)
    info.partial = !isInCache

    const results: string[] = [];
		fieldInfos.forEach((fi) => {
			const data = cache.resolve(entityKey, fi.fieldKey) as string[];
			results.push(...data);
		});

		return results;
	};
};
 