import { PostFieldError, UserFieldError } from "../generated/graphql";

interface FieldError {
	field: string
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
