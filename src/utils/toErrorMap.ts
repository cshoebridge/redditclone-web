import { Maybe } from "graphql/jsutils/Maybe";

export interface FieldError {
	field?: Maybe<string>
	message: string
}

export const toErrorMap = (errors: Array<FieldError> ) => {
	const errorMap: Record<string, string> = {};
	errors.forEach(({ field, message }) => {
		if (field) {
			errorMap[field] = message;
		}
	});
	return errorMap;
};
