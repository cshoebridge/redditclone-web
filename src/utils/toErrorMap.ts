export interface FieldError {
	field?: string | null
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
